# Portfolio Admin Panel

This is the admin panel for managing the portfolio content. It's built with Next.js, TypeScript, and Tailwind CSS, and it connects to a Directus backend.

## Features

- User authentication with Directus
- Responsive design
- CRUD operations for projects
- Markdown editor for content
- Image uploads
- Rich text editing
- Form validation
- Protected routes

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- Directus instance running (configured in `.env`)

### Environment Variables

Create a `.env.local` file in the root of the `frontend` directory with the following variables:

```env
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
NEXT_PUBLIC_DIRECTUS_TOKEN=your_static_token_here
```

### Installation

1. Install dependencies:

```bash
cd frontend
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
frontend/
├── src/
│   ├── app/                  # App router
│   │   ├── admin/            # Admin routes
│   │   │   ├── projects/     # Project management
│   │   │   ├── login/        # Login page
│   │   │   └── layout.tsx    # Admin layout
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # Reusable components
│   │   └── admin/            # Admin components
│   ├── lib/                  # Utility functions
│   │   └── directus/         # Directus client and auth
│   └── middleware.ts         # Authentication middleware
└── public/                   # Static files
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Import the repository to Vercel
3. Add the environment variables in the Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Import the repository to Netlify
3. Add the environment variables in the Netlify dashboard
4. Deploy!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
