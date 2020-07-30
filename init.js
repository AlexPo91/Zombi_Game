let wrapper = document.querySelector(".wrapper");
let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");
let loader = document.querySelector(".lds-hourglass")
let ajaxHandlerScript="https://fe.it-academy.by/AjaxStringStorage2.php";
let stringName='POLYACHINSCKY_GAME_INFO';
let count = 0
let SPAState = {};
let score
let resultGame
let inputName
let updatePassword;
let flagGame
let arrStorageKey
let flagDotEnd
let URLHash
let stateStr
let parts
let storage
canvas.id = "canvas"
let RAF =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
let background = new Image();
let city = new Image();
let hero = new Image();
let heart = new Image();
let coins = new Image();
let bullet = new Image()
let train = new Image()
let enemyGirl = new Image()
let enemyBoy = new Image()
let jumpAudio = new Audio();
let theheAudio = new Audio()
theheAudio.loop = true
let shooting = new Audio()
let coinSound = new Audio()

function init() {
    background.src = "./assets/img/bg.png";
    city.src = "./assets/img/city.png";
    train.src = "./assets/img/city.png";
    hero.src = "./assets/img/hero_new_small2.png";
    heart.src = "./assets/img/heart.png";
    coins.src = "./assets/img/coin.png";
    enemyGirl.src = "./assets/img/enemyGirl.png";
    enemyBoy.src = "./assets/img/enemyBoy.png";
    bullet.src = "./assets/img/bullet.png"
    jumpAudio.src = "./assets/sound/jump.mp3"
    theheAudio.src = "./assets/sound/theme.mp3"
    shooting.src = "./assets/sound/laser.mp3"
    coinSound.src = "./assets/sound/coin.mp3"
    window.addEventListener("load", function () {
      loader.style.display = 'none'
      document.querySelector('.container-game').style.background = "url('./assets/img/back.png') no-repeat"
      document.querySelector('.container-game').style.backgroundSize = "cover"
      switchToStateFromURLHash()
    });
}

function soundInit() {
  jumpAudio.play();
  jumpAudio.pause();
  theheAudio.play()
  theheAudio.pause()
  shooting.play()
  shooting.pause()
  coinSound.play()
  coinSound.pause()
}
