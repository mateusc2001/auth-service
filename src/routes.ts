import { Router, NextFunction, Response, Request, request } from 'express'
import { UserModel } from './model/user.model';
import * as config from './config/config';
import * as jwt from "jsonwebtoken";
import { UserSchema } from "./schemas/user.schema";
import * as http from "request-promise-native";

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
            try {
                const { username, password } = req.body;
                const user: UserModel = JSON.parse((await findUserByUsername(username)).toString());
                if (!user) res.status(404).json({ error: 'Usuário não encontrado.'});
                if (user.password != password) res.status(404).json({ error: 'Senha inválida.'});
                createToken(res, () => {}, user);
            } catch(err) {
                res.status(404).json({ error: 'Usuário não encontrado.'});
            }
        });

        this.route.post('/estoque', async (req: Request, res: Response) => {
            try {
                res.json({
                    estoqueCd: 10
                });
            } catch(err) {
                res.status(404).json({ error: 'Usuário não encontrado.'});
            }
        });
    }
}

export default new Routes().route

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

export async function findUserByUsername (username): Promise<UserModel> {
    const baseUrl = 'http://localhost:2020/v2/user/username/' + username;
    return await http.get(baseUrl);
}