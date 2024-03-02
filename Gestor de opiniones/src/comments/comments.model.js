import { Schema, model } from 'mongoose'

const commentSchema = Schema({
    author: {
        type: Schema.ObjectId,
        ref: 'user',
        requitred: [true, 'The ID user is required']
    },
    publication: {
        type: Schema.ObjectId,
        ref: 'publications',
        requitred: [true, 'The publication ID is required']
    },
    comment: {
        type: String,
        requitred: [true, 'The commet is required']
    },
    date: {
        type: Date,
        default: Date.now
    }
}
/*,{
    versionkey: false,
    timestamps: true //esto nos da la fecha de creacion y la de actualización
}*/)

export default model('comments', commentSchema)