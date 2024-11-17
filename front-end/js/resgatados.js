document.addEventListener("DOMContentLoaded", function() {
  const userId = localStorage.getItem('user_id');
  if (userId) {
    fetch(`http://127.0.0.1:5000/api/user/${userId}/resgatados`)
      .then(response => response.json())
      .then(data => {
        const resgatadosList = document.getElementById('redeemed-products-container');
        resgatadosList.innerHTML = '';

        if (data.length === 0) {
          resgatadosList.innerHTML = '<p>Nenhum produto resgatado ainda.</p>';
        } else {
          data.forEach(produto => {
            const produtoDiv = document.createElement('div');
            produtoDiv.classList.add('redeemed-card');
            
            produtoDiv.innerHTML = `
                <div class="card-wrapper">
                    <div class="flipper">
                        <div class="card-front">
                            <img src="assets/img/${produto.image}" alt="${produto.name}" class="redeemed-product-image">
                            <h2 class="redeemed-product-name">${produto.name}</h2>
                            <p class="redeemed-product-description">${produto.description}</p>
                            <p class="redeemed-product-resgatado">Resgatado em: ${produto.resgatado_em}</p>
                        </div>
                        <div class="card-back">
                            <div class="code-container">
                                <h3>Código do Produto</h3>
                                <p class="redeemed-product-code">Código: ${produto.code || 'Não disponível'}</p>
                                <button class="copy-code-btn" ${!produto.code ? 'disabled' : ''}>
                                    ${produto.code ? 'Copiar Código' : 'Código Indisponível'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add flip functionality
            produtoDiv.addEventListener('click', function(e) {
                if (!e.target.classList.contains('copy-code-btn')) {
                    this.classList.toggle('flipped');
                }
            });

            // Add copy functionality
            const copyBtn = produtoDiv.querySelector('.copy-code-btn');
            if (produto.code) {
                copyBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    navigator.clipboard.writeText(produto.code)
                        .then(() => {
                            this.textContent = 'Copiado!';
                            this.style.backgroundColor = '#4CAF50';
                            setTimeout(() => {
                                this.textContent = 'Copiar Código';
                                this.style.backgroundColor = '#6d5ea0';
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Erro ao copiar:', err);
                            this.textContent = 'Erro ao copiar';
                            this.style.backgroundColor = '#ff0000';
                        });
                });
            }

            resgatadosList.appendChild(produtoDiv);
          });
        }
      })
      .catch(error => console.error("Erro ao carregar produtos resgatados:", error));
  } else {
    window.location.href = 'login.html';
  }
});

function navigateToHub() {
  window.location.href = 'index.html';
}
