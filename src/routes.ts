import { Router, NextFunction, Response, Request } from 'express'
import { UserModel } from './model/user.model';
import { User } from './schemas/user.schema';
import * as config from './config/config';
import * as jwt from "jsonwebtoken";
import { Person } from './schemas/person.schema';
import { PersonModel } from './model/person.model';

class Routes {
    public route = Router();

    constructor() {
        this.route.get('/page', function(req, res) {
            res.sendFile('/Users/mateus/projetos/pocs/sorteador/index.html');
        });
        /* 
        Este endpoint vai ser consumido pelo serviço de usuários
        para gerar um token quando um usuário for cadastrado.
        */
        this.route.get('/auth', async (req: Request, res: Response) => {
            const id = req.query.id;
            createToken(res, () => {}, id);
        });

        /* 
        Este endpoint vai ser consumido pelos demais
        para validar um token.
        */
        this.route.get('/auth/validate', async (req: Request, res: Response) => {
            validateToken(req, res, () => res.status(200).json({ msg: "tudo ok"}));
        });

        /* 
        Este endpoint vai ser consumido pelo client
        para retornar um token quando usuário logar na aplicação.
        */
        this.route.post('/auth/login', async (req: Request, res: Response) => {
            const { username, password } = req.body;
            console.log('username', username);
            console.log('password', password);
            const user = (await User.findOne({ username: username }));
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado.'});
            if (user.password != password) return res.status(404).json({ error: 'Senha inválida.'});
            createToken(res, () => {}, user);
        });

        this.route.post('/discount-authorization/v1/store-balance/debit', async (req: Request, res: Response) => {
            console.log("================= DÉBITOS =================");
            console.log(req.body);
            res.json([
                {
                    identificador: 10,
                    id: 20
                }
            ]);
        });
        this.route.post('/discount-authorization/v1/store-balance/credit', async (req: Request, res: Response) => {
            console.log("================= CRÉDITOS =================");
            console.log(req.body);
            res.json([]);
        });
    }
}

export default new Routes().route

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers["auth"];
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