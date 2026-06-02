"""
VERIDACT — Database Seeder
Drops/creates tables and seeds initial demo users.
"""
import sys

from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.services.auth_service import get_password_hash


def seed_database(reset: bool = False):
    print("=" * 60)
    print("VERIDACT DATABASE SEEDER")
    print("=" * 60)
    
    if reset:
        print("[*] Reset flag detected. Dropping all tables...")
        Base.metadata.drop_all(bind=engine)
        print("[*] Recreating all tables...")
        Base.metadata.create_all(bind=engine)
    else:
        # Just ensure tables exist
        Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if idempotent
        if db.query(User).filter(User.email == "admin@veridact.gov.np").first():
            print("[*] Database is already seeded. (admin@veridact.gov.np exists)")
        else:
            print("[*] Seeding demo users...")
            hashed_pwd = get_password_hash("demo1234")
            
            users_to_create = [
                User(email="admin@veridact.gov.np", name="System Administrator", role="super_admin", password_hash=hashed_pwd, organization="Veridact Admin"),
                User(email="supervisor@veridact.gov.np", name="Priya Sharma", role="supervisor", password_hash=hashed_pwd, organization="Nepal Cyber Bureau"),
                User(email="inv1@veridact.gov.np", name="Officer Ram Shrestha", role="investigator", password_hash=hashed_pwd, organization="Nepal Cyber Bureau"),
                User(email="inv2@veridact.gov.np", name="Officer Sita Rai", role="investigator", password_hash=hashed_pwd, organization="Nepal Cyber Bureau"),
                User(email="citizen1@veridact.gov.np", name="Arjun Thapa", role="citizen", password_hash=hashed_pwd, organization=None),
                User(email="citizen2@veridact.gov.np", name="Nisha Gurung", role="citizen", password_hash=hashed_pwd, organization=None),
            ]
            
            db.add_all(users_to_create)
            db.commit()
            print("[*] Successfully created 6 demo users.")

        print("\n" + "-" * 60)
        print("DEMO CREDENTIALS (Password for all: demo1234)")
        print("-" * 60)
        print(f"{'Role':<15} | {'Email':<25} | Name")
        print("-" * 60)
        users = db.query(User).order_by(User.role.desc()).all()
        for u in users:
            print(f"{u.role:<15} | {u.email:<25} | {u.name}")
        print("-" * 60)

    finally:
        db.close()


if __name__ == "__main__":
    reset = "--reset" in sys.argv
    seed_database(reset=reset)
