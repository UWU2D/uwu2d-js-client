import Canvas from "../engine/canvas/Canvas";
import { Vector2D } from "../engine/math";
import { CircleSprite, PolygonSprite, Sprite } from "../engine/sprite";
import { TickRate } from "../engine/tick/TickRate";

export default class GameClient {
    public canvas: Canvas;
    public tickRate: TickRate = TickRate.THIRTYTWO;
    public exit: boolean = false;
    public nextId: number = 0;

    public sprites: Map<number, Sprite> = new Map<number, Sprite>();

    constructor(canvas: Canvas) { this.canvas = canvas; }

    public run(lastTick: number) {
        if (!this.exit) {
            let now = +new Date() / 1000;
            this.onTick(now - lastTick);
            requestAnimationFrame(() => this.run(now));
        }
    }

    public onTick(dt: number) {
        if (this.exit) return;
        this.process(dt);
        this.sprites.forEach(sprite => sprite.tick(dt));
        this.render();
    }

    // Redraws entire canvas
    public render() {
        this.canvas.clear();

        this.sprites.forEach(sprite => 
            sprite.drawable(this.canvas.context).draw(sprite));
    }

    public instantiateSprite() {
        const id = this.nextId++;
        this.sprites.set(id, new Sprite(id));
        return this.sprites.get(id);
    }

    public instantiateCircleSprite(position: Vector2D, radius: number = 0, color?: string) {
        const id = this.nextId++;
        this.sprites.set(id, new CircleSprite(id, { position, radius, color }));
        return this.sprites.get(id);
    }

    public instantiatePolygonSprite(points: Vector2D[], color?: string) {
        const id = this.nextId++;
        this.sprites.set(id, new PolygonSprite(id, { points, color }));
        return this.sprites.get(id);
    }

    public destroyAll() {
        this.sprites.clear();
    }

    public destroy(id: number) {
        this.sprites.delete(id);
    }

    public process(dt: number) {
        throw { name: 'NotImplementedError', message: 'GameClient.process is not implemented' };
    }
}