// Copyright (C) LoginID

/**
 * Represents a function that resolves a promise.
 * @template T
 * @param {T | PromiseLike<T>} value - The value to resolve the promise with.
 */
export type Resolve<T> = (value: T | PromiseLike<T>) => void;

/**
 * Represents a function that rejects a promise.
 * @param {any} [reason] - The reason for rejecting the promise.
 */
export type Reject = (reason?: any) => void;

//export type ResultCallback<T, U> = (param: T) => Promise<U>;

export type Flow = "REDIRECT" | "EMBEDDED_CONTEXT";

export interface DiscoverResult {
  username?: string;
  flow: Flow;
}
