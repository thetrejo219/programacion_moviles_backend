import{Request,Response,NextFunction}from 'express'
import Publicacion, { IPublicacion } from "../models/Publicacion";

declare global{
    namespace Express{
        interface Request{
            post:IPublicacion
        }
    }
}

export const existePublicacion=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const{publicacionId}= req.params
        const publicacion = await Publicacion.findById(publicacionId)
        if(!publicacion){
            const error = new Error('La publicacion no existe')
            res.status(404).json({error:error.message})
        }
        if(publicacion){
            req.post=publicacion
            next()
        }
    } catch (error) {
        res.status(500).json({error:'Error en el servidor'})
    }
}