import { submitUser, updateUser } from '../api.js'
import { applySearchAndRender } from './pagination.js'
import { state } from './state.js'
import { clearErrors, showErrors, validateForm } from './utils.js'

const openBtn = document.getElementById('open-user-modal')
const closeBtn = document.getElementById('close-user-modal')
const userModal = document.getElementById('user-form-modal')
const form = document.getElementById('user-form')

export function setupUserForm () {
  document.addEventListener('DOMContentLoaded', () => {

    openBtn?.addEventListener('click', () => {
      state.editRow = null
      document.getElementById('form-title').textContent = 'Add New User'
      form.reset()
      clearErrors()
      userModal.style.display = 'flex'
    })

    closeBtn?.addEventListener("click", () => {
      form.reset();
      clearErrors();
      state.editRow = null;
      document.getElementById("form-title").textContent = "Add New User";
      userModal.style.display = "none";
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault()

      const name = form.name.value.trim()
      const role = form.role.value
      const age = form.age.value.trim()
      const email = form.email.value.trim()
      const gender = form.querySelector('input[name="gender"]:checked')?.value
      const subscriptions = Array.from(form.querySelectorAll('input[name="subscribe"]:checked'))
        .map((cb) => cb.value)
        .join(', ') || 'None'

      clearErrors()
      const errors = validateForm(name, role, age, email, gender)
      if (errors.length > 0) return showErrors(errors)

      try {
        if (state.editRow) {
          const id = state.editRow.dataset.id;
          const updated = await updateUser(id, { name, role, age, email, gender, subscriptions });

          // 🔧 Replace the user in allUsers
          const index = state.allUsers.findIndex((u) => u.id === +id);
          if (index !== -1) {
            state.allUsers[index] = updated;
          }

          state.editRow = null;
          document.getElementById("form-title").textContent = "Add New User";
        } else {
          const created = await submitUser({ name, role, age, email, gender, subscriptions });
          state.allUsers.push(created);
        }
        
        applySearchAndRender()
        form.reset()
        userModal.style.display = 'none'
      } catch (err) {
        showErrors([err.error || 'Server error'])
      }
    })
  })
}
