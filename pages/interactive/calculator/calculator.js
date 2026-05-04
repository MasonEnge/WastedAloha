let cart2026 = {};
let hawaiiCPI = {};
let usCartData = {};
let chartInstance = null;

/* -------------------------
   LOAD DATA
--------------------------*/

function normalizeCPI(obj) {
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

    const [cartRes, hawaiiRes, usCartRes] = await Promise.all([
        fetch("/WastedAloha/pages/interactive/calculator/hawaii_groceries_2026.json"),
        fetch("/WastedAloha/pages/interactive/calculator/hawaii_cpi.json"),
        fetch("/WastedAloha/pages/interactive/calculator/us_city_groceries.json")
    ]);

    cart2026 = await cartRes.json();
    hawaiiCPI = normalizeCPI(await hawaiiRes.json());
    usCartData = await usCartRes.json();
}

/* -------------------------
   READ USER INPUTS (IMPORTANT FIX)
--------------------------*/

function getQuantitiesFromForm() {

    const quantities = {};

    for (const item in cart2026) {
        const qty =
            parseFloat(document.getElementById(item + "Qty")?.value) || 0;

        quantities[item] = qty;
    }

    return quantities;
}

/* -------------------------
   CART TOTAL (2026 BASE - HAWAII)
--------------------------*/

function getBaseCartTotal(quantities) {

    let total = 0;

    for (const item in quantities) {
        total += quantities[item] * cart2026[item];
    }

    return total;
}

/* -------------------------
   MAIN CALCULATION
--------------------------*/

function calculateCartOverTime() {

    const quantities = getQuantitiesFromForm();

    const baseCart = getBaseCartTotal(quantities);

    const years = Object.keys(hawaiiCPI)
        .map(Number)
        .sort((a, b) => a - b);

    const hawaii2025 = hawaiiCPI[2025];

    if (!hawaii2025) {
        alert("Missing 2025 CPI baseline values.");
        return;
    }

    const hawaiiSeries = [];
    const usSeries = [];

    for (const year of years) {

        /* ---------------- HAWAII (UNCHANGED CPI SCALING) ---------------- */
        const hVal = hawaiiCPI[year];

        const hawaiiCart = hVal
            ? baseCart * (hVal / hawaii2025)
            : null;

        hawaiiSeries.push(hawaiiCart);

        /* ---------------- US (NOW CORRECT: USE SAME QUANTITIES) ---------------- */

        let usTotal = 0;
        let hasData = false;
        let interpolated = false;

        for (const item in quantities) {

            const qty = quantities[item];

            const itemData = usCartData?.[item]?.[year];

            if (!itemData) continue;

            usTotal += qty * itemData.value;
            hasData = true;

            if (itemData.interpolated) {
                interpolated = true;
            }
        }

        usSeries.push(
            hasData
                ? { x: year, y: usTotal, interpolated }
                : { x: year, y: null, interpolated: false }
        );
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
                    tension: 0,
                    pointStyle: "circle"
                },
                {
                    label: "US City Average Cart",
                    data: usData,
                    borderColor: "#1976d2",
                    borderWidth: 3,
                    tension: 0,

                    parsing: {
                        xAxisKey: "x",
                        yAxisKey: "y"
                    },

                    spanGaps: true,

                    pointStyle: (ctx) => {
                        const raw = ctx.raw;
                        if (raw && raw.interpolated) return "triangle";
                        return "circle";
                    }
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
                        font: { size: 14 },

                        generateLabels(chart) {

                            const original =
                                Chart.defaults.plugins.legend.labels.generateLabels(chart);

                            original.push({
                                text: "Triangle = interpolated data",
                                fillStyle: "#000",
                                strokeStyle: "#000",
                                pointStyle: "triangle"
                            });

                            return original;
                        }
                    }
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {
                            if (context.raw == null) return "No data";
                            return "$" + context.raw.y.toFixed(2);
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
                        text: "Cart Cost"
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