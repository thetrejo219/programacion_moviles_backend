import { Request,Response } from "express"
import User from "../models/User"
import formidable from 'formidable'
import {v4 as uuid} from 'uuid'
import { checkPassword, hashPassword } from "../utils/auth"
import { generateJWT } from "../utils/jwt"
import cloudinary from "../config/cloudinary"

export class AuthController{
    static createAccount=async(req:Request,res:Response)=>{
        try {
            const{email}=req.body
            const userExist= await User.findOne({email})
            if(userExist){
                const error=new Error('El usuario ya esta registrado')
                res.status(409).json({error:error.message})
                return
            }
            const user = new User(req.body)
            user.password= await hashPassword(req.body.password)
            await user.save()
            res.send('Usuario creado correctamente')
        } catch (error) {
            console.log(error)
        }
    }
    static iniciarSesion=async(req:Request,res:Response)=>{
        try {
            const{email,password}=req.body
            const user = await User.findOne({email})
            if(!user){
                const error=new Error('Usuario no encontrado')
                res.status(409).json({error:error.message})
                return
            }
            const isPasswordCorrect= await checkPassword(password,user.password)
            if(!isPasswordCorrect){
                const error=new Error('Password Incorrecto')
                res.status(409).json({error:error.message})
                return
            }
            const token=generateJWT({id:user.id})
            res.send(token)

        } catch (error) {
            res.send(500).json({error:'Hubo un error'})
        }
    }
    //trabajar para despues
    static actualizarPerfil=async(req:Request,res:Response)=>{
        const{name,email}=req.body
        const usuarioExiste= await User.findOne({email})
        if(usuarioExiste){
            const error = new Error('El correo electronico ya esta registrado')
            res.status(409).json({error:error.message})
        }
        req.user.name=name
        req.user.email=email
        try {
            await req.user.save()
            res.send('Perfil actualizado correctamente')
        } catch (error) {
            res.send(500).send('Hubo un error en el servidor')
        }
    }
    static usuario = async(req:Request,res:Response)=>{
        try {
            res.json(req.user)
        } catch (error) {
            res.send(500).json({error:'Hubo un error'})
        }
    }
    static buscarPerfilUsuario=async(req:Request,res:Response)=>{
        try {
            const {userProfile} = req.params
            const publicacion = await User.findById(userProfile).populate('logros')
            res.send(publicacion)
        } catch (error) {
            res.send(500).json({error:'Hubo un error'})
        }
    }
    static ponerFotoPerfil=async(req:Request,res:Response)=>{
        const form = formidable({multiples:false})
        try {
            form.parse(req,(error,fields,files)=>{
                cloudinary.uploader.upload(files.file[0].filepath,{},async function(error,result) {
                    if(error){
                        const error = new Error('Hubo un error al subir la imagen')
                        res.status(500).json({error:error.message})
                    }
                    if(result){
                        req.user.imagenPerfil = result.secure_url
                        await req.user.save()
                        res.json({image:result.secure_url})
                    }
                })
            })
        } catch (e) {
            const error = new Error('Hubo un error')
            res.status(500).json({error:error.message})
        }
    }
    static ponerFotoPortada=async(req:Request,res:Response)=>{
        const form = formidable({multiples:false})
        try {
            form.parse(req,(error,fields,files)=>{
                cloudinary.uploader.upload(files.file[0].filepath,{},async function(error,result) {
                    if(error){
                        const error = new Error('Hubo un error al subir la imagen')
                        res.status(500).json({error:error.message})
                    }
                    if(result){
                        req.user.imagenPortada = result.secure_url
                        await req.user.save()
                        res.json({image:result.secure_url})
                    }
                })
            })
        } catch (e) {
            const error = new Error('Hubo un error')
            res.status(500).json({error:error.message})
        }
    }
}
