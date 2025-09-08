let valor  = document.getElementById("valor");
let valor2 = document.getElementById("valor2");
let moeda1 = document.getElementById("moeda1");
let moeda2 = document.getElementById("moeda2");

// Configuração do formato BR
const fmtBR = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

// Converte texto para número
function parseAmount(texto) {
  if (!texto) return NaN;
  return parseFloat(texto.replace(/\./g, "").replace(",", "."));
}

// Formata número no padrão brasileiro
function formatBR(numero) {
  return numero.toLocaleString("pt-BR", fmtBR);
}

async function converter(fromInput, toInput, fromSelect, toSelect, formatar = true) {
  if (!fromInput.value.trim()) {
    toInput.value = "";
    return;
  }

  const amount = parseAmount(fromInput.value);
  if (isNaN(amount)) { 
    toInput.value = ""; 
    return; 
  }

  // Só formata quando sair do campo
  if (formatar) {
    fromInput.value = formatBR(amount);
  }

  // Mesma moeda → não chama API
  if (fromSelect.value === toSelect.value) {
    toInput.value = formatBR(amount);
    return;
  }

  // Busca API
  const resp = await fetch(
    `https://api.frankfurter.app/latest?amount=${amount}&from=${fromSelect.value}&to=${toSelect.value}`
  );
  const dados = await resp.json();

  toInput.value = formatBR(dados.rates[toSelect.value]);
}

// Eventos ao digitar (sem formatar ainda)
valor.addEventListener("input", () => converter(valor,  valor2, moeda1, moeda2, false));
valor2.addEventListener("input", () => converter(valor2, valor,  moeda2, moeda1, false));

// Eventos ao sair do campo (formata)
valor.addEventListener("blur", () => converter(valor,  valor2, moeda1, moeda2, true));
valor2.addEventListener("blur", () => converter(valor2, valor,  moeda2, moeda1, true));

// Eventos de troca de moeda
moeda1.addEventListener("change", () => converter(valor,  valor2, moeda1, moeda2, true));
moeda2.addEventListener("change", () => converter(valor,  valor2, moeda1, moeda2, true));

// Inicia com 0,00
valor.value = formatBR(0);
converter(valor, valor2, moeda1, moeda2, true);
