const apiKey = 'AIzaSyD0c4WOM2aDKgTUZMawi4HJqC152Ztn-1w';



// Function to dynamically call the weather function by name
function callFunctionByName(functionName) {
  const weatherFunctions = {
    getTemperature,
    getHumidity,
    getWindSpeed,
    getUVIndex,
    getBarChartDetails,
    getDoughnutChartDetails,
    getLineChartDetails,
    getAllChartDetails,
    getweatherForcastData
  };

  if (weatherFunctions[functionName]) {
    return weatherFunctions[functionName]();
  } else {
    return "Function not available.";
  }
}

// Process bot response to call the right functions
function processBotResponse(botResponse) {
  const functionPattern = /\{(.*?)\}/g; // Regex to find curly braces
  let processedResponse = botResponse; // Start with the original bot response
  let match;

  while ((match = functionPattern.exec(botResponse)) !== null) {
    const functionName = match[1]; // Extract function name
    const functionValue = callFunctionByName(functionName); // Call the function
    processedResponse = processedResponse.replace(`{${functionName}}`, functionValue); // Replace with actual value
  }

  return processedResponse; // Return the final processed response
}

// Function to type out the bot's response character by character
function typeText(element, text, speed = 50) {
  let index = 0;

  function type() {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, speed); // Adjust speed for faster or slower typing
    }
  }

  type();
}

document.getElementById('sendMessage').addEventListener('click', function () {
  const userInput = document.getElementById('chatbotInput').value;
  document.getElementsByClassName('chatbot-initial-icon')[0].style.display = 'none';


 
   // Hide suggested cards if they are present
   const suggestedCards = document.querySelectorAll('.suggestion-card');
   suggestedCards.forEach(card => {
     card.style.display = 'none'; // Hide each card
   });

  const prompt = "You are the chatbot for a weather app that helps users understand weather-related graphs and provide live weather information. Users can ask questions about the graphs on the website, like 'What does the first graph show?' or ask for live weather data, such as the current temperature or humidity. Use the following functions to provide live data: getTemperature, getHumidity, getWindSpeed, getFeelsLike, getUVIndex, and getweatherForcastData. For chart-related queries, use getBarChartDetails, getDoughnutChartDetails, getLineChartDetails, and getAllChartDetails. Answer user questions in detail, and include relevant advice like 'Don't forget your umbrella if it's raining.' When the user asks for live data, use the function names in curly braces (e.g., 'The current temperature is {getTemperature}'). Answer questions about both graphs and weather accurately. Now here is the user question: ";
  
  const fullInput = prompt + userInput;

  if (userInput.trim() === '') {
    alert('Please enter a message!');
    return;
  }

  // Call the API with the payload
  fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: fullInput
            }
          ]
        }
      ]
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    let outputDiv = document.getElementById('chatbotOutput');
    console.log(data); // Check the whole response structure
    
    // Extract the bot's response text
    let botResponse = 'No response from API.';
    if (data.candidates && data.candidates.length > 0) {
      const content = data.candidates[0].content;
      if (content && content.parts && content.parts.length > 0) {
        botResponse = content.parts[0].text; // Accessing the text property
      }
    }

    // Process the bot response for function calls
    let processedResponse = processBotResponse(botResponse);

    // Display user input immediately
    outputDiv.innerHTML += `
      <div class="chat-message user-message">
        <img src="https://cdn-icons-png.flaticon.com/512/483/483361.png" alt="User Icon">
        <span><strong>You:</strong> ${userInput}</span>
      </div>`;
    
    // Create a placeholder for the bot's response
    let botMessage = document.createElement('div');
    botMessage.classList.add('chat-message', 'bot-message');
    botMessage.innerHTML = `
      <img src="images/bot.webp" alt="Bot Icon">
      <span><strong>WeatherBot:</strong> </span>
    `;
    outputDiv.appendChild(botMessage);

    // Use the typeText function to simulate typing effect
    let botMessageText = botMessage.querySelector('span');
    typeText(botMessageText, processedResponse, 50); // Typing effect with speed 50ms per character

    // Scroll the chatbotOutput div to the bottom
    outputDiv.scrollTop = outputDiv.scrollHeight;
    
    // Clear the input after submission
    document.getElementById('chatbotInput').value = '';
  })
  .catch(error => {
    let outputDiv = document.getElementById('chatbotOutput');
    outputDiv.innerHTML += `
      <div class="chat-message bot-message">
        <img src="icons/userIcon.png" alt="Error Icon">
        <span><strong>Error:</strong> There was an issue processing your request: ${error.message}</span>
      </div>`;
    console.error('There was an error:', error);
  });
});
