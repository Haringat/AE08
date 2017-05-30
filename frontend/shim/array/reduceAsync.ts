declare global {
    interface Array<T> {
        reduceAsync<R>(callback: (accumulator: R, currentValue?: T, currentIndex?: number, array?: this) => Promise<R>, initialValue?: R): Promise<R>;
    }
}

Array.prototype.reduceAsync = async function<T, R> (callback: (accumulator: R, currentValue?: T, currentIndex?: number, array?: Array<T>) => Promise<R>, initialValue?: R) {
    let accumulator = initialValue || this[0];
    for (let i = initialValue ? 0 : 1; i < this.length; i++) {
        accumulator = await callback(accumulator, this[i], i, this);
    }
    return accumulator;
};

export {};
