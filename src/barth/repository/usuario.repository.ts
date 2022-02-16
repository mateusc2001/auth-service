import { UsuarioModel } from "../model/usuario.model";
import { usuarioSchema } from "../usuario.schema";

export class UsuarioRepository {

    public static createUsuario(newUser: UsuarioModel): any {
        return usuarioSchema.create(newUser);
    }
}