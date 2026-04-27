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
const cityOutput = document.querySelector(".city");
const areaOutput = document.querySelector(".area");
const currencyOutput = document.querySelector(".currency");
const languagesOutput = document.querySelector(".languages");

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
                    // Capital City
                    cityOutput.innerText = data[0].capital;
                    // Change number format to include dots in big numbers
                    const formatedNumber = data[0].area.toLocalString('de-DE');
                    areaOutput.innerHTML = formatedNumber + ` km<sup>2</sup>`;
                    // Currency
                    // Get the currencies object
                    const currencies = data[0].currencies;
                    // Set currency output to empty string (Remove data from previous country)
                    currencyOutput.innerText = "";
                    // Loop through each object key
                    Object.keys(currencies).forEach(key => {
                        // Output the name of each currency of the selected country
                        currencyOutput.innerHTML += `<li>${currencies[key].name}</li>`
                    });
                    // Languages
                    const languages = data[0].languages;
                    languagesOutput.innerText = "";
                    Object.keys(languages).forEach(key => {
                        languagesOutput.innerHTML += `<li>${languages[key]}</li>`;
                    });
                    // Wait for new flag image to load
                    countryFlagOutput.onload = () => {
                        // Show container with country info
                        container.classList.remove("hide");
                        // Hide loading screen
                        loading.classList.add("hide");
                    };
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