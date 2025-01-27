import { Router } from "express";
import { PublicacionController } from "../controllers/PublicacionController";
import { body, param } from "express-validator";
import multer from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';
import { handleInputErrors } from "../middleware/validation";
import { autenticado } from "../middleware/auth";
import { existePublicacion } from "../middleware/publicacion";

const router = Router()

router.use(autenticado)
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, path.join(__dirname, 'temp'))
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix = uuid()
        cb(null,uniqueSuffix+ "-" +file.originalname)
    }
})
const upload = multer({ storage });

router.get('/',
    PublicacionController.obtenerPublicaciones
)

router.get('/:publicacionId',
    existePublicacion,
    PublicacionController.obtenerPublicacionByID
)

router.post('/',
    upload.single('image'),
    PublicacionController.crearPublicacion
)

router.put('/actualizar/:publicacionId',
    existePublicacion,
    PublicacionController.actualizarPublicacion
)



export default router