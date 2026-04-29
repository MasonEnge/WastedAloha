let groceryData = {};

// LOAD JSON
async function loadData() {

    const response = await fetch(
        "/WastedAloha/pages/interactive/calculator/calculator_data.json"
    );

    groceryData = await response.json();

    populateStates();
    populateYears();
}

/* -------------------------
   POPULATE DROPDOWNS
--------------------------*/

function populateStates() {

    const stateSelect = document.getElementById("state");

    Object.keys(groceryData).forEach(state => {

        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;

        stateSelect.appendChild(option);
    });
}

function populateYears() {

    const yearSelect = document.getElementById("year");

    for (let year = 2000; year <= 2026; year++) {

        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;

        yearSelect.appendChild(option);
    }
}

/* -------------------------
   CART CALCULATION
--------------------------*/

function calculateCart() {

    const state = document.getElementById("state").value;
    const year = document.getElementById("year").value;

    if (!state || !year) {
        alert("Please select a state and year.");
        return;
    }

    const prices = groceryData[state][year];

    // All supported items (banana removed)
    const items = [
        "milk",
        "bread",
        "eggs",
        "rice",
        "chicken",
        "apples",
        "groundBeef"
    ];

    let total = 0;

    items.forEach(item => {

        const qty =
            parseInt(document.getElementById(`${item}Qty`)?.value) || 0;

        if (prices[item] !== undefined) {
            total += qty * prices[item];
        }
    });

    document.getElementById("cartTotal").textContent =
        total.toFixed(2);

    document.getElementById("summaryText").textContent =
        `Estimated grocery prices in ${state} during ${year}.`;

    document.getElementById("results").style.display =
        "block";
}

/* -------------------------
   INIT
--------------------------*/

document
    .getElementById("calculateBtn")
    .addEventListener("click", calculateCart);

loadData();