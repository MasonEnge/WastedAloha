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

                borderColor: "#2e7d32",
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: "#1b5e20",

                fill: true,
                backgroundColor: "rgba(46, 125, 50, 0.15)",

                tension: 0.35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: "#1b5e20",
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    grid: {
                        color: "rgba(0,0,0,0.08)"
                    },
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