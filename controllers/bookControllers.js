const Book = require("../models/Book");
const { STATUS_CODE } = require("../constants/statusCode");

exports.getBooks = async (request, response) => {
  try {
    const books = await Book.getAll();
    response.status(STATUS_CODE.OK).json(books);
  } catch (error) {
    console.error("Error occurred while fetching books:", error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve books" });
  }
};

exports.getBook = async (request, response) => {
  const { id } = request.params;

  try {
    const book = await Book.findById(id);
    if (book) {
      response.status(STATUS_CODE.OK).json(book);
    } else {
      response.status(STATUS_CODE.NOT_FOUND).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error("Error occurred while fetching book by ID:", error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve book" });
  }
};

exports.addBook = async (request, response) => {
  const { title, year, authorId } = request.body; 

  if (!title || !year || !authorId) {
    return response.status(STATUS_CODE.BAD_REQUEST).json({ message: "Missing required fields: title, year, or authorId" });
  }

  const newBook = { title, year, author: authorId }; 

  try {
    const insertedId = await Book.add(newBook);
    response.status(STATUS_CODE.CREATED).json({ message: "Book added successfully", _id: insertedId, book: newBook });
  } catch (error) {
    console.error("Error occurred while adding book:", error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Failed to add book" });
  }
};

exports.updateBook = async (request, response) => {
  const { id } = request.params;
  const { title, year, authorId } = request.body; 

  try {
    const updated = await Book.updateById(id, title, year, authorId);
    if (updated) {
      response.status(STATUS_CODE.OK).json({ message: "Book updated successfully" });
    } else {
      response.status(STATUS_CODE.NOT_FOUND).json({ message: "Book not found or not updated" });
    }
  } catch (error) {
    console.error("Error occurred while updating book by ID:", error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Failed to update book" });
  }
};

exports.deleteBook = async (request, response) => {
  const { id } = request.params;

  try {
    const deleted = await Book.deleteById(id);
    if (deleted) {
      response.status(STATUS_CODE.OK).json({ message: "Book deleted successfully" });
    } else {
      response.status(STATUS_CODE.NOT_FOUND).json({ message: "Book not found or not deleted" });
    }
  } catch (error) {
    console.error("Error occurred while deleting book by ID:", error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete book" });
  }
};