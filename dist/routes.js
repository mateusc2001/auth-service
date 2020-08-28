"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');

var _config = require('./config/config'); var config = _interopRequireWildcard(_config);
var _jsonwebtoken = require('jsonwebtoken'); var jwt = _interopRequireWildcard(_jsonwebtoken);

var _requestpromisenative = require('request-promise-native'); var http = _interopRequireWildcard(_requestpromisenative);

class Routes {
     __init() {this.route = _express.Router.call(void 0, )}

    constructor() {;Routes.prototype.__init.call(this);
        this.route.get('/page', function(req, res) {
            res.sendFile('/Users/mateus/projetos/pocs/sorteador/index.html');
        });
        /* 
        Este endpoint vai ser consumido pelo serviço de usuários
        para gerar um token quando um usuário for cadastrado.
        */
        this.route.get('/auth', async (req, res) => {
            const id = req.query.id;
            exports.createToken.call(void 0, res, () => {}, id);
        });

        /* 
        Este endpoint vai ser consumido pelos demais
        para validar um token.
        */
        this.route.get('/auth/validate', async (req, res) => {
            exports.validateToken.call(void 0, req, res, () => res.status(200).json({ msg: "tudo ok"}));
        });

        /* 
        Este endpoint vai ser consumido pelo client
        para retornar um token quando usuário logar na aplicação.
        */
        this.route.post('/auth/login', async (req, res) => {
            const { username, password } = req.body;
            const user = JSON.parse((await findUserByUsername(username)).toString());
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado.'});
            if (user.password != password) return res.status(404).json({ error: 'Senha inválida.'});
            exports.createToken.call(void 0, res, () => {}, user);
        });
    }
}

exports. default = new Routes().route

 const validateToken = (req, res, next) => {
    const token = req.headers["app-token"];
    let jwtPayload;
    try {
        jwtPayload = jwt.verify(token, config.default.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        res.status(401).json({ error: "Invalid token." });
        return;
    }
    next();
}; exports.validateToken = validateToken

 const createToken = (res, next, user) => {
    const id = user.id; 
    const newToken = jwt.sign({ id }, config.default.jwtSecret, {
        expiresIn: 60000
    });
    res.json({ token: newToken, user: user });
    next();
}; exports.createToken = createToken

 async function findUserByUsername (username) {
    const baseUrl = 'http://localhost:2020/v2/user/username/' + username;
    return await http.get(baseUrl);
} exports.findUserByUsername = findUserByUsername;