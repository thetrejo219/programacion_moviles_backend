import{Request,Response,NextFunction}from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from "../models/User"

declare global{
    namespace Express{
        interface Request{
            user?:IUser
        }
    }
}

export const autenticado=async(req:Request,res:Response,next:NextFunction)=>{
    const bearer = req.headers.authorization
    if(!bearer || !bearer.startsWith('Bearer ')){
        const error = new Error('No autorizado')
        res.status(401).json({error:error.message})
    }
    const token = bearer.split(' ')[1]
    try {
        const decoded = jwt.verify(token,'padalustro')
        if(typeof decoded ==='object' && decoded.id){
            const user = await User.findById(decoded.id).select('_id name email logros')
            if(user){
                req.user=user
                next();
            }else{
                res.status(500).json({error:'Token no valido'})
            }
        }
    } catch (error) {
        res.status(500).json({error:'Token no valido'})
    }
}