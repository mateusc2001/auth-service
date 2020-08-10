"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _routes = require('./routes'); var _routes2 = _interopRequireDefault(_routes);

class App {
    

    constructor() {
        this.express = _express2.default.call(void 0, );
        this.middlewares();
        this.database();
        this.routes();
    }

     middlewares() {
        this.express.use(_express2.default.json());
        this.express.use(_cors2.default.call(void 0, ));
    }

     database() {
        const uri = 'mongodb://mateus:123@clusterhotel-shard-00-00-rc4kb.mongodb.net:27017,clusterhotel-shard-00-01-rc4kb.mongodb.net:27017,clusterhotel-shard-00-02-rc4kb.mongodb.net:27017/test?ssl=true&replicaSet=ClusterHotel-shard-0&authSource=admin&retryWrites=true&w=majority'
        _mongoose2.default.connect(uri, { 
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
    }

     routes() {
        this.express.use(_routes2.default);
    }
}

exports. default = new App().express