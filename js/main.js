import { db } from "./firebase-config.js";
import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ===============================
// DOM Elements
// ===============================

const modal = document.getElementById("consultationModal");
const openBtnNav = document.getElementById("openConsultation");
const openBtnHero = document.getElementById("openConsultationHero");
const openBtnMobile = document.getElementById("mobileStickyCTA");
const closeBtn = document.getElementById("closeModal");
const form = document.getElementById("consultationForm");

// ===============================
// Open Modal
// ===============================

function openModal() {
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
}

// Attach CTA listeners
if (openBtnNav) openBtnNav.addEventListener("click", openModal);
if (openBtnHero) openBtnHero.addEventListener("click", openModal);
if (openBtnMobile) openBtnMobile.addEventListener("click", openModal);

if (closeBtn) closeBtn.addEventListener("click", closeModal);

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// ===============================
// Form Submission
// ===============================

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !email || !phone) {
        alert("Please fill all fields.");
        return;
    }

    try {
        // Save to Firestore
        const docRef = await addDoc(collection(db, "consultations"), {
            name: name,
            email: email,
            phone: phone,
            amount: 298,
            status: "pending_payment",
            createdAt: serverTimestamp()
        });

        // Redirect to payment page with document ID
        window.location.href = `payment.html?id=${docRef.id}`;

    } catch (error) {
        console.error("Error saving consultation:", error);
        alert("Something went wrong. Please try again.");
    }
});
// ===============================
// Scroll Reveal Animation
// ===============================

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.2
});

document.querySelectorAll(".coaching-card").forEach(card => {
    card.classList.add("fade-in");
    observer.observe(card);
});
