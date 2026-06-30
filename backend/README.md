# Spur Backend API

## Backend Overview
The backend for the Spur assignment is a robust, scalable Node.js/Express application designed to handle AI-powered chat conversations. It leverages Groq's high-speed LLMs for intelligent responses, PostgreSQL for permanent chat history, and Redis for aggressive write-through caching and rate limiting. The architecture is built with TypeScript and structured to ensure separation of concerns, scalability, and resilience.

## Features
- **REST API**: Clean and predictable RESTful endpoints.
- **Session-based Conversations**: Stateless API design where the client manages the `sessionId`.
- **PostgreSQL Persistence**: Permanent storage of all chats and messages.
- **Prisma ORM**: Type-safe database queries and schema management.
- **Redis Caching**: Write-through caching pattern to serve chat histories instantly without hitting the database.
- **Rate Limiting**: IP-based rate limiting via Redis to protect expensive AI endpoints.
- **Groq LLM Integration**: Blazing fast AI responses using the `llama-3.3-70b-versatile` model.
- **Knowledge Base**: Contextual grounding of the AI to provide domain-specific answers.
- **AI Guardrails**: System prompts designed to keep the AI focused, safe, and aligned with its persona.
- **Conversation History**: LLM is fed previous messages for contextual, multi-turn conversations.
- **Prompt Engineering**: Dynamic prompt builder injecting system context, chat history, and the current query.
- **Zod Validation**: Strict runtime payload validation for all incoming requests.
- **Global Error Handling**: Centralized middleware to catch, sanitize, and format all errors securely.
- **TypeScript**: End-to-end type safety from the database layer to the API routes.
- **Environment Variable Support**: Easy configuration for different deployment environments.

## Project Structure
```text
backend/
├── src/
│   ├── config/        # External service configurations (e.g., Redis setup)
│   ├── controllers/   # Route handlers bridging HTTP requests to services
│   ├── data/          # Static knowledge bases and context files
│   ├── db/            # Prisma client instantiation
│   ├── middlewares/   # Express middlewares (Zod validation, rate limiting, error handling)
│   ├── models/        # Zod schemas for request validation
│   ├── repositories/  # Database access layer (Prisma queries)
│   ├── routes/        # Express router definitions
│   ├── services/      # Core business logic (LLM, Cache, Conversations)
│   ├── utils/         # Helper functions (Prompt builders, Cache keys)
│   ├── app.ts         # Express application configuration
│   └── index.ts       # Application entry point and server startup
├── prisma/            # Prisma schema and migrations
├── .env               # Environment configuration
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## Architecture Overview
The backend strictly follows a layered architecture to separate routing, business logic, and data access.

### Request Flow
**User**  
  ↓ *(HTTP POST /chat/message)*  
**Express Routes** *(Applies Rate Limiting & Zod Validation)*  
  ↓ *(Parsed & Validated Payload)*  
**Controllers** *(Coordinates the workflow)*  
  ↓ *(Calls specific services)*  
**Services** *(Applies business logic: LLM calls, Caching, Structuring)*  
  ↓ *(Calls repositories)*  
**Repository / Prisma** *(Executes SQL)*  
  ↓ *(Data saved)*  
**PostgreSQL**

### Integration Points
- **Redis**: Sits alongside the Services layer. Used by the rate limiter middleware before requests reach the controller, and heavily utilized in `chat.controller.ts` for Write-Through caching of chat histories.
- **Groq LLM**: Accessed via `llm.service.ts` during the message creation workflow to generate AI replies based on the prompt.
- **Knowledge Base**: Injected dynamically via `prompt.builder.ts` before the payload is sent to Groq.

## Redis Strategy
The application uses a **Write-Through caching pattern** combined with **Rate Limiting**.
- **PostgreSQL as Source of Truth**: All messages are permanently stored in Postgres to ensure zero data loss.
- **Redis Cache Updates**: When a new message is sent, it is saved to Postgres and immediately *appended* to the Redis cache list (Write-Through). This ensures the cache is always warm. 
- **Lightning Reads**: When a user reloads the page, `GET /chat/history/:sessionId` fetches the array directly from Redis, bypassing Postgres entirely.
- **Rate Limiting**: Redis is used as the backing store for `express-rate-limit`, tracking IP request counts across potentially distributed server instances to prevent abuse.

## Database
The database is managed by Prisma and contains two primary models:
- **Conversation**: Represents a chat session. Unique by `sessionId`.
- **Message**: Represents a single turn in the conversation.
  - **Relationship**: A `Conversation` has a 1-to-Many relationship with `Message`.
  - Messages store the `text`, `sender` (enum: `user` or `ai`), and are linked via `conversationId`.

## API Endpoints

### 1. Send Message
Processes a user message, stores it, fetches the AI reply, and updates the cache.

**POST** `/chat/message`

*Request Example:*
```json
{
  "sessionId": "usr_12345abcde",
  "message": "What services do you offer?"
}
```

*Response Example (200 OK):*
```json
{
  "reply": "We offer AI integration and custom software development.",
  "sessionId": "usr_12345abcde"
}
```

### 2. Get Chat History
Fetches the full conversation history for a given session, prioritizing the Redis cache.

**GET** `/chat/history/:sessionId`

*Response Example (200 OK):*
```json
{
  "messages": [
    {
      "id": "msg_987",
      "role": "user",
      "content": "Hi there",
      "timestamp": "2026-07-01T12:00:00Z"
    },
    {
      "id": "msg_988",
      "role": "assistant",
      "content": "Hello! How can I help you today?",
      "timestamp": "2026-07-01T12:00:02Z"
    }
  ]
}
```

## Environment Variables
Create a `.env` file in the root of the backend directory.

```env
# The connection string for your PostgreSQL database (used by Prisma)
PRISMA_URL="postgresql://user:pass@host:5432/db"

# API Key for Groq Cloud to process LLM inferences
GROQ_API_KEY="gsk_..."

# (Optional) Port the Express server will listen on. Defaults to 3000
PORT=3000

# (Optional) Maximum length allowed for a user's input message
MAX_MESSAGE_LENGTH=1000

# Connection string for Upstash/Redis instance used for caching and rate limiting
REDIS_URL="rediss://default:pass@host:port"
```

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Migration & Prisma Generation**
   Ensure your `PRISMA_URL` is set, then run:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Running Redis**
   You can either run Redis locally via Docker (`docker run -p 6379:6379 -d redis`) or use a managed service like Upstash and set the `REDIS_URL`.

4. **Start Development Server**
   Runs the server using `tsx` with hot-reloading.
   ```bash
   npm run dev
   ```

## Build & Production

To deploy the application to production:

1. **Build the TypeScript code**
   ```bash
   npm run build
   ```
   *This compiles all code into the `dist/` directory.*

2. **Start the Production Server**
   ```bash
   npm start
   ```

## Error Handling
The backend features a robust error-handling pipeline to ensure stability and security:
- **Global Error Middleware**: Catch-all middleware that intercepts all unhandled errors, logs the full stack trace on the server, and returns a sanitized `{ success: false, message: "..." }` to the client.
- **Validation**: Zod enforces strict schema types. Invalid payloads return a 400 status with a clean message.
- **LLM Failures**: Groq SDK errors (Rate limits, Authentication, Provider downtime) are caught and mapped to user-friendly 429 or 502 HTTP errors without exposing API keys.
- **Redis Failures**: Redis is treated as ephemeral. If caching fails, the error is logged and the app falls back to PostgreSQL gracefully without crashing the user's request.
- **Database Failures**: Prisma errors are mapped to generic 500 errors to avoid leaking database schema details in the response.

## Trade-offs
To keep the assignment scope focused and maintainable, the following trade-offs were made:
- **No Authentication**: The API relies on client-provided `sessionId` strings rather than robust JWT/OAuth user authentication.
- **In-Memory/File Knowledge Base**: The domain knowledge is injected statically via files/constants rather than a dedicated Vector Database (RAG).
- **Basic Rate Limiting**: IP-based rate limiting is used, which can be overly aggressive for users behind corporate NATs.
