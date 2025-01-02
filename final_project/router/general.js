const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
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
