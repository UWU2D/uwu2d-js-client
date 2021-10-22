export default class Canvas {
    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;

    constructor() {
        this.canvas = document.getElementById('uwudp4-canvas') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    public create(height: number, width: number) {
        this.height = height;
        this.width  = width;

        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, width, height);
        this.context.save();
    }

    public clear() {
        const restore = this.context.fillStyle;
        this.context.fillStyle = 'black';
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.fillStyle = restore;
    }

    get width(): number { return this.canvas.width; }
    set width(w: number) { this.canvas.width = w; }
    get height(): number { return this.canvas.width; }
    set height(h: number) { this.canvas.height = h; }
}