const divisionImageMap = {
    dhaka: "/assets/images/orce.png.jpeg",
    chittagong: "/assets/images/cox.jpeg",
    sylhet: "/assets/images/sylhet.jpeg",
    khulna: "/assets/images/khulna.jpeg",
    rajshahi: "/assets/images/rajshahi.jpeg",
    barisal: "/assets/images/barisal.jpeg",
    rangpur: "/assets/images/rangpur.jpeg",
    mymensingh: "/assets/images/Mymensingh.jpeg"
};

const defaultDivisionImage = "/assets/images/bg-picture.jpeg";

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

async function loadDestinations() {
    if (Array.isArray(destinationsCache)) {
        return destinationsCache;
    }

    const response = await fetch("/data/destinations.json");

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

function createDivisionCardHtml(division) {
    const imageName = divisionImageMap[division.id] || defaultDivisionImage;
    const safeName = division.name || "Unknown";
    const summary = getDivisionSummary(division);

    return `
        <a href="../divisions/division.html?division=${encodeURIComponent(division.id)}" class="card">
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

    const applyFilters = () => {
        const searchValue = String(searchInput?.value || "").trim().toLowerCase();
        const selectedBudget = String(budgetFilter?.value || "all");
        const selectedSort = String(sortSelect?.value || "name");

        let filtered = divisions.filter((division) => {
            const matchesName = !searchValue || String(division.name || "").toLowerCase().includes(searchValue);
            const matchesBudget = matchesDivisionBudget(division, selectedBudget);
            return matchesName && matchesBudget;
        });

        filtered = filtered.sort((left, right) => {
            if (selectedSort === "spots") {
                return getDivisionSummary(right).spotCount - getDivisionSummary(left).spotCount;
            }

            if (selectedSort === "cheapest") {
                return getDivisionSummary(left).cheapest - getDivisionSummary(right).cheapest;
            }

            return String(left.name || "").localeCompare(String(right.name || ""));
        });

        gridSection.innerHTML = filtered.length
            ? filtered.map(createDivisionCardHtml).join("")
            : '<div class="empty-state">No divisions match your search.</div>';

        renderHomeSummary(divisions.length, filtered.length);
    };

    searchInput?.addEventListener("input", applyFilters);
    budgetFilter?.addEventListener("change", applyFilters);
    sortSelect?.addEventListener("change", applyFilters);

    applyFilters();
}

function createSpotCardHtml(spot) {
    const costValue = parseCost(spot.cost);
    const budgetBand = getBudgetBand(costValue);

    return `
        <article class="spot-card-extended">
            <h3>${spot.spot_name || "Unknown Spot"}</h3>
            <div class="spot-details-list">
                <p><strong>Cost:</strong> ${spot.cost || "N/A"}</p>
                <p><strong>Hotel:</strong> ${spot.hotel || "N/A"}</p>
                <p><strong>Budget:</strong> ${budgetBand}</p>
                <p><strong>Map:</strong> <a href="${spot.map_url || "#"}" target="_blank" rel="noreferrer">Open route</a></p>
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
    };

    searchInput?.addEventListener("input", applyFilters);
    budgetFilter?.addEventListener("change", applyFilters);
    sortSelect?.addEventListener("change", applyFilters);

    applyFilters();
}

function createCardHtml(division) {
    return createDivisionCardHtml(division);
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
    } catch (error) {
        spotGrid.innerHTML = '<div class="empty-state">Failed to load division details.</div>';
        console.error("Division detail load error:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadDivisions();
    loadDivisionDetailPage();
});
