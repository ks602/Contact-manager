let form = document.getElementById("loginForm");
form.addEventListener("submit", login);

function login(e) {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let credentials = {
    "username": username,
    "password": password
  }
  fetch("../../sendLoginDetails", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(credentials)
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data.status) {
        window.localStorage.setItem('user', username);
        window.location.pathname = "/contact";
      } else {
        document.getElementById("loginFail").style.display = "block";
      }
    });
}