const ordered = require("../controllers/ordered");
const { AuthSeller, Auth, AuthRefresh, AuthVerif } = require("../middleware/auth");

const router = require("express").Router();

router.post("/", Auth, ordered.makeOrder);

module.exports = router;
