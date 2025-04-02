from motor.motor_asyncio import AsyncIOMotorClient,AsyncIOMotorCollection
from app.schema.schema import (
    Interview,Conversation,InterviewInstance      
                               )
from bson import ObjectId
from app.database.database import get_db_collections

async def create_interview_instance(interview_data:Interview,all_interviews:AsyncIOMotorCollection)-> dict:
    data={
        '_id':interview_data.interview_id,
        'user_id':interview_data.user_id,
        'company_id':interview_data.company_id,
        'company_name':interview_data.company_name,
        'job_id':interview_data.job_id,
        'job_role':interview_data.job_role,
        'interview_result':interview_data.interview_result
    }
    await all_interviews.insert_one(data)
    results = await all_interviews.find_one({'_id':interview_data.interview_id},{'_id': 0} )
    if results:
        results['interview_id']=interview_data.interview_id
    return results
    
    
async def post_messages_to_db(user_id:int,interview_instance:InterviewInstance,user_interviews:AsyncIOMotorCollection)->dict:
    data={
        'interview_id':interview_instance.interview_id,
        'company_id':interview_instance.company_id,
        'company_name':interview_instance.company_name,
        'job_role':interview_instance.job_role,
        'job_id':interview_instance.job_id,
        'conversation':interview_instance.conversation
    }
    user_data = await user_interviews.find_one({'_id':user_id})
    if user_data:
        existing_interview = await user_interviews.find_one( {"_id": user_id, 
                                                              "company_interviews.interview_id": interview_instance.interview_id})
        if existing_interview:
            update_result = await user_interviews.update_one(
                {"_id": user_id, "company_interviews.interview_id": interview_instance.interview_id},
                {"$push": {"company_interviews.$.conversation": {"$each": [conv.model_dump() for conv in interview_instance.conversation] }}}
            )
        else:
            update_result = await user_interviews.update_one(
                {"_id": user_id},
                {"$push": {"company_interviews": interview_instance.model_dump()}},
                upsert=True
            )
    else:
        await user_interviews.insert_one({
            "_id": user_id,
            "company_interviews": [interview_instance.model_dump()]
        })
        
    final_result=await user_interviews.find_one( {"_id": user_id,"company_interviews.interview_id": interview_instance.interview_id}, {"company_interviews.$": 1} )
    if final_result and "company_interviews" in final_result:
        return final_result["company_interviews"][0]


async def get_interview_by_user_id(user_id:int,user_interviews:AsyncIOMotorClient)->dict:
    user_data = await user_interviews.find_one({'_id':user_id},{'_id':0})
    if user_data:
        user_data['user_id']=user_id
        return user_data
    else: 
        return {"user_id": user_id, "company_interviews": []}