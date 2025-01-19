/**
 * This component returns a single row for mapping table component.
 */
import { type ReactElement, type ChangeEvent } from 'react';
import classNames from 'classnames';
import { destructObj, getKeyString, isArrayIncludes, isStrNotEmpty } from 'tejas-react/helpers';
import Select, { type SelectProps, type Option } from 'tejas-react/Select';

type Opt = string | number | object | Option;

interface MappingIcons {
	mappedIcon: string;
	unmappedIcon: string;
}

interface ResponseData {
	[key: string]: string[];
}

export interface GetImportTableRowProps {
	isMapped?: boolean;
	colHeader?: string;
	index: number;
	mappingIcons: MappingIcons;
	respData?: ResponseData;
	selectedOptions: object;
	selectProps?: SelectProps;
	onFieldSelect?: (data: ChangeEvent<HTMLSelectElement> | string, index: number) => void;
}

type ArrayIdx = '0' | '1' | '2';

// eslint-disable-next-line max-lines-per-function
function GetImportTableRow({
	isMapped = false,
	colHeader = '',
	index,
	mappingIcons,
	respData = undefined,
	selectedOptions,
	selectProps = undefined,
	onFieldSelect = () => { },
}: GetImportTableRowProps): ReactElement {
	const {
		defaultLabel = { label: 'Select', disabled: false, value: '' },
		options = [],
		...restSelectProps
	}: SelectProps = selectProps as SelectProps;

	const {
		mappedIcon: mappedIconClass = 'bi bi-check-circle',
		unmappedIcon: unmappedIconClass = 'bi bi-exclamation-triangle',
	}: MappingIcons = destructObj(mappingIcons);

	/**
	 * Function to handle the selection of an option from the select field.
	 * It triggers the `onFieldSelect` callback function with the selected data and the index of the row.
	 */
	function handleOnFieldSelect(data: ChangeEvent<HTMLSelectElement> | string): void {
		onFieldSelect(data, index);
	}

	function renderDataFromFile(): ReactElement[] {
		return (
			['1', '2', '3'].map((arrayIdx: string) => (
				<span key={getKeyString('mapped', parseInt(arrayIdx, 10))}>
					{isStrNotEmpty(respData?.[arrayIdx as ArrayIdx]?.[index]) ? respData?.[arrayIdx as ArrayIdx][index] : '--'}
				</span>
			))
		);
	}

	/**
	 * Function to return the options for select component.
	 */
	function getOptionsList(): Option[] {
		return (
			options.map((option: Opt) => {
				if (typeof option === 'object') {
					const { value } = destructObj(option) as Option;
					const isOptionDisabled = (option as Option).disabled;
					const isOptionAlreadySelected = isArrayIncludes(Object.values(selectedOptions), value as string);
					// Check if provided option in options already has disabled property if yes prioritize it.
					return {
						...option,
						disabled: isOptionDisabled ?? isOptionAlreadySelected,
					};
				}
				// If option is not object, it means it could be string or number,
				// So converting option(string | number) to string explicitly, so that we can compare it with values of selectedOptions object.
				return {
					label: String(option),
					value: String(option),
					disabled: isArrayIncludes(Object.values(selectedOptions), String(option)),
				};
			})
		);
	}

	function renderIcon(): ReactElement {
		const mappedIcon = <i className={classNames('text-success fs-24', mappedIconClass)} />;
		const unmappedIcon = <i className={classNames('text-danger fs-24', unmappedIconClass)} />;

		return isMapped ? mappedIcon : unmappedIcon;
	}

	function renderColHeader(): ReactElement {
		return <span>{isStrNotEmpty(colHeader) ? colHeader : '--'}</span>;
	}

	return (
		<tr>
			<td data-label="Matched">
				<span>{renderIcon()}</span>
			</td>
			<td data-label="Column header from file">{renderColHeader()}</td>
			<td data-label="Data from file">
				<div className="d-flex flex-column">
					{renderDataFromFile()}
				</div>
			</td>
			<td data-label="Form fields">
				<Select
					{...restSelectProps}
					defaultLabel={defaultLabel}
					onChange={handleOnFieldSelect}
					options={getOptionsList()}
				/>
			</td>
		</tr>
	);
}

export default GetImportTableRow;
