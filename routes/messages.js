const messages = require("../controllers/messages");
const { AuthSeller, Auth, AuthRefresh, AuthVerif } = require("../middleware/auth");

const router = require("express").Router();

router.post("/", messages.getMessage);

module.exports = router;
