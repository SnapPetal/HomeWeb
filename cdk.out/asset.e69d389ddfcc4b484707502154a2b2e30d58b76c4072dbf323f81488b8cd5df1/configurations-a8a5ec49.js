'use strict';

var httpRequest = require('./httpRequest-eeeab15a.js');
var crypto = require('crypto');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

var retryMiddleware = function (options) {
    return function (next, context) {
        return function (args) { return httpRequest.__awaiter(void 0, void 0, void 0, function () {
            var retryStrategy;
            return httpRequest.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, options.retryStrategy()];
                    case 1:
                        retryStrategy = _a.sent();
                        if (retryStrategy === null || retryStrategy === void 0 ? void 0 : retryStrategy.mode)
                            context.userAgent = httpRequest.__spreadArray(httpRequest.__spreadArray([], httpRequest.__read((context.userAgent || []))), [["cfg/retry-mode", retryStrategy.mode]]);
                        return [2 /*return*/, retryStrategy.retry(next, args)];
                }
            });
        }); };
    };
};
var retryMiddlewareOptions = {
    name: "retryMiddleware",
    tags: ["RETRY"],
    step: "finalizeRequest",
    priority: "high",
    override: true,
};
var getRetryPlugin = function (options) { return ({
    applyToStack: function (clientStack) {
        clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
    },
}); };

/**
 * The base number of milliseconds to use in calculating a suitable cool-down
 * time when a retryable error is encountered.
 */
var DEFAULT_RETRY_DELAY_BASE = 100;
/**
 * The maximum amount of time (in milliseconds) that will be used as a delay
 * between retry attempts.
 */
var MAXIMUM_RETRY_DELAY = 20 * 1000;
/**
 * The retry delay base (in milliseconds) to use when a throttling error is
 * encountered.
 */
var THROTTLING_RETRY_DELAY_BASE = 500;
/**
 * Initial number of retry tokens in Retry Quota
 */
var INITIAL_RETRY_TOKENS = 500;
/**
 * The total amount of retry tokens to be decremented from retry token balance.
 */
var RETRY_COST = 5;
/**
 * The total amount of retry tokens to be decremented from retry token balance
 * when a throttling error is encountered.
 */
var TIMEOUT_RETRY_COST = 10;
/**
 * The total amount of retry token to be incremented from retry token balance
 * if an SDK operation invocation succeeds without requiring a retry request.
 */
var NO_RETRY_INCREMENT = 1;
/**
 * Header name for SDK invocation ID
 */
var INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
/**
 * Header name for request retry information.
 */
var REQUEST_HEADER = "amz-sdk-request";

/**
 * Errors encountered when the client clock and server clock cannot agree on the
 * current time.
 *
 * These errors are retryable, assuming the SDK has enabled clock skew
 * correction.
 */
var CLOCK_SKEW_ERROR_CODES = [
    "AuthFailure",
    "InvalidSignatureException",
    "RequestExpired",
    "RequestInTheFuture",
    "RequestTimeTooSkewed",
    "SignatureDoesNotMatch",
];
/**
 * Errors that indicate the SDK is being throttled.
 *
 * These errors are always retryable.
 */
var THROTTLING_ERROR_CODES = [
    "BandwidthLimitExceeded",
    "EC2ThrottledException",
    "LimitExceededException",
    "PriorRequestNotComplete",
    "ProvisionedThroughputExceededException",
    "RequestLimitExceeded",
    "RequestThrottled",
    "RequestThrottledException",
    "SlowDown",
    "ThrottledException",
    "Throttling",
    "ThrottlingException",
    "TooManyRequestsException",
    "TransactionInProgressException", // DynamoDB
];
/**
 * Error codes that indicate transient issues
 */
var TRANSIENT_ERROR_CODES = ["AbortError", "TimeoutError", "RequestTimeout", "RequestTimeoutException"];
/**
 * Error codes that indicate transient issues
 */
var TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];

var isRetryableByTrait = function (error) { return error.$retryable !== undefined; };
var isClockSkewError = function (error) { return CLOCK_SKEW_ERROR_CODES.includes(error.name); };
var isThrottlingError = function (error) {
    var _a, _b;
    return ((_a = error.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) === 429 ||
        THROTTLING_ERROR_CODES.includes(error.name) ||
        ((_b = error.$retryable) === null || _b === void 0 ? void 0 : _b.throttling) == true;
};
var isTransientError = function (error) {
    var _a;
    return TRANSIENT_ERROR_CODES.includes(error.name) ||
        TRANSIENT_ERROR_STATUS_CODES.includes(((_a = error.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) || 0);
};

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto__default['default'].randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

function validate(uuid) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

function v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return stringify(rnds);
}

exports.RETRY_MODES = void 0;
(function (RETRY_MODES) {
    RETRY_MODES["STANDARD"] = "standard";
    RETRY_MODES["ADAPTIVE"] = "adaptive";
})(exports.RETRY_MODES || (exports.RETRY_MODES = {}));
/**
 * The default value for how many HTTP requests an SDK should make for a
 * single SDK operation invocation before giving up
 */
var DEFAULT_MAX_ATTEMPTS = 3;
/**
 * The default retry algorithm to use.
 */
var DEFAULT_RETRY_MODE = exports.RETRY_MODES.STANDARD;

var getDefaultRetryQuota = function (initialRetryTokens, options) {
    var _a, _b, _c;
    var MAX_CAPACITY = initialRetryTokens;
    var noRetryIncrement = (_a = options === null || options === void 0 ? void 0 : options.noRetryIncrement) !== null && _a !== void 0 ? _a : NO_RETRY_INCREMENT;
    var retryCost = (_b = options === null || options === void 0 ? void 0 : options.retryCost) !== null && _b !== void 0 ? _b : RETRY_COST;
    var timeoutRetryCost = (_c = options === null || options === void 0 ? void 0 : options.timeoutRetryCost) !== null && _c !== void 0 ? _c : TIMEOUT_RETRY_COST;
    var availableCapacity = initialRetryTokens;
    var getCapacityAmount = function (error) { return (error.name === "TimeoutError" ? timeoutRetryCost : retryCost); };
    var hasRetryTokens = function (error) { return getCapacityAmount(error) <= availableCapacity; };
    var retrieveRetryTokens = function (error) {
        if (!hasRetryTokens(error)) {
            // retryStrategy should stop retrying, and return last error
            throw new Error("No retry token available");
        }
        var capacityAmount = getCapacityAmount(error);
        availableCapacity -= capacityAmount;
        return capacityAmount;
    };
    var releaseRetryTokens = function (capacityReleaseAmount) {
        availableCapacity += capacityReleaseAmount !== null && capacityReleaseAmount !== void 0 ? capacityReleaseAmount : noRetryIncrement;
        availableCapacity = Math.min(availableCapacity, MAX_CAPACITY);
    };
    return Object.freeze({
        hasRetryTokens: hasRetryTokens,
        retrieveRetryTokens: retrieveRetryTokens,
        releaseRetryTokens: releaseRetryTokens,
    });
};

/**
 * Calculate a capped, fully-jittered exponential backoff time.
 */
var defaultDelayDecider = function (delayBase, attempts) {
    return Math.floor(Math.min(MAXIMUM_RETRY_DELAY, Math.random() * Math.pow(2, attempts) * delayBase));
};

var defaultRetryDecider = function (error) {
    if (!error) {
        return false;
    }
    return isRetryableByTrait(error) || isClockSkewError(error) || isThrottlingError(error) || isTransientError(error);
};

var StandardRetryStrategy = /** @class */ (function () {
    function StandardRetryStrategy(maxAttemptsProvider, options) {
        var _a, _b, _c;
        this.maxAttemptsProvider = maxAttemptsProvider;
        this.mode = exports.RETRY_MODES.STANDARD;
        this.retryDecider = (_a = options === null || options === void 0 ? void 0 : options.retryDecider) !== null && _a !== void 0 ? _a : defaultRetryDecider;
        this.delayDecider = (_b = options === null || options === void 0 ? void 0 : options.delayDecider) !== null && _b !== void 0 ? _b : defaultDelayDecider;
        this.retryQuota = (_c = options === null || options === void 0 ? void 0 : options.retryQuota) !== null && _c !== void 0 ? _c : getDefaultRetryQuota(INITIAL_RETRY_TOKENS);
    }
    StandardRetryStrategy.prototype.shouldRetry = function (error, attempts, maxAttempts) {
        return attempts < maxAttempts && this.retryDecider(error) && this.retryQuota.hasRetryTokens(error);
    };
    StandardRetryStrategy.prototype.getMaxAttempts = function () {
        return httpRequest.__awaiter(this, void 0, void 0, function () {
            var maxAttempts;
            return httpRequest.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.maxAttemptsProvider()];
                    case 1:
                        maxAttempts = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a.sent();
                        maxAttempts = DEFAULT_MAX_ATTEMPTS;
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, maxAttempts];
                }
            });
        });
    };
    StandardRetryStrategy.prototype.retry = function (next, args, options) {
        return httpRequest.__awaiter(this, void 0, void 0, function () {
            var retryTokenAmount, attempts, totalDelay, maxAttempts, request, _loop_1, this_1, state_1;
            return httpRequest.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        attempts = 0;
                        totalDelay = 0;
                        return [4 /*yield*/, this.getMaxAttempts()];
                    case 1:
                        maxAttempts = _a.sent();
                        request = args.request;
                        if (httpRequest.HttpRequest.isInstance(request)) {
                            request.headers[INVOCATION_ID_HEADER] = v4();
                        }
                        _loop_1 = function () {
                            var _b, response, output, e_1, err, delay_1;
                            return httpRequest.__generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _c.trys.push([0, 4, , 7]);
                                        if (httpRequest.HttpRequest.isInstance(request)) {
                                            request.headers[REQUEST_HEADER] = "attempt=" + (attempts + 1) + "; max=" + maxAttempts;
                                        }
                                        if (!(options === null || options === void 0 ? void 0 : options.beforeRequest)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, options.beforeRequest()];
                                    case 1:
                                        _c.sent();
                                        _c.label = 2;
                                    case 2: return [4 /*yield*/, next(args)];
                                    case 3:
                                        _b = _c.sent(), response = _b.response, output = _b.output;
                                        if (options === null || options === void 0 ? void 0 : options.afterRequest) {
                                            options.afterRequest(response);
                                        }
                                        this_1.retryQuota.releaseRetryTokens(retryTokenAmount);
                                        output.$metadata.attempts = attempts + 1;
                                        output.$metadata.totalRetryDelay = totalDelay;
                                        return [2 /*return*/, { value: { response: response, output: output } }];
                                    case 4:
                                        e_1 = _c.sent();
                                        err = asSdkError(e_1);
                                        attempts++;
                                        if (!this_1.shouldRetry(err, attempts, maxAttempts)) return [3 /*break*/, 6];
                                        retryTokenAmount = this_1.retryQuota.retrieveRetryTokens(err);
                                        delay_1 = this_1.delayDecider(isThrottlingError(err) ? THROTTLING_RETRY_DELAY_BASE : DEFAULT_RETRY_DELAY_BASE, attempts);
                                        totalDelay += delay_1;
                                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                                    case 5:
                                        _c.sent();
                                        return [2 /*return*/, "continue"];
                                    case 6:
                                        if (!err.$metadata) {
                                            err.$metadata = {};
                                        }
                                        err.$metadata.attempts = attempts;
                                        err.$metadata.totalRetryDelay = totalDelay;
                                        throw err;
                                    case 7: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 2;
                    case 2:
                        return [5 /*yield**/, _loop_1()];
                    case 3:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        return [3 /*break*/, 2];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return StandardRetryStrategy;
}());
var asSdkError = function (error) {
    if (error instanceof Error)
        return error;
    if (error instanceof Object)
        return Object.assign(new Error(), error);
    if (typeof error === "string")
        return new Error(error);
    return new Error("AWS SDK error wrapper for " + error);
};

var DefaultRateLimiter = /** @class */ (function () {
    function DefaultRateLimiter(options) {
        var _a, _b, _c, _d, _e;
        // Pre-set state variables
        this.currentCapacity = 0;
        this.enabled = false;
        this.lastMaxRate = 0;
        this.measuredTxRate = 0;
        this.requestCount = 0;
        this.lastTimestamp = 0;
        this.timeWindow = 0;
        this.beta = (_a = options === null || options === void 0 ? void 0 : options.beta) !== null && _a !== void 0 ? _a : 0.7;
        this.minCapacity = (_b = options === null || options === void 0 ? void 0 : options.minCapacity) !== null && _b !== void 0 ? _b : 1;
        this.minFillRate = (_c = options === null || options === void 0 ? void 0 : options.minFillRate) !== null && _c !== void 0 ? _c : 0.5;
        this.scaleConstant = (_d = options === null || options === void 0 ? void 0 : options.scaleConstant) !== null && _d !== void 0 ? _d : 0.4;
        this.smooth = (_e = options === null || options === void 0 ? void 0 : options.smooth) !== null && _e !== void 0 ? _e : 0.8;
        var currentTimeInSeconds = this.getCurrentTimeInSeconds();
        this.lastThrottleTime = currentTimeInSeconds;
        this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
        this.fillRate = this.minFillRate;
        this.maxCapacity = this.minCapacity;
    }
    DefaultRateLimiter.prototype.getCurrentTimeInSeconds = function () {
        return Date.now() / 1000;
    };
    DefaultRateLimiter.prototype.getSendToken = function () {
        return httpRequest.__awaiter(this, void 0, void 0, function () {
            return httpRequest.__generator(this, function (_a) {
                return [2 /*return*/, this.acquireTokenBucket(1)];
            });
        });
    };
    DefaultRateLimiter.prototype.acquireTokenBucket = function (amount) {
        return httpRequest.__awaiter(this, void 0, void 0, function () {
            var delay_1;
            return httpRequest.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Client side throttling is not enabled until we see a throttling error.
                        if (!this.enabled) {
                            return [2 /*return*/];
                        }
                        this.refillTokenBucket();
                        if (!(amount > this.currentCapacity)) return [3 /*break*/, 2];
                        delay_1 = ((amount - this.currentCapacity) / this.fillRate) * 1000;
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, delay_1); })];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.currentCapacity = this.currentCapacity - amount;
                        return [2 /*return*/];
                }
            });
        });
    };
    DefaultRateLimiter.prototype.refillTokenBucket = function () {
        var timestamp = this.getCurrentTimeInSeconds();
        if (!this.lastTimestamp) {
            this.lastTimestamp = timestamp;
            return;
        }
        var fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
        this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
        this.lastTimestamp = timestamp;
    };
    DefaultRateLimiter.prototype.updateClientSendingRate = function (response) {
        var calculatedRate;
        this.updateMeasuredRate();
        if (isThrottlingError(response)) {
            var rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
            this.lastMaxRate = rateToUse;
            this.calculateTimeWindow();
            this.lastThrottleTime = this.getCurrentTimeInSeconds();
            calculatedRate = this.cubicThrottle(rateToUse);
            this.enableTokenBucket();
        }
        else {
            this.calculateTimeWindow();
            calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
        }
        var newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
        this.updateTokenBucketRate(newRate);
    };
    DefaultRateLimiter.prototype.calculateTimeWindow = function () {
        this.timeWindow = this.getPrecise(Math.pow((this.lastMaxRate * (1 - this.beta)) / this.scaleConstant, 1 / 3));
    };
    DefaultRateLimiter.prototype.cubicThrottle = function (rateToUse) {
        return this.getPrecise(rateToUse * this.beta);
    };
    DefaultRateLimiter.prototype.cubicSuccess = function (timestamp) {
        return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
    };
    DefaultRateLimiter.prototype.enableTokenBucket = function () {
        this.enabled = true;
    };
    DefaultRateLimiter.prototype.updateTokenBucketRate = function (newRate) {
        // Refill based on our current rate before we update to the new fill rate.
        this.refillTokenBucket();
        this.fillRate = Math.max(newRate, this.minFillRate);
        this.maxCapacity = Math.max(newRate, this.minCapacity);
        // When we scale down we can't have a current capacity that exceeds our maxCapacity.
        this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
    };
    DefaultRateLimiter.prototype.updateMeasuredRate = function () {
        var t = this.getCurrentTimeInSeconds();
        var timeBucket = Math.floor(t * 2) / 2;
        this.requestCount++;
        if (timeBucket > this.lastTxRateBucket) {
            var currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
            this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
            this.requestCount = 0;
            this.lastTxRateBucket = timeBucket;
        }
    };
    DefaultRateLimiter.prototype.getPrecise = function (num) {
        return parseFloat(num.toFixed(8));
    };
    return DefaultRateLimiter;
}());

var AdaptiveRetryStrategy = /** @class */ (function (_super) {
    httpRequest.__extends(AdaptiveRetryStrategy, _super);
    function AdaptiveRetryStrategy(maxAttemptsProvider, options) {
        var _this = this;
        var _a = options !== null && options !== void 0 ? options : {}, rateLimiter = _a.rateLimiter, superOptions = httpRequest.__rest(_a, ["rateLimiter"]);
        _this = _super.call(this, maxAttemptsProvider, superOptions) || this;
        _this.rateLimiter = rateLimiter !== null && rateLimiter !== void 0 ? rateLimiter : new DefaultRateLimiter();
        _this.mode = exports.RETRY_MODES.ADAPTIVE;
        return _this;
    }
    AdaptiveRetryStrategy.prototype.retry = function (next, args) {
        return httpRequest.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return httpRequest.__generator(this, function (_a) {
                return [2 /*return*/, _super.prototype.retry.call(this, next, args, {
                        beforeRequest: function () { return httpRequest.__awaiter(_this, void 0, void 0, function () {
                            return httpRequest.__generator(this, function (_a) {
                                return [2 /*return*/, this.rateLimiter.getSendToken()];
                            });
                        }); },
                        afterRequest: function (response) {
                            _this.rateLimiter.updateClientSendingRate(response);
                        },
                    })];
            });
        });
    };
    return AdaptiveRetryStrategy;
}(StandardRetryStrategy));

var ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
var CONFIG_MAX_ATTEMPTS = "max_attempts";
var NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
    environmentVariableSelector: function (env) {
        var value = env[ENV_MAX_ATTEMPTS];
        if (!value)
            return undefined;
        var maxAttempt = parseInt(value);
        if (Number.isNaN(maxAttempt)) {
            throw new Error("Environment variable " + ENV_MAX_ATTEMPTS + " mast be a number, got \"" + value + "\"");
        }
        return maxAttempt;
    },
    configFileSelector: function (profile) {
        var value = profile[CONFIG_MAX_ATTEMPTS];
        if (!value)
            return undefined;
        var maxAttempt = parseInt(value);
        if (Number.isNaN(maxAttempt)) {
            throw new Error("Shared config file entry " + CONFIG_MAX_ATTEMPTS + " mast be a number, got \"" + value + "\"");
        }
        return maxAttempt;
    },
    default: DEFAULT_MAX_ATTEMPTS,
};
var resolveRetryConfig = function (input) {
    var maxAttempts = normalizeMaxAttempts(input.maxAttempts);
    return httpRequest.__assign(httpRequest.__assign({}, input), { maxAttempts: maxAttempts, retryStrategy: function () { return httpRequest.__awaiter(void 0, void 0, void 0, function () {
            var retryMode, _a;
            return httpRequest.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (input.retryStrategy) {
                            return [2 /*return*/, input.retryStrategy];
                        }
                        _a = input.retryMode;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, input.retryModeProvider()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        retryMode = _a;
                        if (retryMode === exports.RETRY_MODES.ADAPTIVE) {
                            return [2 /*return*/, new AdaptiveRetryStrategy(maxAttempts)];
                        }
                        return [2 /*return*/, new StandardRetryStrategy(maxAttempts)];
                }
            });
        }); } });
};
var normalizeMaxAttempts = function (maxAttempts) {
    if (maxAttempts === void 0) { maxAttempts = DEFAULT_MAX_ATTEMPTS; }
    if (typeof maxAttempts === "number") {
        var promisified_1 = Promise.resolve(maxAttempts);
        return function () { return promisified_1; };
    }
    return maxAttempts;
};
var ENV_RETRY_MODE = "AWS_RETRY_MODE";
var CONFIG_RETRY_MODE = "retry_mode";
var NODE_RETRY_MODE_CONFIG_OPTIONS = {
    environmentVariableSelector: function (env) { return env[ENV_RETRY_MODE]; },
    configFileSelector: function (profile) { return profile[CONFIG_RETRY_MODE]; },
    default: DEFAULT_RETRY_MODE,
};

exports.AdaptiveRetryStrategy = AdaptiveRetryStrategy;
exports.CONFIG_MAX_ATTEMPTS = CONFIG_MAX_ATTEMPTS;
exports.CONFIG_RETRY_MODE = CONFIG_RETRY_MODE;
exports.DEFAULT_MAX_ATTEMPTS = DEFAULT_MAX_ATTEMPTS;
exports.DEFAULT_RETRY_MODE = DEFAULT_RETRY_MODE;
exports.DefaultRateLimiter = DefaultRateLimiter;
exports.ENV_MAX_ATTEMPTS = ENV_MAX_ATTEMPTS;
exports.ENV_RETRY_MODE = ENV_RETRY_MODE;
exports.INVOCATION_ID_HEADER = INVOCATION_ID_HEADER;
exports.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = NODE_MAX_ATTEMPT_CONFIG_OPTIONS;
exports.NODE_RETRY_MODE_CONFIG_OPTIONS = NODE_RETRY_MODE_CONFIG_OPTIONS;
exports.REQUEST_HEADER = REQUEST_HEADER;
exports.StandardRetryStrategy = StandardRetryStrategy;
exports.defaultDelayDecider = defaultDelayDecider;
exports.defaultRetryDecider = defaultRetryDecider;
exports.getRetryPlugin = getRetryPlugin;
exports.resolveRetryConfig = resolveRetryConfig;
exports.retryMiddleware = retryMiddleware;
exports.retryMiddlewareOptions = retryMiddlewareOptions;
