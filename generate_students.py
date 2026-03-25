import sqlite3
import random
from datetime import datetime, timedelta

conn = sqlite3.connect("students.db")
cursor = conn.cursor()

# REALISTIC INDIAN DATA
first_names_male = ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Krishna","Ishaan","Rohan","Kabir"]
first_names_female = ["Ananya","Diya","Saanvi","Aditi","Meera","Sara","Ira","Navya","Anika","Riya"]

last_names = ["Sharma","Verma","Patel","Reddy","Nair","Singh","Yadav","Gupta","Mehta","Kapoor"]

cities = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Pune","Kolkata","Ahmedabad"]

domains = ["gmail.com","yahoo.com","outlook.com"]

degrees = ["BSc","BCom","BTech","BA","BBA"]

def random_dob():
    start = datetime(2000, 1, 1)
    end = datetime(2005, 12, 31)
    return (start + timedelta(days=random.randint(0, (end-start).days))).strftime("%Y-%m-%d")

def random_phone():
    # Indian realistic format (starts with 9/8/7)
    return str(random.choice([9,8,7])) + "".join([str(random.randint(0,9)) for _ in range(9)])

for i in range(100):
    gender = random.choice(["male","female"])

    if gender == "male":
        first = random.choice(first_names_male)
    else:
        first = random.choice(first_names_female)

    last = random.choice(last_names)

    name = f"{first} {last}"
    email = f"{first.lower()}.{last.lower()}{i}@{random.choice(domains)}"

    cursor.execute("""
    INSERT INTO students (
        name, dob, gender, email, phone, address, degree, admission_date,
        math, science, english
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        name,
        random_dob(),
        gender,
        email,
        random_phone(),
        random.choice(cities),
        random.choice(degrees),
        "2023-06-01",
        random.randint(35, 100),
        random.randint(35, 100),
        random.randint(35, 100)
    ))

conn.commit()
conn.close()

print("🔥 100 realistic (safe) students added!")