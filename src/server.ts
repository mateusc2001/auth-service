import app from './app';

const port = 1900;

app.listen(port);
app.get('/cupom-ativacao/recomendados/:cpf', (req, res) => {
    const response = [
        {
            "couponId": 999999,
            "walletId": 10101010,
            "description": "disconto percentual",
            "discountType": "PERCENTAGE_DISCOUNT",
            "discountPercentage": 15.0,
            "includeDate": "30/07/2021 15:08:29",
            "expireDate": "31/07/2021 23:59:00",
            "couponAvailable": 10,
            "itemsId": [
                683950,
                683960,
                683970
            ],
            "endDate": "31/07/2021 23:59:00",
            "title": "disconto percentual",
            "rules": "Válido no canal Loja. Disponibilidade de 10 utilizações na rede. Limitado a 10 utilizações por CPF.",
            "automaticApplyInCart": true
        },
        {
            "couponId": 888888,
            "walletId": 1111111,
            "description": "Desconto Dorflex",
            "discountType": "PERCENTAGE_DISCOUNT",
            "discountPercentage": 25.0,
            "includeDate": "30/07/2021 14:29:55",
            "expireDate": "07/08/2021 23:59:00",
            "itemsId": [
                118247
            ],
            "endDate": "07/08/2021 23:59:00",
            "title": "Desconto Dorflex",
            "rules": "Válido no canal Loja.",
            "automaticApplyInCart": true
        }
    ];
    res.json(response);
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
// write([
//     '                               0101010101010110010101011010010101010101010101                   111010101011010111110          ',
//     '                               0101010101010110010101011010010101010101010101                   111010101011010111110          ',
//     '                               0101010101010110010101011010010101010101010101                   111010101011010111110          ',
//     '                               0101010101010110010101011010010101010101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111011010110101111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101                          0101010101                   111010101011010111110          ',
//     '                               0101010101010110010101011010010101010101010101                   111010101011010111110          ',
//     '                               0101010101010110010101011010010101010101010101        111110010101100101010110100101010101111110',
//     '                               0101010101010110010101011010010101010101010101        111110010101100101010110100101010101111110',
//     '                               0101010101010110010101011010010101010101010101        111110010101100101010110100101010101111110'
// ]);
// console.log('');
// console.log('');
// console.log('');
// console.log('');
// console.log('');
// console.log('');