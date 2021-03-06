

window.addEventListener("load", async function () {

  //got the ticker symbols file from: https://github.com/yashwanth2804/TickerSymbol
  const response = await fetch("tickerSymbols.json");
  if (!response.ok) {
    console.log(response.error);
    return;
  }

  // We make dictionary a global.
  window.tickerSymbols = await response.json();

  //got the code for an autocomplete searchbar from: https://www.w3schools.com/howto/howto_js_autocomplete.asp
  autocomplete(document.getElementById('myInput'), tickerSymbols);

  document.getElementById('view-StockBtn').addEventListener('click', async () => {
    let searchVal = document.getElementById('myInput').value;
    let stockSymbol, stockName;

    //for loop to obtain the companies name and symbol
    for (i = 0; i < tickerSymbols.length; i++) {
      if(tickerSymbols[i].name === searchVal || tickerSymbols[i].symbol === searchVal){
        stockName = tickerSymbols[i].name;
        stockSymbol = tickerSymbols[i].symbol;
        break;//break statement to prevent from unnecessarily iterating through all of tickerSymbols
      }
    }

  });

  const usernameResponse = await fetch("/");
  console.log(usernameResponse);
  if (usernameResponse.ok && "username" in usernameResponse) { //if logged in
    const usernameObj = await usernameResponse.json();
    //show user button
    let navBar = document.getElementById("topbar");
    let a_navBar = document.createElement("a");
    a_navBar.classList.add("navbar-brand");
    a_navBar.href = "user.html";
    a_navBar.innerHTML = usernameObj.username;
    navBar.appendChild(a_navBar);
  }
  else { //show login/signupbuttons
    let loginbutton = document.getElementById("buttonleft");
    let a_login = document.createElement("a");
    a_login.classList.add("btn");
    a_login.classList.add("btn-outline-secondary");
    a_login.classList.add("mx-2");
    a_login.innerHTML = "Log In";
    a_login.href = "login.html";
    loginbutton.appendChild(a_login);

    let registerbutton = document.getElementById("buttonright");
    let a_register = document.createElement("a");
    a_register.classList.add("btn");
    a_register.classList.add("btn-primary");
    a_register.classList.add("mx-2");
    a_register.classList.add("border-0");
    a_register.innerHTML = "Sign Up";
    a_register.href = "register.html";
    registerbutton.appendChild(a_register);
  }
});

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  let currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    let a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (String(arr[i].name).substr(0, val.length).toUpperCase() === val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + String(arr[i].name).substr(0, val.length) + "</strong>";
        b.innerHTML += String(arr[i].name).substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      } else if (String(arr[i].symbol).substr(0, val.length).toUpperCase() === val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + String(arr[i].symbol).substr(0, val.length) + "</strong>";
        b.innerHTML += String(arr[i].symbol).substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i].symbol + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    let x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode === 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode === 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode === 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    let x = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }


  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}