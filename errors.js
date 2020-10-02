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
    }
    get headline() {
        return `Uncaught exception`;
    }
}
exports.UncaughtException = UncaughtException;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOztHQUVHO0FBQ0gsSUFBWSxTQVdYO0FBWEQsV0FBWSxTQUFTO0lBQ2pCLHlDQUE0QixDQUFBO0lBQzVCLG1DQUFzQixDQUFBO0lBQ3RCLHFDQUF3QixDQUFBO0lBQ3hCLDJDQUE4QixDQUFBO0lBQzlCLDJDQUE4QixDQUFBO0lBQzlCLCtCQUFrQixDQUFBO0lBQ2xCLHVDQUEwQixDQUFBO0lBQzFCLHNEQUF5QyxDQUFBO0lBQ3pDLG9EQUF1QyxDQUFBO0lBQ3ZDLDBCQUFhLENBQUE7QUFDakIsQ0FBQyxFQVhXLFNBQVMsR0FBVCxpQkFBUyxLQUFULGlCQUFTLFFBV3BCO0FBQ0QsTUFBTSxnQkFBZ0IsR0FBRztJQUNyQixLQUFLLEVBQUUsS0FBSztJQUNaLE9BQU8sRUFBRSxNQUFNO0lBQ2YsU0FBUyxFQUFFLE9BQU87Q0FDckIsQ0FBQTtBQXVDRDs7Ozs7OztHQU9HO0FBQ0gsTUFBc0IsU0FBVSxTQUFRLEtBQUs7SUFvRXpDLFlBQVksSUFBZSxFQUFFLE9BQWEsRUFBRSxTQUFlO1FBQ3ZELElBQUksU0FBUyxDQUFDLG1CQUFtQixJQUFJLE9BQU8sRUFBRTtZQUMxQyxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFLENBQUMsQ0FBQztTQUNqQzthQUFNO1lBQ0gsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2Y7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBekVELElBQUksUUFBUTtRQUNSLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVTLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBVztRQUN2QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDdkIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5RDthQUFNLElBQUksTUFBTSxZQUFZLGtCQUFrQixFQUFFO1lBQzdDLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztTQUNqQzthQUFNLElBQUksTUFBTSxZQUFZLFNBQVMsRUFBRTtZQUNwQyxPQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUM1QjthQUFNLElBQUksTUFBTSxZQUFZLEtBQUssRUFBRTtZQUNoQyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUMxRDthQUFNLElBQUksTUFBTSxLQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNsQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2lCQUNyQixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ0wsT0FBTyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDckQsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuQjthQUFNO1lBQ0gsT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQzFDO0lBQ0wsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBYTtRQUV6QixJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFO1lBQ3hDLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1lBQ3BDLFlBQVksSUFBSSxDQUFDLENBQUMsT0FBTztnQkFDckIsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFjLENBQUM7Z0JBQ3hFLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDVCxZQUFZLElBQUksQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMscUJBQXFCO2dCQUMxRCxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQWdCLENBQUM7Z0JBQzlFLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDVCxPQUFPLFlBQVksQ0FBQztTQUV2QjthQUFNLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUU7WUFDM0IsT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztTQUM3QjthQUFNO1lBQ0gsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDdkI7SUFDTCxDQUFDO0lBRU8sTUFBTSxDQUFDLFdBQVc7UUFDdEIsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsTUFBTSxRQUFRLEdBQUcsNEJBQTRCLENBQUM7UUFDOUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDdEIsR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFFeEUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFakUsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDOztBQTlETCw4QkFnRkM7QUFkVSwrQkFBcUIsR0FBWSxLQUFLLENBQUM7QUFnQmxEOztHQUVHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsU0FBUztJQUlsQzs7Ozs7T0FLRztJQUNILFlBQVksYUFBcUIsRUFBRSxNQUFjLEVBQUUsT0FBYSxFQUFFLFNBQWU7UUFDN0UsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixPQUFPLHVCQUF1QixJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxNQUFNLFlBQVksQ0FBQztJQUNoRixDQUFDO0NBQ0o7QUFuQkQsMEJBbUJDO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLFNBQVUsU0FBUSxTQUFTO0lBSXBDOzs7OztPQUtHO0lBQ0gsWUFBWSxhQUFxQixFQUFFLE1BQWMsRUFBRSxPQUFhLEVBQUUsU0FBZTtRQUM3RSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7SUFDdkMsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE9BQU8sdUJBQXVCLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLE1BQU0sWUFBWSxDQUFDO0lBQ2hGLENBQUM7Q0FDSjtBQW5CRCw4QkFtQkM7QUFFRDs7R0FFRztBQUNILE1BQWEsa0JBQW1CLFNBQVEsU0FBUztJQUc3QyxZQUFZLElBQVksRUFBRSxPQUFhLEVBQUUsU0FBZTtRQUNwRCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE9BQU8sa0JBQWtCLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDO0lBQ3ZELENBQUM7Q0FDSjtBQVhELGdEQVdDO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLHFCQUFzQixTQUFRLFNBQVM7SUFHaEQsWUFBWSxJQUFZLEVBQUUsT0FBYSxFQUFFLFNBQWU7UUFDcEQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixPQUFPLGtCQUFrQixJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQztJQUN2RCxDQUFDO0NBQ0o7QUFYRCxzREFXQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxZQUFhLFNBQVEsU0FBUztJQVF2QyxZQUFZLE9BQWUsRUFBRSxRQUFnQixFQUFFLE9BQWE7UUFDeEQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQVJELElBQUksUUFBUTtRQUNSLE9BQU8sZUFBZSxJQUFJLENBQUMsT0FBTyxjQUFjLElBQUksQ0FBQyxRQUFRLFVBQVUsQ0FBQztJQUM1RSxDQUFDO0NBT0o7QUFiRCxvQ0FhQztBQUVEOztHQUVHO0FBQ0gsSUFBWSxjQUtYO0FBTEQsV0FBWSxjQUFjO0lBQ3RCLDRDQUEwQixDQUFBO0lBQzFCLHVDQUFxQixDQUFBO0lBQ3JCLGtEQUFnQyxDQUFBO0lBQ2hDLGlDQUFlLENBQUE7QUFDbkIsQ0FBQyxFQUxXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBS3pCO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsU0FBUztJQU8xQyxZQUFZLGNBQThCLEVBQUUsT0FBYSxFQUFFLFNBQWU7UUFDdEUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0lBQ3pDLENBQUM7SUFQRCxJQUFJLFFBQVE7UUFDUixPQUFPLHVCQUF1QixJQUFJLENBQUMsY0FBYyxhQUFhLENBQUM7SUFDbkUsQ0FBQztDQU1KO0FBWEQsMENBV0M7QUFFRDs7R0FFRztBQUNILE1BQWEsbUJBQW9CLFNBQVEsU0FBUztJQUM5QyxJQUFJLFFBQVE7UUFDUixPQUFPLDZCQUE2QixDQUFDO0lBQ3pDLENBQUM7SUFFRDtRQUNJLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0IsQ0FBQztDQUNKO0FBUkQsa0RBUUM7QUFFRDs7R0FFRztBQUNILElBQVksaUJBNkNYO0FBN0NELFdBQVksaUJBQWlCO0lBQ3pCLDhEQUF5QyxDQUFBO0lBQ3pDLGtEQUE2QixDQUFBO0lBQzdCLG9FQUErQyxDQUFBO0lBQy9DLHdFQUFtRCxDQUFBO0lBQ25ELDBEQUFxQyxDQUFBO0lBQ3JDLDBEQUFxQyxDQUFBO0lBQ3JDLGdEQUEyQixDQUFBO0lBQzNCLHdFQUFtRCxDQUFBO0lBQ25ELCtDQUEwQixDQUFBO0lBQzFCLHNEQUFpQyxDQUFBO0lBQ2pDLHdEQUFtQyxDQUFBO0lBQ25DLGdFQUEyQyxDQUFBO0lBQzNDLGtFQUE2QyxDQUFBO0lBQzdDLG9FQUErQyxDQUFBO0lBQy9DLHdFQUFtRCxDQUFBO0lBQ25ELHNEQUFpQyxDQUFBO0lBQ2pDLDREQUF1QyxDQUFBO0lBQ3ZDLG9FQUErQyxDQUFBO0lBQy9DLDBFQUFxRCxDQUFBO0lBQ3JELDBEQUFxQyxDQUFBO0lBQ3JDLHdEQUFtQyxDQUFBO0lBQ25DLHNGQUFpRSxDQUFBO0lBQ2pFLHdEQUFtQyxDQUFBO0lBQ25DLDBFQUFxRCxDQUFBO0lBQ3JELGdFQUEyQyxDQUFBO0lBQzNDLDBDQUFxQixDQUFBO0lBQ3JCLGtEQUE2QixDQUFBO0lBQzdCLDREQUF1QyxDQUFBO0lBQ3ZDLGtFQUE2QyxDQUFBO0lBQzdDLDREQUF1QyxDQUFBO0lBQ3ZDLDhFQUF5RCxDQUFBO0lBQ3pELHdHQUFtRixDQUFBO0lBQ25GLDBGQUFxRSxDQUFBO0lBQ3JFLDBFQUFxRCxDQUFBO0lBQ3JELGdGQUEyRCxDQUFBO0lBQzNELDBEQUFxQyxDQUFBO0lBQ3JDLDhEQUF5QyxDQUFBO0lBQ3pDLDBEQUFxQyxDQUFBO0lBQ3JDLDhEQUF5QyxDQUFBO0lBQ3pDLG9FQUErQyxDQUFBO0lBQy9DLGtGQUE2RCxDQUFBO0lBQzdELGtGQUE2RCxDQUFBO0lBQzdELGtGQUE2RCxDQUFBO0lBQzdELHdFQUFtRCxDQUFBO0FBQ3ZELENBQUMsRUE3Q1csaUJBQWlCLEdBQWpCLHlCQUFpQixLQUFqQix5QkFBaUIsUUE2QzVCO0FBRUQsSUFBWSxxQkFTWDtBQVRELFdBQVkscUJBQXFCO0lBQzdCLGdGQUF1RCxDQUFBO0lBQ3ZELDRFQUFtRCxDQUFBO0lBQ25ELHdFQUErQyxDQUFBO0lBQy9DLGdGQUF1RCxDQUFBO0lBQ3ZELDBGQUFpRSxDQUFBO0lBQ2pFLHdFQUErQyxDQUFBO0lBQy9DLG9GQUEyRCxDQUFBO0lBQzNELG9HQUEyRSxDQUFBO0FBQy9FLENBQUMsRUFUVyxxQkFBcUIsR0FBckIsNkJBQXFCLEtBQXJCLDZCQUFxQixRQVNoQztBQUVELDBFQUEwRTtBQUMxRSxJQUFZLHFCQVVYO0FBVkQsV0FBWSxxQkFBcUI7SUFDN0Isc0ZBQTZELENBQUE7SUFDN0Qsb0ZBQTJELENBQUE7SUFDM0QsMERBQWlDLENBQUE7SUFDakMsd0VBQStDLENBQUE7SUFDL0Msc0RBQTZCLENBQUE7SUFDN0IsMERBQWlDLENBQUE7SUFDakMsd0VBQStDLENBQUE7SUFDL0Msa0VBQXlDLENBQUE7SUFDekMsZ0ZBQXVELENBQUE7QUFDM0QsQ0FBQyxFQVZXLHFCQUFxQixHQUFyQiw2QkFBcUIsS0FBckIsNkJBQXFCLFFBVWhDO0FBRUQ7OztHQUdHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsU0FBUztJQU9wQyxZQUFZLFFBQTJCLEVBQUUsT0FBYSxFQUFFLFNBQWU7UUFDbkUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFQRCxJQUFJLFFBQVE7UUFDUixPQUFPLGVBQWUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDM0YsQ0FBQztDQU1KO0FBWEQsOEJBV0M7QUFFRCxJQUFZLHFCQUtYO0FBTEQsV0FBWSxxQkFBcUI7SUFDN0IsNERBQW1DLENBQUE7SUFDbkMsZ0ZBQXVELENBQUE7SUFDdkQsOEVBQXFELENBQUE7QUFFekQsQ0FBQyxFQUxXLHFCQUFxQixHQUFyQiw2QkFBcUIsS0FBckIsNkJBQXFCLFFBS2hDO0FBQ0Q7O0dBRUc7QUFDSCxNQUFhLGFBQWMsU0FBUSxTQUFTO0lBV3hDLFlBQ0ksYUFBcUIsRUFDckIsTUFBYyxFQUNkLFFBQStCLEVBQy9CLFFBQWdCLEVBQ2hCLE9BQWEsRUFDYixTQUFlO1FBRWYsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFqQkQsSUFBSSxRQUFRO1FBQ1IsT0FBTywyQkFBMkIsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDdkcsQ0FBQztDQWdCSjtBQXpCRCxzQ0F5QkM7QUFDRDs7R0FFRztBQUNILE1BQWEsa0JBQW1CLFNBQVEsU0FBUztJQUM3QyxZQUFZLE9BQXFCLEVBQUUsS0FBVTtRQUN6QyxLQUFLLENBQUMsU0FBUyxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixPQUFPLHNDQUFzQyxDQUFDO0lBQ2xELENBQUM7Q0FDSjtBQVJELGdEQVFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLGlCQUFrQixTQUFRLFNBQVM7SUFDNUMsWUFBWSxLQUFVO1FBQ2xCLEtBQUssQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE9BQU8sb0JBQW9CLENBQUM7SUFDaEMsQ0FBQztDQUNKO0FBUkQsOENBUUMifQ==