const router = require('express').Router();

const { getItems, createItem, deleteItem, likeItem, dislikeItem } = require('../controllers/clothingitems');

// GET /items - get all clothing items
router.get("/", getItems);

// POST /items - create new clothing item
router.post("/", createItem);

// DELETE /items/:itemId - delete clothing item
router.delete("/:itemId", deleteItem);

// PUT /items/:itemId/likes - like an item
router.put("/:itemId/likes", likeItem);

// DELETE /items/:itemId/likes - unlike an item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;