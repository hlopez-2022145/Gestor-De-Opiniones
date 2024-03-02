'use strict'

import Comments from './comments.model.js'
import User from '../user/user.model.js'
import Publications from '../publications/publications.model.js'

//ADD
export const addComment = async (req, res) => {
    try {
        let data = req.body
        //obtenemos el id del usuario logueado
        let authorId = req.user.id
        //agregamos el id del author a los datos que queremos agregar
        data.author = authorId
        //verificamos si el usuario existe
        let user = await User.findOne({ _id: data.author })
        if (!user) return res.status(404).send({ msg: 'User not found' })
        //Verificamos si la publicación existe
        let publica = await Publications.findOne({ _id: data.publication })
        if (!publica) return res.status(404).send({ msg: 'Publication not found' })
        let comment = new Comments(data)
        await comment.save()
        return res.send({ msg: 'Comment added successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error added comment' })
    }
}

//UPDATE
export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        //Obtenemos el id del usuario logueado
        let authorId = req.user.id
        //agregamos el id del author a los datos que queremos actualizar
        data.author = authorId
        //verifiamos si el comentario existe y si usuario logueado es el author del comentario
        let comment = await Comments.findOne({ _id: id, author: authorId })
        //Si es distinto el author no lo dejara actualizar
        if (!comment) {
            return res.status(401).send({ msg: 'You do not have permission to update the comment' })
        }
        let updateComment = await Comments.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateComment) return res.status(401).send({ msg: 'Comment not found and not updated' })
        return res.send({ msg: 'Updating comment', updateComment })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error updating comment' })
    }
}

//DELETE
export const deleteComm = async (req, res) => {
    try {
        let { id } = req.params
        //Obtenemos el id del usuario logueado
        let authorId = req.user.id
        //Verifiacamos si el comentario existe y si el usuario logueado es el author
        let commentExis = await Comments.findOne({_id: id, author: authorId})
        if(!commentExis){
            return res.status(401).send({msg: 'You do not have permission to delete the comment'})
        } 
        let deleteCom = await Comments.findOneAndDelete({ _id: id })
        if (!deleteCom.deleteCount == 0) return res.status(404).send({ msg: 'Comment not found, not deleted' })
        return res.send({ msg: 'Deleted comment successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error deleting comment' })
    }
}