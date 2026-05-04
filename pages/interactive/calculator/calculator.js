let cart2026 = {};
let hawaiiCPI = [];
let usCPI = [];
let chartInstance = null;

/* -------------------------
   LOAD DATA
--------------------------*/

function normalizeCPI(obj) {
    return Object.entries(obj).map(([year, value]) => ({
        year: Number(year),
        value: Number(value)
    }));
}

async function loadData() {

    const [cartRes, hawaiiRes, usRes] = await Promise.all([
        fetch("/WastedAloha/pages/interactive/calculator/hawaii_groceries_2026.json"),
        fetch("/WastedAloha/pages/interactive/calculator/hawaii_cpi.json"),
        fetch("/WastedAloha/pages/interactive/calculator/us_city_avg_cpi.json")
    ]);

    cart2026 = await cartRes.json();

    hawaiiCPI = normalizeCPI(await hawaiiRes.json());
    usCPI = normalizeCPI(await usRes.json());
}

/* -------------------------
   CART TOTAL (2026 BASE)
--------------------------*/

function getBaseCartTotal() {

    let total = 0;

    for (const item in cart2026) {

        const qty =
            parseFloat(document.getElementById(item + "Qty")?.value) || 0;

        total += qty * cart2026[item];
    }

    return total;
}

/* -------------------------
   MAIN CALCULATION
--------------------------*/

function calculateCartOverTime() {

    const baseCart = getBaseCartTotal();

    const hawaii2025 = hawaiiCPI.find(d => d.year === 2025)?.value;
    const us2025 = usCPI.find(d => d.year === 2025)?.value;

    if (!hawaii2025 || !us2025) {
        alert("Missing 2025 CPI baseline values.");
        return;
    }

    const years = hawaiiCPI.map(d => d.year);

    const hawaiiSeries = years.map(year => {

        const entry = hawaiiCPI.find(d => d.year === year);
        if (!entry) return null;

        return baseCart * (entry.value / hawaii2025);
    });

    const usSeries = years.map(year => {

        const entry = usCPI.find(d => d.year === year);
        if (!entry) return null;

        return baseCart * (entry.value / us2025);
    });

    document.getElementById("results").style.display = "block";

    drawChart(years, hawaiiSeries, usSeries);
}

/* -------------------------
   CHART RENDERING
--------------------------*/

function drawChart(labels, hawaiiData, usData) {

    const ctx = document.getElementById("priceChart");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {

        type: "line",

        data: {
            labels,

            datasets: [
                {
                    label: "Hawaii Adjusted Cart",
                    data: hawaiiData,
                    borderColor: "#d32f2f",
                    borderWidth: 3,
                    tension: 0
                },
                {
                    label: "US City Average Cart",
                    data: usData,
                    borderColor: "#1976d2",
                    borderWidth: 3,
                    tension: 0
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    labels: {
                        color: "#000",
                        font: {
                            size: 14
                        }
                    }
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return "$" + context.raw.toFixed(2);
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
                    beginAtZero: true,

                    ticks: {
                        callback: v => "$" + v.toFixed(2)
                    },

                    title: {
                        display: true,
                        text: "Cart Cost (Inflation Adjusted)"
                    }
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