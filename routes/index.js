const router = require('express').Router();

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingitems");

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

// Handle non-existent routes
router.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

module.exports = router;
