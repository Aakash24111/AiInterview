from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = os.getenv("MONGO_URI", "mongodb://mongo:27017")

client=AsyncIOMotorClient(MONGO_URL)

db=client['Interviews']
interviews=db['interviews']
user_interviews=db['user_interviews']

def get_db_collections():
    return interviews,user_interviews