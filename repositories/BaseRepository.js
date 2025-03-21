import criarBancoETabelas from '../config/database.js';
import { valuesStringFromObject } from '../utils/valuesStringFromObject.js';

export class BaseRepository {
  constructor(tabela) {
    this.tabela = tabela;
    criarBancoETabelas()
  }

  novo({ objeto }) {
    const itemKeys = Object.keys(objeto);
    const values = valuesStringFromObject(objeto);
    const query = `INSERT INTO ${this.tabela} (${itemKeys.join(
      ','
    )}) VALUES(${values})`;
    try {
      alasql(query);
    } catch (err) {
      console.error(err);
    }
  }

  consultarTodos() {
    const query = `SELECT * from ${this.tabela};`;
    try {
      return alasql(query);
    } catch (err) {
      console.error(err);
    }
  }

  consultarPorId({ id }) {
    const query = `SELECT * from ${this.tabela} WHERE id = "${id}";`;
    try {
      return alasql(query);
    } catch (err) {
      console.error(err);
    }
  }

  atualizar({ objeto }) {
    const { id, ...dados } = objeto; // Extrai o ID e mantém o restante dos campos
    const campos = Object.keys(dados)
      .map(campo => `${campo} = "${dados[campo]}"`)
      .join(", ");
  
    const query = `UPDATE ${this.tabela} SET ${campos} WHERE id = "${id}";`;
  console.log(query)
    try {
      alasql(query);
    } catch (err) {
      console.error(err);
    }
  }

  deletar({ id }) {
    const query = `DELETE from ${this.tabela} WHERE id = "${id}";`;
    try {
      alasql(query);
    } catch (err) {
      console.error(err);
    }
  }
}
