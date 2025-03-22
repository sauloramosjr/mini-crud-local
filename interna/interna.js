import { Cliente } from '../entities/Cliente.js';
import { Endereco } from '../entities/Endereco.js';
import { clienteRepository } from '../repositories/ClienteRepository.js';
import { enderecoRepository } from '../repositories/EnderecoRepository.js';
import { usuarioRepository } from '../repositories/UsuarioRepository.js';
import { gerarGUID } from '../utils/gerarGuid.js';

const usuarioLogado = usuarioRepository.consultaUsuarioLogado();
if (!usuarioLogado.length) {
  window.location.href = '/';
}

function criaCampoInputsBoolean(campo, fnOnChange, value) {
  const wrapCampo = document.createElement('div');
  wrapCampo.classList.add("form-check", "form-switch", "mb-1");

  const inputCampo = document.createElement('input');
  inputCampo.type = 'checkbox';
  inputCampo.role = 'switch';
  inputCampo.id = campo;
  inputCampo.classList.add("form-check-input");

  // Se 'value' é "true", o checkbox deve estar marcado
  inputCampo.checked = value === "true";

  inputCampo.addEventListener('change', function(e) {
    const arrayCheckboxeses = Array.from(document.querySelectorAll('input[type="checkbox"]'))
    const checkboxses = arrayCheckboxeses.some(checkbox => {
      return checkbox.checked === true;
    });
    if(arrayCheckboxeses.length == 1 || !checkboxses){
      arrayCheckboxeses[0].checked = true;
      arrayCheckboxeses[0].click(); 
      fnOnChange(e.target.checked); 
      return
    }
    if (e.target.checked) {
      // Desmarca todos os outros checkboxes
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        if (checkbox !== e.target) {
          checkbox.checked = false;
          checkbox.click()
        }
      });
 
    }
    fnOnChange(e.target.checked); // Chama a função de callback passando o novo estado
  });

  const labelCampo = document.createElement('label');
  labelCampo.htmlFor = campo;
  labelCampo.classList.add("form-check-label", "form-label");
  labelCampo.innerText = campo.charAt(0).toUpperCase() + campo.slice(1);

  wrapCampo.append(labelCampo);
  wrapCampo.append(inputCampo);

  return wrapCampo;
}


function criaCampoInputsTexto(campo, fnOnChange, value) {
  const wrapCampo = document.createElement('div');
  const labelCampo = document.createElement('label');
  const inputCampo = document.createElement('input');
  labelCampo.htmlFor = campo;
  labelCampo.innerText = campo.charAt(0).toUpperCase() + campo.slice(1);
  labelCampo.classList.add('form-label');
  inputCampo.id = campo;
  inputCampo.classList.add('form-control');
  inputCampo.addEventListener('change', (e) => {
    fnOnChange(e.target.value);
  });
  !!value && (inputCampo.value = value);
  wrapCampo.classList.add('mb-1');
  wrapCampo.append(labelCampo);
  wrapCampo.append(inputCampo);
  return wrapCampo;
}

const endereco = new Endereco();
const cliente = new Cliente();
let enderecos = [];
$(document).ready(function () {
  function excluirCliente(cliente) {
    clienteRepository.deletar({ id: cliente.id });
    enderecoRepository.excluirTodosDoCliente({ id: cliente.id });
    clienteRepository.deletar({ id: cliente.id });
    $('#tabela-clientes tbody').empty();
    listarClientesNaTabela();
  }
  function listarClientesNaTabela() {
    const clientes = clienteRepository.consultarTodos();
    const enderecos = enderecoRepository.consultarTodos();

    const clientesComEnderecos = clientes.map((cliente) => {
      cliente.enderecos = enderecos.filter(
        (endereco) => endereco.idCliente === cliente.id
      );
      return cliente;
    });

    const tableBody = listarEmTabela(
      '#body-tabela-clientes',
      clientesComEnderecos,
      excluirCliente
    );
    $('#tabela-clientes').append(tableBody);
  }
  function resetarFormulario(isEditar) {
    enderecos = [];
    Object.keys(cliente).forEach((e) => {
      $(`#${e}`).val('');
      cliente[e] = '';
    });
    if (isEditar) {
      $('#enderecos').empty();
      $('#modal').toggleClass('show');
      $('#tabela-clientes tbody').empty();
      // listarClientesNaTabela()
    }
    renderizaFormEnderecos(enderecos);
  }
  function enviarFormulario(editar) {
    const idCliente = !!cliente.id ? cliente.id : gerarGUID();
    let hasErro = false;
    Object.keys(cliente).forEach((c) => {
      if (hasErro || !c.id) {
        return;
      }
      if (!cliente[c]) {
        window.alert(`${c} é um campo obrigatório`);
        hasErro = true;
      }
    });
    if (hasErro) {
      return;
    }
    if (clienteRepository.clienteJaExiste({ cpf: cliente.cpf })) {
      window.alert('Cliente já existe!');
      return;
    }
    if (cliente.id) {
      clienteRepository.atualizar({ objeto: cliente });
      enderecoRepository.excluirTodosDoCliente({ id: cliente.id });
      enderecos.forEach((e) => {
        const end = e;
        end.id = gerarGUID();
        end.idCliente = cliente.id;
        enderecoRepository.novo({ objeto: end });
      });
    } else {
      cliente.id = idCliente;
      clienteRepository.novo({ objeto: cliente });
      enderecos.forEach((e) => {
        const end = e;
        end.id = gerarGUID();
        end.idCliente = idCliente;
        enderecoRepository.novo({ objeto: end });
      });
    }

    window.alert(
      `Cliente ${cliente.nomeCompleto.split(' ')[0]} salvo com sucesso`
    );
    resetarFormulario(editar);
  }
  // function renderizaFormEnderecos() {
  //   const enderecoKeys = Object.keys(endereco);
  //   const _wrap = document.createElement('div');

  //   enderecoKeys.forEach((campoEndereco) => {
  //     if (campoEndereco == 'idCliente' || campoEndereco == 'id') {
  //       return;
  //     }

  //     const wrapCampo = criaCampo(campoEndereco, (value) => {
  //       if (!enderecos.length) {
  //         enderecos.push(new Endereco());
  //       }
  //       enderecos[enderecos.length - 1][campoEndereco] = value;
  //     });
  //     _wrap.append(wrapCampo);
  //   });
  //   _wrap.id = 'wrap';

  //   $('#enderecos').append(_wrap);
  // }
  function renderizaFormEnderecos(_enderecos) {
    let ends = _enderecos;
    if (!_enderecos.length) {
      ends = [new Endereco()];
    }
    $('#enderecos').empty();
    ends.forEach((end, i) => {
      const enderecoKeys = Object.keys(endereco);
      const _wrap = document.createElement('div');

      enderecoKeys.forEach((campoEndereco) => {
        if (campoEndereco == 'idCliente' || campoEndereco == 'id') {
          return;
        }
        let wrapCampo;
        if (campoEndereco == 'principal') {
          wrapCampo = criaCampoInputsBoolean(
            campoEndereco,
            (value) => {
              end[campoEndereco] = value;
            },
            ends[i][campoEndereco]
          );
        } else {
          wrapCampo = criaCampoInputsTexto(
            campoEndereco,
            (value) => {
              end[campoEndereco] = value;
            },
            ends[i][campoEndereco]
          );
        }
        _wrap.append(wrapCampo);
      });
      _wrap.id = 'wrap';
      _wrap.style.position = 'relative';
      _wrap.style.marginTop = '10px';
      _wrap.style.paddingTop = '20px';
      const buttonDeletar = document.createElement('button');
      buttonDeletar.classList.add('btn');
      buttonDeletar.innerHTML = `<span style="color:red;" class="material-symbols-outlined">delete</span>`;
      buttonDeletar.style = 'position:absolute; top:0px; right:0px;';

      const fnDeletarEndereco = () => {
        if (enderecos.length == 1) {
          return;
        }
        enderecoRepository.deletar({ id: end.id });
        enderecos = enderecos.filter((e, i) => i != enderecos.indexOf(end));
        renderizaFormEnderecos(enderecos);
      };
      buttonDeletar.addEventListener('click', fnDeletarEndereco);

      if (enderecos.length > 1) {
        _wrap.appendChild(buttonDeletar);
      }
      $('#enderecos').append(_wrap);
    });
  }

  function editarCliente(_cliente, _enderecos) {
    Object.keys(_cliente).forEach((e) => {
      cliente[e] = _cliente[e];
    });
    enderecos = _cliente['enderecos'];
    $('#enderecos').empty();

    $('#nomeCompleto').val(cliente.nomeCompleto);
    $('#celular').val(cliente.celular);
    $('#cpf').val(cliente.cpf);
    $('#dataNascimento').val(cliente.dataNascimento);
    $('#telefone').val(cliente.telefone);

    renderizaFormEnderecos(enderecos);
    $('#tituloFormulario').text('Editar Cliente');
    $('#toggleNovo').click();
  }

  function listarEmTabela(idTagPai, arrayEntidades, fnExcluir) {
    const bodyTable = document.createElement('tbody');

    arrayEntidades.forEach((entidade) => {
      const linha = document.createElement('tr');
      linha.role = 'button';

      let appendAberto = false;

      linha.addEventListener('click', () => {
        appendAberto = !appendAberto;
        const appendRow = linha.nextSibling;
        if (appendRow && appendRow.classList.contains('append-wrapper')) {
          appendRow.style.display = appendAberto ? '' : 'none';
        }
      });

      const editar = document.createElement('td');
      editar.innerHTML = `<button class="btn"><span class="material-symbols-outlined">edit</span></button>`;
      linha.append(editar);

      editar.addEventListener('click', (e) => {
        e.stopPropagation();
        editarCliente(entidade);
      });

      Object.keys(entidade).forEach((key) => {
        if (key === 'id' || key === 'enderecos') return;
        const celula = document.createElement('td');
        celula.innerText = entidade[key];
        linha.append(celula);
      });

      const deletar = document.createElement('td');
      const btnExcluir = document.createElement('button');
      btnExcluir.classList.add('btn');
      btnExcluir.innerHTML = `<span class="material-symbols-outlined">delete</span>`;
      btnExcluir.addEventListener('click', (event) => {
        event.stopPropagation();
        fnExcluir(entidade);
      });
      deletar.append(btnExcluir);
      linha.append(deletar);

      bodyTable.append(linha);

      if (entidade.enderecos && entidade.enderecos.length > 0) {
        const linhaAppend = document.createElement('tr');
        linhaAppend.classList.add('append-wrapper');
        linhaAppend.style.display = 'none';

        const celulaAppend = document.createElement('td');
        celulaAppend.colSpan = Object.keys(entidade).length + 1;

        const tabelaEnderecos = document.createElement('table');
        tabelaEnderecos.classList.add('table', 'table-bordered', 'table-sm');

        const thead = document.createElement('thead');
        const _end = new Endereco();
        const enderecoKeys = Object.keys(_end);

        const campos = `<tr><td colSpan="${
          Object.keys(entidade).length + 1
        }"><h2>Endereço</h2></td></tr><th>${enderecoKeys
          .filter((_endereco) => {
            return _endereco != 'id' && _endereco != 'idCliente';
          })
          .join('</th><th>')}</th>`;
        thead.innerHTML = campos;
        tabelaEnderecos.append(thead);

        const tbody = document.createElement('tbody');

        entidade.enderecos.forEach((endereco) => {
          const linhaEndereco = document.createElement('tr');
          enderecoKeys.forEach((campo) => {
            if (campo == 'id' || campo == 'idCliente') {
              return;
            }
            let valor = endereco[campo];
            if (valor == 'true') {
              valor = 'Sim';
            }
            if (valor == 'false') {
              valor = 'Não';
            }
            const celula = document.createElement('td');
            celula.innerText = valor || '';
            linhaEndereco.append(celula);
          });

          tbody.append(linhaEndereco);
        });

        tabelaEnderecos.append(tbody);
        celulaAppend.append(tabelaEnderecos);
        linhaAppend.append(celulaAppend);

        bodyTable.append(linhaAppend);
      }
    });

    return bodyTable;
  }

  listarClientesNaTabela();
  renderizaFormEnderecos(enderecos);

  const exampleModal = document.querySelector('#exampleModal');

  exampleModal.addEventListener('hidden.bs.modal', () => {
    $('#tabela-clientes tbody').empty();
    listarClientesNaTabela();
  });
  $('#add-endereco').click((e) => {
    enderecos.push(new Endereco());
    renderizaFormEnderecos(enderecos);
  });

  $('#sair').click(() => {
    const [_usuarioLogado] = usuarioLogado;
    usuarioRepository.setaUsuarioLogado({ ..._usuarioLogado, logado: 0 });
    window.location.href = '/';
  });

  $('#novo').click(() => {
    resetarFormulario();
    $('#tituloFormulario').text('Novo Cliente');
    $('#toggleNovo').click();
  });

  $('#exportar-banco').click(() => {
    exportDataBase();
  });

  $('#closeButon, #modal').click(() => {
    $('#toggleNovo').click();

    $('#tabela-clientes tbody').empty();
    listarClientesNaTabela();
  });

  $('#client-card').click((e) => {
    e.stopPropagation();
  });
  $('#nomeCompleto').on('keyup', (e) => {
    cliente.nomeCompleto = e.target.value;
  });
  $('#cpf').on('keyup', (e) => {
    cliente.cpf = e.target.value;
  });
  $('#dataNascimento').on('input', (e) => {
    cliente.dataNascimento = e.target.value;
  });
  $('#telefone').on('keyup', (e) => {
    cliente.telefone = e.target.value;
  });
  $('#celular').on('keyup', (e) => {
    cliente.celular = e.target.value;
  });
  $('#limpar').click(() => {
    resetarFormulario();
  });
  $('#enviar').click(() => {
    const titulo = $('#tituloFormulario').text();
    const isEditar = titulo == 'Editar Cliente';
    enviarFormulario(isEditar);
    $('#tabela-clientes tbody').empty();
    listarClientesNaTabela();
    if (isEditar) {
      $('#toggleNovo').click();
    }
  });
});

function exportDataBase() {
  const resultado = {};
  const todasAsTabelas = Object.keys(alasql.databases.miniaplicacaodb.tables);
  todasAsTabelas.forEach((tabela) => {
    resultado[tabela] = alasql(`SELECT * FROM ${tabela}`);
  });

  const blob = new Blob([JSON.stringify(resultado, null, 2)], {
    type: 'application/json',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'miniaplicacaodb.json';
  link.click();
}
