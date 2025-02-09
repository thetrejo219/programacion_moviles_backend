import mongoose,{Schema,Document, PopulatedDoc,Types} from "mongoose";
import { IPublicacion } from "./Publicacion";

export interface IUser extends Document{
    imagenPerfil:string,
    imagenPortada:string
    email:string,
    password:string,
    name:string,
    confirmed:boolean
    logros:PopulatedDoc<IPublicacion & Document>[]
}

const userSchema:Schema=new Schema({
    imagenPerfil:{
        type: String,
        default:''
    },
    imagenPortada:{
        type: String,
        default:''
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    logros:[
        {
            type:Types.ObjectId,
            ref:'Publicacion'
        }
    ]
})

const User = mongoose.model<IUser>('User',userSchema)


export default User