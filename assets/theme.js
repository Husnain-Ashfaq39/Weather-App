// Function to set the background image based on weather description and time
function setBackgroundImage(weatherDescription) {
  const dashboard = document.getElementById("dashboard");
  let imageUrl = "sunny.jpg"; // Default to snow if no match found

  // Get the current time (in hours)
  const currentTime = new Date().getHours();

  // If the time is between 6 PM (18) and 3 AM (3), prioritize the night sky
  if (currentTime >= 18 || currentTime < 3) {
    imageUrl = "nightSky.jpg";
  } else {
    // Normalize the weather description to lowercase for easy comparison
    const weather = weatherDescription.toLowerCase();

    // Set image based on the weather description if it's not nighttime
    if (weather.includes("cloud")) {
      imageUrl = "clouds.jpg";
    } else if (weather === "clear sky") {
      imageUrl = "sunny.jpg";
    } else if (
      weather === "shower rain" ||
      weather === "rain" ||
      weather === "light rain" ||
      weather === "drizzle" ||
      weather === "sleet"
    ) {
      imageUrl = "clouds.jpg";
    } else if (weather === "thunderstorm") {
      imageUrl = "stormy.jpg";
    } else if (weather === "snow") {
      imageUrl = "snow.jpg";
    } else if (
      weather === "mist" ||
      weather === "fog" ||
      weather === "dust" ||
      weather === "sand"
    ) {
      imageUrl = "fog.jpg";
    } else {
      // If no specific match is found, default to sunny
      imageUrl = "sunny.jpg";
    }
  }

  // Set the background image for #dashboard
  dashboard.style.backgroundImage = `url('images/${imageUrl}')`;
}
