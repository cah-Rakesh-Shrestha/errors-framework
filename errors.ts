import {
    ConnectionType,
    consoleTextColor,
    ErrorConfig,
    ErrorType,
    IBaseError,
} from "./error-entities";

/**
 * Base class for system errors.
 * Do not use this class directly, but rather use one of the derived (specialized) error classes.
 *
 * For example:
 *      fetch('https://someapi.com/user/13321).catch(e => new APICallError('SomeAPI', 'User by Id', e));
 *
 */
export abstract class BaseError extends Error implements IBaseError {
    readonly type: ErrorType;
    readonly details?: any;
    readonly errorRef: string;
    readonly debugInfo?: any;

    get headline() {
        return "";
    }

    protected static detailToString(detail: any): string {
        if (Array.isArray(detail)) {
            return detail.map((d) => this.detailToString(d)).join(" & ");
        } else if (detail instanceof UnhandledRejection) {
            return `${detail.toString()}`;
        } else if (detail instanceof BaseError) {
            return detail.toString();
        } else if (detail instanceof Error) {
            return detail.stack ? detail.stack : detail.toString();
        } else if (detail === Object(detail)) {
            return Object.keys(detail)
                .map((k) => {
                    return `${k}: ${this.detailToString(detail[k])}`;
                })
                .join(", ");
        } else {
            return detail ? detail.toString() : "";
        }
    }

    toString() {
        return BaseError.toString(this);
    }

    static toString(e: IBaseError) {
        if (e.headline || e.details || e.debugInfo) {
            let returnString = e.headline || "";
            returnString += e.details
                ? `\n${this.detailToString(e.details)}`[
                      consoleTextColor.details as any
                  ]
                : "";
            returnString +=
                e.debugInfo && BaseError.addDebugInfoToMessage
                    ? `\n${this.detailToString(e.debugInfo)}\n`[
                          consoleTextColor.debugInfo as any
                      ]
                    : "";
            return returnString;
        } else if (e.constructor.name) {
            return e.constructor.name;
        } else {
            return e.toString();
        }
    }

    static generateRef() {
        let ref = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 0; i < 3; i++)
            ref += possible.charAt(Math.floor(Math.random() * possible.length));

        for (var i = 0; i < 3; i++) ref += Math.floor(Math.random() * 9);

        return ref;
    }

    static addDetailsToMessage: boolean;

    static addDebugInfoToMessage: boolean = false;

    constructor(type: ErrorType, details?: any, debugInfo?: any) {
        if (BaseError.addDetailsToMessage && details) {
            super(`[${type}] ${details}`);
        } else {
            super(type);
        }

        this.type = type;
        this.details = details;
        this.debugInfo = debugInfo;
        this.errorRef = BaseError.generateRef();
    }
}

/**
 * Throw instances of this class to indicate that an error occurred during a call to an external process or API.
 */
export class ConnectionError extends BaseError {
    readonly connectionType: ConnectionType;

    get headline() {
        return `Could not establish ${this.connectionType} connection`;
    }

    constructor(
        connectionType: ConnectionType,
        details?: any,
        debugInfo?: any
    ) {
        super(ErrorType.connection, details, debugInfo);
        Object.setPrototypeOf(this, ConnectionError.prototype);

        this.connectionType = connectionType;
    }
}

/**
 * Throw instances of this class to indicate error arising from a failed operation in the running process.
 */
export class OpError extends BaseError {
    readonly opName: string;
    readonly componentName: string;

    /**
     *
     * @param componentName Name of logical module, class or component that defines the failed operation
     * @param opName Name of the function that included the failed operation
     * @param details
     */
    constructor(
        componentName: string,
        opName: string,
        details?: any,
        debugInfo?: any
    ) {
        super(ErrorType.operation as any, details, debugInfo);
        Object.setPrototypeOf(this, OpError.prototype);

        this.opName = opName;
        this.componentName = componentName;
    }

    get headline() {
        return `Internal operation "${this.componentName}.${this.opName}()" failed`;
    }
}

/**
 * Throw instances of this class to indicate error occured in service.
 */

export class ServiceError<N, C> extends BaseError {
    readonly errorConfig: ErrorConfig<N, C>;

    constructor(errorConfig: ErrorConfig<N, C>, debugInfo?: any,opName?: string, details?: string) {

        errorConfig.message = errorConfig.message.replace("{operation}",opName || '');
        errorConfig.message = errorConfig.message.replace("{details}",details || '');

        super(ErrorType.service, errorConfig, debugInfo);
        Object.setPrototypeOf(this, ServiceError.prototype);
        this.errorConfig = errorConfig;
    }

    get headline() {
        return `Service error: "${this.errorConfig.message}`;
    }
}

/**
 * Used by framework to signal that an error occured in a promise and was not handled anywhere
 */
export class UnhandledRejection extends BaseError {
    constructor(promise: Promise<any>, error: any) {
        super(ErrorType.unhandledRejection, error);
        Object.setPrototypeOf(this, UnhandledRejection.prototype);
    }

    get headline() {
        return `Unhandled error occured in a promise`;
    }
}

/**
 * Used by framework to signal that an exception was thrown but never handled
 */
export class UncaughtException extends BaseError {
    constructor(error: any) {
        super(ErrorType.uncaughtException, error);
        Object.setPrototypeOf(this, UncaughtException.prototype);
    }

    get headline() {
        return `Uncaught exception`;
    }
}
