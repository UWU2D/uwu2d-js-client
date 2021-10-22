import { Sprite } from "../sprite";

export default class Drawable {
    public ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }
    public draw(sprite: Sprite) {
        throw { name : "NotImplementedError", message : "Drawable draw() method not implemented." }; 
    }
}