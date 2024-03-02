'use strict'

import { checkPassword, checkUpdate, encrypt } from '../utils/validator.js'
import User from './user.model.js'
import { generateJwt } from '../utils/jwt.js'

//REGISTER
export const createUser = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({ msg: 'Registered successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error registerin user', err })
    }
}

//LOGIN 
export const login = async (req, res) => {
    try {
        let { mail, phone, username, password } = req.body
        let user = await User.findOne({ $or: [{ username }, { mail }, { phone }] })
        //Si no coincide con ningun criterio dara los siguientes mensajes
        if (!user) {
            //Verifica que criterio se mando a buscar y depende de eso dara el mensaje asignado a cada uno
            if (username) {
                return res.status(404).send({ msg: 'The username you entered is not connected to an account.' });
            } else if (mail) {
                return res.status(404).send({ msg: 'The mail you entered is not connected to an account.' });
            } else if (phone) {
                return res.status(404).send({ msg: 'The phone you entered is not connected to an account.' });
            }
        }

        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                phone: user.phone,
                mail: user.mail,
                username: user.username,
                names: user.names
            }
            let token = await generateJwt(loggedUser)
            return res.send({
                msg: `Welcome ${user.names}`,
                loggedUser,
                token
            })
        }
        return res.status(404).send({ msg: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Failed to login', err })
    }
}

//UPDATE
export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let { oldPassword, newPassword} = req.body

        
        // Buscar el usuario por su ID
        let user = await User.findById(id)
        if (!user) {
            return res.status(404).send({ msg: 'user not found' })
        }

        let isPasswordValid  = await checkPassword(oldPassword, user.password)
        if (!isPasswordValid ) {
            return res.status(400).send({ msg: 'The old password is incorrect' })
        }

        data.password = await encrypt(newPassword)

        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({msg: 'Make sure no field is empty'})

        let updateUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateUser) return res.status(401).send({ msg: 'User not found and not updated' })
        return res.send({ msg: 'Update user', updateUser })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ msg: 'Error al actualizar el usuario' })
    }
}

