# NoteDB Frontend

Minimalist notes manager built with React, TypeScript, and Tailwind CSS.

## Project Structure

```
src/
├── app/                    # Application configuration
│   ├── App.tsx            # Root component
│   ├── providers.tsx      # Context providers
│   └── router.tsx         # Routing configuration
├── pages/                 # Page components
│   ├── layouts/          # Layout components
│   └── [PageName]/       # Individual pages
├── domain/               # Business domains
│   └── [domainName]/    # Domain modules
├── core/                 # Shared components and utilities
│   ├── components/      # Generic UI components
│   ├── lib/            # Library configurations
│   ├── types/          # Global types
│   └── utils/          # Utility functions
└── assets/             # Static assets
    └── styles/         # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```env
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Tech Stack

- **React 19.2.0** - UI library
- **TypeScript 5.6.3** - Type safety
- **Vite 5.4.11** - Build tool
- **Tailwind CSS 3.4.14** - Styling
- **React Router 7.9.3** - Routing
- **TanStack Query 5.90.2** - Server state management
- **Axios 1.12.2** - HTTP client
- **Zustand 5.0.8** - Client state management
- **React Hook Form 7.63.0** - Form handling
- **Zod 4.1.11** - Schema validation

## Architecture

This project follows a domain-driven architecture with:

- **Domain modules**: Business logic organized by feature
- **Core components**: Reusable UI components
- **Type safety**: Full TypeScript coverage
- **API integration**: Centralized HTTP client configuration
- **State management**: Hybrid approach with TanStack Query and Zustand

## Contributing

Follow the established patterns:

1. Use TypeScript for all files
2. Follow the folder structure conventions
3. Use Tailwind CSS for styling
4. Document components with JSDoc
5. Keep components small and focused

## License

Private project