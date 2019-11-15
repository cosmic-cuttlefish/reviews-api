const { getReviews } = require("../models/reviews");
const { getPhotos } = require("../models/photos");
const LRU = require("lru-cache");

const listCache = new LRU(100);

module.exports = {
  getReviewList: async function getReviewList(req, res) {
    const { productid } = req.params;
    const { page = 1, count = 5, sort } = req.query;
    if (+page === 1 && +count === 2 && sort === "relevant") {
      const cachedList = listCache.get(productid);
      if (cachedList) return res.json(cachedList);
    }
    let reviews = await getReviews(productid, +page, +count, sort);
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

    const ret = {
      product: productid,
      page: +page - 1 || 0,
      count: reviews.length,
      results: reviews
    };

    if (+page === 1 && +count === 2 && sort === "relevant") {
      listCache.set(productid, ret);
    }

    res.json(ret);
  },

  listCache
};
