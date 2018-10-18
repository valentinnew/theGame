(function() {
    function game(points)
    {
        let canvas = document.getElementById('canvas');
        let ctx = canvas.getContext('2d');
        requestAnimationFrame(function draw() {
            for (let i in points) {
                if (!points.hasOwnProperty(i)) {
                    continue;
                }
                drawPoint(points[i], ctx);
            }
            requestAnimationFrame(draw);
        });
    }

    function drawPoint(point, ctx) {
        let newPosition = point.calcPosition((new Date()).getTime());
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

        ctx.clearRect(this.position.x - 2, this.position.y - 2, 8, 8);
    };

    Point.prototype.setPosition = function(position) {
        // @todo установить поэлементно, чтобы не привязываться к объекту
        this.position = position;
    };
    Point.prototype.draw = function(ctx) {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.position.x, this.position.y, 4, 4);
    };

    Point.prototype.calcPosition = function(mtime) {
        // для равномерного движения и корректной обработки отражений, необходимо при больших значениях diffTime
        // делать промежуточный расчет без отрисовки для получения промежуточных позиций.

        // добавить стату по времени расчета и частоты расчета
        // в функции расчета необходимо учитывать добавленные в будущем управления (поворот, ускорение)

        function calc(startPosition, diffTime)
        {
            let speedX = startPosition.speed.x;
            let speedY = startPosition.speed.y;
            let errorPosition = 0.1;
            let minDiffTime = Math.max(
                startPosition.speed.x
                    ? Math.floor(Math.abs(errorPosition * 1000/speedX))
                    : 0,
                startPosition.speed.y
                    ? Math.floor(Math.abs(errorPosition * 1000/speedY))
                    : 0
            );

            if (minDiffTime < diffTime) {
                console.log('sub-calc');
                // @todo calc sub times
                // console.log(minDiffTime, diffTime);
            }

            // смена направления на противоположное не катит, т.к. из-за лага следующий расчет тоже может проходить
            // условие смены направления. Потому необходимо либо проводить промежуточный расчет, либо четко указывать
            // направление (буду делать пром расчеты)

            // отражние от стены (вертикальная)
            if (startPosition.x > 150 && speedX > 0) {
                speedX = speedX * (-1);
            }

            if (startPosition.x < 50 && speedX < 0) {
                speedX = speedX * (-1);
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

        if (isNaN(this.position.time)) {
            return {
                time: mtime,
                x: this.config.start.x,
                y: this.config.start.y,
                speed: this.config.start.speed,
            };
        }
        let position = calc({
            x: this.position.x,
            y: this.position.y,
            speed: this.position.speed
        }, mtime - this.position.time);

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
                x: 150,
                y: 0
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
    game([point1]);


    // point1.setPosition(point1.calcPosition(0));
    // console.log(point1.calcPosition(1000));
})();