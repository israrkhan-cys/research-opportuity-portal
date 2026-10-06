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

# POST /api/opportunities
@app.post("/api/opportunities")
def create_opportunity(opportunity: database_model.ResearchOpportunity, db: Session = Depends(get_db)):
    db.add(opportunity)
    db.commit()
    db.refresh(opportunity)
    return opportunity
                                                                                                

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
@app.put("/api/opportunities/{id}")
def update_opportunity(id: int, updated_opportunity: database_model.ResearchOpportunity, db: Session = Depends(get_db)):
    opportunity = db.query(database_model.ResearchOpportunity).filter(database_model.ResearchOpportunity.id == id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    for key, value in updated_opportunity.dict().items():
        setattr(opportunity, key, value)
    db.commit()
    db.refresh(opportunity)
    return opportunity


# Delete /api/opportunities/:id
@app.delete("/api/opportunities/{id}")
def delete_opportunity(id: int, db: Session =Depends(get_db)):
    opportunity = db.query(database_model.ResearchOpportunity).filter(database_model.ResearchOpportunity.id == id).first();
    if not opportunity:
        return HTTPException(status_code=404, detail="Opportunity not found")
    db.delete(opportunity)
    db.commit()
    
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
 







