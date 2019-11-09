const { getCharacteristics } = require("../models/characteristics");
const { addReview } = require("../models/reviews");
const errMessage = (missing, param) =>
  missing
    ? "missing parameter" + param
    : "invalid value for parameter: " + param;

const validateReview = (body, reqCharacteristics) => {
  for (let param in body) {
    value = body[param];
    let err = false;
    switch (param) {
      case "rating":
        if (value === undefined) return errMessage(true);
        if (value % 1 !== 0 || value > 5 || value < 1) {
          return errMessage(false, param);
        }
        break;
      case "summary":
        if (value === undefined) return errMessage(true);
        if (typeof value !== "string") return errMessage(false, param);
        break;
      case "body":
        console.log("body is length", value.length);
        if (value === undefined) return errMessage(true);
        if (typeof value !== "string" || value.length < 50)
          return errMessage(false, param);
        break;
      case "recommend":
        if (value === undefined) return errMessage(true);
        if (typeof value !== "boolean") return errMessage(false, param);
        break;
      case "name":
        if (value === undefined) return errMessage(true);
        if (typeof value !== "string" || value.length > 60)
          return errMessage(false, param);
        break;
      case "email":
        if (value === undefined) return errMessage(true);
        if (typeof value !== "string" || value.length > 60)
          return errMessage(false, param);
        break;
      case "photos":
        if (value === undefined) return errMessage(true);
        if (!Array.isArray(value) || value.length > 5)
          return errMessage(false, param);
        for (let photo of value) {
          if (typeof photo !== "string" || photo.length > 255)
            return errMessage(false, param);
        }
        break;
      case "characteristics":
        if (value === undefined) return errMessage(true);
        if (
          typeof value !== "object" ||
          Object.keys(value).length !== Object.keys(reqCharacteristics).length
        )
          return errMessage(false, param);

        for (let characteristic of reqCharacteristics) {
          const rating = value[characteristic.id];
          if (rating % 1 !== 0 || rating < 0 || rating > 5) {
            return errMessage(false, param);
          }
        }
        break;
    }
  }
  return true;
};

module.exports = async function postReview(req, res) {
  const { productid } = req.params;
  const reqCharacteristics = await getCharacteristics(productid);
  const err = validateReview(req.body, reqCharacteristics);
  if (err) {
    res.status(400).send(err);
  } else {
    try {
      await addReview(req.body);
      res.sendStatus(201);
    } catch (err) {
      res.sendStatus(500);
    }
  }
  res.send(
    "addReview for " +
      req.params.productid +
      "with body " +
      JSON.stringify(req.body)
  );
};

/*
rating	int	Integer (1-5) indicating the review rating
summary	text	Summary text of the review
body	text	Continued or full text of the review
recommend	bool	Value indicating if the reviewer recommends the product
name	text	Username for question asker
email	text	Email address for question asker
photos	[text]	Array of text urls that link to images to be shown
characteristics	object	Object of keys representing characteristic_id and values representing the review value for that characteristic. { "14": 5, "15": 5 //...}
*/
