# SAP DS Job Commander

A RESTful API client to execute SAP Data Services jobs via natural language or manual configuration, featuring an AI-powered parameter parser.

## 🚀 Deployment

### Option 1: Deploy to Vercel (Fastest)

This project is pre-configured for Vercel.

1. **Push this code** to a Git repository (GitHub, GitLab, etc.).
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. **Import** your repository.
4. In the "Environment Variables" section, add your API Key:
   - **Key**: `API_KEY`
   - **Value**: `your_gemini_api_key_starts_with_AIza...`
5. Click **Deploy**.

### Option 2: Build Manually

To create a static production build for any web server (Apache, Nginx, S3):

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build**:
   ```bash
   # You must pass the API Key during build time for the client to use it
   export API_KEY=your_key_here
   npm run build
   ```

3. **Deploy**:
   Upload the contents of the `dist/` folder to your web server.
   *Note: Your server must support SPA routing (rewrite all 404s to index.html).*

## 🛠 Development

### Prerequisites

- [Node.js](https://nodejs.org/) (Version 18+)
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### Running Locally

1. Create a `.env` file:
   ```env
   API_KEY=your_api_key_here
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000`.

## 🔒 Security Note

This is a **client-side** application.
- Your `API_KEY` is embedded in the browser code. Restrict your API key in Google AI Studio to only allow requests from your deployed domain (e.g., `https://your-app.vercel.app`).
- SAP DS credentials entered in the settings are stored in `localStorage` for convenience but are never sent anywhere except the configured SAP endpoint. Ensure you use `https://` for your SAP DS server URL.
