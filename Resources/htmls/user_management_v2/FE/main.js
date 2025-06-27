import { setupAdminAuth } from './modules/admin.js';
import { setupUserForm } from './modules/userForm.js';
import { setupTableActions } from './modules/table.js';
import { setupModals } from './modules/modals.js';
import { setupPagination } from './modules/pagination.js';
import { loadUsers } from './modules/data.js';
import "./modules/loginModal.js";

import { state } from "./modules/state.js";
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.hash === "#reload") {
    import('./modules/data.js').then(({ loadUsers }) => {
      loadUsers();
    });
    window.location.hash = ""; // clear hash after reloading
  }
});
// 🔧 Global app state
state.pageSize = 5;
state.currentPage = 1;
state.allUsers = [];
state.editRow = null;
state.rowToDelete = null;
state.isAdmin = false;

// 🚀 Initialize App
setupAdminAuth();
setupUserForm();
setupTableActions();
setupModals();
setupPagination();
loadUsers();
