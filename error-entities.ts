/**
 * Possible error types.
 */
export enum ErrorType {
    connection = "connection",
    operation = "operation",
    service = "service",
    uncaughtException = "uncaughtException",
    unhandledRejection = "unhandledRejection",
}

/**
 * Used in conjunction with ConnectionError class to indicate what type of connection failure occurred.
 */
export enum ConnectionType {
    lan = "local area network",
    internet = "internet",
    remoteProcess = "remote process",
    db = "database",
}

export const consoleTextColor = {
    error: "red",
    details: "cyan",
    debugInfo: "green",
};

/**
 * Interface for system errors.
 */
export interface IBaseError {
    /**
     * Principal error message.
     */
    readonly headline: string;

    /**
     * Details of the error.  Typically the original exception.
     */
    readonly details?: any;

    /**
     * Refernce number of the error instance (not the error type!).
     */
    readonly errorRef: string;

    /**
     * The type of error
     */
    readonly type: ErrorType;

    /**
     * Error stack
     */
    readonly stack?: any;

    /**
     * Extended details of the error to aid debugging process.
     * -- NOTE --
     * This is where you may capture ePHI or other sensitive data.
     * Output of this prop in Production must be disabled to comply with ePHI requirements.
     */
    readonly debugInfo?: any;
}

export type ErrorConfig<N, C> = {
    category: C;
    code: number;
    httpResponseCode: number;
    message: string;
    name: N;
};
