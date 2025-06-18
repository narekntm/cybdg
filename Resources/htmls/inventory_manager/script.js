const form = document.getElementById('add-product-form');
const nameInput = document.getElementById('product-name');
const categorySelect = document.getElementById('product-category');
const quantityInput = document.getElementById('product-quantity');
const statusSelect = document.getElementById('product-status');

const errorName = document.getElementById('error-name');
const errorCategory = document.getElementById('error-category');
const errorQuantity = document.getElementById('error-quantity');
const errorStatus = document.getElementById('error-status');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  clearErrors();

  const name = nameInput.value.trim();
  const category = categorySelect.value;
  const quantity = parseInt(quantityInput.value, 10);
  const status = statusSelect.value;

  let hasError = false;

  if (!name) {
    errorName.textContent = 'Product name is required.';
    hasError = true;
  }

  if (!category) {
    errorCategory.textContent = 'Please select a category.';
    hasError = true;
  }

  if (!quantityInput.value || isNaN(quantity) || quantity < 1) {
    errorQuantity.textContent = 'Quantity must be at least 1.';
    hasError = true;
  }

  if (!status) {
    errorStatus.textContent = 'Please select a status.';
    hasError = true;
  }

  if (hasError) return;

  const tableBody = document.querySelector('#inventory-table tbody');
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${name}</td>
    <td>${category}</td>
    <td>${quantity}</td>
    <td>${status}</td>
  `;

  tableBody.appendChild(row);
  form.reset();
});

function clearErrors() {
  errorName.textContent = '';
  errorCategory.textContent = '';
  errorQuantity.textContent = '';
  errorStatus.textContent = '';
}
