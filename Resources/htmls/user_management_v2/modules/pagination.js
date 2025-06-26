import { state } from "./state.js";
export function setupPagination() {
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", () => {
    state.currentPage = 1;
    applySearchAndRender();
  });

  prevPageBtn.addEventListener("click", () => {
    state.currentPage--;
    applySearchAndRender();
  });

  nextPageBtn.addEventListener("click", () => {
    state.currentPage++;
    applySearchAndRender();
  });
}

export function applySearchAndRender() {
  const query = document.getElementById("search-input").value;
  const filtered = query
    ? state.allUsers.filter((u) =>
      u.name.includes(query) ||
      u.email.includes(query) ||
      u.role.includes(query)
    )
    : state.allUsers.slice(); // ← return an original list if a query is empty

  const totalPages = Math.ceil(filtered.length / state.pageSize);
  if (state.currentPage > totalPages) {
    state.currentPage = totalPages > 0 ? totalPages : 1;
  }

  renderTable(filtered);
}

function renderTable(users) {
  const tableBody = document.querySelector("#user-table tbody");
  const startIndex = (state.currentPage - 1) * state.pageSize;
  const paginatedUsers = users.slice(startIndex, startIndex + state.pageSize);
  tableBody.innerHTML = "";

  updatePaginationInfo(users.length);

  if (paginatedUsers.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `<td colspan="8" style="text-align: center; color: #888;">No users found.</td>`;
    tableBody.appendChild(emptyRow);
    return;
  }

  paginatedUsers.forEach((u) => {
    const row = document.createElement("tr");
    row.dataset.id = u.id;
    row.innerHTML = generateRowHTML(u);
    tableBody.appendChild(row);
  });
}

function updatePaginationInfo(totalUsers) {
  const totalPages = Math.ceil(totalUsers / state.pageSize);
  const hasUsers = totalUsers > 0;

  const pageInfo = document.getElementById("page-info");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");

  pageInfo.textContent = hasUsers ? `Page ${state.currentPage} of ${totalPages}` : "No results";
  prevPageBtn.disabled = !hasUsers || state.currentPage <= 1;
  nextPageBtn.disabled = !hasUsers || state.currentPage >= totalPages;
}

function generateRowHTML(u) {
  return `<td>${u.name}</td><td>${u.role}</td><td>${u.age}</td><td>${u.email}</td><td>${u.gender}</td><td>${u.subscriptions}</td><td>${u.status}</td>
<td>
  <div class="action-buttons">
    <button class="btn-secondary edit-btn">Edit</button>
    <button class="btn-danger delete-btn">Delete</button>
    <button class="btn-primary status-btn">${u.status === "Active" ? "Deactivate" : "Activate"}</button>
  </div>
</td>`;

}