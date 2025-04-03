let clickCount = 0;

const countryInput = document.getElementById('country');
const countryCodeSelect = document.getElementById('countryCode');
const myForm = document.getElementById('form');
const modalElement = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

// Show Bootstrap modal programmatically
function showModal() {
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
}

// Handle form submission with validation
function handleFormSubmit(event) {
    event.preventDefault();
    if (myForm.checkValidity()) {
        showModal(); // Show modal on success
    } else {
        myForm.classList.add('was-validated');
    }
}

// Count all mouse clicks on the page
function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

// Fetch all countries and populate datalist
async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common).sort();
        const datalist = document.createElement('datalist');
        datalist.id = 'country-list';
        datalist.innerHTML = countries.map(c => `<option value="${c}">`).join('');
        document.body.appendChild(datalist);
        countryInput.setAttribute('list', 'country-list');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

// Fetch user's country by IP and set country/code inputs
function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            countryInput.value = country;
            getCountryCode(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

// Get calling code for selected country
function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Błąd pobierania danych');
            }
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + data[0].idd.suffixes.join("");
            countryCodeSelect.value = countryCode;
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    fetchAndFillCountries();
    getCountryByIP();
    myForm.addEventListener('submit', handleFormSubmit);
    document.addEventListener('click', handleClick);
});
