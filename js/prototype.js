(function() {
    let bg = new Image(64, 64);
    bg.onload = () => {
        init({
            canvas: document.getElementById("canvas"),
            bg: bg,
            height: 300,
            width: 800,
            car: {
                car0: {
                    position: {
                        x: 100,
                        y: 200,
                    },
                    size: {
                        height: 10,
                        width: 10,
                    },
                    color: 'blue',
                }
            },
            fps: 50,
        });
    };
    bg.src = '/race/img/road-stone-texture_(11)_64.png';

    function init(config) {
        let canvas = config.canvas;
        let ctx = canvas.getContext("2d");

        canvas.height = config.height;
        canvas.width = config.width;

        let params = {
            fps: 0,
            carsPosition: {
                car0: {
                    x: config.car.car0.position.x,
                    y: config.car.car0.position.y,
                }
            }
        };
        // let frames = 0;
        // let startTime = (new Date()).getTime();
        // let currTime = startTime;
        // let loop = () => {
        //     draw(ctx, config, params);
        //     ++frames;
        //
        //     currTime = (new Date()).getTime();
        //     if ((startTime + 1000) < currTime) {
        //         startTime = currTime;
        //         params.fps = frames;
        //         frames = 0;
        //     }
        // };

        // setInterval(loop, 1000/config.fps);
        requestAnimationFrame(function animate() {
            draw(ctx, config, params);
            requestAnimationFrame(animate);
        });

        initCarControl(params.carsPosition.car0);
    }

    function draw(ctx, config, params)
    {
        calcPosition(config, params);
        ctx.clearRect(0, 0, config.width, config.height);

        drawBg(ctx, config, params);
        drawFPS(ctx, config, params);
        drawCar(ctx, config, params);
    }

    function calcPosition()
    {





    }

    let drawFPS = (function() {
        let frames = 0;
        let fps = 0;
        let checkTime = (new Date()).getTime() + 1000;

        return function (ctx, config, params) {
            ++frames;

            let currTime = (new Date()).getTime();
            if ((checkTime) < currTime) {
                checkTime = currTime + 1000;
                fps = frames;
                frames = 0;
            }

            ctx.font = "20px Arial";
            ctx.fillStyle = 'black';
            ctx.fillText("FPS: " + fps, 0, 30);
        }
    })();

    let drawBg = (() => {
        let pt = undefined;
        return (ctx, config) => {
            if (pt === undefined) {
                pt = ctx.createPattern(config.bg, 'repeat');
            }

            ctx.rect(0, 0, config.width, config.height);
            // ctx.fillStyle = pt;
            ctx.fillStyle = "#FF0000";
            ctx.fill();

        };
    })();
    // function drawBg(ctx, config) {
    //     ctx.strokeStyle = "green";
    //     ctx.strokeRect(0, 0, config.width, config.height);
    // }

    function drawCar(ctx, config, params) {
        ctx.fillStyle = config.car.car0.color;
        ctx.fillRect(
            params.carsPosition.car0.x + config.car.car0.size.width/2,
            params.carsPosition.car0.y + config.car.car0.size.height/2,
            config.car.car0.size.width,
            config.car.car0.size.height
        );
    }

    function initCarControl(position) {
        let keyMap = {
            w: 'up',
            a: 'left',
            s: 'down',
            d: 'right',
        };

        let actionStatus = {
            up: 0,
            left: 0,
            right: 0,
            down: 0,
        };

        let action = {
            up: (position) => {
                if (actionStatus.down === 1) {
                    return undefined;
                } else if ((actionStatus.left === 1 || actionStatus.right === 1)
                    && actionStatus.left !== actionStatus.right
                ) {
                    position.y -= 1;
                } else {
                    position.y -= 2;
                }
            },
            left: (position) => {
                if (actionStatus.right === 1) {
                    return undefined;
                } else if ((actionStatus.up === 1 || actionStatus.down === 1)
                    && actionStatus.up !== actionStatus.down
                ) {
                    position.x -= 1;
                } else {
                    position.x -= 2;
                }
            },
            right: (position) => {
                if (actionStatus.left === 1) {
                    return undefined;
                } else if ((actionStatus.up === 1 || actionStatus.down === 1)
                    && actionStatus.up !== actionStatus.down
                ) {
                    position.x += 1;
                } else {
                    position.x += 2;
                }
            },
            down: (position) => {
                if (actionStatus.up === 1) {
                    return undefined;
                } else if ((actionStatus.left === 1 || actionStatus.right === 1)
                    && actionStatus.left !== actionStatus.right
                ) {
                    position.y += 1;
                } else {
                    position.y += 2;
                }
            },
        };
        let activeActions = [];

        document.addEventListener('keydown', (event) => {
            if (keyMap[event.key] === undefined) {
                return;
            }
            if (actionStatus[keyMap[event.key]] === 1) {
                return;
            }
            actionStatus[keyMap[event.key]] = 1;
            activeActions.push(keyMap[event.key]);
        });

        document.addEventListener('keyup', (event) => {
            if (keyMap[event.key] === undefined) {
                return;
            }
            if (actionStatus[keyMap[event.key]] === 0) {
                return;
            }

            actionStatus[keyMap[event.key]] = 0;
            activeActions.splice(activeActions.indexOf(keyMap[event.key]), 1);
        });

        let loop = () => {
            for (let activeAction in activeActions) {
                action[activeActions[activeAction]].call(this, position);
            }
        };
        setInterval(loop, 20);
    }

    // поменять управление
    //
    // нажимаю на кн. управления
    // меняется формула расчета таректории
    // при рисовании учитывается эта формула и расчитывается положение точки в текущий момент.
})();