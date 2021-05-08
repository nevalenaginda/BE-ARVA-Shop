const middleUpload = require("../middleware/upload");
const product = require("../controllers/product");
const { AuthSeller, Auth, AuthRefresh, AuthVerif } = require("../middleware/auth");

const router = require("express").Router();

router.post("/", AuthSeller, middleUpload("image"), product.sellProduct);
router.get("/product", AuthSeller, product.getProductForSeller);
router.get("/new", product.getNewProduct);
router.get("/popular", product.getPopularProduct);
router.get("/home", product.homePageData);
router.get("/details", product.getDetailProduct);
router.get("/recom", product.getRecommendationProduct);
router.get("/detailpage", product.detailsPageData);
router.get("/list", product.getProductByCategory);
router.post("/search", product.searchProduct);
router.post("/filter", product.filterProduct);

module.exports = router;
