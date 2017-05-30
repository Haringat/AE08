declare global {
    interface Array<T> {
        reduceRightAsync<R>(callback: (accumulator: R, currentValue?: T, currentIndex?: number, array?: this) => Promise<R>, initialValue?: R): Promise<R>;
    }
}

Array.prototype.reduceRightAsync = async function<T, R> (callback: (accumulator: R, currentValue?: T, currentIndex?: number, array?: Array<T>) => Promise<R>, initialValue?: R) {
    let array = this.reverse();
    let accumulator = initialValue || array[0];
    for (let i = initialValue ? 0 : 1; i < this.length; i++) {
        accumulator = await callback(accumulator, array[i], this.indexOf(array[i]), this);
    }
    return accumulator;
};

export {};
