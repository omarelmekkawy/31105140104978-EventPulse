# EventPulse API

## Project Overview

EventPulse is a RESTful event management API developed with Node.js and Express.js. The application provides authentication, role-based authorization, event and category management, attendee registration, event messaging, validation, filtering, searching, sorting, pagination, and health monitoring.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- express-validator
- Socket.IO
- Swagger UI
- Postman
- Jest
- Supertest
- CORS
- Vercel
- MongoDB Atlas

## Main Features

### Authentication and Authorization

The API supports user registration and login using JWT authentication.

Two user roles are supported:

- Admin
- Attendee

Protected operations use authentication middleware and role-based authorization.

### Categories

The Categories API provides complete CRUD operations:

- Create category
- Get all categories
- Get category by ID
- Update category
- Delete category

Category management is protected for administrators where required.

### Events

The Events API provides:

- Create event
- Get all events
- Get event by ID
- Get events owned by the authenticated admin
- Update event
- Delete event

Events contain information such as title, description, date, location, capacity, category, and organizer.

The event listing also supports:

- Category filtering
- Location filtering
- Date filtering
- Text search by title and description
- Sorting by date
- Sorting by capacity
- Sorting alphabetically by title
- Pagination

Administrators can manage only their own events.

### Event Registration

Attendees can:

- Register for an event
- View their registrations
- Cancel their registrations

The API prevents duplicate registrations and checks the event capacity before creating a registration.

### Event Messages and Announcements

The application includes event-specific messaging.

Authenticated attendees can access messages for events they are registered for, while administrators can access messages for events they organize.

Socket.IO is used to support real-time event announcements and event-based communication.

### Health Check

A `/health` endpoint was added to provide the current server and database connection state.

The response confirms whether the server is running and whether the MongoDB connection is active.

## Validation and Error Handling

The API uses `express-validator` for request validation.

Validation is applied to request bodies and route parameters where required.

A centralized error-handling system is used together with:

- `AppError`
- `asyncHandler`
- Central error-handling middleware

The API returns appropriate HTTP status codes for successful requests, validation errors, authentication failures, authorization failures, missing resources, and server errors.

## Database

MongoDB is used as the application database through Mongoose.

For production, the database is hosted on MongoDB Atlas and the API connects to it through environment-based configuration.

Sensitive configuration values are kept outside the source code and are not committed to the repository.

## API Documentation

Interactive API documentation was added using Swagger UI and is exposed through:

`/api-docs`

The Swagger documentation covers the available API endpoints, request parameters, request bodies, authentication requirements, and possible responses.

## Postman

A Postman Collection was created for EventPulse to cover the API endpoints.

The collection is organized into:

- Authentication
- Health
- Categories
- Events
- Registrations
- Messages

A shared Postman Environment is used for reusable values such as:

- `baseUrl`
- `token`
- `categoryId`
- `eventId`
- `registrationId`

Authenticated requests use the shared JWT token variable.

The collection was tested against the implemented API endpoints.

## Production Deployment

The production architecture uses:

MongoDB Atlas → Vercel API

The API is deployed to Vercel, while the production database is hosted on MongoDB Atlas.

Environment variables are configured on the deployment platform so that database credentials and other secret values remain outside the repository.

The deployed application provides the production API, health endpoint, and Swagger documentation.

## Project Structure

The application is organized into separate layers for maintainability:

- `config/` — database configuration
- `controllers/` — request handling and business logic
- `middleware/` — authentication, authorization, validation, and error handling
- `models/` — Mongoose database models
- `routes/` — API route definitions
- `utils/` — reusable application utilities
- `tests/` — automated tests
- `app.js` — Express application configuration
- `server.js` — application startup
- `seed.js` — database seed data
- `EventPulse API.postman_collection.json` — Postman API collection
- `EventPulse Environment.postman_environment.json` — shared Postman environment

## API Endpoints

### Health

| Method | Endpoint |
|---|---|
| GET | `/health` |

### Authentication

| Method | Endpoint |
|---|---|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |

### Categories

| Method | Endpoint |
|---|---|
| GET | `/api/categories` |
| GET | `/api/categories/:id` |
| POST | `/api/categories` |
| PATCH | `/api/categories/:id` |
| DELETE | `/api/categories/:id` |

### Events

| Method | Endpoint |
|---|---|
| GET | `/api/events` |
| GET | `/api/events/:id` |
| GET | `/api/events/my-events` |
| POST | `/api/events` |
| PATCH | `/api/events/:id` |
| DELETE | `/api/events/:id` |

### Registrations

| Method | Endpoint |
|---|---|
| POST | `/api/registrations` |
| GET | `/api/registrations` |
| DELETE | `/api/registrations/:id` |

### Event Messages

| Method | Endpoint |
|---|---|
| GET | `/api/messages/event/:eventId` |

## Security

- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- Role-based authorization protects restricted operations.
- Request validation is applied to relevant inputs.
- Database and secret configuration is handled through environment variables.
- Secret values are excluded from the repository.

## Delivery

The project includes:

- MongoDB Atlas production database
- Vercel production deployment
- Interactive Swagger API documentation
- Postman Collection
- Shared Postman Environment
- Structured Git workflow
- `v1.0.0` release tag
- Pull Request describing the delivered work
- Shareable GitHub repository and deployment links
