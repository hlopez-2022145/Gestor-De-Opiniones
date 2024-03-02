'use strict'

import express from 'express'

import { addPublication, update, deletePubli, getPublication } from './publications.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'
import { get } from 'mongoose'

const api = express.Router()

api.post('/addPublication', validateJwt, addPublication)
api.put('/update/:id', validateJwt, update)
api.delete('/delete/:id', validateJwt, deletePubli)
api.get('/getPublication', validateJwt, getPublication)

export default api