const { flagReported, getReviewById } = require("../models/reviews");
const { listCache } = require("./getReviewList");
module.exports = async function putHelpful(req, res) {
  const { reviewid } = req.params;
  if (reviewid === undefined) {
    return res.sendStatus(400);
  }
  await flagReported(reviewid);
  res.sendStatus(204);
  const { product_id: productId } = await getReviewById(reviewid);
  listCache.del("" + productId);
};
