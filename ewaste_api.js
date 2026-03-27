document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("marketplaceCards");
    const statusDiv = document.getElementById("marketStatus");

    // Fetch live inventory from local Node.js backend
    fetch('http://localhost:3000/api/items')
        .then(response => {
            if(!response.ok) throw new Error('Network response failed');
            return response.json();
        })
        .then(items => {
            if(statusDiv) statusDiv.style.display = 'none';

            if (items.length === 0) {
                container.innerHTML = `<h3 style="color:var(--muted); text-align:center; width:100%; grid-column: 1/-1;">No E-Waste items are currently listed on the platform.</h3>`;
                return;
            }

            items.reverse().forEach((item, index) => {
                const card = document.createElement("div");
                card.className = "card fade-in delay-" + ((index % 3) + 1);
                
                // Prevent local file system mapping crash by injecting absolute API route
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
            
            // Re-trigger scroll observer for new items
            setTimeout(() => {
                const newCards = document.querySelectorAll('.card.fade-in');
                newCards.forEach(c => {
                    c.classList.add('visible'); // Simple reveal since they are at top of page
                });
            }, 100);
        })
        .catch(err => {
            console.error('Failed to load marketplace:', err);
            if(statusDiv) {
                statusDiv.innerHTML = `Backend server unreachable. Make sure you started the local Node.js server (<span style="color:var(--accent);">node server.js</span>).<br><br><b>Falling back to mock UI rendering.</b>`;
                statusDiv.style.color = '#ef4444';
            }
        });
});
