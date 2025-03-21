export function clienteJaExiste(cliente) {
  if (!Object.keys(cliente).some((e) => e == 'cpf')) {
    return false;
  }
  const query = `SELECT * FROM cliente WHERE cpf = "${cliente.cpf}";`;
  const res = alasql(query);
  if (res.length > 0) {
    console.log(res);
    return true;
  }
  return false;
}
