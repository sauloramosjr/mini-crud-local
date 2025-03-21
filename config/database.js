export default function criarBancoETabelas() {
  alasql(
    `
    CREATE LOCALSTORAGE DATABASE IF NOT EXISTS miniaplicacaodb;
    ATTACH LOCALSTORAGE DATABASE miniaplicacaodb;
    USE miniaplicacaodb;
    `
  );
  import('./clienteTable.js');
  import('./usuarioTable.js');
  import('./enderecoTable.js');
}
