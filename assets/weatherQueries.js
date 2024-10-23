// Object to store weather information globally
let weatherInfo = {
    temperature: null,
    humidity: null,
    windSpeed: null,
    feelsLike: null,
    location: null,
    uvIndex: null,
  };
  
  // Array to store forecast data
  let weatherForcastData = [];
  
  // Function to handle and store current weather data
  function getcurrentWeather(data) {
    console.log("Handling current weather data");
  
    // Store data globally
    weatherInfo.temperature = data.main.temp;
    weatherInfo.humidity = data.main.humidity;
    weatherInfo.windSpeed = data.wind.speed;
    weatherInfo.feelsLike = data.main.feels_like;
    weatherInfo.location = data.name;
    weatherInfo.uvIndex = 39; // Example static UV index
  
    // You can update the UI here or do further processing
    console.log(weatherInfo); // Example output for checking
  }
  
  // Function to handle and store 5 days forecast data
  function get5daysForcastData(data) {
    console.log("Handling 5 days forecast data");
  
    // Store forecast data globally
    weatherForcastData = data.list;
  
    // You can process this forecast data for display, charting, etc.
    console.log(weatherForcastData); // Example output for checking
  }
  
  // Getter functions to retrieve stored weather information
  function getTemperature() {
    return weatherInfo.temperature;
  }
  
  function getHumidity() {
    return weatherInfo.humidity;
  }
  
  function getWindSpeed() {
    return weatherInfo.windSpeed;
  }
  
  function getFeelsLike() {
    return weatherInfo.feelsLike;
  }
  
  function getLocation() {
    return weatherInfo.location;
  }
  
  function getUVIndex() {
    return weatherInfo.uvIndex;
  }
  
  // Getter function for forecast data of next five days
  function getweatherForcastData() {
    if (!weatherForcastData || weatherForcastData.length === 0) return "Forecast data is not available right now.";
  
    let summary = "Here's the 5-day weather forecast summary:\n";
    
    for (let i = 0; i < weatherForcastData.length; i += 8) { // Assuming 3-hour intervals, every 8th entry will represent the next day
      const day = weatherForcastData[i];
      const date = new Date(day.dt * 1000).toLocaleDateString();
      const temp = day.main.temp;
      const description = day.weather[0].description;
  
      summary += `${date}: Expect ${description} with a temperature of ${temp}°C.\n`;
    }
  
    return summary;
  }



  // Charts Data



  // Getter function for Bar Chart details
function getBarChartDetails() {
  if (barChartInstance) {
      const labels = barChartInstance.data.labels;
      const data = barChartInstance.data.datasets[0].data;
      return {
          type: barChartInstance.config.type,
          labels: labels,
          data: data,
          description: `The bar chart is displaying temperature data in °C for the following days: ${labels.join(', ')}.`,
      };
  }
  return "Bar chart is not available.";
}

// Getter function for Doughnut Chart details
function getDoughnutChartDetails() {
  if (doughnutChartInstance) {
      const labels = doughnutChartInstance.data.labels;
      const data = doughnutChartInstance.data.datasets[0].data;
      return {
          type: doughnutChartInstance.config.type,
          labels: labels,
          data: data,
          description: `The doughnut chart is displaying the frequency of different weather conditions: ${labels.join(', ')}.`,
      };
  }
  return "Doughnut chart is not available.";
}

// Getter function for Line Chart details
function getLineChartDetails() {
  if (lineChartInstance) {
      const labels = lineChartInstance.data.labels;
      const data = lineChartInstance.data.datasets[0].data;
      return {
          type: lineChartInstance.config.type,
          labels: labels,
          data: data,
          description: `The line chart is showing temperature trends in °C over the following days: ${labels.join(', ')}.`,
      };
  }
  return "Line chart is not available.";
}

// Getter function for general chart information (all charts)
function getAllChartDetails() {
  const barChartDetails = getBarChartDetails();
  const doughnutChartDetails = getDoughnutChartDetails();
  const lineChartDetails = getLineChartDetails();

  return {
      barChartDetails,
      doughnutChartDetails,
      lineChartDetails
  };
}


  
  // Export these functions if using ES6 modules
  // export { get5daysForcastData, getcurrentWeather, getTemperature, getHumidity, getWindSpeed, getFeelsLike, getLocation, getUVIndex, getweatherForcastData };
  