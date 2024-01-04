import {
    onGetTasks,
    saveTask,
    deleteTask,
    getTask,
    updateTask,
    getTasks, auth, googleAuthProvider
  } from "./firebase.js";
  import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  
  const taskForm = document.getElementById("task-form");
  const tasksContainer = document.getElementById("tasks-container");
  
  let editStatus = false;
  let id = "";

  const btnLoginGoogle = document.getElementById("btn-login-google");

  btnLoginGoogle.addEventListener("click", async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider); // Usar googleAuthProvider aquí
      // El usuario ha iniciado sesión correctamente con Google.
      // Puedes realizar acciones adicionales aquí, como redirigir a una página después del inicio de sesión.
    } catch (error) {
      console.error(error);
    }
  });

  const userNameDisplay = document.getElementById("userDisplay");

  // Añade un oyente para manejar cambios en la sesión (login/logout)
auth.onAuthStateChanged((user) => {
  if (user) {
    // Usuario ha iniciado sesión
    console.log("Usuario ha iniciado sesión:", user.displayName);
    userNameDisplay.innerText = `¡Hola, ${userName}!`;
    const name = document.getElementById('username').innerText = `${userName}`;
    // Puedes realizar acciones adicionales para usuarios autenticados aquí
  } else {
    // Usuario ha cerrado sesión
    console.log("Usuario ha cerrado sesión");
    // Puedes realizar acciones adicionales para usuarios no autenticados aquí
  }
});
  
  window.addEventListener("DOMContentLoaded", async (e) => {
    // const querySnapshot = await getTasks();
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.data());
    // });
  
    onGetTasks((querySnapshot) => {
      tasksContainer.innerHTML = "";
  
      querySnapshot.forEach((doc) => {
        const task = doc.data();
  
        tasksContainer.innerHTML += `
        <div class="card card-body mt-2 border-primary">
      <h3 class="h5">${task.title}</h3>
      <p>${task.description}</p>
      <div>
        <button class="btn btn-primary btn-delete" data-id="${doc.id}">
          🗑 Eliminar
        </button>
        <button class="btn btn-secondary btn-edit" data-id="${doc.id}">
          🖉 Editar
        </button>
      </div>
    </div>`;
      });
  
      const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
      btnsDelete.forEach((btn) =>
        btn.addEventListener("click", async ({ target: { dataset } }) => {
          try {
            await deleteTask(dataset.id);
          } catch (error) {
            console.log(error);
          }
        })
      );
  
      const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          try {
            const doc = await getTask(e.target.dataset.id);
            const task = doc.data();
            taskForm["task-title"].value = task.title;
            taskForm["task-description"].value = task.description;
  
            editStatus = true;
            id = doc.id;
            taskForm["btn-task-form"].innerText = "Actualizar";
          } catch (error) {
            console.log(error);
          }
        });
      });
    });
  });
  
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const title = taskForm["task-title"];
    const description = taskForm["task-description"];
  
    try {
      if (!editStatus) {
        await saveTask(title.value, description.value);
      } else {
        await updateTask(id, {
          title: title.value,
          description: description.value,
        });
  
        editStatus = false;
        id = "";
        taskForm["btn-task-form"].innerText = "Guardar";
      }
  
      taskForm.reset();
      title.focus();
    } catch (error) {
      console.log(error);
    }
  });