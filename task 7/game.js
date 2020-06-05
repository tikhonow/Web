
function rnd(min, max) {
    return min + Math.random() * (max - min);
}

const Direction = Object.freeze({
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    CHAOS: "CHAOS"
});

class Collisions {
    static collide(a, b) {
        if (a.constructor.name == "TBall" || a.constructor.name == "TBullet") {
            switch (b.constructor.name) {
                case "TBall":
                    return this.BallBall(a, b);
                case "TBullet":
                    if (a.constructor.name == "TBall") {
                        return this.BallBall(a, b);
                    }
                    break;
                case "TRect":
                case "TSquare":
                    return this.RectBall(b, a);
            }
        } else {
            switch (b.constructor.name) {
                case "TBall":
                case "TBullet":
                    return this.RectBall(a, b);
                case "TRect":
                case "TSquare":
                    return this.RectRect(a, b);
            }
        }
        return false;
    }

    static RectRect(a, b) {
        return (a.posX <= b.posX + b.width) && (b.posX <= a.posX + a.width) && (a.posY <= b.posY + b.height) &&
            (b.posY <= a.posY + a.height);
    }

    static RectBall(a, b) {
        //a - rect, b - ball
        if (b.posX >= a.posX && b.posX <= a.posX + a.width) {
            if (b.posY >= a.posY && b.posY <= a.posY + a.height) {
                return true; // центр окружности лежит в прямоугольнике
            }
        }
        // одна из точек прямоугольника лежит внутри круга 
        if ((a.posX - b.posX) ** 2 + (a.posY - b.posY) ** 2 <= b.radius ** 2)
            return true;
        if ((a.posX + a.width - b.posX) ** 2 + (a.posY + a.height - b.posY) ** 2 <= b.radius ** 2)
            return true;
        if ((a.posX + a.width - b.posX) ** 2 + (a.posY - b.posY) ** 2 <= b.radius ** 2)
            return true;
        if ((a.posX - b.posX) ** 2 + (a.posY + a.height - b.posY) ** 2 <= b.radius ** 2)
            return true;
        //пересечение сторон
        if (b.posX - b.radius < a.posX + a.width && b.posX + b.radius > a.posX && b.radius ** 2 >= (a.posY + a.height - b.posY) ** 2) {
            return true;
        }
        if (b.posX - b.radius < a.posX + a.width && b.posX + b.radius > a.posX && b.radius ** 2 >= (a.posY - b.posY) ** 2) {
            return true;
        }
        if (b.posY - b.radius < a.posY + a.height && b.posY + b.radius > a.posY && b.radius ** 2 >= (a.posX + a.width - b.posX) ** 2) {
            return true;
        }
        if (b.posY - b.radius < a.posY + a.height && b.posY + b.radius > a.posY && b.radius ** 2 >= (a.posX - b.posX) ** 2) {
            return true;
        }
        return false;
    }

    static BallBall(a, b) {
        return Math.sqrt((a.posX - b.posX) ** 2 + (a.posY - b.posY) ** 2) <= a.radius + b.radius;
    }
}

const airResistance = 0.05;
const gravity = 0.4;
const freeFallAccel = 5;

const spdGrow = 0.4;
const maxSize = 50;
var canvas, ctx, figures, idTimer = -1;
var direction = Direction.UP;

class TFigure {
    constructor(pX, pY, dir) {
        this.posX = pX;
        this.posY = pY;
        this.speed = rnd(2, 7);
        this.dir = dir;
        this.color = 'rgb(' + ~~(Math.random() * 256) + ','
            + ~~(Math.random() * 256) + ',' + ~~(Math.random() * 256) + ')';
    }
    move() {
        let spdMove = rnd(this.speed, 1.5 * this.speed);
        switch (this.dir) {
            case Direction.UP:
                this.posY -= spdMove;
                break;
            case Direction.DOWN:
                this.posY += spdMove;
                break;
            case Direction.LEFT:
                this.posX -= spdMove;
                break;
            case Direction.RIGHT:
                this.posX += spdMove;
                break;
        }
    }
    draw(ctx) {
    }
    size() {
    }
}

class TBall extends TFigure {
    constructor(pX, pY, dir) {
        super(pX, pY, dir);
        this.radius = 5 + Math.random() * 25;
    }
    setGradient(ctx) {
        // формируем градиентную заливку
        let gradient = ctx.createRadialGradient(this.posX + this.radius / 4,
            this.posY - this.radius / 6, this.radius / 8, this.posX, this.posY, this.radius);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.85, this.color);
        return gradient;
    }
    move() {
        super.move();
        this.radius += spdGrow;
    }
    draw(ctx) {
        // рисуем шарик на canvas
        ctx.fillStyle = this.setGradient(ctx);
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
    size() {
        return this.radius;
    }
}

class TBullet extends TBall {
    constructor(pX, pY, accelX, accelY) {
        super(pX, pY, null);
        this.radius = 20;
        this.accelX = accelX;
        this.accelY = accelY;
    }
    move() {
        this.posX += this.accelX;
        this.accelX = Math.max(0, this.accelX - airResistance);
        this.posY += this.accelY;
        this.accelY = Math.min(freeFallAccel, this.accelY + gravity);
    }
    draw(ctx) {
        // рисуем шарик на canvas
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
    }
}

class TRect extends TFigure {
    constructor(pX, pY, dir) {
        super(pX, pY, dir);
        this.width = 5 + Math.random() * 25;
        this.height = 5 + Math.random() * 25;
    }
    setGradient(ctx) {
        // формируем градиентную заливку
        let gradient = ctx.createRadialGradient(this.posX + this.width / 4,
            this.posY - this.height / 6, Math.min(this.width, this.height) / 8,
            this.posX, this.posY, Math.max(this.width, this.height));
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.85, this.color);
        return gradient;
    }
    move() {
        super.move();
        let whRatio = (this.width) / (this.height);
        this.width += spdGrow;
        this.height += spdGrow / whRatio;
    }
    draw(ctx) {
        ctx.fillStyle = this.setGradient(ctx);
        ctx.beginPath();
        ctx.rect(this.posX, this.posY, this.width, this.height);
        ctx.closePath();
        ctx.fill();
    }
    size() {
        return Math.sqrt(this.width ** 2 + this.height ** 2) / 2;
    }
}

class TSquare extends TRect {
    constructor(pX, pY, dir) {
        super(pX, pY, dir);
        this.height = this.width;
    }
}

const figureClasses = [TBall, TRect, TSquare];

function setDirection(radio) {
    direction = Direction[radio.id];
}

function createItem(x, y) {
    let figureId = ~~(figureClasses.length * Math.random());
    var d;
    if (direction == "CHAOS") {
        var i = ~~(Math.random() * 4);
        switch (i) {
            case 0:
                d = "UP";
                break;
            case 1:
                d = "DOWN";
                break;
            case 2:
                d = "LEFT";
                break;
            case 3:
                d = "RIGHT";
                break;
        }
    } else {
        d = direction;
    }
    return new figureClasses[figureId](x, y, d);
}

function drawBack(ctx, col1, col2, w, h) {
    // закрашиваем канвас градиентным фоном
    // закрашиваем канвас градиентным фоном
    ctx.save();
    var img = new Image();
    img.src = "game.jpg";
    var pat = ctx.createPattern(img, "repeat");
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = pat;
    ctx.fill();
}

// инициализация работы
function init() {
    canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        //рисуем фон
        drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
        figures = [];
        for (let i = 0; i < 10; i++) {
            let figureX = (canvas.width / 2) + Math.random() * 200;
            let figureY = (canvas.height) - Math.random() * 800;
            let item = createItem(figureX, figureY);
            item.draw(ctx);
            figures.push(item);
        }
    }
}

function getMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function goInput(event) {
    let mousePos = getMousePos(event);
    let x = mousePos.x;
    let y = mousePos.y;
    let accelX = canvas.width * Math.sin(gunAngle) / 24;
    let accelY = -canvas.height * Math.cos(gunAngle) / 24;
    let bullet = new TBullet(bulletX, bulletY, accelX, accelY);
    bullet.draw(ctx);
    figures.push(bullet);
}

function calcGun(evt) {
    let mousePos = getMousePos(evt);
    let x = mousePos.x;
    let y = mousePos.y;
    gunAngle = Math.atan2(y, canvas.width - x);
    bulletX = 50 * Math.cos(gunAngle) - 20;
    bulletY = canvas.height - 50 * Math.sin(gunAngle) + 10;
}

function drawGun() {
    ctx.save();
    ctx.translate(-1, canvas.height);
    ctx.rotate(gunAngle);
    ctx.beginPath();
    ctx.rect(-5, -45, 40, 100);
    ctx.fillStyle = "brown";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function checkCollisions() {
    let collided = new Set();
    for (let i = 0; i < figures.length - 1; ++i) {
        for (let j = i + 1; j < figures.length; ++j) {
            if (Collisions.collide(figures[i], figures[j])) {
                collided.add(i);
                collided.add(j);
            }
        }
    }
    collided = Array.from(collided).sort((a, b) => b - a);
    for (let i of collided) {
        figures.splice(i, 1);
    }
}

function moveItems() {
    //реализация движения шариков, находящихся в массиве balls
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    checkCollisions();
    for (let i = 0; i < figures.length;) {
        figures[i].move();
        figures[i].draw(ctx);
        if ((figures[i].posX - canvas.width > 0) || (figures[i].posX < 0) ||
            (figures[i].posY < 0) || (figures[i].posY - canvas.height > 0) || figures[i].size() > maxSize) {
            figures.splice(i, 1);
            let figureX = (canvas.width / 2) + Math.random() * 200;
            let figureY = (canvas.height) - Math.random() * 800;
            let item = createItem(figureX, figureY);
            item.draw(ctx);
            figures.push(item);
        }
        else
            i++;
    }
    drawGun();
}

function move() {
    if (idTimer === -1)
        idTimer = setInterval(moveItems, 30);
}