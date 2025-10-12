const router = require('express').Router();

const { getItems, createItem, deleteItem, likeItem, dislikeItem } = require('../controllers/clothingitems');
const { validateCardBody, validateId } = require('../middlewares/validation');

// GET /items - get all clothing items
router.get("/", getItems);

// POST /items - create new clothing item
router.post("/", validateCardBody, createItem);

// DELETE /items/:itemId - delete clothing item
router.delete("/:itemId", validateId, deleteItem);

// PUT /items/:itemId/likes - like an item
router.put("/:itemId/likes", validateId, likeItem);

// DELETE /items/:itemId/likes - unlike an item
router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;