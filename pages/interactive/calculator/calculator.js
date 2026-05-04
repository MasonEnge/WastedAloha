let hawaiiGroceries2026 = {};
let hawaiiCPI = {};
let usCPI = {};
let chartInstance = null;

/* -------------------------
   LOAD DATA
--------------------------*/

async function loadData() {
    const [groceryRes, hiRes, usRes] = await Promise.all([
        fetch("/WastedAloha/pages/interactive/calculator/hawaii_groceries_2026.json"),
        fetch("/WastedAloha/pages/interactive/calculator/hawaii_cpi.json"),
        fetch("/WastedAloha/pages/interactive/calculator/us_city_avg_cpi.json")
    ]);

    hawaiiGroceries2026 = await groceryRes.json();
    hawaiiCPI = await hiRes.json();
    usCPI = await usRes.json();
}

/* -------------------------
   CALCULATE CART OVER TIME
--------------------------*/

function calculateCartOverTime() {

    const items = [
        "milk",
        "bread",
        "eggs",
        "rice",
        "chicken",
        "apples",
        "groundBeef"
    ];

    const years = Object.keys(hawaiiCPI)
        .map(y => parseInt(y))
        .sort((a, b) => a - b);

    const baseYear = 2026;
    const baseCPI_HI = hawaiiCPI[baseYear];
    const baseCPI_US = usCPI[baseYear];

    let labels = [];
    let hawaiiSeries = [];
    let usSeries = [];

    years.forEach(year => {

        labels.push(year);

        let hiTotal = 0;
        let usTotal = 0;

        items.forEach(item => {

            const qty =
                parseInt(document.getElementById(`${item}Qty`)?.value) || 0;

            const basePrice = hawaiiGroceries2026[item];

            // inflation adjustment factors
            const hiFactor = hawaiiCPI[year] / baseCPI_HI;
            const usFactor = usCPI[year] / baseCPI_US;

            hiTotal += qty * basePrice * hiFactor;
            usTotal += qty * basePrice * usFactor;
        });

        hawaiiSeries.push(hiTotal);
        usSeries.push(usTotal);
    });

    document.getElementById("results").style.display = "block";

    drawChart(labels, hawaiiSeries, usSeries);
}

/* -------------------------
   CHART
--------------------------*/

function drawChart(labels, hawaiiData, usData) {

    const ctx = document.getElementById("priceChart");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Hawaii (inflation-adjusted)",
                    data: hawaiiData,
                    borderColor: "#d32f2f",
                    borderWidth: 3,
                    pointRadius: 3,
                    tension: 0.2
                },
                {
                    label: "US City Average (inflation-adjusted)",
                    data: usData,
                    borderColor: "#1565c0",
                    borderWidth: 3,
                    pointRadius: 3,
                    tension: 0.2
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    labels: {
                        font: {
                            size: 13
                        }
                    }
                }
            },

            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Year"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Estimated Cart Cost (USD)"
                    },
                    beginAtZero: false
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