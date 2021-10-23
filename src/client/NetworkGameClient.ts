import Canvas from "../engine/canvas/Canvas";
import InputService from "../engine/input/InputService";
import { CircleSprite, PolygonSprite } from "../engine/sprite";
import SelfAdjustingTimer from '../engine/tick/SelfAdjustingTimer';
import GameClient from "./GameClient";
import WSClient from "./WSClient";
import ClientConfig from './ClientConfig';

export default class NetworkGameClient extends GameClient {
    public wsClient: WSClient;
    public shouldHandshake: boolean = true;
    public clientId: string = '';
    public inputService: InputService;
    public timer: SelfAdjustingTimer;
    public config: ClientConfig;

    constructor(host: string, canvas: Canvas, ssl: boolean = false, port?: number) {
        super(canvas);
        this.wsClient = new WSClient(host, ssl, port);
        this.wsClient.registerEvent('open', (event: Event) => this.onOpen(event));
        this.wsClient.registerEvent('close', (event: Event) => this.onClose(event));
        this.wsClient.registerEvent('message', (event: MessageEvent) => this.onMessage(event));
        this.wsClient.connect();

        this.inputService = new InputService(this, canvas);
        this.timer = new SelfAdjustingTimer((delta: number) => {
            this.inputService.tick(delta);
        }, this.tickRate);
    }

    public onTick(dt: number) {
        super.onTick(dt);
    }
    
    public onOpen(event: Event) {
        // this.heartbeatTimer.reset()
        this.run(+new Date());
        this.timer.start();
    }

    public onClose(event: Event) {
        this.destroyAll();
        this.clientId = '';
        this.timer.stop();
        this.inputService.reset();
    }

    public onHandshake(data: any) {
        if (this.clientId) {
            console.log('got second client id');
            return;
        }
        
        this.config = data['data']['config'];
        this.clientId = data['data']['id'];
        this.shouldHandshake = false;
        this.canvas.height = this.config.area.y;
        this.canvas.width = this.config.area.x;
        this.inputService.configure(this.config, (data: any) => this.sendGameMessage(data));
    }

    public onState(data: any) {}
    public onGame(data: any) {
        this.syncEntities(data['data']);
    }

    public onHeartbeat(data: any) {
        console.log('hb', data);
        // this.sendHeartbeat();
    }

    public async onMessage(event: MessageEvent) {
        const data: any = JSON.parse(await event.data.text());
        const type: string = data['type'];
        
        switch (type) {
            case 'handshake': {
                this.onHandshake(data);
                return
            }
            case 'heartbeat': {
                this.onHeartbeat(data);
                return
            }
            case 'state': {
                this.onState(data);
                return
            }
            case 'game': {
                this.onGame(data);
                return
            }
        }
    }

    public process(dt: number) {
        if (this.shouldHandshake) this.sendHandshake();
    }

    public sendHeartbeat() { this.sendMessage('heartbeat', {}); }
    public sendHandshake() {}

    public sendMessage(type: string, data: any) {
        if (!this.clientId) {
            throw { name: 'WSMessageSendError', message: 'No clientId found' };
        }

        this.wsClient.send({
            type,
            data,
            messageId: generateUUID(),
            clientId: this.clientId
        });
    }

    public sendGameMessage(data: any) { this.sendMessage('game', data); }

    // TODO - game objects type
    public syncEntities(gameObjects: any[]) { gameObjects.map(obj => this.syncEntity(obj)); }

    public syncEntity(gameObject: any) {
        const id = gameObject['id'];
        const type = gameObject['data']['shape'];

        if (!this.sprites.has(id)) {
            switch (type) {
                case 'circle':  {
                    this.sprites.set(id, new CircleSprite(id, gameObject['data']));
                    break;
                }
                case 'polygon': {
                    this.sprites.set(id, new PolygonSprite(id, gameObject['data']));
                    break;
                }
                default: {
                    console.info('received unknown sprite type', type);
                }
            }
        }

        if (gameObject['state'] === 'deleted') {
            this.destroy(id);
        } else {
            this.sprites.get(id).sync(gameObject);
        }
    }
}

const generateUUID = () => {
    let
      d = new Date().getTime(),
      d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
  };