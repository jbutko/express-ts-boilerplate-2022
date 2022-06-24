export type TFnNoop = () => void | (() => void | undefined);
export type TFnWithArgs<RetType = void, ArgsType = any> = (...args: ArgsType[]) => RetType;
export type TFnWithArgsPromise<RetType = any> = (...args: any[]) => Promise<RetType>;
export type TFnWithCallback = (cb: (...args: any[]) => void) => void;
export type TErrorGeneric = string | Error;
export type TObject = Record<string, unknown>;
export type TNullable<T> = T | null;
export type TDate = Date | number | string;
