from fastapi import APIRouter, Depends , HTTPException
from app.schema.schema import (
    Interview,InterviewInstance,UserInterviews,Conversation
)
from app.services.services import (
    create_interview_instance,post_messages_to_db
)
from motor.motor_asyncio import AsyncIOMotorCollection
from app.database.database import get_db_collections

router=APIRouter()

@router.post('/create_interview',response_model=Interview)
async def create_interview(interview: Interview , db: tuple[AsyncIOMotorCollection, AsyncIOMotorCollection] = Depends(get_db_collections)):
    try:
        results= await create_interview_instance(interview,db[0])
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating interview data: {str(e)}")

@router.get('get_user_interview',response_model=UserInterviews)
async def get_user_interview(user_id:int ,company_id:int,interview_id:int,job_id:int ,db: AsyncIOMotorCollection=Depends(get_db_collections)):
    pass

@router.post('/post_messages',response_model=InterviewInstance)
async def post_messages(user_id:int ,interview_instance:InterviewInstance,db: tuple[AsyncIOMotorCollection, AsyncIOMotorCollection] = Depends(get_db_collections)):
    try:
        results=await post_messages_to_db(user_id,interview_instance,db[1])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))