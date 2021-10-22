export default class Vector2D {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public add(other: Vector2D): Vector2D {
        return new Vector2D(this.x + other.x, this.y + other.y);
    }

    public sub(other: Vector2D): Vector2D {
        return new Vector2D(this.x - other.x, this.y + other.y);
    }

    public multiply(scalar: number): Vector2D {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }

    public dot(other: Vector2D): number {
        return this.x * other.x + this.y * other.y;
    }

    get rotationAngle(): number {
        return Math.atan2(this.y, this.x);
    }

    get rotationAngleDegrees(): number {
        return this.rotationAngle * (180 / Math.PI);
    }
}