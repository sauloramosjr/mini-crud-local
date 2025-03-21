export class Usuario {
  logado
  constructor(_email="", _senha="", _nome="") {
    this.email = _email;
    this.senha = _senha;
    this.nome = _nome;
  }
}
