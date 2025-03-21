export class Endereco {
  constructor(
    _id="",
    _cep = "",
    _rua = "",
    _bairro = "",
    _cidade = "",
    _estado = "",
    _pais = "",
    _principal = "",
    _idCliente = ""
  ) {
    this.id = _id
    this.cep = _cep;
    this.rua = _rua;
    this.bairro = _bairro;
    this.cidade = _cidade;
    this.estado = _estado;
    this.pais = _pais;
    this.principal = _principal;
    this.idCliente = _idCliente;
  }
}
