export default function collisionProto() {
    // intersection
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
            ['start', [50, 50]],
            ['line', [150, 50]],
            ['line', [150, 150]],
            ['line', [50, 150]],
        ],
    };

    let ctx = document.getElementById('canvas').getContext('2d');

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    for (let i in c.path) {
        if (!c.path.hasOwnProperty(i)) {
            continue;
        }
        let type = c.path[i][0];
        let x = c.path[i][1][0];
        let y = c.path[i][1][1];
        switch (type) {
            case 'start':
                ctx.moveTo(x, y);
                break;
            case 'line':
                ctx.lineTo(x, y);
                break;
            default:
                Error('invalid type');
        }
    }
    ctx.closePath();
    ctx.stroke();


    // определить пересечение:


    let coords = [

    ];





    let p = [100, 100];



};