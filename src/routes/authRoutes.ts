import {Router} from 'express'
import {body} from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { autenticado } from '../middleware/auth'

const router = Router()

router.get('/user',
    autenticado,
    AuthController.usuario
)
router.get('/:userProfile',
    AuthController.buscarPerfilUsuario
)

router.post('/create-account',
    body('name')
    .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password')
    .isLength({min:8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('password_confirmation').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Los passwords no son iguales')
        }
        return true
    }),
    body('email')
    .notEmpty().withMessage('El email no puede ir vacio')
    .isEmail().withMessage('e-mail no valido'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/login',
    body('email').isEmail().withMessage('El correo electronico introducido no es valido'),
    body('password').notEmpty().withMessage('La contraseña no puede ir vacia'),
    handleInputErrors,
    AuthController.iniciarSesion
)

router.put('/actualizarPerfil',
    autenticado,
    AuthController.actualizarPerfil
)

router.post('/ponerPerfil',
    autenticado,
    AuthController.ponerFotoPerfil
)
router.post('/ponerPortada',
    autenticado,
    AuthController.ponerFotoPortada
)

export default router