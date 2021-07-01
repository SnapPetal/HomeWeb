'use strict';

var configurations = require('./configurations-a8a5ec49.js');
var httpRequest = require('./httpRequest-eeeab15a.js');
require('crypto');

var omitRetryHeadersMiddleware = function () {
    return function (next) {
        return function (args) { return httpRequest.__awaiter(void 0, void 0, void 0, function () {
            var request;
            return httpRequest.__generator(this, function (_a) {
                request = args.request;
                if (httpRequest.HttpRequest.isInstance(request)) {
                    delete request.headers[configurations.INVOCATION_ID_HEADER];
                    delete request.headers[configurations.REQUEST_HEADER];
                }
                return [2 /*return*/, next(args)];
            });
        }); };
    };
};
var omitRetryHeadersMiddlewareOptions = {
    name: "omitRetryHeadersMiddleware",
    tags: ["RETRY", "HEADERS", "OMIT_RETRY_HEADERS"],
    relation: "before",
    toMiddleware: "awsAuthMiddleware",
    override: true,
};
var getOmitRetryHeadersPlugin = function (options) { return ({
    applyToStack: function (clientStack) {
        clientStack.addRelativeTo(omitRetryHeadersMiddleware(), omitRetryHeadersMiddlewareOptions);
    },
}); };

exports.AdaptiveRetryStrategy = configurations.AdaptiveRetryStrategy;
exports.CONFIG_MAX_ATTEMPTS = configurations.CONFIG_MAX_ATTEMPTS;
exports.CONFIG_RETRY_MODE = configurations.CONFIG_RETRY_MODE;
exports.DEFAULT_MAX_ATTEMPTS = configurations.DEFAULT_MAX_ATTEMPTS;
exports.DEFAULT_RETRY_MODE = configurations.DEFAULT_RETRY_MODE;
exports.DefaultRateLimiter = configurations.DefaultRateLimiter;
exports.ENV_MAX_ATTEMPTS = configurations.ENV_MAX_ATTEMPTS;
exports.ENV_RETRY_MODE = configurations.ENV_RETRY_MODE;
exports.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = configurations.NODE_MAX_ATTEMPT_CONFIG_OPTIONS;
exports.NODE_RETRY_MODE_CONFIG_OPTIONS = configurations.NODE_RETRY_MODE_CONFIG_OPTIONS;
Object.defineProperty(exports, 'RETRY_MODES', {
    enumerable: true,
    get: function () {
        return configurations.RETRY_MODES;
    }
});
exports.StandardRetryStrategy = configurations.StandardRetryStrategy;
exports.defaultDelayDecider = configurations.defaultDelayDecider;
exports.defaultRetryDecider = configurations.defaultRetryDecider;
exports.getRetryPlugin = configurations.getRetryPlugin;
exports.resolveRetryConfig = configurations.resolveRetryConfig;
exports.retryMiddleware = configurations.retryMiddleware;
exports.retryMiddlewareOptions = configurations.retryMiddlewareOptions;
exports.getOmitRetryHeadersPlugin = getOmitRetryHeadersPlugin;
exports.omitRetryHeadersMiddleware = omitRetryHeadersMiddleware;
exports.omitRetryHeadersMiddlewareOptions = omitRetryHeadersMiddlewareOptions;
