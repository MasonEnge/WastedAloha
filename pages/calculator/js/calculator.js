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
        fetch("/WastedAloha/pages/calculator/js/hawaii_groceries_2026.json"),
        fetch("/WastedAloha/pages/calculator/js/hawaii_cpi.json"),
        fetch("/WastedAloha/pages/calculator/js/us_city_groceries.json")
    ]);

    cart2026 = await cartRes.json();
    hawaiiCPI = normalizeCPI(await hawaiiRes.json());
    usCartData = await usCartRes.json();

    console.log("Loaded US cart data:", usCartData);
}

/* -------------------------
   READ USER INPUTS
--------------------------*/

function getQuantitiesFromForm() {

    const quantities = {};

    for (const item in cart2026) {

        const input = document.getElementById(item + "Qty");

        const qty =
            parseFloat(input?.value) || 0;

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

        const qty = quantities[item] || 0;
        const price = cart2026[item] || 0;

        total += qty * price;
    }

    return total;
}

/* -------------------------
   MAIN CALCULATION
--------------------------*/

function calculateCartOverTime() {

    const quantities = getQuantitiesFromForm();

    console.log("Quantities:", quantities);

    const baseCart = getBaseCartTotal(quantities);

    console.log("Base Cart:", baseCart);

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

        /* ---------------- HAWAII ---------------- */

        const hVal = hawaiiCPI[year];

        const hawaiiCart = hVal
            ? baseCart * (hVal / hawaii2025)
            : null;

        hawaiiSeries.push({
            x: year,
            y: hawaiiCart
        });

        /* ---------------- US CART ---------------- */

        let usTotal = 0;
        let hasAnyData = false;
        let hasInterpolatedContribution = false;

        for (const item in quantities) {

            const qty = quantities[item];

            if (!qty || qty <= 0) continue;

            const itemData = usCartData?.[item]?.[year];

            if (!itemData) {
                console.warn(`Missing data for ${item} in ${year}`);
                continue;
            }

            hasAnyData = true;

            usTotal += qty * Number(itemData.value);

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

    console.log("Hawaii Series:", hawaiiSeries);
    console.log("US Series:", usSeries);

    document.getElementById("results").style.display = "block";

    drawChart(hawaiiSeries, usSeries);
}

/* -------------------------
   CHART RENDERING
--------------------------*/

function drawChart(hawaiiData, usData) {

    const ctx = document.getElementById("priceChart");

    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {

        type: "line",

        data: {

            datasets: [

                /* ---------------- HAWAII ---------------- */

                {
                    label: "Hawaii Adjusted Cart",

                    data: hawaiiData,

                    borderColor: "#d32f2f",
                    borderWidth: 3,
                    tension: 0,

                    parsing: {
                        xAxisKey: "x",
                        yAxisKey: "y"
                    },

                    pointStyle: "circle",

                    spanGaps: true
                },

                /* ---------------- US ---------------- */

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

                        return raw?.interpolated
                            ? "triangle"
                            : "circle";
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

                        font: {
                            size: 14
                        },

                        generateLabels(chart) {

                            const original =
                                Chart.defaults.plugins.legend.labels.generateLabels(chart);

                            original.push({
                                text: "Triangle = interpolated ingredient contribution*",
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

                            let value;

                            if (typeof context.raw === "object") {
                                value = context.raw.y;
                            } else {
                                value = context.raw;
                            }

                            if (value == null) {
                                return "No data";
                            }

                            return "$" + Number(value).toFixed(2);
                        }
                    }
                }
            },

            scales: {

                x: {

                    type: "linear",

                    title: {
                        display: true,
                        text: "Year"
                    },

                    ticks: {
                        stepSize: 1
                    }
                },

                y: {

                    beginAtZero: true,

                    ticks: {
                        callback: v => "$" + Number(v).toFixed(2)
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