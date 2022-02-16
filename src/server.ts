import app from './app';

const port = 1900;

app.listen(port);

enum AtividadeEnum {
    SENHA_CORRETA = 1,
    SENHA_INCORRETA = 2,
    ERRO = 3
}

app.put('/teste', (req, res) => {
    console.log(req.body);
    res.json();
});

const senhaIncorreta = "so8WdZVAxUV0vocKBMvJoihBUe5AvjqwonDWjCsnygN0LtGyltcEYmMS7lrzCT55xRKdUKMJjvZBdMdu6GN8Z9HWwANFFOAKYf9+25G+uiqvk1gcjppfuISA4fymzCrueSPRBwubQbXDMVOPxtClu8y4sZv4mQJb7OY4hIx9VKNfp3Z3Iw1Cy25Vm9s2ILeW5eDElKTfcXM0as8zmOtDDtcIal1q+X6sjpXJ84lBXaNjxW67zng9Lvs4G/xdFBEQRV5jpn1Si+fgW7THHb5FU7hWf4E4GBXOu+H03Mawb1BdgNfYqdrIhs6xIyuBml/5MCI/JfxpaitTcir8JJvYkQ==";
const senhaCorreta = "pn0vyHVVMenMOXEpftW1mFLHwpgRlMQbiqrw6q51TIIbO3L+/Vh1yBAOQPP8PHfrh1PHZHEERfSKdMIXefzygc66nNMGXmvWShV4EHj6jnJcExVu0gE65yznD/Dx7i7YUEAF2iBRYnTj9IAjSsNCFMemHGHGHxhUe1gtFjhg3wGTFFBVF+sJgwgI89mcevcK9YgERmEZXUgZDo7Xr5KdA0DBoC6fHUDC9m3cKzkyKxZjjSV8IE/LW8pi6QjbNDBo4fu6QMoxTCzGz0wsqzRn4DJAB6Vlo+7MgwgU7euHFVRbjLP6LtIs0pDVg31X0V19rFm65cRo0m64um3XZxjOmQ==";

function getSenhaCorretaResponse(statusCode) {
    return {
        statusCode: statusCode ? statusCode : 200,
        data: {
            senha: senhaCorreta
        }
    }
}

function getSenhaIncorretaResponse(statusCode) {
    return {
        statusCode: statusCode ? statusCode : 401,
        data: {
            senha: senhaIncorreta
        }
    }
}

function getErro(statusCode) {
    return {
        statusCode: statusCode ? statusCode : 501,
        data: [
            {
                "code": null,
                "message": "REALIZE Senha inválida. Cliente ainda possui 1 tentativa(s).",
                "detail": "INVALID_PASSWORD",
                "field": null
            }
        ]
    }
}

let tentativas = 3;

app.post('/pedido', (req, res) => {
    tentativas--;
    res.status(412).json([
        {
            "code": null,
            "message": tentativas > 0 ? `REALIZE Senha inválida. Cliente ainda possui ${tentativas} tentativa(s).` : `Cartão bloqueado.`,
            "detail": "INVALID_PASSWORD",
            "field": null
        }
    ]);
});

app.post('/perifericos/v1/tef/pinpad/le-senha', (req, res) => {
    const atividade: number = AtividadeEnum.SENHA_CORRETA;
    const statusCode: number = 200;

    let response = null;

    switch (atividade) {
        case AtividadeEnum.SENHA_CORRETA:
            response = getSenhaCorretaResponse(statusCode);
            break;
        case AtividadeEnum.SENHA_INCORRETA:
            response = getSenhaIncorretaResponse(statusCode);
            break;
        case AtividadeEnum.ERRO:
            response = getErro(statusCode);
            break;
        default:
            break;
    }

    res.status(response.statusCode).json(response.data);
});

app.get('/perifericos/v1/tef/pinpad/le-trilhas-cartao', (req, res) => {
    const response = {
        trilha2: "0291029392019293"
    };
    res.json(response);
});

app.post('/pagamento/condicoes', (req, res) => {
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



app.get('/cpf/:tipo/:matricula', (req, res) => {
    const params = req.params;
    console.log(params.tipo, params.matricula);
    res.json({
        cpf: '03362354025'
    });

    // 670160
});


function write(texto: any[]) {
    let current = texto.shift()
    setTimeout(() => {
        console.log(current)
        write(texto)
    }, 1000)
}
console.log('Serviço de autenticação rodando na porta', port);

// console.log('');
// console.log('');
// console.log('');
// console.log('');
// console.log('');
// console.log('');

// console.log('                               0101010101010110010101011010010101010101010101        111110010101100101010110100101010101111110');
// console.log('                               0101010101010110010101011010010101010101010101        111110010101100101010110100101010101111110');
// console.log('                               0101010101010110010101011010010101010101010101        111110010101100101010110100101010101111110');
// console.log('                               0101010101                          0101010101        1111100101                                ');
// console.log('                               0101010101                          0101010101        1111100101                                ');
// console.log('                               0101010101                          0101010101        1111100101                                ');
// console.log('                               0101010101                          0101010101        1111100101                                ');
// console.log('                               0101010101                          0101010101        1111100101                                ');
// console.log('                               0101010101                          0101010101        1111100101                                ');
// console.log('                               0101010101                          0101010101        111110010101100101010110100101010101111110');
// console.log('                               0101010101                          0101010101        111110010101100101010110100101010101111110');
// console.log('                               0101010101                          0101010101        111110010101100101010110100101010101111110');
// console.log('                               0101010101                          0101010101        111110010101100101010110100101010101111110');
// console.log('                               0101010101                          0101010101        111110010101100101010110100101010101111110');
// console.log('                               0101010101                          0101010101                                        0101111110');
// console.log('                               0101010101                          0101010101                                        0101111110');
// console.log('                               0101010101                          0101010101                                        0101111110');
// console.log('                               0101010101                          0101010101                                        0101111110');
// console.log('                               0101010101                          0101010101                                        0101111110');
// console.log('                               0101010101                          0101010101                                        0101111110');
// console.log('                               0101010101010110010101011010010101010101010101        111110010101100101010110100101010101111110');
// console.log('                               0101010101010110010101011010010101010101010101        111110010101100101010110100101010101111110');
// console.log('                               0101010101010110010101011010010101010101010101        111110010101100101010110100101010101111110');
// console.log('                               0101010101010110010101011010010101010101010101        111110010101100101010110100101010101111110');

// console.log('');
// console.log('');
// console.log('');
// console.log('');
// console.log('');
// console.log('');