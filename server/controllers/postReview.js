module.exports = function postReview(req, res) {
  res.send(
    "addReview for " +
      req.params.productid +
      "with body " +
      JSON.stringify(req.body)
  );
};
