const { getMeta } = require("../models/meta");
const { getRecommend } = require("../models/reviews");
const { getCharacteristics } = require("../models/characteristics");
module.exports = async function getReviewMeta(req, res) {
  const { productid } = req.params;
  const reviewMeta = await getMeta(productid);
  const characteristics = await getCharacteristics(productid);
  let meta = {
    product_id: productid,
    ratings: {},
    recommend: {},
    characteristics: {}
  };
  for (let key in reviewMeta) {
    if (key.startsWith("rating_")) {
      if (reviewMeta[key] > 0) {
        const rating = key[key.length - 1];
        meta.ratings[rating] = reviewMeta[key];
      }
    } else if (key.startsWith("recommend_")) {
      const recommendScore = key[key.length - 1];
      meta.recommend[recommendScore] = reviewMeta[key];
    }
  }

  for (let characteristic of characteristics) {
    meta.characteristics[characteristic.name] = {
      id: characteristic.id,
      value: characteristic.value
    };
  }
  res.json(meta);
};

// {
//   "product_id": "2",
//   "ratings": {
//     2: 1,
//     3: 1,
//     4: 2
//   },
//   "recommended": {
//     0: 5
//     // ...
//   },
//   "characteristics": {
//     "Size": {
//       "id": 14,
//       "value": "4.0000"
//     },
//     "Width": {
//       "id": 15,
//       "value": "3.5000"
//     },
//     "Comfort": {
//       "id": 16,
//       "value": "4.0000"
//     }
// }}
