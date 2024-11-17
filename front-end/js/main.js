// Simple auth check for protected pages
if (window.location.pathname.includes('profile.html') || 
    window.location.pathname.includes('resgatados.html')) {
    if (!localStorage.getItem('user_id')) {
        window.location.href = 'login.html';
    }
}

// Only run store functionality if we're on the store page
if (window.location.pathname.includes('store.html')) {
    document.addEventListener("DOMContentLoaded", function() {
        const userId = localStorage.getItem('user_id');
        displayUserPoints(userId);
        loadProducts();
    });
}

// Função para exibir o saldo do usuário
function displayUserPoints(userId) {
  if (!userId) {
    console.error("ID do usuário não encontrado. Faça login novamente.");
    window.location.href = 'login.html';
    return;
  }

  fetch(`http://127.0.0.1:5000/api/user/${userId}/points`)
    .then(response => response.json())
    .then(data => {
      if (data.points !== undefined) {
        document.getElementById('user-points').textContent = `Saldo: ${data.points} pontos`;
      } else {
        console.error("Erro ao carregar o saldo do usuário.");
      }
    })
    .catch(error => console.error("Erro ao carregar o saldo:", error));
}

function loadProducts() {
  fetch('http://127.0.0.1:5000/api/products')
    .then(response => response.json())
    .then(products => {
      const productList = document.getElementById("product-list");
      productList.innerHTML = ''; // Limpa a lista para evitar duplicatas

      if (products.length === 0) {
        productList.innerHTML = '<p>Nenhum produto disponível no momento.</p>';
        return;
      }

      products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        const imageUrl = `assets/img/${product.image}`; // Caminho ajustado para as imagens no frontend

        productCard.innerHTML = `
          <img src="${imageUrl}" alt="${product.name}" class="product-image">
          <h2 class="product-name">${product.name}</h2>
          <p class="product-description">${product.description}</p>
          <p class="product-points"><strong>${product.points} Pontos</strong></p>
          <button onclick="redeemProduct(${localStorage.getItem('user_id')}, ${product.id}, ${product.points})">Resgatar</button>
        `;
        productList.appendChild(productCard);
      });
    })
    .catch(error => console.error("Erro ao carregar os produtos:", error));
}

// Função para confirmar e resgatar um produto
function redeemProduct(userId, productId, productPoints) {
    // Create custom confirmation dialog
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'custom-confirm';
    confirmDialog.innerHTML = `
        <div class="confirm-content">
            <p>Você tem certeza de que deseja resgatar este produto por ${productPoints} pontos?</p>
            <div class="confirm-buttons">
                <button class="confirm-yes">Sim</button>
                <button class="confirm-no">Não</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmDialog);

    // Handle button clicks
    confirmDialog.querySelector('.confirm-yes').onclick = () => {
        document.body.removeChild(confirmDialog);
        // Proceed with redemption
        fetch(`http://127.0.0.1:5000/api/user/${userId}/resgatar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Produto resgatado com sucesso!");
                displayUserPoints(userId);
                loadProducts();
            } else if (data.error) {
                alert(`Erro: ${data.error}`);
            }
        })
        .catch(error => console.error("Erro ao resgatar produto:", error));
    };

    confirmDialog.querySelector('.confirm-no').onclick = () => {
        document.body.removeChild(confirmDialog);
    };
}

// Função para gerar o código e o QR Code
function generateCodeAndQR(productId) {
  const productCode = generateRandomCode(); // Gera o código aleatório
  document.getElementById(`product-code-${productId}`).textContent = productCode;

  // Exibe o código gerado e o QR Code
  document.getElementById(`code-display-${productId}`).style.display = 'block';

  // Gera o QR Code
  new QRCode(document.getElementById(`qrcode-${productId}`), {
    text: productCode, // O QR Code vai carregar o código gerado
    width: 128,         // Largura do QR Code
    height: 128,        // Altura do QR Code
    colorDark: "#000000",   // Cor do QR Code
    colorLight: "#ffffff",  // Cor de fundo do QR Code
    correctLevel: QRCode.CorrectLevel.H
  });

  // Opcional: Fazer o POST para o backend para salvar o código no banco
  fetch(`/api/user/${localStorage.getItem('user_id')}/resgatar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ product_id: productId })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Produto resgatado com sucesso!");
    } else {
      alert(`Erro: ${data.error}`);
    }
  })
  .catch(error => console.error("Erro ao resgatar produto:", error));
}

// Função para gerar um código aleatório
function generateRandomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}