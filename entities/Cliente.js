export class Cliente {
  constructor(_id="", _nomeCompleto="", _cpf="", _dataNascimento="", _telefone="", _celular="") {
    this.id = _id;
    this.nomeCompleto = _nomeCompleto;
    this.cpf = _cpf;
    this.dataNascimento = _dataNascimento;
    this.telefone = _telefone;
    this.celular = _celular;
  }
}
