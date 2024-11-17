document.getElementById('generate-code-btn').addEventListener('click', function() {
  const generatedCode = generateRandomCode();  // Gera o código aleatório
  document.getElementById('generated-code').value = generatedCode;  // Exibe o código gerado
  generateQRCode(generatedCode);  // Gera o QR Code
});

// Função para gerar código aleatório
function generateRandomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const length = 10;  // Tamanho do código
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Função para gerar o QR Code
function generateQRCode(code) {
  const qrCodeContainer = document.getElementById('qr-code');
  qrCodeContainer.innerHTML = '';  // Limpa o QR Code anterior

  new QRCode(qrCodeContainer, {
      text: code,  // Texto que será convertido em QR Code
      width: 256,  // Tamanho maior do QR Code
      height: 256, // Tamanho maior do QR Code
      colorDark: "#000000", // Cor do código
      colorLight: "#ffffff", // Cor do fundo
      correctLevel: QRCode.CorrectLevel.H  // Nível de correção de erro
  });
}

// Função para navegar de volta ao Hub
function navigateToHub() {
  window.location.href = 'index.html';  // Redireciona para a página do hub
}
