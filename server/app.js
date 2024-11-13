const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const PORT = 3001;
const cors = require("cors");

const app = express();
const dbPath = path.join(__dirname, "todoApp.db");
app.use(cors());
app.use(express.json());
let database = null;
const initializeDbAndServer = async () => {
  try {
    database = await open({ filename: dbPath, driver: sqlite3.Database });
    // Create user table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

    `;

    await database.run(createTableQuery);
    app.listen(PORT, () => {
      console.log("Server Is running on http://localhost:3001");
    });
  } catch (error) {
    console.log(`Data base Error is ${error}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// Middleware to check if an email already exists
const checkUserPresent = async (request, response, next) => {
  const { email } = request.body;
  const getUserQuery = `SELECT * FROM user WHERE email = ?;`;
  const dbResponse = await database.get(getUserQuery, [email]);

  if (dbResponse) {
    response.status(400).send("User already exists");
  } else {
    next();
  }
};

// Middleware to check email in the database
const checkEmail = async (request, response, next) => {
  const { email } = request.body;
  const getUserQuery = `SELECT * FROM user WHERE email = ?;`;
  const dbResponse = await database.get(getUserQuery, [email]);

  if (!dbResponse) {
    return response.status(400).send("Invalid email");
  }

  request.user = dbResponse; // Store the user data in the request object
  next();
};

// Middleware to check password match
const checkPassword = async (request, response, next) => {
  const { password } = request.body;
  const dbResponse = request.user; // The user data stored from the previous middleware

  const isPasswordValid = await bcrypt.compare(password, dbResponse.password);
  if (isPasswordValid) {
    next();
  } else {
    response.status(400).send("Invalid password");
  }
};


//verifying jsonwebToken
const verifyToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (authHeader === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
    return;
  } else {
    jwt.verify(jwtToken, "SECRET_KEY", async (error, payload) => {
      if (error) {
        response.send("Invalid JWT Token");
      } else {
        request.username = payload.username;
        next();
      }
    });
  }
};

app.post("/register", checkUserPresent, async (request, response) => {
  const { name, email, password } = request.body;

  if (password.length < 6) {
    return response.status(400).send("Password is too short");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const createUserQuery = `
    INSERT INTO user (name, email, password)
    VALUES (?, ?, ?);
  `;
  
  await database.run(createUserQuery, [name, email, hashedPassword]);

  // Generate JWT Token after successful registration
  const payload = { email }; // Use email as the payload
  const jwtToken = jwt.sign(payload, "SECRET_KEY", { expiresIn: "1h" }); // Token expiration time is 1 hour
  response.status(201).send({ jwtToken }); // Send token to frontend
});


// API: Login with email and password
app.post("/login", checkEmail, checkPassword, async (request, response) => {
  const { email } = request.body;
  const user = request.user; // Access the user data from the checkEmail middleware

  // Create JWT token with email as payload
  const payload = { email: user.email };
  const jwtToken = await jwt.sign(payload, "SECRET_KEY", { expiresIn: "1h" });

  response.send({ jwtToken });
});

module.exports = app;

