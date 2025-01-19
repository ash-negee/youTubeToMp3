/**
 * This component is responsible for rendering the FileUploadComponent.
 * It accepts the various props to customize different elements in the component.
 */
import React, { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import classNames from 'classnames';
import axios, { type AxiosProgressEvent, type AxiosResponse } from 'axios';
import { useForm, type FieldValues, type UseFormReturn } from 'react-hook-form';
import Button, { type ButtonProps } from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { destructObj, getArrayLength, isArrayIncludes, isEmpty, isObjectEmpty, isStrEmpty, toast } from 'tejas-react/helpers';
import FileInput, { type FileInputProps } from 'tejas-react/FileInput';
import DangerousHTML from 'tejas-react/DangerousHTML';
import ConfirmPopup, { type ConfirmPopupProps, } from 'tejas-react/ConfirmPopup';
import PopupContainer, { type PopupContainerRef } from 'tejas-react/PopupContainer';
import ironCryptoHeaders from 'iron-crypto-pkg';

interface FooterBtn extends ButtonProps {
	icon?: string;
	label?: string;
}

interface FileUploadFooterBtns {
	back?: FooterBtn;
	next?: FooterBtn;
}

interface Classnames {
	description?: string;
	footerButton?: string;
	footerButtonsWrapper?: string;
	textContent?: string;
	title?: string;
	wrapper?: string;
}

interface Attributes {
	footerButtons?: object;
}

interface SessionProps {
	upload: () => Promise<SessionProps | object>;
}

interface UploadHeaders {
	Accept?: string;
	Authorization?: string;
	csrfToken?: object;
}

interface DomainAndServerUrl {
	domainName: string;
	SERVER_URL: string;
}

export interface FileUploadProps {
	isDev?: boolean;
	renderDesc?: string;
	title?: string;
	uploadUrl?: string;
	attributes?: Attributes;
	btnsProps?: FileUploadFooterBtns;
	classnames?: Classnames;
	confirmPopupProps?: ConfirmPopupProps;
	fileInputProps?: FileInputProps;
	uploadHeader?: UploadHeaders;
	selectedFile?: File | null;
	getDomainAndServerUrl: (isDev: boolean, url?: string) => DomainAndServerUrl;
	handleComponentRender?: (data: string) => void;
	handleImportFile?: (col: ResponseData) => void;
	handleRenderElement?: (data: object) => void;
	handleSelectedFile?: (file: File | null) => void;
	renderElement?: (CSVForm: UseFormReturn<FieldValues, unknown, undefined>) => ReactNode;
	sessionHeaders?: () => Promise<SessionProps | object>;
}

interface ResponseData {
	[key: string]: string[];
}

export interface Response {
	message: string;
	api_status: number;
	code: number;
	data: ResponseData;
}

export interface Data {
	response: Response;
}

interface UploadConfig {
	path: string;
	signal: AbortSignal;
	file: File;
	onUploadProgress: (progressEvent: AxiosProgressEvent) => void;
}

// eslint-disable-next-line max-lines-per-function
function FileUpload({
	isDev = false,
	renderDesc = '',
	title = 'Upload your files',
	uploadUrl = '',
	attributes = undefined,
	btnsProps = undefined,
	classnames = undefined,
	confirmPopupProps = undefined,
	fileInputProps = undefined,
	uploadHeader = undefined,
	selectedFile = undefined,
	getDomainAndServerUrl,
	handleComponentRender = () => { },
	handleImportFile = () => { },
	handleRenderElement = () => { },
	handleSelectedFile = () => { },
	renderElement = undefined,
	sessionHeaders = undefined,
}: FileUploadProps): ReactElement {
	// Variables
	const controller: AbortController = new AbortController();

	// Destructure
	const {
		domainName,
		SERVER_URL
	}: DomainAndServerUrl = destructObj(getDomainAndServerUrl(isDev, uploadUrl));

	const {
		allowedExtensions: fileInputAllowedExtensions = 'csv,xlsx',
		allowedFileTypes: fileInputAllowedFileTypes = 'text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		description: fileInputDescription = 'All .csv and .xlsx file types are supported.',
		variant: fileInputVariant = 'dragAndDrop',
		classnames: fileInputClassnames = { inputBtn: 'fw-bold' },
		inputLabel: fileInputInputLabel = { button: 'Upload File', description: 'Drag and drop or choose a file to upload.' },
		labelProps: fileInputLabelProps = { label: 'Select a file' },
		...restFileInputProps
	}: FileInputProps = destructObj(fileInputProps);

	const {
		back: backBtn,
		next: nextBtn,
	}: FileUploadFooterBtns = destructObj(btnsProps);

	const {
		disabled: isBackBtnDisabled = false,
		icon: backBtnIcon = 'bi bi-arrow-left',
		label: backBtnLabel = 'Back',
		variant: backBtnVariant = 'white',
		className: backBtnClassName,
		...restBackBtnProps
	}: FooterBtn = destructObj(backBtn);

	const {
		disabled: isNextBtnDisabled = false,
		icon: nextBtnIcon = 'bi bi-arrow-right',
		label: nextBtnLabel = 'Next',
		variant: nextBtnVariant = 'opacity-primary',
		className: nextBtnClassName,
		...restNextBtnProps
	}: FooterBtn = destructObj(nextBtn);

	const {
		description: descClass,
		footerButton: universalFooterBtnClass,
		footerButtonsWrapper: btnWrapperClass,
		textContent: textContentClass,
		title: titleClass,
		wrapper: wrapperClass,
	}: Classnames = destructObj(classnames);

	const { footerButtons: universalFooterBtnAttr }: Attributes = destructObj(attributes);

	// State initialization.
	const [isUploadingProgress, setIsUploadingProgress] = useState<boolean>(false);
	const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);
	const [uploadPercentage, setUploadPercentage] = useState<number>(0);
	const [localSelectedFile, setLocalSelectedFile] = useState<File | null>(selectedFile ?? null);

	// Form initialization.
	const CSVForm: UseFormReturn<FieldValues, unknown, undefined> = useForm();

	/**
	 * If file is already selected and present in parent component's state, set isFileUploaded to true.
	 */
	useEffect(() => {
		if (localSelectedFile) {
			setIsFileUploaded(true);
		}
	}, []);

	// Ref initialization.
	const confirmPopupRef = useRef<PopupContainerRef>(null);

	function renderTextContent(): ReactElement {
		return (
			<div className={classNames('text-center mb-15 mb-sm-20', textContentClass)}>
				<h3 className={classNames(titleClass)}>{title}</h3>
				<DangerousHTML
					className={descClass}
					tag="div"
					htmlString={renderDesc}
					sanitizeProps={{ ADD_ATTR: ['target'] }}
				/>
			</div>
		);
	}

	function getFileExtension(fileName: string = ''): string {
		if (isStrEmpty(fileName)) {
			return fileName;
		}
		return fileName.split('.').pop()?.toLowerCase() ?? '';
	}

	function isFileExtensionValid(extension: string): boolean {
		if (isStrEmpty(extension)) {
			return false;
		}
		return isArrayIncludes(['xlsx', 'csv'], extension);
	}

	async function upload(uploadConfig: UploadConfig): Promise<AxiosResponse> {
		const {
			path,
			file,
			signal,
			onUploadProgress,
		}: UploadConfig = destructObj(uploadConfig);

		const formData = new FormData();
		formData.append('file', file);

		// Retrieve session headers, either from the provided sessionHeaders function or by calling ironCryptoHeaders.
		const session: SessionProps = await sessionHeaders?.() as SessionProps;
		const newSession: () => Promise<SessionProps | object> = session.upload ?? session ??
			await ironCryptoHeaders(SERVER_URL, domainName, 0);

		const { Accept, Authorization, csrfToken }: UploadHeaders = destructObj(uploadHeader);

		// Configure the request headers and other settings.
		const config = {
			headers: {
				...{
					Accept,
					Authorization,
					...newSession,
					...csrfToken,
					'Content-Type': 'multipart/form-data',
				},
			},
			// Set the upload progress-callback, abort-signal and timeout.
			onUploadProgress,
			signal,
			timeout: 1_000_000,
		};

		return axios.post(path, formData, config);
	}

	async function getResp(fileData: File): Promise<AxiosResponse> {
		const { signal }: AbortController = destructObj(controller);

		const uploadConfig = {
			file: fileData,
			path: uploadUrl,
			onUploadProgress: (progressEvent: AxiosProgressEvent) => {
				const { loaded, total }: AxiosProgressEvent = destructObj(progressEvent);
				const percentCompleted: number = total ? Math.round((loaded * 100) / total) : 0;
				setUploadPercentage(percentCompleted);
			},
			signal,
		};

		return upload(uploadConfig);
	}

	function handleResp(data: Data): void {
		if (isObjectEmpty(data)) {
			setIsUploadingProgress(false);
			return;
		}

		const { message, code, data: respData }: Response = destructObj(data?.response);

		if (code === 200) {
			setIsFileUploaded(true);
			setIsUploadingProgress(false);
			handleImportFile(respData); // Sending respData to ImportCSV component.
			toast.success(message);
			return;
		}

		toast.error(message);
		setLocalSelectedFile(null);
		setIsUploadingProgress(false);
	}

	async function getFileUploadRespApi(fileData: File): Promise<void> {
		if (fileData) {
			setIsUploadingProgress(true);
			try {
				const resp: AxiosResponse = await getResp(fileData);
				const { data }: AxiosResponse<Data> = destructObj(resp) as AxiosResponse<Data>;
				handleResp(data);
			} catch (err) {
				setIsUploadingProgress(false);
				setLocalSelectedFile(null);
				if (err instanceof Error) {
					toast.error(err.message);
				}
				toast.error('Something went wrong. Please try again');
			}
			return;
		}
		toast.error('Chose a file to upload');
	}

	/**
	 * Function to remove selected file and reset states.
	 */
	function onFileRemove(): void {
		setLocalSelectedFile(null);
		setIsFileUploaded(false);
	}

	/**
	 * Function to reset the file upload states and remove the file.
	 * */
	function resetFileSates(): void {
		setUploadPercentage(0);
		setIsUploadingProgress(false);
		onFileRemove();
	}

	/**
	 * Function to get the file and store it in local state.
	 */
	function getFileUploadResp(file?: File[]): void {
		if (getArrayLength(file) <= 0 || file === undefined) {
			resetFileSates();
			return;
		}
		const fileData: File = file?.[0];

		const fileExtension: string = getFileExtension(fileData?.name);

		if (isFileExtensionValid(fileExtension)) {
			setLocalSelectedFile(fileData);
			handleSelectedFile(fileData);
			getFileUploadRespApi(fileData);
			return;
		}

		toast.error('Invalid file');
	}

	function renderFileInput(): ReactElement {
		return (
			<div className="mb-15 mb-sm-20">
				{isUploadingProgress &&
					<ProgressBar variant="success" className="mb-15 mb-sm-20" animated now={uploadPercentage} label={`${uploadPercentage}%`} />}
				<FileInput
					{...restFileInputProps}
					disabled={!isEmpty(localSelectedFile)}
					allowedExtensions={fileInputAllowedExtensions}
					allowedFileTypes={fileInputAllowedFileTypes}
					description={fileInputDescription}
					variant={fileInputVariant}
					classnames={fileInputClassnames}
					labelProps={fileInputLabelProps}
					inputLabel={fileInputInputLabel}
					value={localSelectedFile}
					onChange={getFileUploadResp}
					onRemoveFile={onFileRemove}
				/>
			</div>
		);
	}

	function showConfirmPopup(): void {
		confirmPopupRef?.current?.showModal();
	}

	function handleBackBtnOnclick(): void {
		if (isFileUploaded) {
			showConfirmPopup();
			return;
		}

		handleComponentRender('importCard');
	}

	/**
	* Function to handle the click event for back and next button.
	* It uses id of button to find which button is clicked, and triggers the "handleOnClick" prop with the corresponding string argument.
	*/
	function handleOnclick(event: React.MouseEvent): void {
		if (event.target instanceof HTMLButtonElement) {
			if ((event.target.id === 'fileUploadBackBtn')) {
				handleBackBtnOnclick();
			} else if (event.target.id === 'fileUploadNextBtn') {
				handleComponentRender('mapImport');
				handleRenderElement(CSVForm.getValues());
			}
		}
	}

	function renderFooterBtns(): ReactElement {
		return (
			<div className={classNames('d-flex flex-sm-row flex-column-reverse justify-content-between gap-20', btnWrapperClass)}>
				<Button
					{...restBackBtnProps}
					{...universalFooterBtnAttr}
					disabled={isBackBtnDisabled}
					id="fileUploadBackBtn"
					variant={backBtnVariant}
					className={classNames('px-20 fw-bold', backBtnClassName, universalFooterBtnClass)}
					onClick={handleOnclick}
				>
					<i className={classNames('me-10 lh-1', backBtnIcon)} />
					{backBtnLabel}
				</Button>

				<Button
					{...restNextBtnProps}
					{...universalFooterBtnAttr}
					disabled={!isFileUploaded || isNextBtnDisabled}
					id="fileUploadNextBtn"
					variant={nextBtnVariant}
					className={classNames('px-20 fw-bold', nextBtnClassName, universalFooterBtnClass)}
					onClick={handleOnclick}
				>
					{nextBtnLabel}
					<i className={classNames('ms-10 lh-1', nextBtnIcon)} />
				</Button>
			</div>
		);
	}

	function closeConfirmPopup(status: boolean): void {
		confirmPopupRef?.current?.hideModal();
		if (!status) {
			return;
		}
		handleComponentRender('importCard');
		setIsFileUploaded(false);
		setLocalSelectedFile(null);
		handleSelectedFile(null);
	}

	return (
		<div className="p-20">
			<div className={classNames('mx-auto tjs-animate-fadeup col-xl-6 col-sm-12', wrapperClass)}>
				{renderTextContent()}
				{renderFileInput()}
				{renderElement?.(CSVForm)}
				{renderFooterBtns()}
				<PopupContainer ref={confirmPopupRef} hideHeader size="sm">
					<ConfirmPopup
						{...confirmPopupProps}
						popupRef={confirmPopupRef}
						callback={closeConfirmPopup}
					/>
				</PopupContainer>
			</div>
		</div>
	);
}

export default FileUpload;
