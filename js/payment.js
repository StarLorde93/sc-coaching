import { db } from "./firebase-config.js";
import {
    doc,
    updateDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ===============================
// Get Consultation ID from URL
// ===============================

const urlParams = new URLSearchParams(window.location.search);
const consultationId = urlParams.get("id");

const payBtn = document.getElementById("payNowBtn");

if (!consultationId) {
    alert("Invalid payment session.");
    window.location.href = "index.html";
}

// ===============================
// Validate Consultation Exists
// ===============================

async function validateConsultation() {
    try {
        const docRef = doc(db, "consultations", consultationId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            alert("Consultation not found.");
            window.location.href = "index.html";
        }

    } catch (error) {
        console.error("Validation error:", error);
        alert("Something went wrong.");
        window.location.href = "index.html";
    }
}

validateConsultation();

// ===============================
// Simulate Payment Success
// ===============================

payBtn.addEventListener("click", async () => {

    try {
        const docRef = doc(db, "consultations", consultationId);

        await updateDoc(docRef, {
            status: "paid",
            paidAt: new Date()
        });

        alert("Payment Successful!");

        window.location.href = "index.html?success=true";

    } catch (error) {
        console.error("Payment update error:", error);
        alert("Payment update failed.");
    }

});
