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
   READ USER INPUTS
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
   HAWAII BASE CART
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

        /* ---------------- HAWAII (UNCHANGED) ---------------- */
        const hVal = hawaiiCPI[year];

        const hawaiiCart = hVal
            ? baseCart * (hVal / hawaii2025)
            : null;

        hawaiiSeries.push(hawaiiCart);

        /* ---------------- US CART ---------------- */

        let usTotal = 0;
        let hasAnyData = false;
        let hasInterpolatedContribution = false;

        for (const item in quantities) {

            const qty = quantities[item];
            if (!qty || qty <= 0) continue; // IMPORTANT FIX

            const itemData = usCartData?.[item]?.[year];
            if (!itemData) continue;

            hasAnyData = true;

            usTotal += qty * itemData.value;

            // ONLY mark interpolated if:
            // - item contributes (qty > 0)
            // - AND that year's data is interpolated
            if (itemData.interpolated) {
                hasInterpolatedContribution = true;
            }
        }

        usSeries.push({
            x: year,
            y: hasAnyData ? usTotal : null,
            interpolated: hasInterpolatedContribution
        });
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
                        return raw?.interpolated ? "triangle" : "circle";
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
                                text: "Triangle = interpolated ingredient contribution",
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
                            if (!context.raw || context.raw.y == null) return "No data";
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