"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _app = require('./app'); var _app2 = _interopRequireDefault(_app);

const port = 1900;

_app2.default.listen(port);

console.log('Serviço de autenticação rodando na porta', port);
