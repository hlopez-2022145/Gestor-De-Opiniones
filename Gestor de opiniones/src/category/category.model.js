import { Schema,model } from 'mongoose'

const categorySchema = Schema({
    nameCategory: {
        type: String,
        required: [true, 'The name category is required']
    },
    description: {
        type: String,
        required: [true, 'The description is required']
    }
})

export default model('category', categorySchema)