// Função para navegar de volta ao hub
function navigateToHub() {
    window.location.href = 'index.html';
  }
  
  // Função para exibir o formulário de edição
  function showEditForm() {
    document.getElementById('edit-form').style.display = 'block';
  }
  
  // Função para esconder o formulário de edição
  function hideEditForm() {
    document.getElementById('edit-form').style.display = 'none';
  }
  
  // Função para fazer o logout
  function logout() {
    // Define o status de login como falso e remove dados do usuário
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_points');
    window.location.href = 'login.html';
  }
  
  // Função para atualizar a senha no backend
  function updateUserPassword(userId, newPassword) {
    fetch(`http://127.0.0.1:5000/api/user/${userId}/update-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Senha atualizada com sucesso!');
        hideEditForm();
      } else {
        alert('Erro ao atualizar a senha.');
      }
    })
    .catch(error => console.error('Erro ao atualizar a senha:', error));
  }
  
  // Função para exibir o saldo do usuário ao carregar a página
  document.addEventListener("DOMContentLoaded", function() {
    const userId = localStorage.getItem('user_id');
    displayUserPoints(userId); // Exibe o saldo do usuário ao carregar a página
    loadUserData(userId); // Carrega os dados do usuário (nome)
  });
  
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
  
  // Função para carregar os dados do usuário (nome)
  function loadUserData(userId) {
    if (!userId) {
      console.error("ID do usuário não encontrado.");
      return;
    }
  
    fetch(`http://127.0.0.1:5000/api/user/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Falha na requisição');
        }
        return response.json();
      })
      .then(data => {
        if (data.username) {
          document.getElementById('user-name').textContent = data.username;
        } else {
          console.error("Erro ao carregar as informações do usuário.");
        }
      })
      .catch(error => {
        console.error("Erro ao carregar as informações:", error);
        alert("Houve um erro ao carregar as informações. Tente novamente.");
      });
  }
  
  // Função para enviar as alterações do perfil
  document.getElementById('edit-profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }
  
    const userId = localStorage.getItem('user_id');
    if (userId) {
      updateUserPassword(userId, newPassword);
    }
  });
  
  // Theme switcher functionality
  document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.querySelector('#checkbox');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    toggleSwitch.checked = currentTheme === 'dark';

    // Theme switch handler
    function switchTheme(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }

    toggleSwitch.addEventListener('change', switchTheme);
  });
  