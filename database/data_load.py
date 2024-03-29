from helpers import create_small_copy, replace_from_csv
from db_connect import connect
import pandas as pd
import numpy as np
import os
from math import floor
import time

"""
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ META ETL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"""


def transform_product_csv(file_path, file_name, small=False):
    if small:
        create_small_copy(file_path, file_name)
        file_name = 'small_' + file_name

    dtype = {'id': np.integer, 'name': str, 'slogan': str, 'description': str, 'category': str,
             'default_price': np.integer}
    df = pd.read_csv(file_path + file_name, dtype=dtype)
    df = df['id']
    df.columns = ['product_id']
    # df.insert(1, 'rating_0', 0)
    # df.insert(2, 'rating_1', 0)
    # df.insert(3, 'rating_2', 0)
    # df.insert(4, 'rating_3', 0)
    # df.insert(5, 'rating_4', 0)
    # df.insert(6, 'rating_5', 0)
    df.to_csv(file_path + 'transformed_' + file_name, index=False)

    if small:
        os.remove(file_path + file_name)

transform_product_csv('./data/', 'product.csv')

def load_meta(small=False):
    file_path = './data/'
    file_name = 'product.csv'
    table = 'meta'

    transform_product_csv(file_path, file_name, small)

    # if small:
    #     transformed_file = file_path + 'transformed_' + 'small_' + file_name
    # else:
    #     transformed_file = file_path + 'transformed_' + file_name
    # replace_from_csv(transformed_file, table)
    # os.remove(transformed_file)

"""
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ REVIEW ETL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"""


def transform_reviews_csv(file_path, file_name, small=False):
    # dtype = {'id': np.integer, 'product_id': np.integer, 'rating': np.integer, 'date': str, 'summary': str,
    #          'body': str, 'recommend': bool, 'reported': bool, 'reviewer_name': str, 'reviewer_email': str,
    #          'response': str, 'helpfulness': np.integer}
    if small:
        create_small_copy(file_path, file_name)
        file_name = 'small_' + file_name

    df = pd.read_csv(file_path + file_name)
    bool_mapping = {'false': False, 'true': True, 'False': False, 'True': True, '0': False, '1': True, "": False,
                    r'^\s+$': False, 0: False, 1: True}
    df['recommend'] = df['recommend'].map(bool_mapping)
    df['reported'] = df['reported'].map(bool_mapping)
    df = df[['id', 'product_id', 'rating', 'summary', 'response', 'date', 'body', 'reviewer_name', 'reviewer_email',
             'helpfulness', 'recommend', 'reported']]
    df.to_csv(file_path + 'transformed_' + file_name, index=False)

    if small:
        os.remove(file_path + file_name)


def load_review(small=False):
    file_path = './data/'
    file_name = 'reviews.csv'
    table = 'review'

    transform_reviews_csv(file_path, file_name, small)
    if small:
        transformed_file = file_path + 'transformed_' + 'small_' + file_name
    else:
        transformed_file = file_path + 'transformed_' + file_name

    replace_from_csv(transformed_file, table)
    os.remove(transformed_file)


"""
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ PHOTOS ETL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"""


def transform_photos_csv(file_path, file_name, small=False):
    if small:
        create_small_copy(file_path, file_name)
        file_name = 'small_' + file_name

    dtype = {'id': np.integer, 'review_id': np.integer, 'url': str}
    df = pd.read_csv(file_path + file_name, dtype=dtype)
    df['url'].apply(lambda url: url.replace('"', ''))
    df.to_csv(file_path + 'transformed_' + file_name, index=False)


def load_photos(small=False):
    file_path = './data/'
    file_name = 'reviews_photos.csv'
    table = 'review_photo'

    transform_photos_csv(file_path, file_name, small)

    if small:
        transformed_file = file_path + 'transformed_small_' + file_name
    else:
        transformed_file = file_path + 'transformed_' + file_name

    replace_from_csv(transformed_file, table)
    os.remove(transformed_file)

"""
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CHARACTERISTICS ETL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"""


def transform_characteristic_csv(file_path, file_name, small=False):
    if small:
        create_small_copy(file_path, file_name)
        file_name = 'small_' + file_name

    dtype = {'id': np.integer, 'product_id': np.integer, 'name': str}
    df = pd.read_csv(file_path + file_name, dtype=dtype)

    df.insert(len(df.columns), 'score', 0)
    df.insert(len(df.columns), 'reviews', 0)
    df = df[['id', 'name', 'score', 'reviews', 'product_id']]

    df.to_csv(file_path + 'transformed_' + file_name, index=False)

    if small:
        os.remove(file_path + file_name)


def load_characteristic(small=False):
    file_path = './data/'
    file_name = 'characteristics.csv'
    table = 'characteristic'

    transform_characteristic_csv(file_path, file_name, small)

    if small:
        transformed_file = file_path + 'transformed_' + 'small_' + file_name
    else:
        transformed_file = file_path + 'transformed_' + file_name
    replace_from_csv(transformed_file, table)
    os.remove(transformed_file)

""" ********** THE METHOD BELOW OF INDIVIDUALLY UPDATING THE CHARACTERISTIC SCORE WILL TAKE ~ 11 HOURS
def load_characteristic_reviews(small=False):
    file_path = './data/'
    file_name = 'characteristic_reviews.csv'
    table = 'characteristic'
    start = time.time()

    if small:
        create_small_copy(file_path, file_name)
        file_name = 'small_' + file_name

    df = pd.read_csv(file_path + file_name)
    conn = connect()
    cur = conn.cursor()
    conn.set_session(autocommit=True)
    for index, row in df.iterrows():
        cur.execute(f"UPDATE {table} SET score = score + {row['value']}, reviews = reviews + 5 "
                    f"WHERE id = {row['characteristic_id']}")
        if index % 10000 == 0:
            cur.execute('VACUUM ANALYZE')
            print(index)
            end = time.time()
            print(end - start)
            start = end

    conn.close()
    end = time.time()
    print(f"{(end - start) / 60} minutes {(end - start) % 60} seconds")

# load_characteristic()
load_characteristic_reviews(False)
"""


def transform_characteristic_score(small=False):
    start = time.time()
    conn = connect()
    cur = conn.cursor()
    conn.set_session(autocommit=True)

    cur.execute("SELECT COUNT(*) FROM characteristic;")
    characteristics = cur.fetchone()[0]
    for char_id in range(characteristics):
        insert = "INSERT INTO characteristic_scored " \
                 "(id, name, score, reviews, product_id) " \
                 " SELECT c.id, c.name, SUM(cr.value), COUNT(cr.value), c.product_id " \
                 "FROM characteristic c LEFT JOIN characteristic_reviews cr ON c.id = cr.characteristic_id " \
                 f"WHERE cr.characteristic_id = {char_id} " \
                 "GROUP BY c.id;"
        cur.execute(insert)
        if char_id % 100000 == 0:
            print(f"calculated {char_id} characteristic scores, time elapsed: {floor(time.time() - start)} seconds")

    conn.close()
    end = time.time()
    print(f"{floor((end - start) / 60)} minutes {(end - start) % 60} seconds")


"""
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add Meta Scores ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"""


def transform_meta_scores():
    start = time.time()
    conn = connect()
    cur = conn.cursor()
    conn.set_session(autocommit=True)

    cur.execute("SELECT COUNT(*) FROM meta;")
    product_ids = cur.fetchone()[0]
    for product_id in range(product_ids):
        update_ratings = "UPDATE meta " \
                         "SET rating_1 = " \
                         f"(SELECT COUNT(rating) FROM review WHERE product_id = {product_id} AND rating = 1), " \
                         "rating_2 = " \
                         f"(SELECT COUNT(rating) FROM review WHERE product_id = {product_id} AND rating = 2), " \
                         "rating_3 = " \
                         f"(SELECT COUNT(rating) FROM review WHERE product_id = {product_id} AND rating = 3), " \
                         "rating_4 = " \
                         f"(SELECT COUNT(rating) FROM review WHERE product_id = {product_id} AND rating = 4)," \
                         "rating_5 = " \
                         f"(SELECT COUNT(rating) FROM review WHERE product_id = {product_id} AND rating = 5) " \
                         f"WHERE product_id = {product_id};"
        cur.execute(update_ratings)
        if product_id % 10000 == 0:
            print("loaded", product_id, "product scores. Time elapsed:", floor(time.time() - start), "seconds")

    conn.close()
    end = time.time()
    print(f"{(end - start) / 60} minutes {(end - start) % 60} seconds")


"""
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ LOAD ALL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"""


def load_all():
    load_meta()
    print('~~~~~~~~~~~~~~~~~~~ successfully loaded product ids into meta ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    load_review()
    print('~~~~~~~~~~~~~~~~~~~~~~~~~ successfully loaded reviews  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    load_photos()
    print('~~~~~~~~~~~~~~~~~~~~~~~~~~ successfully loaded photos  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    load_characteristic()
    print('~~~~~~~~~~~~~~~~~~~~~ successfully loaded characteristics  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    transform_characteristic_score()
    print('~~~~~~~~~~~ successfully calculated and loaded characteristic scores  ~~~~~~~~~~~~~~~~~~~~~~~')
    transform_meta_scores()
    print('~~~~~~~~~~~~~ successfully calculated and loaded review meta scores  ~~~~~~~~~~~~~~~~~~~~~~~~')
