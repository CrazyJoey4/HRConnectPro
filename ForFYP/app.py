import random
import pandas as pd
import numpy
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK with your service account key
cred = credentials.Certificate("hrconnect-db-firebase-adminsdk-zsekj-2a0a9b53a0.json")
firebase_admin.initialize_app(cred)

# Connect to Firestore
db = firestore.client()

# Create a reference to the "user" collection
users_ref = db.collection("users")

# Get the documents as a list and then get the count
doc_list = list(users_ref.stream())
employee_count = len(doc_list)
print("Employee count: ", employee_count)
