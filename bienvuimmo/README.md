# bienvuimmo - SaaS Immobilier Tout-en-Un

Plateforme complète de gestion immobilière : CRM, gestion de biens, multidiffusion, signatures électroniques.

## 📁 Structure du projet

```
├── frontend/          # Next.js 14 + React + Tailwind
├── backend/           # Express API + Prisma + PostgreSQL
└── my-nextjs-app/     # Ancienne structure (legacy)
```

## Prerequisites

- Node.js (version 14 or later)
- PostgreSQL (version 12 or later)
- npm or yarn

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd my-nextjs-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. **Set up the environment variables:**

   Copy the `.env.example` to `.env` and update the database connection string:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file to include your PostgreSQL database credentials.

4. **Run the Prisma migrations:**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

6. **Open your browser:**

   Navigate to `http://localhost:3000` to see your application in action.

## Project Structure

- `prisma/schema.prisma`: Defines the database schema for Prisma.
- `src/app/page.tsx`: Represents the homepage of the application.
- `src/app/layout.tsx`: Defines the layout structure of the application.
- `src/app/globals.css`: Contains global styles for the application.
- `src/lib/prisma.ts`: Initializes and exports a Prisma client instance.
- `.env`: Contains environment variables for configuration.
- `.env.example`: Example of environment variables.
- `.gitignore`: Specifies files and folders to ignore by Git.
- `package.json`: Configuration for npm, including dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.
- `next.config.js`: Next.js specific configuration.

## License

This project is licensed under the MIT License.