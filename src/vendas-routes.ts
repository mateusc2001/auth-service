import { Builder } from 'builder-pattern';
import { Router } from 'express'

export const getActualDate = () => {
    const offset = -3;
    return new Date(new Date().getTime() + offset * 3600 * 1000);
}

export const getHash = () => {
    const stringToHash = (Math.floor(Math.random() * 1000) + 1).toString();
    var hash = 0, i, chr;
    if (stringToHash.length === 0) return hash.toString();
    for (i = 0; i < stringToHash.length; i++) {
        chr = stringToHash.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }

    return hash.toString();
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

let veiculos: VeiculoModel[] = [];

veiculos.push(
    Builder<VeiculoModel>()
        .id(getHash())
        .placa('DCR-9337')
        .renavan('102939102930192')
        .valorCompra(5.900)
        .build()
);

class Routes {
    public vendasRoute = Router();

    constructor() {

        this.vendasRoute.get('/page/:page/count/:count', (req, res) => {
            const page = req.params.page;
            const count = req.params.count;
            res.json(pagination(veiculos, page, count));
        });

    }
}

export default new Routes().vendasRoute


class VeiculoModel {
    constructor(
        public id: string,
        public placa: string,
        public renavan: string,
        public valorCompra: number,
        public despesas: DespesaModel[]
    ) { }
}


class DespesaModel {
    constructor(
        public id: string,
        public valor: string,
        public descricao: string,
        public nomeLoja: string,
        public enderecoLoja: string
    ) { }
}