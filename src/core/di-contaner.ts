import { Container } from "inversify";
import { assert } from "./assert";

const container = new Container();

let isInitiated = false;

export function initDiContainer(callback: (mContainer: Container) => void) {
    assert(isInitiated === false, 'DI container is already initiated');

    callback(container);

    isInitiated = true;

    /**
     * NOTE: returning container to the first initializer as it's owner
     */
    return container;
}

export function getFromDiContainer<T>(name: string): T {
    return container.get<T>(name);
}
