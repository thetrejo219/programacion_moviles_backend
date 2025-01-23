import { Router } from "express";
import { PublicacionController } from "../controllers/PublicacionController";
import { param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { autenticado } from "../middleware/auth";

const router = Router()

router.use(autenticado)

router.get('/publicacion',
    PublicacionController.obtenerPublicaciones
)

router.post('/:userId/publicacion',
    param('userId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    PublicacionController.crearPublicacion
)


export default router