type KeyPressEvent = {
    type: 'keyPress',
    key: string,
    pressed: boolean
};

type MouseMoveEvent = {
    type: 'mouse',
    x: number,
    y: number
};

type MouseClickEvent = {
    type: 'click',
    x: number,
    y: number,
    pressed: boolean
};

type EventUnion = KeyPressEvent | MouseMoveEvent | MouseClickEvent;

const keyDownEvent = (key: string): KeyPressEvent => ({
        type: 'keyPress', key, pressed: true
});

const keyUpEvent = (key: string): KeyPressEvent => ({
    type: 'keyPress', key, pressed: false
});

const mouseMoveEvent = (canvasPos: any): MouseMoveEvent => ({ 
    type: 'mouse', x: canvasPos.x, y: canvasPos.y
});

const mouseClickEvent = (canvasPos: any): MouseClickEvent => ({ 
    type: 'click', x: canvasPos.x, y: canvasPos.y, pressed: true
});

export {
    keyDownEvent,
    keyUpEvent,
    mouseMoveEvent,
    mouseClickEvent,
    EventUnion,
    KeyPressEvent,
    MouseMoveEvent,
    MouseClickEvent
};