let cart2026 = {};
let hawaiiCPI = {};
let usCPI = {};
let chartInstance = null;

/* -------------------------
   LOAD DATA
--------------------------*/

function normalizeCPI(obj) {
    // Converts { "1984": 103.7 } → { 1984: 103.7 }
    const out = {};
    for (const [year, value] of Object.entries(obj)) {
        const y = Number(year);
        const v = Number(value);
        if (!isNaN(y) && !isNaN(v)) {
            out[y] = v;
        }
    }
    return out;
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

    const years = Object.keys(hawaiiCPI)
        .map(Number)
        .sort((a, b) => a - b);

    const hawaii2026 = hawaiiCPI[2025]; // last full year before 2026
    const us2026 = usCPI[2025];

    if (!hawaii2026 || !us2026) {
        alert("Missing 2025 CPI baseline values.");
        return;
    }

    const hawaiiSeries = [];
    const usSeries = [];

    for (const year of years) {

        const hVal = hawaiiCPI[year];
        const uVal = usCPI[year];

        // CPI-indexed scaling (2025 = baseline)
        const hawaiiCart = hVal
            ? baseCart * (hVal / hawaii2026)
            : null;

        const usCart = uVal
            ? baseCart * (uVal / us2026)
            : null;

        hawaiiSeries.push(hawaiiCart);
        usSeries.push(usCart);
    }

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
                        font: { size: 14 }
                    }
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {
                            if (context.raw == null) return "No data";
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