(function() {

    // @todo точки толще, чем линии. понять почему и исправить


    function drawAxe(ctx, config) {
        ctx.beginPath();
        ctx.moveTo(Math.ceil(config.width/2) + 0.5, 0.5);
        ctx.lineTo(Math.ceil(config.width/2) + 0.5, config.height);
        ctx.moveTo(0.5, Math.ceil(config.height/2) + 0.5);
        ctx.lineTo(config.width + 0.5, Math.ceil(config.height/2) + 0.5);
        ctx.strokeStyle = "#000000";
        ctx.stroke();

        // нарисовать деления.
        // 8пикселей - ширина, 1 пиксель - толщина
        // деления примерно на 100-200 пикселей а целых числах


        // ctx.font = "10px Arial";
        // ctx.fillStyle = 'black';
        // ctx.fillText();
    }

    function drawPath(ctx, config, calc) {
        function getYPos(y, config)
        {
            let yy = y/config.scale;
            let yPos = Math.ceil(-yy + config.height/2);
            return (yPos >= 0 && yPos <= config.height)
                ? yPos
                : false;
        }
        function toCoord(xPos, config)
        {
            // функция должна возвращать диапазон значений, которые попадают в сетку разрешения экрана, равной 1 px
            // это требуется для рисования непрерывных графиков.
            // можно поэксперементировать с перекрытием.

            // для этого необходимо определить максимальное и минимальное значение, при котором выполняется условие "y"
            // ширина у xPos - 1px

            let from = (xPos - config.width/2)*config.scale;
            let to = (xPos + config.step - config.width/2)*config.scale;
            return [from, to];
        }

        let scale = config.scale;
        let maxXPos = config.width;
        let maxYPos = config.height;
        ctx.fillStyle = "#FF0000";
        for (let xPos = 0; xPos <= maxXPos; xPos = xPos + config.step) {
            let xCoord = toCoord(xPos, config);
            let yCoords = calc.call(this, xCoord[0], xCoord[1]);
            for (let yIndex in yCoords) {
                if (!yCoords.hasOwnProperty(yIndex)) {
                    continue;
                }
                if (typeof yCoords[yIndex] === 'object') {
                    let isStart = true;
                    if (isNaN(yCoords[yIndex][0])
                        || isNaN(yCoords[yIndex][1])
                    ) {
                        continue;
                    }

                    let yFrom = yCoords[yIndex][0]/scale;
                    let yTo = yCoords[yIndex][1]/scale;
                    let yPosFrom = Math.ceil(-yFrom + config.height/2);
                    let yPosTo = Math.ceil(-yTo + config.height/2);

                    if (Math.abs(yPosFrom - yPosTo) <= 1) {
                        ctx.fillRect(xPos + 0.5, yPosFrom + 0.5, 1, 1);
                    } else {
                        ctx.beginPath();
                        ctx.strokeStyle = "#FF0000";
                        ctx.moveTo(xPos + 0.5, yPosFrom + 0.5);
                        ctx.lineTo(xPos + 0.5, yPosTo + 0.5);
                        ctx.closePath();
                        ctx.stroke();
                    }
                } else {
                    let yPos = getYPos(yCoords[yIndex], config);
                    if (yPos !== false) {
                        ctx.fillRect(xPos, yPos, 1, 1);
                    }
                }
            }
        }
    }

    /**
     * Функции для расчета координат.
     *
     * В аргументе передается отрезок по оси x.
     * В ответе ожидается массив координат y.
     * Каждый элемент в массиве - это отдельная точка или линия.
     * Элемент в виде массива из двух точек - это линия (вертикальная)
     * Элемент в виде числа - это точка.
     *
     */
    let functions = {
        'f(x^2)': (xFrom, xTo) => {
            return [[xFrom * xFrom, xTo * xTo]];
        },
        'f(x)': (xFrom, xTo) => {
            return [xFrom];
        },
        'round': (xFrom, xTo) => {
            let a = 2;
            let b = 2;
            let yFrom = b * Math.pow(1 - Math.pow(xFrom/a, 2), 1/2);
            let yTo   = b * Math.pow(1 - Math.pow(xTo/a, 2), 1/2);

            let result = [];
            if (yFrom !== yTo) {
                return [[yFrom, yTo], [(-1)*yFrom, (-1)*yTo]];
            } else {
                return [yFrom, (-1) * yFrom];
            }
        },
        // какие-то полупиксели
        'squire': (xFrom, xTo) => {
            let center = [0, 0];
            let sideLength = 100;
            let angle = 0;

            if (xFrom === (sideLength * -1/2)) {
                return [[sideLength/2, sideLength * (-1/2)]];
            } else if (xFrom === (sideLength/2)) {
                return [[sideLength/2, sideLength * (-1/2)]];
            } else if (xFrom > (sideLength * -1/2) && xFrom < (sideLength/2)) {
                return [sideLength/2, sideLength * (-1/2)]
            }

            return [];
        },
        '1/x': (xFrom, xTo) => {
            if (xFrom === 0) {
                return [];
            }

            return [1/xFrom];
        },
    };

    let config = {
        width: 1000,
        height: 600,
        scale: 1/100,
        step: 1,
    };

    let canvas = document.getElementById("canvas");
    canvas.width = config.width;
    canvas.height = config.height;
    let ctx = canvas.getContext("2d");

    drawAxe(ctx, config);
    drawPath(ctx, config, functions['round']);
})();