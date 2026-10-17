let currentPage = 1;

async function loadItems(page = 1) {
  currentPage = page;
  const category = document.getElementById('categoryFilter').value;
  const sort = document.getElementById('sortSelect').value;
  let url = `/items?page=${page}&limit=10`;
  if (category) url += `&category=${category}`;
  if (sort) url += `&sort=${sort}`;
  try {
    const data = await API.get(url);
    document.getElementById('itemsBody').innerHTML = data.items.map(i => `
      <tr>
        <td>${i.name}</td>
        <td><span class="category-tag cat-${i.category}">${i.category}</span></td>
        <td class="price">$${i.price.toFixed(2)}</td>
        <td class="stock ${i.stock < 20 ? 'low' : ''}">${i.stock}</td>
        <td class="rating">${i.rating}</td>
        <td>
          <button class="btn" style="font-size:11px;padding:2px 8px" onclick="editItem('${i.id}')">Edit</button>
          <button class="btn btn-danger" style="font-size:11px;padding:2px 8px" onclick="deleteItem('${i.id}')">Delete</button>
        </td>
      </tr>`).join('');
    // Pagination
    const totalPages = Math.ceil(data.total / 10);
    document.getElementById('pagination').innerHTML = Array.from({length: totalPages}, (_, i) =>
      `<button class="${i + 1 === page ? 'active' : ''}" onclick="loadItems(${i + 1})">${i + 1}</button>`
    ).join('');
  } catch (e) {
    showToast('Failed to load items', 'error');
  }
}

function openModal() { document.getElementById('modal').classList.add('open'); }
function closeModal() { document.getElementById('modal').classList.remove('open'); }

async function createItem() {
  const name = document.getElementById('itemName').value;
  const category = document.getElementById('itemCategory').value;
  const price = parseFloat(document.getElementById('itemPrice').value) || 0;
  if (!name) return showToast('Name is required', 'error');
  try {
    await API.post('/items', { name, category, price });
    showToast('Item created');
    closeModal();
    loadItems(currentPage);
  } catch (e) {
    showToast('Failed to create item', 'error');
  }
}

async function editItem(id) {
  const item = await API.get(`/items/${id}`);
  const newName = prompt('Edit name:', item.name);
  if (!newName) return;
  try {
    await API.put(`/items/${id}`, { name: newName });
    showToast('Item updated');
    loadItems(currentPage);
  } catch (e) {
    showToast('Failed to update', 'error');
  }
}

async function deleteItem(id) {
  if (!confirm('Delete this item?')) return;
  try {
    await API.delete(`/items/${id}`);
    showToast('Item deleted');
    loadItems(currentPage);
  } catch (e) {
    showToast('Failed to delete', 'error');
  }
}

loadItems();
