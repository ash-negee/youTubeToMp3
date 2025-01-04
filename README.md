# YouTube to MP3 Converter

A React-based web application that allows users to convert YouTube videos to MP3 format with a clean, user-friendly interface. This app provides a seamless experience for converting YouTube videos while maintaining high audio quality.

## Features

- 🎯 Simple and intuitive user interface
- ✅ YouTube URL validation
- 🎵 High-quality MP3 conversion
- 🚀 Fast and free conversion process
- 📱 Responsive design for all devices
- 🎬 Video preview functionality
- ⚡ Real-time loading states
- ❌ Comprehensive error handling
- 🔄 Form reset after successful conversion

## Technologies Used

- React
- React Hook Form for form validation
- Axios for API requests
- React Bootstrap for UI components
- RapidAPI YouTube MP3 Converter API

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14.0.0 or higher)
- npm or yarn package manager
- A RapidAPI key with access to the YouTube MP3 Converter API

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-converter
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your RapidAPI key:
```env
REACT_APP_RAPIDAPI_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

## Usage

1. Navigate to the application in your web browser
2. Paste a valid YouTube URL into the input field
3. Click the "Convert" button
4. Wait for the conversion process to complete
5. Download your MP3 file using the provided download button

## Component Structure

```jsx
YouTubeConverter/
  ├── YouTubeConverter.jsx      # Main component file
  └── README.md                 # Documentation
```

## API Integration

The component uses the YouTube MP3 Converter API from RapidAPI. You'll need to replace the API key in the `getApiResponse` function with your own:

```javascript
const options = {
  method: 'GET',
  url: 'https://youtube-mp36.p.rapidapi.com/dl',
  params: { id: videoID },
  headers: {
    'x-rapidapi-key': 'YOUR_API_KEY',
    'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com',
  }
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Note

Remember to keep your API keys secure and never commit them directly to your repository. Use environment variables for sensitive information.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React Bootstrap components
- Uses RapidAPI's YouTube MP3 Converter service
- Created with 🤍 by Ash

## Support

For support, email [ashunegincr@gmail.com] or open an issue in the repository.
