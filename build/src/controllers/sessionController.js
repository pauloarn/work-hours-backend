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
const auth_1 = __importDefault(require("../config/auth"));
const connection_1 = __importDefault(require("../database/connection"));
const Yup = __importStar(require("yup"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    async store(request, response) {
        const schema = Yup.object().shape({
            userId: Yup.number().required(),
            password: Yup.string().required()
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
        try {
            const { userId, password } = request.body;
            const currentUser = await connection_1.default('employees').where('id', '=', userId);
            if (currentUser.length > 0) {
                const user = currentUser[0];
                if (user.password === password) {
                    return response.status(200).json({
                        user: currentUser[0],
                        token: jsonwebtoken_1.default.sign({ id: user.id }, auth_1.default.secret, {
                            expiresIn: auth_1.default.expiresIn
                        })
                    });
                }
                else {
                    return response.status(400).json({ error: 'Senha Incorreta' });
                }
            }
            else {
                return response.status(400).json({ error: 'Usuário não encontrado' });
            }
        }
        catch (err) {
            console.log(err);
            return response.status(400).json({ error: 'Falha ao criar sessão de usuário' });
        }
    }
}
exports.default = UserController;
