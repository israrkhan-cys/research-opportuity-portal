"""
Your university currently shares research opportunities through emails, WhatsApp
groups, and noticeboards. Because the information is scattered across different
platforms, many students miss valuable opportunities, while faculty members find
it difficult to manage their research openings.
The university has therefore decided to develop a Research Opportunity Portal
where faculty members can post, view, update, and manage research opportunities
in one place.

You are working as a junior software developer in the university’s software deve-
lopment team. Your responsibility is to develop a complete web-based application

consisting of a backend REST API, database, and a simple frontend interface for
managing research opportunities.

"""

from fastapi import FastAPI
from pydantic import BaseModel
from database import SessionLocal, engine
from sqlalchemy import text

app=FastAPI()

# creatng a pydantic model for the database table to validate the data before inserting into the database.
class ResearchOpportunity(BaseModel):
    title: str
    research_title: str
    research_description: str
    research_area: str
    departement: str
    required_skills: str
    avilable_positions: int
    application_deadline: str
    status: StatusEnum
    
    
# enum for status of the research opportunity
class StatusEnum(str):
    OPEN = "open"
    CLOSED = "closed"



