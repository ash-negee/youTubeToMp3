/**
 * This component is responsible for rendering the ImportCard and import history.
 * It accepts various props to customize the import card.
 */
import React, { useEffect, type ReactElement } from 'react';
import classNames from 'classnames';
import axios, { type AxiosResponse } from 'axios';
import Card from 'react-bootstrap/Card';
import Button, { type ButtonProps } from 'react-bootstrap/Button';
import { destructObj } from 'tejas-react/helpers';
import ironCryptoHeaders from 'iron-crypto-pkg';

interface ImportBtn extends ButtonProps {
	label?: string;
}

interface Classnames {
	card?: string;
	cardBody?: string;
	cardButton?: string;
	cardDescription?: string;
	cardImage?: string;
	cardImageWrapper?: string;
	cardTitle?: string;
}

interface Attributes {
	cardImage?: object;
	importCard?: object;
}

interface ImportedFilesHeaders {
	Accept?: string;
	Authorization?: string;
	csrfToken?: object;
}

interface SessionProps {
	importedFiles: () => Promise<SessionProps | object>;
}

interface DomainAndServerUrl {
	domainName: string;
	SERVER_URL: string;
}

export interface ImportCardProps {
	isDev?: boolean;
	description?: string;
	imageUrl?: string;
	importedFilesUrl?: string;
	title?: string;
	attributes?: Attributes;
	btnsProps?: ImportBtn;
	classnames?: Classnames;
	importedFilesHeaders?: ImportedFilesHeaders;
	getDomainAndServerUrl: (isDev: boolean, url?: string) => {
		domainName: string;
		SERVER_URL: string;
	};
	handleComponentRender?: (data: string) => void;
	sessionHeaders?: () => Promise<SessionProps | object>;
}

// eslint-disable-next-line max-lines-per-function
function ImportCard({
	isDev = false,
	description = '',
	imageUrl = 'https://cdn.bookingkoala.co.in/assets/images/leads/file-import.png',
	importedFilesUrl = '',
	title = 'Import',
	attributes = {},
	btnsProps = {},
	classnames = {},
	importedFilesHeaders = undefined,
	getDomainAndServerUrl,
	handleComponentRender = () => { },
	sessionHeaders = undefined,
}: ImportCardProps): ReactElement {
	// Variables
	const controller: AbortController = new AbortController();

	// Destructure
	const {
		domainName,
		SERVER_URL,
	}: DomainAndServerUrl = destructObj(getDomainAndServerUrl(isDev, importedFilesUrl)) as DomainAndServerUrl;

	const {
		card: cardClass,
		cardBody: cardBodyClass,
		cardButton: cardBtnClass,
		cardDescription: cardDescClass,
		cardImage: cardImageClass,
		cardImageWrapper: cardImageWrapperClass,
		cardTitle: cardTitleClass,
	}: Classnames = destructObj(classnames);

	const {
		cardImage: cardImageAttr,
		importCard: cardBtnAttr,
	}: Attributes = destructObj(attributes);

	/**
	 * Function to handle navigation between different components.
	 */
	function onClickHandler(): void {
		handleComponentRender('fileUpload');
	}

	function renderImportBtn(): ReactElement {
		const {
			disabled: isBtnDisabled,
			className: btnClassName,
			label: btnLabel = 'Start an import',
			size: btnSize = 'sm',
			variant: btnVariant = 'opacity-primary',
			...restImportBtnProps
		}: ImportBtn = destructObj(btnsProps);

		return (
			<Button
				{...restImportBtnProps}
				{...cardBtnAttr}
				disabled={isBtnDisabled}
				className={classNames('fw-bold', cardBtnClass, btnClassName)}
				size={btnSize as 'sm'}
				variant={btnVariant}
				onClick={onClickHandler}
			>
				{btnLabel}
			</Button>
		);
	}

	async function getImportedFilesApi(): Promise<AxiosResponse> {
		const session: SessionProps = await sessionHeaders?.() as SessionProps;
		const newSession = session?.importedFiles ?? session ?? await ironCryptoHeaders(SERVER_URL, domainName, 0);
		const { Accept, Authorization, csrfToken }: ImportedFilesHeaders = destructObj(importedFilesHeaders);
		const { signal }: AbortController = destructObj(controller);
		const config = {
			headers: {
				...{
					Authorization,
					Accept,
					...newSession,
					...csrfToken,
					'Content-Type': 'application/json',
				},
			},
			signal,
			timeout: 1_000_000,
		};

		return axios.get(importedFilesUrl, config);
	}

	async function getImportedFiles(): Promise<void> {
		try {
			const resp: AxiosResponse = await getImportedFilesApi();
			console.log(resp);
		} catch (err) {
			console.log(err);
		}
	}

	// Fetching imported files history.
	useEffect(() => {
		getImportedFiles();
	}, []);

	return (
		<div className="import-card justify-content-center d-flex gap-25 mb-25 flex-wrap">
			<Card
				className={classNames('text-center border', cardClass)}
				style={{ width: '18.75rem' }}
			>
				<div className={classNames('text-center', cardImageWrapperClass)}>
					<Card.Img
						{...cardImageAttr}
						height={150}
						width={150}
						alt="import"
						src={imageUrl}
						variant="top"
						className={classNames(cardImageClass)}
					/>
				</div>
				<Card.Body className={classNames(cardBodyClass)}>
					<Card.Title className={classNames('h5 mb-10', cardTitleClass)}>{title}</Card.Title>
					<Card.Text className={classNames('small mb-20', cardDescClass)}>{description}</Card.Text>
					{renderImportBtn()}
				</Card.Body>
			</Card>
		</div>
	);
}

export default ImportCard;
