let map;
let marker;
let outlookCircle;

function initMap() {
    console.log("Initializing map");
    // Initialize the map centered on a default location (e.g., New York City)
    map = L.map('map').setView([40.7128, -74.0060], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    console.log("Map initialized. Current center:", map.getCenter(), "Current zoom:", map.getZoom());
}

function geocodeLocation(location) {
    // Remove country code if present (e.g., "CAN" in "Ottawa, ON, CAN")
    const cleanedLocation = location.split(',').slice(0, 2).join(',').trim();
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanedLocation)}&limit=1`;
    
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon)
                };
            } else {
                throw new Error('Location not found');
            }
        });
}

function getOutlookColor(outlook) {
    switch(outlook.toLowerCase()) {
        case 'excellent':
            return 'green';
        case 'moderate':
            return 'yellow';
        case 'low':
            return 'red';
        default:
            return 'blue';
    }
}

function updateMap(location, coordinates, solarOutlook, weatherData) {
    console.log("Updating map with coordinates:", coordinates);

    // Update the map view
    map.setView([coordinates.lat, coordinates.lon], 10);

    // Remove existing marker and circle if present
    if (marker) {
        map.removeLayer(marker);
    }
    if (outlookCircle) {
        map.removeLayer(outlookCircle);
    }

    // Add new marker
    marker = L.marker([coordinates.lat, coordinates.lon]).addTo(map);
    marker.bindPopup(`Location: ${location}<br>Solar Outlook: ${solarOutlook}`).openPopup();

    // Add colored circle based on solar outlook
    const circleColor = getOutlookColor(solarOutlook);
    outlookCircle = L.circle([coordinates.lat, coordinates.lon], {
        color: circleColor,
        fillColor: circleColor,
        fillOpacity: 0.2,
        radius: 5000 // 5km radius, adjust as needed
    }).addTo(map);

    console.log("Map updated. Current center:", map.getCenter(), "Current zoom:", map.getZoom());

    // Update weather data display
    updateWeatherDisplay(weatherData);
}

function updateWeatherDisplay(weatherData) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    if (weatherDisplay) {
        weatherDisplay.innerHTML = `
            <h3>Weather Data</h3>
            <p>Temperature: ${weatherData.temperature}°C</p>
            <p>Humidity: ${weatherData.humidity}%</p>
            <p>Wind Speed: ${weatherData.windSpeed} km/h</p>
            <p>Cloud Cover: ${weatherData.cloudCover}%</p>
        `;
    } else {
        console.error("Weather display element not found");
    }
}

function handleSubmit(event) {
    event.preventDefault();
    const location = document.getElementById('location').value;
    console.log("Submitted location:", location);

    geocodeLocation(location)
        .then(coordinates => {
            // Here you would typically call your backend API to get the solar panel analysis and weather data
            // For this example, we'll use mock data with random outlook
            const outlooks = ['Excellent', 'Moderate', 'Low'];
            const mockSolarOutlook = outlooks[Math.floor(Math.random() * outlooks.length)];
            const mockWeatherData = {
                temperature: Math.floor(Math.random() * 30),
                humidity: Math.floor(Math.random() * 100),
                windSpeed: Math.floor(Math.random() * 20),
                cloudCover: Math.floor(Math.random() * 100)
            };
            updateMap(location, coordinates, mockSolarOutlook, mockWeatherData);
        })
        .catch(error => {
            console.error("Geocoding error:", error);
            alert("Location not found. Please try a different location.");
        });
}

document.addEventListener('DOMContentLoaded', (event) => {
    initMap();
    document.getElementById('locationForm').addEventListener('submit', handleSubmit);
});
