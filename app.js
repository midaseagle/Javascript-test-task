const submit = document.querySelector("button");
const input = document.getElementsByTagName("input");
const textArea = document.querySelector("textarea");

function getFormData(selector) {
  const form = document.querySelector(selector);
  return Object.fromEntries(new FormData(form));
}

function validator(formdata) {
  const error = [];

  const validationRules = {
    firstName: {
      required: true,
      validate: (x) => x.length && /^[A-Za-z]+$/.test(x),
      errorMessage: "firstname should only contain alphabetical characters",
    },

    lastName: {
      required: true,
      validate: (x) => x.length && /^[A-Za-z]+$/.test(x),
      errorMessage: "lastname should only contain alphabetical characters",
    },

    address: {
      required: true,
      validate: (x) => x.length > 0 && x.length <= 35,
      errorMessage:
        "address should be defined an should be less or equal 35 characters",
    },
  };
  Object.entries(formdata).forEach(([key, value]) => {
    if (key in validationRules) {
      if (!validationRules[key].validate(value)) {
        error.push(validationRules[key].errorMessage);
      }
    }
  });
  return error;
}

function displayErrorMessages(errors) {
  const alert = document.querySelector("#errors");
  const messages = errors.reduce(
    (prev, curr) => (prev += `<li>${curr}</li>`),
    ""
  );
  alert.innerHTML += messages;
  alert.style.display = "block";
  const errorRemoveButton = document.querySelector("#errors span");
  errorRemoveButton.addEventListener("click", () => {
    document.getElementById("errors").style.display = "none";
    submit.disabled = false;
    alert.innerHTML = "<span>X</span>";
  });
}

function renderData(data) {
  const table = document.querySelector("table.table");
  const tbody = table.querySelector("tbody");

  const tr = document.createElement("tr");
  tr.setAttribute("role", "button");
  tr.setAttribute("data-bs-container", "body");
  tr.setAttribute("data-bs-toggle", "popover");
  tr.setAttribute("data-bs-placement", "top");
  tr.setAttribute("data-bs-content", data.notes);
  const removeButton = document.createElement("button");

  removeButton.addEventListener("click", () => {
    remove(data.id);
  });
  const notesButton = document.createElement("button");
  notesButton.addEventListener("click", () => {
    handleNotesClick(data.id);
  });

  removeButton.innerHTML = "X";
  notesButton.innerHTML = "NOTES";
  tr.innerHTML = `<td data-label="#">${data.id}</td>
    <td data-label="FirstName">${data.firstName}</td>
    <td data-label="LastName">${data.lastName}</td>
    <td data-label="Address">${data.address}</td>
    <td data-label="Birth Date">${data.birthDate}</td>
    <td data-label="Gender">${data.gender}</td>
 `;
  tr.appendChild(removeButton);
  tr.appendChild(notesButton);
  tbody.appendChild(tr);
}

function handleNotesClick(id) {
  const data = JSON.parse(localStorage.getItem("users"));
  const needData = data.filter((el) => el.id == id);
  alert(needData[0].notes);
}

function renderAfterDeletingUser(id) {
  const table = document.querySelector("table.table");
  const tbody = table.querySelector("tbody");
  const allTr = tbody.querySelectorAll("tr");
  for (let i = 0; i < allTr.length; i++) {
    if (allTr[i].children[0].innerHTML == id) {
      tbody.removeChild(allTr[i]);
    }
  }
}

function remove(id) {
  const currentUsers = JSON.parse(localStorage.getItem("users"));
  if (!currentUsers) return;
  const x = currentUsers.filter((x) => x.id !== id);
  renderAfterDeletingUser(id);
  localStorage.setItem(
    "users",
    JSON.stringify(currentUsers.filter((x) => x.id !== id))
  );
}

function saveData(data) {
  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  let currentId = localStorage.getItem("id") || 0;
  currentId++;
  existingUsers.push({ ...data, id: currentId });
  localStorage.setItem("users", JSON.stringify(existingUsers));
  localStorage.setItem("id", currentId);

  return { ...data, id: currentId };
}

function handleSubmit(e) {
  e.preventDefault();
  const data = getFormData("form");
  const errors = validator(data);

  if (errors.length) {
    submit.disabled = true;
    return displayErrorMessages(errors);
  }
  renderData(saveData(data));
  for (let i = 0; i < input.length; i++) {
    input[i].value = "";
  }
  textArea.value = "";
}

function reload() {
  const users = localStorage.getItem("users");
  if (users) {
    JSON.parse(users).forEach(renderData);
  }
}

function handleInputChange() {
  submit.disabled = false;
}

submit.addEventListener("click", handleSubmit);
for (let i = 0; i < input.length; i++) {
  input[i].addEventListener("keydown", handleInputChange);
}
window.addEventListener("load", () => {
  const users = localStorage.getItem("users");
  reload();
});
