'use strict'

import { Router } from 'express'
import { addComment, deleteComm, update } from './comments.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js' 

const api = Router()

api.post('/addComment', validateJwt , addComment)
api.put('/update/:id',validateJwt, update)
api.delete('/delete/:id', validateJwt, deleteComm)

export default api