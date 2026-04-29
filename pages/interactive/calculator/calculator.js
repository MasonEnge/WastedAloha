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

    document.getElementById("results").style.display = "block";

    drawChart(years, totals);
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

                //line color
                borderColor: "#d32f2f",
                borderWidth: 3,

                //points
                pointRadius: 4,
                pointHoverRadius: 7,
                pointBackgroundColor: "#d32f2f",

                tension: 0.35
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {

                //title/legend text
                legend: {
                    labels: {
                        color: "#000",

                        font: {
                            size: 14,
                            family: "Cambria Math, 'Times New Roman', serif"
                        }
                    }
                },

                //tooltip popup
                tooltip: {
                    backgroundColor: "#fff",
                    titleColor: "#000",
                    bodyColor: "#000",

                    titleFont: {
                        size: 14,
                        family: "Cambria Math, 'Times New Roman', serif"
                    },
                    bodyFont: {
                        size: 13,
                        family: "Cambria Math, 'Times New Roman', serif"
                    }
                }
            },

            scales: {

                //x axis
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#000",
                        maxRotation: 45,
                        minRotation: 45,

                        font: {
                            size: 12,
                            family: "Cambria Math, 'Times New Roman', serif"
                        }
                    }
                },

                //y axis
                y: {
                    grid: {
                        color: "rgba(0,0,0,0.08)"
                    },
                    ticks: {
                        color: "#000",

                        font: {
                            size: 12,
                            family: "Cambria Math, 'Times New Roman', serif"
                        }
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