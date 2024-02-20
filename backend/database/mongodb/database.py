from pymongo import MongoClient
from config.config import config
import certifi
from config.global_mode import GlobalMode
from config.constant import DEVELOPMENT_MODE, TESTING_MODE
from pymongo.errors import OperationFailure

class DatabaseService:
    __instance = None
    @staticmethod
    def getInstance():
        if DatabaseService.__instance is None:
            return DatabaseService()
        return DatabaseService.__instance
    def __init__(self):
        self.database_connection = config["DATABASE_CONNECTION"]
        self.database_name = config["DATABASE_NAME"]
        self.mongodb_client = MongoClient(self.database_connection,tlsCAFile=certifi.where())
        self.database = self.mongodb_client[self.database_name]
        if DatabaseService.__instance is not None:
            raise Exception("Instantiation is restricted")
        else:
            DatabaseService.__instance = self
    def connect_database(self):
        self.mongodb_client = MongoClient(self.database_connection,tlsCAFile=certifi.where())
        self.database = self.mongodb_client[self.database_name]
        try:
            self.mongodb_client.admin.command("ping")
            print("database is connected")
        except OperationFailure as operation_failure:
            print(operation_failure)
    def close_database(self):
        self.mongodb_client.close()