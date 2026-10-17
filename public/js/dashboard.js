async function loadDashboard() {
  try {
    const [analytics, items, profile] = await Promise.all([
      API.get('/analytics/summary'),
      API.get('/items?limit=8&sort=rating'),
      API.get('/users/profile')
    ]);
    // Stats
    document.getElementById('stats').innerHTML = `
      <div class="stat">
        <div class="stat-value">${analytics.totalItems}</div>
        <div class="stat-label">Total Items</div>
      </div>
      <div class="stat">
        <div class="stat-value">$${analytics.totalValue.toLocaleString()}</div>
        <div class="stat-label">Inventory Value</div>
      </div>
      <div class="stat">
        <div class="stat-value">${analytics.avgRating}</div>
        <div class="stat-label">Avg Rating</div>
      </div>
      <div class="stat">
        <div class="stat-value">${analytics.lowStock}</div>
        <div class="stat-label">Low Stock</div>
        <div class="stat-change down">${analytics.lowStock} items below 20 units</div>
      </div>`;
    // Recent items table
    document.getElementById('recentItems').innerHTML = items.items.map(i => `
      <tr>
        <td>${i.name}</td>
        <td><span class="category-tag cat-${i.category}">${i.category}</span></td>
        <td class="price">$${i.price.toFixed(2)}</td>
        <td class="stock ${i.stock < 20 ? 'low' : ''}">${i.stock}</td>
        <td class="rating">${i.rating}</td>
      </tr>`).join('');
    // Trend chart placeholder
    const trends = await API.get('/analytics/trends?period=7d');
    const maxViews = Math.max(...trends.trend.map(t => t.views));
    document.getElementById('trendChart').innerHTML = `
      <div style="width:100%">
        <div style="font-size:11px;color:var(--text2);margin-bottom:8px">Page Views (7 days)</div>
        <div style="display:flex;gap:4px;align-items:flex-end;height:120px">
          ${trends.trend.map(t => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
              <div style="width:100%;background:var(--accent);border-radius:3px 3px 0 0;height:${(t.views / maxViews) * 100}%;opacity:0.8"></div>
              <span style="font-size:9px;color:var(--text2)">${t.date.slice(5)}</span>
            </div>`).join('')}
        </div>
      </div>`;
  } catch (e) {
    console.error('Dashboard load failed:', e);
  }
}
loadDashboard();
