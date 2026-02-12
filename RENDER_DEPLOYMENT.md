# Deploying URable to Render

This guide explains how to deploy the URable Sign Language Detection app to [Render](https://render.com/).

## Prerequisites
- A Render account.
- Your project uploaded to a GitHub or GitLab repository.

---

## 1. Deploy the Backend (Web Service)

Since the backend requires Python, TensorFlow, and OpenCV, we must use **Docker** for deployment.

1.  Log in to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** > **Web Service**.
3.  Connect your repository.
4.  **Runtime**: Select `Docker`.
5.  **Environment Variables**:
    *   `NODE_ENV`: `production`
    *   `CLIENT_URL`: Your frontend URL (e.g., `https://urable.onrender.com`)
    *   `PYTHON_SCRIPT_PATH`: `./SignLanguageDetectionUsingCNN-main/persistent_ml_worker.py`
6.  **Plan**: Render's **Free Tier** (512MB RAM) might be tight for TensorFlow. If you see "Out of Memory" errors or restarts, upgrade to the **Starter** plan (2GB RAM).

---

## 2. Deploy the Frontend (Static Site)

The frontend is a React app built with Vite.

1.  Click **New +** > **Static Site**.
2.  Connect the same repository.
3.  **Build Command**: `cd client && npm install && npm run build`
    *   *Note: Ensure your `package.json` and code are in the `client` folder.*
4.  **Publish Directory**: `client/dist`
5.  **Environment Variables**:
    *   `VITE_API_URL`: Your backend URL (e.g., `https://urable-api.onrender.com`)
6.  **Redirects/Rewrites**:
    *   Go to **Redirects/Rewrites**.
    *   Add a rule: `/*` -> `/index.html` (Status: `200` - this handles React Router).

---

## 3. Connecting Frontend and Backend

Once both are deployed:
1.  Copy your **Backend URL** (e.g., `https://backend.onrender.com`).
2.  Update the `VITE_API_URL` environment variable in your **Frontend** Static Site settings.
3.  Copy your **Frontend URL** (e.g., `https://frontend.onrender.com`).
4.  Update the `CLIENT_URL` environment variable in your **Backend** Web Service settings.
5.  Redeploy both services.

---

## Troubleshooting

- **Timeout during startup**: The first request or the Persistent Worker might take time to load the model (TensorFlow is slow to import). Check logs to ensure `✅ ML Worker is ready` appears.
- **Port Matching**: Ensure the `PORT` in the Backend settings matches the `EXPOSE` port in the `Dockerfile` (default is 3000).
