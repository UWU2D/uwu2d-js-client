import Sprite from './Sprite';
import { Color } from '../canvas';
import { Vector2D } from '../math';
import { PolygonDrawable } from '../drawable';

type PolygonSpriteData = {
    points: Vector2D[];
    color: string;
};

export default class PolygonSprite extends Sprite {
    public points: Vector2D[];
    public color: string;

    constructor(id: number, data?: PolygonSpriteData) {
        super(id);

        if (!data.color) data.color = Color.red;
        if (!data.points) data.points = [];

        this.points = data.points;
        this.color  = data.color;
    }

    public tick(dt: number) {
        super.tick(dt);

        this.points = this.points.map(point => new Vector2D(
            point.x + this.vx * dt,
            point.y + this.vy * dt
        ));
    }

    public sync(info: any) {
        super.sync(info);

        if (Object.keys(info['data']).includes('points')) {
            this.points = info['data']['points'].map(
                (point: any) => new Vector2D(point['x'], point['y']));
        }
    }

    public drawable(ctx: CanvasRenderingContext2D): PolygonDrawable {
        if (!this._drawable) {
            this._drawable = new PolygonDrawable(ctx);
        }
        return this._drawable;
    }
}