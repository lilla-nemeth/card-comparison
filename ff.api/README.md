# Fix Food API

Fix Food API is an API service designed to provide secure and efficient Passkey authentication for web applications. This service facilitates the registration, login, and logout processes using Passkeys, and manages JSON Web Tokens (JWT) for authenticating API requests, ensuring secure communication between the frontend and the backend.

## Overview

The application is built on a Node.js and Express framework, leveraging MongoDB for data persistence through Mongoose ORM. It is developed with TypeScript to ensure type safety and better code structuring. The backend architecture supports API versioning, enabling seamless future updates and modifications without impacting existing functionality.

## Features

- **Passkey Registration**: Users can register using their Passkey, providing a secure method of authentication.
- **Passkey Login**: Allows users to log in with their registered Passkey, streamlining the authentication process.
- **Passkey Logout**: Securely logs out users, invalidating the current session token.
- **JWT Authentication**: Manages JWT tokens to secure API requests and authenticate frontend communications.
- **API Versioning**: Implements versioning for API routes, facilitating future enhancements and changes.

## Getting started

### Requirements

- Node.js
- MongoDB
- npm or yarn

### Quickstart

1. Clone the repository to your local machine.
2. Install the dependencies with `npm install`.
3. Set up your MongoDB instance and ensure it's running.
4. Create an `.env` file in the root of the project with the necessary environment variables as shown in the provided `.env` example.
5. Start the application with `npm start`. The server should be running on the defined port, defaulting to 3000 if not specified in the `.env` file.

### License

Copyright (c) 2024.
