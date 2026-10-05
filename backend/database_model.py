from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Text, Enum
from enum import Enum as PyEnum


Base = declarative_base()

class StatusEnum(PyEnum):
    open = "Open"
    closed = "Closed"

class ResearchOpportunity(Base):
    __tablename__ = "research_opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    research_title = Column(String(255), nullable=False)
    research_description = Column(Text, nullable=False)
    research_area = Column(String(255), nullable=False)
    faculty_name = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)    
    required_skills = Column(String(255), nullable=False)
    available_positions = Column(Integer, nullable=False)
    application_deadline = Column(String(255), nullable=False)
    status = Column(Enum("Open", "Closed", name="status_enum"), default="Open")


    