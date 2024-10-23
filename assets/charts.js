let barChartInstance;
let doughnutChartInstance;
let lineChartInstance;

function processForecastData(data, a=0) {
    const labels = [];
    const temps = [];
    const weatherConditions = {};

    data.list.forEach((entry, index) => {
        if (index % 8 === 0) { // Pick data for each day (8 = 24 hours / 3-hour interval)
            // Shorten date to only show the day (e.g., "Mon", "Tue")
            labels.push(new Date(entry.dt_txt).toLocaleDateString('en-US', { weekday: 'short' }));
            temps.push(entry.main.temp);

            const condition = entry.weather[0].main;
            weatherConditions[condition] = (weatherConditions[condition] || 0) + 1;
        }
    });

    renderBarChart(labels, temps);
    renderDoughnutChart(weatherConditions);
    renderLineChart(labels, temps);
}

function renderBarChart(labels, temps) {
    const ctx = document.getElementById('barChart').getContext('2d');

    // Destroy existing chart instance if it exists
    if (barChartInstance) {
        barChartInstance.destroy();
    }

    // Create new chart instance
    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            }],
        },
        options: {
            animation: {
                duration: 1500,
                easing: 'easeOutBounce',
            },
            maintainAspectRatio: false, // Allow height change
            scales: {
                x: {
                    grid: {
                        display: false, // Remove vertical lines
                    },
                },
                y: {
                    grid: {
                        display: false, // Remove horizontal lines
                    },
                    beginAtZero: true,
                },
            },
        },
    });
}


function renderDoughnutChart(conditions) {
    const ctx = document.getElementById('doughnutChart').getContext('2d');

    // Destroy existing chart instance if it exists
    if (doughnutChartInstance) {
        doughnutChartInstance.destroy();
    }

    // Create new chart instance
    doughnutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(conditions),
            datasets: [{
                data: Object.values(conditions),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            }],
        },
    });
}



function renderLineChart(labels, temps) {
    const ctx = document.getElementById('lineChart').getContext('2d');

    // Destroy existing chart instance if it exists
    if (lineChartInstance) {
        lineChartInstance.destroy();
    }

    // Calculate the min and max temperature to provide some padding
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    // Create new chart instance
    lineChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature Trend (°C)',
                data: temps,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            }],
        },
        options: {
            maintainAspectRatio: false, // Allows dynamic height adjustment
            animation: {
                duration: 1500,
                easing: 'easeOutBounce',
            },
            responsive: true, // Ensure responsiveness
            scales: {
                x: {
                    grid: {
                        display: false, // Remove vertical lines
                    },
                },
                y: {
                    beginAtZero: false, // Allow the y-axis to start closer to the data range
                    min: minTemp - 5,  // Add some padding below the lowest temperature
                    max: maxTemp + 5,  // Add some padding above the highest temperature
                    grid: {
                        display: false, // Remove horizontal lines
                    },
                    ticks: {
                        stepSize: 2, // Control the spacing between levels
                    },
                },
            },
        },
    });
}

