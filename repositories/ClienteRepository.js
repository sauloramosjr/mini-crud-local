import { BaseRepository } from './BaseRepository.js';

class ClienteRepository extends BaseRepository {
    constructor() {
      super('cliente');
    }
    clienteJaExiste({ cpf }) {
      const query = `SELECT * from ${this.tabela} WHERE cpf = "${cpf}";`;
      try {
        return alasql(query).lenght > 0;
      } catch (err) {
        console.error(err);
      }
    }
  }

export const clienteRepository = new ClienteRepository();
