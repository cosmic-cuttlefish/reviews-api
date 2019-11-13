SElECT recommend::int, COUNT(*) FROM review WHERE product_id = 2 GROUP BY recommend;

SELECT id, name, (score::float / reviews::float) as value FROM characteristic_scored WHERE product_id = 2;

SELECT * FROM meta WHERE product_id = 11;