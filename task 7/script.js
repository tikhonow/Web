var canvas, ctx, character, idTimer;
var array = [];
var speed = 1;
//игра
const airResistance = 0.05;
const gravity = 0.35;
const freeFallAccel = 5;
var firstName = ""
var counter = 0;
var help = 0;
var bulletX
var bulletY
//класс фигур, от которого наследуются все прочие классы
TFigure = new Class({
    initialize: function (pX, pY,accelX, accelY) {
        this.posX = pX; //позиция шарика по X
        this.posY = pY; //позиция шарика по Y
        this.accelX = accelX;
        this.accelY = accelY;
        //цвет шарика, формируется случайным оьразом
        // // радиус шарика, случайное число от 5 до 30
        this.size = 20 + Math.random() * 25;// размер фигурки
        this.colFigure = 'rgb(' + Math.floor(Math.random() * 256) + ','
            + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
    },//цвет фигурки
    posX: 0,
    posY: 0,
    colBall: "rgb(0,0,0)",
    size: 0,
    colorFigure: function (ctx) {
        // формируем градиентную заливку для шарикаc
        with (this) {
            var gradient = ctx.createRadialGradient(posX + size / 4,
                posY - size / 6, size / 8, posX, posY, size);
            gradient.addColorStop(0, '#fff');
            gradient.addColorStop(0.85, colFigure);
            return gradient;
        }
    },
})
//класс шарики
TBall = new Class({
    Extends: TFigure, //создание дочернего класса дл
    draw: function (ctx) {
        // рисуем шарик на canvas
        with (this) {
            ctx.fillStyle = colorFigure(ctx);
            ctx.beginPath();
            ctx.arc(posX, posY, size / 2, 0, 2 * Math.PI, false); //дуги	
            ctx.closePath();
            ctx.fill();
        }
    },
});
//класс квадрата
TSquare = new Class({
    Extends: TFigure,
    draw: function (ctx) {
        with (this) {
            ctx.fillStyle = colorFigure(ctx);
            ctx.beginPath(); //Создает новый контур.
            ctx.moveTo(posX - size / 2, posY - size / 2)
            ctx.lineTo(posX + size / 2, posY - size / 2)
            ctx.lineTo(posX + size / 2, posY + size / 2)
            ctx.lineTo(posX - size / 2, posY + size / 2)
            ctx.lineTo(posX - size / 2, posY - size / 2)
            ctx.closePath(); //Закрывает контур, так что будущие команды рисования вновь направлены контекс
            ctx.fill(); //Рисует фигуру с заливкой внутренней области.
        }
    }

});
//класс ПакМэна
TPackMan = new Class({
    Extends: TFigure,
    draw: function (ctx) {
        // рисуем шарик на canvas
        with (this) {
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(posX, posY, size, 0.2 * Math.PI, 1.8 * Math.PI);
            ctx.strokeStyle = '000';
            ctx.stroke();
            ctx.lineTo(posX, posY);
            ctx.closePath();
            ctx.fill();

        }
    },
});

TTriangle = new Class({
    Extends: TFigure,
    draw: function (ctx) {

        with (this) {
            ctx.fillStyle = colorFigure(ctx)
            ctx.beginPath()
            ctx.moveTo(posX - size / 2, posY - size / 2)
            ctx.lineTo(posX + size / 2, posY + size / 2)
            ctx.lineTo(posX - size / 2, posY + size / 2)
            ctx.lineTo(posX - size / 2, posY - size / 2)
            ctx.closePath()
            ctx.fill()
        }
    },
});

//фон canvas
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
        //создаем 10 различных фигур, заноси их в массив и выводим на canvas
        character = [];
        for (var i = 1; i <= 5; i++) {
            var item = new TBall(10 + Math.random() * (canvas.width - 30),
                10 + Math.random() * (canvas.height - 30));
            item.draw(ctx);
            character.push(item);
        }
        for (var i = 1; i <= 5; i++) {
            var item = new TSquare(10 + Math.random() * (canvas.width - 30),
                10 + Math.random() * (canvas.height - 30));
            item.draw(ctx);
            character.push(item);
        }
        for (var i = 1; i <= 5; i++) {
            var item = new TPackMan(10 + Math.random() * (canvas.width - 30),
                10 + Math.random() * (canvas.height - 30));
            item.draw(ctx);
            character.push(item);
        }
        for (var i = 1; i <= 5; i++) {
            var item = new TTriangle(10 + Math.random() * (canvas.width - 30),
                10 + Math.random() * (canvas.height - 30));
            item.draw(ctx);
            character.push(item);
        }
    }
}
//создаем новый шарик по щелчку мыши, добавляем его в массив шариков и рисуем его

//измение размера шарика при движении
function enlarge_the_ball(a) {
    a.size = a.size + 0.2;
}
//функция удаляющая пересекающиеся фигуры
function deletefigure() {
    var collision = false
    for (var i = 0; i < character.length; i) {
        for (var j = 0; j < character.length; j) {
            var ballsi = character[i]
            ballsj = character[j]
            if (i == j) {
                j++
                continue
            }
            if ((character[j] instanceof TSquare) && (character[i] instanceof TSquare)) {
                if ((Math.abs(ballsi.posX - ballsj.posX) < ((ballsi.size + ballsj.size) / 2)) &&
                    (Math.abs(ballsi.posY - ballsj.posY) < ((ballsi.size + ballsj.size) / 2))) {
                    collision = true;
                }
            } else if ((character[j] instanceof TSquare) && !(character[i] instanceof TSquare)) {
                var y1 = ballsj.posY - ballsj.size / 2
                var x0 = ballsi.posX; var y0 = ballsi.posY
                var r = ballsi.size / 2
                var d = 4 * x0 * x0 - 4 * (x0 * x0 + y1 * y1 - 2 * y1 * y0 + y0 * y0 - r * r)

                if (d >= 0) {
                    var x = x0 + Math.sqrt(d) / 2
                    if ((x >= ballsj.posX - ballsj.size / 2) && (x <= ballsj.posX + ballsj.size / 2)) {
                        collision = true;
                    }
                    var x = x0 - Math.sqrt(d) / 2
                    if ((x >= ballsj.posX - ballsj.size / 2) && (x <= ballsj.posX + ballsj.size / 2)) {
                        collision = true;
                    }
                } else {

                    var x1 = ballsj.posX - ballsj.size / 2
                    var x0 = ballsi.posX; var y0 = ballsi.posY
                    d = 4 * y0 * y0 - 4 * (y0 * y0 + x1 * x1 - 2 * x1 * x0 + x0 * x0 - r * r)
                    if (d >= 0) {
                        var y = y0 + Math.sqrt(d) / 2
                        if ((y >= ballsj.posY - ballsj.size / 2) && (y <= ballsj.posY + ballsj.size / 2)) {
                            collision = true
                        }
                        var y = y0 - Math.sqrt(d) / 2
                        if ((y >= ballsj.posY - ballsj.size / 2) && (y <= ballsj.posY + ballsj.size / 2)) {
                            collision = true
                        }
                    } else {
                        var y1 = ballsj.posY + ballsj.size / 2
                        var x0 = ballsi.posX; var y0 = ballsi.posY
                        var d = 4 * x0 * x0 - 4 * (x0 * x0 + y1 * y1 - 2 * y1 * y0 + y0 * y0 - r * r)

                        if (d >= 0) {
                            var x = x0 + Math.sqrt(d) / 2
                            if ((x >= ballsj.posX - ballsj.size / 2) && (x <= ballsj.posX + ballsj.size / 2)) {
                                collision = true
                            }
                            var x = x0 - Math.sqrt(d) / 2
                            if ((x >= ballsj.posX - ballsj.size / 2) && (x <= ballsj.posX + ballsj.size / 2)) {
                                collision = true
                            }
                        } else {
                            var x1 = ballsj.posX + ballsj.size / 2
                            var x0 = ballsi.posX; var y0 = ballsi.posY
                            d = 4 * y0 * y0 - 4 * (y0 * y0 + x1 * x1 - 2 * x1 * x0 + x0 * x0 - r * r)
                            if (d >= 0) {
                                var y = y0 + Math.sqrt(d) / 2
                                if ((y >= ballsj.posY - ballsj.size / 2) && (y <= ballsj.posY + ballsj.size / 2)) {
                                    collision = true
                                }
                                var y = y0 - Math.sqrt(d) / 2
                                if ((y >= ballsj.posY - ballsj.size / 2) && (y <= ballsj.posY + ballsj.size / 2)) {
                                    collision = true
                                }
                            }
                        }
                    }
                }
            }
            var delta = Math.sqrt(Math.abs(Math.pow((ballsi.posX - ballsj.posX), 2) + Math.pow((ballsi.posY - ballsj.posY), 2)))
            if (delta < (ballsi.size + ballsj.size) / 2) {
                collision = true;
            }
            if (collision) {
                character.splice(j, 1)
                character.splice(i, 1)
                collision = false
                console.log("Обнаржено пересечение.Хлоп!")
                break
            } else {
                ballsj.draw(ctx);
                j++
            }
        }
        i++
    }
}
//функция получающая данные об необходимости изменить скорость
function changeSpeed(c) {
    speed += c;
    if (speed < 0) {
        speed = 0;
    }
}
//движение в стороны
function moveBall(param1, param2) {
    //реализация движения шариков, находящихся в массиве character
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < character.length; i) {
        if (character[i] instanceof TBullet) {
            character[i].posX += character[i].accelX;
            character[i].accelX = Math.max(0, character[i].accelX - airResistance);
            character[i].posY += character[i].accelY;
            character[i].accelY = Math.min(freeFallAccel, character[i].accelY + gravity);
            character[i].draw(ctx);

        }
        else {
            character[i].posX = character[i].posX + speed * param1;
            character[i].posY = character[i].posY + speed * param2;
        }
        if ((character[i].posY > canvas.height) || (character[i].posX < 0) || (character[i].posY < 0)) {
            character.splice(i, 1);
            console.log("Выход за границы");
        }
        else {
            enlarge_the_ball(character[i]);
            if (character[i].size > 100) {
                character.splice(i, 1);
                console.log("Превышен размер")
            }
            else {
                character[i].draw(ctx);
            }
            i++;
        }
    }
    deletefigure();
    drawGun();
}

function move() {
    clearInterval(idTimer);
    idTimer = setInterval('moveBall();', 50);
}

function move_on_same_side(movement) {
    mode = movement
    if (mode == 1) {
        //движение влево
        clearInterval(idTimer);
        idTimer = setInterval('moveBall((Math.random() * 2 - 4),(Math.random() * 4 - 2));', 50);
    }
    if (mode == 2) {
        //движение вправо
        clearInterval(idTimer);
        idTimer = setInterval('moveBall((Math.random() * 2 - 4)*(-1), (Math.random() * 4 - 2)*(-1));', 50);
    }
    if (mode == 3) {
        //движение вверх
        clearInterval(idTimer);
        idTimer = setInterval('moveBall((Math.random() * 4 - 2), (Math.random() * 2 - 4));', 50);

    }
    if (mode == 4) {
        //вижение вниз
        clearInterval(idTimer);
        idTimer = setInterval('moveBall((Math.random() * 4 - 2)*(-1), (Math.random() * 2 - 4)*(-1));', 50);
    }
}
function getMousePos(event) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
function calcGun(event) {
    let mousePos = getMousePos(event);
    let x = mousePos.x;
    let y = mousePos.y;
    gunAngle = Math.atan2(y, canvas.width - x);
    bulletX = 50 * Math.cos(gunAngle) - 20;
    bulletY = canvas.height - 50 * Math.sin(gunAngle) + 10;
}
function goInput(event) {
    let mousePos = getMousePos(event);
    let x = mousePos.x;
    let y = mousePos.y;
    let accelX = canvas.width * Math.sin(gunAngle) / 24;
    let accelY = -canvas.height * Math.cos(gunAngle) / 24;
    let bullet = new TBullet(bulletX, bulletY, accelX, accelY);
    bullet.draw(ctx);
    character.push(bullet);
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

TBullet = new Class({
    Extends: TBall, //создание дочернего класса дл
    draw: function (ctx) {
        // рисуем шарик на canvas
        with (this) {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(posX, posY, size / 2, 0, 2 * Math.PI, false); //дуги	
            ctx.closePath();
            ctx.fill();
        }
    },
});