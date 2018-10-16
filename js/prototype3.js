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
        point.draw(newPosition, ctx);
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

    Point.prototype.draw = function(position, ctx) {
        this.position = position;
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(position.x, position.y, 4, 4);
    };

    Point.prototype.calcPosition = function(mtime) {
        // для равномерного движения и корректной обработки отражений, необходимо при больших значениях diffTime
        // делать промежуточный расчет без отрисовки для получения промежуточных позиций.

        // добавить стату по времени расчета и частоты расчета
        // в функции расчета необходимо учитывать добавленные в будущем управления (поворот, ускорение)


        function calc(startPosition, diffTime)
        {
            let directionRad = Math.PI * startPosition.direction/180;
            let speedX = Math.cos(directionRad) * startPosition.speed;
            let speedY = Math.sin(directionRad) * startPosition.speed;
            let direction = startPosition.direction;

            // смена направления на противоположное не катит, т.к. из-за лага следующий расчет тоже может проходить
            // условие смены направления. Потому необходимо либо проводить промежуточный расчет, либо четко указывать
            // направление (буду делать пром расчеты)
            if ((startPosition.x > 150 && direction === 0)
                || (startPosition.x < 50 && direction === 180)) {
                direction = (direction + 180) % 360;
            }

            return {
                x: startPosition.x + (diffTime / 1000 * speedX),
                y: startPosition.y + (diffTime / 1000 * speedY),
                speed: startPosition.speed,
                direction: direction,
            };
        }

        if (isNaN(this.position.time)) {
            return {
                time: mtime,
                x: this.config.start.x,
                y: this.config.start.y,
                speed: this.config.start.speed,
                direction: this.config.start.direction,
            };
        } else {
            let position = calc({
                x: this.position.x,
                y: this.position.y,
                direction: this.position.direction,
                speed: this.position.speed
            }, mtime - this.position.time);

            return {
                time: mtime,
                x: position.x,
                y: position.y,
                speed: position.speed,
                direction: position.direction,
            };
        }
    };

    let point1 = new Point({
        start: {
            x: 100,
            y: 100,
            speed: 200,
            direction: 0,
        },
    });
    let point2 = new Point({
        start: {
            x: 100,
            y: 50,
            speed: 150,
            direction: 180,
        },
    });
    game([point1, point2]);
})();