let groceryData = {};
let chartInstance = null;

// LOAD DATA
async function loadData() {

    const response = await fetch(
        "/WastedAloha/pages/interactive/calculator/calculator_data.json"
    );

    groceryData = await response.json();

    populateStates();
}

/* -------------------------
   POPULATE STATES ONLY
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

/* -------------------------
   CALCULATE ALL YEARS
--------------------------*/

function calculateCartOverTime() {

    const state = document.getElementById("state").value;

    if (!state || !groceryData[state]) {
        alert("Please select a state.");
        return;
    }

    const items = [
        "milk",
        "bread",
        "eggs",
        "rice",
        "chicken",
        "apples",
        "groundBeef"
    ];

    const years = Object.keys(groceryData[state]).sort();

    const totals = [];

    years.forEach(year => {

        const prices = groceryData[state][year];

        let total = 0;

        items.forEach(item => {

            const qty =
                parseInt(document.getElementById(`${item}Qty`)?.value) || 0;

            if (prices[item] !== undefined) {
                total += qty * prices[item];
            }
        });

        totals.push(total);
    });

    drawChart(years, totals);

    document.getElementById("results").style.display = "block";
}

/* -------------------------
   CHART RENDERING
--------------------------*/

function drawChart(labels, data) {

    const ctx = document.getElementById("priceChart");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Total Cart Cost ($)",
                data: data,
                borderColor: "#1b5e20",
                backgroundColor: "rgba(27, 94, 32, 0.2)",
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

/* -------------------------
   INIT
--------------------------*/

document
    .getElementById("calculateBtn")
    .addEventListener("click", calculateCartOverTime);

loadData();