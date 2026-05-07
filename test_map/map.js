//Get needed element rom the DOM
const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidePanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const loading = document.querySelector(".loading");
const zoomInBtn = document.querySelector(".zoom-in");
const zoomOutBtn = document.querySelector(".zoom-out");
const zoomValueOutput = document.querySelector(".zoom-value");

// Data Outputs
const countryNameOutput = document.querySelector(".country-name");
const countryFlagOutput = document.querySelector(".country-flag");
const foodWastePerCapitaOutput = document.querySelector(".food-waste-per-capita");
const totalAnnualFoodWasteOutput = document.querySelector(".total-annual-food-waste");

// Food Waste Data
const foodWasteData = {
    "AF": { perCapita: 127, annual: 5229654 },
    "AL": { perCapita: 86, annual: 243657 },
    "DZ": { perCapita: 113, annual: 5057909 },
    "AS": { perCapita: 81, annual: 3258 },
    "AD": { perCapita: 82, annual: 6598 },
    "AO": { perCapita: 89, annual: 3171950 },
    "AI": { perCapita: 95, annual: 1892 },
    "AG": { perCapita: 88, annual: 7922 },
    "AR": { perCapita: 91, annual: 4156798 },
    "AM": { perCapita: 102, annual: 283222 },
    "AW": { perCapita: 88, annual: 9682 },
    "AU": { perCapita: 98, annual: 2559065 },
    "AT": { perCapita: 83, annual: 742020 },
    "AZ": { perCapita: 102, annual: 1055462 },
    "BS": { perCapita: 88, annual: 36089 },
    "BH": { perCapita: 132, annual: 193612 },
    "BD": { perCapita: 82, annual: 14101956 },
    "BB": { perCapita: 88, annual: 24646 },
    "BY": { perCapita: 71, annual: 674104 },
    "BE": { perCapita: 71, annual: 827860 },
    "BZ": { perCapita: 53, annual: 21596 },
    "BJ": { perCapita: 89, annual: 1189816 },
    "BM": { perCapita: 79, annual: 4718 },
    "BT": { perCapita: 19, annual: 15072 },
    "BO": { perCapita: 90, annual: 1101625 },
    "BA": { perCapita: 86, annual: 277117 },
    "BW": { perCapita: 50, annual: 132594 },
    "BR": { perCapita: 94, annual: 20289630 },
    "VG": { perCapita: 88, annual: 2641 },
    "BN": { perCapita: 76, annual: 34109 },
    "BG": { perCapita: 26, annual: 176280 },
    "BF": { perCapita: 92, annual: 2085610 },
    "BI": { perCapita: 92, annual: 1185863 },
    "KH": { perCapita: 85, annual: 1419831 },
    "CM": { perCapita: 89, annual: 2487472 },
    "CA": { perCapita: 79, annual: 3019925 },
    "CV": { perCapita: 89, annual: 52584 },
    "KY": { perCapita: 88, annual: 6162 },
    "CF": { perCapita: 92, annual: 513353 },
    "TD": { perCapita: 92, annual: 1630217 },
    "CL": { perCapita: 88, annual: 1725226 },
    "CN": { perCapita: 76, annual: 108667369 },
    "CO": { perCapita: 70, annual: 3653302 },
    "KM": { perCapita: 89, annual: 74865 },
    "CK": { perCapita: 86, annual: 1724 },
    "CR": { perCapita: 91, annual: 473131 },
    "HR": { perCapita: 53, annual: 213590 },
    "CU": { perCapita: 91, annual: 1023900 },
    "CW": { perCapita: 88, annual: 16724 },
    "CY": { perCapita: 71, annual: 88750 },
    "CZ": { perCapita: 69, annual: 723810 },
    "DK": { perCapita: 79, annual: 464520 },
    "DJ": { perCapita: 89, annual: 99820 },
    "DM": { perCapita: 91, annual: 6394 },
    "DO": { perCapita: 160, annual: 1799544 },
    "CD": { perCapita: 81, annual: 2104855 },
    "EC": { perCapita: 96, annual: 1727535 },
    "EG": { perCapita: 163, annual: 18085437 },
    "SV": { perCapita: 91, annual: 579084 },
    "GQ": { perCapita: 90, annual: 150824 },
    "ER": { perCapita: 92, annual: 338555 },
    "EE": { perCapita: 61, annual: 81130 },
    "SZ": { perCapita: 89, annual: 106950 },
    "ET": { perCapita: 69, annual: 8543382 },
    "FO": { perCapita: 75, annual: 3768 },
    "FJ": { perCapita: 90, annual: 83945 },
    "FI": { perCapita: 53, annual: 293620 },
    "FR": { perCapita: 61, annual: 3942430 },
    "PF": { perCapita: 81, annual: 25252 },
    "GA": { perCapita: 90, annual: 215849 },
    "GM": { perCapita: 92, annual: 249316 },
    "GE": { perCapita: 101, annual: 377643 },
    "DE": { perCapita: 78, annual: 6502860 },
    "GH": { perCapita: 84, annual: 2812571 },
    "GI": { perCapita: 82, annual: 2474 },
    "GR": { perCapita: 87, annual: 903930 },
    "GL": { perCapita: 79, annual: 4718 },
    "GD": { perCapita: 91, annual: 11874 },
    "GU": { perCapita: 60, annual: 10173 },
    "GT": { perCapita: 91, annual: 1629472 },
    "GN": { perCapita: 89, annual: 1235269 },
    "GW": { perCapita: 92, annual: 194117 },
    "GY": { perCapita: 88, annual: 71298 },
    "HT": { perCapita: 90, annual: 1044831 },
    "HN": { perCapita: 90, annual: 940257 },
    "HK": { perCapita: 101, annual: 759923 },
    "HU": { perCapita: 66, annual: 658020 },
    "IS": { perCapita: 75, annual: 27886 },
    "IN": { perCapita: 55, annual: 78192338 },
    "ID": { perCapita: 53, annual: 14728364 },
    "IR": { perCapita: 93, annual: 8208360 },
    "IQ": { perCapita: 143, annual: 6378198 },
    "IE": { perCapita: 48, annual: 240960 },
    "IM": { perCapita: 75, annual: 6029 },
    "IL": { perCapita: 97, annual: 874433 },
    "IT": { perCapita: 107, annual: 6317280 },
    "CI": { perCapita: 89, annual: 2509753 },
    "JM": { perCapita: 86, annual: 243364 },
    "JP": { perCapita: 60, annual: 7398006 },
    "JO": { perCapita: 101, annual: 1136788 },
    "KZ": { perCapita: 88, annual: 1708990 },
    "KE": { perCapita: 81, annual: 4351168 },
    "KI": { perCapita: 62, annual: 8056 },
    "KW": { perCapita: 101, annual: 1136788 },
    "KG": { perCapita: 86, annual: 568288 },
    "LA": { perCapita: 89, annual: 673831 },
    "LV": { perCapita: 82, annual: 151700 },
    "LB": { perCapita: 128, annual: 701828 },
    "LS": { perCapita: 89, annual: 205878 },
    "LR": { perCapita: 92, annual: 487593 },
    "LY": { perCapita: 84, annual: 572937 },
    "LI": { perCapita: 81, annual: 3235 },
    "LT": { perCapita: 86, annual: 36500 },
    "LU": { perCapita: 91, annual: 59150 },
    "MO": { perCapita: 76, annual: 53016 },
    "MG": { perCapita: 92, annual: 2724081 },
    "MW": { perCapita: 92, annual: 1877693 },
    "MY": { perCapita: 81, annual: 2754808 },
    "MV": { perCapita: 207, annual: 107877 },
    "ML": { perCapita: 92, annual: 2078251 },
    "MT": { perCapita: 92, annual: 48760 },
    "MH": { perCapita: 63, annual: 2526 },
    "MR": { perCapita: 89, annual: 422451 },
    "MU": { perCapita: 90, annual: 11408 },
    "YT": { perCapita: 93, annual: 30536 },
    "MX": { perCapita: 105, annual: 13368447 },
    "FM": { perCapita: 38, annual: 4205 },
    "MD": { perCapita: 71, annual: 231061 },
    "MC": { perCapita: 81, annual: 3235 },
    "MN": { perCapita: 18, annual: 60364 },
    "ME": { perCapita: 86, annual: 54051 },
    "MA": { perCapita: 113, annual: 4219805 },
    "MZ": { perCapita: 92, annual: 3033197 },
    "MM": { perCapita: 78, annual: 4221946 },
    "NA": { perCapita: 90, annual: 232106 },
    "NR": { perCapita: 60, annual: 598 },
    "NP": { perCapita: 93, annual: 2831907 },
    "NL": { perCapita: 59, annual: 1036040 },
    "NC": { perCapita: 87, annual: 25215 },
    "NZ": { perCapita: 61, annual: 316590 },
    "NI": { perCapita: 90, annual: 626538 },
    "NE": { perCapita: 92, annual: 2411286 },
    "NG": { perCapita: 113, annual: 24791826 },
    "NU": { perCapita: 86, annual: null },
    "MK": { perCapita: 86, annual: 179311 },
    "MP": { perCapita: 60, annual: 2992 },
    "NO": { perCapita: 78, annual: 423540 },
    "OM": { perCapita: 99, annual: 451415 },
    "PK": { perCapita: 130, annual: 30754726 },
    "PW": { perCapita: 63, annual: 1263 },
    "PS": { perCapita: 102, annual: 534863 },
    "PA": { perCapita: 101, annual: 445347 },
    "PG": { perCapita: 89, annual: 903213 },
    "PY": { perCapita: 91, annual: 619272 },
    "PE": { perCapita: 88, annual: 2983735 },
    "PH": { perCapita: 26, annual: 2954580 },
    "PL": { perCapita: 60, annual: 2391600 },
    "PT": { perCapita: 124, annual: 1273480 },
    "PR": { perCapita: 88, annual: 286071 },
    "QA": { perCapita: 93, annual: 250830 },
    "CG": { perCapita: 89, annual: 532075 },
    "RO": { perCapita: 67, annual: 1323991 },
    "RU": { perCapita: 33, annual: 4829772 },
    "RW": { perCapita: 141, annual: 1937761 },
    "BL": { perCapita: 95, annual: 946 },
    "KN": { perCapita: 88, annual: 4401 },
    "LC": { perCapita: 91, annual: 16441 },
    "MF": { perCapita: 88, annual: 2641 },
    "PM": { perCapita: 76, annual: 758 },
    "VC": { perCapita: 91, annual: 9134 },
    "WS": { perCapita: 86, annual: 18857 },
    "SM": { perCapita: 82, annual: 2474 },
    "ST": { perCapita: 89, annual: 20499 },
    "SA": { perCapita: 105, annual: 3818681 },
    "SN": { perCapita: 77, annual: 1328487 },
    "RS": { perCapita: 108, annual: 780482 },
    "SC": { perCapita: 183, annual: 20089 },
    "SL": { perCapita: 92, annual: 792109 },
    "SG": { perCapita: 68, annual: 409182 },
    "SX": { perCapita: 88, annual: 3521 },
    "SK": { perCapita: 65, annual: 366600 },
    "SI": { perCapita: 36, annual: 76320 },
    "SB": { perCapita: 43, annual: 31242 },
    "SO": { perCapita: 92, annual: 1619177 },
    "ZA": { perCapita: 47, annual: 2819981 },
    "KR": { perCapita: 95, annual: 4921086 },
    "SS": { perCapita: 92, annual: 1003706 },
    "ES": { perCapita: 61, annual: 2895272 },
    "LK": { perCapita: 76, annual: 1656148 },
    "SD": { perCapita: 116, annual: 5414527 },
    "SR": { perCapita: 91, annual: 56630 },
    "SE": { perCapita: 61, annual: 643550 },
    "CH": { perCapita: 119, annual: 1041879 },
    "SY": { perCapita: 172, annual: 3798032 },
    "TJ": { perCapita: 86, annual: 852861 },
    "TZ": { perCapita: 152, annual: 9960496 },
    "TH": { perCapita: 86, annual: 6180468 },
    "TL": { perCapita: 78, annual: 104419 },
    "TG": { perCapita: 92, annual: 814188 },
    "TK": { perCapita: 86, annual: null },
    "TO": { perCapita: 88, annual: 9690 },
    "TT": { perCapita: 88, annual: 134673 },
    "TN": { perCapita: 172, annual: 2121810 },
    "TR": { perCapita: 102, annual: 8694318 },
    "TM": { perCapita: 88, annual: 566433 },
    "TC": { perCapita: 88, annual: 4401 },
    "TV": { perCapita: 88, annual: 881 },
    "UG": { perCapita: 110, annual: 5209076 },
    "UA": { perCapita: 69, annual: 2758037 },
    "AE": { perCapita: 99, annual: 930427 },
    "GB": { perCapita: 76, annual: 5097005 },
    "US": { perCapita: 73, annual: 24716539 },
    "VI": { perCapita: 88, annual: 8802 },
    "UY": { perCapita: 88, annual: 301034 },
    "UZ": { perCapita: 86, annual: 2968299 },
    "VU": { perCapita: 141, annual: 46687 },
    "VE": { perCapita: 93, annual: 2626859 },
    "VN": { perCapita: 72, annual: 7079811 },
    "EH": { perCapita: 140, annual: 80958 },
    "YE": { perCapita: 104, annual: 3490097 },
    "ZM": { perCapita: 78, annual: 1559958 },
    "ZW": { perCapita: 48, annual: 791249 }
};

// Loop through all countries
countries.forEach(country => {
    // Add event listener for mouse enter
    country.addEventListener("mouseenter", function() {
        const classList = [...this.classList].join('.');
        console.log(classList);

        // Selector for matching classes
        const selector = '.' + classList;

        // Select all matching elements and pieces of land that belong to same country
        const matchingElements = document.querySelectorAll(selector);
        //
        matchingElements.forEach(el => el.style.fill = "#c99aff");
    });
    // Event where cursor leaves a country
    country.addEventListener("mouseout", function() {
        // Remove hover effect from all pieces of land that have the same class names
        const classList = [...this.classList].join('.')
        const selector = '.' + classList;
        const matchingElements = document.querySelectorAll(selector);
        matchingElements.forEach(el => el.style.fill = "#443d4b");
    });
    // Add click event for each country
    country.addEventListener("click", function(e) {
        // Set loading text
        loading.innerText = "Loading...";
        // Hide country data container
        container.classList.add("hide");
        // Show loading screen
        loading.classList.remove("hide");
        //Variable to hold country name
        let clickedCountryName;
        // If clicked country has name attribute
        if (e.target.hasAttribute("name")) {
            // Get value of name attribute
            clickedCountryName = e.target.getAttribute("name");
        } else {
            // If country does not have name attribute, get class name
            clickedCountryName = e.target.classList.value;
        }
        //Open side panel
        sidePanel.classList.add("side-panel-open");
        // Get data from API
        fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
            .then(response => {
                // Check if response is OK
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Return response as JSON
                return response.json();
            })
            .then(data => {
                console.log(data);
                setTimeout(() => {
                    // Extract data and output to the side panel
                    countryNameOutput.innerText = data[0].name.common;
                    // Flag image
                    countryFlagOutput.src = data[0].flags.png;

                    // Get country code and look up food waste data
                    const countryCode = data[0].cca2;
                    const foodWaste = foodWasteData[countryCode];

                    // Display food waste data if available
                    if (foodWaste) {
                        foodWastePerCapitaOutput.innerText = foodWaste.perCapita ? foodWaste.perCapita + " kg per year" : "N/A";
                        totalAnnualFoodWasteOutput.innerText = foodWaste.annual ? foodWaste.annual.toLocaleString() + " tons" : "N/A";
                    } else {
                        foodWastePerCapitaOutput.innerText = "N/A";
                        totalAnnualFoodWasteOutput.innerText = "N/A";
                    }

                    // Function to show content and hide loading
                    const showContent = () => {
                        container.classList.remove("hide");
                        loading.classList.add("hide");
                    };

                    // Set timeout as fallback in case image fails to load
                    const imageLoadTimeout = setTimeout(() => {
                        console.warn("Image load timeout - showing content anyway");
                        showContent();
                    }, 5000);

                    // Wait for new flag image to load
                    countryFlagOutput.onload = () => {
                        clearTimeout(imageLoadTimeout);
                        showContent();
                    };

                    // Handle image load errors
                    countryFlagOutput.onerror = () => {
                        clearTimeout(imageLoadTimeout);
                        console.error("Failed to load flag image");
                        showContent();
                    };

                    // Trigger image load by setting src
                    countryFlagOutput.src = data[0].flags.png;
                }, 500);
            })
            // Handle errors
            .catch(error => {
                // Output explanation to user
                loading.innerText = "No data to show for selected country";
                // Console log error
                console.error("There was a problem with the fetch operation", error);
            });
        });
});

// Add click event to side panel close button
closeBtn.addEventListener("click", () => {
    // Close side panel
    sidePanel.classList.remove("side-panel-open");
});

// Variable to contain current zoom value
let zoomValue = 100;
// Disable zoom out button on load
zoomOutBtn.disabled = true;

// Add lick event to zoom in button
zoomInBtn.addEventListener("click", () => {
    // Enable zoom out button
    zoomOutBtn.disabled = false;
    // Increment zoom value by 100
    zoomValue += 100;
    // If zoom value is under 500
    if(zoomValue < 500) {
        // Enable zoom in button
        zoomInBtn.disabled = false;
    } else {
        // Else, disable zoom in button
        zoomInBtn.disabled = true;
    }
    // Set map width and height to zoom value
    map.style.width = zoomValue + "vw";
    map.style.height = zoomValue + "vh";
    // Output zoom value percentage
    zoomValueOutput.innerText = zoomValue + "%";
});

// Same process for zoom out button
zoomOutBtn.addEventListener("click", () => {
    zoomInBtn.disabled = false;
    zoomValue -= 100;
    if(zoomValue > 100) {
        zoomOutBtn.disabled = false;
    } else {
        zoomOutBtn.disabled = true;
    }
    map.style.width = zoomValue + "vw";
    map.style.height = zoomValue + "vh";
    zoomValueOutput.innerText = zoomValue + "%";
});
