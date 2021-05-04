const middleUpload = require("../middleware/upload");
const user = require("../controllers/user");
const { AuthAdmin, Auth, AuthRefresh, AuthVerif } = require("../middleware/auth");

const router = require("express").Router();

router.post("/", user.register);
router.put("/", Auth, middleUpload("avatar"), user.update);
router.post("/resend", user.resendMail);
router.post("/reset", user.requestResetPassword);
router.put("/reset", user.resetPassword);
router.get("/token", AuthRefresh, user.getNewToken);
router.get("/verify", AuthVerif, user.verify);
router.post("/login", user.login);

module.exports = router;
