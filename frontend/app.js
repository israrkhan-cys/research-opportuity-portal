async function loadOpportunities() {
    const tableBody = document.getElementById('opportunities-table-body');

    // Do not run this on the create/edit page
    if (!tableBody) return;

    try {
        const response = await fetch('/api/opportunities');

        if (!response.ok) {
            throw new Error('Failed to load opportunities');
        }

        const opportunities = await response.json();
        tableBody.innerHTML = '';

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
                <td>
                    <a href="create.html?id=${opportunity.id}">Edit</a>
                    <button class="delete-btn" data-id="${opportunity.id}">
                        Delete
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading opportunities:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('create-opportunity-form');

    if (form) {
        const params = new URLSearchParams(window.location.search);
        const editId = params.get('id');
        const submitButton = form.querySelector('button[type="submit"]');

        if (editId) {
            try {
                const response = await fetch(`/api/opportunities/${editId}`);

                if (!response.ok) {
                    throw new Error('Opportunity not found');
                }

                const data = await response.json();

                form.elements['research_title'].value = data.research_title || '';
                form.elements['research_description'].value = data.research_description || '';
                form.elements['research_area'].value = data.research_area || '';
                form.elements['faculty_name'].value = data.faculty_name || '';
                form.elements['department'].value = data.department || '';
                form.elements['required_skills'].value = data.required_skills || '';
                form.elements['available_positions'].value = data.available_positions || '';
                form.elements['application_deadline'].value = data.application_deadline || '';
                form.elements['status'].value = data.status || '';

                if (submitButton) {
                    submitButton.textContent = 'Update';
                }
            } catch (error) {
                console.error('Error loading opportunity:', error);
            }
        }

        form.addEventListener('submit', async event => {
            event.preventDefault();

            const formData = new FormData(form);
            const opportunityData = Object.fromEntries(formData.entries());

            opportunityData.available_positions = parseInt(
                opportunityData.available_positions,
                10
            );

            const url = editId
                ? `/api/opportunities/${editId}`
                : '/api/opportunities';

            const method = editId ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(opportunityData)
                });

                if (!response.ok) {
                    throw new Error('Failed to save opportunity');
                }

                alert(editId
                    ? 'Opportunity updated successfully!'
                    : 'Opportunity created successfully!'
                );

                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error saving opportunity:', error);
                alert('Failed to save opportunity.');
            }
        });
    }

    await loadOpportunities();
});

document.addEventListener('click', async event => {
    if (!event.target.classList.contains('delete-btn')) {
        return;
    }

    const opportunityId = event.target.dataset.id;

    if (!confirm('Confirm delete?')) {
        return;
    }

    try {
        const response = await fetch(`/api/opportunities/${opportunityId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete opportunity');
        }

        alert('Opportunity deleted successfully!');
        await loadOpportunities();
    } catch (error) {
        console.error('Error deleting opportunity:', error);
        alert('Failed to delete opportunity.');
    }
});


loadOpportunities();