"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("./controllers/userController"));
const sessionController_1 = __importDefault(require("./controllers/sessionController"));
const auth_1 = __importDefault(require("./middleware/auth"));
const workPointsController_1 = __importDefault(require("./controllers/workPointsController"));
const cors_1 = __importDefault(require("cors"));
const workPointsController = new workPointsController_1.default();
const userController = new userController_1.default();
const sessionController = new sessionController_1.default();
const routes = express_1.default.Router();
routes.use(cors_1.default());
routes.get('/', (request, response) => {
    return response.status(200).json({
        message: "Bem vindo a API para controle de Ponto, para mais informações, consulte a documentação em https://github.com/pauloarn/work-hours-challenge-backend"
    });
});
routes.post('/users', userController.create);
routes.post('/sessions', sessionController.store);
routes.use(auth_1.default);
routes.get('/users', userController.index);
routes.post('/workpoint', workPointsController.create);
routes.get('/user/workpoint', workPointsController.index);
exports.default = routes;
