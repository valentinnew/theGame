(function() {
    function game(points, config)
    {
        let ctx = config.canvasArea.getContext('2d');
        let bgCtx = config.canvasBg.getContext('2d');

        drawBox(bgCtx);

        requestAnimationFrame(function draw() {
            for (let i in points) {
                if (!points.hasOwnProperty(i)) {
                    continue;
                }
                drawPoint(points[i], ctx, config);
            }
            requestAnimationFrame(draw);
        });
    }

    function drawBox(ctx)
    {
        ctx.fillStyle = "#000";
        ctx.fillRect(50, 50, 100, 100);
    }

    function drawPoint(point, ctx, config) {
        let newPosition = point.calcPosition((new Date()).getTime(), config);
        if (!point.isPositionChanged(newPosition)) {
            return;
        }
        point.clear(ctx);
        point.setPosition(newPosition);
        point.draw(ctx);
    }

    let Point = function(config) {
        this.position = {
            time: undefined,
            x: undefined,
            y: undefined,
            start: undefined,
        };
        this.config = config;
    };

    Point.prototype.isPositionChanged = function(position) {
        return (
            (
                position.time !== undefined
                && position.x !== undefined
                && position.y !== undefined
                && position.speed !== undefined
            ) && (
                position.time !== this.position.time
                || position.x !== this.position.x
                || position.y !== this.position.y
            )
        );
    };

    Point.prototype.clear = function(ctx) {
        if (this.position.time === undefined
            || this.position.x === undefined
            || this.position.y === undefined
        ) {
            return;
        }

        ctx.clearRect(this.position.x - 3, this.position.y - 3, 6, 6);
    };

    Point.prototype.setPosition = function(position) {
        // @todo установить поэлементно, чтобы не привязываться к объекту
        this.position = position;
    };
    Point.prototype.draw = function(ctx) {
        // ctx.fillStyle = "#FF0000";
        // ctx.fillRect(this.position.x, this.position.y, 4, 4);

        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
    };

    Point.prototype.calcPosition = function(mtime, config) {
        function calcMinDiffTime(speed) {
            let speedX = Math.floor(speed.x * 1000)/1000;
            let speedY = Math.floor(speed.y * 1000)/1000;
            let errorPosition = 1;
            return Math.max(
                speedX ? Math.floor(Math.abs(errorPosition * 1000/speedX)) : 0,
                speedY ? Math.floor(Math.abs(errorPosition * 1000/speedY)) : 0,
                1
            );
        }

        /*
         * Функция расчета следующей позиции точки при прямолинейном движении с эмуляцией отражения от стенок
         */
        function calc(startPosition, diffTime)
        {
            let speedX = startPosition.speed.x;
            let speedY = startPosition.speed.y;

            // @todo расчет столкновений с препятствиями, описанные в конфиге
            let pointC = {

            };

            // граница, за которую нельзя переходить, т.е. область, при нахождении в которой, необходимо отразить движение
            // так же необходимо определить угол под которым происходило столкновение.
            // определение - находится ли точка внутри или вне области

            // intersection
            let intersection = false;
            // @todo
            // для определения, находится ли точка внутри какой-либо зоны, необходимо:
            //  правильно задать фигуру - она должна задаваться простыми линиями, она должна быть всегда выпуклой (если какая-то фигура
            //    впуклая, то необходимо делить фигуру на выпуклые. Так же, у фигуры можно задавать исключения, которые
            //    позволяют находится внутри фигуры - это необходимо для задания сложных впуклостей, таких как дуга (например месяц
            //    - это фигура, которую нельзя задать с досточно просто соединением выпуклых фигур)
            //    При этом линии, например, должны идти в строкой последовательности - по часовой стрелке. Таки образом,
            //    имея координаты начала и конца линии и определив, где находится искомый объект - слева или справа от
            //    линии (идя от начала к концу линии) можно понять, объект находится внутри или снаружи фигуры.
            //    С окружностями и дугами определить проще - достаточно знать расстояние до центра. Главное правильно понять
            //    что дуга - это близжайшая линия фигуры
            //    Дуги должны преобразовываться в боксы для определния близжайшей линии


            let c = {
                reverse: true,// данный флаг означает, что за пределами данной области нахождение активного объекта невозможно
                path: [
                    ['line', [50, 50], [150, 50]],
                    ['line', [150, 50], [150, 150]],
                    ['line', [150, 150], [50, 150]],
                    ['line', [50, 150], [50, 50]],
                ],
            };


            // отражние от стены (вертикальная)
            if (startPosition.x > 148 && speedX > 0) {
                speedX = speedX * (-1);
            }

            if (startPosition.x < 52 && speedX < 0) {
                speedX = speedX * (-1);
            }

            if (startPosition.y > 148 && speedY > 0) {
                speedY = speedY * (-1);
            }

            if (startPosition.y < 52 && speedY < 0) {
                speedY = speedY * (-1);
            }

            let positionX = startPosition.x + (diffTime / 1000 * speedX);
            let positionY = startPosition.y + (diffTime / 1000 * speedY);
            return {
                x: positionX,
                y: positionY,
                speed: {
                    x: speedX,
                    y: speedY,
                },
            };
        }

        let position = {
            x: this.config.start.x,
            y: this.config.start.y,
            speed: this.config.start.speed
        };

        let diffTime = 0;
        // старт анимации. установка стартовой позиции
        // @todo перенести в инициализацию скрипта чтобы избавиться от лишней проверок
        if (!isNaN(this.position.time)) {
            position = {
                x: this.position.x,
                y: this.position.y,
                speed: this.position.speed
            };
            diffTime = mtime - this.position.time;
        }
        // проверка на долгий таймаут между обработками. Если он более maxDiffTimeForStop мс,
        // то пересчет позиции не происходит
        let maxDiffTimeForStop = 5000;
        if (diffTime < maxDiffTimeForStop) {
            // расчет позиции с учетом лагов (пропусков расчета, при котором могут быть
            let minDiffTime = calcMinDiffTime(position.speed);
            let calcIntervals = Math.floor(diffTime / minDiffTime);
            let diffTimeRest = diffTime % minDiffTime;
            for (let i = 0; i < calcIntervals; ++i) {
                position = calc(position, diffTime);
            }
            position = calc(position, diffTimeRest);
        }

        return {
            time: mtime,
            x: position.x,
            y: position.y,
            speed: position.speed,
        };
    };

    let point1 = new Point({
        start: {
            x: 100,
            y: 100,
            speed: {
                x: 100,
                y: 50
            },
        },
    });
    // let point2 = new Point({
    //     start: {
    //         x: 100,
    //         y: 50,
    //         // speed: 150,
    //     },
    // });
    game([point1], {
        canvasArea: document.getElementById('canvas'),
        canvasBg: document.getElementById('bg'),

        area: [
            {
                // конфиг препятствия, который надо нарисовать и учитывать при расчете движения
                draw: (ctx) => {

                },

            }
        ],
    });


    // point1.setPosition(point1.calcPosition(0));
    // console.log(point1.calcPosition(1000));
})();