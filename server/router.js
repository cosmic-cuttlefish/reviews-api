const { getReviewList } = require("./controllers/getReviewList");
const { getReviewMeta } = require("./controllers/getReviewMeta");
const postReview = require("./controllers/postReview");
const putHelpful = require("./controllers/putHelpful");
const putReport = require("./controllers/putReport");
var request = require("request");
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

router.get("/server", (req, res) => {
  request.get("http://checkip.amazonaws.com", (err, reqRes, body) => {
    if (err) {
      console.log(err);
      res.send(400);
    }

    return res.send(body);
  });
});

module.exports = router;
