"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleTextColor = exports.ConnectionType = exports.ErrorType = void 0;
/**
 * Possible error types.
 */
var ErrorType;
(function (ErrorType) {
    ErrorType["connection"] = "connection";
    ErrorType["operation"] = "operation";
    ErrorType["service"] = "service";
    ErrorType["uncaughtException"] = "uncaughtException";
    ErrorType["unhandledRejection"] = "unhandledRejection";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
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
exports.consoleTextColor = {
    error: "red",
    details: "cyan",
    debugInfo: "green",
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItZW50aXRpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlcnJvci1lbnRpdGllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7R0FFRztBQUNILElBQVksU0FNWDtBQU5ELFdBQVksU0FBUztJQUNqQixzQ0FBeUIsQ0FBQTtJQUN6QixvQ0FBdUIsQ0FBQTtJQUN2QixnQ0FBbUIsQ0FBQTtJQUNuQixvREFBdUMsQ0FBQTtJQUN2QyxzREFBeUMsQ0FBQTtBQUM3QyxDQUFDLEVBTlcsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFNcEI7QUFFRDs7R0FFRztBQUNILElBQVksY0FLWDtBQUxELFdBQVksY0FBYztJQUN0Qiw0Q0FBMEIsQ0FBQTtJQUMxQix1Q0FBcUIsQ0FBQTtJQUNyQixrREFBZ0MsQ0FBQTtJQUNoQyxpQ0FBZSxDQUFBO0FBQ25CLENBQUMsRUFMVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQUt6QjtBQUVZLFFBQUEsZ0JBQWdCLEdBQUc7SUFDNUIsS0FBSyxFQUFFLEtBQUs7SUFDWixPQUFPLEVBQUUsTUFBTTtJQUNmLFNBQVMsRUFBRSxPQUFPO0NBQ3JCLENBQUMifQ==