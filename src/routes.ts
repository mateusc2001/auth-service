import { Router, NextFunction, Response, Request, request } from 'express'
import { UserModel } from './model/user.model';
import * as config from './config/config';
import * as jwt from "jsonwebtoken";
import { UserSchema } from "./schemas/user.schema";
import * as http from "request-promise-native";
import { isNonNullExpression } from 'typescript';

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


let contasList = [];

let carros = [
    {
      id: 123,
      modelo: 'Astra',
      placa: 'IHJ8H6S',
      cor: 'Vermelho',
      despesas: [
        
      ]
    },
    {
      id: 2837,
      modelo: 'Celta',
      placa: 'JS827DH',
      cor: 'Branco',
      despesas: [
        
      ]
    }
  ];
let registros = [];
let registrosCaixa = [];
// registros = [
//     {
//         "banco": 3,
//         "data": "31/08/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 433.99,
//         "id": 56567,
//         "dataCriacao": "2021-12-12T23:21:01.325Z",
//         "transacao": {
//             "idUsuarioOrigem": 2,
//             "idUsuarioDestinatario": 3,
//             "geraComissao": false,
//             "porcentagemComissao": null,
//             "valorComissao": null
//         }
//     },
//     {
//         "banco": 3,
//         "data": "01/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 433.99,
//         "id": 53524,
//         "dataCriacao": "2021-12-12T23:21:01.325Z",
//         "transacao": {
//             "idUsuarioOrigem": 1,
//             "idUsuarioDestinatario": 3,
//             "geraComissao": false,
//             "porcentagemComissao": null,
//             "valorComissao": null
//         }
//     },
//     {
//         "banco": 3,
//         "data": "02/09/2020",
//         "descricao": "TAR PACOTE ITAU   AGO/20",
//         "documento": "",
//         "entrada": false,
//         "valor": -76.9,
//         "id": 56384,
//         "dataCriacao": "2021-12-12T23:21:01.325Z",
//         "transacao": {
//             "idUsuarioOrigem": 1,
//             "idUsuarioDestinatario": 2,
//             "geraComissao": false,
//             "porcentagemComissao": null,
//             "valorComissao": null
//         }
//     },
//     {
//         "banco": 3,
//         "data": "02/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 357.09,
//         "id": 51730,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "03/09/2020",
//         "descricao": "RSHOP-PMP DROGARI-03/09",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -70.72,
//         "id": 51610,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "03/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 286.37,
//         "id": 54679,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "04/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 286.37,
//         "id": 54454,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "08/09/2020",
//         "descricao": "RSHOP-DU FORNO   -08/09",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -65,
//         "id": 54492,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "08/09/2020",
//         "descricao": "RSHOP-FARMACIAS S-08/09",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -19.8,
//         "id": 49840,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "08/09/2020",
//         "descricao": "INT VIVO FIXO NAC 13 899",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -124.98,
//         "id": 51669,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "08/09/2020",
//         "descricao": "INT VIVO-RS 1103919498",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -54.99,
//         "id": 49837,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "08/09/2020",
//         "descricao": "TBI 3003.13368-7     C/C",
//         "documento": "4175",
//         "entrada": true,
//         "valor": 1134,
//         "id": 50648,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "08/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1155.6,
//         "id": 54677,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "09/09/2020",
//         "descricao": "INT  PAG TIT BANCO 104",
//         "documento": "9126",
//         "entrada": false,
//         "valor": -169.95,
//         "id": 50583,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "09/09/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 985.65,
//         "id": 56444,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "09/09/2020",
//         "descricao": "RSHOP-PAG*Gonzalo-09/09",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -105,
//         "id": 48723,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "09/09/2020",
//         "descricao": "TED 033.1102RENATO B AUT",
//         "documento": "",
//         "entrada": true,
//         "valor": 115,
//         "id": 1788,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "09/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 995.65,
//         "id": 51634,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "10/09/2020",
//         "descricao": "CAP     UNICLASS   43/48",
//         "documento": "",
//         "entrada": false,
//         "valor": -114.61,
//         "id": 1698,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "10/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 881.04,
//         "id": 1637,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "11/09/2020",
//         "descricao": "INT TED  022545",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -149,
//         "id": 53437,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "11/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 732.04,
//         "id": 51671,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/09/2020",
//         "descricao": "RSHOP-BK LANCHES -12/09",
//         "documento": "6501",
//         "entrada": false,
//         "valor": -36.8,
//         "id": 56600,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/09/2020",
//         "descricao": "RSHOP-FARMACOMED -12/09",
//         "documento": "6509",
//         "entrada": false,
//         "valor": -26.97,
//         "id": 55570,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/09/2020",
//         "descricao": "RSHOP-NATUREBA   -12/09",
//         "documento": "6501",
//         "entrada": false,
//         "valor": -100.72,
//         "id": 54546,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/09/2020",
//         "descricao": "INT TED  939212",
//         "documento": "9132",
//         "entrada": false,
//         "valor": -39000,
//         "id": 54578,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/09/2020",
//         "descricao": "TBI 1444.63206-9",
//         "documento": "9121",
//         "entrada": false,
//         "valor": -50,
//         "id": 52532,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/09/2020",
//         "descricao": "TBI 1444.63205-1",
//         "documento": "9136",
//         "entrada": false,
//         "valor": -50,
//         "id": 56477,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/09/2020",
//         "descricao": "TBI 1444.01983-8",
//         "documento": "9925",
//         "entrada": false,
//         "valor": -100,
//         "id": 53495,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/09/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -38632.45,
//         "id": 54579,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/09/2020",
//         "descricao": "INT  PAG TIT BANCO 104",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -444.58,
//         "id": 1761,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/09/2020",
//         "descricao": "TED 033.1102RENATA CORUJ",
//         "documento": "",
//         "entrada": true,
//         "valor": 231,
//         "id": 53589,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/09/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -38846.03,
//         "id": 55570,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "15/09/2020",
//         "descricao": "TED 033.1102RENATO B AUT",
//         "documento": "",
//         "entrada": true,
//         "valor": 4000,
//         "id": 51608,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "15/09/2020",
//         "descricao": "TED 654.0001RENATO BAR A",
//         "documento": "",
//         "entrada": true,
//         "valor": 35000,
//         "id": 1817,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "15/09/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 153.97,
//         "id": 1606,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "18/09/2020",
//         "descricao": "RSHOP-PAG*NeriEdu-18/09",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -85,
//         "id": 56438,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "18/09/2020",
//         "descricao": "TBI 3003.13368-7     C/C",
//         "documento": "4175",
//         "entrada": true,
//         "valor": 400,
//         "id": 52568,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "18/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 468.97,
//         "id": 55483,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "21/09/2020",
//         "descricao": "RSHOP-PAG*MirianL-21/09",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -60.22,
//         "id": 54489,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "21/09/2020",
//         "descricao": "RSHOP-QUADROS E F-21/09",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -70,
//         "id": 54493,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "21/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 338.75,
//         "id": 53434,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "22/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 338.75,
//         "id": 49654,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "23/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 338.75,
//         "id": 54546,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "24/09/2020",
//         "descricao": "INT TED  055510",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -23805,
//         "id": 52718,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "24/09/2020",
//         "descricao": "INT TED  067585",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -16500,
//         "id": 51548,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "24/09/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -39966.25,
//         "id": 53560,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "25/09/2020",
//         "descricao": "TBI 6616.18170-4     C/C",
//         "documento": "4175",
//         "entrada": true,
//         "valor": 16500,
//         "id": 56313,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "25/09/2020",
//         "descricao": "TED 033.1102RENATO B AUT",
//         "documento": "",
//         "entrada": true,
//         "valor": 3805,
//         "id": 52721,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "25/09/2020",
//         "descricao": "TED 033.1102RENATO B AUT",
//         "documento": "",
//         "entrada": true,
//         "valor": 20000,
//         "id": 50738,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "25/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 338.75,
//         "id": 50803,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "28/09/2020",
//         "descricao": "INT RGE SU 91000830",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -182.43,
//         "id": 49842,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "28/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 156.32,
//         "id": 52749,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "29/09/2020",
//         "descricao": "RSHOP-SUPERMERCAD-29/09",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -41.39,
//         "id": 53652,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "29/09/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 114.93,
//         "id": 55573,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/09/2020",
//         "descricao": "INT TED  795778",
//         "documento": "9014",
//         "entrada": false,
//         "valor": -37574,
//         "id": 55513,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/09/2020",
//         "descricao": "INT GPS10766274000417",
//         "documento": "9014",
//         "entrada": false,
//         "valor": -1225.42,
//         "id": 50705,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/09/2020",
//         "descricao": "INT DARF920978151136",
//         "documento": "9014",
//         "entrada": false,
//         "valor": -199.19,
//         "id": 1572,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/09/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -38883.68,
//         "id": 50640,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "02/10/2020",
//         "descricao": "TAR PACOTE ITAU   SET/20",
//         "documento": "6616",
//         "entrada": false,
//         "valor": -76.9,
//         "id": 49836,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "02/10/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -38960.58,
//         "id": 53529,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "05/10/2020",
//         "descricao": "TED 033.1102RENATO B AUT",
//         "documento": "",
//         "entrada": true,
//         "valor": 39000,
//         "id": 55509,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "06/10/2020",
//         "descricao": "RSHOP-ALICE'S PIZ-06/10",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -64,
//         "id": 55385,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "06/10/2020",
//         "descricao": "RSHOP-FABIUS PUB -06/10",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -82.7,
//         "id": 52571,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "06/10/2020",
//         "descricao": "TBI 3003.13368-7",
//         "documento": "9129",
//         "entrada": true,
//         "valor": 1000,
//         "id": 56379,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "06/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 892.72,
//         "id": 55358,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "07/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 892.72,
//         "id": 52601,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "08/10/2020",
//         "descricao": "RSHOP-D MONTAO BU-08/10",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -46,
//         "id": 56474,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "08/10/2020",
//         "descricao": "TED 033.1102RENATO B AUT",
//         "documento": "",
//         "entrada": true,
//         "valor": 115,
//         "id": 1660,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "08/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 961.72,
//         "id": 54396,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "09/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 961.72,
//         "id": 55600,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/10/2020",
//         "descricao": "RSHOP-MP *SEMPRE -12/10",
//         "documento": "6501",
//         "entrada": false,
//         "valor": -71.42,
//         "id": 53527,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/10/2020",
//         "descricao": "RSHOP-FARMACIAS S-12/10",
//         "documento": "6509",
//         "entrada": false,
//         "valor": -23.61,
//         "id": 56502,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/10/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 866.69,
//         "id": 52469,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/10/2020",
//         "descricao": "CAP     UNICLASS   44/48",
//         "documento": "6616",
//         "entrada": false,
//         "valor": -114.61,
//         "id": 50582,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 752.08,
//         "id": 52692,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 752.08,
//         "id": 50828,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "15/10/2020",
//         "descricao": "TBI 1444.63205-1",
//         "documento": "9779",
//         "entrada": false,
//         "valor": -50,
//         "id": 54458,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "15/10/2020",
//         "descricao": "TBI 1444.63206-9",
//         "documento": "9029",
//         "entrada": false,
//         "valor": -50,
//         "id": 1699,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "15/10/2020",
//         "descricao": "TBI 1444.01983-8",
//         "documento": "9136",
//         "entrada": false,
//         "valor": -100,
//         "id": 52748,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "15/10/2020",
//         "descricao": "INT CORSAN-PAC 393900",
//         "documento": "9014",
//         "entrada": false,
//         "valor": -99.46,
//         "id": 1822,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "15/10/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 452.62,
//         "id": 54489,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "16/10/2020",
//         "descricao": "RSHOP-AUTO POSTO -16/10",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -36.21,
//         "id": 51638,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "16/10/2020",
//         "descricao": "RSHOP-BOUTIQUE DO-16/10",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -19.8,
//         "id": 50739,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "16/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 396.61,
//         "id": 49806,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "19/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 396.61,
//         "id": 54641,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "20/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 396.61,
//         "id": 50771,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "21/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 396.61,
//         "id": 1567,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "22/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 396.61,
//         "id": 52534,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "22/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 396.61,
//         "id": 52661,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "23/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 396.61,
//         "id": 48752,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "26/10/2020",
//         "descricao": "RSHOP-BK LANCHES -24/10",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -19.9,
//         "id": 52662,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "26/10/2020",
//         "descricao": "RSHOP-FARMACIAS S-25/10",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -20.7,
//         "id": 53495,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "26/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 356.01,
//         "id": 48907,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "27/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 356.01,
//         "id": 55541,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "28/10/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 356.01,
//         "id": 56,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "29/10/2020",
//         "descricao": "INT TED  887827",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -4000,
//         "id": 1823,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "29/10/2020",
//         "descricao": "DOC 033.4444ASSOC EDUCAD",
//         "documento": "",
//         "entrada": true,
//         "valor": 917.7,
//         "id": 48906,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "29/10/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -2726.29,
//         "id": 54492,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "29/10/2020",
//         "descricao": "(-) SALDO A LIBERAR",
//         "documento": "",
//         "entrada": true,
//         "valor": 917.7,
//         "id": 49744,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "29/10/2020",
//         "descricao": "SALDO FINAL DEVEDOR",
//         "documento": "",
//         "entrada": false,
//         "valor": -3643.99,
//         "id": 56538,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/10/2020",
//         "descricao": "INT RGE SU 91000830",
//         "documento": "9014",
//         "entrada": false,
//         "valor": -238.42,
//         "id": 48725,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/10/2020",
//         "descricao": "INT TED D   144792",
//         "documento": "9127",
//         "entrada": false,
//         "valor": -917,
//         "id": 51671,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/10/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -3881.71,
//         "id": 56321,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/10/2020",
//         "descricao": "TED 033.1102RENATO B AUT",
//         "documento": "",
//         "entrada": true,
//         "valor": 4000,
//         "id": 52686,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/10/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 118.29,
//         "id": 51632,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "03/11/2020",
//         "descricao": "RSHOP-FRUTEIRA E -31/10",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -46.82,
//         "id": 52754,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "03/11/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 71.47,
//         "id": 48820,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "04/11/2020",
//         "descricao": "TAR PACOTE ITAU   OUT/20",
//         "documento": "",
//         "entrada": false,
//         "valor": -79.5,
//         "id": 56600,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "04/11/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -8.03,
//         "id": 50741,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "05/11/2020",
//         "descricao": "TBI 3003.13368-7     C/C",
//         "documento": "4175",
//         "entrada": true,
//         "valor": 500,
//         "id": 52537,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "05/11/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 491.97,
//         "id": 49687,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "06/11/2020",
//         "descricao": "RSHOP-SIM RS 030 -06/11",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -98.82,
//         "id": 49772,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "06/11/2020",
//         "descricao": "TED 033.1102RENATO B AUT",
//         "documento": "",
//         "entrada": true,
//         "valor": 115,
//         "id": 48626,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "06/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 508.15,
//         "id": 54461,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "09/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 508.15,
//         "id": 55387,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "10/11/2020",
//         "descricao": "CAP     UNICLASS   45/48",
//         "documento": "6616",
//         "entrada": false,
//         "valor": -114.61,
//         "id": 56508,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "10/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 393.54,
//         "id": 49711,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "11/11/2020",
//         "descricao": "INT PAG TIT 886940363478",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -1239.05,
//         "id": 51790,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "11/11/2020",
//         "descricao": "TBI 1444.42661-1     C/C",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -23500,
//         "id": 53682,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "11/11/2020",
//         "descricao": "INT TED  807739",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -40000,
//         "id": 49652,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "11/11/2020",
//         "descricao": "TED 654.0001RENATO BAR A",
//         "documento": "",
//         "entrada": true,
//         "valor": 40000,
//         "id": 50647,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "11/11/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -24345.51,
//         "id": 48812,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/11/2020",
//         "descricao": "TBI 3003.13368-7     C/C",
//         "documento": "4175",
//         "entrada": true,
//         "valor": 1240,
//         "id": 52471,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/11/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -23105.51,
//         "id": 50582,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/11/2020",
//         "descricao": "RSHOP-ALICE'S PIZ-13/11",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -71,
//         "id": 52632,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/11/2020",
//         "descricao": "TED 654.0001RENATO BAR A",
//         "documento": "",
//         "entrada": true,
//         "valor": 23500,
//         "id": 55638,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 323.49,
//         "id": 51609,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "16/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 323.49,
//         "id": 48752,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "17/11/2020",
//         "descricao": "RSHOP-BK LANCHES -17/11",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -19.9,
//         "id": 55477,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "17/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 303.59,
//         "id": 54678,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "18/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 303.59,
//         "id": 56534,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "19/11/2020",
//         "descricao": "RSHOP-SUMUP  *CLA-19/11",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -150,
//         "id": 55543,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "19/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 153.59,
//         "id": 51700,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "20/11/2020",
//         "descricao": "RSHOP-MAXXI ECON -20/11",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -39.8,
//         "id": 55544,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "20/11/2020",
//         "descricao": "TBI 3003.13368-7     C/C",
//         "documento": "4175",
//         "entrada": true,
//         "valor": 214,
//         "id": 53437,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "20/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 327.79,
//         "id": 53591,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "23/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 327.79,
//         "id": 50706,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "24/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 327.79,
//         "id": 54519,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "25/11/2020",
//         "descricao": "RSHOP-PAG*BkLanch-25/11",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -19.9,
//         "id": 56537,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "25/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 307.89,
//         "id": 55477,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "26/11/2020",
//         "descricao": "RSHOP-BK LANCHES -26/11",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -19.9,
//         "id": 51511,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "26/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 287.99,
//         "id": 55417,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "27/11/2020",
//         "descricao": "RSHOP-FORNO E BRA-27/11",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -75,
//         "id": 52593,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "27/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 212.99,
//         "id": 51667,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/11/2020",
//         "descricao": "RSHOP-AUTO POSTO -30/11",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -54.23,
//         "id": 50617,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/11/2020",
//         "descricao": "RSHOP-PAG*Assados-28/11",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -39,
//         "id": 56443,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/11/2020",
//         "descricao": "RSHOP-PAG*RLSORVE-28/11",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -47.98,
//         "id": 52470,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/11/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 71.78,
//         "id": 54516,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "01/12/2020",
//         "descricao": "INT TED  471409",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -28700,
//         "id": 55601,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "01/12/2020",
//         "descricao": "INT TED  495956",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -5000,
//         "id": 49750,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "01/12/2020",
//         "descricao": "INT TED  501239",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -5000,
//         "id": 55352,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "01/12/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -38628.22,
//         "id": 52723,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "02/12/2020",
//         "descricao": "RSHOP-SUMUP  *CLA-02/12",
//         "documento": "6501",
//         "entrada": false,
//         "valor": -100,
//         "id": 48873,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "02/12/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -38728.22,
//         "id": 48755,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "02/12/2020",
//         "descricao": "TBI 3003.13368-7",
//         "documento": "9026",
//         "entrada": true,
//         "valor": 200,
//         "id": 48811,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "02/12/2020",
//         "descricao": "TED 654.0001RENATO BAR A",
//         "documento": "",
//         "entrada": true,
//         "valor": 38700,
//         "id": 53592,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "02/12/2020",
//         "descricao": "TAR PACOTE ITAU   NOV/20",
//         "documento": "6616",
//         "entrada": false,
//         "valor": -79.5,
//         "id": 49808,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "02/12/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 92.28,
//         "id": 53654,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "03/12/2020",
//         "descricao": "TBI 3003.13368-7     C/C",
//         "documento": "4175",
//         "entrada": true,
//         "valor": 500,
//         "id": 49681,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "03/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 592.28,
//         "id": 51508,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "04/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 592.28,
//         "id": 50644,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "07/12/2020",
//         "descricao": "RSHOP-ASUN SUPERM-05/12",
//         "documento": "6509",
//         "entrada": false,
//         "valor": -99.9,
//         "id": 49874,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "07/12/2020",
//         "descricao": "RSHOP-AGROPECUARI-07/12",
//         "documento": "6501",
//         "entrada": false,
//         "valor": -136.9,
//         "id": 54640,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "07/12/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 355.48,
//         "id": 52500,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "07/12/2020",
//         "descricao": "INT VIVO FIXO NAC 13 899",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -142.81,
//         "id": 48720,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "07/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 212.67,
//         "id": 49623,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "08/12/2020",
//         "descricao": "TED 033.1102RENATO BAR",
//         "documento": "4320",
//         "entrada": true,
//         "valor": 115,
//         "id": 48628,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "08/12/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 327.67,
//         "id": 53680,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "09/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 327.67,
//         "id": 55541,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "10/12/2020",
//         "descricao": "RSHOP-SUPERMERCAD-10/12",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -51.73,
//         "id": 54425,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "10/12/2020",
//         "descricao": "TBI 6442.16041-9",
//         "documento": "9123",
//         "entrada": false,
//         "valor": -26500,
//         "id": 55607,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "10/12/2020",
//         "descricao": "CAP     UNICLASS   46/48",
//         "documento": "6616",
//         "entrada": false,
//         "valor": -114.61,
//         "id": 51571,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "10/12/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": false,
//         "valor": -26338.67,
//         "id": 1790,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "11/12/2020",
//         "descricao": "SISPAG  RENATO BAR AUT L",
//         "documento": "6616",
//         "entrada": true,
//         "valor": 26500,
//         "id": 1632,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "11/12/2020",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 161.33,
//         "id": 55480,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "15/12/2020",
//         "descricao": "TBI 3003.13368-7/500",
//         "documento": "4175",
//         "entrada": true,
//         "valor": 79000,
//         "id": 50705,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "15/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 79161.33,
//         "id": 48783,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "16/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 79161.33,
//         "id": 51572,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "17/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 79161.33,
//         "id": 50671,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "18/12/2020",
//         "descricao": "BO  PROMOCAO PIX RECEB",
//         "documento": "",
//         "entrada": true,
//         "valor": 5,
//         "id": 53530,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "18/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 79166.33,
//         "id": 54612,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "21/12/2020",
//         "descricao": "RSHOP-PEDRO TOFFO-19/12",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -36,
//         "id": 55355,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "21/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 79130.33,
//         "id": 56407,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "22/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 79130.33,
//         "id": 1725,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "23/12/2020",
//         "descricao": "RSHOP-BK LANCHES -23/12",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -21.9,
//         "id": 54518,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "23/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 79108.43,
//         "id": 51513,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "24/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 79108.43,
//         "id": 53624,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "28/12/2020",
//         "descricao": "RSHOP-RS FARMA   -27/12",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -19.71,
//         "id": 53557,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "28/12/2020",
//         "descricao": "INT  PAG TIT BANCO 033",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -2142.28,
//         "id": 1786,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "28/12/2020",
//         "descricao": "INT  PAG TIT BANCO 033",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -3342.71,
//         "id": 53686,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "28/12/2020",
//         "descricao": "REND PAGO APLIC AUT APR",
//         "documento": "",
//         "entrada": true,
//         "valor": 0.03,
//         "id": 49808,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "28/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 73603.76,
//         "id": 53592,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "29/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 73603.76,
//         "id": 55482,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "30/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 73603.76,
//         "id": 1723,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "31/12/2020",
//         "descricao": "TBI 3003.13368-7",
//         "documento": "9128",
//         "entrada": false,
//         "valor": -73514,
//         "id": 54524,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "31/12/2020",
//         "descricao": "REND PAGO APLIC AUT MAIS",
//         "documento": "",
//         "entrada": true,
//         "valor": 0.5,
//         "id": 50803,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "31/12/2020",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 90.26,
//         "id": 1725,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "04/01/2021",
//         "descricao": "RSHOP-AGROPECUARI-04/01",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -104.5,
//         "id": 51635,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "04/01/2021",
//         "descricao": "IOF",
//         "documento": "",
//         "entrada": false,
//         "valor": -252.17,
//         "id": 52565,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "05/01/2021",
//         "descricao": "TBI 3003.13368-7",
//         "documento": "9028",
//         "entrada": true,
//         "valor": 2000,
//         "id": 53625,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "05/01/2021",
//         "descricao": "TAR PACOTE ITAU   DEZ/20",
//         "documento": "6616",
//         "entrada": false,
//         "valor": -79.5,
//         "id": 1756,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "05/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1654.09,
//         "id": 1754,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "06/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1654.09,
//         "id": 52663,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "07/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1654.09,
//         "id": 1602,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "08/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1654.09,
//         "id": 53682,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "11/01/2021",
//         "descricao": "CAP     UNICLASS   47/48",
//         "documento": "",
//         "entrada": false,
//         "valor": -114.61,
//         "id": 50648,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "11/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1539.48,
//         "id": 56508,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "12/01/2021",
//         "descricao": "INT VIVO-RS 1103919498",
//         "documento": "9122",
//         "entrada": false,
//         "valor": -59.99,
//         "id": 54488,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "12/01/2021",
//         "descricao": "INT RGE SU 91000830",
//         "documento": "9779",
//         "entrada": false,
//         "valor": -285.76,
//         "id": 51765,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "12/01/2021",
//         "descricao": "INT VIVO FIXO NAC 13 899",
//         "documento": "9123",
//         "entrada": false,
//         "valor": -139.98,
//         "id": 49777,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "12/01/2021",
//         "descricao": "INT CORSAN-PAC 393900",
//         "documento": "9925",
//         "entrada": false,
//         "valor": -87.58,
//         "id": 51765,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "12/01/2021",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 966.17,
//         "id": 1600,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "12/01/2021",
//         "descricao": "PIX TRANSF  RENATA 12/01",
//         "documento": "9120",
//         "entrada": true,
//         "valor": 115,
//         "id": 53619,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "12/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1081.17,
//         "id": 52532,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/01/2021",
//         "descricao": "INT TED  412789",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -26500,
//         "id": 55631,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/01/2021",
//         "descricao": "TBI 3003.13368-7     C/C",
//         "documento": "4175",
//         "entrada": true,
//         "valor": 26500,
//         "id": 51602,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "13/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1081.17,
//         "id": 1638,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "14/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1081.17,
//         "id": 56568,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "15/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1081.17,
//         "id": 55480,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "18/01/2021",
//         "descricao": "TBI 1444.63205-1/500",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -100,
//         "id": 49774,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "18/01/2021",
//         "descricao": "TBI 1444.63206-9/500",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -100,
//         "id": 56347,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "18/01/2021",
//         "descricao": "TBI 1444.01983-8/500",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -200,
//         "id": 53714,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "18/01/2021",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 681.17,
//         "id": 48875,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "19/01/2021",
//         "descricao": "TBI 6442.22159-1     C/C",
//         "documento": "4175",
//         "entrada": false,
//         "valor": -32650,
//         "id": 1753,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "20/01/2021",
//         "descricao": "RSHOP-PONTO DAS P-20/01",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -69,
//         "id": 55361,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "20/01/2021",
//         "descricao": "TED 033.1102RENATO B AUT",
//         "documento": "",
//         "entrada": true,
//         "valor": 32650,
//         "id": 52534,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "20/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 612.17,
//         "id": 54674,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "21/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 612.17,
//         "id": 51641,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "22/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 612.17,
//         "id": 54675,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "25/01/2021",
//         "descricao": "RSHOP-PAG*PostoDi-24/01",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -82,
//         "id": 52,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "25/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 530.17,
//         "id": 48751,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "26/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 530.17,
//         "id": 49745,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "27/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 530.17,
//         "id": 53711,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "28/01/2021",
//         "descricao": "INT RGE SU 91000830",
//         "documento": "9132",
//         "entrada": false,
//         "valor": -160.28,
//         "id": 54677,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "28/01/2021",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 369.89,
//         "id": 54430,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "29/01/2021",
//         "descricao": "RSHOP-ELIZABETE M-29/01",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -46.9,
//         "id": 48749,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "29/01/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 322.99,
//         "id": 53556,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "01/02/2021",
//         "descricao": "IOF",
//         "documento": "",
//         "entrada": false,
//         "valor": -125.13,
//         "id": 49588,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "01/02/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 197.86,
//         "id": 55389,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "02/02/2021",
//         "descricao": "RSHOP-AUTO POSTO -02/02",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -45.39,
//         "id": 54640,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "02/02/2021",
//         "descricao": "TAR PACOTE ITAU   JAN/21",
//         "documento": "6616",
//         "entrada": false,
//         "valor": -79.5,
//         "id": 53555,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "02/02/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 72.97,
//         "id": 1601,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "03/02/2021",
//         "descricao": "RSHOP-AGROPECUARI-03/02",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -120.9,
//         "id": 51632,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "03/02/2021",
//         "descricao": "TBI 3003.13368-7     C/C",
//         "documento": "4175",
//         "entrada": true,
//         "valor": 2000,
//         "id": 53714,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "03/02/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1952.07,
//         "id": 52594,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "04/02/2021",
//         "descricao": "INT VIVO-RS 1103919498",
//         "documento": "9028",
//         "entrada": false,
//         "valor": -61.29,
//         "id": 1576,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "04/02/2021",
//         "descricao": "INT RGE SU 91000830",
//         "documento": "9953",
//         "entrada": false,
//         "valor": -214.48,
//         "id": 56380,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "04/02/2021",
//         "descricao": "SALDO DO DIA",
//         "documento": "",
//         "entrada": true,
//         "valor": 1676.3,
//         "id": 50585,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "04/02/2021",
//         "descricao": "RSHOP-PAG*NeriEdu-04/02",
//         "documento": "5934",
//         "entrada": false,
//         "valor": -90,
//         "id": 1816,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "04/02/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1586.3,
//         "id": 51639,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     },
//     {
//         "banco": 3,
//         "data": "05/02/2021",
//         "descricao": "SDO CTA/APL AUTOMATICAS",
//         "documento": "",
//         "entrada": true,
//         "valor": 1586.3,
//         "id": 48784,
//         "dataCriacao": "2021-12-12T23:21:01.325Z"
//     }
// ];


let usuarios = [
    {
        id: 1,
        usuario: 'renata',
        nomeCompleto: 'Renata Barth',
        dataCriacao: new Date("2021-06-21T22:06:26.819Z"),
        senha: '111',
        saldo: buscarSaldo(1),
        base64image: 'http://images.assetsdelivery.com/compings_v2/fizkes/fizkes2007/fizkes200701872.jpg'
    }, {
        id: 2,
        usuario: 'vinicius',
        dataCriacao: new Date("2021-06-22T22:03:46.819Z"),
        nomeCompleto: 'Vinicius Barth',
        senha: '222',
        saldo: buscarSaldo(2),
        base64image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
    }, {
        id: 3,
        usuario: 'admin',
        dataCriacao: new Date("2021-06-22T22:04:46.819Z"),
        nomeCompleto: 'Mateus Camargo',
        senha: 'admin',
        saldo: buscarSaldo(3),
        base64image: 'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'
    }
];

function buscarSaldo(id: number): number {
    const saidas = registros.filter(item => !!item.transacao && item.transacao.idUsuarioOrigem == id)
        .reduce((acc, cur) => acc += cur.valor, 0);

    const entradas = registros.filter(item => !!item.transacao && item.transacao.idUsuarioDestinatario == id)
        .reduce((acc, cur) => acc += cur.valor, 0);

    return entradas - saidas;
}

let provedoresIspForce = [];

class Routes {
    public route = Router();

    constructor() {

        // automoveis

        this.route.get('/carros/loja', (req, res) => {
            const carros = [
                {
                    marca: 'Ford',
                    modelo: 'Ecosport',
                    descricao: '1.5 Ti-Vct Se',
                    anoModelo: '2020',
                    anoFabricacao: '2020',
                    kilometragem: 19251,
                    precoDe: 85190,
                    precoPor: 85190,
                    cambioAutomatico: true,
                    imagens: ['https://img.volanty.com/thumb/inspecao/6448433301815296/20211210/1639159612583.jpeg']
                },
                {
                    marca: 'Honda',
                    modelo: 'Civic',
                    descricao: '2.0 16v Flexone Ex Cvt',
                    anoModelo: '2018',
                    anoFabricacao: '2018',
                    kilometragem: 22540,
                    precoDe: 113990,
                    precoPor: 113990,
                    cambioAutomatico: false,
                    imagens: ['https://img.volanty.com/thumb/inspecao/5506288806002688/20211210/1639159271859.jpeg']
                },
                {
                    marca: 'Ford',
                    modelo: 'Ka',
                    anoModelo: '2019',
                    anoFabricacao: '2018',
                    kilometragem: 24492,
                    descricao: '1.0 Se Plus 12v',
                    precoDe: 45000,
                    precoPor: 45000,
                    cambioAutomatico: false,
                    imagens: ['https://img.volanty.com/thumb/inspecao/5037955358916608/20211210/1639159843906.jpeg']
                }
            ];
            res.json(carros);
        });




        // automoveis








        this.route.get('/contas/pagar/ativas', (req, res) => {
            const response = contasList.filter(conta => !conta.finalizado && conta.pagar);
            res.json(response);
        });

        this.route.post('/add/carro', (req, res) => {
            const response = carros.push(req.body);
            res.json(response);
        });

        // {
        //     marca: 'Ford',
        //     modelo: 'Ka',
        //     anoModelo: '2019',
        //     anoFabricacao: '2018',
        //     kilometragem: 24492,
        //     descricao: '1.0 Se Plus 12v',
        //     precoDe: 45000,
        //     precoPor: 45000,
        //     cambioAutomatico: false,
        //     imagens: ['https://img.volanty.com/thumb/inspecao/5037955358916608/20211210/1639159843906.jpeg']
        // }
        this.route.post('/multiplas/transferencias', (req, res) => {
            const transferencias = req.body.transferencias;
            const idUsuarioOrigem = req.body.transferencias;
            const valorTotal = req.body.valorTotal;
            usuarios.forEach(user => {
                if (user.id == idUsuarioOrigem) {
                    user.saldo -= valorTotal;
                }
            });
            transferencias.forEach(element => {
                const user = usuarios.find(item => item.id == element.usuarioDestino);
                user.saldo += element.valor;
            });
            res.status(200);
        });

        this.route.get('/contas/receber/ativas', (req, res) => {
            const response = contasList.filter(conta => !conta.finalizado && !conta.pagar);
            res.json(response);
        });

        this.route.get('/carros', (req, res) => {
            const response = carros.map(carro => {
                const totalDespesas = carro.despesas.reduce((acc, cur) => acc += cur.valor, 0);
                return Object.assign(carro, { totalDespesas: totalDespesas });
            });
            res.json(response);
        });

        this.route.post('/carros/add/despesa', (req, res) => {
            const despesa = req.body.despesa;
            const idVeiculo = req.body.idVeiculo;
            const carroSelecionado = carros.find(carro => carro.id == idVeiculo);
            carroSelecionado.despesas.push(CarrosMapper.mapNovaDespesa(despesa));
            res.json(carroSelecionado);
        });

        this.route.post('/add/registro/caixa', (req, res) => {
            const caixa = registrosCaixa[(registrosCaixa.length - 1)];
            const saldoAtual = caixa != null ? caixa.saldoFinal : 0;
            const novoRegistro = ContasMapper.mapNovoRegistroCaixa(req.body, saldoAtual);
            registrosCaixa.push(novoRegistro);
            res.json(novoRegistro);
        });

        this.route.get('/registro/caixa', (req, res) => {
            res.json(registrosCaixa);
        });

        this.route.get('/registro/caixa/page/:page/count/:count', (req, res) => {
            const page = req.params.page;
            const count = req.params.count;
            res.json(pagination(registrosCaixa, page, count));
        });

        this.route.get('/vencimento-hoje', (req, res) => {
            const response = {
                contasPagarHoje: contasList.filter(item => item.pagar && isToday(item.dataFinal)).length,
                contasReceberHoje: contasList.filter(item => !item.pagar && isToday(item.dataFinal)).length
            };
            res.json(response);
        });

        // Contas a pagar
        this.route.get('/pagar/fixas/page/:page/count/:count', (req, res) => {
            const page = req.params.page;
            const count = req.params.count;
            res.json(pagination(contasList.filter(item => item.pagar && item.contaFixa), page, count));
        });

        this.route.get('/pagar/variaveis/page/:page/count/:count', (req, res) => {
            const page = req.params.page;
            const count = req.params.count;
            res.json(pagination(contasList.filter(item => item.pagar && !item.contaFixa), page, count));
        });

        this.route.post('/pagar', (req, res) => {
            const novoPlano = ContasMapper.mapNovaContaPagar(req.body);
            contasList.push(novoPlano);
            res.json(novoPlano);
        });

        this.route.patch('/pagar/finalizar/:id', (req, res) => {
            const conta = contasList.find(item => item.id == req.params.id);

            if (!!conta) {
                // let usuario = usuarios.find(item => item.id == conta.idUsuario);
                // if (usuario) usuarios.saldo += conta.valor;
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
        this.route.get('/receber/fixas/page/:page/count/:count', (req, res) => {
            const page = req.params.page;
            const count = req.params.count;
            res.json(pagination(contasList.filter(item => !item.pagar && item.contaFixa), page, count));
        });

        this.route.get('/receber/variaveis/page/:page/count/:count', (req, res) => {
            const page = req.params.page;
            const count = req.params.count;
            res.json(pagination(contasList.filter(item => !item.pagar && !item.contaFixa), page, count));
        });

        this.route.post('/receber', (req, res) => {
            const novoPlano = ContasMapper.mapNovaContaReceber(req.body);
            contasList.push(novoPlano);
            res.json(novoPlano);
        });

        this.route.patch('/receber/finalizar/:id', (req, res) => {
            const conta = contasList.find(item => item.id == req.params.id);

            if (!!conta) {
                // let usuario = usuarios.find(item => item.id == conta.idUsuario);
                // if (usuario) usuarios.saldo += conta.valor;
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


        this.route.put('/user/:userId', (req, res) => {
            const {
                usuario,
                nomeCompleto,
                base64image
            } = req.body;

            const usuarioParaEditar = usuarios.find(user => user.id == Number(req.params.userId));
            if (!!usuarioParaEditar) {
                usuarioParaEditar.base64image = base64image;
                usuarioParaEditar.usuario = usuario;
                usuarioParaEditar.nomeCompleto = nomeCompleto;
                res.json(usuarioParaEditar);
            } else {
                res.status(404).json({ error: 'Usuário não encontrado.' });
            }
            res.json();
        });


        this.route.get('/registros/:origem/:destino', (req, res) => {
            const { origem, destino } = req.params;
            const response = registros
                .filter(res => !!res.transacao)
                .filter(registro => {
                    const a = registro.transacao.idUsuarioOrigem == origem || registro.transacao.idUsuarioOrigem == destino;
                    const b = registro.transacao.idUsuarioDestinatario == origem || registro.transacao.idUsuarioDestinatario == destino;
                    return a && b;
                });
            res.json(response);
        });


        this.route.post('/upload', function (req, res) {
            console.log(req.body);
            res.json({ ok: true });
        });

        this.route.post('/logar', function (req, res) {
            const usuario = req.body.usuario;
            const senha = req.body.senha;
            const usuarioLogado = usuarios.find(user => user.usuario == usuario && user.senha == senha);
            if (!!usuarioLogado) {
                res.json(buildUser(usuarioLogado, usuarioLogado.dataCriacao));
                // res.json({
                //     id: usuarioLogado.id,
                //     nomeCompleto: usuarioLogado.nomeCompleto,
                //     usuario: usuarioLogado.usuario,
                //     dataCriacao: usuarioLogado.dataCriacao,
                // });
            } else {
                res.status(404).json({
                    error: 'Usuário ou senha inválida.'
                });
            }
        });

        this.route.post('/add/user', function (req, res) {
            const usuario = req.body.usuario;
            const senha = req.body.senha;
            const nomeCompleto = req.body.nomeCompleto;
            const base64image = req.body.base64image;
            const newUser = {
                id: (usuarios.length + 1),
                dataCriacao: getActualDate(),
                usuario: usuario,
                senha: senha,
                nomeCompleto: nomeCompleto,
                base64image: base64image,
                saldo: 0
            };
            usuarios.push(newUser);
            res.json(newUser);
        });

        this.route.get('/users', function (req, res) {
            res.json(usuarios.map(user => {
                return buildUser(user, null);
            }));
        });

        this.route.get('/user/:userId', function (req, res) {
            res.json(buildUser(usuarios.find(item => item.id.toString() == req.params.userId), null));
        });

        this.route.post('/registros', function (req, res) {
            const itens: any[] = req.body;


            itens.forEach(item => {
                const stringToHash = (Math.floor(Math.random() * 1000) + 1).toString();
                var hash = 0, i, chr;
                if (stringToHash.length === 0) return hash;
                for (i = 0; i < stringToHash.length; i++) {
                    chr = stringToHash.charCodeAt(i);
                    hash = ((hash << 5) - hash) + chr;
                    hash |= 0; // Convert to 32bit integer
                }

                item.id = hash;
                item.dataCriacao = getActualDate();
                registros.push(item);
            });
            res.json(req.body);
        });

        this.route.get('/registros', function (req, res) {
            res.json(registros);
        });

        this.route.get('/barth/metricas/:userId', function (req, res) {
            const userId = req.params.userId;
            const transacoes = registros.filter(item => {
                if (!item.transacao) return false;
                return item.transacao.idUsuarioOrigem == userId || item.transacao.idUsuarioDestinatario == userId;
            });
            const ids = transacoes.map(item => {
                const idUsuarioOrigem = item.transacao.idUsuarioOrigem;
                const idUsuarioDestinatario = item.transacao.idUsuarioDestinatario;
                return idUsuarioOrigem == userId ? idUsuarioDestinatario : idUsuarioOrigem;
            });
            const semRepetidos = ids.filter((item, i) => ids.indexOf(item) == i);

            const objs = semRepetidos.map(id => {
                const transacoesDoId = transacoes.filter(item => item.transacao.idUsuarioOrigem == id || item.transacao.idUsuarioDestinatario == id);
                // const porcentagem = transacoes.length * transacoesDoId.length / 100;
                const porcentagem = (100 * transacoesDoId.length) / transacoes.length;
                const user = usuarios.find(item => item.id == id);
                return {
                    user: user,
                    porcentagem: porcentagem.toFixed(2)
                }
            })
            res.json(objs);
        });

        this.route.get('/registros/page/:page/count/:count', function (req, res) {
            const page = parseFloat(req.params.page);
            const count = parseFloat(req.params.count);
            const totalPages = registros.length / count;
            res.json(pagination(registros, page, count));
        });

        this.route.get('/registros/comissionados/page/:page/count/:count/id-usuario/:idUsuario', function (req, res) {
            const page = parseFloat(req.params.page);
            const count = parseFloat(req.params.count);
            const idUsuario = parseFloat(req.params.idUsuario);
            const registrosResponse = registros
                .filter(item => !!item.transacao && !!item.transacao.geraComissao && (item.transacao.idUsuarioDestinatario == idUsuario || item.transacao.idUsuarioOrigem == idUsuario));
            const totalPages = registrosResponse.length / count;
            res.json({
                totalResults: registrosResponse.length,
                totalPages: Math.ceil(totalPages),
                data: registrosResponse.slice((page - 1) * count, page * count)
            });
        });

        this.route.get('/registros/page/:page/count/:count', function (req, res) {
            const page = parseFloat(req.params.page);
            const count = parseFloat(req.params.count);
            const registrosResponse = registros.filter(item => true);
            const totalPages = registrosResponse.length / count;
            res.json({
                totalResults: registrosResponse.length,
                totalPages: Math.ceil(totalPages),
                data: registrosResponse.slice((page - 1) * count, page * count)
            });
        });

        this.route.get('/registros/pendentes/page/:page/count/:count', function (req, res) {
            const page = parseFloat(req.params.page);
            const count = parseFloat(req.params.count);
            const registrosResponse = registros.filter(item => !item.transacao);
            const totalPages = registrosResponse.length / count;
            res.json({
                totalResults: registrosResponse.length,
                totalPages: Math.ceil(totalPages),
                data: registrosResponse.slice((page - 1) * count, page * count)
            });
        });

        this.route.get('/registros/realizados/page/:page/count/:count', function (req, res) {
            const page = parseFloat(req.params.page);
            const count = parseFloat(req.params.count);
            const registrosResponse = registros.filter(item => item.transacao);
            const totalPages = registrosResponse.length / count;
            res.json({
                totalResults: registrosResponse.length,
                totalPages: Math.ceil(totalPages),
                data: registrosResponse.slice((page - 1) * count, page * count)
            });
        });

        this.route.get('/registros/por-usuario/page/:page/count/:count/id-usuario/:idUsuario', function (req, res) {
            const page = parseFloat(req.params.page);
            const count = parseFloat(req.params.count);
            const idUsuario = parseFloat(req.params.idUsuario);
            const registrosResponse = registros
                .filter(item => !!item.transacao
                    && (item.transacao.idUsuarioOrigem == idUsuario
                        || item.transacao.idUsuarioDestinatario == idUsuario));

            const totalPages = registrosResponse.length / count;
            res.json({
                totalResults: registrosResponse.length,
                totalPages: Math.ceil(totalPages),
                data: registrosResponse.slice((page - 1) * count, page * count)
            });
        });

        this.route.get('/registros/por-usuarios/page/:page/count/:count', function (req, res) {
            const page = parseFloat(req.params.page);
            const count = parseFloat(req.params.count);
            const userOne = req.query.users[0];
            const userTwo = req.query.users[1];
            const registrosResponse = registros
                .filter(item => !!item.transacao
                    && (((userOne == item.transacao.idUsuarioOrigem) && (userTwo == item.transacao.idUsuarioDestinatario))
                        || ((userTwo == item.transacao.idUsuarioOrigem) && (userOne == item.transacao.idUsuarioDestinatario))))
            const response = pagination(registrosResponse, page, count);
            const data = response.data;
            response.data = {
                usuarios: usuarios.filter(usuario => usuario.id == userOne || usuario.id == userTwo),
                registros: data
            }
            res.json(response);
        });

        this.route.get('/users/page/:page/count/:count', function (req, res) {
            const page = parseFloat(req.params.page);
            const count = parseFloat(req.params.count);
            const registrosResponse = usuarios.map(item => {
                return buildUser(item, null);
            });
            const totalPages = registrosResponse.length / count;
            res.json({
                totalResults: registrosResponse.length,
                totalPages: Math.ceil(totalPages),
                data: registrosResponse.slice((page - 1) * count, page * count)
            });
        });

        this.route.put('/registrar-transacao', (req, res) => {
            const registro = req.body;
            registros.forEach((item, index) => {
                if (item.id == registro.id) {
                    item.transacao = registro.transacao;
                    item.descricaoPessoal = registro.descricaoPessoal;
                    usuarios.find(user => user.id == registro.transacao.idUsuarioDestinatario).saldo += Number(item.valor);
                    usuarios.find(user => user.id == registro.transacao.idUsuarioOrigem).saldo -= Number(item.valor);
                    if (!!req.body.transacao && !!req.body.transacao.comissaoRegistro) {
                        const comissaoRegistroId = registro.transacao.comissaoRegistro.id;
                        item.transacao.comissaoRegistro = comissaoRegistroId;
                        const registroComissao = registros.find(registroComissao => registroComissao.id == comissaoRegistroId);
                        registroComissao.transacao.finalizado = true;
                    }
                }
            });
            res.json(registros.find(item => item.id == registro.id));
        });

        this.route.get('/registros-aprovados/id-usuario/:id', (req, res) => {
            const idUsuario = req.params.id;
            let registrosEntrada = registros.filter(item => !!item.transacao && item.transacao.idUsuarioDestinatario == idUsuario);
            let registrosSaida = registros.filter(item => !!item.transacao && item.transacao.idUsuarioOrigem == idUsuario);

            let entradas = registrosEntrada.reduce((acc, act) => {
                let b = Math.abs(act.valor);
                return acc + b;
            }, 0);

            let saidas = registrosSaida.reduce((acc, act) => {
                let b = Math.abs(act.valor);
                return acc + b;
            }, 0);

            res.json({
                entradas: entradas,
                saidas: saidas,
                saldo: entradas - saidas,
                registrosEntrada: registrosEntrada,
                registrosSaida: registrosSaida
            });
        });

        this.route.get('/hash', (req, res) => {
            const stringToHash = req.query.str;

            var hash = 0, i, chr;
            if (stringToHash.length === 0) return hash;
            for (i = 0; i < stringToHash.length; i++) {
                chr = stringToHash.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }

            res.json({
                hash: hash
            });
        });

    }
}

export default new Routes().route

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
        res.status(401).json({ error: "Invalid token." });
        return;
    }
    next();
}

export const createToken = (res: Response, next: NextFunction, user: UserModel) => {
    const id = user.id;
    const newToken = jwt.sign({ id }, config.default.jwtSecret, {
        expiresIn: 60000
    });
    res.json({ token: newToken, user: user });
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

class CarrosMapper {

    public static mapNovaDespesa(despesa) {
        return {
            data: getActualDate(),
            id: getHash(),
            descricao: despesa.descricao,
            valor: despesa.valor
        }
    }
}

class ContasMapper {

    public static mapNovoRegistroCaixa(novoRegistroCaixa, saldoAtual) {
        const entrada = novoRegistroCaixa.entrada;
        const valor = novoRegistroCaixa.valor;
        const saldoFinal = entrada ? saldoAtual + valor : saldoAtual - valor;
        return {
            id: getHash(),
            dataCriacao: getActualDate(),
            descricao: novoRegistroCaixa.descricao,
            valor: valor,
            entrada: entrada,
            saldoFinal: saldoFinal
        }
    }


    public static mapNovaContaPagar(novaContaPagar) {
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