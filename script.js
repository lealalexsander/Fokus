const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const timerElement = document.querySelector('.app__card-timer');
const stopTime = document.getElementById('stop-time');
const startPause = document.querySelector('#start-pause');
var startPauseText = document.getElementById("button-startPause");
var imagemBt = document.getElementById("button-img");
const tempoNaTela = document.getElementById("timer");
const buttonCadeado = document.getElementById("cadeado");
var cadeado = "fechado";

const audioPlayer = document.getElementById('audio-player');
const musicaFocoInput = document.querySelector('#alternar-musica');
const somPlay = new Audio('/sons/play.wav');
const somPause = new Audio('/sons/pause.mp3');
const somFinalizando = new Audio('/sons/alerta.mp3');


var novoTempo = 1500;
var tempoFoco = novoTempo;
let tempoDecorridoEmSegundos = tempoFoco;
let intervaloId = null;

buttonCadeado.addEventListener('click', () => {
    const img = buttonCadeado.querySelector("img");
    
    if (img.src.includes("cadeado-fechado.png")) {
        img.src = "./imagens/cadeado-aberto.png";
        cadeado = "aberto";
    } else {
        img.src = "./imagens/cadeado-fechado.png";
        cadeado = "fechado";
    }
})

musicaFocoInput.addEventListener('change', () => {
    if (audioPlayer.classList == 'player-desactive') {
        audioPlayer.play();
        audioPlayer.classList.remove('player-desactive');
        audioPlayer.classList.add('player-active');
        audioPlayer.loop = true;
    } else {
        audioPlayer.pause();
        audioPlayer.classList.add('player-desactive');
        audioPlayer.classList.remove('player-active');
    }
});

stopTime.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 0;
    temporizador();
})


focoBt.addEventListener('click', () => {
    if (tempoDecorridoEmSegundos == 0 || cadeado == "aberto") {
        tempoDecorridoEmSegundos = novoTempo;
        alterarContexto('foco');
        focoBt.classList.add('active');
    } else {
        alert("É necessário zerar o tempo para mudar de período!\nOu desbloquei apertando no cadeado 🔒");
    }
    
})

curtoBt.addEventListener('click', () => {
    if (tempoDecorridoEmSegundos == 0 || cadeado == "aberto") {
        tempoDecorridoEmSegundos = 300;
        alterarContexto('descanso-curto');
        curtoBt.classList.add('active');
    } else {
        alert("É necessário zerar o tempo para mudar de período!\nOu desbloquei apertando no cadeado 🔒");
    }
})


longoBt.addEventListener('click', () => {
    if (tempoDecorridoEmSegundos == 0 || cadeado == "aberto") {
        tempoDecorridoEmSegundos = 900;
        alterarContexto('descanso-longo');
        longoBt.classList.add('active');
    } else {
        alert("É necessário zerar o tempo para mudar de período!\nOu desbloquei apertando no cadeado 🔒");
    }
})

function alterarContexto(contexto) {
    temporizador();
    botoes.forEach(function(contexto){
        contexto.classList.remove('active');
    })

    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);

    switch (contexto) {
        case "foco":
            titulo.innerHTML = `Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`;
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
    if (tempoDecorridoEmSegundos == 0) {
        mudarTempo();
        zerar();
        iniciarPausar();
        trocarBotao();
        temporizador();
        return;
    } 

    tempoDecorridoEmSegundos -= 1;
    temporizador();

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
    somFinalizando.pause();
    tempoDecorridoEmSegundos = tempoFoco;
}


function trocarBotao() {
    switch (startPauseText.innerHTML) {
        case "Começar":
            startPauseText.innerHTML = `Pausar`;
            imagemBt.setAttribute('src', `/imagens/pause.png`);
            somPlay.play();
            break;
        case "Pausar":
            startPauseText.innerHTML = `Começar`;
            imagemBt.setAttribute('src', `/imagens/play_arrow.png`);
            somPause.play();
            break;
        default:
            break;
    }
}

function temporizador() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    tempoNaTela.innerHTML = formatarTempo(tempoDecorridoEmSegundos);
}

function mudarTempo() {
    if (html.getAttribute('data-contexto') === "foco") {
        alterarContexto('descanso-curto');
        curtoBt.classList.add('active');
        tempoFoco = 300;
    } else if (html.getAttribute('data-contexto') === "descanso-curto") { 
        alterarContexto('descanso-longo');
        longoBt.classList.add('active');
        tempoFoco = 900;
    } else if (html.getAttribute('data-contexto') === "descanso-longo") {
        alterarContexto('foco');
        focoBt.classList.add('active'); 
        tempoFoco = novoTempo;  
    }
}

var letraTempo = "12rem";

function ajustarFonte() {
    const horas = Math.floor(tempoDecorridoEmSegundos / 3600);
    letraTempo = window.innerWidth <= 767 ? "6rem" : "12rem";

    timerElement.style.fontSize = horas > 0 ? "9rem" : letraTempo;
    timerElement.style.textAlign = horas > 0 ? "center" : "center";
    timerElement.style.marginRight = "5rem";
}

window.addEventListener('resize', ajustarFonte);



tempoNaTela.addEventListener('click', () => {
    function usuarioTempo() {
        if (cadeado === "aberto") {
            const input = document.createElement("input");
            input.type = "text";
            input.value = formatarTempo(tempoDecorridoEmSegundos);

            input.style.backgroundColor = "transparent";
            input.style.color = "white";
            input.style.fontFamily = "Unbounded";
            input.style.fontWeight = "700";
            input.style.fontSize = letraTempo; 
            input.style.textAlign = "center"; 
            input.style.border = "none"; 
            input.style.outline = "none";
        
            tempoNaTela.innerHTML = "";
            tempoNaTela.appendChild(input);
            input.focus();

            input.addEventListener("blur", atualizarTempo);
            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    atualizarTempo();
                }
            });

            function atualizarTempo() {
                const valor = input.value;
                const [minutos, segundos] = valor.split(":").map(Number); 

                if (!isNaN(minutos) && !isNaN(segundos) && segundos >= 0 && segundos < 60) {
                    tempoDecorridoEmSegundos = minutos * 60 + segundos;
                }
                temporizador(); 

                tempoNaTela.removeChild(input);


                novoTempo = input.value; 
            }

        } else {
            alert("Desbloqueie o cadeado para alterar o tempo.");
        }
    }
});


function formatarTempo(tempoEmSegundos) {
    const horas = Math.floor(tempoEmSegundos / 3600);
    const minutos = Math.floor((tempoEmSegundos % 3600) / 60);
    const segundos = tempoEmSegundos % 60;
    
    const horasFormatadas = horas > 0 ? String(horas).padStart(2, "0") + ":" : "";
    const minutosFormatados = String(minutos).padStart(2, "0");
    const segundosFormatados = String(segundos).padStart(2, "0");

    return `${horasFormatadas}${minutosFormatados}:${segundosFormatados}`;
}




temporizador();
