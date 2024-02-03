from typing import Optional, List
from uuid import UUID, uuid4
from pydantic import BaseModel
from enum import Enum

class Gender(str, Enum):
    male = 'male'
    female = 'female'
    
class Role(str, Enum):
    admin = 'admin'
    user = 'user'
    student = 'student'

class User(BaseModel):
    id: Optional[UUID] = uuid4()
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    gender: Gender
    roles: List[Role]


# Usage
# from typing import List
# from models import User, Gender, Role
# from uuid import UUID, uuid4
    
# db: List[User] = [
#     User(
#         id=UUID('bd8dd494-048c-4b6d-a7d9-2942847d6b6c'),
#         first_name='Jamila',
#         last_name='Ahmed',
#         gender=Gender.female,
#         roles=[Role.student]
#     ),
#     User(
#         id=UUID('f73d91ef-dd66-49f3-8e18-945a96af915d'),
#         first_name='Alex',
#         last_name='Jones',
#         gender=Gender.male,
#         roles=[Role.admin, Role.user]
#     )
# ]

# @app.get('/')
# async def root():
#     return {'Hello': 'World'}

# @app.get('/api/v1/users')
# async def fetch_users():
#     return db