async function loadAnalytics() {
  try {
    const [summary, profile, health] = await Promise.all([
      API.get('/analytics/summary'),
      API.get('/users/profile'),
      API.get('/health')
    ]);
    document.getElementById('analyticsStats').innerHTML = `
      <div class="stat">
        <div class="stat-value">${summary.totalItems}</div>
        <div class="stat-label">Items</div>
      </div>
      <div class="stat">
        <div class="stat-value">$${summary.totalValue.toLocaleString()}</div>
        <div class="stat-label">Value</div>
      </div>
      <div class="stat">
        <div class="stat-value">${summary.avgRating}</div>
        <div class="stat-label">Rating</div>
      </div>
      <div class="stat">
        <div class="stat-value" style="color:${health.status === 'ok' ? 'var(--accent)' : 'var(--red)'}">
          ${health.status === 'ok' ? 'OK' : 'FAIL'}
        </div>
        <div class="stat-label">Health</div>
      </div>`;
    // Category breakdown
    const categories = Object.entries(summary.categories);
    document.getElementById('breakdownChart').innerHTML = `
      <div style="width:100%">
        <div style="font-size:11px;color:var(--text2);margin-bottom:12px">Category Breakdown</div>
        ${categories.map(([cat, data]) => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span class="category-tag cat-${cat}" style="width:90px;text-align:center">${cat}</span>
            <div style="flex:1;background:var(--surface2);border-radius:3px;height:20px;position:relative">
              <div style="position:absolute;left:0;top:0;height:100%;border-radius:3px;background:var(--accent);width:${(data.count / summary.totalItems) * 100}%;opacity:0.7"></div>
            </div>
            <span style="font-family:var(--mono);font-size:11px;width:40px;text-align:right">${data.count}</span>
          </div>`).join('')}
      </div>`;
  } catch (e) {
    console.error('Analytics load failed:', e);
  }
}

async function loadTrends() {
  const period = document.getElementById('periodSelect').value;
  try {
    const data = await API.get(`/analytics/trends?period=${period}`);
    const maxViews = Math.max(...data.trend.map(t => t.views));
    document.getElementById('trendChart').innerHTML = `
      <div style="width:100%">
        <div style="font-size:11px;color:var(--text2);margin-bottom:8px">Views + Orders (${period})</div>
        <div style="display:flex;gap:2px;align-items:flex-end;height:140px">
          ${data.trend.map(t => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
              <div style="width:100%;display:flex;gap:1px;align-items:flex-end;height:120px">
                <div style="flex:1;background:var(--accent);border-radius:2px 2px 0 0;height:${(t.views / maxViews) * 100}%;opacity:0.8"></div>
                <div style="flex:1;background:var(--blue);border-radius:2px 2px 0 0;height:${(t.orders / maxViews) * 100 * 30}%;opacity:0.8"></div>
              </div>
              <span style="font-size:8px;color:var(--text2)">${t.date.slice(5)}</span>
            </div>`).join('')}
        </div>
        <div style="display:flex;gap:16px;margin-top:8px;font-size:10px;color:var(--text2)">
          <span><span style="display:inline-block;width:8px;height:8px;background:var(--accent);border-radius:2px;margin-right:4px"></span>Views</span>
          <span><span style="display:inline-block;width:8px;height:8px;background:var(--blue);border-radius:2px;margin-right:4px"></span>Orders</span>
        </div>
      </div>`;
  } catch (e) {
    document.getElementById('trendChart').textContent = 'Failed to load trends.';
  }
}

loadAnalytics();
loadTrends();
