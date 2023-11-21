function checkTokenExpiration() {
  if (window.location.href.includes('login.html') || window.location.href.includes('account-creation.html')) {
    return;
  }
  
  fetch('/api/users/checkTokenExpiration', { method: 'GET' })
    .then(response => {
      if (!response.ok) {
        throw new Error('Token check failed');
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        // Non-JSON response, treat as expired
        return { expired: true };
      }
    })
    .then(data => {
      if (data.expired) {
        // Token has expired, handle accordingly
        const logoutMessage = 'Your session has expired, please log back in.';
        const redirectUrl = '/login.html?message=' + encodeURIComponent(logoutMessage);
        window.location.href = redirectUrl;
      }
    })
    .catch(error => {
      console.error('Error checking token:', error);
    });
}

if (!window.location.href.includes('login.html') && !window.location.href.includes('account-creation.html')) {
  setInterval(checkTokenExpiration, 5 * 1000);
}

document.addEventListener("DOMContentLoaded", function () {
  function handleLogout() {
    const confirmLogout = confirm("Do you want to log out?");
  
    if (confirmLogout) {
      fetch('/api/users/logout', { method: 'GET' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Logout failed');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          const logoutMessage = 'User logged out successfully.';
          const redirectUrl = '/login.html?message=' + encodeURIComponent(logoutMessage);
          window.location.href = redirectUrl;
        })
        .catch(error => {
          console.error('Error logging out:', error);
        });
    } else {
      // User clicked "No," do nothing
    }
  }
  
  const logoutLink = document.getElementById("logout");
  if (logoutLink) {
    logoutLink.addEventListener("click", function (event) {
      event.preventDefault();
      handleLogout();
    });
  }
});

function createIngredientSection() {
  var div = document.createElement("div");
  var select = document.createElement("select");
  var quantityInput = document.createElement("input");
  var measurementUnit = document.createElement("span");
  var quantityLabel = document.createElement("span");

  div.className = "ingredient-section";
  select.id = "ingredient-" + ingredientCounter;
  select.name = "ingredient-" + ingredientCounter;
  select.className = "ingredient-dropdown";
  quantityInput.id = "quantity-" + ingredientCounter;
  quantityInput.className = "form-input-box";
  quantityLabel.className = "quantity-label";
  quantityLabel.textContent = "Quantity: ";

  var ingredientOptions = [
    "Bread Rolls",
    "Mayonnaise",
    "Mustard",
    "Ranch Dressing",
    "Sliced Turkey",
    "Sliced Ham",
    "Rotisserie Chicken",
    "Bacon",
    "Cheese",
    "Lettuce",
    "Tomato"
  ];

  for (var i = 0; i < ingredientOptions.length; i++) {
    var option = document.createElement("option");
    option.value = i + 1; // Option values start from 1
    option.textContent = ingredientOptions[i];
    select.appendChild(option);
  }

  var ingredientsContainer = document.getElementById("ingredients-container");
  ingredientsContainer.appendChild(select);

  quantityInput.type = "number";
  quantityInput.name = "quantity-" + ingredientCounter;
  quantityInput.required = true;
  quantityInput.min = "1";
  quantityInput.value = "1";

  measurementUnit.id = "measurementUnit-" + ingredientCounter;
  measurementUnit.textContent = "Rolls";

  if (ingredientCounter > 1) {
    deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function() {
      ingredientsContainer.removeChild(div);
      ingredientCounter--;
    });
  }

  div.appendChild(select);
  div.appendChild(quantityLabel);
  div.appendChild(quantityInput);
  div.appendChild(measurementUnit);
  
  if (deleteButton) {
    div.appendChild(deleteButton);
  }

  ingredientsContainer.appendChild(div);

  select.addEventListener("change", function() {
    updateMeasurementUnit(select, measurementUnit);
  });

  ingredientCounter++;
}

function updateMeasurementUnit(select, measurementUnit) {
  var selectedOption = parseInt(select.value);
  if (selectedOption == 1) {
    measurementUnit.textContent = "Rolls";
  } else if (selectedOption >= 2 && selectedOption <= 4) {
    measurementUnit.textContent = "Fl oz";
  } else {
    measurementUnit.textContent = "Oz";
  }
}

function getCurrentTimeInPhoenix() {
  var utcDate = new Date();
  var phoenixOffset = -7 * 60; // Phoenix is UTC-7
  var phoenixTime = new Date(utcDate.getTime() + phoenixOffset * 60 * 1000);

  return phoenixTime;
}

function getCurrentDateInPhoenix() {
  var utcDate = new Date();
  var phoenixOffset = -7 * 60; // Phoenix is UTC-7
  var phoenixDate = new Date(utcDate.getTime() + phoenixOffset * 60 * 1000);

  // Get the date in YYYY-MM-DD format
  var formattedDate = phoenixDate.toISOString().split('T')[0];
  return formattedDate;
}

function setResultMessage(message, messageType) {
  const encodedMessage = encodeURIComponent(message);
  const newUrl = `${window.location.pathname}?message=${encodedMessage}`;
  window.location.href = newUrl;
}

function getMessageFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('message');
}

function displayMessage() {
  const resultMessage = document.getElementById('response-message');
  const message = getMessageFromUrl();

  if (message) {
    resultMessage.innerText = message;
    resultMessage.style.display = 'flex';
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  }
}

function clearMessage() {
  const resultMessage = document.getElementById('response-message');
  resultMessage.style.display = 'none';
  resultMessage.innerText = "";
}