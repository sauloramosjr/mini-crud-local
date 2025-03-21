import {usuarioRepository} from '../repositories/UsuarioRepository.js'

export function usuarioJaExiste(usuario) {
  if (!Object.keys(usuario).some((e) => e == 'email')) {
    return false;
  }
  const res =  usuarioRepository.consultaUsuarioPorEmail({email:usuario.email})
  if (res.length > 0) {
    return true;
  }
  return false;
}



