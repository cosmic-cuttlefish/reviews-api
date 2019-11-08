from pymongo import MongoClient


def connect():
    client = MongoClient('localhost', 27017)
    return client.reviews
