# Comment System

A modern comment system built with React, Vite, and Tailwind CSS that allows users to create posts and add nested comments.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher) or yarn
- Backend API server (make sure it's running and accessible)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd feed-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Environment Variables

Create a `.env` file in the project root and add the following variables:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Replace `http://localhost:5000` with your backend API URL if it's different.

## Available Scripts

In the project directory, you can run:

- `npm run dev` or `yarn dev`
  - Runs the app in development mode.
  - Open [http://localhost:5173](http://localhost:5173) to view it in your browser.
  - The page will reload when you make changes.

- `npm run build` or `yarn build`
  - Builds the app for production to the `dist` folder.
  - It correctly bundles React in production mode and optimizes the build for the best performance.

- `npm run preview` or `yarn preview`
  - Serves the production build from the `dist` folder.
  - Useful for testing the production build locally.

## Project Structure

```
src/
├── components/       # Reusable UI components
├── App.jsx          # Main application component
└── main.jsx         # Application entry point
```
## Features

- Create posts with titles and content
- Add comments to posts
- Nested replies to comments
- Real-time updates
- Responsive design

## Technologies Used

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios for API calls

## License

This project is open source and available under the MIT License.