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
      <tr data-item-id="${i.id}">
        <td>${i.name}</td>
        <td><span class="category-tag cat-${i.category}">${i.category}</span></td>
        <td class="price">$${i.price.toFixed(2)}</td>
        <td class="stock ${i.stock < 20 ? 'low' : ''}">${i.stock}</td>
        <td class="rating">${i.rating}</td>
        <td>
          <button class="btn btn-edit" data-edit-id="${i.id}" style="font-size:11px;padding:2px 8px">Edit</button>
          <button class="btn btn-danger btn-delete" data-delete-id="${i.id}" style="font-size:11px;padding:2px 8px">Delete</button>
        </td>
      </tr>`).join('');
    const totalPages = Math.ceil(data.total / 10);
    document.getElementById('pagination').innerHTML = Array.from({length: totalPages}, (_, i) =>
      `<button class="${i + 1 === page ? 'active' : ''}" onclick="loadItems(${i + 1})">${i + 1}</button>`
    ).join('');
    // Bind edit/delete handlers
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.editId));
    });
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(btn.dataset.deleteId));
    });
  } catch (e) {
    showToast('Failed to load items', 'error');
  }
}

function openModal() {
  document.getElementById('modalTitle').textContent = 'Add Item';
  document.getElementById('modalSubmit').textContent = 'Create';
  document.getElementById('modalSubmit').onclick = createItem;
  document.getElementById('itemName').value = '';
  document.getElementById('itemPrice').value = '';
  document.getElementById('itemStock').value = '';
  document.getElementById('editItemId').value = '';
  document.getElementById('modal').classList.add('open');
}

function closeModal() { document.getElementById('modal').classList.remove('open'); }

async function openEditModal(id) {
  try {
    const item = await API.get(`/items/${id}`);
    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('modalSubmit').textContent = 'Save';
    document.getElementById('modalSubmit').onclick = () => updateItem(id);
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemStock').value = item.stock;
    document.getElementById('editItemId').value = id;
    document.getElementById('modal').classList.add('open');
  } catch (e) {
    showToast('Failed to load item', 'error');
  }
}

async function createItem() {
  const name = document.getElementById('itemName').value;
  const category = document.getElementById('itemCategory').value;
  const price = parseFloat(document.getElementById('itemPrice').value) || 0;
  const stock = parseInt(document.getElementById('itemStock').value) || 0;
  if (!name) return showToast('Name is required', 'error');
  try {
    await API.post('/items', { name, category, price, stock });
    showToast('Item created');
    closeModal();
    loadItems(currentPage);
  } catch (e) {
    showToast('Failed to create item', 'error');
  }
}

async function updateItem(id) {
  const name = document.getElementById('itemName').value;
  const category = document.getElementById('itemCategory').value;
  const price = parseFloat(document.getElementById('itemPrice').value) || 0;
  const stock = parseInt(document.getElementById('itemStock').value) || 0;
  try {
    await API.put(`/items/${id}`, { name, category, price, stock });
    showToast('Item updated');
    closeModal();
    loadItems(currentPage);
  } catch (e) {
    showToast('Failed to update', 'error');
  }
}

function openDeleteModal(id) {
  document.getElementById('deleteItemId').value = id;
  document.getElementById('deleteModal').classList.add('open');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('open');
}

async function confirmDelete() {
  const id = document.getElementById('deleteItemId').value;
  try {
    await API.delete(`/items/${id}`);
    showToast('Item deleted');
    closeDeleteModal();
    loadItems(currentPage);
  } catch (e) {
    showToast('Failed to delete', 'error');
  }
}

async function triggerError() {
  try {
    await API.get('/health?deep=true');
  } catch (e) {
    showToast('Health check failed: ' + e.message, 'error');
  }
}

loadItems();
