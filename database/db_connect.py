import psycopg2


def connect():
    conn = psycopg2.connect(host='localhost', dbname='reviews', user='patrick')
    return conn


