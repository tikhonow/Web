var canvas, ctx, idTimer, idTimer1;
var character = [];
var speed = 0.5;
var hardsize = 0;
//игра
const airResistance = 0.05;
var gunAngle = 0;
const gravity = 0.35;
const freeFallAccel = 5;
var bulletX = 0, bulletY = 0;
var firstName = ""
var score = 0;
var bulletX
var bulletY
var user_live = 5
var first_play = 1;
var strlive = "❤❤❤❤❤"
//класс фигур, от которого наследуются все прочие классы
TFigure = new Class({
    initialize: function (pX, pY, accelX, accelY) {
        this.posX = pX; //позиция шарика по X
        this.posY = pY; //позиция шарика по Y
        this.accelX = accelX;
        this.accelY = accelY;
        this.live = 2
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
    initialize: function (pX, pY, accelX, accelY) {
        this.posX = pX; //позиция шарика по X
        this.posY = pY; //позиция шарика по Y
        this.accelX = accelX;
        this.accelY = accelY;
        this.live = 1
        //цвет шарика, формируется случайным оьразом
        // // радиус шарика, случайное число от 5 до 30
        this.size = 20 + Math.random() * 25;// размер фигурки
        this.colFigure = 'rgb(' + Math.floor(Math.random() * 256) + ','
            + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
    },
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

TBullet = new Class({
    Extends: TBall,
    initialize: function (pX, pY, accelX, accelY) {
        this.posX = pX; //позиция шарика по X
        this.posY = pY; //позиция шарика по Y
        this.accelX = accelX;
        this.accelY = accelY;
        this.live = 1
        //цвет шарика, формируется случайным оьразом
        // // радиус шарика, случайное число от 5 до 30
        this.size = 40 - hardsize;// размер фигурки
        this.colFigure = 'rgb(' + Math.floor(Math.random() * 256) + ','
            + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
    },//цвет фигурки
    //создание дочернего класса дл
    draw: function (ctx) {
        // рисуем шарик на canvas
        with (this) {
            if (ost(score) == 0)
            {
                ctx.fillStyle = '#ffff00';
                ctx.beginPath();
                ctx.arc(posX, posY, size, 0.2 * Math.PI, 1.8 * Math.PI);
                ctx.strokeStyle = '000';
                ctx.stroke();
                ctx.lineTo(posX, posY);
                ctx.closePath();
                ctx.fill();
            }
            else
            {
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(posX, posY, size / 2, 0, 2 * Math.PI, false); //дуги	
                ctx.closePath();
                ctx.fill();
            }
        }
    },
});
//фон canvas, имя пользователя и информация об игровых очках
function drawBack(ctx, col1, col2, w, h) {
    // закрашиваем канвас градиентным фоном
    ctx.save();
    var img = new Image();
    img.src = "games.jpg";
    var pat = ctx.createPattern(img, "repeat");
    ctx.rect(0, 0, w, h);
    ctx.fillStyle = pat;
    ctx.fill();
    drawScore();

}
// инициализация работы
function init() {
    wt();
    check_name();
    canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        //рисуем фон
        drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
        //создаем 10 различных фигур, заноси их в массив и выводим на canvas
        idTimer1 = setInterval('new_f()', 5000);
    }
}
function new_f() {

    for (var i = 1; i <= 1; i++) {
        var item = new TBall(810,
            40 + Math.random() * (200));
        item.draw(ctx);
        character.push(item);
    }
    for (var i = 1; i <= 1; i++) {
        var item = new TSquare(850,
            40 + Math.random() * (200));
        item.draw(ctx);
        character.push(item);
    }
    /*for (var i = 1; i <= 1; i++) {
        var item = new TPackMan(900,
        40 + Math.random() * (200));
        item.draw(ctx);
        character.push(item);
    }*/
    for (var i = 1; i <= 1; i++) {
        var item = new TTriangle(900,
            40 + Math.random() * (200));
        item.draw(ctx);
        character.push(item);
    }
}

//измение размера шарика при движении
function enlarge_the_ball(a) {
    let add = 0;
    if (ost(score) == 0)
    {
        add = 10;
    }
    else 
    {
        add = 0;
    }
    a.size = a.size + add;
}
//функция удаляющая пересекающиеся фигуры
function deletefigure() {
    var collision = false
    for (var i = 0; i < character.length; i) {
        for (var j = 0; j < character.length; j) {
            if (character[j].size > 200)
            {   
                score += character.length - 1;
                character.length = 0;
            }
            else {
                if (character[i].size > 200)
                {
                    score += character.length - 1;
                    character.length = 0;
                }
            }
            var ballsi = character[i]
            ballsj = character[j]
            if (i == j) {
                j++
                continue
            }
            if ((character[j] instanceof TBullet) && !(character[i] instanceof TBullet)) {
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
                character[i].live--;
                character[j].live--;
                if (character[j].live == 0) {
                    if (!(character[j] instanceof TBullet)) {
                        score++;
                    }
                    character.splice(j, 1)
                    console.log("Минус жизнь")
                }
                if (character[i].live == 0) {
                    if (!(character[i] instanceof TBullet)) {
                        score++;
                    }
                    character.splice(i, 1)
                    console.log("Минус жизнь")
                }
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
            enlarge_the_ball(character[i]);
            character[i].draw(ctx);

        }
        else {
            character[i].posX = character[i].posX + speed * param1;
            //character[i].posY = character[i].posY + speed * param2;
        }
        if (character[i].posX < 0) {
            character.splice(i, 1);
            user_live--;
            console.log("Выход за границы");
            end_game();
        }
        else {
            character[i].draw(ctx);
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

function move_on_same_side() {
    clearInterval(idTimer);
    idTimer = setInterval('moveBall((Math.random() * 2 - 4),(Math.random() * 4 - 2));', 50);

}
function pause() {
    clearInterval(idTimer);
    clearInterval(idTimer1);
    ctx.font = "60px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("ПАУЗА", 300, 200);
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
function check_name() {
    firstName = prompt('Как Вас зовут?');
    (Boolean(firstName)) ? alert("Приятной игры " + firstName) : check_name()
}
function drawScore() {
    ctx.font = "30px Arial";
    ctx.fillStyle = level_of_complexity();
    ctx.fillText("Score:" + score, 10, 40);
    ctx.fillStyle = "red";
    ctx.fillText("Lives: " + minus_life() + user_live, 540, 40);
}
function minus_life() {
    if (user_live == 5) {
        return ("❤❤❤❤❤");
    }
    if (user_live == 4) {
        return ("❤❤❤❤♡");
    }
    if (user_live == 3) {
        return ("❤❤❤♡♡");
    }
    if (user_live == 2) {
        return ("❤❤♡♡♡");
    }
    if (user_live == 1) {
        return ("❤♡♡♡♡");
    }
    if (user_live == 0) {
        return ("♡♡♡♡♡");
    }
}
function end_game() {
    if (user_live == 0) {
        alert("GAME OVER");
        localStorage.setItem(firstName, score);
        user();
        w();
    }

}
function restart() {
    wt();
    ctx.clearRect(0, 0, canvas.width, canvas.h);
    character.length = 0;
    user_live = 5;
    score = 0;
}
function user() {
    wt();
    check_name();
    ctx.clearRect(0, 0, canvas.width, canvas.h);
    character.length = 0;
    user_live = 5;
    score = 0;
}
function level_of_complexity() {

    if (score < 10) {
        return ("grey");
    }
    if (score >= 10) {
        speed = 1;
        hardsize = 15;
        return ("green");

    }
    if (score >= 20) {
        speed = 1.5;
        hardsize = 25;
        return ("purple");
    }
}
function w() {
    let html = "<table><h2>РЕЗУЛЬТАТЫ</h2><th>ИМЯ</th><th>ОЧКИ</th>";
    for (let i = 0; i < localStorage.length; i++) {
        html += "<tr>";
        for (let j = 0; j < 1; j++) {
            let key = localStorage.key(i)
            html += "<td>" + localStorage.key(i) + "</td>";
            html += "<td>" + localStorage.getItem(key) + "</td>"
        }
        html += "</tr>";
    }
    html += "</table>";

    document.getElementById("c").innerHTML = html;
}
function wt() {
    let html = "<fieldset><legend><h2>Игра Canvas</h2></legend><h4>\
    Сбейте как можно больше противников</h4><dl><hr><dt>Враги</dt><dd>*Самолет(круг)\
    </dd><dd>*Танк(квадрат) </dd><dd>*НЛО(треугольник) </dd><hr><dt>Правила:</dt>\
    <dd>*У вас есть 5 ❤</dd><dd>*Не лайте врагу дойти до левой границы</dd>\
    <dd>*Стрелять можно каждые 2 секунды</dd><dd>*При успешном попадании 5 раз</dd>\
    <dd>подряд активируется СУПЕР снаряд</dd><hr><dt>Уровни сложности:</dt><dd>Легкий (<10 очков)\
    </dd><dd>Средний (< 15 очков)</dd><dd>Трудный (> 15 очков)</dd></dl></fieldset>";
    document.getElementById("c").innerHTML = html;
}
function ost(a)
{   
    if (a == 0)
    {
        return(1)
    }
    else
    {
       return(a%10); 
    }
    
}