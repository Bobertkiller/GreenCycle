document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const passwordMatchError = document.getElementById('password-match-error');
    const signupError = document.getElementById('signup-error');

    // Reset error messages
    passwordMatchError.style.display = 'none';
    signupError.style.display = 'none';

    // Check if passwords match
    if (password !== confirmPassword) {
        passwordMatchError.style.display = 'block';
        return;
    }

    fetch('http://127.0.0.1:5000/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'login.html';
            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        } else {
            signupError.textContent = data.error || 'Erro ao criar conta';
            signupError.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        signupError.textContent = 'Erro ao conectar com o servidor';
        signupError.style.display = 'block';
    });
});

// Real-time password matching validation
document.getElementById('confirm-password').addEventListener('input', function() {
    const password = document.getElementById('new-password').value;
    const confirmPassword = this.value;
    const passwordMatchError = document.getElementById('password-match-error');
    
    if (confirmPassword) {
        if (password !== confirmPassword) {
            passwordMatchError.style.display = 'block';
        } else {
            passwordMatchError.style.display = 'none';
        }
    }
});
  