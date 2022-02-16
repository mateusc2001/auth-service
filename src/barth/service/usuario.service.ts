import { UsuarioRepository } from "../repository/usuario.repository";

export class UsuarioService {
    
    public static createUser(newUser: any): any {
        return UsuarioRepository.createUsuario(newUser);
    }
}