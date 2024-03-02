import { Schema, model } from 'mongoose'

const useSchema = Schema({
    names: {
        type:String,
        required: [true, 'Names are required.']
    },
    surnames: {
        type: String,
        required: [true, 'Surnames are required']
    },
    phone: {
        type: String,
        unique: true,
        minLength: [8, 'It must have 8 numbers'],
        maxLength:[8, 'It must have 8 numbers'],
        required: [true, 'The phone is required']
    },
    mail: {
        type: String,
        unique: true,
        required: [true, 'The mail is required']
    },
    username: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'The username is required']
    },
    password: {
        type: String,
        unique: true,
        minLength: [8, 'Password must be 8 charcaters'],
        required: [true, 'The password is required']
    },
    publication: [{
        type: Schema.ObjectId,
        ref: 'publications'
    }]
})

export default model('user', useSchema)