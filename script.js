const divisionImageMap = {
    dhaka: "orce.png.jpeg",
    chittagong: "cox.jpeg",
    sylhet: "sylhet.jpeg",
    khulna: "khulna.jpeg",
    rajshahi: "rajshahi.jpeg",
    barisal: "barisal.jpeg",
    rangpur: "rangpur.jpeg",
    mymensingh: "Mymensingh.jpeg"
};

// Bangladesh Division Coordinates
const divisionCoordinates = {
    dhaka: [23.8103, 90.4125],
    chittagong: [22.3569, 91.7832],
    sylhet: [24.8949, 91.8687],
    khulna: [22.8456, 89.5403],
    rajshahi: [24.3745, 88.6042],
    barisal: [22.7010, 90.3535],
    rangpur: [25.7439, 89.2752],
    mymensingh: [24.7471, 90.4203]
};

// Initialize Google Map
function initializeMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Bangladesh boundaries (tight fit)
    const bangladeshBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(20.74, 88.01), // Southwest
        new google.maps.LatLng(26.63, 92.67)  // Northeast
    );

    // Create map centered on Bangladesh
    const map = new google.maps.Map(mapElement, {
        center: { lat: 23.8, lng: 90.4 },
        zoom: 7.5,
        minZoom: 7,
        maxZoom: 12,
        restriction: {
            latLngBounds: bangladeshBounds,
            strictBounds: true
        },
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        gestureHandling: 'greedy',
        styles: [
            {
                featureType: "administrative.country",
                elementType: "geometry.stroke",
                stylers: [{ visibility: "on" }, { color: "#006747" }, { weight: 2 }]
            },
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "administrative.country",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // Fit map to Bangladesh bounds
    map.fitBounds(bangladeshBounds);
    
    // Override zoom after fitBounds
    google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
        if (this.getZoom() > 8) {
            this.setZoom(8);
        }
    });

    // Add markers for each division
    Object.keys(divisionCoordinates).forEach(divisionId => {
        const coords = divisionCoordinates[divisionId];
        const divisionName = divisionId.charAt(0).toUpperCase() + divisionId.slice(1);
        
        const marker = new google.maps.Marker({
            position: { lat: coords[0], lng: coords[1] },
            map: map,
            title: divisionName,
            animation: google.maps.Animation.DROP,
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3 style="margin: 0 0 8px 0; color: #006747;">${divisionName}</h3>
                    <a href="${divisionId}.html" style="color: #004d35; text-decoration: none; font-weight: 600;">View Details →</a>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        // Optional: Bounce animation on hover
        marker.addListener('mouseover', () => {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => marker.setAnimation(null), 750);
        });
    });
};

function createCardHtml(division) {
    const imageName = divisionImageMap[division.id] || "https://via.placeholder.com/300x200?text=Division";
    const safeName = division.name || "Unknown";

    return `
        <a href="${division.id}.html" class="card">
            <div class="card-image">
                <img src="${imageName}" alt="${safeName}">
                <div class="overlay"></div>
            </div>
            <div class="card-content">
                <h3>${safeName}</h3>
            </div>
        </a>
    `;
}

async function loadDivisions() {
    const gridSection = document.getElementById("divisionGrid");

    if (!gridSection) {
        return;
    }

    try {
        const response = await fetch("destinations.json");

        if (!response.ok) {
            throw new Error(`Failed to load destinations.json (${response.status})`);
        }

        const divisions = await response.json();

        if (!Array.isArray(divisions)) {
            throw new Error("Invalid JSON format: expected an array of divisions");
        }

        gridSection.innerHTML = divisions.map(createCardHtml).join("");
    } catch (error) {
        gridSection.innerHTML = "<p style=\"color:#32470C;font-weight:600;padding:12px;\">Data load korte problem hocche. destinations.json check korun.</p>";
        console.error("Destination data load error:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeMap();
    loadDivisions();
});
