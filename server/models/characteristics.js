const pool = require("./connect");
const table = "characteristic_scored";

module.exports = {
  getCharacteristics: async function getCharacteristics(productId) {
    let res;
    const client = await pool.connect();
    try {
      res = await client.query(
        `SELECT id, name, ROUND(score::numeric / reviews::numeric, 4) as value FROM ${table} WHERE product_id = $1`,
        [productId]
      );
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
    return res.rows;
  }
};
