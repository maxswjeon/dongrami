export interface Assembly {
    name: string;
    data: Uint8Array | string;
}
export interface BootData {
    wasm: Uint8Array | string;
    assemblies: Assembly[];
    entryAssemblyName: string;
}
export declare enum BootStatus {
    Standby = "Standby",
    Booting = "Booting",
    Terminating = "Terminating",
    Booted = "Booted"
}
export declare function getBootStatus(): BootStatus;
export declare function boot(): Promise<void>;
export declare function terminate(): Promise<void>;
export declare const invoke: <T>(assembly: string, method: string, ...args: any[]) => T;
export declare const invokeAsync: <T>(assembly: string, method: string, ...args: any[]) => Promise<T>;
export declare const createObjectReference: (object: any) => any;
export declare const disposeObjectReference: (objectReference: any) => void;
export declare const createStreamReference: (buffer: Uint8Array | any) => any;
export declare class Event<T extends any[]> implements EventBroadcaster<T>, EventSubscriber<T> {
    private readonly handlers;
    private readonly warn;
    private lastArgs;
    constructor(warn?: ((message: string) => void) | null);
    broadcast(...args: [...T]): void;
    subscribe(handler: (...args: [...T]) => void): string;
    unsubscribe(handler: (...args: [...T]) => void): void;
    subscribeById(id: string, handler: (...args: [...T]) => void): void;
    unsubscribeById(id: string): void;
    getLast(): T | undefined;
    private getOrDefineId;
}
export interface EventBroadcaster<T extends any[]> {
    broadcast: (...args: [...T]) => void;
}
export interface EventSubscriber<T extends any[]> {
    subscribe: (handler: (...args: [...T]) => void) => string;
    unsubscribe: (handler: (...args: [...T]) => void) => void;
    getLast: () => T | undefined;
}
export namespace Lib9c.Wasm {
    export function getAllActionTypes(): Array<string>;
    export function getAvailableInputs(actionTypeString: string): string;
    export function buildAction(actionTypeString: string, dictionary: any): Uint8Array;
    export function buildRawTransaction(nonce: number, publicKey: Uint8Array, address: Uint8Array, genesisHash: Uint8Array, action: Uint8Array): Uint8Array;
    export function attachSignature(unsignedTransaction: Uint8Array, signature: Uint8Array): Uint8Array;
    export function listAllStates(): Array<string>;
    export function deserializeState(typeFullName: string, bytes: Uint8Array): any;
    export function getStateJSType(typeFullName: string): string;
}
