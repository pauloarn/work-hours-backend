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
const sumWorkedHours_1 = __importDefault(require("../utils/sumWorkedHours"));
const connection_1 = __importDefault(require("../database/connection"));
const Yup = __importStar(require("yup"));
const dayjs_1 = __importDefault(require("dayjs"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
const isSameOrBefore_1 = __importDefault(require("dayjs/plugin/isSameOrBefore"));
const isSameOrAfter_1 = __importDefault(require("dayjs/plugin/isSameOrAfter"));
dayjs_1.default.extend(customParseFormat_1.default);
dayjs_1.default.extend(isSameOrBefore_1.default);
dayjs_1.default.extend(isSameOrAfter_1.default);
class WorkPointsController {
    async create(request, response) {
        const schema = Yup.object().shape({
            userId: Yup.number().required(),
            date: Yup.date().required(),
            entry: Yup.string().required(),
            lunchLeave: Yup.string().required(),
            lunchEntry: Yup.string().required(),
            leave: Yup.string().required()
        });
        let errors;
        try {
            await schema.validateSync(request.body, { abortEarly: false });
        }
        catch (err) {
            errors = err.errors;
        }
        if (errors) {
            return response.status(400).json({ error: 'Falha na Validação dos Dados', errors });
        }
        const { userId, date, entry, lunchLeave, lunchEntry, leave } = request.body;
        const hasUser = await connection_1.default('employees').where('id', '=', userId);
        console.log(dayjs_1.default());
        if (hasUser.length === 0) {
            return response.status(401).json({
                error: 'Usuário Inexistente'
            });
        }
        const consultDate = await connection_1.default('work_points').where({
            employee_id: userId,
            date: dayjs_1.default(date).format('YYYY-MM-DD HH:mm:ss'),
        });
        if (consultDate.length > 0) {
            return response.status(400).json({
                error: 'Horarios deste dia já foram inseridos'
            });
        }
        try {
            const newWorkPoint = await connection_1.default('work_points').insert({
                employee_id: userId,
                date: dayjs_1.default(date).format('DD-MM-YYYY'),
                entry,
                lunchLeave,
                lunchEntry,
                leave,
                workedHours: sumWorkedHours_1.default(entry, lunchLeave, lunchEntry, leave)
            });
            const workPointCreated = await connection_1.default('work_points').where('id', '=', newWorkPoint);
            return response.status(201).json({
                status: 'success',
                data: workPointCreated[0]
            });
        }
        catch (err) {
            return response.status(400).json({
                error: 'Falha ao adicionar Dia de Trablaho',
                data: err
            });
        }
    }
    async index(request, response) {
        const { startDate, finalDate } = request.query;
        //@ts-ignore
        const userId = request.userId;
        const employee = await connection_1.default('employees').where('id', '=', Number(userId));
        let fDate;
        if (startDate && !finalDate) {
            fDate = dayjs_1.default();
        }
        else {
            fDate = finalDate;
        }
        if (employee.length > 0) {
            let employeeWorkDays = await connection_1.default('work_points').where('employee_id', '=', Number(userId));
            if (employeeWorkDays.length > 0) {
                if (startDate) {
                    //@ts-ignore
                    const startAux = dayjs_1.default(startDate, 'DD/MM/YYYY');
                    //@ts-ignore
                    const endAux = dayjs_1.default(fDate, 'DD/MM/YYYY');
                    const filtered = employeeWorkDays.filter((item) => {
                        const auxItem = dayjs_1.default(item.date, 'DD/MM/YYYY');
                        if (dayjs_1.default(endAux).isSameOrAfter(auxItem) && dayjs_1.default(startAux).isSameOrBefore(auxItem)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    employeeWorkDays = filtered;
                }
                return response.status(200).json({
                    user: Object.assign(Object.assign({}, employee[0]), { workedDays: employeeWorkDays }),
                });
            }
            else {
                return response.status(200).json({
                    user: Object.assign(Object.assign({}, employee[0]), { error: 'Usuário ainda não possui registro de horas trabalhadas' })
                });
            }
        }
        else {
            return response.status(400).json({
                error: 'Usuário não cadastrado'
            });
        }
    }
}
exports.default = WorkPointsController;
