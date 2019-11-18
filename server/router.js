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
router.get("/loaderio-1b45a2e15cd77da15ca2ef2f3b90fa34", (req, res) => {
  res.send("loaderio-1b45a2e15cd77da15ca2ef2f3b90fa34");
});
router.get("/check", (req, res) => res.sendStatus(200));

router.get("/server", (req, res) => res.send(os.networkInterfaces()));

module.exports = router;
