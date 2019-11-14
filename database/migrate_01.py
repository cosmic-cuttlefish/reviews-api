from db_connect import connect
from math import floor
import time

""" 
    THIS IS DEPRECATED, added loop within SQL query to increase performance, especially when connected to a database 
    over the network
"""
def migrate_01():
    start = time.time()
    conn = connect()
    cur = conn.cursor()
    conn.set_session(autocommit=True)

    cur.execute(open("sql/migrate_01.sql", "r").read())
    cur.execute("SELECT product_id FROM meta;")
    reviews = cur.fetchall()
    for review in reviews:
        id = review[0]
        update = "UPDATE meta SET recommend_0 = " \
                 f"(SELECT COUNT(*) FROM review WHERE product_id = {id} AND recommend = false), " \
                 f"recommend_1 = (SELECT COUNT(*) FROM review WHERE product_id = {id} AND recommend = true) " \
                 f"WHERE product_id = {id}; "
        cur.execute(update)
        if id % 1000 == 0:
            print(f"calculated {id} recommend scores, time elapsed: {floor(time.time() - start)} seconds")
    conn.close()
    end = time.time()
    print(f"{floor((end - start) / 60)} minutes {(end - start) % 60} seconds")
