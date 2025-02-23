# Full Stack App Development Plan: Dynamic Social Media Simulation

This plan outlines the development of a full-stack application that simulates social media posts using a local LLM (Ollama). The app will allow you to configure a fictional city's state, set customizable intervals for post generation, and display a modular dashboard with current city state, a live stream of social media posts, and sentiment analysis.

---

## 1. Technology Stack

### Frontend
- **Framework:** React (using Create React App)
- **UI Library:** Material-UI (MUI)
- **Dashboard Layout:** react-grid-layout (draggable/resizable modules)
- **Real-Time Updates:** Socket.IO client
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Scheduler:** node-cron or setInterval for dynamic post generation
- **WebSocket:** Socket.IO server for real-time updates
- **Sentiment Analysis:** Use a library like `sentiment` or an external API
- **HTTP Client:** Axios (for LLM calls)

### Database
- **Database:** MongoDB with Mongoose

### Local LLM Integration
- **Tool:** Ollama (accessed via its HTTP API)

### Deployment & DevOps
- **Containerization:** Docker, docker-compose
- **CI/CD:** GitHub Actions
- **End-to-End Testing:** Cypress

---

## 2. System Architecture

### Backend Services
- **City Management & Configuration API**
  - CRUD endpoints for city state (e.g., power grid status, weather, events)
  - Endpoint to update the post generation interval

- **Dynamic Post Generator**
  - A scheduler that triggers prompt construction (using current city data) at a customizable interval
  - Calls the Ollama LLM API to generate social media posts
  - Runs sentiment analysis on each post and stores the results

- **Real-Time Communication**
  - Socket.IO server pushes new posts, city state updates, and sentiment data to connected clients

### Frontend Dashboard
- **Modular Components**
  - **City State Module:** Displays current parameters and events
  - **Social Media Feed Module:** Streams live posts
  - **Sentiment Module:** Shows overall sentiment (numerical score, graph/trend)
  - **Control Panel Module:** Allows admins to update configurations (including post interval) and rearrange modules via drag/drop

- **Customization**
  - Use react-grid-layout to add, remove, or rearrange modules dynamically

---

## 3. Implementation Steps

### Step 1: Initial Setup
- **Frontend:**
  - Bootstrap using Create React App:  
    ```bash
    npx create-react-app city-social-sim
    ```
  - Install dependencies:
    ```bash
    npm install @mui/material @emotion/react @emotion/styled axios react-grid-layout socket.io-client
    ```
- **Backend:**
  - Initialize Node.js project:
    ```bash
    npm init -y
    ```
  - Install dependencies:
    ```bash
    npm install express mongoose axios socket.io node-cron sentiment
    ```
  - Install testing libraries:
    ```bash
    npm install --save-dev jest supertest
    ```

### Step 2: Database & Models
- Define Mongoose schemas:
  - **City:** Fields such as name, power grid status, weather, and other parameters.
  - **Post:** Fields for content, timestamp, sentiment score, and a reference to the city.

### Step 3: API & Scheduler Development
- **Backend API Development (Express):**
  - Create endpoints for:
    - Managing city configuration (`/api/cities`)
    - Setting/updating the post generation interval
    - Triggering post generation (`/api/generate`)
- **Dynamic Post Scheduler:**
  - Use node-cron or setInterval to schedule post generation based on a configurable interval.
  - Within the scheduled task:
    - Construct a prompt using current city data.
    - Call the Ollama LLM API.
    - Process and store the generated post after running sentiment analysis.
    - Broadcast the new post via Socket.IO.

### Step 4: LLM & Sentiment Integration
- **LLM Integration Module (e.g., `llmService.js`):**
  - Build a function to construct a dynamic prompt (e.g., "Generate a tweet for [City Name] where the power grid is down...").
  - Use Axios to call the Ollama API and retrieve the generated post.
- **Sentiment Analysis:**
  - Process the generated post using the sentiment analysis library.
  - Store the sentiment score along with the post in the database.

### Step 5: Frontend Dashboard Development
- **Dashboard Layout:**
  - Use react-grid-layout to create a modular dashboard.
  - Develop individual components for:
    - City State display
    - Social Media Feed
    - Sentiment Overview
    - Control Panel (for updating city state and post interval)
- **Real-Time Updates:**
  - Integrate the Socket.IO client to listen for live updates from the backend.
- **Module Customization:**
  - Provide UI controls to dynamically add, remove, or rearrange dashboard modules.

### Step 6: Testing
- **Backend Testing:**
  - Write unit tests for API endpoints and the scheduler using Jest and Supertest.
- **Frontend Testing:**
  - Use React Testing Library for component testing.
- **End-to-End Testing:**
  - Set up Cypress to test the overall workflow (city configuration → post generation → dashboard display).

### Step 7: Deployment
- **Containerization:**
  - Create Dockerfiles for the frontend, backend, and MongoDB.
  - Use docker-compose to orchestrate the containers.
- **CI/CD Pipeline:**
  - Configure GitHub Actions to automate testing and deployment.

---

## 4. Resources & References
- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [react-grid-layout GitHub](https://github.com/react-grid-layout/react-grid-layout)
- [Express Documentation](https://expressjs.com/)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [node-cron GitHub](https://github.com/node-cron/node-cron)
- [Sentiment Analysis (npm package)](https://www.npmjs.com/package/sentiment)
- [Ollama Official Site](https://ollama.ai/)

---
