from db_connect import connect
from helpers import create_small_copy
import pandas as pd
import numpy as np
import os

"""
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ META ETL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"""


def transform_product_csv(file_path, file_name):
    dtype = {'id': np.integer, 'name': str, 'slogan': str, 'description': str, 'category': str,
             'default_price': np.integer}
    df = pd.read_csv(file_path + file_name, dtype=dtype)
    keep_col = ['id']
    transformed_df = df[keep_col]
    transformed_df.columns = ['product_id']
    transformed_df.insert(1, 'rating_0', 0)
    transformed_df.insert(2, 'rating_1', 0)
    transformed_df.insert(3, 'rating_2', 0)
    transformed_df.insert(4, 'rating_3', 0)
    transformed_df.insert(5, 'rating_4', 0)
    transformed_df.insert(6, 'rating_5', 0)
    transformed_df.to_csv(file_path + 'transformed_' + file_name, index=False)


def replace_from_csv(file, table):
    conn = connect()
    cur = conn.cursor()
    with open(file, 'r') as f:
        cur.execute('DELETE FROM {};'.format(table))
        next(f)
        cur.copy_from(f, table, sep=',')
        conn.commit()

    conn.close()


def load_meta():
    file_path = './data/'
    file_name = 'product.csv'
    table = 'meta'

    transform_product_csv(file_path, file_name)
    replace_from_csv(file_path + 'transformed_' + file_name, table)
    os.remove(file_path + 'transformed_' + file_name)


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



load_review()


def load_all():
    load_meta()