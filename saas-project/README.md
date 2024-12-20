# SaasProject

## Getting Started
First, clone the repository and install the dependencies:

```bash
git clone https://github.com/senderro/saasproject.git
cd saasproject
npm install
```


## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
DATABASE_URL=
API_KEY=
API_URL=
```
Ensure these variables are configured correctly before running the application.

## Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).


---

## Features

- **Node Deployment**: Users can deploy private and secure XRP nodes with a single click.
- **Authentication**: Integrated with [Clerk](https://clerk.dev) for user authentication and session management.
- **API Integration**: Uses external API services to handle dynamic deployments and manage backend tasks.
- **Responsive Design**: Fully responsive UI with light and dark theme support using Tailwind CSS.
- **Scalable Infrastructure**: Built with Prisma and PostgreSQL for database management, ensuring scalability.

---
