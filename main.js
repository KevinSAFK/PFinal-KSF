import {
  auth, googleAuthProvider
} from "./firebase.js";  
  import { signInWithPopup, signOut} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

  const userNameDisplay = document.getElementById("userDisplay");
  const btnLoginGoogle = document.getElementById("btn-login-google");
  const btnLogoutGoogle = document.getElementById("btn-logout-google"); // Agrega un botón para cerrar sesión

  btnLoginGoogle.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider); // Usar googleAuthProvider aquí
      window.location.href = "/PFinal-KSF/crud.html";
      // El usuario ha iniciado sesión correctamente con Google.
      // Puedes realizar acciones adicionales aquí, como redirigir a una página después del inicio de sesión.
    } catch (error) {
      console.error(error);
    }
  });

  btnLogoutGoogle.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "/PFinal-KSF";
      // El usuario ha cerrado sesión correctamente.
      // Puedes realizar acciones adicionales aquí, como redirigir a una página después del cierre de sesión.
    } catch (error) {
      console.error(error);
    }
  });


  // Añade un oyente para manejar cambios en la sesión (login/logout)
auth.onAuthStateChanged((user) => {
  if (user) {
    // Usuario ha iniciado sesión
    console.log("Usuario ha iniciado sesión:", user.displayName);
    userNameDisplay.innerText = `${user.displayName}`;
    const name = document.getElementById('username');
    name.innerText = `${userNameDisplay}`;

    // Puedes realizar acciones adicionales para usuarios autenticados aquí
  } else {
    // Usuario ha cerrado sesión
    console.log("Usuario ha cerrado sesión");
    // Puedes realizar acciones adicionales para usuarios no autenticados aquí
  }
});
