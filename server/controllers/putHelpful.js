const { incrementHelpful } = require("../models/reviews");

module.exports = async function putHelpful(req, res) {
  const { reviewid } = req.params;
  if (reviewid === undefined) {
    return res.sendStatus(400);
  }
  await incrementHelpful(reviewid);
  res.sendStatus(204);
};
