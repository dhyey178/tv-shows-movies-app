# TV Shows & Movies App

## 🗂️ Overview

This monorepo houses a full-stack application for Browse and managing **TV shows and movies**.

* The **backend**, built with **NestJS**, provides comprehensive API endpoints. It uses **SQLite** as the database and **Prisma** as the ORM.
* The **frontend**, built with **Nuxt 3**, allows users to view lists of media with their latest reviews, along with detailed views for individual titles and the ability to load all associated comments.

The backend includes APIs for creating new entries and adding comments, which can be interacted with via tools like Postman or the integrated Swagger UI.

## Getting Started

Follow these steps to set up and run the application locally for development.

### Prerequisites

Make sure you have the following installed on your system:

* **Node.js**: v20 (The project uses `node v20.18.2`)
* **pnpm**: v10 or higher (The project uses `pnpm v10.11.0` as its package manager)
### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dhyey178/tv-shows-movies-app.git
    cd tv-shows-movies-monorepo
    ```

2.  **Install all project dependencies:**
    This command will install dependencies for both the root monorepo and its `backend` and `frontend` workspaces.
    ```bash
    pnpm install
    ```

3.  **Configure Environment Variables:**
    The application uses environment variables for configuration. You need to create `.env` files in both the `backend` and `frontend` directories.
    * Navigate into each directory and copy the example `.env.example` file or configure it yourself:
      # From the monorepo root:
        ```bash
        cp backend/.env.example backend/.env
        cp frontend/.env.example frontend/.env
        ```

4.  **Initialize the Database:**
    This step sets up your local SQLite database, applies all necessary schema migrations, and asks if you want to seed initial data.
    ```bash
    pnpm db:init
    ```

5.  **Seed Initial Data (Optional but Recommended):**
    To populate your database with example TV shows, movies, and comments for development, run the seed script:
    ```bash
    pnpm db:seed
    ```

### Running the Application

Once the setup is complete, you can start both the backend and frontend services concurrently:

```bash
pnpm dev
```

* This command will start the backend API server (typically on `http://localhost:4200`) and the frontend application (typically on `http://localhost:3000`).

* The frontend will automatically start after the backend has started (there's a sleep 5 delay in the script for this).

* **Swagger API Documentation:** Once the backend is running, you can access the interactive API documentation at: `http://localhost:4200/api`

### Running Tests

To run all tests across both the backend and frontend applications:

```bash
pnpm test:all
```
