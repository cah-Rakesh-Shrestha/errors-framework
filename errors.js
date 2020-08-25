"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXJyb3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCxJQUFZLFNBV1g7QUFYRCxXQUFZLFNBQVM7SUFDakIseUNBQTRCLENBQUE7SUFDNUIsbUNBQXNCLENBQUE7SUFDdEIscUNBQXdCLENBQUE7SUFDeEIsMkNBQThCLENBQUE7SUFDOUIsMkNBQThCLENBQUE7SUFDOUIsK0JBQWtCLENBQUE7SUFDbEIsdUNBQTBCLENBQUE7SUFDMUIsc0RBQXlDLENBQUE7SUFDekMsb0RBQXVDLENBQUE7SUFDdkMsMEJBQWEsQ0FBQTtBQUNqQixDQUFDLEVBWFcsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFXcEI7QUFDRCxNQUFNLGdCQUFnQixHQUFHO0lBQ3JCLEtBQUssRUFBRSxLQUFLO0lBQ1osT0FBTyxFQUFFLE1BQU07SUFDZixTQUFTLEVBQUUsT0FBTztDQUNyQixDQUFBO0FBdUNEOzs7Ozs7O0dBT0c7QUFDSCxNQUFzQixTQUFVLFNBQVEsS0FBSztJQW9FekMsWUFBWSxJQUFlLEVBQUUsT0FBYSxFQUFFLFNBQWU7UUFDdkQsSUFBSSxTQUFTLENBQUMsbUJBQW1CLElBQUksT0FBTyxFQUFFO1lBQzFDLEtBQUssQ0FBQyxJQUFJLElBQUksS0FBSyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ2pDO2FBQU07WUFDSCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDZjtRQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzVDLENBQUM7SUF6RUQsSUFBSSxRQUFRO1FBQ1IsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRVMs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