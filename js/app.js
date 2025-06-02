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

// Weather Widget (Placeholder - Replace with actual weather API implementation)
async function initializeWeather() {
    const weatherElement = document.getElementById('weather-widget');
    // TODO: Implement weather functionality using preferred weather API
    console.log('Weather widget initialization placeholder');
}

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
