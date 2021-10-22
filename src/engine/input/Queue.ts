export default class Queue<T> {
    public q: { key: string, value: T}[] = [];
    constructor() {}

    public push(key: string, value: T) {
        this.q.push({ key, value});
    }

    public pushUnique(key: string, value: T, comp?: (item: T) => boolean) {
        if (comp) {
            this.q = this.q.filter(item => comp(item.value));
        } else {
            this.q = this.q.filter(item => item.key !== key);
        }
        this.push(key, value);
    }

    public pop(): T {
        if (this.isEmpty()) return undefined;
        return this.q.shift().value;
    }

    public isEmpty() {
        return this.q.length === 0;
    }
}