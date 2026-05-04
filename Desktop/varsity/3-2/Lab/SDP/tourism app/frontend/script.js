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

const defaultDivisionImage = "bg picture.jpeg";

const divisionCoordinates = {
    dhaka: { latitude: 23.8103, longitude: 90.4125, label: "Dhaka" },
    chittagong: { latitude: 22.3569, longitude: 91.7832, label: "Chittagong" },
    sylhet: { latitude: 24.8949, longitude: 91.8687, label: "Sylhet" },
    rajshahi: { latitude: 24.3745, longitude: 88.6042, label: "Rajshahi" },
    khulna: { latitude: 22.8456, longitude: 89.5403, label: "Khulna" },
    barisal: { latitude: 22.7010, longitude: 90.3535, label: "Barisal" },
    rangpur: { latitude: 25.7439, longitude: 89.2752, label: "Rangpur" },
    mymensingh: { latitude: 24.7471, longitude: 90.4203, label: "Mymensingh" },
};

const weatherCodeLabels = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
};

const divisionTransportOptions = {
    dhaka: [
        {
            mode: "Bus",
            title: "Intercity bus routes",
            summary: "Best for flexible departures from Dhaka Sadarghat, Gabtoli, and Mohakhali.",
            details: "Use this for direct coach service to nearby tourist spots and district towns.",
            link: "https://www.shohoz.com/bus-tickets",
        },
        {
            mode: "Train",
            title: "Bangladesh Railway routes",
            summary: "Suitable for longer city-to-city travel when train lines are available.",
            details: "Check seat availability before travel and use railway booking or counter service.",
            link: "https://www.railway.gov.bd/",
        },
        {
            mode: "Air",
            title: "Domestic flight options",
            summary: "Best for faster travel when you want to save time between major cities.",
            details: "Use this if the destination has an airport or is connected through Dhaka.",
            link: "https://www.biman-airlines.com/",
        },
    ],
    chittagong: [
        {
            mode: "Bus",
            title: "Coastal intercity buses",
            summary: "Good for trips around Chattogram and nearby beach routes.",
            details: "Search coach services for Patenga, Cox's Bazar, and district links.",
            link: "https://www.shohoz.com/bus-tickets",
        },
        {
            mode: "Train",
            title: "Chattogram rail connections",
            summary: "Useful for travel to Dhaka and major rail-connected destinations.",
            details: "Rail travel is often easier for comfortable intercity movement.",
            link: "https://www.railway.gov.bd/",
        },
        {
            mode: "Air",
            title: "Flights via Chattogram",
            summary: "Good for fast domestic connections and seasonal tourist travel.",
            details: "Check availability for flights to and from Chattogram airport.",
            link: "https://www.biman-airlines.com/",
        },
    ],
    sylhet: [
        {
            mode: "Bus",
            title: "Hill-region bus service",
            summary: "Practical for Ratargul, Jaflong, and nearby sightseeing routes.",
            details: "Local and intercity buses usually cover the main tourist corridor.",
            link: "https://www.shohoz.com/bus-tickets",
        },
        {
            mode: "Train",
            title: "Sylhet rail line",
            summary: "Useful for travel to Dhaka and selected rail-linked stops.",
            details: "Check seasonal timing and seat availability before departure.",
            link: "https://www.railway.gov.bd/",
        },
        {
            mode: "Air",
            title: "Sylhet flight routes",
            summary: "Fastest option for visitors coming through Sylhet airport.",
            details: "Best when you want to avoid long road travel and save time.",
            link: "https://www.biman-airlines.com/",
        },
    ],
};

const defaultTransportOptions = [
    {
        mode: "Bus",
        title: "Bus route search",
        summary: "Search available coach services for this division.",
        details: "Ideal first choice when you want multiple departure times.",
        link: "https://www.shohoz.com/bus-tickets",
    },
    {
        mode: "Train",
        title: "Train route search",
        summary: "Check railway connections for intercity travel.",
        details: "Best when the destination is served by a rail line.",
        link: "https://www.railway.gov.bd/",
    },
    {
        mode: "Air",
        title: "Air route search",
        summary: "Check domestic flight availability for faster city-to-city travel.",
        details: "Useful for long-distance routes or when the division has an airport nearby.",
        link: "https://www.biman-airlines.com/",
    },
];

let destinationsCache = null;

function parseCost(costText) {
    const numericValue = Number.parseInt(String(costText || "").replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(numericValue) ? numericValue : 0;
}

function getBudgetBand(costValue) {
    if (costValue < 500) {
        return "low";
    }

    if (costValue <= 1500) {
        return "medium";
    }

    return "high";
}

function buildOpenStreetMapUrl(divisionName, spotName) {
    const query = [spotName, divisionName, "Bangladesh"].filter(Boolean).join(", ");
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
}

function getWeatherCodeLabel(code) {
    return weatherCodeLabels[code] || "Current conditions";
}

function getDivisionCoordinates(divisionId) {
    return divisionCoordinates[divisionId] || null;
}

// Get user's current location using Geolocation API
function getUserCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            (error) => {
                reject(new Error(`Geolocation error: ${error.message}`));
            }
        );
    });
}

// Build Google Maps routing URL from current location to destination
function buildGoogleMapsRoutingUrl(startLat, startLng, endLat, endLng, spotName) {
    return `https://www.google.com/maps/dir/${startLat},${startLng}/${endLat},${endLng}/?travelmode=driving`;
}

// Get best route using Google Maps Directions API (free tier via URL)
async function findBestRoutes(currentLat, currentLng, spotLat, spotLng, spotName) {
    try {
        const routingUrl = buildGoogleMapsRoutingUrl(currentLat, currentLng, spotLat, spotLng, spotName);
        return {
            googleMapsUrl: routingUrl,
            spotName: spotName,
            routeType: "Driving"
        };
    } catch (error) {
        console.error("Route finding error:", error);
        return null;
    }
}

// Get weather forecast for 7 days
async function getWeatherForecast(latitude, longitude) {
    try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", String(latitude));
        url.searchParams.set("longitude", String(longitude));
        url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum");
        url.searchParams.set("timezone", "auto");

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Weather forecast request failed (${response.status})`);
        }

        const payload = await response.json();
        return payload.daily || null;
    } catch (error) {
        console.error("Weather forecast error:", error);
        return null;
    }
}

function getTransportOptions(divisionId) {
    return divisionTransportOptions[divisionId] || defaultTransportOptions;
}

function renderTransportSection(division) {
    const transportTitleNode = document.getElementById("transportTitle");
    const transportDescriptionNode = document.getElementById("transportDescription");
    const transportGridNode = document.getElementById("transportGrid");

    if (!transportTitleNode || !transportDescriptionNode || !transportGridNode) {
        return;
    }

    transportTitleNode.textContent = `${division.name || "Selected division"} travel routes`;
    // Unified single-route card: opens Shohoz search prefilling destination for convenience
    transportDescriptionNode.textContent = "Search routes (bus, train, air) on Shohoz for this division.";

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const d = String(tomorrow.getDate()).padStart(2, '0');
    const defaultDate = `${y}-${m}-${d}`;

    function buildShohozHubUrl(destination, dateStr) {
        const params = new URLSearchParams();
        if (destination) params.set('to', destination);
        if (dateStr) params.set('date', dateStr);
        // default to bus search page which accepts 'to' and 'date'; user can switch mode on Shohoz
        return `https://www.shohoz.com/bus-tickets?${params.toString()}`;
    }

    const bookingUrl = buildShohozHubUrl(division.name || '', defaultDate);

    transportGridNode.innerHTML = `
        <article class="transport-card">
            <div class="transport-pill">Routes</div>
            <h3>Find routes & tickets on Shohoz</h3>
            <p>Search bus, train, and air options for travel to ${division.name || 'this division'} on Shohoz.</p>
            <p>We prefill the destination for convenience; use Shohoz to compare and book across transport modes.</p>
            <div style="display:flex;gap:8px;align-items:center;">
                <a class="transport-book-btn" href="${bookingUrl}" target="_blank" rel="noreferrer">Search routes on Shohoz</a>
            </div>
        </article>
    `;
}

async function loadDivisionWeather(division) {
    const weatherLocationNode = document.getElementById("weatherLocation");
    const weatherDescriptionNode = document.getElementById("weatherDescription");
    const weatherStatusNode = document.getElementById("weatherStatus");

    if (!weatherLocationNode || !weatherDescriptionNode || !weatherStatusNode) {
        return;
    }

    const coordinates = getDivisionCoordinates(division.id);

    if (!coordinates) {
        weatherLocationNode.textContent = division.name || "Selected division";
        weatherDescriptionNode.textContent = "Weather data is not configured for this division yet.";
        weatherStatusNode.textContent = "No data";
        return;
    }

    weatherStatusNode.textContent = "Loading";
    weatherLocationNode.textContent = `${coordinates.label} weather`;
    weatherDescriptionNode.textContent = "Fetching live weather from Open-Meteo...";

    try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", String(coordinates.latitude));
        url.searchParams.set("longitude", String(coordinates.longitude));
        url.searchParams.set("current", "temperature_2m,weather_code,wind_speed_10m");
        url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min");
        url.searchParams.set("timezone", "auto");

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Weather request failed (${response.status})`);
        }

        const payload = await response.json();
        const current = payload.current;

        if (!current) {
            throw new Error("Weather response missing current data");
        }

        const temperature = Math.round(Number(current.temperature_2m));
        const weatherLabel = getWeatherCodeLabel(current.weather_code);
        const windSpeed = Math.round(Number(current.wind_speed_10m));

        // Build forecast info for next 3 days
        let forecastInfo = `${weatherLabel}. Temp ${temperature}°C, wind ${windSpeed} km/h.`;
        
        if (payload.daily && payload.daily.time && payload.daily.time.length > 0) {
            const tomorrow = payload.daily.time[1];
            const tomorrowMax = payload.daily.temperature_2m_max[1];
            const tomorrowMin = payload.daily.temperature_2m_min[1];
            forecastInfo += ` Tomorrow: ${Math.round(tomorrowMin)}°C-${Math.round(tomorrowMax)}°C`;
        }

        weatherLocationNode.textContent = `${coordinates.label} weather`;
        weatherDescriptionNode.textContent = forecastInfo;
        weatherStatusNode.textContent = `${temperature}°C`;
    } catch (error) {
        weatherLocationNode.textContent = `${coordinates.label} weather`;
        weatherDescriptionNode.textContent = "Live weather is unavailable right now. Please try again later.";
        weatherStatusNode.textContent = "Error";
        console.error("Weather load error:", error);
    }
}

async function loadDestinations() {
    if (Array.isArray(destinationsCache)) {
        return destinationsCache;
    }

    const response = await fetch("destinations.json");

    if (!response.ok) {
        throw new Error(`Failed to load destinations.json (${response.status})`);
    }

    const destinations = await response.json();

    if (!Array.isArray(destinations)) {
        throw new Error("Invalid JSON format: expected an array of divisions");
    }

    destinationsCache = destinations;
    return destinations;
}

function getDivisionSummary(division) {
    const spotCosts = (division.spots || []).map((spot) => parseCost(spot.cost)).filter((value) => value > 0);
    const cheapest = spotCosts.length ? Math.min(...spotCosts) : 0;
    const mostExpensive = spotCosts.length ? Math.max(...spotCosts) : 0;

    return {
        spotCount: (division.spots || []).length,
        cheapest,
        mostExpensive,
    };
}

// Flatten all spots from all divisions for spot-based search
function flattenAllSpots(divisions) {
    const allSpots = [];
    divisions.forEach(division => {
        (division.spots || []).forEach(spot => {
            allSpots.push({
                ...spot,
                division_id: division.id,
                division_name: division.name,
                division_image: divisionImageMap[division.id] || defaultDivisionImage
            });
        });
    });
    return allSpots;
}

// Create spot card for search results
function createSearchSpotCardHtml(spot) {
    const costValue = parseCost(spot.cost);
    const budgetBand = getBudgetBand(costValue);
    const mapUrl = buildOpenStreetMapUrl(spot.division_name, spot.spot_name);
    const spotId = `spot-${spot.spot_name.replace(/\s+/g, '-').toLowerCase()}`;

    return `
        <article class="spot-card-extended">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">
                <h3 style="margin:0;">${spot.spot_name || "Unknown Spot"}</h3>
                <span style="background:#32470C;color:white;padding:4px 8px;border-radius:4px;font-size:12px;white-space:nowrap;">${spot.division_name}</span>
            </div>
            <div class="spot-details-list">
                <p><strong>Cost:</strong> ${spot.cost || "N/A"}</p>
                <p><strong>Hotel:</strong> ${spot.hotel || "N/A"}</p>
                <p><strong>Budget:</strong> ${budgetBand}</p>
                <p><strong>Maps:</strong> 
                    <a href="${mapUrl}" target="_blank" rel="noreferrer" style="margin-right:8px;">OpenStreetMap</a>
                    <button class="get-route-btn" data-spot-name="${spot.spot_name}" data-division="${spot.division_name}" style="padding:4px 8px;background:#32470C;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;text-decoration:none;">📍 Route</button>
                </p>
            </div>
        </article>
    `;
}

// Update renderHomeSummary for spots
function renderHomeSpotsSummary(total, visible) {
    const summaryNode = document.getElementById("resultsSummary");

    if (!summaryNode) {
        return;
    }

    summaryNode.textContent = `${visible} of ${total} spots found`;
}

function createDivisionCardHtml(division) {
    const imageName = divisionImageMap[division.id] || defaultDivisionImage;
    const safeName = division.name || "Unknown";
    const summary = getDivisionSummary(division);

    return `
        <a href="division.html?division=${encodeURIComponent(division.id)}" class="card">
            <div class="card-image">
                <img src="${imageName}" alt="${safeName}" onerror="this.onerror=null;this.src='${defaultDivisionImage}';">
                <div class="overlay"></div>
            </div>
            <div class="card-content">
                <h3>${safeName}</h3>
            </div>
        </a>
    `;
}

function matchesDivisionBudget(division, selectedBudget) {
    if (selectedBudget === "all") {
        return true;
    }

    const summary = getDivisionSummary(division);
    if (!summary.cheapest) {
        return false;
    }

    return getBudgetBand(summary.cheapest) === selectedBudget;
}

function renderHomeSummary(total, visible) {
    const summaryNode = document.getElementById("resultsSummary");

    if (!summaryNode) {
        return;
    }

    summaryNode.textContent = `${visible} of ${total} divisions shown`;
}

function renderHomeGrid(divisions) {
    const gridSection = document.getElementById("divisionGrid");
    const searchInput = document.getElementById("divisionSearch");
    const budgetFilter = document.getElementById("budgetFilter");
    const sortSelect = document.getElementById("divisionSort");

    if (!gridSection) {
        return;
    }

    // Flatten all spots from all divisions
    const allSpots = flattenAllSpots(divisions);

    const applyFilters = () => {
        const searchValue = String(searchInput?.value || "").trim().toLowerCase();
        const selectedBudget = String(budgetFilter?.value || "all");
        const selectedSort = String(sortSelect?.value || "name");

        // Filter spots by name, place, or division
        let filtered = allSpots.filter((spot) => {
            const matchesName = !searchValue || 
                String(spot.spot_name || "").toLowerCase().includes(searchValue) ||
                String(spot.division_name || "").toLowerCase().includes(searchValue);
            
            const matchesBudget = selectedBudget === "all" || 
                getBudgetBand(parseCost(spot.cost)) === selectedBudget;
            
            return matchesName && matchesBudget;
        });

        // Sort spots
        filtered = filtered.sort((left, right) => {
            if (selectedSort === "cost-low") {
                return parseCost(left.cost) - parseCost(right.cost);
            }

            if (selectedSort === "cost-high") {
                return parseCost(right.cost) - parseCost(left.cost);
            }

            if (selectedSort === "division") {
                return String(left.division_name || "").localeCompare(String(right.division_name || ""));
            }

            return String(left.spot_name || "").localeCompare(String(right.spot_name || ""));
        });

        gridSection.innerHTML = filtered.length
            ? filtered.map(createSearchSpotCardHtml).join("")
            : '<div class="empty-state">No spots match your search. Try a different search term.</div>';

        renderHomeSpotsSummary(allSpots.length, filtered.length);
        
        // Add route button event listeners
        const routeButtons = gridSection.querySelectorAll('.get-route-btn');
        routeButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const spotName = btn.getAttribute('data-spot-name');
                const divisionName = btn.getAttribute('data-division');
                
                btn.textContent = '🔄 Finding...';
                btn.disabled = true;
                
                try {
                    const userLocation = await getUserCurrentLocation();
                    
                    // Get division coordinates
                    const division = divisions.find(d => d.name === divisionName);
                    if (!division) throw new Error('Division not found');
                    
                    const coords = getDivisionCoordinates(division.id);
                    if (!coords) throw new Error('Coordinates not found');
                    
                    const routeUrl = buildGoogleMapsRoutingUrl(
                        userLocation.latitude,
                        userLocation.longitude,
                        coords.latitude,
                        coords.longitude,
                        `${spotName}, ${divisionName}`
                    );
                    
                    window.open(routeUrl, '_blank');
                    btn.textContent = '📍 Route';
                    btn.disabled = false;
                } catch (error) {
                    alert('Could not get your location or find route. Please enable location services.');
                    console.error('Route error:', error);
                    btn.textContent = '📍 Route';
                    btn.disabled = false;
                }
            });
        });
    };

    searchInput?.addEventListener("input", applyFilters);
    budgetFilter?.addEventListener("change", applyFilters);
    sortSelect?.addEventListener("change", applyFilters);

    applyFilters();
}

function createSpotCardHtml(spot) {
    const costValue = parseCost(spot.cost);
    const budgetBand = getBudgetBand(costValue);
    const mapUrl = buildOpenStreetMapUrl(spot.division_name, spot.spot_name);

    return `
        <article class="spot-card-extended">
            <h3>${spot.spot_name || "Unknown Spot"}</h3>
            <div class="spot-details-list">
                <p><strong>Cost:</strong> ${spot.cost || "N/A"}</p>
                <p><strong>Hotel:</strong> ${spot.hotel || "N/A"}</p>
                <p><strong>Budget:</strong> ${budgetBand}</p>
                <p><strong>Maps:</strong> 
                    <a href="${mapUrl}" target="_blank" rel="noreferrer" style="margin-right:8px;">OpenStreetMap</a>
                    <button class="get-route-btn-detail" data-spot-name="${spot.spot_name}" style="padding:4px 8px;background:#32470C;color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;text-decoration:none;">📍 Route</button>
                </p>
            </div>
        </article>
    `;
}

function renderDivisionDetail(division) {
    const titleNode = document.getElementById("divisionName");
    const metaNode = document.getElementById("divisionMeta");
    const statsNode = document.getElementById("divisionStats");
    const spotGrid = document.getElementById("spotGrid");
    const spotSummary = document.getElementById("spotSummary");
    const searchInput = document.getElementById("spotSearch");
    const budgetFilter = document.getElementById("spotBudgetFilter");
    const sortSelect = document.getElementById("spotSort");

    if (!titleNode || !metaNode || !statsNode || !spotGrid || !spotSummary) {
        return;
    }

    const summary = getDivisionSummary(division);
    titleNode.textContent = division.name || "Division Detail";
    metaNode.textContent = `${summary.spotCount} tourist spots, cheapest trip starts at ${summary.cheapest || "N/A"} BDT.`;

    statsNode.innerHTML = `
        <div class="stat-card">
            <span>Spots</span>
            <strong>${summary.spotCount}</strong>
        </div>
        <div class="stat-card">
            <span>Cheapest</span>
            <strong>${summary.cheapest || 0}</strong>
        </div>
        <div class="stat-card">
            <span>Highest</span>
            <strong>${summary.mostExpensive || 0}</strong>
        </div>
        <div class="stat-card">
            <span>Division</span>
            <strong>${division.name || "N/A"}</strong>
        </div>
    `;

    const applyFilters = () => {
        const searchValue = String(searchInput?.value || "").trim().toLowerCase();
        const selectedBudget = String(budgetFilter?.value || "all");
        const selectedSort = String(sortSelect?.value || "name");

        let filtered = (division.spots || []).filter((spot) => {
            const matchesName = !searchValue || String(spot.spot_name || "").toLowerCase().includes(searchValue);
            const matchesBudget = selectedBudget === "all" || getBudgetBand(parseCost(spot.cost)) === selectedBudget;
            return matchesName && matchesBudget;
        });

        filtered = filtered.sort((left, right) => {
            if (selectedSort === "cost-low") {
                return parseCost(left.cost) - parseCost(right.cost);
            }

            if (selectedSort === "cost-high") {
                return parseCost(right.cost) - parseCost(left.cost);
            }

            return String(left.spot_name || "").localeCompare(String(right.spot_name || ""));
        });

        spotGrid.innerHTML = filtered.length
            ? filtered.map(createSpotCardHtml).join("")
            : '<div class="empty-state">No tourist spots match your filters.</div>';

        spotSummary.textContent = `${filtered.length} of ${(division.spots || []).length} spots shown`;
        
        // Add route button event listeners for detail page
        const routeButtons = spotGrid.querySelectorAll('.get-route-btn-detail');
        routeButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const spotName = btn.getAttribute('data-spot-name');
                
                btn.textContent = '🔄 Finding...';
                btn.disabled = true;
                
                try {
                    const userLocation = await getUserCurrentLocation();
                    const coords = getDivisionCoordinates(division.id);
                    
                    if (!coords) throw new Error('Coordinates not found');
                    
                    const routeUrl = buildGoogleMapsRoutingUrl(
                        userLocation.latitude,
                        userLocation.longitude,
                        coords.latitude,
                        coords.longitude,
                        `${spotName}, ${division.name}`
                    );
                    
                    window.open(routeUrl, '_blank');
                    btn.textContent = '📍 Route';
                    btn.disabled = false;
                } catch (error) {
                    alert('Could not get your location or find route. Please enable location services.');
                    console.error('Route error:', error);
                    btn.textContent = '📍 Route';
                    btn.disabled = false;
                }
            });
        });
    };

    searchInput?.addEventListener("input", applyFilters);
    budgetFilter?.addEventListener("change", applyFilters);
    sortSelect?.addEventListener("change", applyFilters);

    applyFilters();
}

function createCardHtml(division) {
    return createDivisionCardHtml(division);
}

function initializeMap(division) {
    const mapContainer = document.getElementById("divisionMap");
    
    if (!mapContainer) {
        return;
    }

    const divisionId = division.id.toLowerCase();
    const coords = getDivisionCoordinates(divisionId);

    if (!coords) {
        console.error("Coordinates not found for division:", divisionId);
        mapContainer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-size:16px;">Location data not available</div>';
        return;
    }

    // Create Google Maps link
    const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(coords.label)}/@${coords.latitude},${coords.longitude},11z`;

    // Render map section with location and routing options
    mapContainer.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:12px;height:100%;width:100%;">
            <a href="${googleMapsUrl}" target="_blank" rel="noreferrer" 
               style="display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;text-decoration:none;background:linear-gradient(135deg, #32470C 0%, #455A17 100%);border-radius:16px;color:white;padding:20px;box-shadow:0 8px 20px rgba(50, 71, 12, 0.3);transition:all 0.3s ease;cursor:pointer;">
                <div style="font-size:20px;font-weight:700;margin-bottom:8px;text-align:center;">
                    📍 View on Map
                </div>
                <div style="font-size:13px;opacity:0.9;text-align:center;">
                    See ${coords.label} location & nearby places
                </div>
            </a>
            <button id="getCurrentLocationBtn" style="padding:12px 20px;background:#32470C;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;transition:all 0.3s ease;">
                📍 Use My Location & Find Routes
            </button>
        </div>
    `;
    
    // Add current location handler
    const currentLocationBtn = mapContainer.querySelector('#getCurrentLocationBtn');
    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', async () => {
            currentLocationBtn.textContent = '🔄 Finding your location...';
            currentLocationBtn.disabled = true;
            
            try {
                const userLocation = await getUserCurrentLocation();
                const routeUrl = buildGoogleMapsRoutingUrl(
                    userLocation.latitude,
                    userLocation.longitude,
                    coords.latitude,
                    coords.longitude,
                    coords.label
                );
                window.open(routeUrl, '_blank');
                currentLocationBtn.textContent = '📍 Use My Location & Find Routes';
                currentLocationBtn.disabled = false;
            } catch (error) {
                alert('Could not get your location. Please enable location services.');
                console.error('Geolocation error:', error);
                currentLocationBtn.textContent = '📍 Use My Location & Find Routes';
                currentLocationBtn.disabled = false;
            }
        });
        
        currentLocationBtn.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 16px rgba(50, 71, 12, 0.3)';
        };
        currentLocationBtn.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };
    }
    
    // Add hover effect to map link
    const link = mapContainer.querySelector('a');
    if (link) {
        link.onmouseover = function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 12px 28px rgba(50, 71, 12, 0.4)';
        };
        link.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 20px rgba(50, 71, 12, 0.3)';
        };
    }
}

async function loadDivisions() {
    const gridSection = document.getElementById("divisionGrid");

    if (!gridSection) {
        return;
    }

    try {
        const divisions = await loadDestinations();
        renderHomeGrid(divisions);
    } catch (error) {
        gridSection.innerHTML = "<p style=\"color:#32470C;font-weight:600;padding:12px;\">Data load korte problem hocche. destinations.json check korun.</p>";
        console.error("Destination data load error:", error);
    }
}

async function loadDivisionDetailPage() {
    const spotGrid = document.getElementById("spotGrid");

    if (!spotGrid) {
        return;
    }

    try {
        const divisions = await loadDestinations();
        const params = new URLSearchParams(window.location.search);
        const divisionId = params.get("division") || params.get("id");
        const division = divisions.find((item) => item.id === divisionId) || divisions[0];

        if (!division) {
            spotGrid.innerHTML = '<div class="empty-state">No division data found.</div>';
            return;
        }

        renderDivisionDetail(division);
        await loadDivisionWeather(division);
        renderTransportSection(division);
        initializeMap(division);
    } catch (error) {
        spotGrid.innerHTML = '<div class="empty-state">Failed to load division details.</div>';
        console.error("Division detail load error:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadDivisions();
    loadDivisionDetailPage();
});
