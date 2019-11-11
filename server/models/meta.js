const pool = require("./connect");
const table = "meta";

module.exports = {
  getMeta: async function getMeta(productId) {
    const client = await pool.connect();
    let res;

    try {
      res = await client.query(
        `SELECT * FROM ${table} 
          WHERE product_id = $1;`,
        [productId]
      );
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
    return res.rows[0];
  },

  updateRatings: async function updateRatings(productId, rating) {
    const client = await pool.connect();
    try {
      res = await client.query(
        `UPDATE ${table} SET rating_${rating} = rating_${rating} + 1 WHERE product_id = $1;`,
        [productId]
      );
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
  }
};
