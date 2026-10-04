let incidents = JSON.parse(localStorage.getItem("cyberIncidents")) || [];
const incidentForm = document.getElementById("incidentForm");
const incidentList = document.getElementById("incidentList");

const totalIncidents = document.getElementById("totalIncidents");
const highRiskIncidents = document.getElementById("highRiskIncidents");
const criticalIncidents = document.getElementById("criticalIncidents");
const resolvedIncidents = document.getElementById("resolvedIncidents");

function displayIncidents() {

    incidentList.innerHTML = "";

    if (incidents.length === 0) {

        incidentList.innerHTML = `
            <div class="empty-state">
                <div>🔍</div>

                <h3>No incidents recorded</h3>

                <p>
                    Report your first cybersecurity incident above.
                </p>
            </div>
        `;

        updateStatistics();
        return;
    }


    incidents.forEach((incident, index) => {

        const card = document.createElement("div");

        card.className = "incident-card";

        card.innerHTML = `

            <div class="incident-top">

                <div>
                    <h3>${escapeHTML(incident.name)}</h3>

                    <p class="incident-meta">
                        Type: ${escapeHTML(incident.type)}
                        • ${escapeHTML(incident.date)}
                    </p>
                </div>

                <span class="badge badge-${incident.risk.toLowerCase()}">
                    ${escapeHTML(incident.risk)}
                </span>

            </div>


            <p class="incident-description">
                ${escapeHTML(incident.description)}
            </p>


            <p class="incident-meta">
                Current Status:
                <strong>${escapeHTML(incident.status)}</strong>
            </p>


            <div class="incident-actions">

    <select
        class="status-select"
        onchange="changeStatus(${index}, this.value)"
    >

        <option value="Open"
            ${incident.status === "Open" ? "selected" : ""}>
            Open
        </option>

        <option value="Investigating"
            ${incident.status === "Investigating" ? "selected" : ""}>
            Investigating
        </option>

        <option value="Resolved"
            ${incident.status === "Resolved" ? "selected" : ""}>
            Resolved
        </option>

    </select>

    <button
    class="report-button"
    onclick="downloadIncidentReport(${index})"
    title="Download incident report"
>
    Report
</button>
    <button
        class="delete-button"
        onclick="deleteIncident(${index})"
        title="Remove incident"
    >
        ✕
    </button>

</div>

        `;

        incidentList.appendChild(card);
    });


    updateStatistics();
}



incidentForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("incidentName").value.trim();

    const type =
        document.getElementById("incidentType").value;

    const risk =
        document.getElementById("riskLevel").value;

    const status =
        document.getElementById("incidentStatus").value;

    const description =
        document.getElementById("description").value.trim();


    if (!name || !type || !risk || !status || !description) {

        alert("Please complete all incident fields.");

        return;
    }


    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleString();


    const newIncident = {

        id: Date.now(),

        name: name,

        type: type,

        risk: risk,

        status: status,

        description: description,

        date: formattedDate

    };


    incidents.unshift(newIncident);


    localStorage.setItem(
        "cyberIncidents",
        JSON.stringify(incidents)
    );


    incidentForm.reset();


    displayIncidents();


    document.getElementById("incidents").scrollIntoView({
        behavior: "smooth"
    });

});

function changeStatus(index, newStatus) {

    incidents[index].status = newStatus;


    // Save updated status
    localStorage.setItem(
        "cyberIncidents",
        JSON.stringify(incidents)
    );


    // Refresh dashboard
    displayIncidents();

}


function deleteIncident(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this incident?"
    );


    if (!confirmDelete) {
        return;
    }


    incidents.splice(index, 1);


    localStorage.setItem(
        "cyberIncidents",
        JSON.stringify(incidents)
    );


    displayIncidents();

}

function updateStatistics() {

    totalIncidents.textContent = incidents.length;


    const highRisk = incidents.filter(
        incident =>
            incident.risk === "High" ||
            incident.risk === "Critical"
    ).length;

    highRiskIncidents.textContent = highRisk;


    const critical = incidents.filter(
        incident =>
            incident.risk === "Critical"
    ).length;

    criticalIncidents.textContent = critical;


    const resolved = incidents.filter(
        incident =>
            incident.status === "Resolved"
    ).length;

    resolvedIncidents.textContent = resolved;
    // Risk Summary counts

const lowRisk = incidents.filter(
    incident =>
        incident.risk === "Low"
).length;

const mediumRisk = incidents.filter(
    incident =>
        incident.risk === "Medium"
).length;

const highRiskSummary = incidents.filter(
    incident =>
        incident.risk === "High"
).length;

const criticalRiskSummary = incidents.filter(
    incident =>
        incident.risk === "Critical"
).length;


document.getElementById("lowRiskCount").textContent = lowRisk;

document.getElementById("mediumRiskCount").textContent = mediumRisk;

document.getElementById("highRiskCountSummary").textContent =
    highRiskSummary;

document.getElementById("criticalRiskCountSummary").textContent =
    criticalRiskSummary;
}



function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


displayIncidents();

const evidenceItems = document.querySelectorAll(
    ".evidence-item input"
);


// Load saved checklist
const savedEvidence =
    JSON.parse(localStorage.getItem("evidenceChecklist")) || [];

evidenceItems.forEach((checkbox, index) => {

    checkbox.checked = savedEvidence[index] || false;

});

evidenceItems.forEach((checkbox, index) => {

    checkbox.addEventListener("change", function() {

        savedEvidence[index] = checkbox.checked;

        localStorage.setItem(
            "evidenceChecklist",
            JSON.stringify(savedEvidence)
        );

    });

});


const incidentSearch = document.getElementById("incidentSearch");

incidentSearch.addEventListener("input", function () {

    const searchText = incidentSearch.value.toLowerCase().trim();

    const filteredIncidents = incidents.filter(incident =>
        incident.name.toLowerCase().includes(searchText) ||
        incident.type.toLowerCase().includes(searchText)
    );

    displayFilteredIncidents(filteredIncidents);

});


function displayFilteredIncidents(filteredIncidents) {

    incidentList.innerHTML = "";

    if (filteredIncidents.length === 0) {

        incidentList.innerHTML = `
            <div class="empty-state">

                <div>🔍</div>

                <h3>No matching incidents</h3>

                <p>
                    Try searching by incident name or type.
                </p>

            </div>
        `;

        return;
    }


    filteredIncidents.forEach((incident) => {

        const originalIndex = incidents.indexOf(incident);

        const card = document.createElement("div");

        card.className = "incident-card";

        card.innerHTML = `

            <div class="incident-top">

                <div>

                    <h3>${escapeHTML(incident.name)}</h3>

                    <p class="incident-meta">
                        Type: ${escapeHTML(incident.type)}
                        • ${escapeHTML(incident.date)}
                    </p>

                </div>

                <span class="badge badge-${incident.risk.toLowerCase()}">
                    ${escapeHTML(incident.risk)}
                </span>

            </div>


            <p class="incident-description">
                ${escapeHTML(incident.description)}
            </p>


            <p class="incident-meta">
                Current Status:
                <strong>${escapeHTML(incident.status)}</strong>
            </p>


            <div class="incident-actions">

                <select
                    class="status-select"
                    onchange="changeStatus(${originalIndex}, this.value)"
                >

                    <option value="Open"
                        ${incident.status === "Open" ? "selected" : ""}>
                        Open
                    </option>

                    <option value="Investigating"
                        ${incident.status === "Investigating" ? "selected" : ""}>
                        Investigating
                    </option>

                    <option value="Resolved"
                        ${incident.status === "Resolved" ? "selected" : ""}>
                        Resolved
                    </option>

                </select>

                <button
               class="report-button"
               onclick="downloadIncidentReport(${originalIndex})"
             title="Download incident report"
                     >
                     Report
                  </button>
                
                  <button
                    class="delete-button"
                    onclick="deleteIncident(${originalIndex})"
                    title="Remove incident"
                >
                    ✕
                </button>

            </div>

        `;

        incidentList.appendChild(card);

    });

}

const clearSearch = document.getElementById("clearSearch");

clearSearch.addEventListener("click", function () {

    incidentSearch.value = "";

    displayIncidents();

});

function downloadIncidentReport(index) {

    const incident = incidents[index];

    const report = `
CYBER INCIDENT RESPONSE REPORT
========================================

Incident Name: ${incident.name}
Incident Type: ${incident.type}
Risk Level: ${incident.risk}
Status: ${incident.status}
Reported Date: ${incident.date}

Description:
${incident.description}

========================================
Generated by Cyber Incident Response Dashboard
`;

    const blob = new Blob(
        [report],
        { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
        `Incident_Report_${incident.id}.txt`;

    link.click();

    URL.revokeObjectURL(url);
}
