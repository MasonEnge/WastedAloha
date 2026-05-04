let cart2026 = {};
let hawaiiCPI = [];
let usCPI = [];
let chartInstance = null;

/* -------------------------
   LOAD DATA
--------------------------*/

async function loadData() {

    const [cartRes, hawaiiRes, usRes] = await Promise.all([
        fetch("/WastedAloha/pages/interactive/calculator/hawaii_groceries_2026.json"),
        fetch("/WastedAloha/pages/interactive/calculator/hawaii_cpi.json"),
        fetch("/WastedAloha/pages/interactive/calculator/us_city_avg_cpi.json")
    ]);

    cart2026 = await cartRes.json();
    hawaiiCPI = await hawaiiRes.json();
    usCPI = await usRes.json();
}

/* -------------------------
   HELPERS
--------------------------*/

// Extract year from "YYYY-MM-DD"
function getYear(dateStr) {
    return parseInt(dateStr.split("-")[0]);
}

// Filter US CPI to yearly (January only)
function processUSCPI(rawText) {

    const lines = rawText.trim().split("\n").slice(1);

    const data = lines
        .map(line => {
            const [date, value] = line.split(",");
            return {
                year: getYear(date),
                value: parseFloat(value)
            };
        })
        .filter(d => !isNaN(d.value));

    return data.filter(d => d.year >= 1984);
}

/* -------------------------
   CALCULATE BASE CART (2026)
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
   BUILD CPI SERIES
--------------------------*/

function buildSeries() {

    const baseCart = getBaseCartTotal();

    const hawaiiBase = hawaiiCPI["2025"] ?? Object.values(hawaiiCPI).at(-1);
    const usRaw = processUSCPI(usCPIRawString); // we fix below

    const years = [];
    const hawaiiSeries = [];
    const usSeries = [];

    const hawaii2025 = hawaiiCPI.find(d => d.year === 2025)?.value;

    const us2025 = usRaw.find(d => d.year === 2025)?.value;

    for (const h of hawaiiCPI) {

        const year = h.year;

        const hawaiiValue =
            baseCart * (h.value / hawaii2025);

        const usValueObj = usRaw.find(d => d.year === year);

        const usValue =
            usValueObj
                ? baseCart * (usValueObj.value / us2025)
                : null;

        years.push(year);
        hawaiiSeries.push(hawaiiValue);
        usSeries.push(usValue);
    }

    return { years, hawaiiSeries, usSeries };
}

/* -------------------------
   MAIN CALC
--------------------------*/

function calculateCartOverTime() {

    const baseCart = getBaseCartTotal();

    const hawaii2025 = hawaiiCPI.find(d => d.year === 2025)?.value;

    const usRaw = processUSCPI(usCPIRawString);
    const us2025 = usRaw.find(d => d.year === 2025)?.value;

    const years = hawaiiCPI.map(d => d.year);

    const hawaiiSeries = years.map(y => {
        const cpi = hawaiiCPI.find(d => d.year === y).value;
        return baseCart * (cpi / hawaii2025);
    });

    const usSeries = years.map(y => {
        const cpi = usRaw.find(d => d.year === y)?.value;
        return cpi ? baseCart * (cpi / us2025) : null;
    });

    document.getElementById("results").style.display = "block";

    drawChart(years, hawaiiSeries, usSeries);
}

/* -------------------------
   CHART
--------------------------*/

function drawChart(labels, hawaiiData, usData) {

    const ctx = document.getElementById("priceChart");

    if (chartInstance) chartInstance.destroy();

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
                        color: "#000"
                    }
                }
            },

            scales: {
                y: {
                    ticks: {
                        callback: v => "$" + v.toFixed(2)
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