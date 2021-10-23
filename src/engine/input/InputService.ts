import Queue from './Queue';
import { Canvas } from '../canvas';
import ClientConfig from '../../client/ClientConfig';
import NetworkGameClient from '../../client/NetworkGameClient';
import { keyDownEvent, keyUpEvent, mouseMoveEvent, mouseClickEvent, KeyPressEvent } from "../../engine/input/InputEvent";

type EventUnion = Event | KeyboardEvent | MouseEvent;
type EventCallback = (event: EventUnion) => void;
type RegisteredEvent = { unique: boolean, callbacks: EventCallback[] };
export default class InputService {
    public canvas: Canvas;
    public client: NetworkGameClient;

    public registeredEvents: Map<string, RegisteredEvent> = new Map<string, RegisteredEvent>();
    public eventQueue: Queue<Event> = new Queue<Event>();
    public keyMap: Map<string, string>;
    public pressedKeys: string[] = [];

    constructor(client: NetworkGameClient, canvas: Canvas) {
        this.canvas = canvas;
        this.client = client;
    }

    public configure(config: ClientConfig, sendMessage: (data: any) => void) {
        if (config.input) {
            config.input.types.map(type => {
                switch (type) {
                    case 'keyPress': {
                        window.addEventListener('keydown', this.handleKeyEvent.bind(this));
                        window.addEventListener('keyup', this.handleKeyEvent.bind(this));
                        this.registerEvent('keydown', (event: KeyboardEvent) => sendMessage(this.parseKeyEvent(event.key, keyDownEvent)));
                        this.registerEvent('keyup', (event: KeyboardEvent) => sendMessage(this.parseKeyEvent(event.key, keyUpEvent)));
                        break;
                    }
                    case 'mouse': {
                        window.addEventListener('mousemove', this.handleEvent.bind(this));
                        this.registerEvent('mousemove', (event: MouseEvent) => sendMessage(mouseMoveEvent(this.getCanvasMousePos(event))), true);
                        break;
                    }
                    case 'click': {
                        window.addEventListener('mousedown', this.handleEvent.bind(this));
                        this.registerEvent('mousedown', (event: MouseEvent) => sendMessage(mouseClickEvent(this.getCanvasMousePos(event))));
                        break;
                    }
                }
            });
            this.keyMap = new Map<string, string>(config.input.keyMappings);
        }
    }

    public tick(delta: number) {
        if (!this.client.wsClient.connected) return;
        while (!this.eventQueue.isEmpty()) {
            const currEvent = this.eventQueue.pop();
            if (this.registeredEvents.has(currEvent.type)) {
                this.registeredEvents.get(currEvent.type).callbacks.map(callback => callback(currEvent));
            }
        }
    }

    public reset() {
        window.removeEventListener('mousemove', this.handleEvent.bind(this));
        window.removeEventListener('keydown', this.handleKeyEvent.bind(this));
        window.removeEventListener('keyup', this.handleKeyEvent.bind(this));
        window.removeEventListener('mousedown', this.handleEvent.bind(this));
        this.registeredEvents = new Map<string, RegisteredEvent>();
        this.keyMap = undefined;
        this.pressedKeys = [];
    }

    public handleEvent(event: EventUnion) {
        event.preventDefault();
        if (this.registeredEvents.has(event.type)) {
            const registeredEvent = this.registeredEvents.get(event.type);
            if (registeredEvent.unique) {
                this.eventQueue.pushUnique(event.type, event);
            } else {
                this.eventQueue.push(event.type, event);
            }
        }
    }

    public handleKeyEvent(event: KeyboardEvent) {
        if (!this.keyMap?.has(event.key)) return;
        const index = this.pressedKeys.indexOf(event.key);
        switch (event.type) {
            case 'keydown': {
                if (index === -1) {
                    this.handleEvent(event);
                    this.pressedKeys.push(event.key);
                }
                return;
            }
            case 'keyup': {
                if (index > -1) {
                    this.handleEvent(event);
                    this.pressedKeys = this.pressedKeys.filter(key => event.key !== key);
                }
                return;
            }
        }
    }

    public registerEvent(name: 'mousemove' | 'keyup' | 'keydown' | 'mousedown', callback: EventCallback, unique: boolean = false) {
        if (this.registeredEvents.get(name)?.callbacks.length > 0) {
            this.registeredEvents.get(name).callbacks.push(callback);
        } else {
            this.registeredEvents.set(name, { unique, callbacks: [callback]});
        }
    }

    public parseKeyEvent(key: string, callback: (mappedKey: string) => KeyPressEvent) {
        if (!this.keyMap.has(key)) return;
        return callback(this.keyMap.get(key));
    }

    public getCanvasMousePos(event: MouseEvent) {
        const rect = this.canvas.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
}