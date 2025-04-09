# Email Verification with JWT

This project is a full-stack MERN (MongoDB, Express, React, Node.js) application that implements email verification and password reset functionality using JSON Web Tokens (JWT). It includes a React frontend and an Express backend.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Setup Instructions](#setup-instructions)
5. [Environment Variables](#environment-variables)
6. [Project Structure](#project-structure)
7. [Frontend Flow](#frontend-flow)
8. [Backend Flow](#backend-flow)
9. [Future Improvements](#future-improvements)
10. [License](#license)

---

## Project Overview

This application allows users to:
- Register with their email and password.
- Verify their email address using an OTP sent via email.
- Log in to access protected resources.
- Reset their password using an OTP sent to their registered email.

---

## Features

- **User Authentication**: Secure user registration and login.
- **Email Verification**: OTP-based email verification.
- **Password Reset**: OTP-based password reset functionality.
- **Protected Routes**: Access control for authenticated users.
- **Responsive UI**: User-friendly and responsive design.

---

## Technologies Used

### Frontend
- React
- Vite
- TailwindCSS
- React Router
- React Toastify
- Axios

### Backend
- Express.js
- MongoDB (via Mongoose)
- JWT for authentication
- Nodemailer for sending emails
- dotenv for environment variable management
- bcryptjs for password hashing

---

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB instance running

### Steps

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <repository-folder>
    ```
2. Install dependencies for both client and server:
    ```sh
    cd client
    npm install
    cd ../server
    npm install
    ```
3. Configure environment variables:

* Create a .env file in the server directory.
* Add the following variables:
    ```sh
    PORT=3000
    yourMONGODB_URI=<-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    SMTP_USER=<your-smtp-user>
    SMTP_PASSWORD=<your-smtp-password>
    SENDER_EMAIL_ID=<your-sender-email>
    ```
4. Start the development servers:

* frontend :
    ```sh
    cd client
    npm run dev
    ```

* backend:
    ```sh
    cd server
    npm run dev
    ```
5. Open the application in your browser at http://localhost:5173.

---

### Frontend Flow

1. **Home Page** : Displays a welcome message and links to register or log in.
2. **Registration** : Users can register with their email and password. The form sends a POST request to the backend.
3. **Email Verification** : After registration, users receive an email with a verification link.
4. **Protected Routes** : Once verified, users can access protected routes.

---

### Backend Flow

1. **User Registration** :

    * Accepts user details (email, password).
    * Hashes the password using bcryptjs.
    * Generates a JWT for email verification.
    * Sends a verification email using nodemailer.
2. **Email Verification** :

    * Verifies the JWT from the email link.
    * Activates the user's account in the  database.
3. **Authentication**:

    * Issues JWTs for authenticated users.
    * Protects routes using middleware.

    ---


### Environment Variables
The following environment variables are required for the backend:


| Variable     | Description                          |
|--------------|--------------------------------------|
| `PORT`       | Port for the Express server          |
| `MONGO_URI`  | MongoDB connection string            |
| `JWT_SECRET` | Secret key for signing JWTs          |
| `EMAIL_USER` | Email address for sending emails     |
| `EMAIL_PASS` | Password for the email account       |



---

### Future Improvements
* Add password reset functionality.
* Implement role-based access control.
* Improve UI/UX for the frontend.
* Add unit and integration tests.

---

### License
This project is licensed under the MIT License. See the LICENSE file for details.