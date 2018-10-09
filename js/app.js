$(document).ready(function() {
    console.log('start');

    let track = createTrack($('.track'));
    let car = createCar();
    car.setPosition(20, 30);
    track.objects['point1'] = createCar(track, $('.car'));

    // var car = createCar(track, $('.car'));
    // track.addCar(car);
    // var carControl = initCarControl();
});

function createCar() {
    let position = {
        x: 0,
        y: 0
    };
    return {
        carControl: initCarControl(),
        getPosition: () => {},
        setPosition: (x, y) => {
            position.x = x;
            position.y = y;
        },
        getMove: () => {

        },
        render: (canvas) => {
            let ctx = canvas[0].getContext("2d");

            let x = position.x;
            let y = position.y;

            ctx.fillStyle = "red";
            ctx.fillRect(x, y, 10, 10);
        }
    };
}

function createTrack(el) {
    function renderBlock(ctx, offsetColumn, offsetRow, blockSize, color) {
        // для отложенного рендеринга
        setTimeout(() => {
            ctx.fillStyle = color;
            ctx.fillRect(offsetColumn, offsetRow, blockSize, blockSize)
        });
    }

    function render(config){
        // canvas
        let canvas = $('<canvas>');
        let ctx = canvas[0].getContext("2d");

        canvas[0].width = config.areaSize.width;
        canvas[0].height = config.areaSize.height;

        ctx.fillStyle = "#e6e6e6";
        // ctx.fillStyle = "#bfbfbf";
        ctx.fillRect(0, 0, config.areaSize.width, config.areaSize.height);

        if (config.blockSize > 0) {
            let columns = parseInt(config.areaSize.width/config.blockSize);
            let rows = parseInt(config.areaSize.height/config.blockSize);
            let color = "#bfbfbf";
            for (let column = 0; column < columns; ++column) {
                for (let row = 0; row < rows; ++row) {
                    if (column%2 === row%2) {
                        continue;
                    }
                    renderBlock(ctx, column * config.blockSize, row * config.blockSize, config.blockSize, color);
                }
            }
        }

        return canvas;
    }
    let objects = {};


    let config = {
        areaSize: {
            width: 1000,
            height: 400
        },
        blockSize: 50,
    };
    let canvas = render(config);
    canvas.appendTo(el);

    setInterval(() => {
        for (let i in objects) {
            let position = objects[i].getPosition();
            let move = objects[i].getMove();

            // позиция расчитывается в зави
        }


        renderPoint({
            position: {
                x: 20,
                y: 35
            },
        }, canvas);
    }, 1);

    // function onMove(obj)
    // {
    //     let x = 100;
    //     let y = 20;
    //     let angle = 0;
    //     obj.setPosition(x, y, angle);
    // }

    return {
        objects: objects,
    };
}

function initCarControl(car) {
    // определить нажатие и отжатие клавиши
    // если клавиша уже нажата, то повторное нажатие не обрабатывать
    // положение удерживается до действия, интвертирующее другое действие

    let keyMap = {
        w: 'forward',
        a: 'left',
        s: 'right',
        d: 'back',
    };

    let actionStatus = {
        forward: 0,
        left: 0,
        right: 0,
        back: 0,
    };

    $(document).on('keydown', (event) => {
        let key = event.key;
        if (keyMap[key] === undefined) {
            return;
        }
        let action = keyMap[key];

        if (actionStatus[action] === 1
        ) {
            return;
        }

        actionStatus[action] = 1;
    });

    $(document).on('keyup', (event) => {
        let key = event.key;
        if (keyMap[key] === undefined) {
            return;
        }
        let action = keyMap[key];

        if (actionStatus[action] === 0
        ) {
            return;
        }

        actionStatus[action] = 0;
    });

    return actionStatus;
}