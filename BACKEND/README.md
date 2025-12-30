# Backend Environment Variables

Create a `.env` file in this directory with the following variables:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## For Production (Render)

Set these environment variables in your Render dashboard:
- `PORT` (automatically set by Render)
- `MONGO_URI`
- `SECRET_KEY`
- `STREAM_API_KEY`
- `STREAM_SECRET_KEY`
- `FRONTEND_URL` (your deployed frontend URL)
- `NODE_ENV=production`

