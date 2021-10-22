import { Buffer } from 'buffer';

export default class WSClient {
    public host: string;
    public port: number;
    public ssl: boolean;
    public ws: WebSocket | undefined;
    public connected: boolean = false;

    private onclose: (event: CloseEvent) => any;
    private onopen: (event: Event) => any;
    private onmessage: (event: MessageEvent) => any;
    private onerror: (event: ErrorEvent) => any;

    constructor(host: string, ssl: boolean = false, port?: number) {
        this.host = host;
        this.port = port;
        this.ssl  = ssl;

        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.registerEvent('open', this.onOpen);
        this.registerEvent('close', this.onClose);
    }

    public connect() {
        if (this.connected) return;
        this.ws = new WebSocket(`ws${this.ssl ? 's' : ''}://${this.host}${this.port ? `:${this.port}` : ''}`);
        this.ws.onopen = this.onopen || this.ws.onopen;
        this.ws.onclose = this.onclose || this.ws.onclose;
        this.ws.onerror = this.onerror || this.ws.onerror;
        this.ws.onmessage = this.onmessage || this.ws.onmessage;
    }

    public registerEvent(type: string, callback: (event: Event) => any) {
        if (this.connected) {
            throw { name: 'WSClientAlreadyConnectedError', message: 'Cannot register callbacks after WSClient is already connected.' }
        }
        switch (type) {
            case 'close': {
                this.onclose = this.stackCallbacks<CloseEvent>(this.onclose, callback);
                return;
            }
            case 'open': {
                this.onopen = this.stackCallbacks<Event>(this.onopen, callback);;
                return;
            }
            case 'error': {
                this.onerror = this.stackCallbacks<ErrorEvent>(this.onerror, callback);;
                return;
            }
            case 'message': {
                this.onmessage = this.stackCallbacks<MessageEvent>(this.onmessage, callback);;
                return;
            }
        }
    }

    private stackCallbacks<T>(prev: ((event: T) => any), next: (event: T) => any) {
        if (prev) {
            return (event: T) => {
                prev(event);
                next(event);
            }
        }
        return next;
    }

    // todo - make message type
    public send(message: object) {
        const bufferMessage = Buffer.from(JSON.stringify(message));
        this.ws.send(bufferMessage);
    }

    private onOpen() {
        this.connected = true;
    }

    private onClose() {
        this.connected = false;
        if (this.ws) {
            this.ws.close();
            this.ws = undefined;
            this.connect();
        }
    }

}