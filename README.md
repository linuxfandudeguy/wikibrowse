
# WikiBrowse

[WikiBrowse](https://wikibrowse.vercel.app) is a minimalist browser built with **Next.js** that allows users to search and explore **Wikipedia** articles. Unlike traditional browsers, WikiBrowse fetches article **summaries** and displays related resources, offering a concise and easy-to-read experience.

The app uses **Next.js** for server-side rendering, **TypeScript (TSX)** for type safety, and **Tailwind CSS** for styling. All data is fetched directly from the **Wikipedia API**, so there is no backend involved.

## How It Works

WikiBrowse interacts with the **Wikipedia API** to dynamically fetch article summaries and related resources based on user search queries.

### Key Features:

1. **Search Functionality**:  
   - Users can enter a search term, and the app sends a query to the **Wikipedia API**.
   - The app returns a list of article **summaries** related to the search term.
   - Each result includes a short description (the summary) and links to related articles or resources.

2. **Dynamic Article Summaries**:  
   - When a user selects a search result, the app dynamically inserts the summary of the article into the container. The summary provides key information in a concise format, making it easy to get an overview of the topic.

3. **Related Resources**:  
   - Along with the summary, the app displays links to related articles, categories, or external resources. This helps users explore the topic further.

4. **No Backend**:  
   - WikiBrowse is fully client-side. It does not rely on a traditional backend server. All data fetching is done directly from the **Wikipedia API** in the browser.

5. **Tailwind CSS for Styling**:  
   - **Tailwind CSS** is used to style the app, ensuring it is visually appealing and responsive. The layout is clean and minimalistic, focusing on providing a smooth browsing experience.

6. **Serverless Deployment on Vercel**:  
   - WikiBrowse is hosted on **Vercel**, which provides serverless hosting for Next.js applications. This ensures the app is fast, scalable, and easy to deploy.

## How It Works

WikiBrowse works as follows:

1. **User Search**:  
   - Users input a search query into the search bar.
   - The app queries the **Wikipedia API** to fetch article summaries and related resources.

2. **Displaying Results**:  
   - Search results are displayed with the article titles and brief summaries.
   - Users can click on a result to see more details, which are dynamically inserted into the container on the page.

3. **Dynamic Content Rendering**:  
   - Once a user selects a search result, the summary and additional related resources (such as links to other articles) are dynamically inserted into the main content area, providing a seamless browsing experience.

## Getting Started

To run WikiBrowse locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/linuxfandudeguy/wikibrowse.git
   cd wikibrowse
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or (most recommended)
   bun install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or (most recommended)
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see WikiBrowse in action.

## Dissecting the Architecture

### 1. **Pages Directory (Frontend)**
   - **`src/pages/index.tsx`**:  
     The homepage where users can enter search queries. It displays the search bar and dynamically renders the results fetched from the Wikipedia API.
   
   - **Dynamic Insertion**:  
     There are no separate dynamic routes (e.g., slugs). The content is dynamically inserted into the page container as soon as a user clicks on a search result. The **summary** and **related resources** are fetched and displayed on the same page.

### 2. **Wikipedia API Integration**
   - WikiBrowse uses the **Wikipedia API** to fetch search results and article summaries.
   - The app sends requests to the API to fetch articles and summaries based on the user's search query, and the relevant content is then dynamically inserted into the page.
   
### 3. **Tailwind CSS for Styling**
   - WikiBrowse uses **Tailwind CSS** to style the app. The utility-first approach allows for a fast, responsive, and customizable design. The app is mobile-friendly and adapts to different screen sizes.

### 4. **TypeScript (TSX)**
   - The application is written in **TypeScript** using **TSX** (TypeScript JSX) to ensure type safety and better developer experience. TypeScript helps catch errors early and provides better tooling for handling API responses.

### 5. **Client-Side Architecture**
   - WikiBrowse is a client-side application. All the data fetching, logic, and content rendering happen in the user's browser, with no backend required.

### 6. **Deployment with Vercel**
   - WikiBrowse is hosted on **Vercel**, which offers a serverless deployment platform for Next.js applications. Vercel handles scaling and serves the app with optimal performance.

## Learn More

To learn more about the technologies used in WikiBrowse, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) – Learn about Next.js features and how to build dynamic web applications.
- [Wikipedia API Documentation](https://www.mediawiki.org/wiki/API:Main_page) – Learn how to interact with the Wikipedia API to fetch article summaries and search results.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) – Learn how to use Tailwind CSS for utility-first styling.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) – Learn about TypeScript and how to add type safety to JavaScript applications.


## LICENCE

Licensed under MIT
