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

function createCardHtml(division) {
    const imageName = divisionImageMap[division.id] || defaultDivisionImage;
    const safeName = division.name || "Unknown";

    return `
        <a href="${division.id}.html" class="card">
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
    loadDivisions();
});
