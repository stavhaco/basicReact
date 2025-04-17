from fastapi import FastAPI, Depends, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime
import os

import models
import schemas
import database
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="List Management API")

# Get allowed origins from environment variable or use default
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active WebSocket connections
active_connections: List[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        active_connections.remove(websocket)

async def broadcast_update(element: dict):
    """Broadcast updates to all connected clients"""
    for connection in active_connections:
        try:
            await connection.send_json(element)
        except:
            active_connections.remove(connection)

@app.post("/api/elements/", response_model=schemas.ListElement)
async def create_element(element: schemas.ListElementCreate, db: Session = Depends(get_db)):
    db_element = models.ListElement(**element.dict())
    db.add(db_element)
    db.commit()
    db.refresh(db_element)
    
    # Broadcast the new element to all connected clients
    await broadcast_update({
        "type": "new_element",
        "data": {
            "id": db_element.id,
            "first_name": db_element.first_name,
            "last_name": db_element.last_name,
            "country": db_element.country,
            "created_at": db_element.created_at.isoformat()
        }
    })
    
    return db_element

@app.get("/api/elements/", response_model=List[schemas.ListElement])
def get_elements(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    elements = db.query(models.ListElement)\
        .order_by(models.ListElement.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    return elements

@app.get("/")
async def root():
    return {"message": "Welcome to the List Management API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"} 