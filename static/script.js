function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
}

const studentData = {
    "Akash": { gender: "male", attendance: "85%", subjects: { math: 60, science: 50, english: 40 }},
    "Parth": { gender: "male", attendance: "90%", subjects: { math: 70, science: 65, english: 55 }},
    "Oman": { gender: "male", attendance: "60%", subjects: { math: 30, science: 25, english: 20 }},
    "Aniket": { gender: "male", attendance: "88%", subjects: { math: 50, science: 45, english: 40 }},
    "Jett": { gender: "male", attendance: "95%", subjects: { math: 80, science: 75, english: 70 }}
};

const avatars = {
    male: [
        "/static/images/male1.jpeg",
        "/static/images/male2.jpeg",
        "/static/images/male3.jpeg",
        "/static/images/male4.jpeg"
    ]
};

function getAvatar(name, gender){
    let index = 0;
    for(let i=0;i<name.length;i++){
        index += name.charCodeAt(i);
    }
    return avatars[gender][index % avatars[gender].length];
}

function openModal(name, score, math, science, english){
    const data = studentData[name] || {
        attendance: "N/A",
        subjects: {
            math: score,
            science: score,
            english: score
        },
        gender: "male"
    };

    const modal = document.getElementById("modal");
    modal.classList.add("show");

    document.getElementById("modalName").innerText = name;
    document.getElementById("modalScore").innerText = "Score: " + score;
    document.getElementById("attendance").innerText = data.attendance;

    document.getElementById("mathBar").style.width = math + "%";
    document.getElementById("scienceBar").style.width = science + "%";
    document.getElementById("englishBar").style.width = english + "%";

    document.getElementById("avatar").style.backgroundImage =
        `url(${getAvatar(name, data.gender)})`;
}

function closeModal(){
    document.getElementById("modal").classList.remove("show");
}

// 🔥 OPEN LOGOUT MODAL
function openLogout(){
    document.getElementById("logoutModal").classList.add("show");
}

// 🔥 CLOSE LOGOUT MODAL
function closeLogout(){
    document.getElementById("logoutModal").classList.remove("show");
}

// 🔥 CONFIRM LOGOUT
function confirmLogout(){
    window.location.href = "/logout";
}

window.onclick = function(e){
    const modal = document.getElementById("logoutModal");
    if(e.target === modal){
        closeLogout();
    }
}

function openStudent(el){
    const name = el.dataset.name;
    const score = el.dataset.score;

    const math = el.dataset.math;
    const science = el.dataset.science;
    const english = el.dataset.english;

    openModal(name, score, math, science, english);
}

document.querySelectorAll('.progress').forEach(el => {
    const value = el.dataset.score;
    el.style.width = value + "%";
});

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("keyup", function(){
        const value = this.value.toLowerCase();
        const rows = document.querySelectorAll("table tr:not(:first-child)");

        rows.forEach((row) => {
            const text = row.innerText.toLowerCase();
            const match = text.includes(value);

            row.dataset.visible = match ? "true" : "false";
        });
        currentPage = 1;
        showPage(1);
    });
}

let currentPage = 1;
let rowsPerPage = 5;

function showPage(page){
    const allRows = document.querySelectorAll("table tr:not(:first-child)");
    const rows = Array.from(allRows).filter(row => {
        return row.dataset.visible !== "false";
    });
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    currentPage = page;

    // FIRST hide ALL rows
    allRows.forEach(row => {
        row.style.display = "none";
    });

    // THEN show only filtered + paginated rows
    rows.forEach((row, i) => {
        if (i >= (page-1)*rowsPerPage && i < page*rowsPerPage){
            row.style.display = "";

            row.style.opacity = "0";
            setTimeout(() => {
                row.style.opacity = "1";
                row.style.transform = "translateY(0)";
            }, i * 80);
        }
    });

    const pageInfo = document.getElementById("pageInfo");
    if(pageInfo){
        pageInfo.innerText = "Page " + page;
    }

    updatePagination(totalPages);
}

function updatePagination(totalPages){
    const container = document.getElementById("pagination");
    if (!container) return;

    container.innerHTML = "";

    // FIRST PAGE «
    const first = document.createElement("button");
    first.innerText = "«";
    first.onclick = () => showPage(1);
    container.appendChild(first);

    // PREVIOUS ‹
    const prev = document.createElement("button");
    prev.innerText = "‹";
    prev.onclick = () => showPage(currentPage - 1);
    container.appendChild(prev);

    // SMART PAGE NUMBERS
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (start > 1){
        const dots = document.createElement("span");
        dots.innerText = "...";
        container.appendChild(dots);
    }

    for (let i = start; i <= end; i++){
        const btn = document.createElement("button");
        btn.innerText = i;

        if(i === currentPage){
            btn.classList.add("active");
        }

        btn.onclick = () => showPage(i);
        container.appendChild(btn);
    }

    if (end < totalPages){
        const dots = document.createElement("span");
        dots.innerText = "...";
        container.appendChild(dots);
    }

    // NEXT ›
    const next = document.createElement("button");
    next.innerText = "›";
    next.onclick = () => showPage(currentPage + 1);
    container.appendChild(next);

    // LAST »
    const last = document.createElement("button");
    last.innerText = "»";
    last.onclick = () => showPage(totalPages);
    container.appendChild(last);
}

function changeRows(value){
    rowsPerPage = parseInt(value);
    showPage(1);
}

function validateField(input) {
    const container = input.closest(".coolinput");
    const value = input.value.trim();

    container.classList.remove("error");

    // NAME
    if (input.name === "name" && value === "") {
        return showError(input);
    }

    // EMAIL
    if (input.name === "email") {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!valid) return showError(input);
    }

    // PHONE
    if (input.name === "phone") {
        if (value.length < 10) return showError(input);
    }

    // MARKS
    if (["math","science","english"].includes(input.name)) {
        const num = parseInt(value);
        if (num < 0 || num > 100) return showError(input);
    }

    input.classList.remove("error");
    input.classList.add("success");
}

function showError(input) {
    const container = input.closest(".coolinput");

    container.classList.add("error");
    input.classList.add("error");
    input.classList.remove("success");
}

// ===== AUTO SCORE CALC =====

const math = document.querySelector("[name='math']");
const science = document.querySelector("[name='science']");
const english = document.querySelector("[name='english']");

if (math && science && english) {

    const scoreBox = document.createElement("div");
    scoreBox.style.marginTop = "15px";
    scoreBox.style.fontWeight = "600";
    scoreBox.innerText = "Average Score: --";

    const subjectSection = document.querySelector(".form-section:last-of-type");
    subjectSection.appendChild(scoreBox);

    [math, science, english].forEach(input => {
        input.addEventListener("input", updateScore);
    });

    function updateScore() {
        const m = parseInt(math.value);
        const s = parseInt(science.value);
        const e = parseInt(english.value);

        // if all empty
        if (!math.value && !science.value && !english.value) {
            scoreBox.innerText = "Average Score: --";
            return;
        }

    const avg = Math.round(((m || 0) + (s || 0) + (e || 0)) / 3);

    scoreBox.innerText = "Average Score: " + avg;
    }
}

document.getElementById("editForm")?.addEventListener("submit", function(e){
    let valid = true;

    document.querySelectorAll(".coolinput input").forEach(input => {
        validateField(input);
        if (input.classList.contains("error")) {
            valid = false;
        }
    });

    if (!valid) {
        e.preventDefault();
    }
});

function toggleTheme(){
    document.body.classList.toggle("dark");
}

const toggle = document.getElementById("themeToggle");

if (toggle) {
    toggle.addEventListener("change", () => {
        document.body.classList.toggle("dark");
    });
}

function openEditModal(id){
    id = parseInt(id); // ✅ ensures it's a number
    const modal = document.getElementById("editModal");
    const content = document.getElementById("editContent");

    modal.classList.add("show");

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const main = document.querySelector(".main");
    if (main) {
        main.style.overflow = "hidden";
    }

    fetch(`/edit-students/${id}`)
        .then(res => res.text())
        .then(html => {
            content.innerHTML = "";
            content.innerHTML = html;

            content.scrollTop = 0;
            // ✅ FIX: re-bind confirm modal after dynamic load
            setTimeout(() => {
                const form = document.getElementById("editForm");
                const modal = document.getElementById("confirmModal");

                if (form && modal) {
                    form.onsubmit = function (e) {
                        e.preventDefault();
                        modal.classList.add("show");
                    };
                }
            }, 100);
        });
}

function closeEditModal(){
    const modal = document.getElementById("editModal");

    modal.classList.remove("show");

    document.body.style.overflow = "";

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    const main = document.querySelector(".main");
    if (main) {
        main.style.overflow = "";
    }

    // smooth exit delay
    setTimeout(() => {
        document.getElementById("editContent").innerHTML = "Loading...";
    }, 200);
}

// CLOSE MODAL ON OUTSIDE CLICK
document.addEventListener("click", function(e){
    const modal = document.getElementById("editModal");

    if(e.target === modal){
        closeEditModal();
    }
});

// CLOSE MODAL ON ESC
document.addEventListener("keydown", function(e){
    if (e.key === "Escape") {
        closeEditModal();
    }
});

function closeConfirm() {
    document.getElementById("confirmModal").classList.remove("show");
}

function submitForm() {
    const form = document.getElementById("editForm");

    if (form) {
        form.onsubmit = null; // ✅ remove preventDefault
        form.submit();        // ✅ real submit
    }
}

document.addEventListener("DOMContentLoaded", function () {

    // ===== PAGINATION INIT =====
    if (document.querySelector("table")) {
        showPage(1);
    }

    // ===== SEARCH =====
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("keyup", function(){
            const value = this.value.toLowerCase();
            const rows = document.querySelectorAll("table tr");

            rows.forEach((row, index) => {
                if(index === 0) return;

                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(value) ? "" : "none";
            });
        });
    }

    // ===== DELETE BUTTON =====
    document.querySelectorAll(".delete-container").forEach(container => {

        const deleteBtn = container.querySelector(".delete-btn");
        const yesBtn = container.querySelector(".yes");
        const noBtn = container.querySelector(".no");

        deleteBtn?.addEventListener("click", () => {
            container.classList.add("open");
        });

        noBtn?.addEventListener("click", () => {
            container.classList.remove("open");
        });

        yesBtn?.addEventListener("click", () => {
            const id = container.getAttribute("data-id");
            window.location.href = "/delete/" + id;
        });

    });

    // ===== VALIDATION =====
    document.querySelectorAll(".coolinput input").forEach(input => {
        input.addEventListener("input", () => {
            validateField(input);
        });
    });

    // ===== AUTO SCORE =====
    const math = document.querySelector("[name='math']");
    const science = document.querySelector("[name='science']");
    const english = document.querySelector("[name='english']");

    if (math && science && english) {

        const scoreBox = document.createElement("div");
        scoreBox.style.marginTop = "15px";
        scoreBox.style.fontWeight = "600";
        scoreBox.innerText = "Average Score: --";

        const subjectSection = document.querySelector(".form-section:last-of-type");
        subjectSection?.appendChild(scoreBox);

        [math, science, english].forEach(input => {
            input.addEventListener("input", updateScore);
        });

        function updateScore() {
            const m = parseInt(math.value);
            const s = parseInt(science.value);
            const e = parseInt(english.value);

            if (!math.value && !science.value && !english.value) {
                scoreBox.innerText = "Average Score: --";
                return;
            }

            const avg = Math.round(((m || 0) + (s || 0) + (e || 0)) / 3);
            scoreBox.innerText = "Average Score: " + avg;
        }
    }

});

function showProfile(){
    document.querySelector(".cards").style.display = "none";
    document.querySelector(".performance").style.display = "none";
    document.querySelector(".students").style.display = "none";

    document.querySelector(".title").innerText = "Account";

    document.getElementById("profilePage").style.display = "block";
}

function showDashboard(){
    document.querySelector(".cards").style.display = "flex";
    document.querySelector(".performance").style.display = "block";
    document.querySelector(".students").style.display = "block";

    document.querySelector(".title").innerText = "Welcome back";

    document.getElementById("profilePage").style.display = "none";
}