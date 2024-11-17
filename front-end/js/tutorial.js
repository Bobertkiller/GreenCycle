function startTutorial() {
    const intro = introJs();

    intro.setOptions({
        steps: [
            {
                title: 'Bem-vindo!',
                intro: 'Vamos conhecer as funcionalidades do GreenCycle?'
            },
            {
                element: '.section-button:nth-child(2)',
                intro: 'Veja seu perfil, mude de senha ou deslogue da plataforma.'
            },
            {
                element: '.section-button:nth-child(3)',
                intro: 'Troque seus pontos acumulados por recompensas nas nossas lojas parceiras.'
            },
            {
                element: '.section-button:nth-child(4)',
                intro: 'Encontre pontos de coleta próximos a você e calcule rotas para chegar lá onde você pode reciclar para resgatar pontos.'
            },
            {
                element: '.section-button:nth-child(5)',
                intro: 'Veja todos os produtos que você já resgatou, clique no produto para revelar seu código de resgate.'
            },
            {
                element: '.section-button:nth-child(6)',
                intro: 'Gere códigos QR para acessar as lixeiras eletrônicas nos pontos de coleta e valide seus pontos.'
            }
        ],
        showProgress: true,
        showBullets: true,
        exitOnOverlayClick: false,
        showStepNumbers: true,
        nextLabel: 'Próximo',
        prevLabel: 'Anterior',
        skipLabel: 'Pular',
        doneLabel: 'Concluir'
    });

    intro.start();
}

// Add CSS for help button and container
const style = document.createElement('style');
style.textContent = `
    .help-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
    }

    .help-button {
        background-color: var(--button-background);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }

    .help-button:hover {
        transform: scale(1.1);
        background-color: var(--button-hover);
    }

    .help-text {
        background-color: var(--button-background);
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .help-container:hover .help-text {
        opacity: 1;
    }

    /* Custom Intro.js styling */
    .introjs-tooltip {
        background-color: var(--card-background);
        color: var(--text-color);
    }

    .introjs-button {
        background-color: var(--button-background);
        color: white;
        border: none;
        text-shadow: none;
    }

    .introjs-button:hover {
        background-color: var(--button-hover);
    }

    .guide-button {
        margin-top: 20px;
        background-color: var(--button-background);
    }

    .guide-button:hover {
        background-color: var(--button-hover);
    }
`;
document.head.appendChild(style);  