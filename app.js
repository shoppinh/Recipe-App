const container = document.querySelector(".fav-meals");
const searchBtn = document.querySelector("#search");
const mealEls = document.querySelector(".meals");
const mealPopup = document.querySelector("#meal-popup");
const mealInfoEls = document.querySelector("#meal-info");

searchBtn.addEventListener("click", async function (e) {
  //clear the meals when search another
  mealEls.innerHTML = "";
  const value = e.currentTarget.previousElementSibling.value;
  const meals = await getMealByName(value);
  if (meals) {
    meals.forEach(function (meal) {
      renderMeal(meal, false);
    });
  } else {
    alert("There is no food like that");
  }
});
async function getRandomMeal() {
  let randomMealAPI = "https://www.themealdb.com/api/json/v1/1/random.php";
  const resp = await fetch(randomMealAPI);
  const respData = await resp.json();
  const randomMeal = respData.meals[0];
  renderMeal(randomMeal, true);
}

async function getMealById(id) {
  let mealByIdAPI =
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;

  const resp = await fetch(mealByIdAPI);
  const respData = await resp.json();
  const meal = respData.meals[0];
  return meal;
}

async function getMealByName(name) {
  let mealByNameAPI =
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + name;

  const resp = await fetch(mealByNameAPI);
  const respData = await resp.json();
  const meal = respData.meals;
  return meal;
}

function renderMeal(randomMeal, random = false) {
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `
    <div id="${randomMeal.idMeal}" class="meal-header">
            ${random ? `<span class="random"> Random Recipe </span>` : ""}
            <img
              src="${randomMeal.strMealThumb}"
              alt="${randomMeal.strMeal}"
            />
          </div>
          <div class="meal-body">
            <h4>${randomMeal.strMeal}</h4>
            <button class="fav-btn">
              <i class="fas fa-heart" aria-hidden="true"></i>
            </button>
          </div>`;
  mealEls.appendChild(meal);

  meal.querySelector("img").addEventListener("click", function () {
    updateMealInfo(randomMeal);
  });

  const favBtn = meal.querySelector(".fav-btn");
  favBtn.addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("active")) {
      removeFromLocalStorage(randomMeal.idMeal);
      e.currentTarget.classList.remove("active");
      removeMealFav(randomMeal.idMeal);
    } else {
      addToLocalStorage(randomMeal.idMeal, randomMeal);
      e.currentTarget.classList.add("active");
      addMealFav(randomMeal);
    }
  });
}
async function getMealByNumber(number) {}
async function renderFavoriteMeal() {
  const mealsFromLS = getFromLocalStorage();
  for (let i = 0; i < mealsFromLS.length; i++) {
    const mealID = mealsFromLS[i].id;
    meal = await getMealById(mealID);
    //render to view
    addMealFav(meal);
  }
}
function addMealFav(meal) {
  let element = document.createElement("li");
  element.className = `${meal.idMeal}`;
  element.innerHTML = `<img
             src="${meal.strMealThumb}"
             alt="${meal.strMeal}"
          /><span>${meal.strMeal}</span>
                  <button  class="remove-fav">
          <i class="fas fa-times"></i>
          `;
  container.appendChild(element);
  element.querySelector("img").addEventListener("click", function () {
    updateMealInfo(meal);
  });
  element.querySelector("button").addEventListener("click", function () {
    removeMealFav(meal.idMeal);
    removeFromLocalStorage(meal.idMeal);
  });
}
function removeMealFav(id) {
  let element = document.querySelector(`li[class='${id}']`);
  container.removeChild(element);
}
function updateMealInfo(meal) {
  //clean the previous info
  mealInfoEls.innerHTML = "";
  //create new one
  const mealEl = document.createElement("div");

  //create ingredient array manually due to the stupid api
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal["strIngredient" + i]) {
      ingredients.push(
        `${meal["strIngredient" + i]}/${meal["strMeasure" + i]}`
      );
    } else {
      break;
    }
  }
  const ingredientEl = document.createElement("ul");
  mealEl.innerHTML = `<button id="close-popup" class="close-popup">
          <i class="fas fa-times"></i>
        </button>
        <div>
          <h1>${meal.strMeal}</h1>
          <img
            src="${meal.strMealThumb}"
            alt="${meal.strMeal}"
          />
        </div>
        <div>
          <p>
            ${meal.strInstructions}
          </p>
        </div>
        <h3>Ingredients</h3>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>`;

  mealInfoEls.appendChild(mealEl);
  const closePopupBtn = document.querySelector("#close-popup");

  closePopupBtn.addEventListener("click", function () {
    mealPopup.classList.add("hidden");
  });
  mealPopup.classList.remove("hidden");
}

//*Local Storage Functions */
function getFromLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
function addToLocalStorage(id, value) {
  const meal = { id, value };
  let meals = getFromLocalStorage();
  meals.push(meal);
  localStorage.setItem("list", JSON.stringify(meals));
}

function removeFromLocalStorage(id) {
  const meals = getFromLocalStorage();

  localStorage.setItem(
    "list",
    JSON.stringify(meals.filter((meal) => meal.id !== id))
  );
}

//***slider css  ***/
// let slider = document.querySelector(".fav-slider");
// let innerSlider = document.querySelector(".fav-meals");

// let pressed = false;
// let startX;
// let x;

// slider.addEventListener("mousedown", (e) => {
//   pressed = true;
//   startX = e.offsetX - innerSlider.offsetLeft;
//   slider.style.cursor = "grabbing";
// });

// slider.addEventListener("mouseenter", () => {
//   slider.style.cursor = "grab";
// });

// window.addEventListener("mouseup", () => {
//   pressed = false;
// });
// slider.addEventListener("mousemove", (e) => {
//   if (!pressed) {
//     return;
//   }
//   e.preventDefault();
//   x = e.offsetX;

//   innerSlider.style.left = `${x - startX}px`;
//   checkBoundary();
// });

// function checkBoundary() {
//   let outer = slider.getBoundingClientRect();
//   let inner = innerSlider.getBoundingClientRect();

//   if (outer.width > inner.width) {
//     innerSlider.style.left = `0`;
//   } else {
//     if (parseInt(innerSlider.style.left) > 0) {
//       innerSlider.style.left = `0px`;
//     } else if (inner.right < outer.right) {
//       innerSlider.style.left = `-${inner.width - outer.width}px`;
//     }
//   }
// }

const slideRightBtn = document.querySelector(".slideRight");
const slideLeftBtn = document.querySelector(".slideLeft");
slideRightBtn.addEventListener("click", function () {
  let element = document.querySelector(".fav-slider");
  sideScroll(element, "right", 25, 100, 15);
});

slideLeftBtn.addEventListener("click", function () {
  let element = document.querySelector(".fav-slider");
  sideScroll(element, "left", 25, 100, 15);
});

function sideScroll(element, direction, speed, distance, step) {
  scrollAmount = 0;
  var slideTimer = setInterval(function () {
    if (direction == "left") {
      element.scrollLeft -= step;
    } else {
      element.scrollLeft += step;
    }
    scrollAmount += step;
    if (scrollAmount >= distance) {
      window.clearInterval(slideTimer);
    }
  }, speed);
}

//**set up function */
function start() {
  getRandomMeal();
  renderFavoriteMeal();
}
start();
