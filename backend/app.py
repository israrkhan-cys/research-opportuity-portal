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

from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
import backend.models as models
from backend.database import SessionLocal, engine,get_db
import backend.database_model as database_model
database_model.Base.metadata.create_all(bind=engine)
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# POST /api/opportunitiess
# GET /api/opportunities
@app.get("/api/opportunities")
def get_opportunities(db : Session = Depends(get_db)):
    opportunities = db.query(database_model.ResearchOpportunity).all()
    return opportunities


# GET /api/opportunities/:id
@app.get("/api/opportunities/{id}")
def get_opportunity(id: int, db: Session = Depends(get_db)):
    opportunity = db.query(database_model.ResearchOpportunity).filter(database_model.ResearchOpportunity.id == id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opportunity

# PUT /api/opportunities/:id

# Delete /api/opportunities/:id


app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")








