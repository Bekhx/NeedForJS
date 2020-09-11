const score = document.querySelector('.score'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.gameArea'),
      car = document.createElement('div'),
      audioRide = document.querySelector('.audio-ride'),
      audioCrash = document.querySelector('.audio-crash');

car.classList.add('car');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 5,
    traffic: 3
};

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement +1;
}

function startGame() {
    start.classList.add('hide');
    gameArea.innerHTML = '';
    gameArea.appendChild(start);
    gameArea.appendChild(score);
    score.textContent = 'SCORE: ' + setting.score;
    audioCrash.pause();
    audioRide.play();

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }
    
    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        let enemyImage = Math.floor(Math.random() * 4) + 1;
        enemy.y = -100 * setting.traffic * (i +1);
        enemy.style.background = `transparent url(./image/newEnemy${enemyImage}.png) center / cover no-repeat`;
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) +'px';
        enemy.style.top = enemy.y + 'px';
        gameArea.appendChild(enemy);
        
    }
    
    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.top = 'auto';
    car.style.bottom = '30px';
    car.style.left = '125px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() { 
    if(setting.start) {
        setting.score += setting.speed;
        score.textContent = 'SCORE: ' + setting.score;
        moveRoad();
        moveEnemy();
        if(keys.ArrowLeft && setting.x > 10) {
            setting.x -= setting.speed/2;
        }
        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - 60)) {
            setting.x += setting.speed/2;
        }
        if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - 100)) {
            setting.y += setting.speed * 2;
        }
        if(keys.ArrowUp && setting.y > 10) {
            setting.y -= setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    } 
}

function startRun(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(item) {
        item.y += setting.speed;
        item.style.top = item.y + 'px';

        if(item.y >= document.documentElement.clientHeight) {
            item.y = -100;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if(carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
                setting.start = false;
                
                start.classList.remove('hide');
                start.textContent = 'RESTART';
                audioRide.pause();
                audioCrash.play();
        }

        item.y += setting.speed / 1.5;
        item.style.top = item.y +'px';
        
        if(item.y >= document.documentElement.clientHeight) {
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) +'px';
        }
    });
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);