# Spur AI Support Agent — Frontend

A modern React and TypeScript frontend application showcasing an AI-powered customer support interface. This project was built for the Spur Software Engineer Hiring Assignment and features a clean, responsive, production-inspired UI designed to provide a premium B2B SaaS experience.

## Features

- Responsive AI chat interface
- Modern B2B SaaS inspired UI
- Demo landing page
- Chat widget modal
- Real-time CSS-only typing indicator
- Auto-scroll conversation
- Suggested prompt chips
- Session-aware chat interface
- Responsive design
- Accessible keyboard interactions (e.g., escape to close, proper focus trapping)

## Tech Stack

| Technology   | Purpose            |
| ------------ | ------------------ |
| React        | Frontend framework |
| TypeScript   | Type safety        |
| Vite         | Build tool         |
| Tailwind CSS | Styling            |
| Lucide React | Icons              |
| Axios        | Data fetching      |

## Project Structure

```text
src/
│
├── api/             # API integration and hooks
├── assets/          # Static assets like images and logos
├── components/      # Reusable UI components (MessageBubble, ChatInput, etc.)
├── hooks/           # Custom React hooks (useChat)
├── pages/           # Page-level components (ChatPage)
├── services/        # Utility services (session management)
├── types/           # TypeScript interface definitions
├── utils/           # Helper constants
├── App.tsx          # Root application component
└── main.tsx         # Entry point
```

## Getting Started

First, install all the project dependencies:

```bash
npm install
```

Then, start the development server:

```bash
npm run dev
```

The application will be available locally, usually at `http://localhost:5173`.

## Environment Variables

## Environment Variables

You need to create a `.env` file in the root of the `frontend` directory and add your backend API URL:
```env
VITE_API_URL=http://localhost:3000


## Scripts

Available scripts in this project:

```bash
npm run dev       # Starts the Vite development server
npm run build     # Builds the app for production
npm run preview   # Previews the production build locally
npm run lint      # Runs ESLint to catch code issues
```

## Notes

- The frontend communicates with the backend API to stream responses and manage sessions.
- Backend setup instructions are documented separately in the backend directory.
- This repository focuses heavily on demonstrating a realistic, reliable, and aesthetically polished AI support interface.

## License

This project is licensed under the MIT License.
