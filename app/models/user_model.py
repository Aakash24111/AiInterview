from sqlalchemy import Column, Integer, String, LargeBinary, TIMESTAMP, text
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=False)
    resume_filename = Column(String, nullable=True)  # Optional Resume
    resume_data = Column(LargeBinary, nullable=True)  # Optional Resume Data
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
