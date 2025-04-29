# Productivity Tracker

## Project Overview

The **Productivity Tracker** helps users track their coding hours, active work sessions. The backend is built with **NestJS**, **PostgreSQL**, **WebSockets**, and integrates with the **GitHub API** for authentication.

---

## Features

- **Authentication:** Users can log in via **GitHub OAuth** for authentication.
- **Activity Tracking:** Track start and end times of coding sessions (activities).
- **Reports:** Generate reports for daily, weekly, and monthly activity.
- **Real-Time Activity Tracking:** The system provides real-time notifications of activity start and end via **WebSockets**.
- **JWT Authentication:** API routes are secured using **JWT** tokens.

---

## Tech Stack

- **NestJS:** Framework for building the backend API.
- **PostgreSQL:** Database to store user and activity data.
- **TypeORM:** ORM for working with the PostgreSQL database.
- **Passport:** Authentication middleware with **GitHub OAuth** strategy.
- **WebSockets:** For real-time activity tracking.
- **JWT:** For API authentication.

---


#  Setup & Features

## Steps to Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file** in the root directory and add your GitHub OAuth credentials and JWT secret:
   ```bash
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   JWT_SECRET=your-jwt-secret
   ```

3. **Set up PostgreSQL:**
   - Create a new database in PostgreSQL.
   - Update your `ormconfig.json` (or `data-source.ts` if using TypeORM 0.3.x) with your database credentials:
     ```json
     {
       "type": "postgres",
       "host": "localhost",
       "port": 5432,
       "username": "your-db-username",
       "password": "your-db-password",
       "database": "productivity_tracker",
       "synchronize": true,
       "logging": false,
       "entities": ["src/**/*.entity.ts"]
     }
     ```

4. **Run database migrations:**
   ```bash
   npm run migration:run
   ```

5. **Start the server:**
   ```bash
   npm run start
   ```

The application should now be running at `http://localhost:3000`.

---

# API Endpoints

## Authentication

- **POST /auth/github**  
  Redirects to GitHub for OAuth login.

  **Response:**
  - Redirects to GitHub authentication page.

- **GET /auth/github/callback**  
  GitHub OAuth callback to authenticate the user and generate a JWT token.

  **Response:**
  - **200 OK**: Returns a JWT token if authentication is successful.
  - **401 Unauthorized**: If authentication fails.

## Activity Tracking

- **POST /activities/start**  
  Start a new activity session for the authenticated user.

  **Smart behavior:** If the user already has an active session, it will be auto-ended before starting a new one. Prevents overlapping activity records.

  **Request Body:**
  - `activityType` (string): Type of activity (e.g., "coding", "meeting").

  **Response:**
  - **200 OK**: Activity session started successfully.
  - **401 Unauthorized**: If the user is not authenticated.

- **POST /activities/end**  
  End the ongoing activity session for the authenticated user.

  **Response:**
  - **200 OK**: Activity session ended successfully.
  - **401 Unauthorized**: If the user is not authenticated.

## Reports

- **GET /reports/daily**  
  Get a daily summary of activity for the authenticated user.

  **Response:**
  - **200 OK**: Returns a JSON object with daily activity data.
  - **401 Unauthorized**: If the user is not authenticated.
     
 ```json
{
  "date": "2025-04-29",
  "totalTime": "00:21:47"
}
  ```


- **GET /reports/weekly**  
  Get a weekly summary of activity for the authenticated user.

  **Response:**
  - **200 OK**: Returns a JSON object with weekly activity data.
  - **401 Unauthorized**: If the user is not authenticated.

- **GET /reports/monthly**  
  Get a monthly summary of activity for the authenticated user.

  **Response:**
  - **200 OK**: Returns a JSON object with monthly activity data.
  - **401 Unauthorized**: If the user is not authenticated.

- **GET /reports/most-productive-day**  
  Get the most productive day of activity for the authenticated user.

  **Response:**
  - **200 OK**: Returns a JSON object with the most productive day data.

## Real-Time Activity Tracking

The application uses WebSockets to notify clients about activity status changes:

- **Activity Started**
- **Activity Ended**

Clients can connect to the WebSocket server to receive these real-time notifications.

## Error Handling

- **401 Unauthorized**: Token is missing or invalid.
- **404 Not Found**: Resource not found (e.g., user or activity).
- **400 Bad Request**: Invalid input data or parameters.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Push your branch to your fork.
5. Create a pull request.


## Notes

If you plan to deploy this backend, you’ll need to adjust your environment variables (such as GitHub credentials) and PostgreSQL configuration.

This project assumes that users have a GitHub account for authentication.

## Notes on VS Code Activity Tracking (Future Integration) 
VS Code Activity Tracking will be integrated in future versions of the Productivity Tracker to enhance the accuracy of activity reporting. Users will be able to track their work activity directly from VS Code, and this data will be stored alongside GitHub commit-based tracking for more comprehensive reports.
