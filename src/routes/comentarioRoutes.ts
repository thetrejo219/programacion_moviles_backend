import {Router} from 'express'
import { ComentarioControlador } from '../controllers/ComentarioControlador'
import { autenticado } from '../middleware/auth'
import { existePublicacion } from '../middleware/publicacion'
import { param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'


const router = Router()


router.use(autenticado)

router.get('/:publicacionId/comentario',
    param('publicacionId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    existePublicacion,
    ComentarioControlador.obtenerComentariosPublicacion
)

router.post('/:publicacionId/comentario',
    param('publicacionId').isMongoId().withMessage('ID no valido'),
    handleInputErrors,
    existePublicacion,
    ComentarioControlador.crearComentario
)

export default router