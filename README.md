# Fake Bank API

A NestJS backend for managing users and transactions with balance updates.  
Clean architecture, TypeORM, and solid error handling.  

---

## Getting Started

### Prerequisites

- Node.js v18+ (LTS recommended)  
- npm or yarn  
- PostgreSQL database running and accessible

---

### Setup

1. **Clone the repo**

```bash
git clone git@github.com:ptrcdev/fake-bank-challenge.git
cd fake-bank-challenge
```

2. Install dependencies for each directory

```bash
cd fake-bank
npm install
# and
cd fake-bank-frontend
npm install
```

3. Configure environment variables

Create a .env file in the root of each directory (or copy .env.example) with your database settings and any other necessary config.

Example for backend: 

```ini
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=fake_bank
JWT_SECRET=your_jwt_secret
```

4. Start the app

```bash
docker-compose up --build
```
The GraphQL will run on `http://localhost:3000/graphql` by default.

## Verify Everything Works

### Run tests for backend

```bash
cd fake-bank
npm run test
```
This will run all unit tests using Jest. Make sure all tests pass before pushing or deploying.

### Check API endpoints
Once running, you can verify endpoints with:

- Postman/Insomnia

- Curl requests

### Example Deposit Request for an Authenticated User (GraphQL)

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "mutation { deposit(amount: 50) { id type amount postBalance } }"}'
```
Check user balance updates accordingly.

Or simply go to `http://localhost:3000/graphql` and try it out on the playground.

## Tech Stack
- NestJS

- TypeORM

- PostgreSQL

- Jest for testing

- GraphQL

- Next.js

## Notes
Make sure your PostgreSQL is running and accessible before starting the app.

Password hashing and auth logic handled in the AuthService, so pass already hashed passwords when creating users manually.

## 🐳 Containerization with Docker

### Backend

### 1. Service Architecture

- PostgreSQL v15
- NestJS App (exposed on port 3000)

### 2. Create a `.env` file

```ini
DB_HOST=db
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=password
DB_NAME=fake-bank
JWT_SECRET=eab375d745ecabb51c9ce3f249e2f4ee34b9b4a9dddd17d3547892067149c94d
```
### 3. Dockerfile
```Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env .env

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

## 🐳 Containerization with Docker

### Frontend

### 1. Service Architecture

- Next.js (exposed on port 3001)

### 2. Create a `.env` file

```ini
NEXT_PUBLIC_API_URL=http://localhost:3000/graphql
```
### 3. Dockerfile
```Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start"]
```

## Note
To run both services, run `docker-compose up --build` and access the frontend at `http://localhost:3001`