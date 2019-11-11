const { getReviews } = require("../models/reviews");
const { getPhotos } = require("../models/photos");

module.exports = async function getReviewList(req, res) {
  const { productid } = req.params;
  const { page, limit, sort } = req.query;
  let reviews = await getReviews(productid, page, limit, sort);
  const ids = reviews.map(review => review.review_id);
  const photos = await getPhotos(ids);
  for (let i = 0; i < reviews.length; i++) {
    reviews[i].photos = [];
    for (let photo of photos) {
      if (photo.review_id === reviews[i].review_id) {
        let { id, url } = photo;
        reviews[i].photos.push({ id, url });
      }
    }
  }

  res.json({
    product: productid,
    page: page - 1 || 0,
    count: reviews.length,
    results: reviews
  });
};
