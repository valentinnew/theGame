(function() {

    // нарисовать оси координат (слева направо, снизу вверх)
    // нарисовать разные графики (окружность, квадрат, прямоугольник и пр.)


    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    function drawAxe(ctx, config) {
        ctx.strokeStyle = "#000000";
        ctx.moveTo(config.width/2, 0);
        ctx.lineTo(config.width/2, config.height);
        ctx.moveTo(0, config.height/2);
        ctx.lineTo(config.width, config.height/2);
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
            let yPos = (-yy + config.height/2);
            return (y >= 0 && y <= config.height)
                ? yPos
                : false;
        }
        function toCoord(xPos, config)
        {
            return (xPos - config.width/2)*config.scale;
        }


        let scale = config.scale;
        let maxXPos = config.width;
        let maxYPos = config.height;
        ctx.fillStyle = "#FF0000";
        ctx.strokeStyle = "#FF0000";
        for (let xPos = 0; xPos <= maxXPos; ++xPos) {
            let xCoord = toCoord(xPos, config);
            let yCoords = calc.call(this, xCoord);
            for (let yIndex in yCoords) {
                if (!yCoords.hasOwnProperty(yIndex)) {
                    continue;
                }
                if (typeof yCoords[yIndex] === 'object') {
                    drawVerticale();
                    let isStart = true;
                    for (let yyIndex in yCoords[yIndex]) {
                        if (!yCoords[yIndex].hasOwnProperty(yyIndex)) {
                            continue;
                        }
                        let yy = yCoords[yIndex][yyIndex]/scale;
                        let y = (-yy + config.height/2);
                        if (y < 0) {
                            y = 0;
                        } else if (y > maxYPos) {
                            y = maxYPos;
                        }

                        if (isStart) {
                            isStart = false;
                            ctx.moveTo(xPos, y);
                        } else {
                            ctx.lineTo(xPos, y);
                        }
                    }
                    ctx.stroke();
                } else {
                    let yPos = getYPos(yCoords[yIndex], config);
                    if (yPos !== false) {
                        ctx.fillRect(xPos, yPos, 1, 1);
                    }
                }
            }
        }
    }

    let functions = {
        'f(x^2)': (x) => {
            return [x*x];
        },
        'f(x)': (x) => {
            return [x];
        },
        'round': (x) => {
            let a = 1;
            let b = 1;
            let y = b * Math.pow(1 - Math.pow(x/a, 2), 1/2);
            return [y, -y];
        },
        'squire': (x) => {
            let center = [0, 0];
            let sideLength = 100;
            let angle = 0;

            if (x === (sideLength * -1/2)) {
                return [[sideLength/2, sideLength * (-1/2)]];
            } else if (x === (sideLength/2)) {
                return [[sideLength/2, sideLength * (-1/2)]];
            } else if (x > (sideLength * -1/2) && x < (sideLength/2)) {
                return [sideLength/2, sideLength * (-1/2)]
            }

            return [];
        },
        '1/x': (x) => {
            if (x === 0) {
                return [];
            }

            return [1/x];
        },
    };

    let config = {
        width: 1000,
        height: 600,
        scale: 1/10
    };

    drawAxe(ctx, config);
    drawPath(ctx, config, functions['f(x^2)']);
})();