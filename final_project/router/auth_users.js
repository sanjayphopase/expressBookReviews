const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;  // Extract ISBN from URL params
  const review = req.query.review;  // Extract review from query params
  const username = req.user;  // Get the username from session

  if (!username) {
    return res.status(401).json({ message: "You must be logged in to submit a review." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required." });
  }

  // Get the reviews object for the current book
  const bookReviews = books[isbn].reviews;
  bookReviews[username] = review;
  return res.status(200).json({message: "Review added/updated successfully.", review: review});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;  // Extract ISBN from URL params
    const username = req.user;  // Get the username from session
  
    if (!username) {
      return res.status(401).json({ message: "You must be logged in to submit a review." });
    }
  
    // Get the reviews object for the current book
    const bookReviews = books[isbn].reviews;
    // Delete the review for the book
    delete bookReviews[username];
    return res.status(200).json({ message: "Review deleted successfully." });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
