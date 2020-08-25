/**
 * Possible error types.
 */
export enum ErrorType {
    operation = "operationError",
    rule = "ruleViolation",
    apiCall = "apiCallError",
    security = "securityViolation",
    connection = "connectionError",
    user = "userError",
    deviceOp = "deviceOpError",
    unhandledRejection = "unhandledRejection",
    uncaughtException = "uncaughtException",
    noOp = "noOp"
}
const consoleTextColor = {
    error: "red",
    details: "cyan",
    debugInfo: "green"
}
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
            return detail.map(d => this.detailToString(d)).join(" & ");
        } else if (detail instanceof UnhandledRejection) {
            return `${detail.toString()}`;
        } else if (detail instanceof BaseError) {
            return detail.toString();
        } else if (detail instanceof Error) {
            return detail.stack ? detail.stack : detail.toString();
        } else if (detail === Object(detail)) {
            return Object.keys(detail)
                .map(k => {
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
            let returnString = e.headline || '';
            returnString += e.details
                ? `\n${this.detailToString(e.details)}`[consoleTextColor.details as any]
                : '';
            returnString += e.debugInfo && BaseError.addDebugInfoToMessage
                ? `\n${this.detailToString(e.debugInfo)}\n`[consoleTextColor.debugInfo as any]
                : '';
            return returnString;

        } else if (e.constructor.name) {
            return e.constructor.name;
        } else {
            return e.toString();
        }
    }

    private static generateRef() {
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
    constructor(componentName: string, opName: string, details?: any, debugInfo?: any) {
        super(ErrorType.operation, details, debugInfo);
        this.opName = opName;
        this.componentName = componentName;
    }

    get headline() {
        return `Internal operation "${this.componentName}.${
            this.opName
            }()" failed`;
    }
}

/**
 * Throw instances of this class to indicate that an operation did not need to be run, and was cancelled
 */
export class NoOpError extends BaseError {
    readonly opName: string;
    readonly componentName: string;

    /**
     *
     * @param componentName Name of logical module, class or component that defines the failed operation
     * @param opName Name of the function that included the failed operation
     * @param details
     */
    constructor(componentName: string, opName: string, details?: any, debugInfo?: any) {
        super(ErrorType.noOp, details, debugInfo);
        this.opName = opName;
        this.componentName = componentName;
    }

    get headline() {
        return `Internal operation "${this.componentName}.${
            this.opName
            }()" failed`;
    }
}

/**
 * Throw instances of this class to indicate that a business rule has been violated.
 */
export class RuleViolationError extends BaseError {
    readonly rule: string;

    constructor(rule: string, details?: any, debugInfo?: any) {
        super(ErrorType.rule, details, debugInfo);
        this.rule = rule;
    }

    get headline() {
        return `Internal rule "${this.rule}" was violated`;
    }
}

/**
 * Throw instances of this class to indicate that a security rule has been violated.
 */
export class SecurityRuleViolation extends BaseError {
    readonly rule: string;

    constructor(rule: string, details?: any, debugInfo?: any) {
        super(ErrorType.security, details, debugInfo);
        this.rule = rule;
    }

    get headline() {
        return `Security rule "${this.rule}" was violated`;
    }
}

/**
 * Throw instances of this class to indicate that an error occurred during a call to an external process or API.
 */
export class APICallError extends BaseError {
    readonly service: string;
    readonly endpoint: string;

    get headline() {
        return `API call to ${this.service} endpoint "${this.endpoint}" failed`;
    }

    constructor(service: string, endpoint: string, details?: any) {
        super(ErrorType.apiCall, details);
        this.service = service;
        this.endpoint = endpoint;
    }
}

/**
 * Used in conjunction with ConnectionError class to indicate what type of connection failure occurred.
 */
export enum ConnectionType {
    lan = "local area network",
    internet = "internet",
    remoteProcess = "remote process",
    db = "database"
}

/**
 * Throw instances of this class to indicate that an error occurred during a call to an external process or API.
 */
export class ConnectionError extends BaseError {
    readonly connectionType: ConnectionType;

    get headline() {
        return `Could not establish ${this.connectionType} connection`;
    }

    constructor(connectionType: ConnectionType, details?: any, debugInfo?: any) {
        super(ErrorType.connection, details, debugInfo);
        this.connectionType = connectionType;
    }
}

/**
 * Throw instances of this class to indicate that an error occurred during a call to an external process or API.
 */
export class NotImplementedError extends BaseError {
    get headline() {
        return `Feature not yet implemented`;
    }

    constructor() {
        super(ErrorType.operation);
    }
}

/** 
 * IMP: Whenever new Category is added in this enum, add the value in Tags in Freshdesk as well
 */
export enum UserErrorCategory {
    passwordComplexity = "passwordComplexity",
    invalidLogin = "invalidLogin",
    priorAccountWithEmail = "priorAccountWithEmail",
    priorAccountWithTelecom = "priorAccountWithTelecom",
    authTokenExpired = "authTokenExpired",
    invalidData = "invalidData",
    insufficientPermissions = "insufficientPermissions",
    external = "externalError",
    blockedAccount = "blockedAccount",
    canceledAccount = "canceledAccount",
    operationNotAllowed = "operationNotAllowed",
    pharmacyDoesNotExist = "pharmacyDoesNotExist",
    pharmacyAlreadyExists = "pharmacyAlreadyExists",
    pharmacyDoesNotAcceptFax = "pharmacyDoesNotHaveFax",
    rxDoesNotExist = "rxDoesNotExist",
    rxAlreadyImported = "rxAlreadyImported",
    rxDoesNotBelongToUser = "rxDoesNotBelongToUser",
    fillRequestAlreadyExists = "fillRequestAlreadyExists",
    rxFillNotAllowed = "rxFillNotAllowed",
    rxFilledAlready = "rxFilledAlready",
    rxDownloadTokenAlreadyRedeemed = "rxDownloadTokenAlreadyRedeemed",
    rxCreationError = "rxCreationError",
    rxCreationTrialOnlyError = "rxCreationTrialOnlyError",
    rxCancellationError = "rxCancellationError",
    wrongDob = "wrongDob",
    wrongTelecom = "wrongTelecom",
    wrongDobOrTelecom = "wrongDobOrTelecom",
    permissionNotGranted = "permissionNotGranted",
    serviceNotEnabled = "serviceNotEnabled",
    telecomExtensionNotAllowed = "telecomExtensionNotAllowed",
    userUpsertWhenEmailIsVerifiedNotAllowed = "userUpsertWhenEmailIsVerifiedNotAllowed",
    passwordResetOperationNotAllowed = "passwordResetOperationNotAllowed",
    invalidPasswordResetCode = "invalidPasswordResetCode",
    passwordResetCodeHasExpired = "passwordResetCodeHasExpired",
    noDownloadableRx = "noDownloadableRx",
    rxFillDoesNotExist = "rxFillDoesNotExist",
    chatDoesNotExist = "chatDoesNotExist",
    clinicDoesNotExist = "clinicDoesNotExist",
    clinicianDoesNotExist = "clinicianDoesNotExist",
    emailVerificationAlreadyDone = 'emailVerificationAlreadyDone',
    emailVerificationCodeInvalid = 'emailVerificationCodeInvalid',
    emailVerificationCodeExpired = 'emailVerificationCodeExpired',
    matchingAddressNotFound = 'matchingAddressNotFound'
}

export enum SecurityErrorCategory {
    rxFillDoesNotBelongToUser = "rxFillDoesNotBelongToUser",
    chatDoesNotBelongToUser = "chatDoesNotBelongToUser",
    responderNotPermitted = "responderNotPermitted",
    situationTypeNotPermitted = "situationTypeNotPermitted",
    scheduleRuleCreateNotPermitted = "scheduleRuleCreateNotPermitted",
    responderDoesNotExist = "responderDoesNotExist",
    responderConfigDoesNotExist = "responderConfigDoesNotExist",
    pharmacyUpdateByPatientNotPermitted = "pharmacyUpdateByPatientNotPermitted"
}

/** use for error scenarios related to workflows, eg when rx fill fails */
export enum WorkflowErrorCategory {
    requestRxDownloadTokenFailed = 'requestRxDownloadTokenFailed',
    redeemRxDownloadTokenFailed = 'redeemRxDownloadTokenFailed',
    rxUploadFailed = 'rxUploadFailed',
    rxUploadFailedUnknown = 'rxUploadFailedUnknown',
    rxFillFailed = 'rxFillFailed',
    rxCancelFailed = 'rxCancelFailed',
    rxCancelFailedUnknown = 'rxCancelFailedUnknown',
    rxCompleteTxFailed = 'rxCompleteTxFailed',
    rxCompleteTxFailedUnknown = 'rxCompleteTxFailedUnknown'
}

/**
 * Throw instances of this class to indicate that the error has caused an error.
 * Note: UserErrors are automatically published by the server to the clients.
 */
export class UserError extends BaseError {
    readonly category: UserErrorCategory;

    get headline() {
        return `User error "${this.type}"${
            this.details ? " " + this.details.toString() : ""
            }`;
    }

    constructor(category: UserErrorCategory, details?: any, debugInfo?: any) {
        super(ErrorType.user, details, debugInfo);
        this.category = category;
    }
}

export enum DeviceOpErrorCategory {
    locationService = "locationService",
    userDataNotFoundInLocalDb = "userDataNotFoundInLocalDb",
    appDataNotFoundInLocalDb = "appDataNotFoundInLocalDb",

}
/**
 * Throw instances of this class to indicate device related error
 */
export class DeviceOpError extends BaseError {
    readonly componentName: string;
    readonly opName: string;
    readonly category: DeviceOpErrorCategory;
    readonly deviceOS: string;
    readonly appVersion?: string;

    get headline() {
        return `Device operation error "${this.type}"${
            this.details ? " " + this.details.toString() : ""
            }`;
    }

    constructor(
        componentName: string,
        opName: string,
        category: DeviceOpErrorCategory,
        deviceOS: string,
        details?: any,
        debugInfo?: any
    ) {
        super(ErrorType.deviceOp, details, debugInfo);
        this.componentName = componentName;
        this.opName = opName;
        this.deviceOS = deviceOS;
        this.category = category;
    }
}
/**
 * Used by framework to signal that an error occured in a promise and was not handled anywhere
 */
export class UnhandledRejection extends BaseError {
    constructor(promise: Promise<any>, error: any) {
        super(ErrorType.unhandledRejection, error);
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
    }

    get headline() {
        return `Uncaught exception`;
    }
}
