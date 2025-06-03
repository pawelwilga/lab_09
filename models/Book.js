const { getDatabase } = require("../database");
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = "books";

class Book {
  constructor(title, year, authorId) {
    this.title = title;
    this.year = year;
    this.author = new ObjectId(authorId);
  }

  static async getAll() {
    const db = getDatabase();

    try {
      
      const books = await db.collection(COLLECTION_NAME).aggregate([
        {
          $lookup: {
            from: "authors",       
            localField: "author",  
            foreignField: "_id",   
            as: "authorDetails"    
          }
        },
        {
          $unwind: "$authorDetails" 
        },
        {
          $project: { 
            _id: 1,
            title: 1,
            year: 1,
            author: { 
              _id: "$authorDetails._id",
              firstName: "$authorDetails.firstName",
              lastName: "$authorDetails.lastName"
            }
          }
        }
      ]).toArray();

      return books;
    } catch (error) {
      console.error("Error occurred while searching for all books:", error);
      return [];
    }
  }

  static async add(book) {
    const db = getDatabase();

    try {
      
      const bookToInsert = {
        title: book.title,
        year: book.year,
        author: new ObjectId(book.author) 
      };
      const result = await db.collection(COLLECTION_NAME).insertOne(bookToInsert);
      return result.insertedId;
    } catch (error) {
      console.error("Error occurred while adding book:", error);
      return null;
    }
  }

  static async findById(id) {
    const db = getDatabase();

    try {
      const searchedBook = await db.collection(COLLECTION_NAME).aggregate([
        {
          $match: { _id: new ObjectId(id) } 
        },
        {
          $lookup: {
            from: "authors",
            localField: "author",
            foreignField: "_id",
            as: "authorDetails"
          }
        },
        {
          $unwind: "$authorDetails"
        },
        {
          $project: {
            _id: 1,
            title: 1,
            year: 1,
            author: {
              _id: "$authorDetails._id",
              firstName: "$authorDetails.firstName",
              lastName: "$authorDetails.lastName"
            }
          }
        }
      ]).toArray();

      return searchedBook.length > 0 ? searchedBook[0] : null;
    } catch (error) {
      console.error("Error occurred while searching book by ID:", error);
      return null;
    }
  }

  static async updateById(id, newTitle, newYear, newAuthorId) {
    const db = getDatabase();

    try {
      const updateDoc = {
        title: newTitle,
        year: newYear,
      };
      if (newAuthorId) {
        updateDoc.author = new ObjectId(newAuthorId); 
      }

      const result = await db.collection(COLLECTION_NAME).updateOne(
        { _id: new ObjectId(id) },
        { $set: updateDoc }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error occurred while updating book by ID:", error);
      return false;
    }
  }

  static async deleteById(id) {
    const db = getDatabase();

    try {
      const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error occurred while deleting book by ID:", error);
      return false;
    }
  }
}

module.exports = Book;