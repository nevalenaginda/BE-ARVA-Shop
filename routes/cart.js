const cart = require("../controllers/cart");
const { AuthSeller, Auth, AuthRefresh, AuthVerif } = require("../middleware/auth");

const router = require("express").Router();

router.post("/", Auth, cart.addCart);
router.post("/min", Auth, cart.minCart);
router.get("/", Auth, cart.getCart);
router.delete("/", Auth, cart.deleteCart);

module.exports = router;
