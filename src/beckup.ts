this.route.post('/perifericos/v1/tef/pinpad/le-senha', (req, res) => {
    const response = {
        senha: "1908"
    };
    res.json(response);
});

this.route.get('/perifericos/v1/tef/pinpad/le-trilhas-cartao', (req, res) => {
    const response = {
        trilha2: "0291029392019293"
    };
    res.json(response);
});

this.route.post('/pagamento/condicoes', (req, res) => {
    console.log(req.body);
    const response = [
        {
            "primeiroPagamento": 250, // firstPayments
            "descricaoParcelas": "1 x R$250,00",
            "codigoCondicaoPagamento": 1, // paymentConditionCode
            "sequenciaCondicaoPagamento": 2, // paymentConditionSequence,
            "codigoConvenio": 1, // covenantCode
            "tipoParcela": 2 // installmentType
        },
        {
            "primeiroPagamento": 250, // firstPayments
            "descricaoParcelas": "2 x R$125,00",
            "codigoCondicaoPagamento": 2, // paymentConditionCode
            "sequenciaCondicaoPagamento": 2, // paymentConditionSequence,
            "codigoConvenio": 1, // covenantCode
            "tipoParcela": 2 // installmentType
        },
        {
            "primeiroPagamento": 250, // firstPayments
            "descricaoParcelas": "3 x R$105,00",
            "codigoCondicaoPagamento": 3, // paymentConditionCode
            "sequenciaCondicaoPagamento": 2, // paymentConditionSequence,
            "codigoConvenio": 1, // covenantCode
            "tipoParcela": 2 // installmentType
        },
        {
            "primeiroPagamento": 250, // firstPayments
            "descricaoParcelas": "4 x R$85,00",
            "codigoCondicaoPagamento": 4, // paymentConditionCode
            "sequenciaCondicaoPagamento": 2, // paymentConditionSequence,
            "codigoConvenio": 1, // covenantCode
            "tipoParcela": 2 // installmentType
        }
    ];
    res.json(response);
});








export const getUltimasImpressoes = (provedorId) => {
    const agora = getActualDate();
    const menos24Horas = new Date(getActualDate().setDate(agora.getDate() - 7));
    const response = provedoresIspForce.find(item => item.provedorId == provedorId).metricas.impressoes.filter((item: any) => {
        const dateTime = new Date(item.dateTime);
        return dateTime.getTime() >= menos24Horas.getTime() && dateTime.getTime() <= agora.getTime();
    });
    return response;
};

export const getUltimasConversas = (provedorId) => {
    const agora = getActualDate();
    const menos24Horas = new Date(getActualDate().setDate(agora.getDate() - 7));
    const response = provedoresIspForce.find(item => item.provedorId == provedorId).metricas.conversas.filter((item: any) => {
        const dateTime = new Date(item.dataInicio);
        return dateTime.getTime() >= menos24Horas.getTime() && dateTime.getTime() <= agora.getTime();
    });
    return response;
};

export const getPercentualNaEtapa = (conversas, etapa) => {
    const conversasFnais = conversas.filter(conversa => !!conversa.etapas && conversa.etapas.length > 0 && conversa.etapas[conversa.etapas.length - 1].etapa == etapa);
    return Number((conversasFnais.length * 100 / conversas.length).toFixed(2));
}

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers["app-token"];
    let jwtPayload;
    try {
        jwtPayload = <any>jwt.verify(token, config.default.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        res.status(401).json({error: "Invalid token."});
        return;
    }
    next();
}

export const createToken = (res: Response, next: NextFunction, user: UserModel) => {
    const id = user.id;
    const newToken = jwt.sign({id}, config.default.jwtSecret, {
        expiresIn: 60000
    });
    res.json({token: newToken, user: user});
    next();
}

export async function findUserByUsername(username): Promise<UserModel> {
    const baseUrl = 'http://localhost:2020/v2/user/username/' + username;
    return await http.get(baseUrl);
}

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

export const buildUser = (user, data) => {
    return {
        id: user.id,
        nomeCompleto: user.nomeCompleto,
        usuario: user.usuario,
        dataCriacao: !!data ? user.dataCriacao : getActualDate(),
        saldo: user.saldo,
        base64image: user.base64image
    }
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
