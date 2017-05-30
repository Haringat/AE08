declare global {
    interface Array<T> {
        mapAsync<R, S>(callback: (this: S, item?: T, index?: number, array?: this) => Promise<R>, thisArg?: S): Promise<Array<R>>;
    }
}

Array.prototype.mapAsync = async function<T, R, S> (callback: (item: T, index: number, array: Array<T>) => Promise<R>, thisArg?: S) {
    return await Promise.all(this.map( async (item, index, array) => {
        return await callback.call(thisArg, item, index, array);
    }));
};

export {};
