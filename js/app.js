// Main App JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setStatistics();
});

async function initializeApp() {
    setupScrollAnimation();
    await initializeMap();
    await initializeWeather();
}

// Smooth Scroll Animation
function setupScrollAnimation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Cleanup locations data
const cleanupLocations = [
    {
        name: "Sunrise Beach Cleanup",
        position: { lat: -33.852, lng: 151.211 }, // Example coordinates
        date: "June 5, 2025",
        time: "7:00 AM - 10:00 AM",
        participants: 12
    },
    {
        name: "Ocean Drive Revival",
        position: { lat: -33.857, lng: 151.215 }, // Example coordinates
        date: "June 8, 2025",
        time: "8:30 AM - 11:30 AM",
        participants: 8
    },
    {
        name: "Bay Area Cleanup",
        position: { lat: -33.859, lng: 151.209 }, // Example coordinates
        date: "June 15, 2025",
        time: "9:00 AM - 12:00 PM",
        participants: 15
    }
];

// Map Initialization (Placeholder - Replace with actual map API implementation)
async function initializeMap() {
    const mapElement = document.getElementById('cleanup-map');
    if (!mapElement) return;

    const map = new google.maps.Map(mapElement, {
        zoom: 13,
        center: cleanupLocations[0].position,
        styles: [
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#1CA3EC" }]
            },
            {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [{ color: "#F5F8FA" }]
            }
        ]
    });

    // Add markers for each cleanup location
    cleanupLocations.forEach(location => {
        const marker = new google.maps.Marker({
            position: location.position,
            map: map,
            title: location.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#FF9F43",
                fillOpacity: 0.8,
                strokeWeight: 2,
                strokeColor: "#FFFFFF"
            }
        });

        // Create info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info-window">
                    <h3>${location.name}</h3>
                    <p>Date: ${location.date}</p>
                    <p>Time: ${location.time}</p>
                    <p>${location.participants} people attending</p>
                    <button onclick="joinCleanup('${location.name}')" class="map-join-button">Join Event</button>
                </div>
            `
        });

        // Add click listener to marker
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    });
}

// Join cleanup event function
function joinCleanup(eventName) {
    alert(`Thanks for joining ${eventName}! We'll send you the details shortly.`);
}

// Weather API Integration
// API Endpoints
const WEATHER_API_URL = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';
const TEMPERATURE_API_URL = 'https://api.data.gov.sg/v1/environment/air-temperature';
const RELATIVE_HUMIDITY_API_URL = 'https://api.data.gov.sg/v1/environment/relative-humidity';
const WIND_SPEED_API_URL = 'https://api.data.gov.sg/v1/environment/wind-speed';
const UV_INDEX_API_URL = 'https://api.data.gov.sg/v1/environment/uv-index';

// Beach locations mapping
const BEACH_LOCATIONS = {
    'pasir-ris': { name: 'Pasir Ris', area: 'pasir ris', emoji: '🏖️' },
    'sentosa': { name: 'Sentosa', area: 'sentosa', emoji: '🌴' },
    'east-coast': { name: 'East Coast', area: 'marine parade', emoji: '🌅' }
};

async function fetchWeatherData() {
    try {
        const [weatherRes, tempRes, humidityRes, windRes] = await Promise.all([
            fetch(WEATHER_API_URL),
            fetch(TEMPERATURE_API_URL),
            fetch(RELATIVE_HUMIDITY_API_URL),
            fetch(WIND_SPEED_API_URL)
        ]);

        const weatherData = await weatherRes.json();
        const tempData = await tempRes.json();
        const humidityData = await humidityRes.json();
        const windData = await windRes.json();

        return {
            forecast: weatherData.items[0],
            temperature: tempData.items[0],
            humidity: humidityData.items[0],
            wind: windData.items[0]
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function getWeatherIcon(forecast) {
    const weatherMap = {
        'Partly Cloudy': '🌤️',
        'Cloudy': '☁️',
        'Light Rain': '🌦️',
        'Moderate Rain': '🌧️',
        'Heavy Rain': '⛈️',
        'Clear': '☀️',
        'Fair': '🌅',
        'Showers': '🌦️',
        'Thunder': '⛈️'
    };
    return weatherMap[forecast] || '🌤️';
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-SG', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }).format(new Date(date));
}

async function fetchUVIndex() {
    try {
        const response = await fetch(UV_INDEX_API_URL);
        const data = await response.json();
        return data.items[0].index[0].value;
    } catch (error) {
        console.error('Error fetching UV index:', error);
        return null;
    }
}

function updateUVWarning(uvIndex) {
    const warningElement = document.getElementById('uv-warning');
    if (!uvIndex) return;

    if (uvIndex >= 11) {
        warningElement.className = 'uv-warning extreme';
        warningElement.innerHTML = '🔥 Wah, UV index very high sia! Better wear sunscreen and hat!';
    } else if (uvIndex >= 8) {
        warningElement.className = 'uv-warning high';
        warningElement.innerHTML = '😎 UV quite strong lah! Don\'t forget your sunscreen!';
    } else {
        warningElement.className = 'uv-warning';
        warningElement.innerHTML = '👍 UV level okay lah!';
    }
}

function setupLocationTabs() {
    const tabs = document.querySelectorAll('.location-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateWeather(tab.dataset.location);
        });
    });
}

async function updateWeather(location = 'pasir-ris') {
    const weatherGrid = document.getElementById('weather-grid');
    const lastUpdated = document.getElementById('last-updated');
    const locationInfo = BEACH_LOCATIONS[location];
    
    try {
        const [weatherData, uvIndex] = await Promise.all([
            fetchWeatherData(),
            fetchUVIndex()
        ]);

        if (!weatherData) throw new Error('No weather data available');

        const beachData = weatherData.forecast.forecasts.find(
            f => f.area.toLowerCase().includes(locationInfo.area)
        );

        if (!beachData) throw new Error('Location data not available');

        const nearestTemp = weatherData.temperature.readings[0].value;
        const nearestHumidity = weatherData.humidity.readings[0].value;
        const nearestWind = weatherData.wind.readings[0].value;

        lastUpdated.textContent = formatDate(weatherData.forecast.timestamp);

        const weatherCard = `
            <div class="weather-card">
                <div class="weather-date">Now ${locationInfo.emoji}</div>
                <div class="weather-icon">${getWeatherIcon(beachData.forecast)}</div>
                <div class="weather-temp">${nearestTemp.toFixed(1)}°C</div>
                <div class="weather-desc">${beachData.forecast}</div>
                <div class="weather-details">
                    <span>Humidity: ${nearestHumidity.toFixed(0)}%</span>
                    <span>Wind: ${nearestWind.toFixed(1)} km/h</span>
                </div>
            </div>
        `;

        weatherGrid.innerHTML = weatherCard;
        updateUVWarning(uvIndex);

    } catch (error) {
        console.error('Error updating weather:', error);
        weatherGrid.innerHTML = `
            <div class="weather-error">
                <p>Aiyo! Cannot load weather data. Try again later lah!</p>
            </div>
        `;
    }
}

// Update weather every 30 minutes
function startWeatherUpdates() {
    updateWeather();
    setInterval(updateWeather, 30 * 60 * 1000);
}

// Initialize weather updates when page loads
document.addEventListener('DOMContentLoaded', () => {
    startWeatherUpdates();
    // ...existing initialization code...
});

// Set Statistics
function setStatistics() {
    const stats = {
        'beaches-cleaned': 42,
        'volunteers': '1,280',
        'trash-collected': '4.2 tons',
        'upcoming-events': 8
    };

    for (const [id, value] of Object.entries(stats)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

// Performance Optimizations
document.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
        const nav = document.querySelector('.main-nav');
        if (window.scrollY > 100) {
            nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            nav.style.backgroundColor = 'white';
        }
    });
});
