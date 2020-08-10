"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } }var _express = require('express');

var _userschema = require('./schemas/user.schema');
// import bcrypt from'../node_modules/bcrypt';
var _bcrypt = require('@Types/bcrypt'); var bcrypt = _interopRequireWildcard(_bcrypt);

class Routes {
     __init() {this.route = _express.Router.call(void 0, )}

    constructor(){;Routes.prototype.__init.call(this);
        this.route.post('/auth', async (req, res) => {
            const { username, password } = req.body;
            const user = await _userschema.User.find({ username: username });

            if (!user.length) return res.send({ error: 'Usuário não encontrado.'});
            
            if (await bcrypt.compare(password, user[0].password)) return res.send({ error: 'Usuário ou senha inválido.' });
            
            res.json(user);
        });
    }
}

exports. default = new Routes().route
