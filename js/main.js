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

// ===============================
// Premium Coaching Carousel
// ===============================

const carousel = document.getElementById("coachingCarousel");
const cards = document.querySelectorAll(".carousel-card");
const dotsContainer = document.getElementById("carouselDots");

if (carousel && cards.length) {

let currentIndex = 0;
let autoRotate;
let isDragging = false;
let startX = 0;
let rotateInterval = 5000;

// Create dots
cards.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => {
        currentIndex = index;
        updateCarousel();
        resetAutoRotate();
    });
    dotsContainer.appendChild(dot);
});

function updateDots() {
    document.querySelectorAll(".carousel-dots span")
        .forEach((dot, index) => {
            dot.classList.toggle("active-dot", index === currentIndex);
        });
}

function updateCarousel() {
    cards.forEach((card, index) => {
        card.classList.remove("active", "left", "right");
        card.style.transform = "";

        if (index === currentIndex) {
            card.classList.add("active");
        } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
            card.classList.add("left");
        } else if (index === (currentIndex + 1) % cards.length) {
            card.classList.add("right");
        }
    });

    updateDots();
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
}

function startAutoRotate() {
    autoRotate = setInterval(nextSlide, rotateInterval);
}

function resetAutoRotate() {
    clearInterval(autoRotate);
    startAutoRotate();
}

// Pause on hover
carousel.addEventListener("mouseenter", () => clearInterval(autoRotate));
carousel.addEventListener("mouseleave", () => {
    updateCarousel();
    startAutoRotate();
});

// Drag
carousel.addEventListener("pointerdown", e => {
    isDragging = true;
    startX = e.clientX;
});

carousel.addEventListener("pointermove", e => {
    if (!isDragging) return;

    const diff = e.clientX - startX;
    const activeCard = cards[currentIndex];

    activeCard.style.transform =
        `translate(-50%, -50%) scale(1) rotateY(${diff * 0.08}deg)`;
});

carousel.addEventListener("pointerup", e => {
    if (!isDragging) return;

    const diff = e.clientX - startX;

    if (diff > 80) {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    } else if (diff < -80) {
        currentIndex = (currentIndex + 1) % cards.length;
    }

    isDragging = false;

    updateCarousel();
    resetAutoRotate();
});

// 3D hover tilt
carousel.addEventListener("mousemove", e => {
    if (isDragging) return;

    const activeCard = cards[currentIndex];
    const rect = activeCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    const rotateY = ((x / width) - 0.5) * 12;

    activeCard.style.transform =
        `translate(-50%, -50%) scale(1) rotateY(${rotateY}deg)`;
});

carousel.addEventListener("mouseleave", () => {
    updateCarousel();
});

updateCarousel();
startAutoRotate();

}
