/**
 * YouTubeConverter Component
 * Converts YouTube videos to MP3 format with a user-friendly interface.
 * Features:
 * - URL input validation using React Hook Form
 * - Loading state management
 * - Error handling
 * - Responsive design
 */
import React, { useState } from 'react';
import axios from 'axios'
import { useForm } from 'react-hook-form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Constants
const CONVERSION_FEATURES = [
	'High-quality MP3 conversion',
	'Fast and free conversion'
];

const YOUTUBE_URL_PATTERN = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

function YouTubeConverter() {
	// State initialization.
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [title, setTitle] = useState('');
	const [convertedUrl, setConvertedUrl] = useState('');
	const [iframeSrc, setIframeSrc] = useState('');

	// Form initialization.
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm({
		defaultValues: {
			videoUrl: ''
		}
	});

	function getVideoID(url) {
		// Return null for invalid inputs
		if (!url || typeof url !== 'string') {
			return null;
		}

		// Handle youtu.be format
		if (url.includes('youtu.be/')) {
			const splitUrl = url.split('youtu.be/');
			if (splitUrl.length < 2) return null;

			// Get the part after youtu.be/ and before any query parameters
			const videoID = splitUrl[1].split('?')[0];
			return videoID || null;
		}

		// Handle standard youtube.com format
		const equalIndex = url.indexOf('=');
		const ampIndex = url.indexOf('&', equalIndex);

		// Return null if '=' not found
		if (equalIndex === -1) {
			return null;
		}

		// Extract the substring
		// If '&' is not found, extract till the end of string
		const result = ampIndex === -1
			? url.substring(equalIndex + 1)
			: url.substring(equalIndex + 1, ampIndex);

		// Return null if extracted string is empty
		return result || null;
	}

	function getApiResponse(videoID) {
		const options = {
			method: 'GET',
			url: 'https://youtube-mp36.p.rapidapi.com/dl',
			params: { id: videoID },
			headers: {
				'x-rapidapi-key': '2cb4879b26msh08c44d38953185ep16f274jsnbf4bb3896802',
				'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com',
			}
		};

		return axios.request(options);
	}

	/**
	 * Handles the conversion process.
	 * @param {Object} formData Form data containing video URL.
	 */
	async function handleConversion(formData) {
		const videoID = getVideoID(formData.videoUrl);
		console.log(videoID);
		setIframeSrc(`https://www.youtube.com/embed/${videoID}?si=68Irn7sTNPDBY1-X`);

		try {
			setIsLoading(true);
			setError('');

			// Get API response.
			const response = await getApiResponse(videoID);
			console.log(response);
			setTitle(response.data.title);
			setConvertedUrl(response.data.link)

			// Reset form after successful conversion
			reset();
		} catch (err) {
			setError('An error occurred during conversion. Please try again.');
		} finally {
			setIsLoading(false);
		}
	}

	/**
	 * Renders the conversion form
	 * @returns {JSX.Element} Form JSX
	 */
	const renderForm = () => (
		<Form onSubmit={handleSubmit(handleConversion)}>
			<InputGroup className="mb-3">
				<Form.Control
					type="text"
					placeholder="Paste YouTube URL here..."
					aria-label="YouTube URL"
					isInvalid={!!errors.videoUrl}
					{...register('videoUrl', {
						required: 'Please enter a YouTube URL',
						pattern: {
							value: YOUTUBE_URL_PATTERN,
							message: 'Please enter a valid YouTube URL'
						}
					})}
				/>
				<Button
					variant="dark"
					type="submit"
					disabled={isLoading}
				>
					Convert <i class="bi bi-music-note" />
				</Button>
			</InputGroup>
			{errors.videoUrl && (
				<Form.Text className="text-danger">
					{errors.videoUrl.message}
				</Form.Text>
			)}
		</Form>
	);

	/**
	 * Renders loading spinner
	 * @returns {JSX.Element} Loading spinner JSX
	 */
	const renderLoading = () => (
		<div className="text-center py-4">
			<Spinner animation="grow" role="status" variant="dark">
				<span className="visually-hidden">Converting...</span>
			</Spinner>
			<p className="mt-3 text-muted">Converting your video...</p>
		</div>
	);

	return (
		<Container fluid className="min-vh-100 bg-light">
			<Row className="justify-content-center">
				<Col xs={12} md={8} lg={6} className='mt-4 mt-md-5'>
					<Card className="shadow-sm">
						<Card.Header className="text-center bg-white border-bottom-0 pt-4">
							<div>
								<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-youtube text-dark" viewBox="0 0 16 16">
									<path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z" />
								</svg>
								<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-music-note text-dark" viewBox="0 0 16 16">
									<path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2" />
									<path fill-rule="evenodd" d="M9 3v10H8V3z" />
									<path d="M8 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 13 2.22V4L8 5z" />
								</svg>
							</div>
							<div className="d-flex justify-content-center align-items-center gap-2 mb-2">
								<h3 className="mb-0 fw-bold">YouTube to MP3 Converter</h3>
							</div>
							<p className="text-muted mb-0">Convert your favorite YouTube videos to high-quality MP3 format</p>
						</Card.Header>

						<Card.Body>
							{error && (
								<Alert variant="danger" onClose={() => setError('')} dismissible>
									{error}
								</Alert>
							)}

							{isLoading ? renderLoading() : renderForm()}

							{convertedUrl && !isLoading && (
								<>
									<Alert className='my-20' variant="success" onClose={() => setConvertedUrl('')}>
										Your video <span className='text-success fw-bold'>{title}</span> has been converted successfully.
									</Alert>

									<iframe width="100%" height="315" src={iframeSrc} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />

								</>
							)}

							{convertedUrl && !isLoading && (
								<div className='text-center p-3'>
									<Button href={convertedUrl} target="_blank" rel="noopener noreferrer" variant='dark'>Download <i class="bi bi-download ms-1" /></Button>
								</div>
							)}

							<div className="text-muted small mt-4">
								{CONVERSION_FEATURES.map((feature, index) => (
									<p key={index} className="mb-2">✓ {feature}</p>
								))}
							</div>
						</Card.Body>

						<Card.Footer className="bg-white text-center text-muted small">
							<p className="mb-0">Made with 🤍 by - Ash</p>
							<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="ashunegi" data-color="#FFDD00" data-emoji="" data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>
						</Card.Footer>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default YouTubeConverter;
