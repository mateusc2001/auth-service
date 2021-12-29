import app from './app';

const port = 1900;

app.listen(port);

app.post('/perifericos/v1/tef/pinpad/le-senha', (req, res) => {
    const response = {
        senha: "1908"
    };
    res.json(response);
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