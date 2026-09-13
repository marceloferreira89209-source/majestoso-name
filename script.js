document.getElementById("form-cep").addEventListener("submit", (evento) => {
  evento.preventDefault();
  const cepInput = document.getElementById("campo-cep").value.replace(/\D/g, '');
  if (cepInput) {
    buscarEnderecoPorCEP(cepInput);
  }
});

async function buscarEnderecoPorCEP(cep) {
  const areaResultado = document.getElementById("resultado");

  // Validação inicial do CEP
  if (cep.length !== 8) {
    areaResultado.innerHTML = `<p class="erro">⚠️ Digite um CEP válido com 8 números.</p>`;
    return;
  }

  // Estado de carregamento
  areaResultado.innerHTML = `<p class="instrucao">⏳ Consultando CEP para a entrega dos doces...</p>`;

  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    
    if (!resposta.ok) {
      throw new Error("Não foi possível conectar ao serviço de busca de CEP.");
    }

    const dados = await resposta.json();

    if (dados.erro) {
      throw new Error("CEP não encontrado! Por favor, confirme o número digitado.");
    }

    // Exibição dos dados retornados da API
    areaResultado.innerHTML = `
      <div class="endereco-info">
        <h4>✅ Endereço confirmado para entrega:</h4>
        <p><strong>Rua/Avenida:</strong> ${dados.logradouro || 'Endereço registrado'}</p>
        <p><strong>Bairro:</strong> ${dados.bairro || 'Centro'}</p>
        <p><strong>Cidade / Estado:</strong> ${dados.localidade} / ${dados.uf}</p>
        <p><strong>DDD Local:</strong> (${dados.ddd})</p>
        <p style="margin-top: 10px; color: #2e7d32; font-weight: 600;">🛵 Entregamos doces fresquinhos nessa região!</p>
      </div>
    `;

  } catch (erro) {
    // Tratamento de erros
    areaResultado.innerHTML = `<p class="erro">⚠️ ${erro.message}</p>`;
  }
}