const pool = require("./connect");
const table = "review_photo";

module.exports = {
  getPhotos: async function getPhotos(ids) {
    if (ids.length === 0) {
      return [];
    }
    const client = await pool.connect();
    let res;

    try {
      res = await client.query(
        `SELECT * FROM ${table} 
          WHERE review_id in (${ids.join(",")});`
      );
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
    return res.rows;
  },

  addPhotos: async function addPhotos(id, urls) {
    const client = await pool.connect();
    let values = urls.map(url => `(${id}, '${url}')`).join(", ");
    // FIXME: templating
    try {
      res = await client.query(
        `INSERT INTO ${table} (review_id, url) VALUES ${values};`
      );
    } catch (err) {
      throw err;
    } finally {
      client.release();
    }
    return res.rows;
  }
};
