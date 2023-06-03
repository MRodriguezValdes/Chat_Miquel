// Conversaciones :
class Conversation {
  constructor() {
    this.conversaciones = {};
    this.bandejaEntrada;
    this.target;
    this.targetReference;
  }

  crearChat(mailFriend) {
    if (!(mailFriend in this.conversaciones)) {
      this.conversaciones[mailFriend] = [];
      this.bandejaEntrada = document.createElement("div");
      this.bandejaEntrada.id = mailFriend;
      document.getElementById("mailFriend").append(this.bandejaEntrada);
    }
  }
}
// Inicializar conversation....
var con = new Conversation();

function modificarTarget() {
  console.log(
    "cambio target tRef:" + con.targetReference + "tar:" + con.target
  );

  con.target = document.getElementById("receptor").value;
  mostrarConversation();
}

function mostrarConversation() {
  if (con.target in con.conversaciones) {
    document.getElementById(con.target).style.display = "block";
    ocultarConversation();
    recibirMensaje();
  }
}
function ocultarConversation() {
  console.log(con.targetReference + " " + con.target);
  if (con.targetReference != con.target) {
    document.getElementById(con.targetReference).style.display = "none";
    con.targetReference = con.target;
  }
}

function iniciarConversacion() {
  con.target = document.getElementById("receptor").value;
  con.crearChat(con.target);
  if (con.targetReference == null) con.targetReference = con.target;
  mostrarConversation(con.target);
}

function verify_password() {
  let password1 = document.getElementById("password1").value;
  let password2 = document.getElementById("password2").value;

  if (password1 != password2) {
    alert("Las contraseñas no coinciden");
  } else if (password1.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres");
  } else {
    regsitrarUsuario();
  }
}
function regsitrarUsuario() {
  let ehttp = new XMLHttpRequest();
  let user = document.getElementById("name").value;
  let mail = document.getElementById("mail").value;
  let codeCountry = document.getElementById("countries").value;
  let pass = document.getElementById("password1").value;

  console.log(codeCountry);
  ehttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      location.href = "login.html";
      sessionStorage.setItem("mail", document.getElementById("mail").value);
    }
  };

  let url =
    "mail=" +
    mail +
    "&pass=" +
    pass +
    "&user=" +
    user +
    "&codeCountry=" +
    codeCountry;

  ehttp.open("POST", "http://localhost:8080/XatLLM_war_exploded/Register");
  ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ehttp.send(url);
}
function getCountries() {
  let rhttp = new XMLHttpRequest();

  rhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(rhttp.responseText);
      let selectElement = document.getElementById("countries");
      selectElement.innerHTML = ""; // empty select
      console.log(data[3]);
      for (let i = 0; i < data.length; i++) {
        let option = document.createElement("option");
        option.value = data[i].code;
        option.textContent = data[i].name;
        selectElement.appendChild(option);
      }
      console.log(data);
    }
  };
  let url = "";

  rhttp.open(
    "GET",
    "http://localhost:8080/XatLLM_war_exploded/Register?" + url,
    true
  );
  rhttp.send();
}

function getAtribute() {
  document.getElementById("mail").value = sessionStorage.getItem("mail");
  sessionStorage.clear();
}

function logout() {
  sessionStorage.clear();
  location.href = "login.html";
}

function doLogin() {
  var rhttp = new XMLHttpRequest();
  let mail = document.getElementById("mail").value;
  let pass = document.getElementById("password").value;

  rhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = rhttp.responseText;
      if (data != "false") {
        console.log(rhttp.responseText);
        sessionStorage.setItem("session", data);
        sessionStorage.setItem("mail", document.getElementById("mail").value);
        location.href = "xat.html";
      } else {
        alert("The user or pass dont exist");
      }
    }
  };

  let url = "mail=" + mail + "&pass=" + pass;
  rhttp.open(
    "GET",
    "http://localhost:8080/XatLLM_war_exploded/Login?" + url,
    true
  );
  rhttp.send();
}

function agregarAmigo() {
  let rhttp = new XMLHttpRequest();
  let mail = sessionStorage.getItem("mail");
  let session = sessionStorage.getItem("session");
  let friendMail = document.getElementById("friendMail").value;

  rhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = rhttp.responseText;
      console.log(data);
      recibirListaDeAmigos();
      switch (data) {
        case "0":
          alert("El servidor no responde");
          break;
        case "1":
          document.getElementById("friendMail").value = "";
          alert("Se ha agregado correctamente");
          break;
        case "2":
          alert("No se encuentra al amigo especificado");
          break;

        case "3":
          alert("El codigo de sesión ha expirado debe loguearse nuevamente");
          break;
      }
    }
  };

  let url = "mail=" + mail + "&session=" + session + "&friend=" + friendMail;
  console.log(url);

  rhttp.open("POST", "http://localhost:8080/XatLLM_war_exploded/Friend", true);
  rhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  rhttp.send(url);
}

function recibirListaDeAmigos() {
  let ehttp = new XMLHttpRequest();
  let mail = sessionStorage.getItem("mail");
  let session = sessionStorage.getItem("session");
  console.log(mail + " " + session);

  ehttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(ehttp.responseText);
      let selectElement = document.getElementById("receptor");
      selectElement.innerHTML = "";
      console.log(data[0]);
      for (let i = 0; i < data.length; i++) {
        let option = document.createElement("option");
        option.value = data[i];
        option.textContent = data[i];
        selectElement.appendChild(option);
      }
    }
  };

  let url = "mail=" + mail + "&session=" + session;

  ehttp.open(
    "GET",
    "http://localhost:8080/XatLLM_war_exploded/Friend?" + url,
    true
  );
  ehttp.send();
}
function insertarMensaje(mail, sms, receptor, idP, idSpan, classNameI) {
  let span = document.createElement("span");
  let i = document.createElement("i");
  let p = document.createElement("p");
  let br = document.createElement("br");
  i.className = classNameI;
  p.id = idP;
  span.id = idSpan;
  span.innerHTML = mail;
  p.append(span, ": ", sms);
  p.append(i);
  document.getElementById(receptor).append(p);
  document.getElementById(receptor).append(br);
}
function enviarMensaje() {
  let ehttp = new XMLHttpRequest();
  let mail = sessionStorage.getItem("mail");
  let session = sessionStorage.getItem("session");
  let receptor = document.getElementById("receptor").value;
  let sms = document.getElementById("sms").value;

  if (!(receptor in con.conversaciones)) {
    iniciarConversacion();
    insertarMensaje(
      mail,
      sms,
      receptor,
      "emisorText",
      "emisorTextSpan",
      "fa-solid fa-reply"
    );
  } else {
    insertarMensaje(
      mail,
      sms,
      receptor,
      "emisorText",
      "emisorTextSpan",
      "fa-solid fa-reply"
    );
  }

  ehttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("sms").value = "";
    }
  };

  let url =
    "mail=" +
    mail +
    "&session=" +
    session +
    "&receptor=" +
    receptor +
    "&sms=" +
    sms;

  ehttp.open("POST", "http://localhost:8080/XatLLM_war_exploded/Xat", true);
  ehttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  ehttp.send(url);
}

function recibirMensaje() {
  let rhttp = new XMLHttpRequest();
  let mail = sessionStorage.getItem("mail");
  let session = sessionStorage.getItem("session");
  console.log(mail);
  console.log(session);

  rhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let data = JSON.parse(rhttp.responseText);

      if (data.emisor in con.conversaciones) {
        insertarMensaje(
          data.emisor,
          data.text,
          data.emisor,
          "recibido",
          "recibidoTextSpan",
          "fa-solid fa-reply-all"
        );
      } else {
        con.crearChat(data.emisor);
        document.getElementById(data.emisor).style.display = "none";
        insertarMensaje(
          data.emisor,
          data.text,
          data.emisor,
          "recibido",
          "recibidoTextSpan",
          "fa-solid fa-reply-all"
        );
      }

      recibirMensaje();
    }
  };

  let url = "mail=" + mail + "&session=" + session;
  console.log(url);

  rhttp.open(
    "GET",
    "http://localhost:8080/XatLLM_war_exploded/Xat?" + url,
    true
  );
  rhttp.send();
}
