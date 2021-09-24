"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
const Yup = __importStar(require("yup"));
const convertHoursToMinutes_1 = __importDefault(require("../utils/convertHoursToMinutes"));
class UserController {
    async create(request, response) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            password: Yup.string().required().min(6),
            hoursToWork: Yup.string().required(),
        });
        let errors;
        try {
            await schema.validateSync(request.body, { abortEarly: false });
        }
        catch (err) {
            errors = err.errors;
        }
        if (errors) {
            return response.status(400).json({ error: 'Falha na Validação', errors });
        }
        const { name, password, hoursToWork } = request.body;
        try {
            const newUser = await connection_1.default('employees').insert({
                name,
                password,
                hoursToWork: convertHoursToMinutes_1.default(hoursToWork)
            });
            const userCreated = await connection_1.default('employees').where('id', '=', newUser);
            return response.status(201).json({
                status: 'success',
                data: userCreated[0]
            });
        }
        catch (e) {
            return response.status(400).json({
                error: 'Falha ao adicionar Usuário',
                data: e
            });
        }
    }
    async index(request, response) {
        //@ts-ignore
        const userId = request.userId;
        if (userId) {
            try {
                const user = await connection_1.default('employees').where('id', '=', Number(userId));
                if (user.length > 0) {
                    return response.status(200).json({
                        user: {
                            userId: user[0].id,
                            name: user[0].name,
                            hoursToWork: user[0].hoursToWork
                        }
                    });
                }
                else {
                    return response.status(400).json({ error: 'Usuário não encontrado' });
                }
            }
            catch (err) {
                console.log(err.message);
                return response.status(400).json({
                    error: 'Falha ao procurar usuário',
                });
            }
        }
        else {
            return response.status(400).json({ error: 'Usuário não encontrado' });
        }
    }
}
exports.default = UserController;
