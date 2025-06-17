I can see some of your codebase details from the files provided, but I don't have complete access to all your source files - only some compiled files and configuration details. Based on what I can see, I'll create a README for your AI-powered fitness and nutrition planner frontend project, making educated assumptions where needed.

# AI-Powered Fitness and Nutrition Planner

## Overview

This is the frontend application for an AI-powered fitness and nutrition planner that helps users create personalized workout routines and meal plans based on their goals, preferences, and health data. The application leverages modern web technologies and artificial intelligence to provide a seamless user experience.

## Technologies

- **Frontend Framework**: Next.js (with App Router)
- **Backend**: Django REST Framework
- **Styling**: Tailwind CSS
- **Authentication**: JWT-based authentication
- **State Management**: React Context API
- **HTTP Client**: Axios

## Features

- **User Authentication**: Secure login, registration, and password recovery
- **Personalized Dashboard**: Overview of fitness goals, progress, and recommendations
- **Workout Planning**: AI-generated workout routines tailored to user goals
- **Nutrition Tracking**: Meal planning and dietary recommendations
- **Progress Tracking**: Visual representation of fitness and nutrition progress
- **Mobile Responsive**: Optimized for both desktop and mobile devices

## Project Structure

```
ai-powered-fitness-and-nutrition-planner-frontend/
├── app/                         # Next.js App Router folders
│   ├── api/                     # API route handlers
│   ├── dashboard/               # Dashboard page
│   ├── login/                   # Authentication pages
│   ├── register/                # User registration
│   ├── profile/                 # User profile management
│   ├── workouts/                # Workout planning and tracking
│   ├── nutrition/               # Nutrition planning and tracking
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout component
├── components/                  # Reusable UI components
│   ├── auth/                    # Authentication components
│   ├── dashboard/               # Dashboard components
│   ├── layout/                  # Layout components (header, footer, etc.)
│   ├── theme-provider.tsx       # Theme provider for light/dark mode
│   └── ui/                      # UI components (buttons, cards, etc.)
├── contexts/                    # React Context providers
│   ├── auth-context.tsx         # Authentication context
│   └── theme-context.tsx        # Theme context
├── lib/                         # Utility functions and helpers
│   ├── api.ts                   # API client setup
│   └── utils.ts                 # Utility functions
├── middleware.ts                # Next.js middleware for authentication
├── public/                      # Static assets
├── .env.local                   # Environment variables (not in repo)
├── next.config.js               # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── package.json                 # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- A running instance of the Django backend API

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-powered-fitness-and-nutrition-planner-frontend.git
   cd ai-powered-fitness-and-nutrition-planner-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Authentication

The application uses JWT-based authentication with the Django backend. The token is stored in both localStorage and cookies to support both client-side and server-side authentication checks.

The middleware component protects routes that require authentication and redirects unauthenticated users to the login page.

## API Integration

The frontend communicates with the Django backend API using Axios. All API requests include the authentication token in the headers when the user is logged in.

API requests are handled through a custom API client that handles common configuration and error handling.

## Deployment

The application can be deployed to platforms like Vercel or Netlify:

```bash
# Build the application
npm run build
# or
yarn build

# Start the production server
npm start
# or
yarn start
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---
