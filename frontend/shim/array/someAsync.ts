declare global {
    interface Array<T> {
        someAsync<S>(callback: (this: S, item?: T, index?: number, array?: this) => Promise<boolean>, thisArg?: S): Promise<boolean>;
    }
}

Array.prototype.everyAsync = async function<T, S> (callback: (item: T, index: number, array: Array<T>) => Promise<boolean>, thisArg?: S) {
    let values = await Promise.all<boolean>(this.map(async (item, index, array) => {
        return await callback.call(thisArg, item, index, array);
    }));
    return values.some((item) => item);
};

export {};
