This is the BrainFlix project for BrainStation
Created by: Kyle Ingham

**BrainFlix Prototype - Server-side**  
Video Streaming Platform Prototype

Created by: Kyle Ingham

**Note:** Ensure both the client and server are running concurrently to fully utilize the application.

## Project Overview

BrainFlix is a prototype for a video streaming platform designed to demonstrate the potential of a new startup idea. The server side was developed using Express and serves as a custom API to manage video data, providing a more robust and realistic backend to better simulate a fully functional product.

### Features

1. Enables users to add, like, or delete comments with data persisting on the server.
2. Users can like videos, with likes being updated on the server.
3. Allows users to simulate uploading a video with a description, poster image and hardcoded video, with the data persisting on the server.

### Technologies Used

- Express (for API server)
- Multer (for file uploads)
- Node.js File System (fs) module (for data persistence)
- UUID (for unique identifiers)

### Challenges Faced

1. Creating a dynamic comment section where users can add, like, or delete comments with data persisting on the server.
2. Ensuring user can simulate uploading new videos.

### Future Features

1. Allow users to create accounts.

## Installation

To get started with the BrainFlix server-side application, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Ingy10/kyle-ingham-brainflix-server.git
   cd kyle-ingham-brainflix-server
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Start the Server:**

   ```bash
   npm start
   ```

4. **API Endpoint:**

   The API will be running at [http://localhost:8080/](http://localhost:8080/).

## Project Structure

- data
  - videos.json
  - public
    - images
  - routes
    - videos.js
  - .gitignore
  - .env
  - .env.sample
  - index.js
  - package.json
