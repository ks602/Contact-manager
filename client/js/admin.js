document.getElementById("greet").innerHTML = "<b>Welcome " + window.localStorage.getItem('user') + "!</b>";
tbody = document.getElementById("adminTable").children[1];
let editing = false;

document.getElementById("adminTable").addEventListener("click", e => {
  e.preventDefault();
  if (e.target.id == "deleteBtn")
    deleteUser(e);
  if (e.target.id == "editBtn" && !editing) {
    editing = true;
    editUser(e);
  }
});

fetch("../../accounts")
  .then(response => {
    return response.json();
  })
  .then(accounts => {
    accounts.forEach(account => {
      html = "<tr><td>" + account["acc_id"] + "</td><td>" + account[
          "acc_name"] + "</td><td>" + account["acc_login"] +
        '</td><td></td><td><a href="#" id="editBtn"><i class="far fa-edit tool"></i></a><a href="#" id="deleteBtn"><i class="fas fa-trash-alt tool"></i></a></td></tr>';
      tbody.innerHTML += html;
    });
  })

let addBtn = document.getElementById("addBtn");
let btnPressed = false;
addBtn.addEventListener("click", (e) => {
  if (!btnPressed) {
    btnPressed = true;
    html = '<tr> <td></td><td><input type="text" class="adminFormInput" id="acc_name_add"></td> <td><input type="text" class="adminFormInput" id="acc_login_add"></td> <td><input type="text" class="adminFormInput" id="acc_password_add"></td><td><a href="#" id="confirmAdd"><i class="fas fa-save tool"></i></a> <a href="#" id="removeAdd"><i class="fas fa-times tool"></i></a></td> </tr>';
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
    acc_password: document.getElementById("acc_password_add").value
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
      new_password: document.getElementById("acc_password_edit").value
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
  e.target.parentNode.innerHTML = '<a href="#" id="saveEditBtn"><i class="far fa-save tool"></i></a><a href="#" id="resetEditBtn"><i class="fas fa-sync-alt tool"></i></a>';
}