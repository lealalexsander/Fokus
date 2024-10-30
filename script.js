const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPause = document.querySelector('#start-pause');
var startPauseText = document.getElementById("button-text");

const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
const somPlay = new Audio('/sons/play.wav');
const somPause = new Audio('/sons/pause.mp3');
const somFinalizando = new Audio('/sons/beep.mp3');

var tempoFoco = 10;
let tempoDecorridoEmSegundos = tempoFoco;
let intervaloId = null;

musica.loop = true;
musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

focoBt.addEventListener('click', () => {
    alterarContexto('foco');
    focoBt.classList.add('active');
})

curtoBt.addEventListener('click', () => {
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
})


longoBt.addEventListener('click', () => {
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
})

function alterarContexto(contexto) {
    botoes.forEach(function(contexto){
        contexto.classList.remove('active');
    })

    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);

    switch (contexto) {
        case "foco":
            titulo.innerHTML = `Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`
            break;
        case "descanso-curto":
            titulo.innerHTML = `Que tal dar uma respirada?<br><strong class="app__title-strong">Faça uma Pausa Curta!</strong>`;
            break;
        case "descanso-longo":
            titulo.innerHTML = `Hora de voltar à superfície<br><strong class="app__title-strong">Faça uma Pausa Longa!</strong>`;
        default:
            break;
    }    
    
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        zerar();
        alert('Tempo Finalizado!')
        trocarBotao();
        reiniciarTempo();
        return
    } 

    tempoDecorridoEmSegundos -= 1;
    console.log('Temporizador:' + tempoDecorridoEmSegundos);

    if (tempoDecorridoEmSegundos <= 5) {
        somFinalizando.play();
    }

}

startPause.addEventListener('click', iniciarPausar);

function iniciarPausar() {
    trocarBotao();
    if (intervaloId) {
        zerar();
        return;
    }
    intervaloId = setInterval(contagemRegressiva, 1000);
}

function zerar() {
    clearInterval(intervaloId);
    intervaloId = null;
}

function reiniciarTempo() {
    tempoDecorridoEmSegundos = tempoFoco;
}

function trocarBotao() {
    switch (startPauseText.innerHTML) {
        case "Começar":
            startPauseText.innerHTML = `Pausar`;
            somPlay.play();
            break;
        case "Pausar":
            startPauseText.innerHTML = `Começar`;
            somPause.play();
            break;
        default:
            break;
    }
}