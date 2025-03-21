import { BaseRepository } from './BaseRepository.js';

class UsuarioRepository extends BaseRepository {
    constructor() {
        super('usuario');
      }
  consultaUsuarioPorEmail({ email }) {
    const query = `SELECT * from usuario WHERE email = "${email}";`;
    try {
      return alasql(query);
    } catch (err) {
      console.error(err);
    }
  }
  consultaUsuarioLogado() {
    const query = `SELECT * from usuario WHERE logado = 1;`;
    try {
      return alasql(query);
    } catch (err) {
      console.error(err);
    }
  }
  setaUsuarioLogado(usuario) {
    const query = `UPDATE usuario SET logado = ${usuario.logado} WHERE email = "${usuario.email}";`;
    try {
      return alasql(query);
    } catch (err) {
      console.error(err);
    }
  }

  isValidEmailSenhaUsuario({email,senha}) {
    const query = `SELECT * FROM usuario WHERE email = "${email}" AND senha = "${senha}";`;
    try {
      
      return alasql(query)
    } catch (err) {
      console.error(err);
    }
  }
}
export const usuarioRepository = new UsuarioRepository();
