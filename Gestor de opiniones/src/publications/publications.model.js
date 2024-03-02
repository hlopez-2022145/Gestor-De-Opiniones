import { Schema, model } from 'mongoose'

const publicationsSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: [true, 'The ID user is required']
    },
    date: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: Schema.ObjectId,
        ref: 'category',
        required: [true, 'The id category is required']
    },
    mainText: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.ObjectId,
        ref: 'comments'
    }]
})

export default model('publications', publicationsSchema)