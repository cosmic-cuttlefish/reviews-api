ALTER TABLE meta ADD column recommend_0 int default 0;
ALTER TABLE meta ADD column recommend_1 int default 0;

DO
$do$
BEGIN
    FOR idvar IN 1..1000011
    LOOP
     UPDATE meta
        SET recommend_0 =
        (SELECT COUNT(*) FROM review WHERE product_id = idvar AND recommend = false),
        recommend_1 = (SELECT COUNT(*) FROM review WHERE product_id = idvar AND recommend = true)
        WHERE product_id = idvar;
    END LOOP;
END
$do$;
