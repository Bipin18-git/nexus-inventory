import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Database Setup
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- SQLALCHEMY MODELS ---
class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    name = Column(String)
    price = Column(Float)
    stock_quantity = Column(Integer)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    order_date = Column(DateTime, default=datetime.utcnow)
    
    customer = relationship("Customer")
    product = relationship("Product")

Base.metadata.create_all(bind=engine)

# --- PYDANTIC SCHEMAS (Request Validation) ---
class CustomerCreate(BaseModel):
    name: str
    email: str

class ProductCreate(BaseModel):
    sku: str
    name: str
    price: float
    stock_quantity: int

class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int

# --- FASTAPI APP INITIALIZATION ---
app = FastAPI(title="Inventory & Order Management API")

# Enable CORS for the React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API ENDPOINTS ---

@app.post("/customers/")
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    db_customer = db.query(Customer).filter(Customer.email == customer.email).first()
    if db_customer:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_customer = Customer(name=customer.name, email=customer.email)
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@app.post("/products/")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(Product).filter(Product.sku == product.sku).first()
    if db_product:
        raise HTTPException(status_code=400, detail="SKU already exists")
    new_product = Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.get("/products/")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@app.get("/customers/")
def get_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()

@app.post("/orders/")
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    # 1. Verify product exists
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # 2. Prevent order if stock is insufficient
    if product.stock_quantity < order.quantity:
        raise HTTPException(status_code=400, detail="Insufficient product stock")
    
    # 3. Automatic stock reduction
    product.stock_quantity -= order.quantity
    
    # 4. Record the order
    new_order = Order(customer_id=order.customer_id, product_id=order.product_id, quantity=order.quantity)
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    return {"message": "Order placed successfully", "order_id": new_order.id, "remaining_stock": product.stock_quantity}