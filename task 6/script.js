var canvas, ctx, balls, idTimer;
var array = [];
TBall = new Class({
    initialize: function (pX, pY) {
        this.posX = pX; //позиция шарика по X
        this.posY = pY; //позиция шарика по Y
        //цвет шарика, формируется случайным оьразом
        this.colBall = 'rgb(' + Math.floor(Math.random() * 256) + ','
            + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
        // радиус шарика, случайное число от 5 до 30
        this.rBall = 5 + Math.random() * 25;
    },
    posX: 0,
    posY: 0,
    colBall: "rgb(0,0,0)",
    rBall: 0,
    colorBall: function (ctx) {
        // формируем градиентную заливку для шарика
        with (this) {
            var gradient = ctx.createRadialGradient(posX + rBall / 4,
                posY - rBall / 6, rBall / 8, posX, posY, rBall);
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(0.85, colBall);
            return gradient;
        }
    },
    draw: function (ctx) {
        // рисуем шарик на canvas
        with (this) {
            ctx.fillStyle = colorBall(ctx);
            ctx.beginPath();
            ctx.arc(posX, posY, rBall, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fill();
        }
    }
});
function drawBack(ctx, col1, col2, w, h) {
    // закрашиваем канвас градиентным фоном
    ctx.save();
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(1, col1);
    g.addColorStop(0, col2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
}
// инициализация работы
function init() {
    canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        //рисуем фон
        drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
        //создаем 10 шариков, заноси их в массив и выводим на canvas
        balls = [];
        for (var i = 1; i <= 10; i++) {
            var item = new TBall(10 + Math.random() * (canvas.width - 30),
                10 + Math.random() * (canvas.height - 30));
            item.draw(ctx);
            balls.push(item);
        }
    }
}
// создаем новый шарик по щелчку мыши, добавляем его в массив шариков и рисуем его
function goInput(event) {
    var x = event.clientX;
    var y = event.clientY;
    var item = new TBall(x, y);
    item.draw(ctx);
    balls.push(item);

}
//движение вверх
function moveBall() {
    //реализация движения шариков, находящихся в массиве balls
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < balls.length; i) {
        balls[i].posX = balls[i].posX + (Math.random() * 4 - 2);
        balls[i].posY = balls[i].posY + (Math.random() * 2 - 4);
        if ((balls[i].posX > canvas.width) || (balls[i].posX < 0) || (balls[i].posY < 0))
            balls.splice(i, 1);
        else {
            enlarge_the_ball(balls[i]);
            if (balls[i].rBall > 50) {
                balls.splice(i, 1);
            }
            else {
                balls[i].draw(ctx);
            }
            i++;
        }
    }
}
function move() {
    clearInterval(idTimer);
    idTimer = setInterval('moveBall();', 50);
}

//движение вниз
function moveBallDown() {
    //реализация движения вниз шариков, находящихся в массиве balls
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < balls.length; i) {
        balls[i].posX = balls[i].posX - (Math.random() * 4 - 2);
        balls[i].posY = balls[i].posY - (Math.random() * 2 - 4);
        balls[i].draw(ctx);
        if ((balls[i].posX > canvas.width) || (balls[i].posX < 0) || (balls[i].posY < 0))
            balls.splice(i, 1);
        else {
            enlarge_the_ball(balls[i]);
            if (balls[i].rBall > 50) {
                balls.splice(i, 1);
            }
            else {
                balls[i].draw(ctx);
            }
            i++;
        }
    }
}
function moveDown() {
    clearInterval(idTimer);
    idTimer = setInterval('moveBallDown();', 50);
}

//движение влево
function moveBallLeft() {
    //реализация движения вниз шариков, находящихся в массиве balls
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < balls.length; i) {
        balls[i].posX = balls[i].posX + (Math.random() * 2 - 4);
        balls[i].posY = balls[i].posY + (Math.random() * 4 - 2);
        if ((balls[i].posX > canvas.width) || (balls[i].posX < 0) || (balls[i].posY < 0))
            balls.splice(i, 1);
        else {
            enlarge_the_ball(balls[i]);
            if (balls[i].rBall > 50) {
                balls.splice(i, 1);
            }
            else {
                balls[i].draw(ctx);
            }
            i++;
        }

    }
}
function moveLeft() {
    clearInterval(idTimer);
    idTimer = setInterval('moveBallLeft();', 50);
}
//движение вправо
function moveRight() {
    clearInterval(idTimer);
    idTimer = setInterval('moveBallRight();', 50);
}
function moveBallRight() {
    //реализация движения вниз шариков, находящихся в массиве balls
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < balls.length; i) {
        balls[i].posX = balls[i].posX - (Math.random() * 2 - 4);
        balls[i].posY = balls[i].posY - (Math.random() * 4 - 2);
        balls[i].draw(ctx);
        if ((balls[i].posX > canvas.width) || (balls[i].posX < 0) || (balls[i].posY < 0))
            balls.splice(i, 1);
        else {
            enlarge_the_ball(balls[i]);
            if (balls[i].rBall > 50) {
                balls.splice(i, 1);
            }
            else {
                balls[i].draw(ctx);
            }
            i++;
        }
    }
}
//хаотично
function moveBallChaos() {
    //реализация движения вниз шариков, находящихся в массиве balls
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < balls.length; i) {
        var variant = Math.floor(Math.random() * (5 - 1)) + 1;
        if (variant == 1) {
            balls[i].posX = balls[i].posX + (Math.random() * 1 - 1);
            balls[i].posY = balls[i].posY + (Math.random() * 1 - 1);
            balls[i].draw(ctx);
        }
        if (variant == 2) {
            balls[i].posX = balls[i].posX - (Math.random() * 1 - 1);
            balls[i].posY = balls[i].posY - (Math.random() * 1 - 1);
            balls[i].draw(ctx);
        }
        if (variant == 3) {
            balls[i].posX = balls[i].posX - (Math.random() * 1 - 1);
            balls[i].posY = balls[i].posY - (Math.random() * 1 - 1);
            balls[i].draw(ctx);
        }
        if (variant == 4) {
            balls[i].posX = balls[i].posX + (Math.random() * 1 - 1);
            balls[i].posY = balls[i].posY + (Math.random() * 1 - 1);
            balls[i].draw(ctx);
        }
        enlarge_the_ball(balls[i]);
        if (balls[i].rBall > 50) {
            balls.splice(i, 1);
        }
        if ((balls[i].posX > canvas.width) || (balls[i].posX < 0) || (balls[i].posY < 0))
            balls.splice(i, 1);
        else
            i++;
    }
}

function moveChaos() {
    clearInterval(idTimer);
    idTimer = setInterval('moveBallChaos();', 50);
}
//рандом
function moveBallRandom() {
    //реализация рандомного движения шариков, находящихся в массиве balls
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < balls.length; i) {
        if (array[i] == 1) {
            balls[i].posX = balls[i].posX + (Math.random() * 4 - 2);
            balls[i].posY = balls[i].posY + (Math.random() * 2 - 4);
            balls[i].draw(ctx);
        }
        if (array[i] == 2) {
            balls[i].posX = balls[i].posX - (Math.random() * 4 - 2);
            balls[i].posY = balls[i].posY - (Math.random() * 2 - 4);
            balls[i].draw(ctx);
        }
        if (array[i] == 3) {
            balls[i].posX = balls[i].posX - (Math.random() * 2 - 4);
            balls[i].posY = balls[i].posY - (Math.random() * 4 - 2);
            balls[i].draw(ctx);
        }
        if (array[i] == 4) {
            balls[i].posX = balls[i].posX + (Math.random() * 2 - 4);
            balls[i].posY = balls[i].posY + (Math.random() * 4 - 2);
            balls[i].draw(ctx);
        }

        enlarge_the_ball(balls[i]);

        if (balls[i].rBall > 50) {
            balls.splice(i, 1);
        }

        if ((balls[i].posX > canvas.width) || (balls[i].posX < 0) || (balls[i].posY < 0)) {
            balls.splice(i, 1);
            array.splice(i, 1);
        }
        else
            i++;
    }
}
function moveRandom() {
    GetArray();
    clearInterval(idTimer);
    idTimer = setInterval('moveBallRandom();', 50);
}

function GetArray() {
    for (var i = 0; i < balls.length; i++) {
        array[i] = Math.floor(Math.random() * (5 - 1)) + 1;
    }
}
//измение размера шарика при движении
function enlarge_the_ball(a) {
    a.rBall = a.rBall + 0.3;
}

