import { onGetMessages, saveMessage } from "./firebase.js";

const chatContainer = document.getElementById("chat-container");
const chatForm = document.getElementById("chat-form");

onGetMessages((querySnapshot) => {
  querySnapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      const message = change.doc.data();
      displayMessage(message);
    }
  });
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const message = document.getElementById("message").value;
  saveMessage(username, message);
  document.getElementById("message").value = "";
});

function displayMessage(message) {
  const { username, message: text } = message;
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `<strong>${username}:</strong> ${text}`;
  chatContainer.appendChild(messageElement);
}
