import { compare, hash } from 'bcrypt'

export const encrypt = async(password) => {
    try{    
        return await hash(password, 10)
    }catch(err){
        console.error(err)
        return err
    }
}

export const checkPassword = async(password, hash) =>{
    try{
        return await compare(password, hash)
    }catch(err){
        console.error(err)
        return err
    }
}

export const checkUpdate = (data, userId) => {
    if(userId){
        if(
            Object.entries(data).length === 0 ||
            data.names == '' ||
            data.surnames == '' ||
            data.phone == '' ||
            data.mail == '' ||
            data.username == '' ||
            data.password == ''
        )return false
     return true
    }
}