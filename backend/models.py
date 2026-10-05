from pydantic import BaseModel
from enum import Enum

from backend.database_model import StatusEnum


# enum for status of the research opportunity
class StatusEnum(str, Enum):
    open = "Open"
    closed = "Closed"
    

# creatng a pydantic model for the database table to validate the data before inserting into the database.
class ResearchOpportunity(BaseModel):
    research_title: str
    research_description: str
    research_area: str
    faculty_name: str
    department: str
    required_skills: str
    available_positions: int
    application_deadline: str   
    status: StatusEnum
    
    

    

        