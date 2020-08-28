import app from './app';

const port = 1900;

console.log(new Date());
app.listen(port);

console.log('Serviço de autenticação rodando na porta', port);
