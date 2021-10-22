import { Color } from '../canvas';
import { Drawable } from '../drawable';

export default class Sprite {
    public id: number;
    public color: string = Color.magenta;
    protected _drawable: Drawable | undefined = undefined;
    public vx = 0;
    public vy = 0;

    constructor(id: number) {
        this.id = id;
    }
    
    public tick(dt: number): void {
        return;
    }

    public sync(info: any) {
        const data = info['data'];
        if (Object.keys(data).includes('rgba')) {
            const rgba = data['rgba'];
            this.color = `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`
        }
        if (Object.keys(data).includes('xVelocity')) {
            this.vx = data['xVelocity'];
        }
        if (Object.keys(data).includes('yVelocity')) {
            this.vx = data['yVelocity'];
        }
    }

    public drawable(ctx: CanvasRenderingContext2D): Drawable {
        if (!this._drawable) {
            this._drawable = new Drawable(ctx);
        }
        return this._drawable;
    }
}