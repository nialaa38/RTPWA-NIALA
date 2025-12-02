# Local Development Setup Guide

## Prerequisites
- XAMPP with MySQL running
- phpMyAdmin accessible at `http://localhost/phpmyadmin`
- Node.js installed

## Step 1: Create the Database

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click on the **SQL** tab
3. Copy and paste the contents of `server/database/local_dev_setup.sql`
4. Click **Go** to execute

Or import directly:
1. Click **Import** tab
2. Choose file: `server/database/local_dev_setup.sql`
3. Click **Go**

## Step 2: Verify Database Setup

In phpMyAdmin, you should see:
- Database: `volleyball_pwa_dev`
- Tables: `users`, `tasks`, `sessions`
- Sample data: 2 users, 17+ tasks

## Step 3: Configure Environment

The `.env` file is already configured for local development:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=volleyball_pwa_dev
DB_PORT=3306
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

If your MySQL has a password, update `DB_PASSWORD` in `.env`

## Step 4: Start the Application

```bash
# Terminal 1 - Start the server
npm run server
# or
node server/server.js

# Terminal 2 - Start the client
cd client
npm start
```

## Step 5: Test Login

Use these demo credentials:
- Email: `demo@volleyball.com`
- Password: Create a new account or use Google OAuth

## Google OAuth for Local Development

To use Google login locally:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to APIs & Services > Credentials
4. Edit your OAuth 2.0 Client
5. Add to Authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback`
6. Add to Authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:5000`

## Switching to Production

To deploy to production, update `.env`:
```
NODE_ENV=production
DB_NAME=your_production_db
CLIENT_URL=https://your-production-url.com
GOOGLE_CALLBACK_URL=https://your-production-url.com/auth/google/callback
```

## Troubleshooting

### Database Connection Error
- Ensure XAMPP MySQL is running
- Check if `volleyball_pwa_dev` database exists
- Verify credentials in `.env`

### Port Already in Use
- Change `PORT` in `.env` to another port (e.g., 5001)
- Update `CLIENT_URL` accordingly

### Google OAuth Not Working
- Ensure callback URLs are added in Google Cloud Console
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
