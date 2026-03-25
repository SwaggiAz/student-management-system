:::writing{variant=“standard” id=“83921”}

🎓 Student Management System

A modern web-based Student Management System built using Flask, SQLite, HTML, CSS, and JavaScript.
It allows administrators to manage student records, track performance, and analyze data through an interactive dashboard.

⸻

🚀 Features

🔐 Authentication
	•	Admin login system
	•	Session-based access control

📊 Dashboard
	•	Total students, average score, top score
	•	Performance overview with progress bars
	•	Top students display

👨‍🎓 Student Management
	•	Add new students
	•	Edit student details
	•	Delete students
	•	Prevent duplicate entries (email check)

📈 Analytics
	•	Subject-wise averages
	•	Top & lowest student
	•	Gender distribution charts

🏆 Leaderboard
	•	Ranking based on performance
	•	View all students sorted by score

👤 Profile Page
	•	Editable user profile
	•	Profile image upload UI
	•	Personal details management

💡 UI/UX
	•	Modern glassmorphism design
	•	Sidebar navigation
	•	Smooth animations
	•	Modal-based interactions

⸻

🛠️ Tech Stack
	•	Backend: Flask (Python)
	•	Database: SQLite
	•	Frontend: HTML, CSS, JavaScript
	•	Icons: Remix Icons

⸻

📂 Project Structure

student-management-system/
│
├── static/
│   ├── style.css
│   ├── script.js
│   └── images/
│
├── templates/
│   ├── login.html
│   ├── dashboard.html
│   ├── add_student.html
│   ├── edit_students.html
│   ├── edit_form.html
│   ├── analytics.html
│   ├── leaderboard.html
│
├── app.py
├── students.db
└── README.md

⚙️ Installation & Setup

1️⃣ Clone the repository

git clone https://github.com/SwaggiAz/student-management-system.git
cd student-management-system

2️⃣ Create virtual environment

python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

3️⃣ Install dependencies
pip install flask

4️⃣ Run the app
python app.py

5️⃣ Open in browser
http://127.0.0.1:5001

🔑 Default Login
Username: admin
Password: admin

📌 Future Improvements
	•	Role-based authentication
	•	Export data (CSV/PDF)
	•	Cloud database (PostgreSQL)
	•	API integration
	•	Mobile responsiveness

👨‍💻 Author

Aniket Zaveri

⸻

⭐ Support

If you like this project, give it a ⭐ on GitHub!
:::
