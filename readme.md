# URL Shortener API 🚀

## Overview

The **Custom URL Shortener API** is a scalable and feature-rich service designed for creating and managing short URLs with advanced analytics, user authentication via Google Sign-In, and rate limiting. The solution is fully containerized and deployable to cloud hosting services, ensuring high performance and scalability.

---

## Features

1. **User Authentication**

   - Google Sign-In integration for seamless user login and registration.

2. **URL Shortening**

   - Generate short, shareable URLs for long, cumbersome URLs.
   - Option to provide custom aliases and categorize URLs under specific topics.

3. **Redirect Short URLs**

   - Redirect users to the original URL using the short alias.
   - Logs and tracks user interactions for analytics.

4. **Advanced Analytics**

   - Retrieve detailed insights on individual URLs, topics, and overall usage.
   - Metrics include total clicks, unique users, OS/device types, and click trends.

5. **Rate Limiting**

   - Prevents abuse by limiting URL creation and analytics requests within a specified time frame.

6. **Caching**

   - Implements Redis for caching short/long URLs and analytics data to boost performance.

7. **Cloud Deployment**
   - Fully Dockerized solution for seamless deployment to platforms like AWS, Heroku, Railway or Render.

---

## API Endpoints

### 1. User Authentication

- **Google Register**:
  - `POST https://url-shortner-production-d98e.up.railway.app/api/auth/google/register`
- **Google Login**:
  - `POST https://url-shortner-production-d98e.up.railway.app/api/auth/google/login`

### 2. URL Management

- **Create Short URL**
  - `POST https://url-shortner-production-d98e.up.railway.app/api/url/shorten`
- **Redirect Short URL**
  - `GET https://url-shortner-production-d98e.up.railway.app/api/url/shorten/{alias}`

### 3. Analytics

- **URL Analytics**
  - `GET https://url-shortner-production-d98e.up.railway.app/api/url/analytics/{alias}`
- **Topic-Based Analytics**
  - `GET https://url-shortner-production-d98e.up.railway.app/api/url/analytics/topic/{topic}`
- **Overall Analytics**
  - `GET https://url-shortner-production-d98e.up.railway.app/api/url/analytics/overall`

Refer to the [API Documentation](#api-documentation) for detailed request and response formats.

---

## Technical Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (or any scalable database of your choice)
- **Authentication**: Passport Google Auth
- **Caching**: Redis
- **Containerization**: Docker
- **Hosting**: [Platform Name] (AWS/Render/Railway/Heroku)

---

## Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- Docker and Docker Compose
- Redis
- MongoDB
- Google API credentials for OAuth

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/AkShAy21211/URL-SHORTNER.git
   cd URL-SHORTNER

   ```

2. **Install Dependencies**

   ```
   npm install

   ```

3. **Set Up Environment Variables**

   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET= your_client_secret
   SESSION_SECRET= your_session_secret
   JWT_SECRET=your_jwt_secret
   MONGO_URL=your_mongo_url
   BASE_URL=your_base_url
   REDIS_USERNAME= your_redis_username
   REDIS_PASSWORD= your_redis_password
   REDIS_HOST=your_redis_host
   REDIS_PORT=ypur_redis_port
   ```

4. **Build and Run the Docker image**

```bash
docker build -t <image-name>:<tag> .
```

- Replace `<image-name>` with the name you want to give your image (e.g., `my-app`).
- Replace `<tag>` with the version tag (e.g., `latest`).

### Example:

```bash
docker build -t my-app:latest .
```

## Run the Docker Container

To run the Docker container, use the following command:

```bash
docker run -p <host-port>:<container-port> --name <container-name> <image-name>:<tag>
```

- Replace `<host-port>` with the port on your local machine you want to map.
- Replace `<container-port>` with the port exposed by your application inside the container.
- Replace `<container-name>` with the name you want to give to the container.
- Replace `<image-name>` and `<tag>` with the values from the build step.

### Example:

```bash
docker run -p 3000:3000 --name my-app-container my-app:latest
```

In this example, the application will be accessible at `http://localhost:3000`.

---

**Access the Application**

API: http://localhost:3000

**_Deployment_**
The application is live and accessible at: https://url-shortner-production-d98e.up.railway.app

## Challenges and Solutions

### Efficient Analytics Tracking:

_Solution: Used Redis caching for fast data retrival and reduced database load._

### Rate Limiting Implementation:

**Solution: Integrated express-rate-limit.**

### Google OAuth Integration:

**_Solution: Used the passport-google-oauth20 library for seamless integration._**

### Future Enhancements

- Multi-language support.
- Custom expiration times for short URLs.
- Admin dashboard for managing links and analytics.

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

_This project is licensed under the MIT License._

```

This README is comprehensive, detailing features, setup, API usage, and deployment while keeping it easy to navigate. Let me know if you need help customizing it further!
```
