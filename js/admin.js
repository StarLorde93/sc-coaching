import { auth, provider, db } from "./firebase-config.js";
import {
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔐 Replace with your actual admin email
const ADMIN_EMAIL = "youradminemail@gmail.com";

// DOM Elements
const googleLoginBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const tableBody = document.getElementById("consultationsTable");

// ===============================
// Google Login
// ===============================

googleLoginBtn.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed.");
    }
});

// ===============================
// Auth State Listener
// ===============================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        showLogin();
        return;
    }

    if (user.email !== ADMIN_EMAIL) {
        alert("Access denied.");
        await signOut(auth);
        showLogin();
        return;
    }

    showDashboard();
    loadConsultations();
});

// ===============================
// Show Login
// ===============================

function showLogin() {
    loginSection.style.display = "block";
    dashboardSection.style.display = "none";
}

// ===============================
// Show Dashboard
// ===============================

function showDashboard() {
    loginSection.style.display = "none";
    dashboardSection.style.display = "block";
}

// ===============================
// Load Consultations
// ===============================

async function loadConsultations() {
    tableBody.innerHTML = "";

    try {
        const q = query(
            collection(db, "consultations"),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            const row = document.createElement("tr");
            row.style.borderBottom = "1px solid rgba(255,255,255,0.05)";

            const createdDate = data.createdAt
                ? new Date(data.createdAt.seconds * 1000).toLocaleString()
                : "—";

            row.innerHTML = `
                <td style="padding:12px;">${data.name}</td>
                <td style="padding:12px;">${data.email}</td>
                <td style="padding:12px;">${data.phone}</td>
                <td style="padding:12px;">₹${data.amount}</td>
                <td style="padding:12px; font-weight:600; color:${data.status === "paid" ? "#22c55e" : "#facc15"};">
                    ${data.status}
                </td>
                <td style="padding:12px;">${createdDate}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Error loading consultations:", error);
    }
}

// ===============================
// Logout
// ===============================

logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
});
