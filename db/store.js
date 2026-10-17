const items = new Map();
let nextId = 1;

function seed() {
  const categories = ['electronics', 'furniture', 'clothing', 'books', 'sports'];
  const names = [
    'Wireless Headphones', 'Ergonomic Chair', 'Cotton T-Shirt', 'Design Patterns',
    'Yoga Mat', 'Mechanical Keyboard', 'Standing Desk', 'Denim Jacket',
    'Clean Code', 'Resistance Bands', 'Monitor Arm', 'Bookshelf',
    'Running Shoes', 'JavaScript Guide', 'Desk Lamp', 'Mouse Pad',
    'Water Bottle', 'Notebook Set', 'Cable Organizer', 'Screen Cleaner'
  ];
  names.forEach((name, i) => {
    const id = `item_${String(nextId++).padStart(4, '0')}`;
    items.set(id, {
      id,
      name,
      category: categories[i % categories.length],
      price: Math.round((19.99 + Math.random() * 280) * 100) / 100,
      stock: Math.floor(Math.random() * 150),
      rating: Math.round((3.2 + Math.random() * 1.8) * 10) / 10,
      createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString()
    });
  });
}

function getItems({ page = 1, limit = 20, category, sort } = {}) {
  let all = [...items.values()];
  if (category) all = all.filter((i) => i.category === category);
  if (sort === 'price_asc') all.sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') all.sort((a, b) => b.price - a.price);
  if (sort === 'rating') all.sort((a, b) => b.rating - a.rating);
  const start = (page - 1) * limit;
  return all.slice(start, start + limit);
}

function itemCount(category) {
  if (!category) return items.size;
  return [...items.values()].filter((i) => i.category === category).length;
}

function getItem(id) { return items.get(id); }

function createItem(data) {
  const id = `item_${String(nextId++).padStart(4, '0')}`;
  const item = { id, ...data, stock: 0, rating: 0, createdAt: new Date().toISOString() };
  items.set(id, item);
  return item;
}

function updateItem(id, data) {
  const item = items.get(id);
  if (!item) return null;
  Object.assign(item, data);
  return item;
}

function deleteItem(id) { return items.delete(id); }

function getAnalytics() {
  const all = [...items.values()];
  const categories = {};
  for (const i of all) {
    if (!categories[i.category]) categories[i.category] = { count: 0, revenue: 0 };
    categories[i.category].count++;
    categories[i.category].revenue += i.price * i.stock;
  }
  return {
    totalItems: all.length,
    totalValue: Math.round(all.reduce((s, i) => s + i.price * i.stock, 0)),
    categories,
    avgRating: Math.round(all.reduce((s, i) => s + i.rating, 0) / all.length * 10) / 10,
    lowStock: all.filter((i) => i.stock < 20).length
  };
}

function getTrends(period) {
  const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
  const trend = [];
  for (let i = days - 1; i >= 0; i--) {
    trend.push({
      date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
      views: Math.floor(800 + Math.random() * 1200),
      orders: Math.floor(15 + Math.random() * 40),
      revenue: Math.round((2000 + Math.random() * 5000) * 100) / 100
    });
  }
  return { period, trend };
}

function getCategoryBreakdown(cat) {
  const all = [...items.values()].filter((i) => i.category === cat);
  if (!all.length) return null;
  return {
    category: cat,
    items: all.length,
    avgPrice: Math.round(all.reduce((s, i) => s + i.price, 0) / all.length * 100) / 100,
    topRated: all.sort((a, b) => b.rating - a.rating).slice(0, 5)
  };
}

function getProfile() {
  return {
    id: 'usr_demo',
    name: 'Kira Holden',
    email: 'kira@vantagecommerce.io',
    role: 'editor',
    lastActive: new Date().toISOString()
  };
}

function getActivity() {
  return [
    { action: 'item_updated', target: 'item_0003', timestamp: new Date(Date.now() - 300000).toISOString() },
    { action: 'item_created', target: 'item_0021', timestamp: new Date(Date.now() - 1800000).toISOString() },
    { action: 'analytics_viewed', target: null, timestamp: new Date(Date.now() - 3600000).toISOString() }
  ];
}

module.exports = { seed, getItems, itemCount, getItem, createItem, updateItem, deleteItem, getAnalytics, getTrends, getCategoryBreakdown, getProfile, getActivity };
