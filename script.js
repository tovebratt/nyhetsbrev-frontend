let root = document.getElementById("root");
const keyLoggedInUser = "logged in";
const loggedInMenuHTML = `<button id="logOutBtn">logga ut</button>`

//New account - welcome message
const welcomeMsg = "<h1>Välkommen!</h1><br /><span id='login'><a href='#login'>Logga in</a></span> om du redan har ett konto";

//HTML - sign in
const loggedOutMenuHTML = `
<legend>Logga in</legend\>
<input id='inpName' type='text' placeholder='Användarnamn'></input\><br>
<input id='inpPw' type='text' placeholder='Lösenord'></input\><br>
<button id='inpBtn'>LOGGA IN</button\>
`

//HTML - new account
const newAccountHTML = 
`<legend>Skapa ny användare</legend\>
<form>
<label>Användarnamn</label><br>
<input id='regName' type='text'><br>
Mailadress<br>
<input id='regEmail' type='text'><br>
Ange lösenord<br>
<input id='regPw' type='text'><br>
<div><input id='regNewsletter' type='checkbox' name="subscribe" value="newsletter">
<label for="newsletter">Jag vill prenumerera på nyhetsbrev</label><br></div>
</form>
<button id='regBtn' type='submit'>REGISTRERA</button>`



//Create account
function loadNewAccount() {
  root.insertAdjacentHTML("afterbegin", newAccountHTML);
  menu.innerHTML = welcomeMsg;
  regBtn = document.getElementById("regBtn");

  regBtn.addEventListener ("click", function() {
    let regNewAccount = {userName: regName.value, userEmail: regEmail.value, userPw: regPw.value, newsletter: regNewsletter.checked}

    fetch('https://nyhetsbrev-backend.herokuapp.com/users/newaccount', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(regNewAccount)
    })
    .then(res => res.json())
    .then(res => {
      // console.log(res)
      if (res == "error"){
        root.innerHTML = "Error!"; 
      }
      else {
        localStorage.setItem(keyLoggedInUser, res.id);
        let userName = res.userName;
        let newsletterStatus = res.newsletter;
        menu.innerHTML = "";
        loadLoggedIn(userName, newsletterStatus);
    }
  });
});
}
loadNewAccount();

//State: logged in
function loadLoggedIn(userName, newsletterStatus) {
  menu.innerHTML = "";
  menu.innerHTML = loggedInMenuHTML;
  logOutBtn = document.getElementById("logOutBtn");
  logOutBtn.addEventListener("click", function() {
    menu.innerHTML = "";
    logOutBtn.remove();
    localStorage.removeItem(keyLoggedInUser);
    loadLoggedOut();
  });
  // let loggedInUser = localStorage.getItem(keyLoggedInUser);
  root.innerHTML = "";
  root.insertAdjacentHTML("beforeend", welcomeHTML(userName, newsletterStatus));
  updateUserSettings(userName)
}

// Update user
function updateUserSettings(userName) {
  updateBtn = document.getElementById("updateBtn");
  updateBtn.addEventListener ("click", function() {
    let updateAccount = {userName: userName, newsletter: regNewsletter.checked}

    fetch('https://nyhetsbrev-backend.herokuapp.com/users/update', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateAccount)
    })
    .then(res => res.json())
    .then(res => {

      if (res == "error"){
        root.innerHTML = "Error!"; 
      }
      else {
        let userName = res.userName;
        let newsletterStatus = res.newsletter;
        menu.innerHTML = "";
        loadLoggedIn(userName, newsletterStatus);
    }
  });
});
}

// Welcome msg logged in user
function welcomeHTML(userName, newsletterStatus) {

  if (newsletterStatus == true) {
    return `<h1>Kul att se dig ${userName}!</h1> <br />
            Dina inställningar för nyhetsbrev:<br />
            <div><input id='regNewsletter' type='checkbox' name="subscribe" value="newsletter" checked>
            <label for="newsletter">Jag vill prenumerera på nyhetsbrev</label><br></div>
            <button id='updateBtn' type='submit'>UPPDATERA</button>
            `;
            
  } else {
  return `<h1>Kul att se dig ${userName}!</h1> <br />
          Dina inställningar för nyhetsbrev:<br />
          <div><input id='regNewsletter' type='checkbox' name="subscribe" value="newsletter">
          <label for="newsletter">Jag vill prenumerera på nyhetsbrev</label><br></div>
          <button id='updateBtn' type='submit'>UPPDATERA</button>
          `;
        }        
}

//login link
const login = document.getElementById("login");
login.addEventListener ("click", function() {
  root.innerHTML = "";
  menu.innerHTML = "";
  loadLoggedOut()
});

//State: logged out
function loadLoggedOut() {
  menu.insertAdjacentHTML("afterbegin", loggedOutMenuHTML);
  root.innerHTML = "";
  
  const loginBtn = document.getElementById("inpBtn");
  let inpName = document.getElementById("inpName");
  let inpPw = document.getElementById("inpPw");
  
  loginBtn.addEventListener ("click", function() {
    let loginUser = {userName: inpName.value, userPw: inpPw.value}

    fetch('https://nyhetsbrev-backend.herokuapp.com/users/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginUser)
    })
    .then(res => res.json())
    .then(res => {
      if (res == "error"){
        root.innerHTML = "Fel användarnamn eller lösenord. Testa igen eller skapa konto!"; 
      }
      else {
        localStorage.setItem(keyLoggedInUser, res.id);
        let userName = res.userName;
        let newsletterStatus = res.newsletter;
        menu.innerHTML = "";
        loadLoggedIn(userName, newsletterStatus);
      }
    });
  });
}