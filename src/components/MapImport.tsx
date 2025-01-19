/**
 * This component is responsible for rendering the mapping table, it displays the data received from API response to table.
 */
import React, { useCallback, useEffect, useState, type ChangeEvent, type ReactElement } from 'react';
import classNames from 'classnames';
import axios, { type AxiosResponse } from 'axios';
import Button, { type ButtonProps } from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { destructObj, getArrayLength, getKeyString, isArrayIncludes, isArrayNotEmpty, isObjectEmpty, isStrNotEmpty, toast } from 'tejas-react/helpers';
import Table, { type TableProps } from 'tejas-react/Table';
import Select, { type SelectProps } from 'tejas-react/Select';
import Checkbox, { type CheckboxProps } from 'tejas-react/Checkbox';
import ironCryptoHeaders from 'iron-crypto-pkg';
import GetImportTableRow from './GetImportTableRow';

interface FooterBtn extends ButtonProps {
	isDisabled?: boolean;
	icon?: string;
	iconPosition?: string;
	label?: string;
	rest?: ButtonProps;
}

interface MapImportFooterBtns {
	back?: FooterBtn;
	cancel?: FooterBtn;
	import?: FooterBtn;
	loadMore?: FooterBtn;
}

interface Classnames {
	footerBtns?: string;
}

interface Attributes {
	footerBtns?: object;
}

interface SessionProps {
	import: () => Promise<SessionProps | object>;
}

interface ResponseData {
	[key: string]: string[];
}

interface Response {
	message: string;
	api_status: number;
	code: number;
	data: ResponseData;
}

interface ImportHeaders {
	Accept?: string;
	Authorization?: string;
	csrfToken?: object;
}

interface DomainAndServerUrl {
	domainName: string;
	SERVER_URL: string;
}

interface RenderItem {
	columnHeader: {
		name: string;
		key: string;
	};
	columnOptions: {
		label: string;
		value: string;
	}[];
}

interface MappingIcons {
	mappedIcon: string;
	unmappedIcon: string;
}

export interface MapImportProps {
	isDev?: boolean;
	importUrl?: string;
	attributes?: Attributes;
	btnsProps?: MapImportFooterBtns;
	checkBoxProps?: CheckboxProps;
	classnames?: Classnames;
	importHeader?: ImportHeaders;
	mappingIcons?: MappingIcons;
	respData?: ResponseData;
	selectProps?: SelectProps;
	tableProps?: TableProps;
	renderElementVal?: object;
	renderItem?: RenderItem[];
	requiredFields?: (string | number)[];
	getDomainAndServerUrl: (isDev: boolean, url?: string) => DomainAndServerUrl;
	handleComponentRender?: (data: string) => void;
	handleSelectedFile?: (file: File | null) => void;
	sessionHeaders?: () => Promise<SessionProps | object>;
}

interface FooterBtnDefLabels {
	back: 'Back';
	cancel: 'Cancel';
	import: 'Import';
	loadMore: 'Load More';
}

interface RowIndices {
	[key: string]: number | string | (string | number)[];
}

interface OnClickConfig {
	back: (e: React.MouseEvent<HTMLButtonElement>) => void;
	cancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
	import: (e: React.MouseEvent<HTMLButtonElement>) => void;
	loadMore: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface FooterBtnDefIcons {
	back: string;
	loadMore: string;
}

interface FooterBtnIds {
	back: 'mapImportBackBtn';
	cancel: 'mapImportCancelBtn';
	import: 'mapImportBtn';
	loadMore: 'mapImportLoadMoreBtn';
}

type BtnType = 'back' | 'cancel' | 'import' | 'loadMore';

interface Data {
	response: Response;
}

// eslint-disable-next-line max-lines-per-function
function MapImport({
	isDev = false,
	importUrl = '',
	attributes = undefined,
	btnsProps = {},
	checkBoxProps = undefined,
	classnames = undefined,
	importHeader = undefined,
	mappingIcons = {
		mappedIcon: 'bi bi-check-circle',
		unmappedIcon: 'bi bi-exclamation-triangle',
	},
	respData = {},
	selectProps = {},
	tableProps = undefined,
	renderElementVal = {},
	renderItem = [],
	requiredFields = [],
	getDomainAndServerUrl,
	handleComponentRender = () => { },
	handleSelectedFile = () => { },
	sessionHeaders = undefined,
}: MapImportProps) {
	// variables
	const incrementRowCount: number = 10;
	const totalRowCount: number = getArrayLength(respData[0]);

	// let manipulatedData: ResponseData = {}; // object to store the manipulated responseData data.
	const controller: AbortController = new AbortController();

	// Destructure
	const {
		domainName,
		SERVER_URL
	}: DomainAndServerUrl = destructObj(getDomainAndServerUrl(isDev, importUrl));

	const {
		responsive: mappingTableResponsiveAt = 'md',
		headings: mappingTableHeadings,
		...restTableProps
	}: TableProps = destructObj(tableProps);

	const {
		id: mappingTableCheckboxId = 'confirm-import-checkbox',
		labelProps: mappingTableCheckboxLabelProps = { label: "Don't Import data in unmapped columns" },
		...restMappingTableCheckboxProps
	}: CheckboxProps = destructObj(checkBoxProps);

	const {
		back: backBtn = {},
		cancel: cancelBtn = {},
		import: importBtn = {},
		loadMore: loadMoreBtn = {},
	}: MapImportFooterBtns = destructObj(btnsProps);

	const {
		footerBtns: universalFooterBtnClass,
	}: Classnames = destructObj(classnames);

	const {
		footerBtns: universalFooterBtnAttr,
	}: Attributes = destructObj(attributes);

	// State initialization.
	const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false);
	const [rowCount, setRowCount] = useState<number>(11);
	const [unmappedRowsCount, setUnmappedRowsCount] = useState<number>();
	const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});
	const [selectedCustomRows, setSelectedCustomRows] = useState<{ [key: string]: string | number }>({});

	/**
	 * Update unmapped rows count whenever selectedOptions changes.
	 */
	useEffect(() => {
		const totalRows: number = getArrayLength(respData[0]) - 1 || 0; // Excluded 0th index
		const mappedRows: number = getArrayLength(Object.keys(selectedOptions));
		setUnmappedRowsCount(totalRows - mappedRows);
	}, [selectedOptions]);

	function handleCustomSelectOnChange(data: string | ChangeEvent<HTMLSelectElement>, colHeaderKey: string): void {
		setSelectedCustomRows((prev) => {
			const newSelectedOptions = { ...prev };

			// Check if returned data is string, if not then it must be event. So extract the value from event.
			const newData = typeof data === 'string' ? data : data.target.value;

			if (newData === '') {
				// If value is empty string that means, user has selected default option(Select) so, the previously selected option should be deleted at that index.
				delete newSelectedOptions[colHeaderKey];
			} else {
				// Add new selected option with row index as key.
				newSelectedOptions[colHeaderKey] = newData;
			}

			return newSelectedOptions;
		});
	}

	function isCustomRowMapped(colHeader: string): boolean {
		return Object.keys(selectedCustomRows).includes(colHeader);
	}

	function renderCustomRows(): ReactElement[] {
		const { mappedIcon: mappedIconClass, unmappedIcon: unmappedIconClass }: MappingIcons = destructObj(mappingIcons);
		const mappedIcon = <i className={classNames('text-success fs-24', mappedIconClass)} />;
		const unmappedIcon = <i className={classNames('text-danger fs-24', unmappedIconClass)} />;

		return (
			renderItem?.map((item: RenderItem, index: number) => {
				const { columnHeader: colheader, columnOptions: options }: RenderItem = destructObj(item);
				const { name, key }: RenderItem['columnHeader'] = destructObj(colheader);
				return (
					<tr key={getKeyString(key, index)}>
						<td>
							{isCustomRowMapped(key) ? mappedIcon : unmappedIcon}
						</td>
						<td>{name}</td>
						<td>---</td>
						<td>
							<Select
								{...selectProps}
								defaultLabel={{ label: 'Select', disabled: false, value: '' }}
								options={options}
								onChange={function handleOnChangeWithoutArrow(data) {
									return handleCustomSelectOnChange(data, key);
								}}
							/>
						</td>
					</tr>
				);
			})
		);
	}

	/**
	 * Function to decide whether to render load more button or not.
	 */
	function isLoadMoreBtnVisible(): boolean {
		return rowCount < totalRowCount;
	}

	/**
	 * Function to  insert or delete newly selected option in selectedOptions object.
	 */
	function handleSelectOnChange(data: string | ChangeEvent<HTMLSelectElement>, index: number): void {
		setSelectedOptions((prev: { [key: number]: string }) => {
			const newSelectedOptions: { [key: number]: string } = { ...prev };

			// Check if returned data is string, if not then it must be event. So extract the value from event.
			const value: string = typeof data === 'string' ? data : data.target.value;

			if (value === '') {
				// If value is empty string that means, user has selected default option(Select) so, the previously selected option should be deleted at that index.
				delete newSelectedOptions[index];
			} else {
				// Add new selected option with row index as key.
				newSelectedOptions[index] = value;
			}

			return newSelectedOptions;
		});
	}

	function isRowMapped(index: number): boolean {
		// Note*: index is used as key for respective properties of selectedOptions object.
		return Object.hasOwn(selectedOptions, index);
	}

	/**
	 * Function to render single table row.
	 */
	const renderImportTableRow = useCallback((colHeader: string | object, index: number): ReactElement | null => {
		if (typeof colHeader === 'object' || index <= 0) return null;

		// Check if the current row is mapped or not.
		const isMapped: boolean = isRowMapped(index);

		return (
			<GetImportTableRow
				isMapped={isMapped}
				colHeader={colHeader}
				key={getKeyString('row', index)}
				index={index}
				mappingIcons={mappingIcons}
				respData={respData}
				selectedOptions={selectedOptions}
				selectProps={selectProps}
				onFieldSelect={handleSelectOnChange}
			/>
		);
	}, [selectedOptions]);

	function isBtnDisabled(btnType: BtnType): boolean {
		return btnType === 'import' ? !isCheckboxChecked : false;
	}

	function getFooterBtnDefIcon(btnType: BtnType): string {
		const footerBtnDefIcons: FooterBtnDefIcons = {
			back: 'bi bi-arrow-left',
			loadMore: 'bi bi-arrow-repeat',
		};

		return footerBtnDefIcons[btnType as keyof FooterBtnDefIcons];
	}

	function getFooterBtnId(btnType: BtnType): string {
		const footerBtnIds: FooterBtnIds = {
			back: 'mapImportBackBtn',
			cancel: 'mapImportCancelBtn',
			import: 'mapImportBtn',
			loadMore: 'mapImportLoadMoreBtn',
		};

		return (footerBtnIds[btnType as keyof FooterBtnIds]);
	}

	function getFooterBtnDefVariant(btnType: BtnType): string {
		if (btnType === 'import' || btnType === 'loadMore') {
			return 'opacity-primary';
		}
		if (btnType === 'back' || btnType === 'cancel') {
			return 'white';
		}
		return 'primary';
	}

	function getFooterBtnDefLabel(btnType: BtnType): string {
		const footerBtnDefLabels: FooterBtnDefLabels = {
			back: 'Back',
			cancel: 'Cancel',
			import: 'Import',
			loadMore: 'Load More',
		};

		return footerBtnDefLabels[btnType as keyof FooterBtnDefLabels];
	}

	/**
	 * Function to reset the 'selectedFile' state in 'ImportCSV' component,
	 * as a result 'localSelectedFile' state in 'FileUpload' component will reset also.
	 */
	function resetSelectedFile(): void {
		handleSelectedFile(null);
	}

	/**
	 * Function to handle the click event for Back and Cancel button.
	 */
	function handleOnclick(event: React.MouseEvent): void {
		const target = event.target as HTMLButtonElement;

		if (!(target instanceof HTMLButtonElement)) return;

		const btnActions: { [key: string]: () => void } = {
			mapImportBackBtn: () => {
				handleComponentRender('fileUpload');
			},
			mapImportCancelBtn: () => {
				handleComponentRender('importCard');
				resetSelectedFile();
			},
		};

		const action = btnActions[target.id];
		if (action) {
			action();
		}
	}

	function isRequiredFieldsSelected(): boolean {
		return requiredFields.every((value) => isArrayIncludes(Object.values(selectedOptions), value));
	}

	function buildImportPayload(): object {
		// Create a mapping object and set url and funnel_uuids.
		const payload: RowIndices = {
			url: respData[0][0],
			...renderElementVal,
			...selectedCustomRows
		};

		// Now adding the selected option's label as keys and their indices(at which row index option is selected) as values.
		Object.entries(selectedOptions).forEach(([index, field]) => { // field is key
			payload[field] = Number(index);
		});
		return payload;
	}

	async function getPayloadRespApi(payload: object, signal: AbortSignal): Promise<AxiosResponse> {
		// Retrieve session headers, either from the provided sessionHeaders function or by calling ironCryptoHeaders.
		const session: SessionProps = await sessionHeaders?.() as SessionProps;
		const newSession: () => Promise<SessionProps | object> = session?.import ?? session ??
			await ironCryptoHeaders(SERVER_URL, domainName, 0);

		const { Accept, Authorization, csrfToken }: ImportHeaders = destructObj(importHeader);

		// Configure the request headers and other settings.
		const config = {
			headers: {
				...{
					Accept,
					Authorization,
					...csrfToken,
					...newSession,
					'Content-Type': 'application/json',
				},
			},
			signal,
			timeout: 1_000_000,
		};

		return axios.post(importUrl, payload, config);
	}

	function handleFileUploadResp(data: Data): void {
		if (isObjectEmpty(data)) {
			return;
		}

		const { message, code, }: Response = destructObj(data?.response);

		if (code === 200) {
			toast.success(message);
			return;
		}
		toast.error(message);
	}

	async function getPayloadResp(payload: object): Promise<void> {
		const { signal }: AbortController = destructObj(controller);
		try {
			const resp: AxiosResponse = await getPayloadRespApi(payload, signal);
			const { data }: AxiosResponse<Data> = destructObj(resp) as AxiosResponse<Data>;
			handleFileUploadResp(data);
		} catch (err) {
			if (err instanceof Error) {
				toast.error(err.message);
			}
			toast.error('Something went wrong. Please try again');
		}
	}

	function handleImportBtnOnClick(): void {
		if (isRequiredFieldsSelected()) {
			handleComponentRender('importCard');
			resetSelectedFile(); // Reset SelectedFile state.
			const payload = buildImportPayload();
			getPayloadResp(payload);
			return;
		}

		toast.error(`Please make sure you have mapped ${requiredFields.join().replace('_', ' ').replace(',', ', ')}`);
	}

	/**
	 * Function to increment setRowCount to render more rows in the mapping table.
	 */
	function handleOnLoadMoreBtnClick(): void {
		setRowCount(rowCount + incrementRowCount);
	}

	function getFooterBtnDefOnClick(btnType: BtnType): React.MouseEventHandler<HTMLButtonElement> {
		const onClickConfig: OnClickConfig = {
			back: handleOnclick,
			cancel: handleOnclick,
			import: handleImportBtnOnClick,
			loadMore: handleOnLoadMoreBtnClick,
		};

		return onClickConfig[btnType as keyof OnClickConfig];
	}

	function renderFooterBtn(footerBtn: FooterBtn, btnType: BtnType): ReactElement {
		const {
			disabled = isBtnDisabled(btnType),
			icon = getFooterBtnDefIcon(btnType),
			iconPosition = 'left',
			id = getFooterBtnId(btnType),
			variant = getFooterBtnDefVariant(btnType),
			className,
			label = getFooterBtnDefLabel(btnType),
			onClick = getFooterBtnDefOnClick(btnType),
			...rest
		}: FooterBtn = destructObj(footerBtn);

		const isIconPresent = isStrNotEmpty(icon);
		const isLeftSideIcon = iconPosition === 'left';
		const isRightSideIcon = iconPosition === 'right';
		const renderIcon = isLeftSideIcon ? (<i className={classNames('me-10 lh-1', icon)} />) : (<i className={classNames('ms-10 lh-1', icon)} />);

		return (
			<Button
				{...rest}
				{...universalFooterBtnAttr}
				disabled={disabled}
				id={id}
				variant={variant}
				className={classNames(universalFooterBtnClass, className, 'fw-bold w-100-sm')}
				onClick={onClick}
			>
				{(isIconPresent && isLeftSideIcon) && renderIcon}
				{label}
				{(isIconPresent && isRightSideIcon) && renderIcon}
			</Button>
		);
	}

	function handleCheckboxOnChange(): void {
		setIsCheckboxChecked(!isCheckboxChecked); // Toggling isCheckboxChecked state.
	}

	return (
		<div className="p-20 mx-auto tjs-animate-fadeup">
			<Table
				{...restTableProps}
				responsive={mappingTableResponsiveAt}
				headings={mappingTableHeadings}
				data={respData[0]?.slice(0, rowCount)} // Passing only no. of rows equal to rowCount - 1(slice)
			>
				<tbody>
					{respData[0]?.slice(0, rowCount).map((colHeader, index) => (
						renderImportTableRow(colHeader, index)
					))}

					{(isArrayNotEmpty(renderItem) && (rowCount >= totalRowCount)) && renderCustomRows()}
				</tbody>

			</Table>

			<div className="border-top p-10 p-sm-15 position-sticky bottom-0 z-99 bg-white">
				<Row>
					<Col lg={6}>
						<div className="d-sm-flex d-grid align-items-center gap-20 flex-wrap mb-lg-0 mb-20">
							{renderFooterBtn(backBtn, 'back')}
							{renderFooterBtn(cancelBtn, 'cancel')}
							{isLoadMoreBtnVisible() && renderFooterBtn(loadMoreBtn, 'loadMore')}
						</div>
					</Col>
					<Col lg={6}>
						<div className="d-lg-flex d-grid justify-content-sm-start justify-content-lg-end align-items-center gap-20 flex-wrap">
							<div>
								<h6 className="mb-5 fs-14">{`You have ${unmappedRowsCount} unmapped columns`}</h6>
								<Checkbox
									{...restMappingTableCheckboxProps}
									id={mappingTableCheckboxId}
									labelProps={mappingTableCheckboxLabelProps}
									onChange={handleCheckboxOnChange}
								/>
							</div>
							{renderFooterBtn(importBtn, 'import')}
						</div>
					</Col>
				</Row>
			</div>
		</div>
	);
}

export default MapImport;
