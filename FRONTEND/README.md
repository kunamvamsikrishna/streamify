# Frontend Environment Variables

Create a `.env` file in this directory with the following variables:

```env
VITE_API_URL=http://localhost:5001/api
VITE_STREAM_API_KEY=your_stream_api_key
```

## For Production (Render)

Set these environment variables in your Render dashboard:
- `VITE_API_URL` (your deployed backend URL, e.g., `https://streamify-backend.onrender.com/api`)
- `VITE_STREAM_API_KEY` (your Stream API key)

**Important**: After setting environment variables, rebuild the service.
