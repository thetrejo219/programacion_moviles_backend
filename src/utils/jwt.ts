import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

type UserPayLoad={
    id:Types.ObjectId
}

export const generateJWT=(id:UserPayLoad)=>{
    const token=jwt.sign(id,'padalustro',{
        expiresIn:'180d'
    })
    return token
}