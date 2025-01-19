// import { useEffect, useCallback } from 'react';
import MultiSelect from 'tejas-react/MultiSelect';
import ImportCSV from 'components/ImportCSV';
// import { createSessionHeaders } from 'services/helpers';
// import { useSelector } from 'react-redux';
import { FieldValues, UseFormReturn } from 'react-hook-form';
// import APIConstants from 'constants/API';

const customClassnames = {
	importCard: {
		card: 'test-card', // --done
		cardImageWrapper: 'test-card-image-wrapper', // --done
		cardImage: 'test-card-image', // --done
		cardBody: 'test-card-body', // --done
		cardTitle: 'test-card-titles', // --done
		cardDescription: 'test-card-description', // --done
		cardButton: 'test-card-button', // --done
	},
	fileUpload: {
		wrapper: 'test-wrapper', // --done
		textContent: 'test-text-content', // --done
		title: 'test-title', // --done
		description: 'test-description', // --done
		footerButtonsWrapper: 'test-footerButtons-wrapper', // --done
		footerButton: 'test-universal-footerButton-class', // --done
	},
	mappingTable: {
		footerBtns: 'test-universal-footer-class', // --done
	}
};

const customAttributes = {
	importCard: { // --done
		importButton: {
			'test-data-hover': 'premium',
		},
		cardImage: { 'data-test': 'test-card-image', }
	},
	fileUpload: { // --done
		footerButtons: {
			'data-test': 'universal-attr'
		}
	},
	mappingTable: { // --done
		footerBtns: {
			'data-test': 'universal-attr'
		}
	}
};

const fileUploadCustomDesc = '<p className="mb-5">This content can be customized using <b>renderDesc</b> sub prop of <b>fileUploadProps</b>. <a className="text-primary" href="#"> Custom link 1 <i class="bi bi-box-arrow-up-right ms-5"></i> </a></p><p> You can pass plane text or HTML as a string as well. <a href="#" className="text-primary"> Custom link 2 </a>. And the content is rendered using <b>DangerousHTML</b> component form tejas-react. </p>';

const customHeadings = [
	{
		label: 'Matched',
		className: 'w-15',
	},
	{
		label: 'Column header from file',
		className: 'w-20',
	},
	{
		label: 'Data from file',
		className: 'w-50',
	},
	{
		label: 'Form fields',
		className: 'w-15 text-end',
	},
];

const customOptions = [
	{
		label: 'First name',
		value: 'first_name',
	},
	{
		label: 'Last name',
		value: 'last_name',
	},
	{
		label: 'Email',
		value: 'email',
	},
	{
		label: 'Emails',
		value: 'emails',
	},
	{
		label: 'Phone number',
		value: 'phone_number',
	},
	{
		label: 'Phone numbers',
		value: 'phone_numbers',
	},
	{
		label: 'Company name',
		value: 'company_name',
	},
	{
		label: 'Gender',
		value: 'gender',
	},
	{
		label: 'Address',
		value: 'address',
	},
	{
		label: 'City',
		value: 'city',
	},
	{
		label: 'State',
		value: 'state',
	},
	{
		label: 'Zipcode',
		value: 'zipcode',
	},
	{
		label: 'Apt',
		value: 'apt',
	},
];

const multiSelectOptions = [
	{
		label: 'Vip Funnel',
		value: '686912da-2a26-4cee-96ed-a11d3e4e49f6',
	},
	{
		label: 'Weekly - Next 5 days - Booked Customers',
		value: 'c75ff596-7cab-455f-b89c-e1a92d01dea7',
	},
	{
		label: 'One-time to recurring',
		value: 'd629751b-2936-46a4-924d-53088f6eb0a3',
	},
	{
		label: 'One-time to recurring	',
		value: 'b07c0d8d-6d44-40c0-a716-160a497b8df3',
	},
	{
		label: 'One-time to recurring',
		value: 'e8b48f75-7dc2-4fe7-a8eb-2a053e0b6de1',
	},
	{
		label: 'Abandoned carts',
		value: 'cb435e60-d7ea-4694-a54e-830896d3e2e2',
	},
	{
		label: 'Abandoned carts',
		value: '1eeab05b-7ebe-426f-87c1-7e16577c8dfb',
	},
	{
		label: 'New reviews and feedback',
		value: 'd2568447-2b59-4d06-8051-4103b4fbdffd',
	},
	{
		label: 'New Funnel added successfully',
		value: '0e3b79a9-7741-4fb6-8ca1-311fd562a552',
	},
	{
		label: 'Abandoned carts',
		value: 'a38cc231-7a36-4eeb-a296-478544fe31ec',
	},
	{
		label: 'Checkout funnel',
		value: '1f341f51-ed43-48de-9e32-41fed47f283c',
	},
	{
		label: 'test',
		value: '3f12bcfc-ff5e-40a9-85a4-4d19e79729b8',
	},
];

// const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// eslint-disable-next-line max-lines-per-function
function Ashu() {
	// const { csrfToken } = useSelector((global) => global?.global);

	// useEffect(() => {
	// 	const userData = {
	// 		"Ip": "103.163.58.202",
	// 		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NjQwNjc5MzAsImlkIjoibHg0MUlNeVZMZEQvSHJHOWJ6bEtIZz09IiwiaXAiOiIxMDMuMTYzLjU4LjIwMiIsIm5hbWUiOiJTTDZYczdMWGpqcDJuSitVSUk1d3FRPT0iLCJyb2xlIjoiNTFJenBtTXRuS3VmTksranBITFRVQT09IiwidXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChYMTE7IExpbnV4IHg4Nl82NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzMS4wLjAuMCBTYWZhcmkvNTM3LjM2In0.__qr3VeA9B0FeMyPbt0UytO2fKupwz_ofgYNStvhJo8",
	// 		"id": 1,
	// 		"first_name": "Varinder",
	// 		"last_name": "Singh",
	// 		"photo_url": "/uploads/hiringtest/2022/8/31/1661933536user3.jpg",
	// 		"role": "merchant",
	// 		"status": 1,
	// 		"access_token":
	// 			"ZWO9uLUFAAPWHYxT",
	// 		"is_default_setup": true,
	// 		"onetime_access_token": "prGuqom0dwFE1nQ",
	// 		"is_new": 0,
	// 		"old_local_storage": null
	// 	}
	// 	localStorage.setItem('currentUser', JSON.stringify(userData));
	// }, []);

	// const generateSessionHeaders = useCallback(async () => createSessionHeaders(), []);

	function renderCustomElement(CSVForm: UseFormReturn<FieldValues, unknown, undefined>) {
		const { register, setValue, trigger, watch } = CSVForm;

		return (
			<div className="mb-20">
				<MultiSelect
					labelKeys={['label']}
					searchKeys={['label']}
					valueKey="value"
					enableChips
					value={watch('uuids') as (string | number)[]}
					options={multiSelectOptions}
					name="uuids"
					controls={{ register, setValue, trigger }}
					returnType="value"
					classnames={{ wrapper: 'mb-10' }}
				/>
			</div>
		);
	}

	return (
		<ImportCSV
			// isDev={true}
			// url={{
			// 	upload: APIConstants.UploadCSVApiUrl,
			// 	import: 'https://hiringtest.bookingkoala.co.in/leads/v1/import/lead/files',
			// 	importedFiles: 'https://hiringtest.bookingkoala.co.in/leads/v1/imported-files?limit=10&page=1',
			// }}
			// headers={{
			// 	upload: {
			// 		Accept: 'application/json',
			// 		Authorization: `Bearer ${currentUser?.token}`,
			// 		csrfToken
			// 	},
			// 	import: {
			// 		Accept: 'application/json',
			// 		Authorization: `Bearer ${currentUser?.token}`,
			// 		csrfToken
			// 	},
			// 	importedFiles: {
			// 		Accept: 'application/json',
			// 		Authorization: `Bearer ${currentUser?.token}`,
			// 		csrfToken
			// 	}
			// }}
			// sessionHeaders={generateSessionHeaders}
			classnames={customClassnames}
			attribute={customAttributes}
			importCardProps={{
				title: 'Import',
				imageUrl: 'https://cdn.bookingkoala.co.in/assets/images/leads/file-import.png',
				description: 'Import contact and other information into the module',
				btnsProps: {
					label: 'Start an import',
					type: 'button',
					variant: 'opacity-primary',
					size: 'sm',
					className: '',
				},
			}}
			fileUploadProps={{
				title: 'Upload your files',
				renderDesc: fileUploadCustomDesc,
				fileInputProps: {
					variant: 'dragAndDrop',
					inputLabel: { button: 'Upload File', description: 'Drag and drop or choose a file to upload your lead.' },
					allowedExtensions: 'csv,xlsx',
					allowedFileTypes: 'text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					labelProps: { label: 'Select a file' },
					description: 'All.csv and.xlsx file types are supported.',
					// Other FileInputProps.
				},
				confirmPopupProps: {
					title: 'Confirm ',
					message: 'Are you sure you want to go back?',
					btnsProps: {
						agree: {
							label: 'Yes',
							className: 'test-agree-btn-class',
						},
						cancel: {
							label: 'Cancel',
							className: 'test-cancel-btn-class',
						}
					},
					// Rest of confirm popup props.
				},
				renderElement: renderCustomElement,
				btnsProps: {
					back: {
						label: 'Back',
						icon: 'bi bi-arrow-left',
						variant: 'white',
						className: 'test-back-btn',
						// Rest button props.
					},
					next: {
						label: 'Next',
						icon: 'bi bi-arrow-right',
						variant: 'opacity-primary',
						className: 'test-next-btn',
						// Rest button props.
					}
				}
			}}
			mapImportProps={{
				renderItem: [
					{
						columnHeader: { name: 'Header 1', key: 'h1' },
						columnOptions: [{ label: 'Label 1', value: 'h11', }, { label: 'Label 2', value: 'h12', }, { label: 'Label 3', value: 'h13', }],
					},
					{
						columnHeader: { name: 'Header 2', key: 'h2' },
						columnOptions: [{ label: 'Label 1', value: 'h21', }, { label: 'Label 2', value: 'h22', }, { label: 'Label 3', value: 'h23', }],
					},
					{
						columnHeader: { name: 'Header 3', key: 'h3' },
						columnOptions: [{ label: 'Label 1', value: 'h31', }, { label: 'Label 2', value: 'h32', }, { label: 'Label 3', value: 'h33', }],
					}
				],
				tableProps: {
					headings: customHeadings,
					// Rest of table component props.
				},
				selectProps: {
					options: customOptions,
					defaultLabel: { label: 'Select', disabled: false, value: '' },
					// Rest of select component props.
				},
				mappingIcons: {
					mappedIcon: 'bi bi-person',
					unmappedIcon: 'bi bi-person',
				},
				requiredFields: ['email', 'phone_number'],
				checkBoxProps: {
					labelProps: { label: "Don't Import data in unmapped columns" },
					// Rest of checkbox component props.
				},
				btnsProps: {
					back: {
						label: 'Back',
						// icon: 'bi bi-person',
						iconPosition: 'left',
						variant: 'white',
						className: 'ashu',
						// Rest of button props.
					},
					cancel: {
						label: 'Cancel',
						// icon: 'bi bi-person',
						iconPosition: 'left',
						variant: 'white',
						className: 'ashu',
						// Rest of button props.
					},
					loadMore: {
						label: 'Load More',
						icon: 'bi bi-person',
						iconPosition: 'right',
						variant: 'opacity-primary',
						className: 'ashu',
						// Rest of button props.
					},
					import: {
						label: 'Import',
						// icon: 'bi bi-person',
						iconPosition: 'left',
						// variant: 'dark',
						className: 'ashu',
						// Rest of button props.
					}
				}
			}}
		/>
	);
}

export default Ashu;

// -------------------------------------------------------SendEmailPopup-------------------------------------------------------------
// import { useRef } from 'react';
// import Button from 'react-bootstrap/Button';
// import { type FieldValues } from 'react-hook-form';
// import { addValidations, VALIDATIONS } from 'tejas-react/validations';
// import { type PopupContainerRef } from 'tejas-react';
// import { isArrayEmpty } from 'tejas-react/helpers';
// import SendEmailPopup from './components/SendEmailPopup';

// const { REQUIRED, EMAIL, NO_LEADING_SPACE } = VALIDATIONS;

// const textEditorToolbar = ['bold', 'italic', 'underline', 'image', 'link', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',];

// const customEmailFieldRules = {
// 	required: {
// 		value: true,
// 		message: 'This field cannot be left empty (custom err msg).',
// 	},
// 	validate: {
// 		emailRegExp: (emails: string[]) => {
// 			const inValidEmails: string[] = [];
// 			emails?.forEach((email: string) => {
// 				const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
// 				if (!emailRegex.test(email.trim())) {
// 					inValidEmails.push(email);
// 				}
// 			});
// 			return isArrayEmpty(inValidEmails) ? true : `Invalid Emails (custom err msg) ${inValidEmails.join(', ')}`;
// 		}
// 	},
// };

// const customCcFieldRules = {
// 	validate: {
// 		emailRegExp: (emails: string[]) => {
// 			const inValidEmails: string[] = [];
// 			emails?.forEach((email: string) => {
// 				const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
// 				if (!emailRegex.test(email.trim())) {
// 					inValidEmails.push(email);
// 				}
// 			});
// 			return isArrayEmpty(inValidEmails) ? true : `Invalid Emails (custom err msg) ${inValidEmails.join(', ')}`;
// 		}
// 	},
// };

// // Custom button handlers
// function handleCustomButtons(btnType: string): void {
// 	const handleAction: Record<string, () => void> = {
// 		templates: () => console.log('templates button is triggered'),
// 	};
// 	handleAction[btnType]?.();
// }

// // eslint-disable-next-line max-lines-per-function
// function Ashu() {
// 	const popupRef1 = useRef<PopupContainerRef>(null);
// 	function showModal1() { popupRef1?.current?.showModal(); }
// 	function hideModal1() { popupRef1?.current?.hideModal(); }

// 	const popupRef2 = useRef<PopupContainerRef>(null);
// 	function showModal2() { popupRef2?.current?.showModal(); }
// 	function hideModal2() { popupRef2?.current?.hideModal(); }

// 	const popupRef3 = useRef<PopupContainerRef>(null);
// 	function showModal3() { popupRef3?.current?.showModal(); }
// 	function hideModal3() { popupRef3?.current?.hideModal(); }

// 	const popupRef4 = useRef<PopupContainerRef>(null);
// 	function showModal4() { popupRef4?.current?.showModal(); }
// 	function hideModal4() { popupRef4?.current?.hideModal(); }

// 	function onSubmit(data: FieldValues): void {
// 		console.log(data);
// 	}

// 	return (
// 		<div className="w-50 mx-auto">
// 			<Button type="button" className="mt-50 me-50" onClick={showModal1}>Show Modal 1</Button>

// 			<SendEmailPopup
// 				// hideInputFields={['cc', 'email-body', 'email']}
// 				ref={popupRef1}
// 				closeSendEmailPopup={hideModal1}
// 				onSubmit={onSubmit}
// 				emailFieldProps={{
// 					// variant: 'single',
// 					labelProps: { label: 'Email' },
// 					placeholder: 'Ex: example.xyz.com',
// 					singleEmailInputProps: {
// 						defaultValue: 'test@default.com',
// 						// value: ['test@value.com'],
// 						validations: addValidations([REQUIRED, EMAIL, NO_LEADING_SPACE]),
// 						// Rest TextInput Props.
// 					},
// 					multiEmailInputProps: {
// 						defaultValue: 'test@default.com',
// 						// value: ['test@value.com'],
// 						multiEmailInputRules: customEmailFieldRules,
// 						// Rest MultiEmailInput Props.
// 					}
// 				}}
// 				carbonCopyFieldProps={{
// 					// value: ['test@test.test', 'example@fsadlf.com'],
// 					ccFieldRules: customCcFieldRules,
// 					labelProps: { label: 'Cc' },
// 					placeholder: 'Ex: example.xyz.com',
// 					// Rest MultiEmailInput Props.

// 				}}
// 				subjectFieldProps={{
// 					// value: 'test sub',
// 					defaultValue: 'Test Sub default value',
// 					validations: addValidations([REQUIRED, NO_LEADING_SPACE]),
// 					labelProps: { label: 'Subject' },
// 					placeholder: 'Subject',
// 					// Rest TextInput Props.

// 				}}
// 				previewSectionProps={{
// 					labelProps: { label: 'Preview' },
// 					initialText: 'Preview...',
// 					className: 'test-preview-class',
// 					attributes: { 'data-test': 'wrapper' }
// 					// Rest DangerousHTML Props.
// 				}}
// 				textEditorProps={{
// 					value: 'ashu',
// 					defaultValue: 'ashu@example.com',
// 					classnames: { body: 'test-body-class', toolbar: 'test-toolbar-class', wrapper: 'test-wrapper-class' },
// 					attributes: { body: { 'data-test': 'te-body' }, toolbar: { 'data-test': 'te-toolbar' }, wrapper: { 'data-test': 'te-wrapper' } },
// 					labelProps: { label: 'Email body' },
// 					placeholder: 'Design your email template...',
// 					toolbar: textEditorToolbar,
// 					customToolbarBtns: [
// 						{
// 							label: 'Templates',
// 							tooltip: 'Add templates',
// 							key: 'templates',
// 							disabled: false,
// 							type: 'templates',
// 							onAction: handleCustomButtons
// 						},
// 					]
// 					// Rest Text Editor Props.

// 				}}
// 				footerBtnProps={{
// 					cancelBtn: {
// 						className: 'test-cancelBtn-class',
// 						'data-test': 'cancel-button',
// 						// Rest Button Props.
// 					},
// 					sendTestEmailBtn: {
// 						className: 'test-sendTestEmailBtn-class',
// 						'data-test': 'Send-test-email-Button'
// 						// Rest Button Props.

// 					},
// 					sendBtn: {
// 						className: 'test-send-btn-class',
// 						'data-test': 'send-button'
// 						// Rest Button Props.
// 					},
// 				}}
// 			/>

// 			<Button type="button" className="mt-50 me-50" onClick={showModal2}>Show Modal 2</Button>
// 			<SendEmailPopup
// 				ref={popupRef2}
// 				closeSendEmailPopup={hideModal2}
// 				onSubmit={onSubmit}
// 				emailFieldProps={{
// 					variant: 'multiple',
// 					// value: 'test@example.com',
// 					emailFieldRules: customEmailFieldRules,
// 					// validations: addValidations([REQUIRED, EMAIL, NO_LEADING_SPACE]),
// 					labelProps: { label: 'Email' },
// 					placeholder: 'Ex: example.xyz.com',
// 				}}
// 			/>

// 			<Button type="button" className="mt-50 me-50" onClick={showModal3}>Show Modal 3</Button>
// 			<SendEmailPopup
// 				ref={popupRef3}
// 				closeSendEmailPopup={hideModal3}
// 				onSubmit={onSubmit}
// 			/>

// 			<Button type="button" className="mt-50 me-50" onClick={showModal4}>Show Modal 4</Button>
// 			<SendEmailPopup
// 				ref={popupRef4}
// 				closeSendEmailPopup={hideModal4}
// 				onSubmit={onSubmit}
// 			/>
// 		</div>
// 	);
// }

// export default Ashu;

// ----------------------------------------------------------------RadioButtonGroup----------------------------------------------------------------

// import React, { useState } from 'react';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import { type FieldValues, useForm } from 'react-hook-form';
// import RadioButtonGroup from 'components/RadioButtonGroup';
// import ErrorPage from './components/ErrorPage';

// const customClassnames = {
// 	wrapper: 'test-wrapper-class',
// 	button: 'test-Btn-class',
// 	icon: 'test-Btn-icon-class',
// 	description: 'test-desc-class',
// };

// const customAttributes = {
// 	wrapper: {
// 		'data-test': 'radioBtn-group-wrapper',
// 	},
// 	button: {
// 		'data-test': 'radio-button',
// 	},
// 	description: {
// 		'data-test': 'radio-group-desc',
// 	},
// };

// const radioButtons = [
// 	{
// 		disabled: false,
// 		label: 'Star',
// 		value: 'star',
// 		id: 'star',
// 		icon: 'bi bi-star',
// 		className: 'custom-btn-class',
// 		tooltip: {
// 			content: 'Star',
// 			placement: 'auto' as const,
// 		}
// 	},
// 	{
// 		disabled: false,
// 		label: 'Italic',
// 		value: 'italic',
// 		id: 'italic',
// 		icon: 'bi bi-type-italic',
// 		className: 'custom-btn-class fst-italic',
// 		tooltip: {
// 			content: 'Italic',
// 			placement: 'auto' as const,
// 		}
// 	},
// 	{
// 		disabled: false,
// 		label: 'Bold',
// 		value: 'bold',
// 		id: 'bold',
// 		icon: 'bi bi-type-bold',
// 		className: 'custom-btn-class fst-bold',
// 		tooltip: {
// 			content: 'Bold',
// 			placement: 'auto' as const,
// 		}
// 	},
// 	{
// 		disabled: true,
// 		label: 'Underline',
// 		value: 'underline',
// 		id: 'underline',
// 		icon: 'bi bi-type-underline',
// 		className: 'custom-btn-class text-decoration-underline',
// 		tooltip: {
// 			content: 'Underline',
// 			placement: 'auto' as const,
// 		}
// 	},
// ];

// function Ashu() {
// 	// const [radioBtnValue, setRadioBtnValue] = useState<string | number>('italic'); // For uncontrolled
// 	const { control, getValues, handleSubmit, watch, setValue } = useForm<FieldValues>({ defaultValues: { 'radio-btn': 'star' } }); // For controlled

// 	function onSubmitHandler(data: FieldValues): void {
// 		console.log('submitted data : ', data);
// 	}

// 	function handleOnChange(value: string | number, event?: React.ChangeEvent<HTMLInputElement>) {
// 		console.log('Value : ', value);
// 		console.log('Event : ', event);
// 	}

// 	return (
// 		<>
// 			<Form onSubmit={handleSubmit(onSubmitHandler)} className="w-50 mx-auto">
// 				{watch('radio-btn')}
// 				<RadioButtonGroup
// 					disabled={false}
// 					vertical={false}
// 					size="sm"
// 					variant="outline-light"
// 					name="radio-btn"
// 					value={getValues('radio-btn') as string | number}
// 					description="Please select a text formatting option"
// 					classnames={customClassnames}
// 					attributes={customAttributes}
// 					labelProps={{
// 						label: 'Radio Buttons',
// 						tooltip: 'Select a text formatting option',
// 						tooltipProps: {
// 							placement: 'auto',
// 							// tooltipIcon: 'bi bi-person'
// 						},
// 					}}
// 					radioBtns={radioButtons}
// 					control={control}
// 					setValue={setValue}
// 					onChange={handleOnChange}
// 				/>

// 				<Button
// 					size="sm"
// 					type="submit"
// 					className="btn btn-primary my-20"
// 				>
// 					Submit
// 				</Button>
// 			</Form>

// 			<div className="w-50 mx-auto">
// 				{/* <RadioButtonGroup
// 					disabled={false}
// 					vertical={false}
// 					size="sm"
// 					variant="outline-light"
// 					// name="radio-btn"
// 					value="star"
// 					description="Please select a text formatting option"
// 					classnames={customClassnames}
// 					attributes={customAttributes}
// 					labelProps={{
// 						label: 'Radio Buttons',
// 						tooltip: 'Select a text formatting option',
// 						tooltipProps: {
// 							placement: 'auto',
// 						},
// 					}}
// 					radioBtns={radioButtons}
// 					onChange={handleOnChange}
// 				/> */}
// 				<Button
// 					size="sm"
// 					className="mt-20"
// 					variant="secondary"
// 					// eslint-disable-next-line react/jsx-no-bind
// 					onClick={() => setValue('radio-btn', 'bold')}
// 				// onClick={() => setRadioBtnValue('bold')}
// 				>
// 					Change value
// 				</Button>
// 			</div>
// 		</>
// 	);
// }

// export default Ashu;

/** -------------------------------------------------------------------ErrorPage---------------------------------------------------------------- */

// const defaultBtns = {
// 	helpBtn: {
// 		isHidden: false,
// 		label: '',
// 		size: 'sm' as const, // sm | lg (can't be empty).
// 		variant: '', // Button variant (optional).
// 		href: '#', // Link for Button (optional).
// 	},
// 	homeBtn: {
// 		isHidden: false,
// 		label: '',
// 		size: 'sm' as const, // sm | lg (can't be empty).
// 		variant: 'light', // Button variant (optional).
// 		href: '#', // Link for Button (optional).
// 	},
// 	refreshBtn: {
// 		isHidden: false,
// 		label: '',
// 		size: 'sm' as const, // sm | lg (can't be empty).
// 		variant: ' ', // Button variant (optional).
// 	},
// };

// const buttons = [
// 	{
// 		size: 'sm' as const, // sm | lg (can't be empty).
// 		variant: '', // Button variant (optional).
// 		label: 'About', // Label for Button (optional).
// 		href: '#', // Link for Button (optional).
// 		classnames: 'test-about-btn',
// 		isHidden: false,
// 		['data-test']: 'About-button', // Attributes for Button (optional).
// 	},
// 	{
// 		size: 'sm' as const,
// 		variant: '',
// 		label: 'Contact US',
// 		href: '#',
// 		classnames: 'test-contact-btn',
// 		isHidden: false,
// 		['data-test']: 'Contact-button', // Attributes for Button (optional).
// 	},
// ];

// // Custom classnames for ErrorPage elements
// const customClassnames = {
// 	wrapper: 'test-error-wrapper',
// 	errCode: 'test-error-code ',
// 	errTitle: 'test-error-title',
// 	errMessage: 'test-error-message',
// 	helpBtn: 'test-help-btn',
// 	homeBtn: 'test-home-btn',
// 	refreshBtn: 'test-refresh-btn',
// };

// // Custom attributes for ErrorPage elements
// const customAttributes = {
// 	wrapper: {
// 		'data-test': 'error-page-wrapper',
// 	},
// 	errCode: {
// 		'aria-label': 'error-code',
// 	},
// 	errTitle: {
// 		'data-test': 'error-title',
// 	},
// 	errMessage: {
// 		'data-test': 'error-message',
// 	},
// 	helpBtn: {
// 		'data-test': 'test-help-btn',
// 	},
// 	homeBtn: {
// 		'data-test': 'test-home-btn',
// 	},
// 	refreshBtn: {
// 		'data-test': 'test-refresh-btn'
// 	},
// };
// function Ashu() {
// 	return (
// 		<ErrorPage
// 			errCode={504} // If not provided, defaults title ,message and an icon will be render (optional but recommended).
// 			height="100vh" // (Optional) Note : pass units also.
// 			errTitle="" // Custom error title (optional).
// 			errMessage="" // Custom error message (optional).
// 			btnsProps={defaultBtns} // Customize the default action buttons (optional)
// 			customBtns={buttons} // Render extra buttons (optional).
// 			hideDefaultButtons={false} // Don't render default buttons(optional).
// 			showRefreshBtn={!true} // Don't render refresh buttons if false (optional).
// 			classnames={customClassnames} // Custom classnames for different elements (optional).
// 			attributes={customAttributes} // Custom attributes for different elements (optional).
// 		/>
// 	);
// }

// export default Ashu;
