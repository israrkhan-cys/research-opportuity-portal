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

app=FastAPI()


@app.get('/')
def hello_world():
    return {'Hello': 'World'}


@app.post

