DROP TABLE IF EXISTS review CASCADE;

CREATE TABLE review (
  id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  summary VARCHAR(255) NOT NULL,
  response VARCHAR(255) DEFAULT '',
  date DATE NOT NULL,
  body VARCHAR(1000) NOT NULL,
  reviewer_name VARCHAR(60) NOT NULL,
  reviewer_email VARCHAR(60) NOT NULL,
  helpfulness INTEGER DEFAULT 0,
  recommend BOOLEAN DEFAULT false,
  reported BOOLEAN DEFAULT false,
  PRIMARY KEY (id)
);

-- ---
-- Table 'review_photo'
--
-- ---

DROP TABLE IF EXISTS review_photo CASCADE;

CREATE TABLE review_photo (
  id INTEGER NOT NULL PRIMARY KEY,
  review_id INTEGER NOT NULL,
  url VARCHAR(255) NOT NULL
);

-- ---
-- Table 'meta'
--
-- ---

DROP TABLE IF EXISTS meta CASCADE;

CREATE TABLE meta (
  product_id INTEGER NOT NULL,
  rating_1 INTEGER DEFAULT 0,
  rating_2 INTEGER DEFAULT 0,
  rating_3 INTEGER DEFAULT 0,
  rating_4 INTEGER DEFAULT 0,
  rating_5 INTEGER DEFAULT 0,
  PRIMARY KEY (product_id)
);

-- ---
-- Table 'characteristic'
--
-- ---

DROP TABLE IF EXISTS characteristic CASCADE;

CREATE TABLE characteristic (
  id INTEGER NOT NULL,
  name VARCHAR(25) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  product_id INTEGER NOT NULL,
  PRIMARY KEY (id)
);


-- ---
-- Table 'characteristic_reviews'
--
-- ---

DROP TABLE IF EXISTS characteristic_reviews CASCADE;

CREATE TABLE characteristic_reviews (
  id INTEGER NOT NULL,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value INTEGER NOT NULL,
  PRIMARY KEY (id)
);


-- ---
-- Table 'characteristic_scored' < -- with populated scored
--
-- ---

DROP TABLE IF EXISTS characteristic_scored CASCADE;

CREATE TABLE characteristic_scored (
  id INTEGER NOT NULL,
  name VARCHAR(25) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  product_id INTEGER NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE review ADD FOREIGN KEY (product_id) REFERENCES meta (product_id);
ALTER TABLE review_photo ADD FOREIGN KEY (review_id) REFERENCES review (id);
ALTER TABLE characteristic ADD FOREIGN KEY (product_id) REFERENCES meta (product_id);
ALTER TABLE characteristic_scored ADD FOREIGN KEY (product_id) REFERENCES meta (product_id);
ALTER TABLE characteristic_reviews ADD FOREIGN KEY (characteristic_id) REFERENCES characteristic (id);
ALTER TABLE characteristic_reviews ADD FOREIGN KEY (review_id) REFERENCES review (id);
CREATE INDEX ON review (product_id);
CREATE INDEX ON characteristic (product_id);
CREATE INDEX ON characteristic_reviews (characteristic_id);
CREATE INDEX ON review_photo(review_id);