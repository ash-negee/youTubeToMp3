/**
 * This component can render three different child components: ImportCard, FileUpload, and MappingTable.
 * The state variable 'component' determines which component to render.
 * The handleOnClick function is used to update the state when a button is clicked, allowing the user to navigate between different components.
 */
import { useState, type ReactElement } from 'react';
import DOMPurify from 'dompurify';
import { destructObj } from 'tejas-react/helpers';
import ImportCard from 'subComponents/ImportCard';
import FileUpload from 'subComponents/FileUpload';
import MapImport from 'subComponents/MapImport';

interface Classnames {
	importCard?: object;
	fileUpload?: object;
	mappingTable?: object;
}

interface Attributes {
	importCard?: object;
	fileUpload?: object;
	mappingTable?: object;
}

interface SessionProps {
	upload: object;
	import: object;
}

interface Headers {
	Accept?: string;
	Authorization?: string;
	csrfToken?: object;
}

export interface ImportCSVProps {
	isDev?: boolean;
	attribute?: Attributes;
	classnames?: Classnames;
	fileUploadProps?: object;
	headers?: {
		import?: Headers;
		importedFiles?: Headers;
		upload?: Headers;
	};
	importCardProps?: object;
	mapImportProps?: object;
	url?: {
		upload?: string;
		import?: string;
		importedFiles?: string;
	};
	sessionHeaders?: () => Promise<SessionProps | object>;
}

interface Components {
	importCard: () => ReactElement;
	fileUpload: () => ReactElement;
	mapImport: () => ReactElement;
}

interface ResponseData {
	[key: string]: string[];
}

function getDomainAndServerUrl(isDev: boolean, url: string = ''): {
	domainName: string;
	SERVER_URL: string;
} {
	const sanitizedUrl: string = DOMPurify.sanitize(url);
	// Create an anchor element to easily parse the URL.
	const parser: HTMLAnchorElement = document.createElement('a');
	parser.href = sanitizedUrl;
	const baseUrl: string = `${parser.protocol}//${parser.hostname}`;
	const subdomain: string = parser?.hostname?.split('.')[0];
	const domainName: string = isDev ? subdomain : ((window.location.hostname).split('.'))[0];
	const SERVER_URL: string = isDev ? baseUrl : `${window.location.protocol}//${window.location.hostname}`;

	return { domainName, SERVER_URL };
}

// eslint-disable-next-line max-lines-per-function
function ImportCSV({
	isDev = false,
	attribute = undefined,
	classnames = undefined,
	fileUploadProps = undefined,
	headers = undefined,
	importCardProps = undefined,
	mapImportProps = undefined,
	url = undefined,
	sessionHeaders = undefined,
}: ImportCSVProps): ReactElement {
	// Destructure
	const {
		importCard: importCardClassnames,
		fileUpload: fileUploadClassnames,
		mappingTable: mappingTableClassnames,
	}: Classnames = destructObj(classnames);

	const {
		importCard: importCardAttr,
		fileUpload: fileUploadAttr,
		mappingTable: mappingTableAttr,
	}: Attributes = destructObj(attribute);

	// State initialization
	const [currentComponent, setCurrentComponent] = useState<string>('importCard');
	const [selectedFile, setSelectedFile] = useState<File | null>();
	const [respData, setRespData] = useState<ResponseData>();
	const [renderElementVal, setRenderElementVal] = useState<object>();

	function handleImportFile(data: ResponseData): void {
		setRespData(data);
	}

	function handleSelectedFile(file: File | null): void {
		setSelectedFile(file);
	}

	function handleRenderElement(data: object): void {
		setRenderElementVal(data);
	}

	/**
	 * Function to handle the onClick event in child components and updates the currentComponent state.
	 * @param data - The name of the component to be displayed. This value is used to update the component state.
	 */
	function handleOnClick(data: string): void {
		setCurrentComponent(data);
	}

	function renderImportCard(): ReactElement {
		return (
			<ImportCard
				isDev={isDev}
				importedFilesUrl={url?.importedFiles}
				attributes={importCardAttr}
				classnames={importCardClassnames}
				importedFilesHeaders={headers?.importedFiles}
				getDomainAndServerUrl={getDomainAndServerUrl}
				handleComponentRender={handleOnClick}
				sessionHeaders={sessionHeaders}
				{...importCardProps}
			/>
		);
	}

	function renderFileUpload(): ReactElement {
		return (
			<FileUpload
				isDev={isDev}
				uploadUrl={url?.upload}
				classnames={fileUploadClassnames}
				attributes={fileUploadAttr}
				selectedFile={selectedFile}
				uploadHeader={headers?.upload}
				getDomainAndServerUrl={getDomainAndServerUrl}
				handleRenderElement={handleRenderElement}
				handleComponentRender={handleOnClick}
				handleImportFile={handleImportFile}
				handleSelectedFile={handleSelectedFile}
				sessionHeaders={sessionHeaders}
				{...fileUploadProps}
			/>
		);
	}

	function renderMapImport(): ReactElement {
		return (
			<MapImport
				isDev={isDev}
				importUrl={url?.import}
				classnames={mappingTableClassnames}
				attributes={mappingTableAttr}
				importHeader={headers?.import}
				respData={respData}
				renderElementVal={renderElementVal}
				getDomainAndServerUrl={getDomainAndServerUrl}
				handleComponentRender={handleOnClick}
				handleSelectedFile={handleSelectedFile}
				sessionHeaders={sessionHeaders}
				{...mapImportProps}
			/>
		);
	}
	// Object with name of components as keys and corresponding render functions as values.
	const components: Components = {
		importCard: renderImportCard,
		fileUpload: renderFileUpload,
		mapImport: renderMapImport,
	};

	return (
		<div className="bg-white tjs-import-csv">
			{components[currentComponent as keyof Components]?.()}
		</div>
	);
}

export default ImportCSV;
