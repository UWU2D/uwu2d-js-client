import { Canvas } from '../canvas';
import NetworkGameClient from '../../client/NetworkGameClient';
import Queue from './Queue';

type EventUnion = Event | KeyboardEvent | MouseEvent;
type EventCallback = (event: EventUnion) => void;
type RegisteredEvent = { unique: boolean, callbacks: EventCallback[] };
export default class InputService {
    public canvas: Canvas;
    public client: NetworkGameClient;

    public registeredEvents: Map<string, RegisteredEvent> = new Map<string, RegisteredEvent>();
    public registeredKeys: number[] = [];
    public pressedKeys: number[] = [];
    public eventQueue: Queue<Event> = new Queue<Event>();

    constructor(client: NetworkGameClient, canvas: Canvas) {
        this.canvas = canvas;
        this.client = client;

        window.addEventListener('mousemove', this.handleEvent.bind(this));
        window.addEventListener('keydown', this.handleKeyEvent.bind(this));
        window.addEventListener('keyup', this.handleKeyEvent.bind(this));
        window.addEventListener('mousedown', this.handleEvent.bind(this));
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
        if (!this.registeredKeys.includes(event.keyCode)) return;
        const index = this.pressedKeys.indexOf(event.keyCode);
        switch (event.type) {
            case 'keydown': {
                if (index === -1) {
                    this.handleEvent(event);
                    this.pressedKeys.push(event.keyCode);
                }
                return;
            }
            case 'keyup': {
                if (index > -1) {
                    this.handleEvent(event);
                    this.pressedKeys = this.pressedKeys.filter(key => event.keyCode !== key);
                }
                return;
            }
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

    public registerEvent(name: 'mousemove' | 'keyup' | 'keydown' | 'mousedown', callback: EventCallback, unique: boolean = false) {
        if (this.registeredEvents.get(name)?.callbacks.length > 0) {
            this.registeredEvents.get(name).callbacks.push(callback);
        } else {
            this.registeredEvents.set(name, { unique, callbacks: [callback]});
        }
    }

    public getCanvasMousePos(event: MouseEvent) {
        const rect = this.canvas.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
}