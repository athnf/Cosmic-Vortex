document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const ship = new Image();
    ship.src = 'spaceship.png';
    const bulletImage = new Image();
    bulletImage.src = 'bullet.png';
    const enemyImage = new Image();
    enemyImage.src = 'enemy.png';

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const shipWidth = 100;
    const shipHeight = 100;
    let shipX = canvas.width / 2 - shipWidth / 2;
    let shipY = canvas.height - shipHeight - 20;
    const shipSpeed = 5;

    const bullets = [];
    const enemies = [];
    let lifeCount = 5;
    let score = 0;

    const shootSound = new Audio('sound/shoot.mp3');
    const enemyDestroyedSound = new Audio('sound/ilang.mp3');

    let level = 1;

    function updateLevel(score) {
        if (score % 10 === 0) {
            level++;
            increaseEnemy();
        }
    }

    function increaseEnemy() {
        for (let i = 0; i < level; i++) {
            enemies.push({
                x: Math.random() * (canvas.width - 50),
                y: -50,
                width: 50,
                height: 50,
                speed: Math.random() * (level + 1) + 1
            });
        }
    }

    function drawShip() {
        ctx.drawImage(ship, shipX, shipY, shipWidth, shipHeight);
    }

    function drawBullets() {
        bullets.forEach((bullet) => {
            ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    function drawEnemies() {
        enemies.forEach((enemy) => {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    function drawLifeIndicator() {
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Coolvetica';
        ctx.fillText('Lives: ' + Math.max(lifeCount, 0), canvas.width - 100, 30);
    }

    function drawScore() {
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Coolvetica';
        ctx.fillText('Score: ' + score.toString().padStart(4, '0'), 20, 30);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
        clearCanvas();
        const background = new Image();
        background.src = 'bg.png';
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        drawShip();
        drawBullets();
        drawEnemies();
        drawLifeIndicator();
        drawScore();
        moveBullets();
        moveEnemies();
        checkCollision();
        checkLife();
        requestAnimationFrame(update);
    }

    update();

    const keyState = {};
    document.addEventListener('keydown', function(event) {
        keyState[event.key] = true;
        if (event.key === ' ') {
            shoot();
        }
    });

    document.addEventListener('keyup', function(event) {
        keyState[event.key] = false;
    });

    function shoot() {
        bullets.push({
            x: shipX + shipWidth / 2 - 2,
            y: shipY,
            width: 4,
            height: 10,
            speed: 10
        });
        shootSound.currentTime = 0;
        shootSound.play();
    }

    function moveBullets() {
        bullets.forEach((bullet, index) => {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            }
        });
    }

    function moveEnemies() {
        enemies.forEach((enemy, index) => {
            enemy.y += enemy.speed;
            if (enemy.y > canvas.height) {
                enemies.splice(index, 1);
                lifeCount--;
            }
        });
    }

    function checkCollision() {
        bullets.forEach((bullet, bulletIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y
                ) {
                    bullets.splice(bulletIndex, 1);
                    enemies.splice(enemyIndex, 1);
                    score++;
                    enemyDestroyedSound.currentTime = 0;
                    enemyDestroyedSound.play();
                    updateLevel(score);
                }
            });
        });
    }

    function checkLife() {
        if (lifeCount <= 0) {
            window.location.href = 'death.html';
            lifeCount = 0;
            canvas.style.display = 'none';
        }
    }

    setInterval(() => {
        enemies.push({
            x: Math.random() * (canvas.width - 50),
            y: -50,
            width: 50,
            height: 50,
            speed: Math.random() * 2 + 1
        });
    }, 2000);

    window.addEventListener("keydown", function(e) {
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    function updateShipPosition() {
        if (keyState['d'] && shipX < canvas.width - shipWidth) {
            shipX += shipSpeed;
        }
        if (keyState['a'] && shipX > 0) {
            shipX -= shipSpeed;
        }
        if (keyState['w'] && shipY > 0) {
            shipY -= shipSpeed;
        }
        if (keyState['s'] && shipY < canvas.height - shipHeight) {
            shipY += shipSpeed;
        }
    }

    function updateLoop() {
        updateShipPosition();
        requestAnimationFrame(updateLoop);
    }

    updateLoop();
});
