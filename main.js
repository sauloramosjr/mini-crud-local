// alasql("CREATE TABLE cities (city string, population number)");
// alasql("INSERT INTO cities VALUES ('Rome',2863223), ('Paris',2249975), ('Berlin',3517424), ('Madrid',3041579)");
// var res = alasql("SELECT * FROM cities WHERE population < 3500000 ORDER BY population DESC");
// showResult(res)
// function showResult(x){
//     document.getElementById('result').textContent = JSON.stringify(x,  null, '\t');
// }
import { valuesStringFromObject } from '/utils/valuesStringFromObject.js';
import validations from '/validations/index.js';
import { usuarioJaExiste } from '/validations/usuario.js';
import { emailValido } from './utils/emailValido.js';
import { Usuario } from './entities/usuario.js';
import { gerarGUID } from './utils/gerarGuid.js';
import { usuarioRepository } from './repositories/UsuarioRepository.js';

// window.location.href="/src/pages/login"
$(document).ready(function () {
  let nome = '';
  let email = '';
  let senha = '';
  const login = { email: '', password: '' };
  $('#btn-entrar').click((event) => {
    event.preventDefault();

    if(!login.email || !emailValido(login.email)){
      window.alert("Email inválido")
      return
    }
    const [usuario] = usuarioRepository.isValidEmailSenhaUsuario({email:login.email,senha:login.password})
    if(!!usuario){
      usuario.logado = 1
      usuarioRepository.setaUsuarioLogado(usuario)
      window.location.href = "interna"
    }else{

      alert('Credenciais inválidas. Tente novamente.');
    }

  });

  $('#btn-cadastrar').click((event) => {
    $('.flip-card-inner').toggleClass('active');
    $('.flip-card-back').toggleClass('active');
    $('.flip-card-back').removeClass('voltar');
  });
  $('#btn-voltar').click((event) => {
    $('.flip-card-inner').toggleClass('active');
    $('.flip-card-back').toggleClass('active');
    $('.flip-card-back').addClass('voltar');
  });
  $('#formFile').change((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        try {
          const jsonDataBase = JSON.parse(e.target.result);
          jsonToDataBase(jsonDataBase);
          window.alert("Banco importado com sucesso!")
          $('#modal').toggleClass('show');
        } catch (error) {
          console.error('Erro ao parsear o JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  });
  $('#nome').change((event) => {
    nome = event.target.value;
  });
  $('#emailCadastro').change(function (event) {
    email = event.target.value;
  });
  $('#senha').change((event) => {
    senha = event.target.value;
  });

  $('#btn-enviar').click((event) => {
    if (!emailValido(email)) {
      return;
    }
    if(usuarioJaExiste({ email })){
      window.alert("Usuário já existe!")
      return
    }    
      const usuario = new Usuario(email, senha, nome);
      usuario.id = gerarGUID();
      usuarioRepository.novo({ objeto: usuario });
      window.alert("Usuario cadastrado com sucesso")
      nome = '';
      email = '';
      senha = '';
      $('.flip-card-inner').toggleClass('active');
      $('.flip-card-back').toggleClass('active');
      $('.flip-card-back').addClass('voltar');
  });

  $('#configuracao').click(function () {
    $('#modal').toggleClass('show');
  });
  $('#modal').click(function () {
    $('#modal').toggleClass('show');
  });
  $('#closeButon').click(function () {
    $('#modal').toggleClass('show');
  });
  $('#config-card').click(function (event) {
    event.stopPropagation();
  });
  $('#email').change(function (event) {
    login.email = event.target.value;
  });
  $('#password').change(function (event) {
    login.password = event.target.value;
  });
});

function jsonToDataBase(_json) {
  const jsonKeys = Object.keys(_json);
  jsonKeys.forEach((nomeTabela) => {
    _json[nomeTabela].forEach((item) => {
      const itemKeys = Object.keys(item);

      for (let validation of validations) {
        if (itemKeys.some((e) => e == validation.seletor)) {
          const invalid = validation.fn(item);
          if (invalid) {
            return;
          }
        }
      }

      const values = valuesStringFromObject(item);
      const query = `INSERT INTO ${nomeTabela} (${itemKeys.join(
        ','
      )}) VALUES (${values});`;
      try {
        alasql(query);
      } catch (erro) {
        console.error(erro);
      }
    });
  });
}
