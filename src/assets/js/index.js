"use strict";

import plants from "../images/plants/*.jpg";
import icons from "../images/icons/*.svg";

function getImagePlants(name) {
  return plants[name.split('/').pop().replace('.png', '')];
}

function getImgWater(name) {
  switch (name) {
    case "rarely":
      return icons["1-drop"];
    case "regularly":
      return icons["2-drops"];
    case "daily":
      return icons["3-drops"];
    default:
      return icons["1-drop"];
  }
}

function getImgPet(name) {
  switch (name) {
    case false:
      return icons["pet"];
    case true:
      return icons["toxic"];
    default:
      return icons["toxic"];
  }
}

function getImgSun(name) {
  return icons[name];
}

function request(sun, water, dog) {
  return new Promise((res, rej) => {

    let xhr = new XMLHttpRequest();

    xhr.open('GET', `https://front-br-challenges.web.app/api/v2/green-thumb/?sun=${sun}&water=${water}&pets=${dog}`);
    // xhr.open('GET', `https://front-br-challenges.web.app/api/v2/green-thumb/?sun=high&water=regularly&pets=false`);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4)
        if (xhr.status === 200) {
          res(JSON.parse(xhr.responseText))
        } else {
          rej({ err: "No returns yet..." })
        }
    }

    xhr.send();
  })
}

function loadRequest(res) {
  let plantList = res;
  let element = document.createElement("div");
  element.setAttribute("class", "row");

  let countPerLine = 0;

  plantList.forEach((obj, index, array) => {
    let div = document.createElement("div");
    let img0 = document.createElement("img");
    let img1 = document.createElement("img");
    let img2 = document.createElement("img");
    let img3 = document.createElement("img");
    let img4 = document.createElement("img");
    let h1 = document.createElement("h1");
    let p = document.createElement("p");

    img0.setAttribute("src", icons["staff-favorite"]);
    img0.setAttribute("alt", "Favorite");

    img1.setAttribute("src", getImagePlants(obj.url));
    img1.setAttribute("alt", "plant");

    img2.setAttribute("src", getImgPet(obj.toxicity));
    img2.setAttribute("alt", "pet");

    img3.setAttribute("src", getImgSun(`${obj.sun}-sun`));
    img3.setAttribute("alt", `${obj.sun} sun`);

    img4.setAttribute("src", getImgWater(obj.water));
    img4.setAttribute("alt", "drop");

    h1.textContent = obj.name;
    p.textContent = `$${obj.price}`;

    if (obj.staff_favorite) {
      countPerLine += 2;
      div.setAttribute("class", "col mg-right democlass favorite");
    } else {
      if (index === (array.length - 1)) {
        div.setAttribute("class", "col democlass");
      } else {
        if (countPerLine === 3) {
          countPerLine = 0;
          div.setAttribute("class", "col mg-bottom democlass");
        } else {
          countPerLine++;
          div.setAttribute("class", `col mg-right mg-bottom democlass ${obj.staff_favorite ? "favorite" : ""}`);
        }
      }
    }

    if (obj.staff_favorite)
      div.appendChild(img0);

    div.appendChild(img1);
    div.appendChild(h1);
    div.appendChild(p);
    div.appendChild(img2);
    div.appendChild(img3);
    div.appendChild(img4);

    element.appendChild(div);
  })

  document.querySelector(".content").appendChild(element);
}

var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function (e) {
      /*when an item is clicked, update the original select box,
      and the selected item:*/
      var y, i, k, s, h, sl, yl;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      sl = s.length;
      h = this.parentNode.previousSibling;
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");
          this.setAttribute("data-value", s.options[i].value);
          this.setAttribute("data-id", s.options[i].parentNode.id);

          // value of select
          const sunValue = s.options[i].parentNode.id === "select-sunlight" ? s.options[i].value : document.querySelector("[data-id=select-sunlight]") !== null ? document.querySelector("[data-id=select-sunlight]").getAttribute("data-value") : "";
          const waterValue = s.options[i].parentNode.id === "select-water" ? s.options[i].value : document.querySelector("[data-id=select-water]") !== null ? document.querySelector("[data-id=select-water]").getAttribute("data-value") : "";
          const dogValue = s.options[i].parentNode.id === "select-dog" ? s.options[i].value : document.querySelector("[data-id=select-dog]") !== null ? document.querySelector("[data-id=select-dog]").getAttribute("data-value") : "";

          if (sunValue === "" || waterValue === "" || dogValue === "") {
            document.querySelector("#section-success").style.display = "none";
            document.querySelector("#section-error").style.display = "";
          } else {
            document.querySelector("#section-success").style.display = "";
            document.querySelector("#section-error").style.display = "none";
          }

          request(sunValue, waterValue, dogValue).then(res => {
            document.querySelector(".content").replaceChildren();
            loadRequest(res);
          }).catch(err => console.log("err > ", err));
          debugger;

          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function (e) {
    /*when the select box is clicked, close any other select boxes,
    and open/close the current select box:*/
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");

  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

document.querySelector("#section-success button").addEventListener("click", function () {
  scroll(0, 0);
})

// value of select
const sunValue = document.querySelector("[data-id=select-sunlight]") !== null ? document.querySelector("[data-id=select-sunlight]").getAttribute("data-value") : "";
const waterValue = document.querySelector("[data-id=select-water]") !== null ? document.querySelector("[data-id=select-water]").getAttribute("data-value") : "";
const dogValue = document.querySelector("[data-id=select-dog]") !== null ? document.querySelector("[data-id=select-dog]").getAttribute("data-value") : "";

if (sunValue === "" || waterValue === "" || dogValue === "") {
  document.querySelector("#section-success").style.display = "none";
  document.querySelector("#section-error").style.display = "";
} else {
  document.querySelector("#section-success").style.display = "";
  document.querySelector("#section-error").style.display = "none";
}
