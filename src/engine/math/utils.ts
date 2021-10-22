import Vector2D from './Vector2D';

export function clamp(val: number, low: number, high: number) {
    return val < low ? low : val > high ? high : val;
}

export function rotatePoint(center: Vector2D, point: Vector2D, rotation: number): Vector2D {
    if (!rotation) return point;

    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    const rx = center.x + (cos * (point.x - center.x)) - (sin * (point.y - center.y));
    const ry = center.y + (sin * (point.x - center.x)) + (cos * (point.y - center.y));

    return new Vector2D(rx, ry);
}