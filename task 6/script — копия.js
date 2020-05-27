var canvas, ctx, character, idTimer;
var array = [];
//класс фигур, от которого наследуются все прочие классы
TFigure = new Class({
    initialize: function (pX, pY) {
        this.posX = pX; //позиция шарика по X
        this.posY = pY; //позиция шарика по Y
        //цвет шарика, формируется случайным оьразом
        // // радиус шарика, случайное число от 5 до 30
        this.size = 20 + Math.random() * 25;// размер фигурки
        this.colFigure = 'rgb(' + Math.floor(Math.random() * 256) + ','
            + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
    },//цвет фигурки
    //posX: 0,
    //posY: 0,
    //colBall:"rgb(0,0,0)",
    //rBall: 0,
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
            ctx.fillStyle = colFigure;
            ctx.beginPath(); //Создает новый контур.
            ctx.moveTo(posX - size / 2, posY - size / 2)
            ctx.lineTo(posX + size / 2, posY - size / 2)
            ctx.lineTo(posX + size / 2, posY + size / 2)
            ctx.lineTo(posX - size / 2, posY + size / 2)
            ctx.lineTo(posX - size / 2, posY - size / 2)
            ctx.closePath(); //Закрывает контур, так что будущие команды рисования вновь направлены контекс
            ctx.fill(); //Рисует фигуру с заливкой внутренней области.
        }
    },
});
//класс ПакМэна
TPackMan = new Class({
    Extends: TFigure,
    draw: function (ctx) {
        // рисуем шарик на canvas
        with (this) {
            ctx.fillStyle = colFigure;
            ctx.beginPath();
            ctx.arc(posX, posY, size, 0.2 * Math.PI, 1.8 * Math.PI);
            ctx.strokeStyle = '#000';
            ctx.stroke();
            ctx.lineTo(posX, posY);
            ctx.closePath();
            ctx.fill();

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
        for (var i = 1; i <= 33; i++) {
            var item = new TBall(10 + Math.random() * (canvas.width - 30),
                10 + Math.random() * (canvas.height - 30));
            item.draw(ctx);
            character.push(item);
        }
        for (var i = 1; i <= 33; i++) {
            var item = new TSquare(10 + Math.random() * (canvas.width - 30),
                10 + Math.random() * (canvas.height - 30));
            item.draw(ctx);
            character.push(item);
        }
        for (var i = 1; i <= 33; i++) {
            var item = new TPackMan(10 + Math.random() * (canvas.width - 30),
                10 + Math.random() * (canvas.height - 30));
            item.draw(ctx);
            character.push(item);
        }
    }
}
//создаем новый шарик по щелчку мыши, добавляем его в массив шариков и рисуем его
function goInput(event) {
    var x = event.clientX;
    var y = event.clientY;
    var item = Math.floor(1 + Math.random() * (3 + 1 - 1));
    if (item == 1)
        item = new TBall(x, y)
    else if (item == 2)
        item = new TPackMan(x, y)
    else if (item == 3)
        item = new TSquare(x, y)
    item.draw(ctx);
    character.push(item);

}
//движение вверх
function moveBall() {
    //реализация движения шариков, находящихся в массиве character
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < character.length; i) {
        character[i].posX = character[i].posX + (Math.random() * 4 - 2);
        character[i].posY = character[i].posY + (Math.random() * 2 - 4);
        if ((character[i].posY > canvas.height) || (character[i].posX < 0) || (character[i].posY < 0)) {
            character.splice(i, 1);
            console.log("Выход за границы");
        }
        else {
            enlarge_the_ball(character[i]);
            if (character[i].size > 50) {
                character.splice(i, 1);
            }
            else {
                character[i].draw(ctx);
            }
            i++;
        }
    }
    clash_of_figures();
}
function move() {
    clearInterval(idTimer);
    idTimer = setInterval('moveBall();', 50);
}
//движение вниз
function moveBallDown() {
    //реализация движения вниз шариков, находящихся в массиве character
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < character.length; i) {
        character[i].posX = character[i].posX - (Math.random() * 4 - 2);
        character[i].posY = character[i].posY - (Math.random() * 2 - 4);
        character[i].draw(ctx);
        if ((character[i].posX < 0) || (character[i].posY < 0)) {
            character.splice(i, 1);
            console.log("Выход за границы");
        }
        else {
            enlarge_the_ball(character[i]);
            if (character[i].size > 50) {
                character.splice(i, 1);
            }
            else {
                character[i].draw(ctx);
            }
            i++;
        }
    }
    clash_of_figures();
}
function moveDown() {
    clearInterval(idTimer);
    idTimer = setInterval('moveBallDown();', 50);
}
//движение влево
function moveBallLeft() {
    //реализация движения вниз шариков, находящихся в массиве character
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < character.length; i) {
        character[i].posX = character[i].posX + (Math.random() * 2 - 4);
        character[i].posY = character[i].posY + (Math.random() * 4 - 2);
        if ((character[i].posX > canvas.width) || (character[i].posX < 0) || (character[i].posY < 0)) {
            character.splice(i, 1);
            console.log("Выход за границы");
        }

        else {
            enlarge_the_ball(character[i]);
            if (character[i].size > 50) {
                character.splice(i, 1);
            }
            else {
                character[i].draw(ctx);
            }
            i++;
        }

    }
    clash_of_figures();
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
    //реализация движения вниз шариков, находящихся в массиве character
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < character.length; i) {
        character[i].posX = character[i].posX - (Math.random() * 2 - 4);
        character[i].posY = character[i].posY - (Math.random() * 4 - 2);
        character[i].draw(ctx);
        if ((character[i].posX > canvas.width) || (character[i].posX < 0) || (character[i].posY < 0)) {
            character.splice(i, 1);
            console.log("Выход за границы");
        }
        else {
            enlarge_the_ball(character[i]);
            if (character[i].size > 50) {
                character.splice(i, 1);
            }
            else {
                character[i].draw(ctx);
            }
            i++;
        }

    }
    clash_of_figures();
}
//хаотичное движение
function moveBallChaos() {
    //реализация движения вниз шариков, находящихся в массиве character
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < character.length; i) {
        var variant = Math.floor(Math.random() * (5 - 1)) + 1;
        if (variant == 1) {
            character[i].posX = character[i].posX + (Math.random() * 1 - 1);
            character[i].posY = character[i].posY + (Math.random() * 1 - 1);
            character[i].draw(ctx);
        }
        if (variant == 2) {
            character[i].posX = character[i].posX - (Math.random() * 1 - 1);
            character[i].posY = character[i].posY - (Math.random() * 1 - 1);
            character[i].draw(ctx);
        }
        if (variant == 3) {
            character[i].posX = character[i].posX - (Math.random() * 1 - 1);
            character[i].posY = character[i].posY - (Math.random() * 1 - 1);
            character[i].draw(ctx);
        }
        if (variant == 4) {
            character[i].posX = character[i].posX + (Math.random() * 1 - 1);
            character[i].posY = character[i].posY + (Math.random() * 1 - 1);
            character[i].draw(ctx);
        }
        enlarge_the_ball(character[i]);
        if (character[i].size > 50) {
            character.splice(i, 1);
        }
        if ((character[i].posX > canvas.width) || (character[i].posX < 0) || (character[i].posY < 0)) {
            character.splice(i, 1);
            console.log("Выход за границы");
        }
        else
            i++;
    }
    clash_of_figures();
}
function moveChaos() {
    clearInterval(idTimer);
    idTimer = setInterval('moveBallChaos();', 50);
}
//рандомное движение
function moveBallRandom() {
    //реализация рандомного движения шариков, находящихся в массиве character
    drawBack(ctx, '#202020', '#aaa', canvas.width, canvas.height);
    for (var i = 0; i < character.length; i) {
        if (array[i] == 1) {
            character[i].posX = character[i].posX + (Math.random() * 4 - 2);
            character[i].posY = character[i].posY + (Math.random() * 2 - 4);
            character[i].draw(ctx);
        }
        if (array[i] == 2) {
            character[i].posX = character[i].posX - (Math.random() * 4 - 2);
            character[i].posY = character[i].posY - (Math.random() * 2 - 4);
            character[i].draw(ctx);
        }
        if (array[i] == 3) {
            character[i].posX = character[i].posX - (Math.random() * 2 - 4);
            character[i].posY = character[i].posY - (Math.random() * 4 - 2);
            character[i].draw(ctx);
        }
        if (array[i] == 4) {
            character[i].posX = character[i].posX + (Math.random() * 2 - 4);
            character[i].posY = character[i].posY + (Math.random() * 4 - 2);
            character[i].draw(ctx);
        }

        enlarge_the_ball(character[i]);

        if (character[i].size > 50) {
            character.splice(i, 1);
        }
        if ((character[i].posX > canvas.width) || (character[i].posX < 0) || (character[i].posY < 0) || (character[i].posY > canvas.height)) {
            character.splice(i, 1);
            console.log("Выход за границы");
        }
        else
            i++;
    }
    clash_of_charact();
}
function moveRandom() {
    Random_array_for_move();
    clearInterval(idTimer);
    idTimer = setInterval('moveBallRandom();', 50);
}
//получение рандомного массив для метода moveBallRandom
function Random_array_for_move() {
    for (var i = 0; i < character.length; i++) {
        array[i] = Math.floor(Math.random() * (5 - 1)) + 1;
    }
}
//измение размера шарика при движении
function enlarge_the_ball(a) {
    a.radius = a.radius + 0.3;
}
function SegmentSegment(x11, y11, x12, y12, x21, y21, x22, y22) {
    let maxx1 = Math.max(x11, x12), maxy1 = Math.max(y11, y12)
    let minx1 = Math.min(x11, x12), miny1 = Math.min(y11, y12)
    let maxx2 = Math.max(x21, x22), maxy2 = Math.max(y21, y22)
    let minx2 = Math.min(x21, x22), miny2 = Math.min(y21, y22)
    if (minx1 > maxx2 || maxx1 < minx2 || miny1 > maxy2 || maxy1 < miny2)
        return false  // Момент, када линии имеют одну общую вершину...

    let dx1 = x12 - x11, dy1 = y12 - y11 // Длина проекций первой линии на ось x и y
    let dx2 = x22 - x21, dy2 = y22 - y21 // Длина проекций второй линии на ось x и y
    let dxx = x11 - x21, dyy = y11 - y21
    let mul
    let div = dy2 * dx1 - dx2 * dy1
    if (div === 0)
        return false // Линии параллельны...
    if (div > 0) {
        mul = dx1 * dyy - dy1 * dxx
        if (mul < 0 || mul > div)
            return false // Первый отрезок пересекается за своими границами...
        mul = dx2 * dyy - dy2 * dxx
        if (mul < 0 || mul > div)
            return false // Второй отрезок пересекается за своими границами...
    }
    mul = -(dx1 * dyy - dy1 * dxx)
    if (mul < 0 || mul > -div)
        return false // Первый отрезок пересекается за своими границами...
    mul = -(dx2 * dyy - dy2 * dxx)
    if (mul < 0 || mul > -div)
        return false // Второй отрезок пересекается за своими границами...
    return true
}
function SegmentCircle(x1, y1, x2, y2, xC, yC, R) {
    x1 -= xC
    y1 -= yC
    x2 -= xC
    y2 -= yC

    let dx = x2 - x1
    let dy = y2 - y1

    //составляем коэффициенты квадратного уравнения на пересечение прямой и окружности.
    //если на отрезке [0..1] есть отрицательные значения, значит отрезок пересекает окружность
    let a = dx * dx + dy * dy
    let b = 2 * (x1 * dx + y1 * dy)
    let c = x1 * x1 + y1 * y1 - R * R

    //а теперь проверяем, есть ли на отрезке [0..1] решения
    if (-b < 0)
        return (c < 0)
    if (-b < (2. * a))
        return ((4. * a * c - b * b) < 0)
    return (a + b + c < 0)
}

//проверка столкновения фигур
function clash_of_figures() {
    for (let i = 0; i < character.length; i++) {
        for (let j = i + 1; j < character.length; j++) {
            let a = character[i], b = character[j]
            if (a.constructor.name == 'TBall' && b.constructor.name == 'TBall') {
                if (Math.pow(a.posX - b.posX, 2) + Math.pow(a.posY - b.posY, 2) < Math.pow(a.radius / 2 + b.radius / 2, 2)) {
                    character.splice(character.indexOf(a), 1)
                    character.splice(character.indexOf(b), 1)
                }
            }
            else if (a.constructor.name != 'TBall' && b.constructor.name != 'TBall') {
                let good = true
                for (let i = 0; i < a.lines.length; i++) {
                    let l1 = a.lines[i]
                    for (let j = 0; j < b.lines.length; j++) {
                        let l2 = b.lines[j]
                        good = !SegmentSegment(l1[0].x, l1[0].y, l1[1].x, l1[1].y, l2[0].x, l2[0].y, l2[1].x, l2[1].y)
                        if (!good) break

                    }
                    if (!good) break
                }
                if (!good) {
                    character.splice(i, 1);
                    character.splice(character.indexOf(b), 1)
                }
            }
            else {
                if (a.constructor.name == 'TBall' && b.constructor.name != 'TBall') {
                    a = character[j], b = character[i]
                } // a - lines, b - ball
                let good = true
                for (let i = 0; i < a.lines.length; i++) {
                    if (SegmentCircle(a.lines[i][0].x, a.lines[i][0].y, a.lines[i][1].x, a.lines[i][1].y, b.posX, b.posY, b.radius / 2)) {
                        good = false
                        break
                    }
                }
                if (!good) {
                    character.splice(character.indexOf(a), 1)
                    character.splice(character.indexOf(b), 1)
                }
            }

        }
    }
}