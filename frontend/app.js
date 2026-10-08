function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function formatDate(value) {
    if (!value) return 'Not specified';
    return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

async function getOpportunities() {
    const response = await fetch('/api/opportunities');
    if (response.status === 404) return [];
    if (!response.ok) throw new Error('Failed to load opportunities');
    return response.json();
}

function renderRows(opportunities) {
    const tableBody = document.getElementById('opportunities-table-body');
    const message = document.getElementById('opportunities-message');
    if (!tableBody || !message) return;

    const status = document.getElementById('status-filter')?.value || 'all';
    const filtered = opportunities.filter(opportunity => {
        return status === 'all' || opportunity.status === status;
    });

    tableBody.innerHTML = filtered.map(opportunity => `
        <tr>
            <td>#${escapeHtml(opportunity.id)}</td>
            <td class="title-cell">${escapeHtml(opportunity.research_title)}</td>
            <td class="description-cell">${escapeHtml(opportunity.research_description)}</td>
            <td>${escapeHtml(opportunity.faculty_name)}<br><span class="muted">${escapeHtml(opportunity.department)}</span></td>
            <td>${escapeHtml(opportunity.required_skills)}</td>
            <td>${escapeHtml(opportunity.available_positions)}</td>
            <td>${formatDate(opportunity.application_deadline)}</td>
            <td><span class="status ${opportunity.status === 'Closed' ? 'closed' : ''}">${escapeHtml(opportunity.status)}</span></td>
            <td><div class="actions"><a class="button button-small view-btn" href="view.html?id=${encodeURIComponent(opportunity.id)}">View</a><a class="button button-small" href="create.html?id=${encodeURIComponent(opportunity.id)}">Edit</a><button class="delete-btn" data-id="${escapeHtml(opportunity.id)}">Delete</button></div></td>
        </tr>
    `).join('');

    message.hidden = filtered.length > 0;
    message.textContent = opportunities.length === 0
        ? 'No opportunities have been posted yet.'
        : 'No opportunities match your filters.';
}


async function loadOpportunities() {
    try {
        const opportunities = await getOpportunities();
        window.opportunities = opportunities;
        renderRows(opportunities);
    } catch (error) {
        console.error(error);
        const message = document.getElementById('opportunities-message');
        if (message) {
            message.hidden = false;
            message.className = 'message error-message';
            message.textContent = 'We could not load opportunities. Please refresh and try again.';
        }
    }
}

async function loadOpportunityDetail() {
    const detail = document.getElementById('opportunity-detail');
    if (!detail) return;
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
        detail.innerHTML = '<p class="message error-message">No opportunity was selected.</p>';
        return;
    }

    try {
        const response = await fetch(`/api/opportunities/${encodeURIComponent(id)}`);
        if (!response.ok) throw new Error('Opportunity not found');
        const opportunity = await response.json();
        const statusClass = opportunity.status === 'Closed' ? 'closed' : '';
        detail.innerHTML = `
            <p class="eyebrow">Opportunity #${escapeHtml(opportunity.id)}</p>
            <h1 class="detail-title">${escapeHtml(opportunity.research_title)}</h1>
            <div class="detail-grid">
                <div class="detail-item full"><span class="detail-label">About this research</span><p class="detail-value">${escapeHtml(opportunity.research_description)}</p></div>
                <div class="detail-item"><span class="detail-label">Research area</span><p class="detail-value">${escapeHtml(opportunity.research_area)}</p></div>
                <div class="detail-item"><span class="detail-label">Faculty lead</span><p class="detail-value">${escapeHtml(opportunity.faculty_name)}</p></div>
                <div class="detail-item"><span class="detail-label">Department</span><p class="detail-value">${escapeHtml(opportunity.department)}</p></div>
                <div class="detail-item"><span class="detail-label">Required skills</span><p class="detail-value">${escapeHtml(opportunity.required_skills)}</p></div>
                <div class="detail-item"><span class="detail-label">Positions available</span><p class="detail-value">${escapeHtml(opportunity.available_positions)}</p></div>
                <div class="detail-item"><span class="detail-label">Application deadline</span><p class="detail-value">${formatDate(opportunity.application_deadline)}</p></div>
                <div class="detail-item"><span class="detail-label">Status</span><p class="detail-value"><span class="status ${statusClass}">${escapeHtml(opportunity.status)}</span></p></div>
            </div>`;
    } catch (error) {
        console.error(error);
        detail.innerHTML = '<p class="message error-message">This opportunity could not be found.</p>';
    }
}

async function setupForm() {
    const form = document.getElementById('create-opportunity-form');
    if (!form) return;
    const editId = new URLSearchParams(window.location.search).get('id');
    const submitButton = form.querySelector('button[type="submit"]');

    if (editId) {
        const formHeading = document.getElementById('form-heading');
        if (formHeading) {
            formHeading.textContent = 'Update a research opportunity.';
        }
        if (submitButton) {
            submitButton.textContent = 'Save changes';
        }
        try {
            const response = await fetch(`/api/opportunities/${encodeURIComponent(editId)}`);
            if (!response.ok) throw new Error('Opportunity not found');
            const data = await response.json();
            const formValues = {
                research_title: data.research_title || '',
                research_description: data.research_description || '',
                research_area: data.research_area || '',
                faculty_name: data.faculty_name || '',
                department: data.department || '',
                required_skills: data.required_skills || '',
                available_positions: data.available_positions ?? '',
                application_deadline: data.application_deadline || '',
                status: data.status || 'Open'
            };

            Object.entries(formValues).forEach(([key, value]) => {
                const field = form.elements.namedItem(key);
                if (field) {
                    field.value = value ?? '';
                }
            });
        } catch (error) {
            console.error(error);
            alert('This opportunity could not be loaded.');
        }
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = editId ? 'Saving...' : 'Publishing...';
        const opportunityData = Object.fromEntries(new FormData(form).entries());
        opportunityData.available_positions = Number(opportunityData.available_positions);

        try {
            const response = await fetch(editId ? `/api/opportunities/${editId}` : '/api/opportunities', {
                method: editId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(opportunityData)
            });
            if (!response.ok) throw new Error('Failed to save opportunity');
            window.location.href = 'index.html';
        } catch (error) {
            console.error(error);
            alert('Failed to save opportunity. Please check the form and try again.');
            submitButton.disabled = false;
            submitButton.textContent = editId ? 'Save changes' : 'Publish opportunity';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadOpportunityDetail();
    setupForm();
    loadOpportunities();
    document.getElementById('status-filter')?.addEventListener('change', () => renderRows(window.opportunities || []));
});

document.addEventListener('click', async event => {
    const deleteButton = event.target.closest('.delete-btn');
    if (!deleteButton || !confirm('Delete this research opportunity?')) return;
    deleteButton.disabled = true;
    try {
        const response = await fetch(`/api/opportunities/${encodeURIComponent(deleteButton.dataset.id)}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete opportunity');
        await loadOpportunities();
    } catch (error) {
        console.error(error);
        alert('Failed to delete opportunity.');
        deleteButton.disabled = false;
    }
});
