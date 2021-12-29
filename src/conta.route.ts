import { Router } from 'express'


export const getActualDate = () => {
    const offset = -3;
    return new Date(new Date().getTime() + offset * 3600 * 1000);
}

export const getHash = () => {
    const stringToHash = (Math.floor(Math.random() * 1000) + 1).toString();
    var hash = 0, i, chr;
    if (stringToHash.length === 0) return hash;
    for (i = 0; i < stringToHash.length; i++) {
        chr = stringToHash.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }

    return hash;
}

export const pagination = (list, page, count) => {
    const totalPages = list.length / count;
    const result = {
        totalResults: list.length,
        totalPages: Math.ceil(totalPages),
        data: list.slice((page - 1) * count, page * count)
    };
    return result;
}

const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}


let contasList = [
    {
        "id": 49588,
        "dataCriacao": "2021-08-19T10:41:54.305Z",
        "dataFinal": "2021-09-09T03:00:00.000Z",
        "descricao": "luz",
        "valor": "1000",
        "pagar": true,
        "finalizado": true,
        idUsuario: 1
    },
    {
        "id": 48843,
        "dataCriacao": "2021-08-19T10:49:54.249Z",
        "dataFinal": "2021-01-09T03:00:00.000Z",
        "descricao": "asd",
        "valor": "123",
        "pagar": false,
        "finalizado": false,
        idUsuario: 1
    }
];

class Routes {
    public contaRoute = Router();

    constructor() {

        this.contaRoute.get('/vencimento-hoje', (req, res) => {
            const response = {
                contasPagarHoje: contasList.filter(item => item.pagar && isToday(item.dataFinal)).length,
                contasReceberHoje: contasList.filter(item => !item.pagar && isToday(item.dataFinal)).length
            };
            res.json(response);
        });

        // Contas a pagar
        this.contaRoute.get('/pagar/page/:page/count/:count', (req, res) => {
            const page = req.params.page;
            const count = req.params.count;
            res.json(pagination(contasList.filter(item => item.pagar), page, count));
        });

        this.contaRoute.post('/pagar', (req, res) => {
            const novoPlano: any = ContasMapper.mapNovaContaPagar(req.body);
            contasList.push(novoPlano);
            res.json(novoPlano);
        });

        this.contaRoute.patch('/pagar/finalizar/:id', (req, res) => {
            const conta = contasList.find((item: any) => item.id == req.params.id);

            if (!!conta) {
                conta.finalizado = true;
                res.json(conta);
            } else {
                res.status(404).json(
                    {
                        message: 'Registro não encontrado.'
                    }
                );
            }
        });

        // Contas a receber
        this.contaRoute.get('/receber/page/:page/count/:count', (req, res) => {
            const page = req.params.page;
            const count = req.params.count;
            res.json(pagination(contasList.filter(item => !item.pagar), page, count));
        });

        this.contaRoute.post('/receber', (req, res) => {
            const novoPlano: any = ContasMapper.mapNovaContaReceber(req.body);
            contasList.push(novoPlano);
            res.json(novoPlano);
        });

        this.contaRoute.patch('/receber/finalizar/:id', (req, res) => {
            const conta = contasList.find((item: any) => item.id == req.params.id);

            if (!!conta) {
                conta.idUsuario
                conta.finalizado = true;
                res.json(conta);
            } else {
                res.status(404).json(
                    {
                        message: 'Registro não encontrado.'
                    }
                );
            }
        });
    }
}

export default new Routes().contaRoute


class ContasMapper {


    public static mapNovaContaPagar(novaContaPagar) {
        console.log(novaContaPagar.contaFixa);
        return {
            id: getHash(),
            dataCriacao: getActualDate(),
            dataFinal: new Date(novaContaPagar.dataFinal),
            descricao: novaContaPagar.descricao,
            valor: novaContaPagar.valor,
            pagar: true,
            finalizado: false,
            idUsuario: novaContaPagar.idUsuario,
            contaFixa: novaContaPagar.contaFixa
        }
    }

    public static mapNovaContaReceber(novaContaReceber) {
        return {
            id: getHash(),
            dataCriacao: getActualDate(),
            dataFinal: new Date(novaContaReceber.dataFinal),
            descricao: novaContaReceber.descricao,
            valor: novaContaReceber.valor,
            pagar: false,
            finalizado: false,
            idUsuario: novaContaReceber.idUsuario,
            contaFixa: novaContaReceber.contaFixa
        }
    }
}