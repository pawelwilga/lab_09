const Author = require("../models/Author");
const { STATUS_CODE } = require("../constants/statusCode");

exports.getAuthors = async (request, response) => {
  try {
    const authors = await Author.getAll();
    response.status(STATUS_CODE.OK).json(authors);
  } catch (error) {
    console.error("Error occurred while fetching authors:", error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve authors" });
  }
};

exports.getAuthor = async (request, response) => {
  const { id } = request.params; // Pobieranie ID z parametrów URL

  try {
    const author = await Author.findById(id); // Użycie findById
    if (author) {
      response.status(STATUS_CODE.OK).json(author);
    } else {
      response.status(STATUS_CODE.NOT_FOUND).json({ message: "Author not found" });
    }
  } catch (error) {
    console.error("Error occurred while fetching author by ID:", error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve author" });
  }
};

exports.addAuthor = async (request, response) => {
  const { firstName, lastName } = request.body;
  const newAuthor = { firstName, lastName };

  try {
    const insertedId = await Author.add(newAuthor); // Zwróć ID nowo dodanego autora
    response.status(STATUS_CODE.CREATED).json({ message: "Author added successfully", _id: insertedId, author: newAuthor });
  } catch (error) {
    console.error("Error occurred while adding author:", error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Failed to add author" });
  }
};

exports.updateAuthor = async (request, response) => {
  const { id } = request.params; // Pobieranie ID z parametrów URL
  const { firstName, lastName } = request.body; // Nowe dane z ciała żądania

  try {
    const updated = await Author.updateById(id, firstName, lastName); // Użycie updateById
    if (updated) {
      response.status(STATUS_CODE.OK).json({ message: "Author updated successfully" });
    } else {
      response.status(STATUS_CODE.NOT_FOUND).json({ message: "Author not found or not updated" });
    }
  } catch (error) {
    console.error("Error occurred while updating author by ID:", error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Failed to update author" });
  }
};

exports.deleteAuthor = async (request, response) => {
  const { id } = request.params; // Pobieranie ID z parametrów URL

  try {
    const deleted = await Author.deleteById(id); // Użycie deleteById
    if (deleted) {
      response.status(STATUS_CODE.OK).json({ message: "Author deleted successfully" });
    } else {
      response.status(STATUS_CODE.NOT_FOUND).json({ message: "Author not found or not deleted" });
    }
  } catch (error) {
    console.error("Error occurred while deleting author by ID:", error);
    response.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Failed to delete author" });
  }
};
