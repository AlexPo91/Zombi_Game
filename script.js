function mainGame() {
  //Объявление и назначение переменных
  canvas.width = document.querySelector(".wrapper").offsetWidth;
  canvas.height = document.querySelector(".wrapper").offsetHeight;
  controller.left = false
  controller.right = false
  controller.up = false
  controller.shot = false
  storage = {};
  score = 0;
  flagGame = true; //игра идет
  flagDotEnd = false; //дошел ли герой до чекпоинта
  let last = performance.now();
  let step = 1 / 60;
  let dt = 0;
  let now;
  let camera = {
    cameraPos: { x: 0, y: 0 },
  };
  const ACCEL_X_HERO = 1;
  const ACCEL_Y_HERO = 1;
  const JUMP_H_HERO = 15;
  const LIFE_HERO = 3;
  const BULLET_HERO = 3;
  const WIDTH_HERO = 45;
  const HEIGHT_HERO = 72.37;
  const START_POS_HERO_Y = 25; // Отметка земли
  const HEIGHT_PLATFORM = 15;
  const HEIGHT_ENEMY_GIRL = 82;
  const WIDTH_ENEMY_GIRL = 52;
  const HEIGHT_ENEMY_BOY = 70;
  const WIDTH_ENEMY_BOY = 51;
  const HEIGHT_BULLET = 10;
  const WIDTH_BULLET = 10;
  const WIDTH_TRAINS = 120;
  const SPEED_TRAINS = 0.5;
  const SPEED_BULLET = 7;
  const DISTANCE_BULLET = 200;
  const ADD_SCORE_FROM_COINS = 10;
  const ADD_SCORE_FROM_BULLET = 100;
  //Параметры героя
  let HERO = {
    x: 10,
    y: canvas.height - HEIGHT_HERO - START_POS_HERO_Y,
    dX: 0,
    dY: 0,
    width: WIDTH_HERO,
    height: HEIGHT_HERO,
    accelX: ACCEL_X_HERO,
    accelY: ACCEL_Y_HERO,
    speedX: 0,
    speedY: 0,
    jumpH: JUMP_H_HERO,
    jumping: false,
    life: LIFE_HERO,
    bullet: BULLET_HERO,
    sideStand: "right",
    sprites: {
      standRight: new Sprite(spritesOptions.hero.standRight),
      standLeft: new Sprite(spritesOptions.hero.standLeft),
      runRight: new Sprite(spritesOptions.hero.runRight),
      runLeft: new Sprite(spritesOptions.hero.runLeft),
      jumpRight: new Sprite(spritesOptions.hero.jumpRight),
      jumpLeft: new Sprite(spritesOptions.hero.jumpLeft),
    },
  };
  //Задание высоты для платформ
  let platformLevel = {
    l0: canvas.height - 25,
    l1: canvas.height - 115,
    l2: canvas.height - 205,
    l3: canvas.height - 295,
  };
  //Конструктор платформ
  function Platform(x, y, width) {
    let self = this;
    self.height = HEIGHT_PLATFORM;
    self.x = x;
    self.y = y;
    self.width = width;
  }
  //Конструктор противников
  function Enemy(x, y, dist, speed, speedSprite, move, gender) {
    let self = this;
    self.x = x;
    self.dX = x;
    self.dist = dist;
    self.speedX = speed;
    self.move = move;
    self.speedSprite = speedSprite;
    if (gender === "boy") {
      spritesOptions.enemyBoy.runRight.speed = self.speedSprite;
      spritesOptions.enemyBoy.runLeft.speed = self.speedSprite;
      spritesOptions.enemyBoy.stand.speed = self.speedSprite;
      self.y = y - HEIGHT_ENEMY_BOY;
      self.width = WIDTH_ENEMY_BOY;
      self.height = HEIGHT_ENEMY_BOY;
      self.sprite = {
        stand: new Sprite(spritesOptions.enemyBoy.stand),
        runRight: new Sprite(spritesOptions.enemyBoy.runRight),
        runLeft: new Sprite(spritesOptions.enemyBoy.runLeft),
      };
    } else if (gender === "girl") {
      spritesOptions.enemyGirl.runRight.speed = self.speedSprite;
      spritesOptions.enemyGirl.runLeft.speed = self.speedSprite;
      spritesOptions.enemyGirl.stand.speed = self.speedSprite;
      self.y = y - HEIGHT_ENEMY_GIRL;
      self.width = WIDTH_ENEMY_GIRL;
      self.height = HEIGHT_ENEMY_GIRL;
      self.sprite = {
        stand: new Sprite(spritesOptions.enemyGirl.stand),
        runRight: new Sprite(spritesOptions.enemyGirl.runRight),
        runLeft: new Sprite(spritesOptions.enemyGirl.runLeft),
      };
    }
  }
  //Создаем платформы
  let platform = [
    new Platform(200, platformLevel.l1, 100),
    new Platform(970, platformLevel.l1, 100),
    new Platform(340, platformLevel.l2, 150),
    new Platform(520, platformLevel.l1, 50),
    new Platform(600, platformLevel.l2, 350),
    new Platform(1100, platformLevel.l2, 350),
    new Platform(1450, platformLevel.l1, 100),
    new Platform(1800, platformLevel.l1, 400),
    new Platform(2400, platformLevel.l1, 50),
    new Platform(2450, platformLevel.l2, 50),
    new Platform(2500, platformLevel.l3, 50),
    new Platform(2600, platformLevel.l3, 80),
    new Platform(2700, platformLevel.l3, 50),
    new Platform(2750, platformLevel.l2, 50),
    new Platform(2800, platformLevel.l1, 50),
    new Platform(1900, platformLevel.l2, 50),
    new Platform(2100, platformLevel.l2, 50),
    new Platform(340, platformLevel.l2, 150),
    new Platform(500, platformLevel.l3, 150),
    new Platform(750, platformLevel.l3, 350),
    new Platform(1470, platformLevel.l3, 350),
  ];
  //Создаем Противника
  let enemy = [
    new Enemy(250, platformLevel.l1, 0, 1, 2, false, "girl"),
    new Enemy(500, platformLevel.l3, 100, 1, 2, true, "girl"),
    new Enemy(600, platformLevel.l2, 300, 0.3, 5, true, "girl"),
    new Enemy(600, platformLevel.l2, 300, 2, 1, true, "boy"),
    new Enemy(1900, platformLevel.l2, 0, 1, 2, false, "boy"),
    new Enemy(2450, platformLevel.l2, 0, 1, 2, false, "boy"),
    new Enemy(2750, platformLevel.l2, 0, 1, 2, false, "girl"),
    new Enemy(400, platformLevel.l0, 230, 1, 3, true, "boy"),
    new Enemy(900, platformLevel.l0, 900, 2, 1, true, "boy"),
    new Enemy(1000, platformLevel.l0, 1000, 3, 0.7, true, "girl"),
    new Enemy(1500, platformLevel.l0, 1000, 3, 0.7, true, "girl"),
    new Enemy(2000, platformLevel.l0, 1000, 0.5, 3, true, "boy"),
    new Enemy(3000, platformLevel.l0, 100, 4, 0.5, true, "girl"),
  ];
  //Создание карту монет
  let coin = [];
  function createMapCoins(map, distanceX, distanceY) {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[i].length; j++) {
        if (map[i][j] === "#")
          coin.push({
            x: distanceX + 25 * j,
            y: distanceY + 25 * i,
            width:
              spritesOptions.coins.width / spritesOptions.coins.numberOfFrames,
            height: spritesOptions.coins.height,
            sprite: new Sprite(spritesOptions.coins),
          });
      }
    }
  }
  createMapCoins(coinMap1, 350, canvas.height - 440);
  createMapCoins(coinMap2, 1200, canvas.height - 380);
  createMapCoins(coinMap4, 650, canvas.height - 250);
  createMapCoins(coinMap4, 2550, canvas.height - 420);
  createMapCoins(coinMap3, 440, canvas.height - 165);
  createMapCoins(coinMap5, 220, canvas.height - 150);
  //пули
  let bullets = [];
  let lastBullet = 0;
  let bulletsStock = [
    {
      x: 2110,
      y: canvas.height - 350,
      width: WIDTH_BULLET,
      height: HEIGHT_BULLET,
    },
    {
      x: 2620,
      y: canvas.height - 400,
      width: WIDTH_BULLET,
      height: HEIGHT_BULLET,
    },
  ];
  //Поезд
  let trains = {
    x: 3200,
    y: canvas.height - WIDTH_TRAINS,
    width: WIDTH_TRAINS,
    speedX: SPEED_TRAINS,
  };
  //Функции
  function game() {
    now = performance.now();
    dt = dt + Math.min(1, (now - last) / 1000);
    while (dt > step) {
      dt = dt - step;
      update(step);
    }
    last = now;
    render(dt);
    if (flagGame) {
      RAF(game);
    }
  }
  //Функция отрисовки
  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    renderArea();
    context.save();
    context.translate(-camera.cameraPos.x, -camera.cameraPos.y);
    renderCity();
    renderPlatform();
    renderHero();
    renderEnemy();
    renderCoin();
    renderBullits();
    renderBullitsStock();
    renderTrain();
    context.restore();
    renderMenu();
  }
  //Функция обновления
  function update(dt) {
    HERO.dX = HERO.x;
    HERO.dY = HERO.y;
    let dir = { x: 0, y: 0 };
    //Движение героя и камеры
    if (controller.right) {
      HERO.sideStand = "right";
      HERO.speedX = HERO.accelX;
      HERO.x += HERO.speedX * dt * 100;
      //Движение камеры
      if (HERO.x - camera.cameraPos.x >= canvas.width * 0.8) {
        dir.x += HERO.speedX * dt * 100;
      }
    }
    if (controller.left) {
      HERO.sideStand = "left";
      HERO.speedX = HERO.accelX;
      HERO.x -= HERO.speedX * dt * 100;
      //Движение камеры
      if (
        HERO.x - camera.cameraPos.x <= canvas.width * 0.2 &&
        camera.cameraPos.x >= Math.abs(HERO.speedX)
      ) {
        dir.x -= HERO.speedX * dt * 100;
      }
    }
    if (controller.up && !HERO.jumping) {
      HERO.speedY -= HERO.jumpH;
      HERO.jumping = true;
      jumpAudio.currentTime = 0;
      jumpAudio.play();
      vibro();
    }
    HERO.speedY += HERO.accelY;
    HERO.y += HERO.speedY;
    if (HERO.height > HERO.dY) {
      camera.cameraPos.y = HERO.dY - HERO.height;
    }
    if (HERO.y + HERO.height >= canvas.height * 0.8) {
      camera.cameraPos.y = 0;
    }
    camera.cameraPos.x += dir.x;
    //Не даёт опуститься ниже отметки земли
    if (HERO.y > canvas.height - HEIGHT_HERO - START_POS_HERO_Y) {
      HERO.y = canvas.height - HEIGHT_HERO - START_POS_HERO_Y;
      HERO.speedY = 0;
      HERO.jumping = false;
      camera.cameraPos.y = 0;
    }
    //Начальные и конечные точки ограничения движения
    if (HERO.x < 0) {
      HERO.x = 0;
      HERO.speedX = 0;
    }
    if (HERO.x + HERO.width >= 3100) {
      dir.x = 0;
      HERO.x = 3100 - HERO.width;
      flagDotEnd = true;
    }
    if (flagDotEnd) {
      evacuation();
    }
    //Столкновение с платформами
    for (let i = 0; i < platform.length; i++) {
      isCollisionPlatform(HERO, platform[i]);
    }
    //Собираем монеты
    for (let i = 0; i < coin.length; i++) {
      isCollisionCoin(HERO, coin[i]);
    }
    //Движение противника
    for (let i = 0; i < enemy.length; i++) {
      moveEnemy(enemy[i]);
    }
    //Столкновение с противником
    for (let i = 0; i < enemy.length; i++) {
      isCollisionEnemy(HERO, enemy[i]);
    }
    //Стреляем
    if (controller.shot && HERO.bullet > 0) {
      if (now - lastBullet > 500) {
        HERO.bullet--;
        shooting.currentTime = 0;
        shooting.play();
        bullets.push({
          x: HERO.x + HERO.width / 2,
          y: HERO.y + HERO.height / 2,
          width: WIDTH_BULLET,
          height: HEIGHT_BULLET,
          speed: SPEED_BULLET,
          distance: DISTANCE_BULLET,
          side: HERO.sideStand,
        });
        lastBullet = performance.now();
      }
    }
    //В какую сторону стреляем и исчезновение пули
    for (let i = 0; i < bullets.length; i++) {
      if (bullets[i].side === "right") {
        bullets[i].x += bullets[i].speed;
      }
      if (bullets[i].side === "left") {
        bullets[i].x -= bullets[i].speed;
      }
      bullets[i].distance -= bullets[i].speed;
      if (bullets[i].distance <= 0) {
        bullets.splice(bullets[i], 1);
      }
    }
    //Определяем попадание(убираем пулю и противника если попали)
    for (let i = 0; i < bullets.length; i++) {
      for (let j = 0; j < enemy.length; j++) {
        if (!!bullets[i]) {
          isCollisionBullet(bullets[i], enemy[j]);
        }
      }
    }
    //Собираем дополнительные патроны
    for (let i = 0; i < bulletsStock.length; i++) {
      isCollisionBulletStock(HERO, bulletsStock[i]);
    }
  }
  //Функция отрисовки заднего плана
  function renderArea() {
    context.drawImage(
      background,
      15,
      215,
      380,
      224,
      0,
      0,
      canvas.width,
      canvas.height
    );
    context.drawImage(
      background,
      425,
      225,
      380,
      180,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
  //Функция отрисовки меню
  function renderMenu() {
    context.fillStyle = "#e10000";
    context.drawImage(heart, 10, 10);
    context.font = "22px joscelynnregular";
    context.fillText(HERO.life, 40, 35);
    context.fillStyle = "#EEB12F";
    context.fillText("Score: " + score, canvas.width / 2 - 50, 35);
    context.fillStyle = "#f6ad3a";
    context.drawImage(bullet, 70, 15);
    context.fillText(HERO.bullet, 95, 35);
  }
  //Функция отрисовки города
  function renderCity() {
    context.drawImage(
      city,
      0,
      canvas.height - city.height,
      city.width,
      city.height
    );
  }
  //Функция отрисовки платформ
  function renderPlatform() {
    for (let i = 0; i < platform.length; i++) {
      context.fillStyle = "grey";
      context.fillRect(
        platform[i].x,
        platform[i].y,
        platform[i].width,
        platform[i].height
      );
    }
  }
  //Функция отрисовки героя
  function renderHero() {
    if (!controller.up && !controller.left && !controller.right) {
      if (HERO.sideStand === "right") {
        HERO.sprites.standRight.start(HERO.x, HERO.y);
      } else if (HERO.sideStand === "left") {
        HERO.sprites.standLeft.start(HERO.x, HERO.y);
      }
    } else if (controller.right && !controller.up) {
      HERO.sprites.runRight.start(HERO.x, HERO.y);
    } else if (controller.left && !controller.up) {
      HERO.sprites.runLeft.start(HERO.x, HERO.y);
    } else if (controller.up && controller.right) {
      HERO.sprites.jumpRight.start(HERO.x, HERO.y);
    } else if (controller.up && controller.left) {
      HERO.sprites.jumpLeft.start(HERO.x, HERO.y);
    } else if (controller.up) {
      HERO.sprites.jumpRight.start(HERO.x, HERO.y);
    }
  }
  //Функция отрисовки противника
  function renderEnemy() {
    for (let i = 0; i < enemy.length; i++) {
      if (enemy[i].speedX < 0) {
        enemy[i].sprite.runLeft.start(enemy[i].x, enemy[i].y);
      } else if (!enemy[i].move) {
        enemy[i].sprite.stand.start(enemy[i].x, enemy[i].y);
      } else {
        enemy[i].sprite.runRight.start(enemy[i].x, enemy[i].y);
      }
    }
  }
  //Функция отрисовки пули
  function renderBullits() {
    for (let i = 0; i < bullets.length; i++) {
      context.drawImage(bullet, bullets[i].x, bullets[i].y);
    }
  }
  //Функция отрисовки дополнительных пуль
  function renderBullitsStock() {
    for (let i = 0; i < bulletsStock.length; i++) {
      context.drawImage(bullet, bulletsStock[i].x, bulletsStock[i].y);
    }
  }
  //Функция отрисовки монет
  function renderCoin() {
    for (let i = 0; i < coin.length; i++) {
      coin[i].sprite.start(coin[i].x, coin[i].y);
    }
  }
  //Функция отрисовки поезда
  function renderTrain() {
    context.drawImage(
      city,
      3300,
      380,
      240,
      trains.width,
      trains.x,
      trains.y,
      240,
      trains.width
    );
  }
  //Функция определения столкновения
  function collision(obj1, obj2) {
    if (
      obj1.x + obj1.width * 0.7 > obj2.x &&
      obj1.x < obj2.x + obj2.width - obj1.width * 0.3 &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    ) {
      return true;
    } else {
      return false;
    }
  }
  //Функция определения столкновения героя и платформы
  function isCollisionPlatform(obj1, obj2) {
    if (collision(obj1, obj2)) {
      if (obj1.dX + obj1.width <= obj2.x) {
        obj1.x = obj2.x - obj1.width;
        HERO.speedX = 0;
      }
      if (obj1.dX >= obj2.x + obj2.width) {
        obj1.x = obj2.x + obj2.width;
        HERO.speedX = 0;
      }

      if (obj1.dY + obj1.height <= obj2.y) {
        obj1.y = obj2.y - obj1.height;
        HERO.speedY = 0;
        obj1.jumping = false;
      }
      if (obj1.dY >= obj2.y + obj2.height) {
        obj1.y = obj2.y + obj2.height;
        HERO.speedY = 0;
      }
    }
  }
  //Функция определения касания героя и монет
  function isCollisionCoin(obj1, obj2) {
    if (collision(obj1, obj2)) {
      coinSound.currentTime = 0;
      coinSound.play();
      score += ADD_SCORE_FROM_COINS;
      let index = coin.indexOf(obj2);
      coin.splice(index, 1);
    }
  }
  //Функция движения противника
  function moveEnemy(enemy) {
    if (enemy.move) {
      enemy.x += enemy.speedX;
      if (enemy.dX + enemy.dist < enemy.x) {
        enemy.speedX = -enemy.speedX;
      }
      if (enemy.x < enemy.dX) {
        enemy.speedX = -enemy.speedX;
      }
    }
  }
  //Функция определения столкновения героя и противника
  function isCollisionEnemy(obj1, obj2) {
    if (collision(obj1, obj2)) {
      obj1.life--;
      obj1.x = 0;
      obj1.y = canvas.height - HEIGHT_HERO - START_POS_HERO_Y;
      if (obj1.life === 0) {
        flagGame = false;
        gameOver();
      }
      camera.cameraPos.y = 0;
      camera.cameraPos.x = 0;
    }
  }
  //Функция определения столкновения пули и противника
  function isCollisionBullet(obj1, obj2) {
    if (collision(obj1, obj2)) {
      let indexObj2 = enemy.indexOf(obj2);
      enemy.splice(indexObj2, 1);
      let indexObj1 = bullets.indexOf(obj1);
      bullets.splice(indexObj1, 1);
    }
  }
  //Функция определения столкновения героя и дополнительных пуль
  function isCollisionBulletStock(obj1, obj2) {
    if (collision(obj1, obj2)) {
      HERO.bullet++;
      let index = bulletsStock.indexOf(obj2);
      bulletsStock.splice(index, 1);
    }
  }
  //Функция эвакуации
  function evacuation() {
    trains.x -= trains.speedX;
    if (trains.x < 2950) {
      trains.speedX = -trains.speedX;
    }
    if (HERO.x + HERO.width / 2 >= trains.x + trains.width) {
      gameWin();
      return;
    }
    if (trains.x > 3000 && trains.speedX < 0) {
      flagGame = false;
      gameOver();
    }
  }
  //Победа и сохранение рекорда
  function gameWin() {
    score += HERO.bullet * ADD_SCORE_FROM_BULLET;
    flagGame = false;
    resultGame = true;
    showGameEnd();
    theheAudio.pause();
    removeListeners()
  }
  //Проигрыш
  function gameOver() {
    flagGame = false;
    resultGame = false;
    showGameEnd();
    theheAudio.pause();
    removeListeners()
  }
  //Запуск анимации
  game();
  //Получение рекордов
  restoreInfo();
}
//Инициализация
init();
//Получение рекордов
restoreInfo();
//Функция вибро
function vibro() {
  if (navigator.vibrate) {
    window.navigator.vibrate(20);
  }
}
//Функция получения рекордов
function restoreInfo() {
  $.ajax({
    url: ajaxHandlerScript,
    type: "POST",
    cache: false,
    dataType: "json",
    data: { f: "READ", n: stringName },
    success: readReady,
  });
}
function readReady(callresult) {
  storage = JSON.parse(callresult.result);
  arrStorageKey = sortRecords(storage);
}
//Функция сортировки рекордов
function sortRecords(storageRecords) {
  return Object.keys(storageRecords).sort(function (a, b) {
    return storageRecords[b] - storageRecords[a];
  });
}
//Сохранение рекордов
function saveRecords() {
  let playerName = inputName.value;
  function storeInfo() {
    updatePassword = Math.random();
    $.ajax({
      url: ajaxHandlerScript,
      type: "POST",
      cache: false,
      dataType: "json",
      data: { f: "LOCKGET", n: stringName, p: updatePassword },
      success: lockGetReady,
    });
  }
  function lockGetReady(callresult) {
    arrStorageKey = sortRecords(storage);
    if (arrStorageKey.length === 5) {
      if (score >= storage[arrStorageKey[arrStorageKey.length - 1]]) {
        delete storage[arrStorageKey[arrStorageKey.length - 1]];
        storage[playerName] = score;
      } else return;
    } else {
      storage[playerName] = score;
    }
    $.ajax({
      url: ajaxHandlerScript,
      type: "POST",
      cache: false,
      dataType: "json",
      data: {
        f: "UPDATE",
        n: stringName,
        v: JSON.stringify(storage),
        p: updatePassword,
      },
    });
  }
  storeInfo();
}
//Функция SPA
function switchToStateFromURLHash() {
  URLHash = window.location.hash;
  stateStr = URLHash.substr(1);
  if (stateStr != "") {
    parts = stateStr.split("_");
    SPAState = { pagename: parts[0] };
  } else SPAState = { pagename: "Main" };
  if (stateStr === "" || stateStr === "Main") {
    //Если главная страница то останавливаем игру
    flagGame = false;
    theheAudio.pause();
  }
  if (stateStr === "Game") {
    //Если страница игры, запускаем игру
    startGame();
  }
  let pageHTML = "";
  //Создание HTML
  switch (SPAState.pagename) {
    case "Main":
      pageHTML +=
        "<div class='menu'><button class = 'btnMenu btnStart' onclick='showArea(); soundInit()'>START</button><button class = 'btnMenu btnRecord' onclick='showRecord()'>RECORDS</button></div>";
      document.querySelector(".wrapper").innerHTML = pageHTML;
      break;
    case "Score":
      pageHTML +=
        "<div class='score'><button class = 'btnMenu btnClose' onclick='closeRecord()'>close</button></div>";
      if (storage) {
        document.querySelector(".wrapper").innerHTML = createTable(pageHTML);
      } else {
        //Создание таблицы когда обновили страницу или перешли по ссылке
        $.ajax({
          url: ajaxHandlerScript,
          type: "POST",
          cache: false,
          dataType: "json",
          data: { f: "READ", n: stringName },
          success: function (callresult) {
            storage = JSON.parse(callresult.result);
            document.querySelector(".wrapper").innerHTML = createTable(pageHTML);
            $(".score").on("swipe", closeRecord);
          },
        });
      }
      $(".score").on("swipe", closeRecord);
      break;
    case "Game":
      pageHTML +=
        "<div class='area'><div class='buttons'><input type='button' class = 'btn-shot'></input><input type='button'  class = 'btn-left'></input><input type='button' class = 'btn-right'></input></div></div>";
      document.querySelector(".wrapper").innerHTML = pageHTML;
      document.querySelector(".area").appendChild(canvas);
      break;
    case "GameEnd":
      pageHTML +=
        "<div class='pageGameEnd'><p class='textGame'></p><p class='playerScore'>You Score: <span></span></p><div class='formSave'><input type='text' name='' class='inputName' placeholder='Inter Your Name'><input type='submit' value='Save' class = 'btnMenu btn-save' onclick ='saveRecords();closeRecord()'></div><button class = 'btnMenu btnBackMenu' onclick='closeRecord()'>MENU</button></div>";
      document.querySelector(".wrapper").innerHTML = pageHTML;
      document.querySelector(".playerScore span").innerHTML = score;
      document.querySelector(".textGame").innerHTML = resultGame
        ? "You Win"
        : "You Lose";
      inputName = document.querySelector(".inputName");
      break;
  }
}
function createTable(pageHTML){
  arrStorageKey = sortRecords(storage);
        pageHTML += "<table><tr><th>Name</th><th>Result</th>";
        for (let i = 0; i < arrStorageKey.length; i++) {
          pageHTML +=
            "<tr><td>" +
            arrStorageKey[i] +
            "</td><td>" +
            storage[arrStorageKey[i]] +
            "</td></tr>";
        }
        return pageHTML
}
function switchToState(newState) {
  stateStr = newState.pagename;
  location.hash = stateStr;
}
function showArea() {
  switchToState({ pagename: "Game" });
}
function showRecord() {
  switchToState({ pagename: "Score" });
}
function closeRecord(EO) {
  switchToState({ pagename: "Main" });
}
function showGameEnd() {
  switchToState({ pagename: "GameEnd" });
}
//Запук игры
function startGame() {
  let orientation =
    (screen.orientation || {}).type ||
    screen.mozOrientation ||
    screen.msOrientation;
  if (orientation === "landscape-primary") {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      document.querySelector(".container-game").requestFullscreen();
    }
    addListener()
    mainGame();
  }
  theheAudio.currentTime = 0;
  theheAudio.volume = 0.2;
  theheAudio.play();
}
//Обработчики событий
window.onhashchange = switchToStateFromURLHash;
window.onbeforeunload = befUnload;
function befUnload(EO) {
  EO = EO || window.event;
  if (flagGame) EO.returnValue = "You will lose your current game data";
}