const pool = require("./connect");
const table = "review";

module.exports = {
  getReviews: async function getReviews(productId, page = 1, limit = 5) {
    let res;
    const client = await pool.connect();
    try {
      res = await client.query(
        `SELECT 
          id as review_id, 
          rating, 
          summary, 
          recommend::int, 
          response, 
          body, 
          date, 
          reviewer_name, 
          helpfulness 
        FROM ${table} 
          WHERE product_id = $1 
          AND reported = false
          LIMIT $2
          OFFSET $3;`,
        [productId, limit, (page - 1) * limit]
      );
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
    return res.rows;
  },

  getRecommend: async function getRecommend(productId) {
    let res;
    const client = await pool.connect();
    try {
      res = await client.query(
        `SElECT recommend::int, COUNT(*) FROM ${table} WHERE product_id = $1 GROUP BY recommend;`,
        [productId]
      );
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
    return res.rows;
  },

  incrementHelpful: async function incrementHelpful(reviewId) {
    let res;
    const client = await pool.connect();
    try {
      res = await client.query(
        `UPDATE ${table} SET helpfulness = helpfulness + 1 WHERE id = $1;`,
        [reviewId]
      );
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
    return res;
  },

  flagReported: async function flagReported(reviewId) {
    let res;
    const client = await pool.connect();
    try {
      res = await client.query(
        `UPDATE ${table} SET reported = true WHERE id = $1;`,
        [reviewId]
      );
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
    return res;
  },

  addReview: async function addReview(data) {
    const {
      rating,
      summary,
      body,
      recommend,
      name,
      email,
      photos,
      characteristics
    } = data;
  },

  testConnection: async function testConnection() {
    const client = await pool.connect();

    const res = await client.query(`SELECT * FROM ${table} LIMIT 10;`);
    await client.end();
    console.log("connected", res);
  }
};
