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

## ⚠️ Troubleshooting

### 1. "Your connection is not private" (NET::ERR_CERT_COMMON_NAME_INVALID)
If you see this error on Vercel:
- **Cause:** The auto-generated deployment URL (e.g., `project-git-branch-user.vercel.app`) is too long for the SSL certificate.
- **Fix:** Go to your Vercel Project Dashboard and use the **main domain** (e.g., `your-project-name.vercel.app`). It is shorter and will have a valid certificate.

### 2. CORS Errors (Network Error / Failed to Fetch)
If you try to run a job and it fails immediately:
- **Cause:** Browsers block requests from one domain (your app) to another (your SAP server) unless the server allows it.
- **Fix:** 
    - **Option A (Production):** Configure CORS headers on your SAP/Tomcat server to allow `Origin: https://your-app.vercel.app`.
    - **Option B (Dev/Testing):** Install a browser extension like "Allow CORS: Access-Control-Allow-Origin" (use only for testing).
    - **Option C (Proxy):** Set up a small proxy server that forwards requests to SAP.

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
- Your `API_KEY` is embedded in the browser code. Restrict your API key in Google AI Studio to only allow requests from your deployed domain.
- SAP DS credentials entered in the settings are stored in `localStorage` for convenience but are never sent anywhere except the configured SAP endpoint. Ensure you use `https://` for your SAP DS server URL.