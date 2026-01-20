# Portfolio Application

A modern, full-stack portfolio website with an integrated Content Management System (CMS), built with React and powered by Google Apps Script as a serverless backend.

## Features

- 🎨 **Modern UI**: Built with React, Tailwind CSS, and Framer Motion
- 🔐 **Secure Admin Panel**: Token-based authentication with protected routes
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop
- ⚡ **Serverless Backend**: Google Apps Script + Google Sheets as database
- 🚀 **GitHub Pages Deployment**: Free hosting with automated deployment
- ✨ **Form Validation**: Zod schemas with React Hook Form
- 🎯 **TypeScript**: Strict type safety throughout the application

## Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM 7 (HashRouter)
- **Animations**: Framer Motion
- **Form Validation**: Zod + React Hook Form
- **State Management**: React Context API
- **Notifications**: Sonner (toast notifications)

### Backend (Serverless)
- **Runtime**: Google Apps Script
- **Database**: Google Sheets
- **File Storage**: Google Drive
- **Authentication**: Custom token-based auth

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Google account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (use `.env.example` as template):
   ```env
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   VITE_ADMIN_PASSWORD=your_secure_password
   ```

   > ⚠️ **Security Note**: Never commit `.env` to version control. It's already in `.gitignore`.

4. **Set up Google Apps Script Backend**
   
   Follow the instructions in `GOOGLE_SHEETS_SETUP.md` to:
   - Create a Google Sheet database
   - Deploy the Apps Script
   - Get your deployment URL

5. **Run development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and deploy to GitHub Pages

## Project Structure

```
portfolio/
├── src/
│   ├── admin/              # Admin panel (CMS)
│   │   ├── components/     # Admin-specific components
│   │   ├── pages/          # Admin pages (Dashboard, Projects, etc.)
│   │   └── layouts/        # Admin layout wrapper
│   ├── public/             # Public-facing portfolio
│   │   ├── components/     # Portfolio sections (Hero, Projects, etc.)
│   │   └── pages/          # Public pages
│   ├── shared/             # Shared code
│   │   ├── context/        # React Context (global state)
│   │   ├── services/       # API services (Google Sheets, Auth)
│   │   ├── utils/          # Utilities and validation schemas
│   │   └── components/     # Shared UI components
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
├── google-apps-script.js   # Backend code (deploy to GAS)
├── .env.example            # Environment variables template
└── vite.config.ts          # Vite configuration
```

## Deployment to GitHub Pages

1. **Update base path in `vite.config.ts`**
   ```typescript
   base: '/your-repo-name/',  // or '/' for user site
   ```

2. **Deploy**
   ```bash
   npm run deploy
   ```

3. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` → `/ (root)`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GOOGLE_SCRIPT_URL` | Google Apps Script Web App URL | Yes |
| `VITE_ADMIN_PASSWORD` | Admin panel password (dev only) | Yes |

> **Production**: Store secrets in GitHub Secrets for CI/CD workflows.

## Security Best Practices

✅ **Implemented**:
- Input sanitization on backend
- Token-based authentication
- HTTPS enforced
- Content Security Policy (DOMPurify)

⚠️ **Important**:
- Never commit `.env` file
- Use strong passwords
- Rotate tokens regularly
- Keep dependencies updated

## Form Validation

This project uses Zod for schema validation and React Hook Form for form management:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "./shared/utils/validationSchemas";

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(projectSchema),
});
```

See `src/shared/utils/validationSchemas.ts` for all validation schemas.

## Contributing

This is a personal portfolio project, but suggestions and bug reports are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this as a template for your own portfolio!

## Acknowledgments

- Design inspired by modern web applications
- Icons from Material Symbols
- Fonts from Google Fonts (Space Grotesk, JetBrains Mono)

---

**Built with ❤️ using React, TypeScript, and Google Apps Script**
