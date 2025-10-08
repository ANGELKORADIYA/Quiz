# Quiz Application

This repository contains a **web application for creating and taking quizzes**.
It allows **faculty members** to create quizzes with multiple-choice questions, and **students** to take these quizzes and view their results.

The application is built using **Node.js**, **Express**, **MongoDB**, and **JWT** for authentication.

---

## 📁 Folder Structure

```
angelkoradiya-quiz/
├── db.js                 # Handles database operations for user authentication and signup
├── dbquiz.js             # Handles database operations for quiz creation, questions, and responses
├── package.json          # Lists project dependencies and scripts
├── server.js             # Main server file with routing and middleware setup
└── public/               # Contains static files
    ├── faculty.html          # Faculty quiz creation page
    ├── faculty_update.html   # Faculty quiz update page
    ├── login.html            # Login/signup page
    ├── response.html         # Faculty view for student responses
    ├── result.html           # Student results page
    ├── student.html          # Student quiz-taking page
    └── style.css             # Stylesheet for the application
```

---

## ⚙️ Key Files and Functionality

### **`db.js`**

Manages **user authentication**.

**Exports:**

* `signup` – Registers new users, checks for existing emails, and hashes passwords using bcrypt.
* `login` – Authenticates users, creates a JWT token, and sets it as a cookie.
* `valid` – Verifies JWT token and returns the user's page type (faculty or student).
* `email` – Extracts the user's email from the JWT token.

---

### **`dbquiz.js`**

Handles **quiz-related database operations**.

**Exports:**

* `indexxx` – Creates a new quiz structure (title, COs) and ensures the title is unique per faculty.
* `questionsss` – Adds questions and answers to an existing quiz.
* `answerfromstudent` – Saves student answers and calculates scores.
* `kitteninfo` – Returns available quizzes for students or created quizzes for faculty.
* `responseinfo` – Retrieves student responses for faculty.
* `resultinfo` – Returns quiz results for students.

---

### **`server.js`**

Main entry point of the application.

**Handles:**

* Express server and middleware setup (`body-parser`, `cookie-parser`).
* Routes for:

  * **Authentication:** `/login`, `/signup`, `/logined/logout`
  * **Faculty quiz creation:** `/logined/faculty/create/indexxx`
  * **Faculty quiz update:** `/logined/faculty/update/questionsss`
  * **Student quiz submission:** `/logined/:pagee/answerrr`
  * **Fetching quiz data:** `/logined/:pagee/update/kitten`, `/logined/:pagee/quizinfo`
  * **Responses and results:** `/logined/:pagee/response/kitten`, `/logined/:pagee/resulttttss`
* Serves static files from the `public` directory.
* Uses JWTs and cookies for secure session management.

---

## 🖼️ Public Directory Overview

| File                  | Description                             |
| --------------------- | --------------------------------------- |
| `faculty.html`        | Faculty page to create a quiz           |
| `faculty_update.html` | Faculty page to update existing quizzes |
| `login.html`          | Login and signup page                   |
| `response.html`       | Faculty page to view student responses  |
| `result.html`         | Student page to view quiz results       |
| `student.html`        | Student page to take quizzes            |
| `style.css`           | Main stylesheet for the app             |

---

## 🔁 Sequence Diagram: Quiz Creation by Faculty

```mermaid
sequenceDiagram
    participant Faculty (Browser)
    participant Server (server.js)
    participant db.js
    participant dbquiz.js
    participant MongoDB

    Faculty->>Server: Access /logined/faculty/create (faculty.html)
    Server->>Faculty: Respond with faculty.html

    Faculty->>Server: Submit quiz structure (POST /logined/faculty/create/indexxx)
    Server->>dbquiz.js: Call indexxx(req)

    dbquiz.js->>db.js: Call valid(req) to authenticate
    db.js->>MongoDB: Verify JWT Token
    MongoDB-->>db.js: Return user role
    db.js-->>dbquiz.js: Return authentication status ("faculty")

    dbquiz.js->>db.js: Call email(req) to get faculty email
    db.js->>MongoDB: Get user email from token
    MongoDB-->>db.js: Return email
    db.js-->>dbquiz.js: Return faculty email

    dbquiz.js->>MongoDB: Check if quiz title exists for faculty email
    MongoDB-->>dbquiz.js: Return check result

    alt Title does not exist
        dbquiz.js->>MongoDB: Create quiz structure
        MongoDB-->>dbquiz.js: Acknowledge creation
        dbquiz.js-->>Server: Return success (true)
        Server->>Faculty: Respond with success status (200)
    else Title exists
        dbquiz.js-->>Server: Return error message
        Server->>Faculty: Respond with error status (401)
    end
```

---

## 📦 Dependencies

| Package           | Purpose                            |
| ----------------- | ---------------------------------- |
| **bcrypt**        | Password hashing                   |
| **body-parser**   | Parsing request bodies             |
| **cookie-parser** | Handling cookies                   |
| **dotenv**        | Managing environment variables     |
| **express**       | Web server framework               |
| **jsonwebtoken**  | Creating and verifying JWTs        |
| **mongoose**      | MongoDB object modeling            |
| **nodemon**       | Auto-restarting during development |
| **path**          | Handling file paths                |

---

## 🔐 Environment Variables

Create a `.env` file with the following keys:

| Variable       | Description                |
| -------------- | -------------------------- |
| `DB_URL`       | MongoDB connection string  |
| `SECRET_KEY`   | Secret key for JWT signing |
| `PASSWORD_KEY` | Salt rounds for bcrypt     |

---

## 🚀 Running the Application

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file and add required environment variables.

3. Start the server:

   * For development:

     ```
     npm run dev
     ```
   * For production:

     ```
     npm start
     ```

4. Open your browser and go to:
   [https://quiz-minimal.onrender.com](https://quiz-minimal.onrender.com)

---

## 📄 License
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

---
**Developed with ❤️ using Node.js, Express, and MongoDB.**
