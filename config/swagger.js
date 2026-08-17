const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EventPulse API",
      version: "1.0.0",
      description: "Event management REST API",
    },
    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "665f1a2b3c4d5e6f78901234",
            },
            name: {
              type: "string",
              example: "Omar",
            },
            email: {
              type: "string",
              example: "omar@example.com",
            },
            role: {
              type: "string",
              enum: ["admin", "attendee"],
              example: "attendee",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "665f1a2b3c4d5e6f78901234",
            },
            name: {
              type: "string",
              example: "Technology",
            },
            description: {
              type: "string",
              example: "Technology related events",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Event: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "665f1a2b3c4d5e6f78901234",
            },
            title: {
              type: "string",
              example: "Node.js Workshop",
            },
            description: {
              type: "string",
              example: "Backend development workshop",
            },
            date: {
              type: "string",
              format: "date-time",
            },
            location: {
              type: "string",
              example: "Cairo",
            },
            capacity: {
              type: "integer",
              example: 50,
            },
            category: {
              type: "object",
            },
            organizer: {
              type: "object",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Registration: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "665f1a2b3c4d5e6f78901234",
            },
            user: {
              type: "string",
            },
            event: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Message: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            sender: {
              type: "object",
            },
            event: {
              type: "object",
            },
            message: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Resource not found",
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

swaggerSpec.paths = {
  "/health": {
    get: {
      tags: ["Health"],
      summary: "Check server and database health",
      responses: {
        200: {
          description: "Server and database status",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "ok",
                  },
                  server: {
                    type: "string",
                    example: "up",
                  },
                  database: {
                    type: "string",
                    example: "connected",
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  "/api/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password"],
              properties: {
                name: {
                  type: "string",
                  example: "Omar",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "omar@example.com",
                },
                password: {
                  type: "string",
                  minLength: 6,
                  example: "password123",
                },
                role: {
                  type: "string",
                  enum: ["admin", "attendee"],
                  example: "attendee",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "User registered successfully",
        },
        400: {
          description: "Validation error or email already exists",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },

  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "omar@example.com",
                },
                password: {
                  type: "string",
                  example: "password123",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
        },
        400: {
          description: "Validation error",
        },
        401: {
          description: "Invalid email or password",
        },
      },
    },
  },

  "/api/events": {
    get: {
      tags: ["Events"],
      summary: "Get all events",
      parameters: [
        {
          name: "category",
          in: "query",
          schema: {
            type: "string",
          },
        },
        {
          name: "location",
          in: "query",
          schema: {
            type: "string",
          },
        },
        {
          name: "date",
          in: "query",
          schema: {
            type: "string",
            format: "date",
          },
        },
        {
          name: "search",
          in: "query",
          description: "Searches title and description",
          schema: {
            type: "string",
          },
        },
        {
          name: "sort",
          in: "query",
          schema: {
            type: "string",
            enum: ["date", "-date", "capacity", "-capacity", "title", "-title"],
          },
        },
        {
          name: "page",
          in: "query",
          schema: {
            type: "integer",
            default: 1,
          },
        },
        {
          name: "limit",
          in: "query",
          schema: {
            type: "integer",
            default: 10,
          },
        },
      ],
      responses: {
        200: {
          description: "Events retrieved successfully",
        },
      },
    },

    post: {
      tags: ["Events"],
      summary: "Create an event",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "title",
                "description",
                "date",
                "location",
                "capacity",
                "category",
              ],
              properties: {
                title: {
                  type: "string",
                  example: "Node.js Workshop",
                },
                description: {
                  type: "string",
                  example: "Backend development workshop",
                },
                date: {
                  type: "string",
                  format: "date-time",
                },
                location: {
                  type: "string",
                  example: "Cairo",
                },
                capacity: {
                  type: "integer",
                  minimum: 1,
                  example: 50,
                },
                category: {
                  type: "string",
                  example: "665f1a2b3c4d5e6f78901234",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Event created successfully",
        },
        400: {
          description: "Validation error",
        },
        401: {
          description: "Authentication required",
        },
        403: {
          description: "Admin role required",
        },
      },
    },
  },

  "/api/events/my-events": {
    get: {
      tags: ["Events"],
      summary: "Get events created by the authenticated admin",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Events retrieved successfully",
        },
        401: {
          description: "Authentication required",
        },
        403: {
          description: "Admin role required",
        },
      },
    },
  },

  "/api/events/{id}": {
    get: {
      tags: ["Events"],
      summary: "Get event by ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Event retrieved successfully",
        },
        404: {
          description: "Event not found",
        },
      },
    },

    patch: {
      tags: ["Events"],
      summary: "Update an event",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                date: {
                  type: "string",
                  format: "date-time",
                },
                location: {
                  type: "string",
                },
                capacity: {
                  type: "integer",
                  minimum: 1,
                },
                category: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Event updated successfully",
        },
        400: {
          description: "Validation error",
        },
        401: {
          description: "Authentication required",
        },
        403: {
          description: "Access denied or admin role required",
        },
        404: {
          description: "Event not found",
        },
      },
    },

    delete: {
      tags: ["Events"],
      summary: "Delete an event",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Event deleted successfully",
        },
        401: {
          description: "Authentication required",
        },
        403: {
          description: "Access denied or admin role required",
        },
        404: {
          description: "Event not found",
        },
      },
    },
  },

  "/api/categories": {
    get: {
      tags: ["Categories"],
      summary: "Get all categories",
      responses: {
        200: {
          description: "Categories retrieved successfully",
        },
      },
    },

    post: {
      tags: ["Categories"],
      summary: "Create a category",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: {
                  type: "string",
                  example: "Technology",
                },
                description: {
                  type: "string",
                  example: "Technology related events",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Category created successfully",
        },
        400: {
          description: "Validation error or category already exists",
        },
        401: {
          description: "Authentication required",
        },
        403: {
          description: "Admin role required",
        },
      },
    },
  },

  "/api/categories/{id}": {
    get: {
      tags: ["Categories"],
      summary: "Get category by ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Category retrieved successfully",
        },
        404: {
          description: "Category not found",
        },
      },
    },

    patch: {
      tags: ["Categories"],
      summary: "Update a category",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Category updated successfully",
        },
        400: {
          description: "Validation error",
        },
        401: {
          description: "Authentication required",
        },
        403: {
          description: "Admin role required",
        },
        404: {
          description: "Category not found",
        },
      },
    },

    delete: {
      tags: ["Categories"],
      summary: "Delete a category",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Category deleted successfully",
        },
        401: {
          description: "Authentication required",
        },
        403: {
          description: "Admin role required",
        },
        404: {
          description: "Category not found",
        },
      },
    },
  },

  "/api/registrations": {
    post: {
      tags: ["Registrations"],
      summary: "Register for an event",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["eventId"],
              properties: {
                eventId: {
                  type: "string",
                  example: "665f1a2b3c4d5e6f78901234",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Registered for event successfully",
        },
        400: {
          description: "Validation error, already registered, or event is full",
        },
        401: {
          description: "Authentication required",
        },
        403: {
          description: "Attendee role required",
        },
        404: {
          description: "Event not found",
        },
      },
    },

    get: {
      tags: ["Registrations"],
      summary: "Get my event registrations",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Registrations retrieved successfully",
        },
        401: {
          description: "Authentication required",
        },
        403: {
          description: "Attendee role required",
        },
      },
    },
  },

  "/api/registrations/{id}": {
    delete: {
      tags: ["Registrations"],
      summary: "Cancel my registration",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Registration cancelled successfully",
        },
        401: {
          description: "Authentication required",
        },
        403: {
          description: "Access denied or attendee role required",
        },
        404: {
          description: "Registration not found",
        },
      },
    },
  },

  "/api/messages/event/{eventId}": {
    get: {
      tags: ["Announcements"],
      summary: "Get announcements for an event",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "eventId",
          in: "path",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Event messages retrieved successfully",
        },
        400: {
          description: "Invalid event ID",
        },
        401: {
          description: "Authentication required",
        },
        403: {
          description: "Access denied or attendee is not registered",
        },
        404: {
          description: "Event not found",
        },
      },
    },
  },
};

module.exports = swaggerSpec;