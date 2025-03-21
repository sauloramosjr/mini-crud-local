import { BaseRepository } from './BaseRepository.js';

class EnderecoRepository extends BaseRepository {
  constructor() {
    super('endereco');
  }
  consultarTodosPorCliente({id}) {
    const query = `SELECT * from ${this.tabela} WHERE idCliente = ${id};`;
    try {
      return alasql(query);
    } catch (err) {
      console.error(err);
    }
  }
  excluirTodosDoCliente({id}) {
    const query = `DELETE from ${this.tabela} WHERE idCliente = ?;`;
    try {
      return alasql(query,[id]);
    } catch (err) {
      console.error(err);
    }
  }
}

export const enderecoRepository = new EnderecoRepository();
