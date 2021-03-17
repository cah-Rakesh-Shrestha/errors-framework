"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UncaughtException = exports.UnhandledRejection = exports.DeviceOpError = exports.DeviceOpErrorCategory = exports.UserError = exports.WorkflowErrorCategory = exports.SecurityErrorCategory = exports.UserErrorCategory = exports.NotImplementedError = exports.ConnectionError = exports.ConnectionType = exports.APICallError = exports.SecurityRuleViolation = exports.RuleViolationError = exports.NoOpError = exports.OpError = exports.BaseError = exports.ErrorType = void 0;
/**
 * Possible error types.
 */
var ErrorType;
(function (ErrorType) {
    ErrorType["operation"] = "operationError";
    ErrorType["rule"] = "ruleViolation";
    ErrorType["apiCall"] = "apiCallError";
    ErrorType["security"] = "securityViolation";
    ErrorType["connection"] = "connectionError";
    ErrorType["user"] = "userError";
    ErrorType["deviceOp"] = "deviceOpError";
    ErrorType["unhandledRejection"] = "unhandledRejection";
    ErrorType["uncaughtException"] = "uncaughtException";
    ErrorType["noOp"] = "noOp";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
const consoleTextColor = {
    error: "red",
    details: "cyan",
    debugInfo: "green"
};
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
            return detail.map(d => this.detailToString(d)).join(" & ");
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
                .map(k => {
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
            let returnString = e.headline || '';
            returnString += e.details
                ? `\n${this.detailToString(e.details)}`[consoleTextColor.details]
                : '';
            returnString += e.debugInfo && BaseError.addDebugInfoToMessage
                ? `\n${this.detailToString(e.debugInfo)}\n`[consoleTextColor.debugInfo]
                : '';
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
        super(ErrorType.operation, details, debugInfo);
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
 * Throw instances of this class to indicate that an operation did not need to be run, and was cancelled
 */
class NoOpError extends BaseError {
    /**
     *
     * @param componentName Name of logical module, class or component that defines the failed operation
     * @param opName Name of the function that included the failed operation
     * @param details
     */
    constructor(componentName, opName, details, debugInfo) {
        super(ErrorType.noOp, details, debugInfo);
        Object.setPrototypeOf(this, NoOpError.prototype);
        this.opName = opName;
        this.componentName = componentName;
    }
    get headline() {
        return `Internal operation "${this.componentName}.${this.opName}()" failed`;
    }
}
exports.NoOpError = NoOpError;
/**
 * Throw instances of this class to indicate that a business rule has been violated.
 */
class RuleViolationError extends BaseError {
    constructor(rule, details, debugInfo) {
        super(ErrorType.rule, details, debugInfo);
        Object.setPrototypeOf(this, RuleViolationError.prototype);
        this.rule = rule;
    }
    get headline() {
        return `Internal rule "${this.rule}" was violated`;
    }
}
exports.RuleViolationError = RuleViolationError;
/**
 * Throw instances of this class to indicate that a security rule has been violated.
 */
class SecurityRuleViolation extends BaseError {
    constructor(rule, details, debugInfo) {
        super(ErrorType.security, details, debugInfo);
        Object.setPrototypeOf(this, SecurityRuleViolation.prototype);
        this.rule = rule;
    }
    get headline() {
        return `Security rule "${this.rule}" was violated`;
    }
}
exports.SecurityRuleViolation = SecurityRuleViolation;
/**
 * Throw instances of this class to indicate that an error occurred during a call to an external process or API.
 */
class APICallError extends BaseError {
    constructor(service, endpoint, details) {
        super(ErrorType.apiCall, details);
        Object.setPrototypeOf(this, APICallError.prototype);
        this.service = service;
        this.endpoint = endpoint;
    }
    get headline() {
        return `API call to ${this.service} endpoint "${this.endpoint}" failed`;
    }
}
exports.APICallError = APICallError;
/**
 * Used in conjunction with ConnectionError class to indicate what type of connection failure occurred.
 */
var ConnectionType;
(function (ConnectionType) {
    ConnectionType["lan"] = "local area network";
    ConnectionType["internet"] = "internet";
    ConnectionType["remoteProcess"] = "remote process";
    ConnectionType["db"] = "database";
})(ConnectionType = exports.ConnectionType || (exports.ConnectionType = {}));
/**
 * Throw instances of this class to indicate that an error occurred during a call to an external process or API.
 */
class ConnectionError extends BaseError {
    constructor(connectionType, details, debugInfo) {
        super(ErrorType.connection, details, debugInfo);
        Object.setPrototypeOf(this, ConnectionError.prototype);
        this.connectionType = connectionType;
    }
    get headline() {
        return `Could not establish ${this.connectionType} connection`;
    }
}
exports.ConnectionError = ConnectionError;
/**
 * Throw instances of this class to indicate that an error occurred during a call to an external process or API.
 */
class NotImplementedError extends BaseError {
    get headline() {
        return `Feature not yet implemented`;
    }
    constructor() {
        super(ErrorType.operation);
        Object.setPrototypeOf(this, NotImplementedError.prototype);
    }
}
exports.NotImplementedError = NotImplementedError;
/**
 * IMP: Whenever new Category is added in this enum, add the value in Tags in Freshdesk as well
 */
var UserErrorCategory;
(function (UserErrorCategory) {
    UserErrorCategory["passwordComplexity"] = "passwordComplexity";
    UserErrorCategory["invalidLogin"] = "invalidLogin";
    UserErrorCategory["priorAccountWithEmail"] = "priorAccountWithEmail";
    UserErrorCategory["priorAccountWithTelecom"] = "priorAccountWithTelecom";
    UserErrorCategory["authTokenExpired"] = "authTokenExpired";
    UserErrorCategory["invalidAuthToken"] = "invalidAuthToken";
    UserErrorCategory["invalidData"] = "invalidData";
    UserErrorCategory["insufficientPermissions"] = "insufficientPermissions";
    UserErrorCategory["external"] = "externalError";
    UserErrorCategory["blockedAccount"] = "blockedAccount";
    UserErrorCategory["canceledAccount"] = "canceledAccount";
    UserErrorCategory["operationNotAllowed"] = "operationNotAllowed";
    UserErrorCategory["pharmacyDoesNotExist"] = "pharmacyDoesNotExist";
    UserErrorCategory["pharmacyAlreadyExists"] = "pharmacyAlreadyExists";
    UserErrorCategory["pharmacyDoesNotAcceptFax"] = "pharmacyDoesNotHaveFax";
    UserErrorCategory["rxDoesNotExist"] = "rxDoesNotExist";
    UserErrorCategory["rxAlreadyImported"] = "rxAlreadyImported";
    UserErrorCategory["rxDoesNotBelongToUser"] = "rxDoesNotBelongToUser";
    UserErrorCategory["fillRequestAlreadyExists"] = "fillRequestAlreadyExists";
    UserErrorCategory["rxFillNotAllowed"] = "rxFillNotAllowed";
    UserErrorCategory["rxFilledAlready"] = "rxFilledAlready";
    UserErrorCategory["rxDownloadTokenAlreadyRedeemed"] = "rxDownloadTokenAlreadyRedeemed";
    UserErrorCategory["rxCreationError"] = "rxCreationError";
    UserErrorCategory["rxCreationTrialOnlyError"] = "rxCreationTrialOnlyError";
    UserErrorCategory["rxCancellationError"] = "rxCancellationError";
    UserErrorCategory["wrongDob"] = "wrongDob";
    UserErrorCategory["wrongTelecom"] = "wrongTelecom";
    UserErrorCategory["wrongDobOrTelecom"] = "wrongDobOrTelecom";
    UserErrorCategory["permissionNotGranted"] = "permissionNotGranted";
    UserErrorCategory["serviceNotEnabled"] = "serviceNotEnabled";
    UserErrorCategory["telecomExtensionNotAllowed"] = "telecomExtensionNotAllowed";
    UserErrorCategory["userUpsertWhenEmailIsVerifiedNotAllowed"] = "userUpsertWhenEmailIsVerifiedNotAllowed";
    UserErrorCategory["passwordResetOperationNotAllowed"] = "passwordResetOperationNotAllowed";
    UserErrorCategory["invalidPasswordResetCode"] = "invalidPasswordResetCode";
    UserErrorCategory["passwordResetCodeHasExpired"] = "passwordResetCodeHasExpired";
    UserErrorCategory["noDownloadableRx"] = "noDownloadableRx";
    UserErrorCategory["rxFillDoesNotExist"] = "rxFillDoesNotExist";
    UserErrorCategory["chatDoesNotExist"] = "chatDoesNotExist";
    UserErrorCategory["clinicDoesNotExist"] = "clinicDoesNotExist";
    UserErrorCategory["clinicianDoesNotExist"] = "clinicianDoesNotExist";
    UserErrorCategory["emailVerificationAlreadyDone"] = "emailVerificationAlreadyDone";
    UserErrorCategory["emailVerificationCodeInvalid"] = "emailVerificationCodeInvalid";
    UserErrorCategory["emailVerificationCodeExpired"] = "emailVerificationCodeExpired";
    UserErrorCategory["matchingAddressNotFound"] = "matchingAddressNotFound";
})(UserErrorCategory = exports.UserErrorCategory || (exports.UserErrorCategory = {}));
var SecurityErrorCategory;
(function (SecurityErrorCategory) {
    SecurityErrorCategory["rxFillDoesNotBelongToUser"] = "rxFillDoesNotBelongToUser";
    SecurityErrorCategory["chatDoesNotBelongToUser"] = "chatDoesNotBelongToUser";
    SecurityErrorCategory["responderNotPermitted"] = "responderNotPermitted";
    SecurityErrorCategory["situationTypeNotPermitted"] = "situationTypeNotPermitted";
    SecurityErrorCategory["scheduleRuleCreateNotPermitted"] = "scheduleRuleCreateNotPermitted";
    SecurityErrorCategory["responderDoesNotExist"] = "responderDoesNotExist";
    SecurityErrorCategory["responderConfigDoesNotExist"] = "responderConfigDoesNotExist";
    SecurityErrorCategory["pharmacyUpdateByPatientNotPermitted"] = "pharmacyUpdateByPatientNotPermitted";
    SecurityErrorCategory["userDoesNotBelongToOrganisation"] = "userDoesNotBelongToOrganisation";
})(SecurityErrorCategory = exports.SecurityErrorCategory || (exports.SecurityErrorCategory = {}));
/** use for error scenarios related to workflows, eg when rx fill fails */
var WorkflowErrorCategory;
(function (WorkflowErrorCategory) {
    WorkflowErrorCategory["requestRxDownloadTokenFailed"] = "requestRxDownloadTokenFailed";
    WorkflowErrorCategory["redeemRxDownloadTokenFailed"] = "redeemRxDownloadTokenFailed";
    WorkflowErrorCategory["rxUploadFailed"] = "rxUploadFailed";
    WorkflowErrorCategory["rxUploadFailedUnknown"] = "rxUploadFailedUnknown";
    WorkflowErrorCategory["rxFillFailed"] = "rxFillFailed";
    WorkflowErrorCategory["rxCancelFailed"] = "rxCancelFailed";
    WorkflowErrorCategory["rxCancelFailedUnknown"] = "rxCancelFailedUnknown";
    WorkflowErrorCategory["rxCompleteTxFailed"] = "rxCompleteTxFailed";
    WorkflowErrorCategory["rxCompleteTxFailedUnknown"] = "rxCompleteTxFailedUnknown";
})(WorkflowErrorCategory = exports.WorkflowErrorCategory || (exports.WorkflowErrorCategory = {}));
/**
 * Throw instances of this class to indicate that the error has caused an error.
 * Note: UserErrors are automatically published by the server to the clients.
 */
class UserError extends BaseError {
    constructor(category, details, debugInfo) {
        super(ErrorType.user, details, debugInfo);
        Object.setPrototypeOf(this, UserError.prototype);
        this.category = category;
    }
    get headline() {
        return `User error "${this.type}"${this.details ? " " + this.details.toString() : ""}`;
    }
}
exports.UserError = UserError;
var DeviceOpErrorCategory;
(function (DeviceOpErrorCategory) {
    DeviceOpErrorCategory["locationService"] = "locationService";
    DeviceOpErrorCategory["userDataNotFoundInLocalDb"] = "userDataNotFoundInLocalDb";
    DeviceOpErrorCategory["appDataNotFoundInLocalDb"] = "appDataNotFoundInLocalDb";
})(DeviceOpErrorCategory = exports.DeviceOpErrorCategory || (exports.DeviceOpErrorCategory = {}));
/**
 * Throw instances of this class to indicate device related error
 */
class DeviceOpError extends BaseError {
    constructor(componentName, opName, category, deviceOS, details, debugInfo) {
        super(ErrorType.deviceOp, details, debugInfo);
        Object.setPrototypeOf(this, DeviceOpError.prototype);
        this.componentName = componentName;
        this.opName = opName;
        this.deviceOS = deviceOS;
        this.category = category;
    }
    get headline() {
        return `Device operation error "${this.type}"${this.details ? " " + this.details.toString() : ""}`;
    }
}
exports.DeviceOpError = DeviceOpError;
/**
 * Used by framework to signal that an error occured in a promise and was not handled anywhere
 */
class UnhandledRejection extends BaseError {
    constructor(promise, error) {
        super(ErrorType.unhandledRejection, error);
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
        super(ErrorType.uncaughtException, error);
        Object.setPrototypeOf(this, UncaughtException.prototype);
    }
    get headline() {
        return `Uncaught exception`;
    }
}
exports.UncaughtException = UncaughtException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOztHQUVHO0FBQ0gsSUFBWSxTQVdYO0FBWEQsV0FBWSxTQUFTO0lBQ2pCLHlDQUE0QixDQUFBO0lBQzVCLG1DQUFzQixDQUFBO0lBQ3RCLHFDQUF3QixDQUFBO0lBQ3hCLDJDQUE4QixDQUFBO0lBQzlCLDJDQUE4QixDQUFBO0lBQzlCLCtCQUFrQixDQUFBO0lBQ2xCLHVDQUEwQixDQUFBO0lBQzFCLHNEQUF5QyxDQUFBO0lBQ3pDLG9EQUF1QyxDQUFBO0lBQ3ZDLDBCQUFhLENBQUE7QUFDakIsQ0FBQyxFQVhXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBV3BCO0FBQ0QsTUFBTSxnQkFBZ0IsR0FBRztJQUNyQixLQUFLLEVBQUUsS0FBSztJQUNaLE9BQU8sRUFBRSxNQUFNO0lBQ2YsU0FBUyxFQUFFLE9BQU87Q0FDckIsQ0FBQTtBQXVDRDs7Ozs7OztHQU9HO0FBQ0gsTUFBc0IsU0FBVSxTQUFRLEtBQUs7SUFvRXpDLFlBQVksSUFBZSxFQUFFLE9BQWEsRUFBRSxTQUFlO1FBQ3ZELElBQUksU0FBUyxDQUFDLG1CQUFtQixJQUFJLE9BQU8sRUFBRTtZQUMxQyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFLENBQUMsQ0FBQztTQUNqQzthQUFNO1lBQ0gsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2Y7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBekVELElBQUksUUFBUTtRQUNSLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVT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