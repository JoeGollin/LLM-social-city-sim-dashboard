# AI Agent Implementation Plan: Dynamic Social Media Simulation

This document provides a detailed step-by-step implementation plan for an AI agent to follow when coding the full-stack application that simulates social media posts using a local LLM (Ollama).

---

## 1. Initial Setup

### Frontend

1. **Bootstrap the React Application:**
   - Open a terminal.
   - Navigate to the desired directory for your project.
   - Run the command: `npx create-react-app city-social-sim`
   - Wait for the setup to complete, then navigate into the project directory: `cd city-social-sim`

2. **Install Frontend Dependencies:**
   - In the project directory, run the command:
     ```
     npm install @mui/material @emotion/react @emotion/styled axios react-grid-layout socket.io-client
     ```
   - Verify installation by checking `package.json` for the added dependencies.

### Backend

1. **Initialize Node.js Project:**
   - Open a terminal.
   - Navigate to the backend directory (create one if it doesn't exist).
   - Run the command: `npm init -y`
   - Confirm that a `package.json` file is created.

2. **Install Backend Dependencies:**
   - Run the command:
     ```
     npm install express mongoose axios socket.io node-cron sentiment
     ```
   - Verify installation by checking `package.json` for the added dependencies.

3. **Install Testing Libraries:**
   - Run the command:
     ```
     npm install --save-dev jest supertest
     ```
   - Confirm that `jest` and `supertest` are listed under `devDependencies` in `package.json`.

---

## 2. Database & Models

1. **Define Mongoose Schemas:**
   - Create a new directory `models` in the backend project.
   - **City Schema:**
     - Create a file `City.js`.
     - Define fields: `name`, `powerGridStatus`, `weather`, etc.
   - **Post Schema:**
     - Create a file `Post.js`.
     - Define fields: `content`, `timestamp`, `sentimentScore`, `cityRef`.

---

## 3. API & Scheduler Development

1. **Develop Backend API (Express):**
   - Set up an Express server in `server.js`.
   - Create a new directory `routes`.
   - **City Management Endpoints:**
     - Create a file `cities.js` in `routes`.
     - Implement CRUD operations for `/api/cities`.
   - **Post Generation Endpoints:**
     - Add endpoint for setting/updating post generation interval.
     - Add endpoint for triggering post generation `/api/generate`.

2. **Implement Dynamic Post Scheduler:**
   - Use `node-cron` or `setInterval` in `server.js`.
   - Schedule post generation based on city data.
   - Construct prompts and call the Ollama LLM API.
   - Run sentiment analysis on generated posts.
   - Store results in the database.
   - Broadcast new posts using Socket.IO.

---

## 4. LLM & Sentiment Integration

1. **Build LLM Integration Module:**
   - Create a new directory `services`.
   - Create a file `llmService.js`.
   - Implement a function to construct dynamic prompts.
   - Use Axios to call the Ollama API and retrieve posts.

2. **Implement Sentiment Analysis:**
   - In `services`, create a file `sentimentService.js`.
   - Process posts using the sentiment analysis library.
   - Store sentiment scores with posts in the database.

---

## 5. Frontend Dashboard Development

1. **Create Dashboard Layout:**
   - Use `react-grid-layout` to design a modular dashboard.
   - Develop components for city state, social media feed, sentiment overview, and control panel.

2. **Integrate Real-Time Updates:**
   - Use Socket.IO client to listen for updates from the backend.
   - Update the UI in real-time as new posts are generated.

3. **Enable Module Customization:**
   - Provide UI controls for adding, removing, or rearranging dashboard modules.

---

## 6. Testing

1. **Backend Testing:**
   - Write unit tests for API endpoints and scheduler using Jest and Supertest.
   - Ensure all tests pass before proceeding.

2. **Frontend Testing:**
   - Use React Testing Library for component testing.
   - Validate that components render correctly and handle updates.

3. **End-to-End Testing:**
   - Set up Cypress to test the overall workflow.
   - Simulate user interactions and verify application behavior.

---

## 7. Deployment

1. **Containerization:**
   - Create Dockerfiles for frontend, backend, and MongoDB.
   - Use docker-compose to orchestrate containers.
   - Test the application in a containerized environment.

2. **CI/CD Pipeline:**
   - Configure GitHub Actions for automated testing and deployment.
   - Ensure the pipeline runs tests and deploys only on successful builds.

---

## 8. Resources & References

- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [react-grid-layout GitHub](https://github.com/react-grid-layout/react-grid-layout)
- [Express Documentation](https://expressjs.com/)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [node-cron GitHub](https://github.com/node-cron/node-cron)
- [Sentiment Analysis (npm package)](https://www.npmjs.com/package/sentiment)
- [Ollama Official Site](https://ollama.ai/)

---

This expanded plan provides a detailed, step-by-step guide for the AI agent, ensuring clarity and precision in the implementation of the application.