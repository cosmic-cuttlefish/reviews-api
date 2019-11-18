const { getReviewList } = require("./controllers/getReviewList");
const { getReviewMeta } = require("./controllers/getReviewMeta");
const postReview = require("./controllers/postReview");
const putHelpful = require("./controllers/putHelpful");
const putReport = require("./controllers/putReport");
var os = require("os");
const router = require("express").Router();

router.get("/:productid/list", getReviewList);
router.get("/:productid/meta", getReviewMeta);
router.post("/:productid", postReview);
router.put("/helpful/:reviewid", putHelpful);
router.put("/report/:reviewid", putReport);
router.get("/loaderio-86affb8d108df7e109e2250ca6f8f526", (req, res) => {
  res.send("loaderio-86affb8d108df7e109e2250ca6f8f526");
});
router.get("/check", (req, res) => res.sendStatus(200));

router.get("/server", (req, res) => res.send(os.networkInterfaces()));

module.exports = router;
