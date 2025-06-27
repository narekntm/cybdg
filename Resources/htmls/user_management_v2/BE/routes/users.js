import express from 'express'
import {
  addUser,
  deleteUser,
  getUserById,
  getUsers,
  seedUsers,
  toggleStatus,
  updateUser
} from '../services/userService.js'

const router = express.Router()

router.get('/users', getUsers)
router.get('/users/:id', getUserById)
router.post('/users', addUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)
router.patch('/users/:id/status', toggleStatus)
router.post("/seed", seedUsers);


export default router
