# MERN E-Commerce Platform

A full-stack e-commerce application built using the MERN stack with secure authentication, payments, and background job processing.

## Tech Stack
- Backend: Node.js, Express.js
- Frontend: React, Redux Toolkit
- Database: MongoDB
- Caching & Queues: Redis, Bull
- Authentication: JWT, OAuth 2.0
- Payments: Razorpay

## Features
- JWT authentication using HTTP-only cookies
- CSRF protection
- OAuth 2.0 login
- Role-based access control (RBAC)
- Cart merge for guest and logged-in users
- Razorpay payment integration
- Redis caching for performance optimization
- Background email processing using Bull Queue
- MVC Architecture
- Config Management

## Setup
1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Start backend and frontend servers

## ./.env(Backend)

NODE_ENV =
PORT =
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FRONTEND_URL=
REDIS_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

## frontend/.env(Frontend)

VITE_RZP_KEY=
VITE_BACKEND_URL=
