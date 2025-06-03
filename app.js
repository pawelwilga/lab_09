const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const { mongoConnect } = require('./database');

const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");


const PORT = process.env.PORT || 3001;

const app = express();
// app.use();
app.use(express.json());

app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);

mongoConnect(() => {
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
})});
