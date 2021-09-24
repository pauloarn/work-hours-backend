import express,{NextFunction, Request, Response} from 'express';
import UserController from './controllers/userController'
import SessionController from './controllers/sessionController'
import authMiddleware from './middleware/auth'
import WorkPointsController from './controllers/workPointsController'
import cors from 'cors'

const workPointsController = new WorkPointsController()
const userController = new UserController()
const sessionController = new SessionController()
const routes = express.Router();

routes.use(cors());

routes.get('/', (request:Request, response:Response) => {
    return response.status(200).json({
        message: "Bem vindo a API para controle de Ponto, para mais informações, consulte a documentação em https://github.com/pauloarn/work-hours-challenge-backend"
    });
})
routes.post('/users', userController.create)
routes.post('/sessions', sessionController.store)

routes.use(authMiddleware)
routes.get('/users', userController.index)
routes.post('/workpoint',workPointsController.create)
routes.get('/user/workpoint', workPointsController.index)

export default routes;