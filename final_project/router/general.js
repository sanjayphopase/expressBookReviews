const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

let userList = [];
// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check payload has both username and password
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Please provide both username & password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    return res.status(200).json({
        book
    });
  }
  return res.status(404).json({message: "Invalid isbn"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let requestedAuthor = req.params.author;
  let list = [];
  for(let bookIsbn of Object.keys(books)){
    if(books[bookIsbn].author === requestedAuthor) 
        list.push(books[bookIsbn]);
  }
  return res.status(200).json({list});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let reqTitle = req.params.title;
  for(let bookIsbn of Object.keys(books)){
    if(books[bookIsbn].title === reqTitle) {
        //here directly returning a single book data by assuming all titles are unique
        var book = books[bookIsbn];
        return res.status(200).json(books[bookIsbn]);
    }
    
  }
  return res.status(404).json({message: "No book found for given title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let review = books[isbn]["reviews"];
  if(review){
    return res.status(200).json({
        review
    });
  }
  return res.status(404).json({message: "Invalid isbn"});
});

module.exports.general = public_users;
