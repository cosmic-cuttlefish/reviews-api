module.exports = function getReviewList(req, res) {
  // use model to get and return list of relevant list of reviews for productid
  res.send("getReviewList for " + req.params.productid);
};
