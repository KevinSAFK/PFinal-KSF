import {
    onGetTasks,
    saveTask,
    deleteTask,
    getTask,
    updateTask,
    getTasks, 
  } from "./firebase.js";

  let editStatus = false;
  let id = "";

  const taskForm = document.getElementById("task-form");
  const tasksContainer = document.getElementById("tasks-container");
  
  
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
      <h3 class="h5">${task.date}</h3>
      <h3 class="h5">${task.magnitud}</h3>
      <h3 class="h5">${task.type}</h3>
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
            alert("Eliminado.")
          } catch (error) {
            console.log(error);
            alert("No tienes los permisos.");
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
            taskForm["task-date"].value = task.date;
            taskForm["task-magnitud"].value = task.magnitud;
            taskForm["task-type"].value = task.type;
            taskForm["task-description"].value = task.description;
  
            editStatus = true;
            id = doc.id;
            taskForm["btn-task-form"].innerText = "Actualizar";
          } catch (error) {
            console.log(error);
            alert("No tienes los permisos.");
          }
        });
      });
    });
  });
  
  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const title = taskForm["task-title"];
    const date = taskForm["task-date"];
    const magnitud = taskForm["task-magnitud"];
    const type = taskForm["task-type"];
    const description = taskForm["task-description"];
  
    try {
      if (!editStatus) {
        await saveTask(title.value, date.value, magnitud.value, type.value, description.value);
        alert("¡Registrado!")
      } else {
        await updateTask(id, {
          title: title.value,
          date: date.value,
          magnitud: magnitud.value,
          type: type.value,
          description: description.value,
        });
  
        editStatus = false;
        id = "";
        taskForm["btn-task-form"].innerText = "Guardar";
        alert("No tienes los permisos.");
      }
  
      taskForm.reset();
      title.focus();
    } catch (error) {
      console.log(error);
    }
  });