import Sprite from './Sprite';
import { Color } from '../canvas';
import { Vector2D } from '../math';
import { CircleDrawable } from '../drawable';

type CircleSpriteData = {
    position?: Vector2D,
    radius: number,
    color: string,
};

export default class CircleSprite extends Sprite {
    public position: Vector2D;
    public radius: number;

    constructor(id: number, data?: CircleSpriteData) {
        super(id);

        if (!data.position) data.position = new Vector2D(0, 0);
        if (!data.color) data.color = Color.red;
        if (!data.radius) data.radius = 1;

        this.color = data.color;
        this.radius = data.radius;
        this.position = data.position;
    }
    
    public tick(dt: number): void {
        super.tick(dt);

        this.position.x += this.vx * dt;
        this.position.y += this.vy * dt;
    }

    public sync(info: any) {
        super.sync(info);

        this.radius = info["data"]["radius"];
        this.position.x = info["x"];
        this.position.y = info["y"];
    }

    public drawable(ctx: CanvasRenderingContext2D): CircleDrawable {
        if (!this._drawable) {
            this._drawable = new CircleDrawable(ctx);
        }
        return this._drawable;
    }
}