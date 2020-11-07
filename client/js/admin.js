document.getElementById("greet").innerHTML = "<b>Welcome " + window.localStorage.getItem('user') + "!</b>";
tbody = document.getElementById("adminTable").children[1];
let editing = false;

init();

async function init() {
  await populate();
  addBtnListeners();
}

async function populate() {
  let res = await fetch("../../accounts");
  let accounts = await res.json();

  accounts.forEach(account => {
    let acc_id = "<td>" + account["acc_id"] + "</td>";
    let acc_name = "<td>" + account["acc_name"] + "</td>";
    let acc_login = "<td>" + account["acc_login"] + "</td>";
    let acc_pw = "<td></td>";
    let check = account["acc_role"] == "admin" ? 'checked="checked"' : "";
    let acc_role = '<td><input type="checkbox" class="adminFormInput" disabled="disabled"' + check + '></td>';
    let btns = '<td><a href="#" id="editBtn"><i class="far fa-edit tool"></i></a><a href="#" id="deleteBtn"><i class="fas fa-trash-alt tool"></i></a></td>';
    let html = "<tr>" + acc_id + acc_name + acc_login + acc_pw + acc_role + btns + "</tr>";
    tbody.innerHTML += html;
  });

}

function addBtnListeners() {
  document.querySelectorAll("#editBtn").forEach((btn) => btn.addEventListener("click", e => {
    e.preventDefault();
    if (!editing) {
      editing = true;
      editUser(e);
    }
  }));
  document.querySelectorAll("#deleteBtn").forEach((btn) => btn.addEventListener("click", e => {
    e.preventDefault();
    deleteUser(e);
  }));
}

let addBtn = document.getElementById("addBtn");
let btnPressed = false;
addBtn.addEventListener("click", (e) => {
  if (!btnPressed) {
    btnPressed = true;
    html = '<tr> <td></td><td><input type="text" class="adminFormInput" id="acc_name_add"></td> <td><input type="text" class="adminFormInput" id="acc_login_add"></td> <td><input type="text" class="adminFormInput" id="acc_password_add"></td><td><input type="checkbox" id="acc_role_add" class="adminFormInput"></td><td><a href="#" id="confirmAdd"><i class="fas fa-save tool"></i></a> <a href="#" id="removeAdd"><i class="fas fa-times tool"></i></a></td> </tr>';
    tbody.innerHTML += html;

    let confirmAdd = document.getElementById("confirmAdd");
    confirmAdd.addEventListener("click", addUser);
  }

  let removeAdd = document.getElementById("removeAdd");
  removeAdd.addEventListener("click", () => {
    tbody.removeChild(tbody.lastChild);
    btnPressed = false;
    document.getElementById("errorMsg").style.display = "none";
  });
})

//try to add user to the database
function addUser() {
  let data = {
    acc_name: document.getElementById("acc_name_add").value,
    acc_login: document.getElementById("acc_login_add").value,
    acc_password: document.getElementById("acc_password_add").value,
    acc_role: document.getElementById("acc_role_add").checked ? "admin" : "basic"
  };

  if (data.acc_login.trim().length == 0) {
    document.getElementById("errorMsg").style.display = "block";
    document.getElementById("errorMsg").innerText = "Error: The login should consist at least 1 character!"
    return;
  }

  fetch("../../user", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.status) {
        window.location.reload();
      } else {
        document.getElementById("errorMsg").style.display = "block";
      }
    });
}

function deleteUser(e) {
  e.preventDefault();
  let acc_login = e.target.parentNode.parentNode.children[2].innerHTML;
  let data = {
    acc_login: acc_login
  };

  fetch("../../user", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.status) {
        window.location.reload();
      } else {
        document.getElementById("errorMsg").style.display = "block";
        document.getElementById("errorMsg").innerText = "Error: Cannot delete logged in user!"
      }
    });
}

function editUser(e) {
  let acc_id = e.target.parentNode.parentNode.children[0].innerHTML;
  let acc_name = e.target.parentNode.parentNode.children[1].innerHTML;
  let acc_login = e.target.parentNode.parentNode.children[2].innerHTML;

  updateElements(e);
  document.getElementById("acc_name_edit").value = acc_name;
  document.getElementById("acc_login_edit").value = acc_login;

  let resetEditBtn = document.getElementById("resetEditBtn");
  resetEditBtn.addEventListener("click", () => {
    window.location.reload();
  })

  let saveEditBtn = document.getElementById("saveEditBtn");
  saveEditBtn.addEventListener("click", () => {
    let data = {
      acc_id: acc_id,
      new_name: document.getElementById("acc_name_edit").value,
      new_login: document.getElementById("acc_login_edit").value,
      new_password: document.getElementById("acc_password_edit").value,
      new_role: document.getElementById("acc_role_edit").checked ? "admin" : "basic"
    };

    if (data.new_login.trim().length == 0) {
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("errorMsg").innerText = "Error: The login should consist at least 1 character!"
      return;
    }

    fetch("../../user", {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.status) {
          window.location.reload();
        } else {
          document.getElementById("errorMsg").style.display = "block";
          document.getElementById("errorMsg").innerText = "Error: The login is used by another user!"
        }
      });
  })
}

function updateElements(e) {
  e.target.parentNode.parentNode.children[1].innerHTML = '<input type="text" class="adminFormInput" id="acc_name_edit">';
  e.target.parentNode.parentNode.children[2].innerHTML = '<input type="text" class="adminFormInput" id="acc_login_edit">';
  e.target.parentNode.parentNode.children[3].innerHTML = '<input type="text" class="adminFormInput" id="acc_password_edit">';
  e.target.parentNode.parentNode.children[4].children[0].disabled = false;
  e.target.parentNode.parentNode.children[4].children[0].id = "acc_role_edit";
  e.target.parentNode.innerHTML = '<a href="#" id="saveEditBtn"><i class="far fa-save tool"></i></a><a href="#" id="resetEditBtn"><i class="fas fa-sync-alt tool"></i></a>';
}