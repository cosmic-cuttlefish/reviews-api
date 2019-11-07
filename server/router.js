const getReviewList = require("./controllers/getReviewList");
const getReviewMeta = require("./controllers/getReviewMeta");
const addReview = require("./controllers/addReview");
const router = require("express").Router();

router.get("/:productid/list", getReviewList);
router.get("/:productid/meta", getReviewMeta);
router.post("/:productid/", addReview);

module.exports = router;
