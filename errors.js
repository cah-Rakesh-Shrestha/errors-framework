"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UncaughtException = exports.UnhandledRejection = exports.ServiceError = exports.OpError = exports.ConnectionError = exports.BaseError = void 0;
const error_entities_1 = require("./error-entities");
/**
 * Base class for system errors.
 * Do not use this class directly, but rather use one of the derived (specialized) error classes.
 *
 * For example:
 *      fetch('https://someapi.com/user/13321).catch(e => new APICallError('SomeAPI', 'User by Id', e));
 *
 */
class BaseError extends Error {
    constructor(type, details, debugInfo) {
        if (BaseError.addDetailsToMessage && details) {
            super(`[${type}] ${details}`);
        }
        else {
            super(type);
        }
        this.type = type;
        this.details = details;
        this.debugInfo = debugInfo;
        this.errorRef = BaseError.generateRef();
    }
    get headline() {
        return "";
    }
    static detailToString(detail) {
        if (Array.isArray(detail)) {
            return detail.map((d) => this.detailToString(d)).join(" & ");
        }
        else if (detail instanceof UnhandledRejection) {
            return `${detail.toString()}`;
        }
        else if (detail instanceof BaseError) {
            return detail.toString();
        }
        else if (detail instanceof Error) {
            return detail.stack ? detail.stack : detail.toString();
        }
        else if (detail === Object(detail)) {
            return Object.keys(detail)
                .map((k) => {
                    return `${k}: ${this.detailToString(detail[k])}`;
                })
                .join(", ");
        }
        else {
            return detail ? detail.toString() : "";
        }
    }
    toString() {
        return BaseError.toString(this);
    }
    static toString(e) {
        if (e.headline || e.details || e.debugInfo) {
            let returnString = e.headline || "";
            returnString += e.details
                ? `\n${this.detailToString(e.details)}`[error_entities_1.consoleTextColor.details]
                : "";
            returnString +=
                e.debugInfo && BaseError.addDebugInfoToMessage
                    ? `\n${this.detailToString(e.debugInfo)}\n`[error_entities_1.consoleTextColor.debugInfo]
                    : "";
            return returnString;
        }
        else if (e.constructor.name) {
            return e.constructor.name;
        }
        else {
            return e.toString();
        }
    }
    static generateRef() {
        let ref = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var i = 0; i < 3; i++)
            ref += possible.charAt(Math.floor(Math.random() * possible.length));
        for (var i = 0; i < 3; i++)
            ref += Math.floor(Math.random() * 9);
        return ref;
    }
}
exports.BaseError = BaseError;
BaseError.addDebugInfoToMessage = false;
/**
 * Throw instances of this class to indicate that an error occurred during a call to an external process or API.
 */
class ConnectionError extends BaseError {
    constructor(connectionType, details, debugInfo) {
        super(error_entities_1.ErrorType.connection, details, debugInfo);
        Object.setPrototypeOf(this, ConnectionError.prototype);
        this.connectionType = connectionType;
    }
    get headline() {
        return `Could not establish ${this.connectionType} connection`;
    }
}
exports.ConnectionError = ConnectionError;
/**
 * Throw instances of this class to indicate error arising from a failed operation in the running process.
 */
class OpError extends BaseError {
    /**
     *
     * @param componentName Name of logical module, class or component that defines the failed operation
     * @param opName Name of the function that included the failed operation
     * @param details
     */
    constructor(componentName, opName, details, debugInfo) {
        super(error_entities_1.ErrorType.operation, details, debugInfo);
        Object.setPrototypeOf(this, OpError.prototype);
        this.opName = opName;
        this.componentName = componentName;
    }
    get headline() {
        return `Internal operation "${this.componentName}.${this.opName}()" failed`;
    }
}
exports.OpError = OpError;
/**
 * Throw instances of this class to indicate error occured in service.
 */
class ServiceError extends BaseError {
    constructor(errorConfig, debugInfo) {
        super(error_entities_1.ErrorType.service, errorConfig, debugInfo);
        Object.setPrototypeOf(this, ServiceError.prototype);
        this.errorConfig = errorConfig;

        if(debugInfo && errorConfig.message) {
            this.errorConfig.message = ServiceError.formatMessage(this.errorConfig.message, debugInfo);
        }
    }
    get headline() {
        return `Service error: "${this.errorConfig.message}`;
    }

    static formatMessage(message, values) {
        let parts = [];
    
        if(typeof values === 'string') {
            return message;
        }

        if (values) {
          Object.keys(values).forEach(key => {
            if (typeof values[key] === 'function') {
              let idx = 0;
              parts = message
                .split(`{${key}}`)
                .map(p => (p.length ? p : values[key]()))
                .map(p => p);
            } else if (typeof values[key] !== 'object') {
              message = message.replace(RegExp(`{${key}}`, 'g'), values[key]);
            }
          });
        }
    
        return parts.length ? parts : message;
    }
}
exports.ServiceError = ServiceError;
/**
 * Used by framework to signal that an error occured in a promise and was not handled anywhere
 */
class UnhandledRejection extends BaseError {
    constructor(promise, error) {
        super(error_entities_1.ErrorType.unhandledRejection, error);
        Object.setPrototypeOf(this, UnhandledRejection.prototype);
    }
    get headline() {
        return `Unhandled error occured in a promise`;
    }
}
exports.UnhandledRejection = UnhandledRejection;
/**
 * Used by framework to signal that an exception was thrown but never handled
 */
class UncaughtException extends BaseError {
    constructor(error) {
        super(error_entities_1.ErrorType.uncaughtException, error);
        Object.setPrototypeOf(this, UncaughtException.prototype);
    }
    get headline() {
        return `Uncaught exception`;
    }
}
exports.UncaughtException = UncaughtException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQU0wQjtBQUUxQjs7Ozs7OztHQU9HO0FBQ0gsTUFBc0IsU0FBVSxTQUFRLEtBQUs7SUF1RXpDLFlBQVksSUFBZSxFQUFFLE9BQWEsRUFBRSxTQUFlO1FBQ3ZELElBQUksU0FBUyxDQUFDLG1CQUFtQixJQUFJLE9BQU8sRUFBRTtZQUMxQyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFLENBQUMsQ0FBQztTQUNqQzthQUFNO1lBQ0gsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2Y7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBNUVELElBQUksUUFBUTtRQUNSLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVTLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBVztRQUN2QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdkIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2hFO2FBQU0sSUFBSSxNQUFNLFlBQVksa0JBQWtCLEVBQUU7WUFDN0MsT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1NBQ2pDO2FBQU0sSUFBSSxNQUFNLFlBQVksU0FBUyxFQUFFO1lBQ3BDLE9BQU8sTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NB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
