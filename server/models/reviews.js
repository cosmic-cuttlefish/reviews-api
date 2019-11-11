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

  getReviewId: async function getReviewId(productId, data) {
    const client = await pool.connect();
    let result;
    const {
      rating,
      summary,
      response,
      body,
      recommend,
      reviewer_name,
      reviewer_email
    } = data;
    try {
      res = await client.query(
        `SElECT id FROM ${table} WHERE product_id = $1 AND rating = $2 
          AND summary = $3 AND response = $4 AND body = $5 
          AND recommend = $6 AND reviewer_name = $7 AND reviewer_email = $8;`,
        [
          productId,
          rating,
          summary,
          response,
          body,
          recommend,
          reviewer_name,
          reviewer_email
        ]
      );
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
    return res.rows[0].id;
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

  addReview: async function addReview(productId, data) {
    let result;
    const {
      rating,
      summary,
      response,
      body,
      recommend,
      reviewer_name,
      reviewer_email
    } = data;
    const client = await pool.connect();
    try {
      result = await client.query(
        `INSERT INTO ${table} (product_id, rating, summary, response, date, body, reviewer_name, 
          reviewer_email, recommend)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        [
          productId,
          rating,
          summary,
          response,
          new Date().toJSON(),
          body,
          reviewer_name,
          reviewer_email,
          recommend
        ]
      );
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
    return result;
  },

  testConnection: async function testConnection() {
    const client = await pool.connect();

    const res = await client.query(`SELECT * FROM ${table} LIMIT 10;`);
    await client.end();
    console.log("connected", res);
  }
};
