import { keyCode } from './KeyCode';

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

const keyDownEvent = (event: KeyboardEvent): KeyPressEvent => ({
        type: 'keyPress', key: keyCode(event.keyCode), pressed: true
});

const keyUpEvent = (event: KeyboardEvent): KeyPressEvent => ({
    type: 'keyPress', key: keyCode(event.keyCode), pressed: false
});

const mouseMoveEvent = (event: MouseEvent, canvasPos: any): MouseMoveEvent => ({ 
    type: 'mouse', x: canvasPos.x, y: canvasPos.y
});

const mouseClickEvent = (event: MouseEvent, canvasPos: any): MouseClickEvent => ({ 
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