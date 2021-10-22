import { CircleSprite } from '../sprite';
import Drawable from './Drawable';

export default class CircleDrawable extends Drawable {
    public draw(sprite: CircleSprite) {
        const reset = this.ctx.fillStyle;
        this.ctx.fillStyle = sprite.color;
        this.ctx.beginPath();
        this.ctx.arc(sprite.position.x, sprite.position.y, sprite.radius, 0, 360);
        this.ctx.fill();
        this.ctx.fillStyle = reset;
    }
}