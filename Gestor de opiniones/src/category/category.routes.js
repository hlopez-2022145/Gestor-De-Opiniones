'use strict'

import express from 'express'

import { addCategory, update, getCategory, deleteCategory } from './category.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/addCategory',validateJwt, addCategory)
api.put('/update/:id', validateJwt, update)
api.get('/getCategory', validateJwt, getCategory)
api.delete('/delete/:id', validateJwt, deleteCategory)

export default api