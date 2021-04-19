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
  invalidAuthToken = "invalidAuthToken",
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
  emailVerificationAlreadyDone = "emailVerificationAlreadyDone",
  emailVerificationCodeInvalid = "emailVerificationCodeInvalid",
  emailVerificationCodeExpired = "emailVerificationCodeExpired",
  matchingAddressNotFound = "matchingAddressNotFound",
}

export enum SecurityErrorCategory {
  rxFillDoesNotBelongToUser = "rxFillDoesNotBelongToUser",
  chatDoesNotBelongToUser = "chatDoesNotBelongToUser",
  responderNotPermitted = "responderNotPermitted",
  situationTypeNotPermitted = "situationTypeNotPermitted",
  scheduleRuleCreateNotPermitted = "scheduleRuleCreateNotPermitted",
  responderDoesNotExist = "responderDoesNotExist",
  responderConfigDoesNotExist = "responderConfigDoesNotExist",
  pharmacyUpdateByPatientNotPermitted = "pharmacyUpdateByPatientNotPermitted",
  userDoesNotBelongToOrganisation = "userDoesNotBelongToOrganisation",
}

/** use for error scenarios related to workflows, eg when rx fill fails */
export enum WorkflowErrorCategory {
  requestRxDownloadTokenFailed = "requestRxDownloadTokenFailed",
  redeemRxDownloadTokenFailed = "redeemRxDownloadTokenFailed",
  rxUploadFailed = "rxUploadFailed",
  rxUploadFailedUnknown = "rxUploadFailedUnknown",
  rxFillFailed = "rxFillFailed",
  rxCancelFailed = "rxCancelFailed",
  rxCancelFailedUnknown = "rxCancelFailedUnknown",
  rxCompleteTxFailed = "rxCompleteTxFailed",
  rxCompleteTxFailedUnknown = "rxCompleteTxFailedUnknown",
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

/**
 * Used in conjunction with ConnectionError class to indicate what type of connection failure occurred.
 */
 export enum ConnectionType {
  lan = "local area network",
  internet = "internet",
  remoteProcess = "remote process",
  db = "database"
}


export enum DeviceOpErrorCategory {
  locationService = "locationService",
  userDataNotFoundInLocalDb = "userDataNotFoundInLocalDb",
  appDataNotFoundInLocalDb = "appDataNotFoundInLocalDb",

}


export enum ErrorCategory {
  Info = "Info",
  Allergy = "Allergy",
  Bot = "Bot",
  BulkOperation = "BulkOperation",
  Campaign = "Campaign",
  Chat = "Chat",
  Clinic = "Clinic",
  Clinician = "Clinician",
  ConfigStore = "ConfigStore",
  Intervention = "Intervention",
  Medication = "Medication",
  Migrations = "Migrations",
  Notification = "Notification",
  Patient = "Patient",
  Pharmacist = "Pharmacist",
  Pharmacy = "Pharmacy",
  Rx = "Rx",
  RxFill = "RxFill",
  RxTransaction = "RxTransaction",
  ScheduleRule = "ScheduleRule",
  SituationResponder = "SituationResponder",
  SurescriptsMessage = "SurescriptsMessage",
  Tenant = "Tenant",
  User = "User",
  ApiService = "ApiService",
  DbService = "DbService",
}

export enum ErrorItem {
  CreateFailed = "createFailed",
  CreateOperationNotPermitted = "createOperationNotPermitted",
  DeleteFailed = "deleteFailed",
  DeleteOperationNotPermitted = "deleteOperationNotPermitted",
  InvalidData = "invalidData",
  LookupFailed = "lookupFailed",
  LookupOperationNotPermitted = "lookupOperationNotPermitted",
  OperationFailed = "operationFailed",
  OperationNotPermitted = "operationNotPermitted",
  UpdateFailed = "updateFailed",
  UpdateOperationNotPermitted = "updateOperationNotPermitted",
  UploadFailed = "uploadFailed",
  UploadOperationNotPermitted = "uploadOperationNotPermitted",
  UpsertFailed = "upsertFailed",
  UpsertOperationNotPermitted = "upsertOperationNotPermitted",
  RecordAlreadyExists = "recordAlreadyExists",
  RecordAlreadyImported = "recordAlreadyImported",
  RecordDoesNotBelongToUser = "recordDoesNotBelongToUser",
  RecordDoesNotExist = "recordDoesNotExist",
  ServiceNotEnabled = "serviceNotEnabled",
  UnknownError = "unknownError",
  NoDownloadableRx = "noDownloadableRx",
  RxCancellationError = "rxCancellationError",
  RxCreationTrialOnlyError = "rxCreationTrialOnlyError",
  RxDownloadTokenAlreadyRedeemed = "rxDownloadTokenAlreadyRedeemed",
  RequestRxDownloadTokenFailed = "requestRxDownloadTokenFailed",
  RedeemRxDownloadTokenFailed = "redeemRxDownloadTokenFailed",
  RxFilledAlready = "rxFilledAlready",
  RxCancelFailed = "rxCancelFailed",
  RxCancelFailedUnknown = "rxCancelFailedUnknown",
  RxCompleteTxFailed = "rxCompleteTxFailed",
  RxCompleteTxFailedUnknown = "rxCompleteTxFailedUnknown",
  UserDoesNotBelongToOrganisation = "userDoesNotBelongToOrganisation",
  AuthTokenExpired = "authTokenExpired",
  BlockedAccount = "blockedAccount",
  CanceledAccount = "canceledAccount",
  EmailVerificationAlreadyDone = "emailVerificationAlreadyDone",
  EmailVerificationCodeExpired = "emailVerificationCodeExpired",
  EmailVerificationCodeInvalid = "emailVerificationCodeInvalid",
  InsufficientPermissions = "insufficientPermissions",
  InvalidAuthToken = "invalidAuthToken",
  InvalidLogin = "invalidLogin",
  InvalidPasswordResetCode = "invalidPasswordResetCode",
  OperationNotAllowed = "operationNotAllowed",
  PasswordComplexity = "passwordComplexity",
  PasswordResetCodeHasExpired = "passwordResetCodeHasExpired",
  PasswordResetOperationNotAllowed = "passwordResetOperationNotAllowed",
  PermissionNotGranted = "permissionNotGranted",
  PriorAccountWithEmail = "priorAccountWithEmail",
  PriorAccountWithTelecom = "priorAccountWithTelecom",
  UserUpsertWhenEmailIsVerifiedNotAllowed = "userUpsertWhenEmailIsVerifiedNotAllowed",
  WrongDob = "wrongDob",
  WrongDobOrTelecom = "wrongDobOrTelecom",
  WrongTelecom = "wrongTelecom",
  ResponderNotPermitted = "responderNotPermitted",
  SituationTypeNotPermitted = "situationTypeNotPermitted",
  TelecomExtensionNotAllowed = "telecomExtensionNotAllowed",
  MatchingAddressNotFound = "matchingAddressNotFound",
  UnknownErrorpharmacyDoesNotAcceptFax = "unknownErrorpharmacyDoesNotAcceptFax",
  AuthTokenUserDoesNotExist = "authTokenUserDoesNotExist",
}
export type ErrorConfig = {
  code: number;
  httpResponseCode: number;
  category: ErrorCategory;
  message: string;
};

export interface IErrorConfigs {
  readonly createFailed: ErrorConfig;
  readonly createOperationNotPermitted: ErrorConfig;
  readonly deleteFailed: ErrorConfig;
  readonly deleteOperationNotPermitted: ErrorConfig;
  readonly invalidData: ErrorConfig;
  readonly lookupFailed: ErrorConfig;
  readonly lookupOperationNotPermitted: ErrorConfig;
  readonly operationFailed: ErrorConfig;
  readonly operationNotPermitted: ErrorConfig;
  readonly updateFailed: ErrorConfig;
  readonly updateOperationNotPermitted: ErrorConfig;
  readonly uploadFailed: ErrorConfig;
  readonly uploadOperationNotPermitted: ErrorConfig;
  readonly upsertFailed: ErrorConfig;
  readonly upsertOperationNotPermitted: ErrorConfig;
  readonly recordAlreadyExists: ErrorConfig;
  readonly recordAlreadyImported: ErrorConfig;
  readonly recordDoesNotBelongToUser: ErrorConfig;
  readonly recordDoesNotExist: ErrorConfig;
  readonly serviceNotEnabled: ErrorConfig;
  readonly unknownError: ErrorConfig;
  readonly noDownloadableRx: ErrorConfig;
  readonly rxCancellationError: ErrorConfig;
  readonly rxCreationTrialOnlyError: ErrorConfig;
  readonly rxDownloadTokenAlreadyRedeemed: ErrorConfig;
  readonly requestRxDownloadTokenFailed: ErrorConfig;
  readonly redeemRxDownloadTokenFailed: ErrorConfig;
  readonly rxFilledAlready: ErrorConfig;
  readonly rxCancelFailed: ErrorConfig;
  readonly rxCancelFailedUnknown: ErrorConfig;
  readonly rxCompleteTxFailed: ErrorConfig;
  readonly rxCompleteTxFailedUnknown: ErrorConfig;
  readonly userDoesNotBelongToOrganisation: ErrorConfig;
  readonly authTokenExpired: ErrorConfig;
  readonly blockedAccount: ErrorConfig;
  readonly canceledAccount: ErrorConfig;
  readonly emailVerificationAlreadyDone: ErrorConfig;
  readonly emailVerificationCodeExpired: ErrorConfig;
  readonly emailVerificationCodeInvalid: ErrorConfig;
  readonly insufficientPermissions: ErrorConfig;
  readonly invalidAuthToken: ErrorConfig;
  readonly invalidLogin: ErrorConfig;
  readonly invalidPasswordResetCode: ErrorConfig;
  readonly operationNotAllowed: ErrorConfig;
  readonly passwordComplexity: ErrorConfig;
  readonly passwordResetCodeHasExpired: ErrorConfig;
  readonly passwordResetOperationNotAllowed: ErrorConfig;
  readonly permissionNotGranted: ErrorConfig;
  readonly priorAccountWithEmail: ErrorConfig;
  readonly priorAccountWithTelecom: ErrorConfig;
  readonly userUpsertWhenEmailIsVerifiedNotAllowed: ErrorConfig;
  readonly wrongDob: ErrorConfig;
  readonly wrongDobOrTelecom: ErrorConfig;
  readonly wrongTelecom: ErrorConfig;
  readonly responderNotPermitted: ErrorConfig;
  readonly situationTypeNotPermitted: ErrorConfig;
  readonly telecomExtensionNotAllowed: ErrorConfig;
  readonly matchingAddressNotFound: ErrorConfig;
  readonly unknownErrorpharmacyDoesNotAcceptFax: ErrorConfig;
  readonly authTokenUserDoesNotExist: ErrorConfig;
}

/**
 * @todo implement actual internalisation support. 
 * create LoaleProvider (similar to patient app but for node). best to use i18n npm
 * extend / refactor ErrorMessages that implements IErrorsMessages as desired supported locales (en-us....)
 * where each props are readonly with string value.
 * {code, httpResponseCode, category } are common to all errors threfore it should just exist as errorConfig
 * in error-entities
 */
export class ErrorConfigs implements IErrorConfigs {
  readonly createFailed = {
    code: 600001,
    httpResponseCode: 400,
    category: ErrorCategory.Info,
    message: "Unable to create {context}",
  };
  readonly createOperationNotPermitted = {
    code: 600002,
    httpResponseCode: 403,
    category: ErrorCategory.Info,
    message: "Not permitted to create {context}",
  };
  readonly deleteFailed = {
    code: 600003,
    httpResponseCode: 400,
    category: ErrorCategory.Info,
    message: "Unable to delete {context}",
  };
  readonly deleteOperationNotPermitted = {
    code: 600004,
    httpResponseCode: 403,
    category: ErrorCategory.Info,
    message: "Not permitted to delete {context}",
  };
  readonly invalidData = {
    code: 600005,
    httpResponseCode: 400,
    category: ErrorCategory.Info,
    message: "Invalid or malformed data please try again",
  };
  readonly lookupFailed = {
    code: 600006,
    httpResponseCode: 400,
    category: ErrorCategory.Info,
    message: "Unable to lookup {context}",
  };
  readonly lookupOperationNotPermitted = {
    code: 600007,
    httpResponseCode: 403,
    category: ErrorCategory.Info,
    message: "Not permitted to lookup {context}",
  };
  readonly operationFailed = {
    code: 600008,
    httpResponseCode: 400,
    category: ErrorCategory.Info,
    message: "Unable to perform {operation} operation",
  };
  readonly operationNotPermitted = {
    code: 600009,
    httpResponseCode: 403,
    category: ErrorCategory.Info,
    message: "Insufficient permission to perform {operation} operation",
  };
  readonly updateFailed = {
    code: 600010,
    httpResponseCode: 400,
    category: ErrorCategory.Info,
    message: "Unable to update {context}",
  };
  readonly updateOperationNotPermitted = {
    code: 600011,
    httpResponseCode: 403,
    category: ErrorCategory.Info,
    message: "Not permitted to update {context}",
  };
  readonly uploadFailed = {
    code: 600012,
    httpResponseCode: 400,
    category: ErrorCategory.Info,
    message: "Unable to upload {context}",
  };
  readonly uploadOperationNotPermitted = {
    code: 600013,
    httpResponseCode: 403,
    category: ErrorCategory.Info,
    message: "Not permitted to upload {context}",
  };
  readonly upsertFailed = {
    code: 600014,
    httpResponseCode: 400,
    category: ErrorCategory.Info,
    message: "Unable to upsert {context}",
  };
  readonly upsertOperationNotPermitted = {
    code: 600015,
    httpResponseCode: 403,
    category: ErrorCategory.Info,
    message: "Not permitted to upsert {context}",
  };
  readonly recordAlreadyExists = {
    code: 600016,
    httpResponseCode: 405,
    category: ErrorCategory.Info,
    message: "{context} record already exists",
  };
  readonly recordAlreadyImported = {
    code: 600017,
    httpResponseCode: 405,
    category: ErrorCategory.Info,
    message: "{context} record already imported",
  };
  readonly recordDoesNotBelongToUser = {
    code: 600018,
    httpResponseCode: 403,
    category: ErrorCategory.Info,
    message: "{context} record does not belong to you",
  };
  readonly recordDoesNotExist = {
    code: 600019,
    httpResponseCode: 204,
    category: ErrorCategory.Info,
    message:
      "{context} record does not exist. Contact Support (support@scalamed.com) for help",
  };
  readonly serviceNotEnabled = {
    code: 600020,
    httpResponseCode: 405,
    category: ErrorCategory.Info,
    message: "{service} resource is not available",
  };
  readonly unknownError = {
    code: 600021,
    httpResponseCode: 500,
    category: ErrorCategory.Info,
    message: "Unknown error",
  };
  readonly noDownloadableRx = {
    code: 616022,
    httpResponseCode: 204,
    category: ErrorCategory.Rx,
    message: "There are no prescriptions to download",
  };
  readonly rxCancellationError = {
    code: 616023,
    httpResponseCode: 400,
    category: ErrorCategory.Rx,
    message: "Unable to cancel requested prescription",
  };
  readonly rxCreationTrialOnlyError = {
    code: 616024,
    httpResponseCode: 400,
    category: ErrorCategory.Rx,
    message: "Unable to create trial prescription",
  };
  readonly rxDownloadTokenAlreadyRedeemed = {
    code: 616025,
    httpResponseCode: 405,
    category: ErrorCategory.Rx,
    message: "Prescription download token has already been redeemed",
  };
  readonly requestRxDownloadTokenFailed = {
    code: 616026,
    httpResponseCode: 400,
    category: ErrorCategory.Rx,
    message: "Unable to generate download token",
  };
  readonly redeemRxDownloadTokenFailed = {
    code: 616027,
    httpResponseCode: 400,
    category: ErrorCategory.Rx,
    message: "Unable to redeem token",
  };
  readonly rxFilledAlready = {
    code: 617028,
    httpResponseCode: 405,
    category: ErrorCategory.RxFill,
    message: "Prescription has already been filled",
  };
  readonly rxCancelFailed = {
    code: 618029,
    httpResponseCode: 400,
    category: ErrorCategory.RxTransaction,
    message: "Unable to cancel prescription",
  };
  readonly rxCancelFailedUnknown = {
    code: 618030,
    httpResponseCode: 400,
    category: ErrorCategory.RxTransaction,
    message: "Unable to cancel prescription",
  };
  readonly rxCompleteTxFailed = {
    code: 618031,
    httpResponseCode: 400,
    category: ErrorCategory.RxTransaction,
    message: "Unable to complete prescription transaction",
  };
  readonly rxCompleteTxFailedUnknown = {
    code: 618032,
    httpResponseCode: 400,
    category: ErrorCategory.RxTransaction,
    message: "Unable to complete prescription transaction",
  };
  readonly userDoesNotBelongToOrganisation = {
    code: 623033,
    httpResponseCode: 403,
    category: ErrorCategory.User,
    message: "User does not belong to requested organisation",
  };
  readonly authTokenExpired = {
    code: 623034,
    httpResponseCode: 400,
    category: ErrorCategory.User,
    message: "Bearer token has expired",
  };
  readonly blockedAccount = {
    code: 623035,
    httpResponseCode: 403,
    category: ErrorCategory.User,
    message: "User account is blocked",
  };
  readonly canceledAccount = {
    code: 623036,
    httpResponseCode: 403,
    category: ErrorCategory.User,
    message: "User account has been cancelled",
  };
  readonly emailVerificationAlreadyDone = {
    code: 623037,
    httpResponseCode: 405,
    category: ErrorCategory.User,
    message: "Email Verification is already done",
  };
  readonly emailVerificationCodeExpired = {
    code: 623038,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "Email verification code has expired",
  };
  readonly emailVerificationCodeInvalid = {
    code: 623039,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "Email verification code is invalid",
  };
  readonly insufficientPermissions = {
    code: 623040,
    httpResponseCode: 403,
    category: ErrorCategory.User,
    message: "Insufficient permission to access this resource",
  };
  readonly invalidAuthToken = {
    code: 623041,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "Supplied bearer token is invalid",
  };
  readonly invalidLogin = {
    code: 623042,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "Invalid login credentials",
  };
  readonly invalidPasswordResetCode = {
    code: 623043,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "Password reset code is invalid",
  };
  readonly operationNotAllowed = {
    code: 623044,
    httpResponseCode: 405,
    category: ErrorCategory.User,
    message: "{operation} operation is not allowed",
  };
  readonly passwordComplexity = {
    code: 623045,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "Invalid Password. Please check the requirements above.",
  };
  readonly passwordResetCodeHasExpired = {
    code: 623046,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "Password reset code has expired",
  };
  readonly passwordResetOperationNotAllowed = {
    code: 623047,
    httpResponseCode: 405,
    category: ErrorCategory.User,
    message: "Password reset is not allowed",
  };
  readonly permissionNotGranted = {
    code: 623048,
    httpResponseCode: 403,
    category: ErrorCategory.User,
    message: "Unable to grant sufficient access",
  };
  readonly priorAccountWithEmail = {
    code: 623049,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "Different user with given email already exists",
  };
  readonly priorAccountWithTelecom = {
    code: 623050,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "Different user with given telecom already exists",
  };
  readonly userUpsertWhenEmailIsVerifiedNotAllowed = {
    code: 623051,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "User upsert is not allowed when email is already verified",
  };
  readonly wrongDob = {
    code: 623052,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "Incorrect date of birth provided",
  };
  readonly wrongDobOrTelecom = {
    code: 623053,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "Incorrect dob and/ or telecom provided",
  };
  readonly wrongTelecom = {
    code: 623054,
    httpResponseCode: 412,
    category: ErrorCategory.User,
    message: "Incorrect telecom of birth provided",
  };
  readonly responderNotPermitted = {
    code: 620055,
    httpResponseCode: 403,
    category: ErrorCategory.SituationResponder,
    message: "responderNotPermitted",
  };
  readonly situationTypeNotPermitted = {
    code: 620056,
    httpResponseCode: 403,
    category: ErrorCategory.SituationResponder,
    message: "situationTypeNotPermitted",
  };
  readonly telecomExtensionNotAllowed = {
    code: 700057,
    httpResponseCode: 400,
    category: ErrorCategory.ApiService,
    message: "telecomExtensionNotAllowed",
  };
  readonly matchingAddressNotFound = {
    code: 700058,
    httpResponseCode: 400,
    category: ErrorCategory.ApiService,
    message: "matchingAddressNotFound",
  };
  readonly unknownErrorpharmacyDoesNotAcceptFax = {
    code: 615059,
    httpResponseCode: 400,
    category: ErrorCategory.Pharmacy,
    message: "unknownErrorpharmacyDoesNotAcceptFax",
  };
  readonly authTokenUserDoesNotExist = {
    code: 623060,
    httpResponseCode: 403,
    category: ErrorCategory.User,
    message: "There is no record for user presented in bearer token",
  };
}
