# Frontend Application (Nuxt 3)

This application provides the responsive user interface for the TV Shows & Movies App. It allows users to:

* **Browse & Discover:** Navigate through home, movies, and TV shows pages.
* **View Highlights:** See a hero section and "Freshly Added" movies and TV shows on the homepage, showcasing key details like poster, name, description, average rating, release year, genre, duration (for movies), seasons (for TV shows), and the latest 5 comments.
* **Explore Collections:** Access paginated lists of movies and TV shows, each presented with comprehensive cards.
* **Dive into Details:** Click on any card to view a detailed page for a specific movie or TV show, including all card information, plus director/creator, full cast, number of episodes (for TV shows), and a dedicated section for comments with the ability to load more.
* **Mobile-Friendly:** All pages and components are designed to be fully responsive for mobile devices.

## Technologies Used

* **Framework**: [Nuxt 3](https://nuxt.com/) (Vue.js 3)
* **UI Framework**: Nuxt UI
* **Styling**: Tailwind CSS
* **Icons**: Lucide Vue Next
* **Date Formatting**: date-fns

## Setup

**Important:** For overall monorepo setup, please refer to the main `README.md` in the project root. The following steps are specific to running and managing the frontend in isolation.

### Prerequisites

* Node.js v20
* pnpm v10

### Installation

If you are only working on the frontend or need to install its dependencies specifically:

* Install Dependencies
```bash
pnpm install
```

* Create env or copy `.env.example`
```bash
cp .env.example .env
```
* Start Frontend 
``` bash
pnpm dev
```

### Testing
```bash
pnpm test
```

# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Resources

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
