import { PolygonSprite } from '../sprite';
import Drawable from './Drawable';

export default class PolygonDrawable extends Drawable {
    public draw(sprite: PolygonSprite) {
        this.ctx.fillStyle = sprite.color;
        const reset = this.ctx.fillStyle;
        this.ctx.beginPath();
        this.ctx.moveTo(sprite.points[0].x, sprite.points[0].y);
        for(var i = 0; i < sprite.points.length; i++) {
            this.ctx.lineTo(sprite.points[i].x, sprite.points[i].y);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.fillStyle = reset;
    }
}