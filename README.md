
# Project Title
A brief description of what this project does and who it's for

# Overview
The goal of this project is to develop a simple yet functional calendar feature that enables users to create, view, edit, and delete events or meetings in their personal calendars. The application will have a user-friendly interface and robust backend to ensure seamless interaction with calendar events. User authentication will be implemented to ensure that users can manage their own events securely.

# Technology Stack
- Frontend: ReactJS, Material UI
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Prisma
- Authentication: Firebase

# Prerequisites
Make sure you have the following installed on your machine:
- Node.js (v14 or higher)
- npm (Node Package Manager)

# Installation
## Backend
1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/AbhradeepMukherjee/CalenderApp.git
   cd your-repo-name/backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a .env file in the backend directory and add the environment variables (e.g., database connection string, Firebase API keys).
4. Run database migrations
## Frontend
1. In a new terminal, navigate to the frontend directory:
   \`\`\`bash
   cd /frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a .env file in the frontend directory and add the environment variables (e.g., backend url, Firebase API keys)

# Running the Application
1. Start the Backend
     In the backend directory, run:
   \`\`\`bash
   npm start
   \`\`\`
2. Start the Frontend
   In the frontend directory, run:
    \`\`\`bash
   npm run dev
   \`\`\`
3. Open your browser and go to http://localhost:5173 to view the application.

# Core Features
## User Authentication
- Implemented basic user authentication using an off-the-shelf service Firebase.
- Users can log in and manage their calendar events post-authentication.

## Calendar Features
1. Event Creation: Users can create events with the following details:
- Title
- Date & Time
- Description
2. Event Management: Users can view a list of all their events/meetings.
3. Editing: Users can edit existing events/meetings to update their details.
4. Deletion: Users can delete events/meetings that are no longer needed.

## Backend (Node.js and Express)

- Designed a simple REST API to manage CRUD (Create, Read, Update, Delete) operations for calendar events.
- Used a PostgreSQL database to store events securely.
- Ensured that users can only access their own events to maintain privacy.

## Frontend (ReactJS and Material UI)

- Created an intuitive and responsive user interface that allows users to easily display and manage their events.
- Implemented forms for event creation and editing, along with a list or calendar view to showcase events (weekly and monthly too).
- Utilized a UI library, Material-UI to streamline the design process.

# Screenshots

## Login Page

![login](https://github.com/user-attachments/assets/69a2b9e5-aff2-4aa5-9dd5-b5b266f63c1c)

## Signup Page

![Screenshot from 2024-09-22 21-23-23](https://github.com/user-attachments/assets/eba4a750-afa6-448a-a529-bd4b688331e6)

## Home Page (with this week's events)

![Screenshot from 2024-09-22 21-23-04](https://github.com/user-attachments/assets/2762d443-6682-4ce8-8df6-516544d74d20)

## Home Page (with this month's events)

![Screenshot from 2024-09-22 21-22-58](https://github.com/user-attachments/assets/d461939a-8c90-4256-b233-28119a825d2e)

## Update Event

![Screenshot from 2024-09-22 21-22-19](https://github.com/user-attachments/assets/38f314c8-f255-4a8d-ab2f-5ee61e0f7140)

## Create Event

![Screenshot from 2024-09-22 21-22-07](https://github.com/user-attachments/assets/5098f7af-cc6e-48de-9d20-f8c51c8501c6)

## View Event

![Screenshot from 2024-09-22 21-22-14](https://github.com/user-attachments/assets/aa2dc64f-a59e-44b5-a048-04f3a71f852e)

# A video demonstration showcasing the functionality of the complete project
- From Signup, Login to Create, View, Delete, and Update Events
- PS: Please ignore the "Change your password" recommendation from Google password manager for my weak password 

[Screencast from 2024-09-22 23-23-38.webm](https://github.com/user-attachments/assets/a9ae5f40-7734-4f4c-85b3-8471f3c59593)

