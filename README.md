## 🔐 Environment Variables (`.env`)

This project uses several environment variables to manage authentication, database, and API services. Below is a breakdown of the required variables **(without exposing secret values)**:

### Clerk (Authentication)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Public key used on the frontend for Clerk authentication.
- `CLERK_SECRET_KEY` — Secret key used on the backend to securely access Clerk APIs.

### Convex (Backend/Database)
- `CONVEX_DEPLOYMENT` — Convex deployment ID (e.g., `dev:example-project-123`).
- `NEXT_PUBLIC_CONVEX_URL` — Public URL for accessing the Convex backend from the client.

### Stream (Real-time Messaging/Chat)
- `NEXT_PUBLIC_STREAM_API_KEY` — Public API key for integrating Stream on the frontend.
- `STREAM_SECRET_KEY` — Secret key used for secure backend access to Stream services.

---

> deployment link ========   https://interview-platform-ejyr.vercel.app/
