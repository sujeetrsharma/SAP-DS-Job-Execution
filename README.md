# SAP DS Job Commander

A RESTful API client to execute SAP Data Services jobs via natural language or manual configuration, featuring an AI-powered parameter parser.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18 or higher)
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd sap-ds-job-commander
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a file named `.env` in the root directory.
   ```bash
   touch .env
   ```
   
   Add your API Key to the `.env` file:
   ```env
   API_KEY=your_actual_gemini_api_key_here
   ```

### 💻 Running Locally

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

### 📦 Building for Production

To create a production-ready build:

```bash
npm run build
```

The output will be in the `dist` folder.

## ☁️ Deployment

### Deploy to Vercel (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2. Go to [Vercel](https://vercel.com) and "Add New > Project".
3. Select your repository.
4. In the **Environment Variables** section, add:
   - Key: `API_KEY`
   - Value: `your_gemini_api_key`
5. Click **Deploy**.

### Manual Deployment
You can deploy the contents of the `dist` folder to any static hosting provider (Netlify, AWS S3, etc.). Ensure your provider supports Single Page Application (SPA) routing (rewriting all requests to index.html).
