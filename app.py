import sqlite3
from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = "aniket_super_secure_key_2026"

# ✅ INIT DATABASE (ONLY CREATE TABLE HERE)
def init_db():
    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        dob TEXT,
        gender TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        degree TEXT,
        admission_date TEXT,       
        
        math INTEGER,
        science INTEGER,
        english INTEGER
    )
    """)

    conn.commit()
    conn.close()

# ✅ CALL DATABASE INIT
init_db()

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if username == "admin" and password == "admin":
            session['user'] = username
            return redirect(url_for('dashboard'))

    return render_template("login.html")


@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))

    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT id, name, email, gender, math, science, english
    FROM students
    """)
    data = cursor.fetchall()
    conn.close()

    students = []

    for row in data:
        math = row[4] or 0
        science = row[5] or 0
        english = row[6] or 0

        avg_score = int((math + science + english) / 3)

        students.append({
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "gender": row[3],
            "score": avg_score
        })

    # ✅ SORT BY SCORE (HIGH → LOW)
    students = sorted(students, key=lambda x: x["score"], reverse=True)

    # ✅ LIMIT DATA FOR UI
    top_students = students[:5]      # Performance Overview
    cards_students = students[:6]    # Cards

    # ✅ STATS
    if students:
        avg_score = sum(s["score"] for s in students) / len(students)
        top_score = max(s["score"] for s in students)
    else:
        avg_score = 0
        top_score = 0

    return render_template(
        "dashboard.html",
        user=session['user'],
        students=top_students,
        cards_students=cards_students,
        avg_score=round(avg_score, 1),
        top_score=top_score,
        total_students=len(students)
    )

# ===== ANALYTICS PAGE =====

@app.route('/analytics')
def analytics():
    if 'user' not in session:
        return redirect(url_for('login'))

    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()

    # TOTAL STUDENTS
    cursor.execute("SELECT COUNT(*) FROM students")
    total_students = cursor.fetchone()[0]

    # AVERAGES
    cursor.execute("SELECT AVG(math), AVG(science), AVG(english) FROM students")
    avg = cursor.fetchone()

    avg_math = int(avg[0] or 0)
    avg_science = int(avg[1] or 0)
    avg_english = int(avg[2] or 0)

    # TOP STUDENT
    cursor.execute("""
        SELECT name, (math + science + english) as total
        FROM students
        ORDER BY total DESC LIMIT 1
    """)
    top_student = cursor.fetchone()

    # LOWEST STUDENT
    cursor.execute("""
        SELECT name, (math + science + english) as total
        FROM students
        ORDER BY total ASC LIMIT 1
    """)
    low_student = cursor.fetchone()

    # GENDER DISTRIBUTION
    cursor.execute("""
        SELECT gender, COUNT(*) FROM students GROUP BY gender
    """)
    gender_data = cursor.fetchall()

    gender_labels = [row[0] for row in gender_data]
    gender_counts = [row[1] for row in gender_data]

    conn.close()

    return render_template(
        "analytics.html",
        total_students=total_students,
        avg_math=avg_math,
        avg_science=avg_science,
        avg_english=avg_english,
        top_student=top_student,
        low_student=low_student,
        gender_labels=gender_labels,
        gender_counts=gender_counts
    )

@app.route('/leaderboard')
def leaderboard():
    if 'user' not in session:
        return redirect(url_for('login'))

    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()

    cursor.execute("""
    SELECT name, math, science, english
    FROM students
    """)
    data = cursor.fetchall()
    conn.close()

    students = []

    for row in data:
        math = row[1] or 0
        science = row[2] or 0
        english = row[3] or 0

        avg = int((math + science + english) / 3)

        students.append({
            "name": row[0],
            "score": avg
        })

    # 🔥 SORT TOP FIRST
    students = sorted(students, key=lambda x: x["score"], reverse=True)

    return render_template("leaderboard.html", students=students)


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# 🔥 ADD HERE 👇
@app.route('/edit')
def edit_list():
    if 'user' not in session:
        return redirect(url_for('login'))

    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, email, math, science, english FROM students")
    data = cursor.fetchall()

    conn.close()

    students = []
    for row in data:
        math = row[3] or 0
        science = row[4] or 0
        english = row[5] or 0

        avg = int((math + science + english) / 3)

        students.append({
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "score": avg
        })

    success = request.args.get("success")

    return render_template("edit_students.html", students=students, success=success)

@app.route('/delete/<int:id>')
def delete_student(id):
    if 'user' not in session:
        return redirect(url_for('login'))

    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()

    cursor.execute("DELETE FROM students WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return redirect(url_for('edit_list'))

@app.route('/edit-students/<int:id>', methods=['GET', 'POST'])
def edit_student(id):

    conn = sqlite3.connect("students.db")
    cursor = conn.cursor()

    # ✅ UPDATE
    if request.method == "POST":
        cursor.execute("""
        UPDATE students
        SET name=?, dob=?, gender=?, email=?, phone=?, address=?, degree=?, admission_date=?,
            math=?, science=?, english=?
        WHERE id=?
        """, (
            request.form.get('name'),
            request.form.get('dob'),
            request.form.get('gender'),
            request.form.get('email'),
            request.form.get('phone'),
            request.form.get('address'),
            request.form.get('degree'),
            request.form.get('admission_date'),
            request.form.get('math'),
            request.form.get('science'),
            request.form.get('english'),
            id
        ))

        conn.commit()
        conn.close()

        return redirect(url_for('edit_list', success=1))

    # ✅ FETCH STUDENT
    cursor.execute("""
        SELECT name, dob, gender, email, phone, address, degree, admission_date,
               math, science, english
        FROM students WHERE id=?
    """, (id,))

    row = cursor.fetchone()
    conn.close()

    if not row:
        return "Student not found", 404

    student = {
        "id": id,
        "name": row[0],
        "dob": row[1],
        "gender": row[2],
        "email": row[3],
        "phone": row[4],
        "address": row[5],
        "degree": row[6],
        "admission_date": row[7],
        "math": row[8],
        "science": row[9],
        "english": row[10]
    }

    return render_template("edit_form.html", student=student)

# ✅ ADD STUDENT ROUTE
# ✅ ADD STUDENT ROUTE
@app.route('/add', methods=["GET", "POST"])
def add_student():
    if 'user' not in session:
        return redirect(url_for('login'))

    if request.method == "POST":

        if not request.form.get("dob"):
            return "DOB missing", 400

        conn = sqlite3.connect("students.db")
        cursor = conn.cursor()

        # 🚫 PREVENT DUPLICATE EMAIL
        cursor.execute("SELECT * FROM students WHERE email=?", (request.form.get("email"),))
        existing = cursor.fetchone()

        if existing:
            conn.close()
            return "Student already exists!", 400

        # ✅ INSERT NEW STUDENT
        cursor.execute("""
        INSERT INTO students (
            name, dob, gender, email, phone, address, degree, admission_date,
            math, science, english
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            request.form.get("name"),
            request.form.get("dob"),
            request.form.get("gender"),
            request.form.get("email"),
            request.form.get("phone"),
            request.form.get("address"),
            request.form.get("degree"),
            request.form.get("admission_date"),
            int(request.form.get("math") or 0),
            int(request.form.get("science") or 0),
            int(request.form.get("english") or 0)
        ))

        conn.commit()
        conn.close()

        return redirect(url_for('dashboard'))

    return render_template("add_student.html")


if __name__ == "__main__":
    app.run(debug=True, port=5001)