const ordered = require("../controllers/ordered");
const { AuthSeller, Auth, AuthRefresh, AuthVerif } = require("../middleware/auth");

const router = require("express").Router();

router.post("/", Auth, ordered.makeOrder);
router.get("/get", AuthSeller, ordered.getOrderByStatus);
router.put("/", AuthSeller, ordered.updateStatusOrder);

module.exports = router;
