class ValidaFormulario {
  constructor() {
    this.formulario = document.querySelector('.formulario');
    this.cpf = document.querySelector('.cpf');
    this.eventos();
  }
  // Eventos a serem executados
  eventos() {
    this.formulario.addEventListener('submit', (e) => {
      this.handleSubmit(e);
    });
    this.cpf.addEventListener('blur', () => {
      this.mascaraCPF();
    });
  }
  // Método para mascarar o CPF digitado para o modelo '000.000.000-00'
  mascaraCPF() {
    let value = this.cpf.value
      .replace(/[^0-9]/g, '')
      .replace(/^([\d]{3})([\d]{3})?([\d]{3})?([\d]{2})?/, '$1.$2.$3-$4');
    this.cpf.value = value;
  }
  // Método para envio do formulário caso todas as validações sejam true
  handleSubmit(e) {
    e.preventDefault();
    const camposValidos = this.camposSaoValidos();
    const senhasValidas = this.senhasSaoValidas();
    if (camposValidos && senhasValidas) {
      alert('Fomulário enviado.');
      this.formulario.submit();
    }
  }

  // Validação se as senhas são válidas e iguais
  senhasSaoValidas() {
    let valid = true;
    const senha = this.formulario.querySelector('.senha');
    const repetirSenha = this.formulario.querySelector('.repetir-senha');
    if (senha.value !== repetirSenha.value) {
      valid = false;
      this.criaErro(senha, 'Campos senha e repetir senha precisam ser iguais.');
      this.criaErro(
        repetirSenha,
        'Campos senha e repetir senha precisam ser iguais.'
      );
    }

    if (senha.value.length < 3 || senha.value.length > 12) {
      valid = false;
      this.criaErro(senha, 'Senha precisa entre 3 e 12 caracteres.');
    }
    return valid;
  }

  // Validação se os campos estão em branco, e se usuário e cpf são válidos
  camposSaoValidos() {
    let valid = true;
    const error = this.formulario.querySelectorAll('.error-text');
    for (let errorTexto of error) {
      errorTexto.remove();
    }
    for (let campo of this.formulario.querySelectorAll('.validar')) {
      const label = campo.previousElementSibling.innerText;
      if (!campo.value) {
        this.criaErro(campo, `Campo "${label}" não pode estar em branco.`);
        valid = false;
      }
      if (campo.classList.contains('cpf')) {
        if (!this.validaCPF(campo)) valid = false;
      }
      if (campo.classList.contains('usuario')) {
        if (!this.validaUsuario(campo)) valid = false;
      }
    }
    return valid;
  }

  //Validação se o usuário tem os caracteres necessários e se contém apenas letras e/ou números
  validaUsuario(campo) {
    const usuario = campo.value;
    let valid = true;
    if (usuario.length < 3 || usuario.length > 12) {
      this.criaErro(campo, 'Usúario precisa ter entre 3 e 12 caracteres.');
      valid = false;
    }
    if (!usuario.match(/^[a-zA-Z0-9]+$/g)) {
      this.criaErro(
        campo,
        'Nome de usúario precisa conter apenas letras e/ou números.'
      );
      valid = false;
    }
    return valid;
  }

  //Validação do CPF
  validaCPF(campo) {
    const cpf = new ValidaCPF(campo.value);
    if (!cpf.valida()) {
      this.criaErro(campo, 'CPF inválido');
      return false;
    }
    return true;
  }

  //Método pra criação dos erros impostos no decorrer da função
  criaErro(campo, msg) {
    const div = document.createElement('div');
    div.innerHTML = msg;
    div.classList.add('error-text');
    campo.insertAdjacentElement('afterend', div);
  }
}

const valida = new ValidaFormulario();
