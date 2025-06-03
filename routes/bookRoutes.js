const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookControllers'); 
router.get('/', bookController.getBooks);

router.post('/', bookController.addBook);
router.get('/:id', bookController.getBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;