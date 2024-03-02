'use strict'

import Publications from './publications.model.js'
import User from '../user/user.model.js'
import Comments from '../comments/comments.model.js'

//ADD
export const addPublication = async (req, res) => {
    try {
        let data = req.body
        //Obtenemos el id del usuario logueado
        let userId = req.user.id
        //agregamos el id a los datos que queramos agregar
        data.user = userId
        //Verificamos si el usuario existe
        let user = await User.findOne({ _id: data.user })
        if (!user) {
            return res.status(404).send({ msg: 'User not found' })
        }

        let publications = new Publications(data)
        await publications.save()
        return res.send({ msg: 'Publication adding successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error adding post' })
    }
}

//UPDATE
export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        //Obtenemos el id del usuario logueado
        let publicaId = req.user.id
        //agregamos el id del usuario a los datos que queremos actualizar
        data.user = publicaId
        //verificamos si la publicacion existe y si el usuario logueado es el dueño de la publicación 
        let publicaExist = await Publications.findOne({ _id: id, user: publicaId })
        //si es distinto el usuario no lo dejara actualizar
        if (!publicaExist) {
            return res.status(401).send({ msg: 'You do not have permission to update the publication' })
        }

        let updatePublication = await Publications.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updatePublication) return res.status(401).send({ msg: 'Publication not found and not updated' })
        return res.send({ msg: 'Update publication', updatePublication })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error updating publication' })
    }
}

//DELETE
export const deletePubli = async (req, res) => {
    try {
        let { id } = req.params
        //Obtenemos el id del usuario logueado
        let userId = req.user.id
        //verificamos si la publicación existe y si el usuario logueado es el dueño
        let publicationExist = await Publications.findOne({ _id: id, user: userId })
        if (!publicationExist) {
            return res.status(404).send({ msg: 'You do not have permission to delete the publication' })
        }

        //Elimina todos los contarios que esten asociados a la publicación
        //deleteMany se usa para eliminar varios documentos de una colección que coincida con algo en especifico
        await Comments.deleteMany({ publication: id })

        let deletePublica = await Publications.findOneAndDelete({ _id: id })
        if (!deletePublica.deleteCount == 0) return res.status(404).send({ msg: 'publication not found, not deleted' })
        return res.send({ msg: 'Deleted publication successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error deleting publication' })
    }
}

//LIST OF PUBLICATIONS
export const getPublication = async (req, res) => {
    try {
        //Obtenemos el id del usuario logueado
        let userId = req.user.id;
        //buscamos las publicaciones que están asociadas al usuario logueado
        let listOfPublications = await Publications.find({ user: userId }).populate({ path: 'user', select: 'names -_id' }).select('-__v')
            .populate({ path: 'category', select: 'nameCategory -_id' })

        for (let publication of listOfPublications) {
            // Obtener los comentarios asociados a la publicación actual
            let comments = await Comments.find({ publication: publication._id })
                .populate({ path: 'author', select: 'names -_id' }).select('-_id -__v')
                .select('-publication')//este quita el id de la publicación
            // Agregar los comentarios a la publicación
            publication.comments = comments
        }

        if (listOfPublications) {
            return res.send({ listOfPublications })
        } else {
            return res.status(404).send({ msg: 'No publications found' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ msg: 'Error getting publications' });
    }
}
