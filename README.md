# DevConnect

**DevConnect** is a social platform for developers featuring posts, discussions, events, and curated tech news. It enables authenticated interactions, real-time engagement, and developer networking through secure JWT sessions, responsive UI, and powerful data aggregation.

---

## Tech Stack

- **Frontend Framework**: [React.js](https://react.dev/)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Backend Framework**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **External APIs**: [NewsAPI](https://newsapi.org/) + [Nodemailer (Gmail SMTP)](https://nodemailer.com/about/)

---

## Features

- **Developer Social Platform**: Built a full-stack community app for developers to post updates, join discussions, attend events, and read curated tech news.  
- **Secure Authentication**: Implemented cookie-based JWT authentication and email OTP verification for safe login and registration.  
- **Session Persistence**: Enabled secure HTTP-only cookies with automatic session restoration on refresh.  
- **MongoDB Aggregations**: Designed efficient data aggregations to enrich posts, discussions, and replies with author metadata.  
- **Optimistic UI Updates**: Delivered a real-time feel using optimistic Redux updates and modal-driven post creation.  
- **Events Module**: Built an events system allowing users to create, join, and view their registered events.  
- **News Integration**: Integrated NewsAPI to display live, curated tech headlines for developers.  
- **Email Notifications**: Configured Nodemailer with Gmail SMTP for OTPs and event notifications.  
- **Responsive Design**: Built a clean and mobile-friendly React UI using Bootstrap and component-based layouts.  

---

## Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/your-username/devconnect.git
cd devconnect

# 2️⃣ Install and run the server
cd server
npm install
cp .env.example .env   # Add environment variables (Mongo URI, JWT secret, Gmail SMTP, NewsAPI key, etc.)
npm run dev

# 3️⃣ Install and run the client
cd ../client
npm install
npm start

# 4️⃣ Access the app
# Open your browser at http://localhost:3000
