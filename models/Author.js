const { getDatabase } = require("../database");
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb

const COLLECTION_NAME = "authors";

class Author {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  static async getAll() {
    const db = getDatabase();

    try {
      const authors = await db.collection(COLLECTION_NAME).find({}).toArray();
      return authors;
    } catch (error) {
      console.error("Error occurred while searching for all authors:", error);
      return [];
    }
  }

  static async add(author) {
    const db = getDatabase();

    try {
      const result = await db.collection(COLLECTION_NAME).insertOne(author);
      return result.insertedId; // Return the _id of the newly inserted document
    } catch (error) {
      console.error("Error occurred while adding author:", error);
      return null;
    }
  }

  static async findById(id) {
    const db = getDatabase();

    try {
      const searchedAuthor = await db
        .collection(COLLECTION_NAME)
        .findOne({ _id: new ObjectId(id) }); // Use new ObjectId(id)
      return searchedAuthor;
    } catch (error) {
      console.error("Error occurred while searching author by ID:", error);
      return null;
    }
  }

  // Zmodyfikowana nazwa funkcji dla jasności
  static async findByFirstNameAndLastName(firstName, lastName) {
    const db = getDatabase();

    try {
      const searchedAuthor = await db
        .collection(COLLECTION_NAME)
        .findOne({ firstName, lastName });
      return searchedAuthor;
    } catch (error) {
      console.error("Error occurred while searching author by name:", error);
      return null;
    }
  }

  static async updateById(id, newFirstName, newLastName) {
    const db = getDatabase();

    try {
      const result = await db.collection(COLLECTION_NAME).updateOne(
        { _id: new ObjectId(id) }, // Use new ObjectId(id)
        { $set: { firstName: newFirstName, lastName: newLastName } }
      );
      return result.modifiedCount > 0; // Return true if document was modified
    } catch (error) {
      console.error("Error occurred while updating author by ID:", error);
      return false;
    }
  }

  static async deleteById(id) {
    const db = getDatabase();

    try {
      const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) }); // Use new ObjectId(id)
      return result.deletedCount > 0; // Return true if document was deleted
    } catch (error) {
      console.error("Error occurred while deleting author by ID:", error);
      return false;
    }
  }

  static async getLast() {
    const db = getDatabase();

    try {
      const lastAddedAuthor = await db
        .collection(COLLECTION_NAME)
        .find({})
        .sort({ _id: -1 })
        .limit(1)
        .toArray()
        .then((docs) => docs[0]);
      return lastAddedAuthor;
    } catch (error) {
      console.error("Error occurred while searching for last author:", error);
      return null;
    }
  }
}

module.exports = Author;