// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnb1DgMpeKSDula4WkxCJ98sXp1luZHCU",
  authDomain: "h1bhelper-5c998.firebaseapp.com",
  databaseURL: "https://h1bhelper-5c998-default-rtdb.firebaseio.com",
  projectId: "h1bhelper-5c998",
  storageBucket: "h1bhelper-5c998.firebasestorage.app",
  messagingSenderId: "402102186934",
  appId: "1:402102186934:web:c0dbc73fc0aef924cb4717",
  measurementId: "G-XJSW3XMWQ2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}

// Form Submission
document.getElementById("travelForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    startDate: document.getElementById("startDate").value,
    origin: document.getElementById("origin").value,
    endDate: document.getElementById("endDate").value,
    destination: document.getElementById("destination").value,
    airline: document.getElementById("airline").value,
    flightNumber: document.getElementById("flightNumber").value,
    role: document.querySelector('input[name="role"]:checked').value,
    message: document.getElementById("message").value,
    languages: Array.from(document.querySelectorAll('input[name="language"]:checked')).map(el => el.value),
    contactType: document.getElementById("contactType").value,
    contactValue: document.getElementById("contactValue").value,
    timestamp: new Date().toISOString(),
    id: Date.now()
  };

  try {
    // Save to Firebase
    await database.ref(`trips/${formData.id}`).set(formData);

    // Show success message
    const successMsg = document.getElementById("successMessage");
    successMsg.style.display = "block";

    // Reset form
    document.getElementById("travelForm").reset();

    // Hide success message after 3 seconds
    setTimeout(() => {
      successMsg.style.display = "none";
    }, 3000);
  } catch (error) {
    // Show error message
    const errorMsg = document.getElementById("errorMessage");
    errorMsg.textContent = "Error: " + error.message;
    errorMsg.style.display = "block";

    setTimeout(() => {
      errorMsg.style.display = "none";
    }, 5000);
  }
});

// Contact Type Validation
document.getElementById("contactType").addEventListener("change", (e) => {
  const contactInput = document.getElementById("contactValue");
  const contactType = e.target.value;

  switch(contactType) {
    case "email":
      contactInput.type = "email";
      contactInput.placeholder = "your@email.com";
      break;
    case "instagram":
      contactInput.type = "text";
      contactInput.placeholder = "@instagram_handle";
      break;
    case "phone":
      contactInput.type = "tel";
      contactInput.placeholder = "+1 (555) 123-4567";
      break;
  }
});
