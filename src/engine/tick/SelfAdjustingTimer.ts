import { TickRate } from "./TickRate";

export default class SelfAdjustingTimer {

    private callback: Function;
    private isRunning: boolean = false;
    private interval: number;
    private tickRate: number = TickRate.THIRTYTWO;
    private expectedTime: number;
    private timeoutId: NodeJS.Timeout;
    private last: number = Date.now();

    public constructor(callback: Function, tickRate?: TickRate) {
        this.callback = callback;
        this.tickRate = tickRate ?? this.tickRate;
        this.interval = 1024 / tickRate;
    }
    public start() {
        this.isRunning = true;
        this.expectedTime = Date.now() + this.interval;
        this.timeoutId = setTimeout(() => { this.step() }, this.interval);
    }

    public stop() {
        this.isRunning = false;
        clearTimeout(this.timeoutId)
    }

    private step() {
        if (!this.isRunning) return;

        const currentTime = Date.now();
        var dt = currentTime - this.expectedTime; // the drift (positive for overshooting)
        if (dt > this.interval) {
            console.log(`Warning: client is ${dt / this.interval} ticks behind!`)
            if (dt / this.interval > 10) {
                console.log(`Warning: client was catastrophically behind, resetting time expectations in an attempt to recover.`)
                this.expectedTime = currentTime;
            }
        }
        const delta = currentTime - this.last;
        // trigger the callback to the server loop
        this.callback(delta);
        const tickLength = Date.now() - currentTime
        this.last = currentTime;
        this.expectedTime += this.interval;
        setTimeout(() => { this.step() }, Math.max(0, this.interval - dt - tickLength)); // take into account drift
    }
}