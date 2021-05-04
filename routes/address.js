const address = require("../controllers/address");
const { AuthSeller, Auth, AuthRefresh, AuthVerif } = require("../middleware/auth");

const router = require("express").Router();

router.post("/", Auth, address.addAddress);
router.get("/list", Auth, address.getListAddress);
router.put("/edit", Auth, address.editAddress);
router.delete("/", Auth, address.deleteAddress);

module.exports = router;
