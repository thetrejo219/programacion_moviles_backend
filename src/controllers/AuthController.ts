import { Request,Response } from "express"
import User from "../models/User"
export class AuthController{
    static createAccount=async(req:Request,res:Response)=>{
        const user = new User(req.body)
        try {
            await user.save()
            res.send('Usuario creado correctamente')
        } catch (error) {
            console.log(error)
        }
    }
}
