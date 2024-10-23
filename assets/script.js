const API_KEY = "833662ecc4a40fd60023b9bc0667c5a4";

let longitude;
let latitude;
let forecastData = []; // Array to hold original forecast data
let filteredData = []; // Array to hold filtered or sorted data
let currentPage = 1; // Track the current page
const itemsPerPage = 5; // Number of cards per page (modified to 5)
let cachedCityData = {}; // Cache object to store data for cities
let temperatureCelsius;

const sidebar = document.getElementById("sidebar");
const hamburger = document.getElementById("hamburger");
const crossBtn = document.getElementById("cross-btn");

// Toggle sidebar visibility on hamburger and cross button clicks
hamburger.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

crossBtn.addEventListener("click", () => {
  sidebar.classList.add("hidden");
});

// Hide sidebar when clicking outside of it
document.addEventListener("click", (event) => {
  const isClickInsideSidebar = sidebar.contains(event.target);
  const isClickOnHamburger = hamburger.contains(event.target);

  // Check if the click was outside the sidebar and not on the hamburger
  if (!isClickInsideSidebar && !isClickOnHamburger) {
    sidebar.classList.add("hidden");
  }
});


function toggleChatbot() {
  const chatbotWindow = document.querySelector('.chatbot-window');
  chatbotWindow.classList.toggle('active');
}


function suggestionClick(text) {
  document.getElementById('chatbotInput').value = text;
  const suggestions = document.getElementsByClassName('suggestion-card');
  for (let i = 0; i < suggestions.length; i++) {
    suggestions[i].style.display = 'none';
  }
  
}


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
} else {
  alert("Geolocation is not supported by this browser.");
}

// If geolocation succeeds
function successCallback(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      fetchWeather(data.city.name);
    })
    .catch((err) => {
      console.error("Error fetching weather:", err);
      alert("City not found");
    });
  // Fetch weather based on coordinates
}

// If geolocation fails (e.g., permission denied)
function errorCallback(error) {
  console.error("Geolocation error:", error.message);
  alert("Unable to get your location. Please enter a city name manually.");
}

// TOOGLE TEMPERATURE

// Convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

// Convert Fahrenheit to Celsius
function fahrenheitToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

document.getElementById("tempToggle").addEventListener("change", function () {
  const tempUnit = document.getElementById("tempUnit");
  const temperatureElement = document.getElementById("temperature");

  if (this.checked) {
    // Switch to Fahrenheit
    const temperatureFahrenheit = celsiusToFahrenheit(temperatureCelsius);
    temperatureElement.textContent = temperatureFahrenheit.toFixed(1);
    tempUnit.textContent = "F";
  } else {
    // Switch to Celsius
    temperatureElement.textContent = temperatureCelsius.toFixed(1);
    tempUnit.textContent = "C";
  }
});

function displayWeather(weather) {
  document.getElementById("temperature").textContent = weather.main.temp;
  document.getElementById("humidity").textContent = weather.main.humidity;
  document.getElementById("windSpeed").textContent = weather.wind.speed;
  document.getElementById("location").textContent = weather.name;
}

// Event listener for getting weather on "Enter" key press
document.getElementById("cityInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const city = document.getElementById("cityInput").value;
    if (city) {
      if (cachedCityData[city]) {
        console.log(`Using cached data for ${city}`);
        const { weather, forecast } = cachedCityData[city];
        displayWeather(weather);
        forecastData = forecast.list; // Use cached forecast data
        filteredData = [...forecastData]; // Copy original data to filteredData
        renderForecastCards(); // Render the cards for the current page
        processForecastData(forecast); // Call this function to handle the chart rendering
      } else {
        fetchWeather(city); // Fetch from API if not cached
      }
    } else {
      alert("Please enter a city name.");
    }
  }
});

// Existing event listener for "Get Weather" button click
document.getElementById("getWeather").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value;
  if (city) {
    if (cachedCityData[city]) {
      console.log(`Using cached data for ${city}`);
      const { weather, forecast } = cachedCityData[city];
      displayWeather(weather);
      forecastData = forecast.list; // Use cached forecast data
      filteredData = [...forecastData]; // Copy original data to filteredData
      renderForecastCards(); // Render the cards for the current page
      processForecastData(forecast); // Call this function to handle the chart rendering
    } else {
      fetchWeather(city); // Fetch from API if not cached
    }
  } else {
    alert("Please enter a city name.");
  }
});





// Fetch current weather
function fetchWeather(city) {
  const spinner = document.getElementById('spinner');
  const mainContent = document.getElementById('main-content');
  const API_KEYn = "833662ecc4a40fd60023b9bc0667c5a4";

  spinner.style.display = 'block';  // Show spinner
  mainContent.style.display = 'none';  // Hide main content
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("weather data");
      console.log(data);
      longitude = data.coord.lon;
      latitude = data.coord.lat;
      const temperature = data.main.temp;
      temperatureCelsius = temperature;
      

      const iconCode = data.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

      const weatherDescription = data.weather[0].description;
      setBackgroundImage(weatherDescription);

      document.getElementById("weatherDescription").textContent = weatherDescription;
      document.getElementById("temperature").textContent = data.main.temp;
      document.getElementById("humidity").textContent = data.main.humidity;
      document.getElementById("windSpeed").textContent = data.wind.speed;
      document.getElementById("location").textContent = data.name;
      //document.getElementById("weatherIcon").src = iconUrl;
      document.getElementById("cityName").textContent = data.sys.country + "," + data.name;

      getcurrentWeather(data); // Passing the data to getcurrentWeather
      

      fetchForecast(city, data); // Pass the weather data along
    })
    .catch((err) => {
      console.error("Error fetching weather:", err);
  
      // Create error message element
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error-message';
      errorMessage.innerHTML = `
          <div class="error-header">Oops!</div>
          <p>City not found. Please check the name and try again.</p>
          <button class="close-btn">Close</button>
      `;
      document.body.appendChild(errorMessage);
  
      // Hide the error message with fade-out animation
      const closeButton = errorMessage.querySelector('.close-btn');
      closeButton.addEventListener('click', () => {
          errorMessage.classList.add('fade-out');
          setTimeout(() => errorMessage.remove(), 500); // Remove after animation
      });
  }).finally(() => {
      spinner.style.display = 'none'; // Hide spinner once fetch is done
      mainContent.style.display = 'block';
  });
  
}

// Fetch weather forecast
function fetchForecast(city, weatherData) {


  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((forecast) => {
      if (forecast && forecast.list) {
        console.log("forecast Data");
        console.log(forecast);

       

        forecastData = forecast.list;
        filteredData = [...forecastData]; 

        cachedCityData[city] = {
          weather: weatherData,
          forecast: forecast,
        };

        renderForecastCards(); 
        processForecastData(forecast); 
        get5daysForcastData(forecast);
        longitude = null;
        latitude = null;
        
      } else {
        console.error("Forecast data is unavailable or in incorrect format");
        alert("Unable to fetch forecast data.");
      }
    })
    .catch((err) => console.error("Error fetching forecast:", err));
    
}



function formatDate(dateObj) {
  const day = dateObj.getDate(); // Day of the month
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[dateObj.getMonth()]; // Month name
  const year = dateObj.getFullYear(); // Year

  return `${day}-${month}-${year}`;
}

// Function to format the time in HH:MM AM/PM format
function formatTime(dateObj) {
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0'); // Ensure two digits for minutes
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format

  return `${hours}:${minutes} ${ampm}`;
}



function renderForecastCards() {
  const forecastContainer = document.getElementById("weatherGrid");
  forecastContainer.innerHTML = ""; // Clear previous entries

  // Mapping weather descriptions to icon file names
  const dayIconMap = {
    "clear sky": "clear-day.svg",
    "few clouds": "clouds.svg",
    "scattered clouds": "clouds.svg",
    "broken clouds": "clouds.svg",
    "shower rain": "day rain.svg",
    "rain": "day rain.svg",
    "thunderstorm": "thunderstorm.svg",
    "snow": "snow.svg",
    "mist": "mist.svg"
  };

  const nightIconMap = {
    "clear sky": "clear-night.svg",
    "few clouds": "clouds.svg",
    "scattered clouds": "clouds.svg",
    "broken clouds": "clouds.svg",
    "shower rain": "night rain.svg",
    "rain": "night rain.svg",
    "thunderstorm": "thunderstorm.svg",
    "snow": "snow.svg",
    "mist": "mist.svg"
  };

  // Helper function to determine if it's day or night based on the time
  function isDayTime(date) {
    const hour = date.getHours();
    return hour >= 6 && hour < 18; // Daytime from 6 AM to 6 PM
  }

  // Pagination
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const currentForecasts = filteredData.slice(start, end); // Use filtered data

  if (!currentForecasts || !Array.isArray(currentForecasts)) {
    console.error("Invalid forecast data.");
    return;
  }

  currentForecasts.forEach((forecast) => {
    if (
      forecast &&
      forecast.main &&
      forecast.weather &&
      forecast.weather.length > 0
    ) {
      const card = document.createElement("div");
      card.classList.add("weather-card", "p-4", "rounded");

      const date = new Date(forecast.dt_txt);
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      )}`;

      // Ensure values are available before setting them
      const temp = forecast?.main?.temp || "N/A";
      const tempMax = forecast?.main?.temp_max || "N/A";
      const tempMin = forecast?.main?.temp_min || "N/A";
      const description = forecast?.weather?.[0]?.description || "No description";
      const humidity = forecast?.main?.humidity || "N/A";
      const windSpeed = forecast?.wind?.speed || "N/A";

      // Choose day or night icon based on the time
      const iconMap = isDayTime(date) ? dayIconMap : nightIconMap;
      const iconFileName = iconMap[description.toLowerCase()] || "clouds.svg";
      const iconUrl = `icons/cardIcons/${iconFileName}`;

      // Get the formatted date and time
      const formattedDatee = formatDate(date);
      const formattedTime = formatTime(date);

      card.innerHTML = `
  <div class="relative p-6 overflow-hidden text-white rounded-2xl transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
    style="background: linear-gradient(135deg, #2E335A 0%, #1C1B33 100%);">

    <!-- Purple Background Shape (SVG) -->
    <div class="absolute inset-0 bottom-1">
        <img src="icons/card.svg" alt="Purple Background Shape" class="w-full h-full object-contain opacity-60" />
    </div>

    <!-- Main content -->
    <div class="relative z-10 flex flex-col items-start justify-between p-6 h-full">
        <!-- Temperature Section -->
        <div class="flex flex-col items-start mb-2">
            <p class="text-lg font-bold mb-2 lg:text-4xl sm:text-3xl">${temp}°</p>
            <!-- Increase font size for H and L -->
            <p class="text-sm font-light lg:text-base sm:text-sm">H: ${tempMax}° L: ${tempMin}°</p>
        </div>

        <!-- Dynamic Weather Icon -->
        <div class="absolute top-2 right-2 w-24 h-24 lg:w-20 lg:h-20 sm:w-16 sm:h-16">
            <img src="${iconUrl}" alt="Weather Icon" class="w-full h-full object-contain" />
        </div>

        <!-- Weather Description at the Bottom-Right -->
        <div class="absolute bottom-2 right-2 text-right text-lg lg:right-4 lg:text-xl sm:text-base">
            <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
        </div>

        <!-- Date and Time -->
        <div class="mt-6">
            <p class="text-sm lg:text-xs sm:text-xxs">${formattedTime}</p>
            <p class="text-sm lg:text-xs sm:text-xxs">${formattedDate}</p>
        </div>
    </div>
</div>
`;

      forecastContainer.appendChild(card);
    }
  });



  document.getElementById("pageNumber").textContent = `Page ${currentPage}`;

  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled =
    currentPage * itemsPerPage >= filteredData.length;
}


// Pagination controls
document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderForecastCards();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage * itemsPerPage < filteredData.length) {
    currentPage++;
    renderForecastCards();
  }
});

// Filter & Sort functionalities
document
  .getElementById("filterOptions")
  .addEventListener("change", function () {
    const option = this.value;

    switch (option) {
      case "ascTemp":
        sortTemperaturesAscending();
        break;
      case "descTemp":
        sortTemperaturesDescending();
        break;
      case "rainOnly":
        filterRainyDays();
        break;
      case "highestTemp":
        showHighestTemperature();
        break;
      default:
        filteredData = [...forecastData]; // Reset to unfiltered data
        renderForecastCards(); // Default to normal rendering
    }
  });

// Sort temperatures in ascending order
function sortTemperaturesAscending() {
  filteredData = [...forecastData].sort((a, b) => a.main.temp - b.main.temp);
  renderForecastCards();
}

// Sort temperatures in descending order
function sortTemperaturesDescending() {
  filteredData = [...forecastData].sort((a, b) => b.main.temp - a.main.temp);
  renderForecastCards();
}

// Filter days with rain
function filterRainyDays() {
  filteredData = forecastData.filter(
    (forecast) => !forecast.weather[0].description.includes("rain")
  );
  currentPage = 1; // Reset to page 1 after filtering
  renderForecastCards();
}

// Show the day with the highest temperature
function showHighestTemperature() {
  const highestTempDay = forecastData.reduce(
    (max, forecast) => (forecast.main.temp > max.main.temp ? forecast : max),
    forecastData[0]
  );
  filteredData = [highestTempDay]; // Show only the highest temp day
  currentPage = 1; // Reset to page 1
  renderForecastCards();
}


