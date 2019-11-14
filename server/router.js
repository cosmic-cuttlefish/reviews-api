const getReviewList = require("./controllers/getReviewList");
const getReviewMeta = require("./controllers/getReviewMeta");
const postReview = require("./controllers/postReview");
const putHelpful = require("./controllers/putHelpful");
const putReport = require("./controllers/putReport");
const router = require("express").Router();

router.get("/:productid/list", getReviewList);
router.get("/:productid/meta", getReviewMeta);
router.post("/:productid", postReview);
router.put("/helpful/:reviewid", putHelpful);
router.put("/report/:reviewid", putReport);
router.get("/loaderio-558608253c12a45969cc235fb1deb0d2", (req, res) => {
  res.send("loaderio-558608253c12a45969cc235fb1deb0d2");
});
router.get("/check", (req, res) => res.sendStatus(200));

module.exports = router;
