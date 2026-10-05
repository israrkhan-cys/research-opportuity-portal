
async function loadOpportunities() {
    try {
        const response = await fetch('api/opportunities');
        const opportunities = await response.json();
        const tableBody = document.getElementById('opportunities-table-body');
        tableBody.innerHTML = ''; // Clear existing rows

        opportunities.forEach(opportunity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${opportunity.id}</td>
                <td>${opportunity.research_title}</td>
                <td>${opportunity.research_description}</td>
                <td>${opportunity.research_area}</td>
                <td>${opportunity.faculty_name}</td>
                <td>${opportunity.department}</td>
                <td>${opportunity.required_skills}</td>
                <td>${opportunity.available_positions}</td>
                <td>${opportunity.application_deadline}</td>
                <td>${opportunity.status}</td>
            `;
            tableBody.appendChild(row);
        }); 
    } catch (error) {
        console.error('Error loading opportunities:', error);
    }
}


// Call the function to load opportunities when the page loads
loadOpportunities();
