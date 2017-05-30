declare global {
    interface Array<T> {
        forEachAsync<S>(callback: (this: S, item?: T, index?: number, array?: this) => Promise<void>, thisArg?: S): Promise<void>;
    }
}

Array.prototype.forEachAsync = async function<T,S> (callback: (item?: T, index?: number, array?: Array<T>) => Promise<void>, thisArg?: S) {
    await Promise.all(this.map( async (item, index, array) => {
        await callback.call(thisArg, item, index, array);
    }));
};

export {};
