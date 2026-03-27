document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("marketplaceCards");
    const statusDiv = document.getElementById("marketStatus");
    const searchInput = document.getElementById("searchInput");
    let allItems = [];

    const renderItems = (items) => {
        container.innerHTML = "";
        if (items.length === 0) {
            container.innerHTML = `<h3 style="color:var(--muted); text-align:center; width:100%; grid-column: 1/-1;">No E-Waste items match your search.</h3>`;
            return;
        }

        items.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "card fade-in delay-" + ((index % 3) + 1);
            
            const fullPhotoUrl = item.photoUrl ? `http://localhost:3000${item.photoUrl}` : null;
            const photoHtml = fullPhotoUrl 
                ? `<div class="market-img" style="background-image:url('${fullPhotoUrl}'); background-size:cover; background-position:center; background-color:transparent;"></div>`
                : `<div class="market-img">📦</div>`;

            card.innerHTML = `
                <div>
                    ${photoHtml}
                    <div class="market-badge">${item.serialNumber || 'No SN'}</div>
                    <h3>${item.itemName}</h3>
                    <p style="font-size: 13px; color: var(--muted); margin-bottom:10px;">${item.description}</p>
                    <p style="font-size: 12px; color: var(--accent); font-weight:600;">• Listed by ${item.listedBy}</p>
                    <div class="market-price">${item.itemPrice}</div>
                </div>
                <button class="buy-btn" onclick="alert('Contacting Seller: ${item.listedBy} has been notified of your interest.')">Claim & Contact Seller</button>
            `;
            container.appendChild(card);
        });

        setTimeout(() => {
            document.querySelectorAll('.card.fade-in').forEach(c => c.classList.add('visible'));
        }, 50);
    };

    if(searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = allItems.filter(item => 
                (item.itemName && item.itemName.toLowerCase().includes(query)) ||
                (item.description && item.description.toLowerCase().includes(query)) ||
                (item.serialNumber && item.serialNumber.toLowerCase().includes(query))
            );
            renderItems(filtered);
        });
    }

    // Fetch live inventory from local Node.js backend
    fetch('http://localhost:3000/api/items')
        .then(response => {
            if(!response.ok) throw new Error('Network response failed');
            return response.json();
        })
        .then(items => {
            if(statusDiv) statusDiv.style.display = 'none';
            allItems = items.reverse();
            renderItems(allItems);
        })
        .catch(err => {
            console.error('Failed to load marketplace:', err);
            if(statusDiv) {
                statusDiv.innerHTML = `Backend server unreachable. Make sure you started the local Node.js server (<span style="color:var(--accent);">node server.js</span>).<br><br><b>Falling back to mock UI rendering.</b>`;
                statusDiv.style.color = '#ef4444';
            }
        });
});
