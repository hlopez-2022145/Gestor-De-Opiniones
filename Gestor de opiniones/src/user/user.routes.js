'use strict'

import express from 'express'

import { createUser, login, update } from './user.controller.js'

const api = express.Router()

api.post('/createUser', createUser)
api.post('/login', login)
api.put('/update/:id', update)

export default api