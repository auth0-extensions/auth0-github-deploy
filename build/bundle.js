module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var url = __webpack_require__(62);
	var tools = __webpack_require__(12);
	
	var expressApp = __webpack_require__(90);
	var config = __webpack_require__(4);
	var logger = __webpack_require__(13);
	var webtask = __webpack_require__(94);
	
	tools.urlHelpers.getBaseUrl = function (req) {
	  var originalUrl = url.parse(req.originalUrl || '').pathname || '';
	  return url.format({
	    protocol: 'https',
	    host: req.headers.host,
	    pathname: originalUrl.replace(req.path, '').replace(/\/$/g, '')
	  });
	};
	
	var createServer = tools.createServer(function (cfg, storage) {
	  logger.info('Starting GitHub Deploy Extension - Version:', ("2.1.0"));
	  return expressApp(cfg, storage);
	});
	
	module.exports = function (context, req, res) {
	  config.setValue('PUBLIC_WT_URL', webtask.getUrl(req));
	  createServer(context, req, res);
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("lodash@4.8.2");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports.ArgumentError = __webpack_require__(68);
	module.exports.ForbiddenError = __webpack_require__(69);
	module.exports.HookTokenError = __webpack_require__(70);
	module.exports.ManagementApiError = __webpack_require__(71);
	module.exports.NotFoundError = __webpack_require__(72);
	module.exports.UnauthorizedError = __webpack_require__(73);
	module.exports.ValidationError = __webpack_require__(74);


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("bluebird");

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	var settings = {};
	var currentProvider = null;
	
	var config = function config(key) {
	  if (settings && settings[key]) {
	    return settings[key];
	  }
	
	  if (!currentProvider) {
	    throw new Error('A configuration provider has not been set');
	  }
	
	  return currentProvider(key);
	};
	
	config.setProvider = function (providerFunction) {
	  currentProvider = providerFunction;
	};
	
	config.setValue = function (key, value) {
	  settings[key] = value;
	};
	
	module.exports = config;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Webtask = __webpack_require__(161);
	
	const errors = __webpack_require__(2);
	const storage = __webpack_require__(77);
	
	const tools = module.exports = { };
	
	/*
	 * Errors exposed by the library.
	 */
	tools.ArgumentError = errors.ArgumentError;
	tools.ForbiddenError = errors.ForbiddenError;
	tools.HookTokenError = errors.HookTokenError;
	tools.ManagementApiError = errors.ManagementApiError;
	tools.NotFoundError = errors.NotFoundError;
	tools.UnauthorizedError = errors.UnauthorizedError;
	tools.ValidationError = errors.ValidationError;
	
	/*
	 * Helper for the Management Api.
	 */
	tools.managementApi = __webpack_require__(64);
	
	/*
	 * Storage helpers.
	 */
	tools.FileStorageContext = storage.FileStorageContext;
	tools.WebtaskStorageContext = storage.WebtaskStorageContext;
	
	/*
	 * Helpers that expose CRUD capablities to storage.
	 */
	tools.BlobRecordProvider = __webpack_require__(65);
	
	/*
	 * Helper that providers a configuration object containing one or more settings.
	 */
	tools.config = __webpack_require__(66);
	tools.configProvider = __webpack_require__(34);
	
	/*
	 * Bootstrap function to run initialize a server (connect, express, ...).
	 */
	tools.createServer = __webpack_require__(67).createServer;
	
	/*
	 * Validate a token for webtask hooks.
	 */
	tools.validateHookToken = __webpack_require__(79);
	
	/*
	 * Session.
	 */
	tools.SessionManager = __webpack_require__(75);
	
	/*
	 * Bootstrap function to run initialize an Express server.
	 */
	tools.createExpressServer = function createExpressServer(cb) {
	  return Webtask.fromExpress(tools.createServer(cb));
	};
	
	/*
	 * Bootstrap function to run initialize a Hapi server.
	 */
	tools.createHapiServer = function createHapiServer(cb) {
	  return Webtask.fromHapi(tools.createServer(cb));
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(48)('wks')
	  , uid        = __webpack_require__(49)
	  , Symbol     = __webpack_require__(11).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 9 */
/***/ function(module, exports) {

	const constants = module.exports = { };
	constants.RULES_DIRECTORY = 'rules';
	constants.RULES_STAGES = [
	  'login_success'
	];
	constants.DEFAULT_RULE_STAGE = constants.RULES_STAGES[0];
	
	constants.PAGES_DIRECTORY = 'pages';
	constants.PAGE_LOGIN = 'login';
	constants.PAGE_PASSWORD_RESET = 'password_reset';
	constants.PAGE_GUARDIAN_MULTIFACTOR = 'guardian_multifactor';
	constants.PAGE_ERROR = 'error_page';
	
	constants.PAGE_NAMES = [
	  constants.PAGE_GUARDIAN_MULTIFACTOR + '.html',
	  constants.PAGE_GUARDIAN_MULTIFACTOR + '.json',
	  constants.PAGE_PASSWORD_RESET + '.html',
	  constants.PAGE_PASSWORD_RESET + '.json',
	  constants.PAGE_LOGIN + '.html',
	  constants.PAGE_LOGIN + '.json',
	  constants.PAGE_ERROR + '.html',
	  constants.PAGE_ERROR + '.json'
	];
	
	constants.DATABASE_CONNECTIONS_DIRECTORY = 'database-connections';
	constants.DATABASE_SCRIPTS_CHANGE_EMAIL = 'change_email';
	constants.DATABASE_SCRIPTS_GET_USER = 'get_user';
	constants.DATABASE_SCRIPTS = [
	  constants.DATABASE_SCRIPTS_GET_USER,
	  'create',
	  'verify',
	  'login',
	  'change_password',
	  'delete',
	  constants.DATABASE_SCRIPTS_CHANGE_EMAIL
	];
	constants.DATABASE_SCRIPTS_NO_IMPORT = [
	  'create',
	  'verify',
	  'login',
	  'change_password',
	  'delete'
	];
	constants.DATABASE_SCRIPTS_IMPORT = [
	  constants.DATABASE_SCRIPTS_GET_USER,
	  'login'
	];
	
	constants.RESOURCE_SERVERS_DIRECTORY = 'resource-servers';
	constants.RESOURCE_SERVERS_CLIENT_NAME = 'resourceServers';
	constants.RESOURCE_SERVERS_MANAGEMENT_API_NAME = 'Auth0 Management API';
	constants.RESOURCE_SERVERS_ID_NAME = 'id';
	
	constants.CLIENTS_DIRECTORY = 'clients';
	constants.CLIENTS_CLIENT_NAME = 'clients';
	constants.CLIENTS_CLIENT_ID_NAME = 'client_id';
	
	constants.CONCURRENT_CALLS = 5;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(1);
	const crypto = __webpack_require__(58);
	const ValidationError = __webpack_require__(5).ValidationError;
	const ArgumentError = __webpack_require__(5).ArgumentError;
	
	const keywordReplace = function(input, mappings) {
	  if (mappings && Object.keys(mappings).length > 0) {
	    Object.keys(mappings).forEach(function(key) {
	      const re = new RegExp('@@' + key + '@@', 'g');
	      input = input.replace(re, JSON.stringify(mappings[key]));
	    });
	  }
	  return input;
	};
	
	const unifyScripts = function(data, mappings) {
	  const converted = {};
	  _.forEach(data, function(item) {
	    _.keys(item)
	      .filter(function(key) { return key.endsWith('File'); })
	      .forEach(function(key) {
	        /* foreach attribute that ends in file, do a keyword replacement, or stringify it */
	        if (typeof item[key] === 'object') {
	          item[key] = JSON.stringify(item[key]);
	        } else if (item[key]) {
	          item[key] = keywordReplace(item[key], mappings);
	        }
	      });
	
	    converted[item.name] = item;
	  });
	
	  return converted;
	};
	
	const generateChecksum = function(data) {
	  if (typeof data !== 'string') {
	    throw new ArgumentError('Must provide data as a string.');
	  }
	
	  const checksum = crypto.createHash('sha256').update(data).digest('hex');
	  return checksum;
	};
	
	module.exports.parseJsonFile = function(fileName, contents, mappings) {
	  try {
	    /* if mappings is defined, replace contents before parsing */
	    return JSON.parse(keywordReplace(contents, mappings));
	  } catch (e) {
	    throw new ValidationError('Error parsing JSON from metadata file: ' + fileName + ', because: ' +
	     JSON.stringify(e) + ', contents: ' + contents);
	  }
	};
	
	module.exports.checksumReplacer = function(exclusions) {
	  exclusions = exclusions || [];
	  if (typeof exclusions === 'string') {
	    exclusions = [ exclusions ];
	  }
	
	  return function(key, value) {
	    if (exclusions.includes(key) && typeof value === 'string') {
	      const checksum = generateChecksum(value);
	      return checksum;
	    }
	
	    return value;
	  };
	};
	
	module.exports.unifyDatabases = function(data, mappings) {
	  const converted = [];
	  _.forEach(data, function(item) {
	    const connection = {
	      name: item.name,
	      scripts: unifyScripts(item.scripts, mappings)
	    };
	
	    converted.push(connection);
	  });
	
	  return converted;
	};
	
	module.exports.unifyScripts = unifyScripts;


/***/ },
/* 11 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("auth0-extension-express-tools");

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var winston = __webpack_require__(63);
	
	winston.emitErrs = true;
	
	var logger = new winston.Logger({
	  transports: [new winston.transports.Console({
	    timestamp: true,
	    level: 'debug',
	    handleExceptions: true,
	    json: false,
	    colorize: true
	  })],
	  exitOnError: false
	});
	
	module.exports = logger;
	module.exports.stream = {
	  write: function write(message) {
	    logger.info(message.replace(/\n$/, ''));
	  }
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(24)
	  , createDesc = __webpack_require__(46);
	module.exports = __webpack_require__(17) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(23);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(18)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = require("jsonwebtoken");

/***/ },
/* 21 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(11)
	  , core      = __webpack_require__(6)
	  , ctx       = __webpack_require__(116)
	  , hide      = __webpack_require__(14)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(16)
	  , IE8_DOM_DEFINE = __webpack_require__(118)
	  , toPrimitive    = __webpack_require__(134)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(17) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(127)
	  , enumBugKeys = __webpack_require__(43);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(48)('keys')
	  , uid    = __webpack_require__(49);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 27 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(44)
	  , defined = __webpack_require__(21);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(21);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.JwksClient = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _debug = __webpack_require__(32);
	
	var _debug2 = _interopRequireDefault(_debug);
	
	var _request = __webpack_require__(159);
	
	var _request2 = _interopRequireDefault(_request);
	
	var _ArgumentError = __webpack_require__(52);
	
	var _ArgumentError2 = _interopRequireDefault(_ArgumentError);
	
	var _JwksError = __webpack_require__(53);
	
	var _JwksError2 = _interopRequireDefault(_JwksError);
	
	var _SigningKeyNotFoundError = __webpack_require__(55);
	
	var _SigningKeyNotFoundError2 = _interopRequireDefault(_SigningKeyNotFoundError);
	
	var _utils = __webpack_require__(145);
	
	var _wrappers = __webpack_require__(147);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var JwksClient = exports.JwksClient = function () {
	  function JwksClient(options) {
	    var _this = this;
	
	    _classCallCheck(this, JwksClient);
	
	    this.getSigningKey = function (kid, cb) {
	      _this.logger('Fetching signing key for \'' + kid + '\'');
	
	      _this.getSigningKeys(function (err, keys) {
	        if (err) {
	          return cb(err);
	        }
	
	        var key = keys.find(function (k) {
	          return k.kid === kid;
	        });
	        if (key) {
	          return cb(null, key);
	        } else {
	          _this.logger('Unable to find a signing key that matches \'' + kid + '\'');
	          return cb(new _SigningKeyNotFoundError2.default('Unable to find a signing key that matches \'' + kid + '\''));
	        }
	      });
	    };
	
	    this.options = _extends({ rateLimit: false, cache: false, strictSsl: true }, options);
	    this.logger = (0, _debug2.default)('jwks');
	
	    // Initialize wrappers.
	    if (this.options.rateLimit) {
	      this.getSigningKey = (0, _wrappers.rateLimitSigningKey)(this, options);
	    }
	    if (this.options.cache) {
	      this.getSigningKey = (0, _wrappers.cacheSigningKey)(this, options);
	    }
	  }
	
	  _createClass(JwksClient, [{
	    key: 'getKeys',
	    value: function getKeys(cb) {
	      var _this2 = this;
	
	      this.logger('Fetching keys from \'' + this.options.jwksUri + '\'');
	      (0, _request2.default)({ json: true, uri: this.options.jwksUri, strictSSL: this.options.strictSsl }, function (err, res) {
	        if (err || res.statusCode < 200 || res.statusCode >= 300) {
	          _this2.logger('Failure:', res && res.body || err);
	          if (res) {
	            return cb(new _JwksError2.default(res.body && (res.body.message || res.body) || res.statusMessage || 'Http Error ' + res.statusCode));
	          }
	          return cb(err);
	        }
	
	        _this2.logger('Keys:', res.body.keys);
	        return cb(null, res.body.keys);
	      });
	    }
	  }, {
	    key: 'getSigningKeys',
	    value: function getSigningKeys(cb) {
	      var _this3 = this;
	
	      this.getKeys(function (err, keys) {
	        if (err) {
	          return cb(err);
	        }
	
	        if (!keys || !keys.length) {
	          return cb(new _JwksError2.default('The JWKS endpoint did not contain any keys'));
	        }
	
	        var signingKeys = keys.filter(function (key) {
	          return key.use === 'sig' && key.kty === 'RSA' && key.kid && (key.x5c && key.x5c.length || key.n && key.e);
	        }).map(function (key) {
	          if (key.x5c && key.x5c.length) {
	            return { kid: key.kid, nbf: key.nbf, publicKey: (0, _utils.certToPEM)(key.x5c[0]) };
	          } else {
	            return { kid: key.kid, nbf: key.nbf, rsaPublicKey: (0, _utils.rsaPublicKeyToPEM)(key.n, key.e) };
	          }
	        });
	
	        if (!signingKeys.length) {
	          return cb(new _JwksError2.default('The JWKS endpoint did not contain any signing keys'));
	        }
	
	        _this3.logger('Signing Keys:', signingKeys);
	        return cb(null, signingKeys);
	      });
	    }
	  }]);
	
	  return JwksClient;
	}();

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.SigningKeyNotFoundError = exports.JwksRateLimitError = exports.JwksError = exports.ArgumentError = undefined;
	
	var _ArgumentError2 = __webpack_require__(52);
	
	var _ArgumentError3 = _interopRequireDefault(_ArgumentError2);
	
	var _JwksError2 = __webpack_require__(53);
	
	var _JwksError3 = _interopRequireDefault(_JwksError2);
	
	var _JwksRateLimitError2 = __webpack_require__(54);
	
	var _JwksRateLimitError3 = _interopRequireDefault(_JwksRateLimitError2);
	
	var _SigningKeyNotFoundError2 = __webpack_require__(55);
	
	var _SigningKeyNotFoundError3 = _interopRequireDefault(_SigningKeyNotFoundError2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.ArgumentError = _ArgumentError3.default;
	exports.JwksError = _JwksError3.default;
	exports.JwksRateLimitError = _JwksRateLimitError3.default;
	exports.SigningKeyNotFoundError = _SigningKeyNotFoundError3.default;

/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = require("debug");

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(1);
	const ArgumentError = __webpack_require__(2).ArgumentError;
	
	module.exports.fromWebtaskContext = function(webtaskContext) {
	  if (webtaskContext === null || webtaskContext === undefined) {
	    throw new ArgumentError('Must provide a webtask context');
	  }
	
	  const defaultConfig = {
	    AUTH0_RTA: 'auth0.auth0.com'
	  };
	
	  const settings = _.assign(defaultConfig, ({"NODE_ENV":"production","CLIENT_VERSION":"2.1.0"}), webtaskContext.params, webtaskContext.secrets, {
	    NODE_ENV: 'production',
	    HOSTING_ENV: 'webtask'
	  });
	
	  return function getSettings(key) {
	    return settings[key];
	  };
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(1);
	const Promise = __webpack_require__(3);
	const ValidationError = __webpack_require__(5).ValidationError;
	
	const utils = __webpack_require__(10);
	
	/**
	 * Process the metadata
	 * @param progress the state object
	 * @param client the management api client
	 * @param metaDataFunction the function to use for processing the metadata, if undefined will skip processing
	 * @param unit The existing unit.  Metadata is processed against an existing unit
	 * @param config The configuration that contains the metadata, if no metadata is defined, the method will be called with undefined metadata
	 */
	const processMetaData = function(progress, client, metaDataFunction, unit, unitConfig) {
	  /* Make sure we have a function to call */
	  if (metaDataFunction) {
	    if (unitConfig.metadataFile) {
	      /* Process the metadata if there is some defined */
	      const metaBody = utils.parseJsonFile(unit.name, unitConfig.metadataFile, progress.mappings);
	      return metaDataFunction(progress, client, unit, metaBody);
	    }
	
	    /* No metadata defined, call with undefined metadata */
	    return metaDataFunction(progress, client, unit);
	  }
	
	  /* No meta data, so just return false and the existing unit */
	  return Promise.resolve(false);
	};
	
	/**
	 * Update the existing unit
	 * @param type The type of unit
	 * @param progress the state object
	 * @param client the management api client
	 * @param unitName the name of this particular unit
	 * @param unitConfig the configuration for this particular unit
	 * @param existingUnit the existing unit that was in the DB
	 * @param metaDataFunction a function that can process the metadata if provided
	 * @returns {*}
	 */
	const updateExistingUnit = function(type, progress, client, unitName, unitConfig, existingUnit, metaDataFunction) {
	  /* Get entire config */
	  const unitBody = utils.parseJsonFile(unitName, unitConfig.configFile, progress.mappings);
	  unitBody.name = unitName;
	
	  /* Filter out things that haven't changed */
	  const changedConfigKeys = _(unitBody)
	    .keys()
	    .filter(function(key) {
	      return JSON.stringify(unitBody[key]) !== JSON.stringify(existingUnit[key]);
	    })
	    .value();
	
	  if (changedConfigKeys.length > 0) {
	    /* Make a new object with just the changed attributes */
	    const changedConfig = _.zipObject(changedConfigKeys, _.map(changedConfigKeys, function(key) { return unitBody[key]; }));
	    progress.configurables[type].updated += 1;
	    progress.log('Updating ' + type + ' ' + unitName + ': ' + JSON.stringify(changedConfig));
	    const params = {};
	    params[progress.configurables[type].idName] = existingUnit[progress.configurables[type].idName];
	    return client[type].update(params, changedConfig)
	      .then(function(unit) {
	        return processMetaData(progress, client, metaDataFunction, unit, unitConfig)
	          .then(function(changed) {
	            if (changed) {
	              progress.log('Updated metadata for ' + type + ', ' + unitName);
	            }
	            return Promise.resolve(unit);
	          });
	      });
	  }
	
	
	  /* Configuration did not change, try to process the metadata */
	  return processMetaData(progress, client, metaDataFunction, existingUnit, unitConfig)
	    .then(function(changed) {
	      if (changed) {
	        progress.log('Updated just the metadata for ' + type + ', ' + unitName);
	        progress.configurables[type].updated += 1;
	      } else {
	        progress.log('Skipping update of ' + type + ' ' + unitName + ', because no changes were found.');
	      }
	      return Promise.resolve(existingUnit);
	    });
	};
	
	
	/**
	 * Update existing clients
	 * @param progress the progress object
	 * @client the Auth0 client for the management API
	 * @return Promise for updating the existing clients
	 */
	const updateExistingUnits = function(type, progress, client, metaDataFunction) {
	  // Check if there is anything to do here
	  if (type in progress.configurables &&
	    progress.configurables[type].updates &&
	    Object.keys(progress.configurables[type].updates).length > 0) {
	    progress.log('Updating ' + type + '...');
	
	    /* First process clients we need to add */
	    return Promise.map(Object.keys(progress.configurables[type].updates),
	      function(unitName) {
	        return updateExistingUnit(
	          type,
	          progress,
	          client,
	          unitName,
	          progress.configurables[type].updates[unitName].config,
	          progress.configurables[type].updates[unitName].existing,
	          metaDataFunction
	        );
	      }
	    );
	  }
	
	  // No updateClients, so must not be any work here, just resolve happily
	  return Promise.resolve();
	};
	
	/**
	 * Create an individual unit
	 * @param progress state object
	 * @param client ManagementClient
	 * @param unitName The name of the unit to create
	 * @param unitConfig The JSON configuration of the unit
	 * @returns {unitConfig} The created unit
	 */
	const createUnit = function(type, progress, client, unitName, unitConfig, metaDataFunction) {
	  /* process unit */
	  const unitBody = utils.parseJsonFile(unitName, unitConfig.configFile, progress.mappings);
	  unitBody.name = unitName;
	  progress.configurables[type].created += 1;
	  progress.log('Creating ' + type + ' ' + unitName + ': ' + JSON.stringify(unitBody));
	  return client[type].create(unitBody)
	    .then(function(unit) {
	      return processMetaData(progress, client, metaDataFunction, unit, unitConfig)
	        .then(function(changed) {
	          if (changed) {
	            progress.log('Processed metadata for ' + type + ', ' + unitName);
	          }
	
	          Promise.resolve(unit);
	        });
	    });
	};
	
	/**
	 * Create new units
	 * @param progress the progress object
	 * @client the Auth0 client for the management API
	 * @return Promise for creating new units
	 */
	const createUnits = function(type, progress, client, metaDataFunction) {
	  // Check if there is anything to do here
	  if (type in progress.configurables &&
	    progress.configurables[type].adds &&
	    Object.keys(progress.configurables[type].adds).length > 0) {
	    progress.log('Creating ' + type + '...');
	
	    /* First process units we need to add */
	    return Promise.map(Object.keys(progress.configurables[type].adds),
	      function(unitName) {
	        return createUnit(type, progress, client, unitName, progress.configurables[type].adds[unitName], metaDataFunction);
	      }
	    );
	  }
	
	  // No units to add, so must not be any work here, just resolve happily
	  return Promise.resolve();
	};
	
	/**
	 * Update units
	 * @param type the type of object we are updating
	 * @param progress the progress object
	 * @param client the Auth0 client for the management API
	 * @param metaDataFunction function to call when processing metaData, it must return a promise and takes a metaData object
	 * @return Promise for creating new and updating existing units
	 */
	const update = function(type, progress, client, metaDataFunction) {
	  return createUnits(type, progress, client, metaDataFunction)
	    .then(function() {
	      return updateExistingUnits(type, progress, client, metaDataFunction);
	    });
	};
	
	/**
	 * Split the units into buckets for adding, updating, and deleting
	 */
	const splitUnits = function(type, progress, units, existingUnits, excludedUnits) {
	  /* Here split into different containers for type of unit action */
	  const unitNames = _(units).keys();
	  const existingUnitNames = _.map(existingUnits, 'name');
	  const excludedUnitIds = _.map(excludedUnits, progress.configurables[type].idName);
	  const existingNameToId = _.zipObject(existingUnitNames, _.map(existingUnits, function(unit) {
	    return unit[progress.configurables[type].idName];
	  }));
	
	  // Now grab the different buckets of names
	  const toAddUnitNames = _(unitNames).filter(function(name) {
	    return existingUnitNames.indexOf(name) < 0;
	  }).value();
	  const toDeleteUnitNames = _(existingUnitNames).filter(function(name) {
	    /* Find the name and make sure it wasn't in the excluded list */
	    return unitNames.indexOf(name) < 0 && (!excludedUnitIds || excludedUnitIds.indexOf(existingNameToId[name]));
	  }).value();
	  const toUpdateUnitNames = _(unitNames).filter(function(name) {
	    return existingUnitNames.indexOf(name) >= 0;
	  }).value();
	
	  progress.log('Adding ' + toAddUnitNames.length + ' ' + type + ' and Updating ' + toUpdateUnitNames.length +
	    type + '.  If implemented would be Deleting ' + toDeleteUnitNames.length + ' ' + type);
	
	  /*
	  Create set of units that we need to add with the config information
	   */
	  progress.configurables[type].adds = _.zipObject(toAddUnitNames,
	    _.map(toAddUnitNames, function(name) {
	      return units[name];
	    }));
	
	  /*
	  Just need the list of names we need to delete
	   */
	  progress.configurables[type].deletes = toDeleteUnitNames;
	
	  /*
	  Need both the config and existing information for units we need to update
	   */
	  progress.configurables[type].updates = _.zipObject(toUpdateUnitNames,
	    _.map(toUpdateUnitNames, function(name) {
	      return {
	        existing: _.find(existingUnits, [ 'name', name ]),
	        config: units[name]
	      };
	    }));
	
	  return existingUnits;
	};
	
	/**
	 * make sure we have configFile defined for everything
	 * @param units the list of units to add or update
	 * @param existingUnits the list of units that already have been added
	 * @returns {Promise.<*>}
	 */
	const validateUnitsExistence = function(type, progress, units, existingUnits) {
	  var existingUnitsFiltered = existingUnits;
	
	  /* Check that the units are formed well */
	  const invalidUnits = _(units)
	    .keys()
	    .filter(function(unitName) {
	      return !units[unitName].configFile;
	    })
	    .value();
	
	  if (invalidUnits.length) {
	    return Promise.reject(
	      new ValidationError('The following ' + type + ' have no config file: ' + invalidUnits.join())
	    );
	  }
	
	  /* Also make sure unit name either matches or is not in the script */
	  const invalidNames = _(units)
	    .keys()
	    .filter(function(unitName) {
	      /* Parse configFile */
	      const config = utils.parseJsonFile(unitName, units[unitName].configFile, progress.mappings);
	      return config.name && config.name !== unitName;
	    })
	    .value();
	
	  if (invalidNames.length) {
	    return Promise.reject(
	      new ValidationError('The following ' + type + ' have key names that do not match the configured name in the configFile: ' + invalidNames.join())
	    );
	  }
	
	  if (existingUnits && existingUnits.length > 0 && !(progress.configurables[type].idName in existingUnits[0])) {
	    return Promise.reject(
	      new ValidationError('Attempted to use ' + progress.configurables[type].idName + ' for idName for ' + type + ' but did not find that attribute in the existing ' + type + '.')
	    );
	  }
	
	  return Promise.resolve(existingUnitsFiltered);
	};
	
	/*
	 * Validate units before touching anything.
	 *
	 * Failure States => Ensure names match and configFile is defined
	 *
	 * Side-effects => progress should include the set of units that already exist with this name
	 *              => progress should include the set of units that need to be created
	 *
	 */
	const validate = function(type, progress, client, units, existingUnits, excludedUnits, idName) {
	  const unitNames = _.keys(units);
	  if (unitNames.length === 0) {
	    return Promise.resolve(true);
	  }
	
	  progress.log('Validating ' + type + '...');
	
	  progress.configurables[type].idName = idName || 'id';
	
	  return validateUnitsExistence(type, progress, units, existingUnits)
	    .then(function(existingUnitsFiltered) {
	      return splitUnits(type, progress, units, existingUnitsFiltered, excludedUnits);
	    });
	};
	
	module.exports = {
	  update: update,
	  validate: validate
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	const constants = __webpack_require__(9);
	const deploy = __webpack_require__(86);
	const utils = __webpack_require__(10);
	
	module.exports.constants = constants;
	module.exports.deploy = deploy;
	
	module.exports.unifyDatabases = utils.unifyDatabases;
	module.exports.unifyScripts = utils.unifyScripts;
	module.exports.unifyConfigs = utils.unifyConfigs;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _auth0SourceControlExtensionTools = __webpack_require__(36);
	
	var _config = __webpack_require__(4);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _github = __webpack_require__(38);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (storage, id, branch, repository, sha, user, client) {
	  var context = {
	    init: function init() {
	      return (0, _github.getChanges)(repository, branch, sha).then(function (data) {
	        context.pages = data.pages;
	        context.rules = data.rules;
	        context.databases = data.databases;
	      });
	    }
	  };
	
	  var slackTemplate = {
	    fallback: 'GitHub to Auth0 Deployment',
	    text: 'GitHub to Auth0 Deployment'
	  };
	
	  return (0, _auth0SourceControlExtensionTools.deploy)({ id: id, branch: branch, repository: repository, sha: sha, user: user }, context, client, storage, _config2.default, slackTemplate);
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getChanges = exports.hasChanges = undefined;
	
	var _stringify = __webpack_require__(104);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _extends2 = __webpack_require__(107);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _keys = __webpack_require__(106);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _slicedToArray2 = __webpack_require__(39);
	
	var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);
	
	var _lodash = __webpack_require__(1);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _path = __webpack_require__(33);
	
	var _path2 = _interopRequireDefault(_path);
	
	var _bluebird = __webpack_require__(3);
	
	var _bluebird2 = _interopRequireDefault(_bluebird);
	
	var _github = __webpack_require__(155);
	
	var _github2 = _interopRequireDefault(_github);
	
	var _requestPromise = __webpack_require__(160);
	
	var _requestPromise2 = _interopRequireDefault(_requestPromise);
	
	var _auth0SourceControlExtensionTools = __webpack_require__(36);
	
	var _config = __webpack_require__(4);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _logger = __webpack_require__(13);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * Check if a file is part of the rules folder.
	 */
	var isRule = function isRule(file) {
	  return file.indexOf(_auth0SourceControlExtensionTools.constants.RULES_DIRECTORY + '/') === 0;
	};
	
	/*
	 * Check if a file is part of the database folder.
	 */
	var isDatabaseConnection = function isDatabaseConnection(file) {
	  return file.indexOf(_auth0SourceControlExtensionTools.constants.DATABASE_CONNECTIONS_DIRECTORY + '/') === 0;
	};
	
	/*
	 * Check if a file is part of the pages folder.
	 */
	var isPage = function isPage(file) {
	  return file.indexOf(_auth0SourceControlExtensionTools.constants.PAGES_DIRECTORY + '/') === 0 && _auth0SourceControlExtensionTools.constants.PAGE_NAMES.indexOf(file.split('/').pop()) >= 0;
	};
	
	/*
	 * Get the details of a database file script.
	 */
	var getDatabaseScriptDetails = function getDatabaseScriptDetails(filename) {
	  var parts = filename.split('/');
	  if (parts.length === 3 && /\.js$/i.test(parts[2])) {
	    var scriptName = _path2.default.parse(parts[2]).name;
	    if (_auth0SourceControlExtensionTools.constants.DATABASE_SCRIPTS.indexOf(scriptName) > -1) {
	      return {
	        database: parts[1],
	        name: _path2.default.parse(scriptName).name
	      };
	    }
	  }
	
	  return null;
	};
	
	/*
	 * Only Javascript and JSON files.
	 */
	var validFilesOnly = function validFilesOnly(fileName) {
	  if (isPage(fileName)) {
	    return true;
	  } else if (isRule(fileName)) {
	    return (/\.(js|json)$/i.test(fileName)
	    );
	  } else if (isDatabaseConnection(fileName)) {
	    var script = getDatabaseScriptDetails(fileName);
	    return !!script;
	  }
	  return false;
	};
	
	/*
	 * Get a flat list of changes and files that need to be added/updated/removed.
	 */
	var hasChanges = exports.hasChanges = function hasChanges(commits) {
	  return _lodash2.default.chain(commits).map(function (commit) {
	    return _lodash2.default.union(commit.added, commit.modified, commit.removed);
	  }).flattenDeep().uniq().filter(validFilesOnly).value().length > 0;
	};
	
	/*
	 * Parse the repository.
	 */
	var parseRepo = function parseRepo() {
	  var repository = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	
	  var parts = repository.split('/');
	  if (parts.length === 2) {
	    var _parts = (0, _slicedToArray3.default)(parts, 2),
	        user = _parts[0],
	        repo = _parts[1];
	
	    return { user: user, repo: repo };
	  } else if (parts.length === 5) {
	    var _parts2 = (0, _slicedToArray3.default)(parts, 5),
	        _user = _parts2[3],
	        _repo = _parts2[4];
	
	    return { user: _user, repo: _repo };
	  }
	
	  throw new Error('Invalid repository: ' + repository);
	};
	
	/*
	 * Get tree.
	 */
	var getTree = function getTree(repository, branch, sha) {
	  return new _bluebird2.default(function (resolve, reject) {
	    try {
	      var github = new _github2.default({
	        version: '3.0.0'
	      });
	      github.authenticate({
	        type: 'oauth',
	        token: (0, _config2.default)('GITHUB_TOKEN')
	      });
	
	      var _parseRepo = parseRepo(repository),
	          user = _parseRepo.user,
	          repo = _parseRepo.repo;
	
	      github.gitdata.getTree({ user: user, repo: repo, sha: sha || branch, recursive: true }, function (err, res) {
	        if (err) {
	          return reject(err);
	        }
	
	        try {
	          var files = res.tree.filter(function (f) {
	            return f.type === 'blob';
	          }).filter(function (f) {
	            return validFilesOnly(f.path);
	          });
	          return resolve(files);
	        } catch (mappingError) {
	          return reject(mappingError);
	        }
	      });
	    } catch (e) {
	      reject(e);
	    }
	  });
	};
	
	/*
	 * Download a single file.
	 */
	var downloadFile = function downloadFile(repository, branch, file) {
	  var token = (0, _config2.default)('GITHUB_TOKEN');
	  var url = 'https://' + token + ':x-oauth-basic@api.github.com/repos/' + repository + '/git/blobs/' + file.sha;
	
	  return (0, _requestPromise2.default)({ uri: url, json: true, headers: { 'user-agent': 'auth0-github-deploy' } }).then(function (blob) {
	    _logger2.default.debug('Downloaded ' + file.path + ' (' + file.sha + ')');
	
	    return {
	      fileName: file.path,
	      contents: new Buffer(blob.content, 'base64').toString()
	    };
	  }).catch(function (err) {
	    _logger2.default.error('Error downloading \'api.github.com/repos/' + repository + '/git/blobs/' + file.sha + '\'');
	    _logger2.default.error(err);
	
	    throw err;
	  });
	};
	
	/*
	 * Download a single rule with its metadata.
	 */
	var downloadRule = function downloadRule(repository, branch, ruleName, rule) {
	  var currentRule = {
	    script: false,
	    metadata: false,
	    name: ruleName
	  };
	
	  var downloads = [];
	
	  if (rule.script) {
	    downloads.push(downloadFile(repository, branch, rule.scriptFile).then(function (file) {
	      currentRule.script = true;
	      currentRule.scriptFile = file.contents;
	    }));
	  }
	
	  if (rule.metadata) {
	    downloads.push(downloadFile(repository, branch, rule.metadataFile).then(function (file) {
	      currentRule.metadata = true;
	      currentRule.metadataFile = file.contents;
	    }));
	  }
	
	  return _bluebird2.default.all(downloads).then(function () {
	    return currentRule;
	  });
	};
	
	/*
	 * Determine if we have the script, the metadata or both.
	 */
	var getRules = function getRules(repository, branch, files) {
	  // Rules object.
	  var rules = {};
	
	  // Determine if we have the script, the metadata or both.
	  _lodash2.default.filter(files, function (f) {
	    return isRule(f.path);
	  }).forEach(function (file) {
	    var ruleName = _path2.default.parse(file.path).name;
	    rules[ruleName] = rules[ruleName] || {};
	
	    if (/\.js$/i.test(file.path)) {
	      rules[ruleName].script = true;
	      rules[ruleName].scriptFile = file;
	    } else if (/\.json$/i.test(file.path)) {
	      rules[ruleName].metadata = true;
	      rules[ruleName].metadataFile = file;
	    }
	  });
	
	  // Download all rules.
	  return _bluebird2.default.map((0, _keys2.default)(rules), function (ruleName) {
	    return downloadRule(repository, branch, ruleName, rules[ruleName]);
	  }, { concurrency: 2 });
	};
	
	/*
	 * Download a single database script.
	 */
	var downloadDatabaseScript = function downloadDatabaseScript(repository, branch, databaseName, scripts) {
	  var database = {
	    name: databaseName,
	    scripts: []
	  };
	
	  var downloads = [];
	  scripts.forEach(function (script) {
	    downloads.push(downloadFile(repository, branch, script).then(function (file) {
	      database.scripts.push({
	        name: script.name,
	        scriptFile: file.contents
	      });
	    }));
	  });
	
	  return _bluebird2.default.all(downloads).then(function () {
	    return database;
	  });
	};
	
	/*
	 * Get all database scripts.
	 */
	var getDatabaseScripts = function getDatabaseScripts(repository, branch, files) {
	  var databases = {};
	
	  // Determine if we have the script, the metadata or both.
	  _lodash2.default.filter(files, function (f) {
	    return isDatabaseConnection(f.path);
	  }).forEach(function (file) {
	    var script = getDatabaseScriptDetails(file.path);
	    if (script) {
	      databases[script.database] = databases[script.database] || [];
	      databases[script.database].push((0, _extends3.default)({}, script, {
	        sha: file.sha,
	        path: file.path
	      }));
	    }
	  });
	
	  return _bluebird2.default.map((0, _keys2.default)(databases), function (databaseName) {
	    return downloadDatabaseScript(repository, branch, databaseName, databases[databaseName]);
	  }, { concurrency: 2 });
	};
	
	/*
	 * Download a single page script.
	 */
	var downloadPage = function downloadPage(repository, branch, pageName, page, shaToken) {
	  var downloads = [];
	  var currentPage = {
	    metadata: false,
	    name: pageName
	  };
	
	  if (page.file) {
	    downloads.push(downloadFile(repository, branch, page.file, shaToken).then(function (file) {
	      currentPage.htmlFile = file.contents;
	    }));
	  }
	
	  if (page.meta_file) {
	    downloads.push(downloadFile(repository, branch, page.meta_file, shaToken).then(function (file) {
	      currentPage.metadata = true;
	      currentPage.metadataFile = file.contents;
	    }));
	  }
	
	  return _bluebird2.default.all(downloads).then(function () {
	    return currentPage;
	  });
	};
	
	/*
	 * Get all pages.
	 */
	var getPages = function getPages(repository, branch, files, shaToken) {
	  var pages = {};
	
	  // Determine if we have the script, the metadata or both.
	  _lodash2.default.filter(files, function (f) {
	    return isPage(f.path);
	  }).forEach(function (file) {
	    var pageName = _path2.default.parse(file.path).name;
	    var ext = _path2.default.parse(file.path).ext;
	    pages[pageName] = pages[pageName] || {};
	
	    if (ext !== '.json') {
	      pages[pageName].file = file;
	      pages[pageName].sha = file.sha;
	      pages[pageName].path = file.path;
	    } else {
	      pages[pageName].meta_file = file;
	      pages[pageName].meta_sha = file.sha;
	      pages[pageName].meta_path = file.path;
	    }
	  });
	
	  return _bluebird2.default.map((0, _keys2.default)(pages), function (pageName) {
	    return downloadPage(repository, branch, pageName, pages[pageName], shaToken);
	  }, { concurrency: 2 });
	};
	
	/*
	 * Get a list of all changes that need to be applied to rules and database scripts.
	 */
	var getChanges = exports.getChanges = function getChanges(repository, branch, sha) {
	  return getTree(repository, branch, sha).then(function (files) {
	    _logger2.default.debug('Files in tree: ' + (0, _stringify2.default)(files.map(function (file) {
	      return {
	        path: file.path,
	        sha: file.sha
	      };
	    }), null, 2));
	
	    var promises = {
	      rules: getRules(repository, branch, files),
	      databases: getDatabaseScripts(repository, branch, files),
	      pages: getPages(repository, branch, files)
	    };
	
	    return _bluebird2.default.props(promises).then(function (result) {
	      return {
	        rules: (0, _auth0SourceControlExtensionTools.unifyScripts)(result.rules),
	        databases: (0, _auth0SourceControlExtensionTools.unifyDatabases)(result.databases),
	        pages: (0, _auth0SourceControlExtensionTools.unifyScripts)(result.pages)
	      };
	    });
	  });
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _isIterable2 = __webpack_require__(103);
	
	var _isIterable3 = _interopRequireDefault(_isIterable2);
	
	var _getIterator2 = __webpack_require__(102);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;
	
	    try {
	      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);
	
	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }
	
	    return _arr;
	  }
	
	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if ((0, _isIterable3.default)(Object(arr))) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	}();

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(41)
	  , TAG = __webpack_require__(7)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(23)
	  , document = __webpack_require__(11).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 43 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(41);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(121)
	  , $export        = __webpack_require__(22)
	  , redefine       = __webpack_require__(130)
	  , hide           = __webpack_require__(14)
	  , has            = __webpack_require__(19)
	  , Iterators      = __webpack_require__(15)
	  , $iterCreate    = __webpack_require__(119)
	  , setToStringTag = __webpack_require__(47)
	  , getPrototypeOf = __webpack_require__(126)
	  , ITERATOR       = __webpack_require__(7)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(24).f
	  , has = __webpack_require__(19)
	  , TAG = __webpack_require__(7)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(11)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 49 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(131)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(45)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(138);
	var global        = __webpack_require__(11)
	  , hide          = __webpack_require__(14)
	  , Iterators     = __webpack_require__(15)
	  , TO_STRING_TAG = __webpack_require__(7)('toStringTag');
	
	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 52 */
/***/ function(module, exports) {

	'use strict';
	
	function ArgumentError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'ArgumentError';
	  this.message = message;
	}
	
	ArgumentError.prototype = Object.create(Error.prototype);
	ArgumentError.prototype.constructor = ArgumentError;
	module.exports = ArgumentError;

/***/ },
/* 53 */
/***/ function(module, exports) {

	'use strict';
	
	function JwksError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'JwksError';
	  this.message = message;
	}
	
	JwksError.prototype = Object.create(Error.prototype);
	JwksError.prototype.constructor = JwksError;
	module.exports = JwksError;

/***/ },
/* 54 */
/***/ function(module, exports) {

	'use strict';
	
	function JwksRateLimitError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'JwksRateLimitError';
	  this.message = message;
	}
	
	JwksRateLimitError.prototype = Object.create(Error.prototype);
	JwksRateLimitError.prototype.constructor = JwksRateLimitError;
	module.exports = JwksRateLimitError;

/***/ },
/* 55 */
/***/ function(module, exports) {

	'use strict';
	
	function SigningKeyNotFoundError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'SigningKeyNotFoundError';
	  this.message = message;
	}
	
	SigningKeyNotFoundError.prototype = Object.create(Error.prototype);
	SigningKeyNotFoundError.prototype.constructor = SigningKeyNotFoundError;
	module.exports = SigningKeyNotFoundError;

/***/ },
/* 56 */
/***/ function(module, exports) {

	
	/**
	 * A hierarchical token bucket for rate limiting. See
	 * http://en.wikipedia.org/wiki/Token_bucket for more information.
	 * @author John Hurliman <jhurliman@cull.tv>
	 *
	 * @param {Number} bucketSize Maximum number of tokens to hold in the bucket.
	 *  Also known as the burst rate.
	 * @param {Number} tokensPerInterval Number of tokens to drip into the bucket
	 *  over the course of one interval.
	 * @param {String|Number} interval The interval length in milliseconds, or as
	 *  one of the following strings: 'second', 'minute', 'hour', day'.
	 * @param {TokenBucket} parentBucket Optional. A token bucket that will act as
	 *  the parent of this bucket.
	 */
	var TokenBucket = function(bucketSize, tokensPerInterval, interval, parentBucket) {
	  this.bucketSize = bucketSize;
	  this.tokensPerInterval = tokensPerInterval;
	
	  if (typeof interval === 'string') {
	    switch (interval) {
	      case 'sec': case 'second':
	        this.interval = 1000; break;
	      case 'min': case 'minute':
	        this.interval = 1000 * 60; break;
	      case 'hr': case 'hour':
	        this.interval = 1000 * 60 * 60; break;
	      case 'day':
	        this.interval = 1000 * 60 * 60 * 24; break;
	    }
	  } else {
	    this.interval = interval;
	  }
	
	  this.parentBucket = parentBucket;
	  this.content = 0;
	  this.lastDrip = +new Date();
	};
	
	TokenBucket.prototype = {
	  bucketSize: 1,
	  tokensPerInterval: 1,
	  interval: 1000,
	  parentBucket: null,
	  content: 0,
	  lastDrip: 0,
	
	  /**
	   * Remove the requested number of tokens and fire the given callback. If the
	   * bucket (and any parent buckets) contains enough tokens this will happen
	   * immediately. Otherwise, the removal and callback will happen when enough
	   * tokens become available.
	   * @param {Number} count The number of tokens to remove.
	   * @param {Function} callback(err, remainingTokens)
	   * @returns {Boolean} True if the callback was fired immediately, otherwise
	   *  false.
	   */
	  removeTokens: function(count, callback) {
	    var self = this;
	
	    // Is this an infinite size bucket?
	    if (!this.bucketSize) {
	      process.nextTick(callback.bind(null, null, count, Number.POSITIVE_INFINITY));
	      return true;
	    }
	
	    // Make sure the bucket can hold the requested number of tokens
	    if (count > this.bucketSize) {
	      process.nextTick(callback.bind(null, 'Requested tokens ' + count + ' exceeds bucket size ' +
	        this.bucketSize, null));
	      return false;
	    }
	
	    // Drip new tokens into this bucket
	    this.drip();
	
	    // If we don't have enough tokens in this bucket, come back later
	    if (count > this.content)
	      return comeBackLater();
	
	    if (this.parentBucket) {
	      // Remove the requested from the parent bucket first
	      return this.parentBucket.removeTokens(count, function(err, remainingTokens) {
	        if (err) return callback(err, null);
	
	        // Check that we still have enough tokens in this bucket
	        if (count > self.content)
	          return comeBackLater();
	
	        // Tokens were removed from the parent bucket, now remove them from
	        // this bucket and fire the callback. Note that we look at the current
	        // bucket and parent bucket's remaining tokens and return the smaller
	        // of the two values
	        self.content -= count;
	        callback(null, Math.min(remainingTokens, self.content));
	      });
	    } else {
	      // Remove the requested tokens from this bucket and fire the callback
	      this.content -= count;
	      process.nextTick(callback.bind(null, null, this.content));
	      return true;
	    }
	
	    function comeBackLater() {
	      // How long do we need to wait to make up the difference in tokens?
	      var waitInterval = Math.ceil(
	        (count - self.content) * (self.interval / self.tokensPerInterval));
	      setTimeout(function() { self.removeTokens(count, callback); }, waitInterval);
	      return false;
	    }
	  },
	
	  /**
	   * Attempt to remove the requested number of tokens and return immediately.
	   * If the bucket (and any parent buckets) contains enough tokens this will
	   * return true, otherwise false is returned.
	   * @param {Number} count The number of tokens to remove.
	   * @param {Boolean} True if the tokens were successfully removed, otherwise
	   *  false.
	   */
	  tryRemoveTokens: function(count) {
	    // Is this an infinite size bucket?
	    if (!this.bucketSize)
	      return true;
	
	    // Make sure the bucket can hold the requested number of tokens
	    if (count > this.bucketSize)
	      return false;
	
	    // Drip new tokens into this bucket
	    this.drip();
	
	    // If we don't have enough tokens in this bucket, return false
	    if (count > this.content)
	      return false;
	
	    // Try to remove the requested tokens from the parent bucket
	    if (this.parentBucket && !this.parent.tryRemoveTokens(count))
	      return false;
	
	    // Remove the requested tokens from this bucket and return
	    this.content -= count;
	    return true;
	  },
	
	  /**
	   * Add any new tokens to the bucket since the last drip.
	   * @returns {Boolean} True if new tokens were added, otherwise false.
	   */
	  drip: function() {
	    if (!this.tokensPerInterval) {
	      this.content = this.bucketSize;
	      return;
	    }
	
	    var now = +new Date();
	    var deltaMS = Math.max(now - this.lastDrip, 0);
	    this.lastDrip = now;
	
	    var dripAmount = deltaMS * (this.tokensPerInterval / this.interval);
	    this.content = Math.min(this.content + dripAmount, this.bucketSize);
	  }
	};
	
	module.exports = TokenBucket;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	const LRU        = __webpack_require__(156);
	const _          = __webpack_require__(1);
	const lru_params = [ 'max', 'maxAge', 'length', 'dispose', 'stale' ];
	const deepFreeze = __webpack_require__(151);
	
	module.exports = function (options) {
	  const cache      = new LRU(_.pick(options, lru_params));
	  const load       = options.load;
	  const hash       = options.hash;
	  const bypass     = options.bypass;
	  const itemMaxAge = options.itemMaxAge;
	  const freeze      = options.freeze;
	  const loading    = new Map();
	
	  if (options.disable) {
	      _.extend(load, { del }, options);
	    return load;
	  }
	
	  function del() {
	    const key = hash.apply(this, arguments);
	    cache.del(key);
	  }
	
	  const result = function () {
	    const args       = _.toArray(arguments);
	    const parameters = args.slice(0, -1);
	    const callback   = args.slice(-1).pop();
	    const self       = this;
	
	    var key;
	
	    if (bypass && bypass.apply(self, parameters)) {
	      return load.apply(self, args);
	    }
	
	    if (parameters.length === 0 && !hash) {
	      //the load function only receives callback.
	      key = '_';
	    } else {
	      key = hash.apply(self, parameters);
	    }
	
	    var fromCache = cache.get(key);
	
	    if (fromCache) {
	      return callback.apply(null, [null].concat(fromCache));
	    }
	
	    if (!loading.get(key)) {
	      loading.set(key, []);
	
	      load.apply(self, parameters.concat(function (err) {
	        const args = Array.from(arguments);
	
	        //we store the result only if the load didn't fail.
	        if (!err) {
	          const result = args.slice(1);
	          if (freeze) {
	            args.forEach(deepFreeze);
	          }
	          if (itemMaxAge) {
	            cache.set(key, result, itemMaxAge.apply(self, parameters.concat(result)));
	          } else {
	            cache.set(key, result);
	          }
	        }
	
	        //immediately call every other callback waiting
	        loading.get(key).forEach(function (callback) {
	          callback.apply(null, args);
	        });
	
	        loading.delete(key);
	        /////////
	
	        callback.apply(null, args);
	      }));
	    } else {
	      loading.get(key).push(callback);
	    }
	  };
	
	  result.keys = cache.keys.bind(cache);
	
	  _.extend(result, { del }, options);
	
	  return result;
	};
	
	
	module.exports.sync = function (options) {
	  const cache = new LRU(_.pick(options, lru_params));
	  const load = options.load;
	  const hash = options.hash;
	  const disable = options.disable;
	  const bypass = options.bypass;
	  const self = this;
	  const itemMaxAge = options.itemMaxAge;
	
	  if (disable) {
	    return load;
	  }
	
	  const result = function () {
	    var args = _.toArray(arguments);
	
	    if (bypass && bypass.apply(self, arguments)) {
	      return load.apply(self, arguments);
	    }
	
	    var key = hash.apply(self, args);
	
	    var fromCache = cache.get(key);
	
	    if (fromCache) {
	      return fromCache;
	    }
	
	    const result = load.apply(self, args);
	    if (itemMaxAge) {
	      cache.set(key, result, itemMaxAge.apply(self, args.concat([ result ])));
	    } else {
	      cache.set(key, result);
	    }
	
	    return result;
	  };
	
	  result.keys = cache.keys.bind(cache);
	
	  return result;
	};


/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = require("crypto");

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 60 */
/***/ function(module, exports) {

	module.exports = require("ms");

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = require("superagent");

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = require("url");

/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = require("winston");

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	const ms = __webpack_require__(60);
	const jwt = __webpack_require__(20);
	const auth0 = __webpack_require__(152);
	const Promise = __webpack_require__(3);
	const memoizer = __webpack_require__(57);
	const request = __webpack_require__(61);
	
	const ArgumentError = __webpack_require__(2).ArgumentError;
	const ManagementApiError = __webpack_require__(2).ManagementApiError;
	
	const getAccessToken = function(domain, clientId, clientSecret) {
	  return new Promise(function(resolve, reject) {
	    request
	      .post('https://' + domain + '/oauth/token')
	      .send({
	        audience: 'https://' + domain + '/api/v2/',
	        client_id: clientId,
	        client_secret: clientSecret,
	        grant_type: 'client_credentials'
	      })
	      .set('Accept', 'application/json')
	      .end(function(err, res) {
	        if (err && err.status === 401) {
	          return reject(new ManagementApiError('unauthorized', 'Invalid credentials for ' + clientId, err.status));
	        } else if (err && res && res.body && res.body.error) {
	          return reject(new ManagementApiError(res.body.error, res.body.error_description || res.body.error, err.status));
	        } else if (err) {
	          return reject(err);
	        }
	
	        if (!res.ok || !res.body.access_token) {
	          return reject(new ManagementApiError('unknown_error', 'Unknown error from Management Api or no access token was provided: ' + (res.text || res.status)));
	        }
	
	        return resolve(res.body.access_token);
	      });
	  });
	};
	
	const getAccessTokenCached = Promise.promisify(
	  memoizer({
	    load: function(domain, clientId, clientSecret, callback) {
	      getAccessToken(domain, clientId, clientSecret)
	        .then(function(accessToken) {
	          return callback(null, accessToken);
	        })
	        .catch(function(err) {
	          return callback(err);
	        });
	    },
	    hash: function(domain, clientId, clientSecret) {
	      return domain + '-' + clientId + '-' + clientSecret;
	    },
	    itemMaxAge: function(domain, clientId, clientSecret, accessToken) {
	      try {
	        const decodedToken = jwt.decode(accessToken);
	        const expiresIn = new Date(0);
	        expiresIn.setUTCSeconds(decodedToken.exp);
	        const now = new Date().valueOf();
	        return (expiresIn.valueOf() - now) - 10000;
	      } catch (e) {
	        return 1000;
	      }
	    },
	    max: 100,
	    maxAge: ms('1h')
	  }
	));
	
	module.exports.getAccessToken = getAccessToken;
	module.exports.getAccessTokenCached = getAccessTokenCached;
	module.exports.getClient = function(options) {
	  if (options === null || options === undefined) {
	    throw new ArgumentError('An options object must be provided');
	  }
	
	  if (options.domain === null || options.domain === undefined) {
	    throw new ArgumentError('An options object must contain the domain');
	  }
	
	  if (typeof options.domain !== 'string' || options.domain.length === 0) {
	    throw new ArgumentError('The provided domain is invalid: ' + options.domain);
	  }
	
	  if (options.accessToken) {
	    if (typeof options.accessToken !== 'string' || options.accessToken.length === 0) {
	      throw new ArgumentError('The provided accessToken is invalid');
	    }
	
	    return Promise.resolve(new auth0.ManagementClient({ domain: options.domain, token: options.accessToken }));
	  }
	
	  if (options.clientId === null || options.clientId === undefined) {
	    throw new ArgumentError('An options object must contain the clientId');
	  }
	
	  if (typeof options.clientId !== 'string' || options.clientId.length === 0) {
	    throw new ArgumentError('The provided clientId is invalid: ' + options.clientId);
	  }
	
	  if (options.clientSecret === null || options.clientSecret === undefined) {
	    throw new ArgumentError('An options object must contain the clientSecret');
	  }
	
	  if (typeof options.clientSecret !== 'string' || options.clientSecret.length === 0) {
	    throw new ArgumentError('The provided clientSecret is invalid');
	  }
	
	  return getAccessTokenCached(options.domain, options.clientId, options.clientSecret)
	    .then(function(token) {
	      return new auth0.ManagementClient({ domain: options.domain, token: token });
	    });
	};


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(1);
	const uuid = __webpack_require__(158);
	const ArgumentError = __webpack_require__(2).ArgumentError;
	const NotFoundError = __webpack_require__(2).NotFoundError;
	const ValidationError = __webpack_require__(2).ValidationError;
	
	const getDataForCollection = function(storageContext, collectionName) {
	  return storageContext.read(collectionName)
	    .then(function(data) {
	      data[collectionName] = data[collectionName] || [];
	      return data;
	    });
	};
	
	/**
	 * Create a new BlobRecordProvider.
	 * @param {Object} storageContext The storage context.
	 * @constructor
	 */
	function BlobRecordProvider(storageContext) {
	  if (storageContext === null || storageContext === undefined) {
	    throw new ArgumentError('Must provide a storage context');
	  }
	
	  this.storageContext = storageContext;
	}
	
	/**
	 * Get all records for a collection.
	 * @param {string} collectionName The name of the collection.
	 * @return {Array} The records.
	 */
	BlobRecordProvider.prototype.getAll = function(collectionName) {
	  return getDataForCollection(this.storageContext, collectionName)
	    .then(function(data) {
	      return data[collectionName];
	    });
	};
	
	/**
	 * Get a single record from a collection.
	 * @param {string} collectionName The name of the collection.
	 * @param {string} identifier The identifier of the record.
	 * @return {Object} The record.
	 */
	BlobRecordProvider.prototype.get = function(collectionName, identifier) {
	  return this.getAll(collectionName)
	    .then(function(records) {
	      const record = _.find(records, function(r) { return r._id === identifier });
	      if (!record) {
	        return Promise.reject(
	          new NotFoundError('The record ' + identifier + ' in ' + collectionName + ' does not exist.')
	        );
	      }
	
	      return record;
	    });
	};
	
	/**
	 * Create a record in a collection.
	 * @param {string} collectionName The name of the collection.
	 * @param {Object} record The record.
	 * @return {Object} The record.
	 */
	BlobRecordProvider.prototype.create = function(collectionName, record) {
	  const storageContext = this.storageContext;
	  return getDataForCollection(storageContext, collectionName)
	    .then(function(data) {
	      if (!record._id) {
	        record._id = uuid.v4();
	      }
	
	      const index = _.findIndex(data[collectionName], function(r) { return r._id === record._id; });
	      if (index > -1) {
	        return Promise.reject(
	          new ValidationError('The record ' + record._id + ' in ' + collectionName + ' already exists.')
	        );
	      }
	
	      // Add to dataset.
	      data[collectionName].push(record);
	
	      // Save.
	      return storageContext.write(data)
	        .then(function() {
	          return record;
	        });
	    });
	};
	
	/**
	 * Update a record in a collection.
	 * @param {string} collectionName The name of the collection.
	 * @param {string} identifier The identifier of the record to update.
	 * @param {Object} record The record.
	 * @param {boolean} upsert Flag allowing to upsert if the record does not exist.
	 * @return {Object} The record.
	 */
	BlobRecordProvider.prototype.update = function(collectionName, identifier, record, upsert) {
	  const storageContext = this.storageContext;
	  return getDataForCollection(storageContext, collectionName)
	    .then(function(data) {
	      const index = _.findIndex(data[collectionName], function(r) { return r._id === identifier; });
	      if (index < 0 && !upsert) {
	        throw new NotFoundError('The record ' + identifier + ' in ' + collectionName + ' does not exist.');
	      }
	
	      // Update record.
	      const updatedRecord = _.extend({ _id: identifier }, index < 0 ? { } : data[collectionName][index], record);
	      if (index < 0) {
	        data[collectionName].push(updatedRecord);
	      } else {
	        data[collectionName][index] = updatedRecord;
	      }
	
	      // Save.
	      return storageContext.write(data)
	        .then(function() {
	          return updatedRecord;
	        });
	    });
	};
	
	/**
	 * Delete a record in a collection.
	 * @param {string} collectionName The name of the collection.
	 * @param {string} identifier The identifier of the record to update.
	 */
	BlobRecordProvider.prototype.delete = function(collectionName, identifier) {
	  const storageContext = this.storageContext;
	  return getDataForCollection(storageContext, collectionName)
	    .then(function(data) {
	      const index = _.findIndex(data[collectionName], function(r) { return r._id === identifier; });
	      if (index < 0) {
	        return false;
	      }
	
	      // Remove the record.
	      data[collectionName].splice(index, 1);
	
	      // Save.
	      return storageContext.write(data)
	        .then(function() {
	          return true;
	        });
	    });
	};
	
	/**
	 * Module exports.
	 * @type {function}
	 */
	module.exports = BlobRecordProvider;


/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports = function() {
	  var currentProvider = null;
	
	  const config = function(key) {
	    if (!currentProvider) {
	      throw new Error('A configuration provider has not been set');
	    }
	
	    return currentProvider(key);
	  };
	
	  config.setProvider = function(providerFunction) {
	    currentProvider = providerFunction;
	  };
	
	  return config;
	};


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	const configProvider = __webpack_require__(34);
	
	module.exports.createServer = function(cb) {
	  var server = null;
	
	  return function serverFactory(webtaskContext) {
	    if (!server) {
	      const config = configProvider.fromWebtaskContext(webtaskContext);
	      server = cb(config, webtaskContext.storage);
	    }
	
	    return server;
	  };
	};


/***/ },
/* 68 */
/***/ function(module, exports) {

	function ArgumentError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'ArgumentError';
	  this.message = message;
	  this.status = 400;
	}
	
	ArgumentError.prototype = Object.create(Error.prototype);
	ArgumentError.prototype.constructor = ArgumentError;
	module.exports = ArgumentError;


/***/ },
/* 69 */
/***/ function(module, exports) {

	function ForbiddenError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'ForbiddenError';
	  this.message = message;
	  this.status = 403;
	}
	
	ForbiddenError.prototype = Object.create(Error.prototype);
	ForbiddenError.prototype.constructor = ForbiddenError;
	module.exports = ForbiddenError;


/***/ },
/* 70 */
/***/ function(module, exports) {

	function HookTokenError(message, innerError) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'HookTokenError';
	  this.message = message;
	  this.status = 401;
	  this.innerError = innerError;
	}
	
	HookTokenError.prototype = Object.create(Error.prototype);
	HookTokenError.prototype.constructor = HookTokenError;
	module.exports = HookTokenError;


/***/ },
/* 71 */
/***/ function(module, exports) {

	function ManagementApiError(code, message, status) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'ManagementApiError';
	  this.code = code;
	  this.message = message;
	  this.status = status || 400;
	}
	
	ManagementApiError.prototype = Object.create(Error.prototype);
	ManagementApiError.prototype.constructor = ManagementApiError;
	module.exports = ManagementApiError;


/***/ },
/* 72 */
/***/ function(module, exports) {

	function NotFoundError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'NotFoundError';
	  this.message = message;
	  this.status = 404;
	}
	
	NotFoundError.prototype = Object.create(Error.prototype);
	NotFoundError.prototype.constructor = NotFoundError;
	module.exports = NotFoundError;


/***/ },
/* 73 */
/***/ function(module, exports) {

	function UnauthorizedError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'UnauthorizedError';
	  this.message = message;
	  this.status = 401;
	}
	
	UnauthorizedError.prototype = Object.create(Error.prototype);
	UnauthorizedError.prototype.constructor = UnauthorizedError;
	module.exports = UnauthorizedError;


/***/ },
/* 74 */
/***/ function(module, exports) {

	function ValidationError(message) {
	  Error.call(this, message);
	  Error.captureStackTrace(this, this.constructor);
	  this.name = 'ValidationError';
	  this.message = message;
	  this.status = 400;
	}
	
	ValidationError.prototype = Object.create(Error.prototype);
	ValidationError.prototype.constructor = ValidationError;
	module.exports = ValidationError;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	const jwt = __webpack_require__(20);
	const Promise = __webpack_require__(3);
	const jwksClient = __webpack_require__(142);
	
	const ArgumentError = __webpack_require__(2).ArgumentError;
	const UnauthorizedError = __webpack_require__(2).UnauthorizedError;
	const ValidationError = __webpack_require__(2).ValidationError;
	
	function SessionManager(rta, domain, clientId) {
	  if (rta === null || rta === undefined) {
	    throw new ArgumentError('Must provide a valid domain');
	  }
	
	  if (typeof rta !== 'string' || rta.length === 0) {
	    throw new ArgumentError('The provided rta is invalid: ' + rta);
	  }
	
	  if (domain === null || domain === undefined) {
	    throw new ArgumentError('Must provide a valid domain');
	  }
	
	  if (typeof domain !== 'string' || domain.length === 0) {
	    throw new ArgumentError('The provided domain is invalid: ' + domain);
	  }
	
	  if (clientId === null || clientId === undefined) {
	    throw new ArgumentError('Must provide a valid clientId');
	  }
	
	  if (typeof clientId !== 'string' || clientId.length === 0) {
	    throw new ArgumentError('The provided clientId is invalid: ' + clientId);
	  }
	
	  this.options = {
	    rta: rta,
	    domain: domain,
	    clientId: clientId
	  };
	
	  this.jwksClient = jwksClient({
	    cache: true,
	    rateLimit: true,
	    jwksRequestsPerMinute: 10,
	    jwksUri: 'https://' + rta + '/.well-known/jwks.json'
	  });
	  this.managementApiAudience = 'https://' + domain + '/api/v2/';
	}
	
	SessionManager.prototype.createAuthorizeUrl = function(options) {
	  if (options === null || options === undefined) {
	    return Promise.reject(new ArgumentError('Must provide the options'));
	  }
	
	  if (options.redirectUri === null || options.redirectUri === undefined) {
	    return Promise.reject(new ArgumentError('Must provide the redirectUri'));
	  }
	
	  if (typeof options.redirectUri !== 'string' || options.redirectUri.length === 0) {
	    return Promise.reject(new ArgumentError('The provided redirectUri is invalid: ' + options.redirectUri));
	  }
	
	  var scopes = 'openid name email';
	  if (options.scopes && options.scopes.length) {
	    scopes += ' ' + options.scopes;
	  }
	
	  return [
	    'https://' + this.options.rta + '/i/oauth2/authorize',
	    '?client_id=' + encodeURIComponent(this.options.clientId),
	    '&response_type=token',
	    '&response_mode=form_post',
	    '&scope=' + encodeURIComponent(scopes),
	    '&expiration=' + (options.expiration || 36000),
	    '&redirect_uri=' + encodeURIComponent(options.redirectUri),
	    '&audience=' + encodeURIComponent(this.managementApiAudience)
	  ].join('');
	};
	
	SessionManager.prototype.validateToken = function(client, audience, token) {
	  const self = this;
	  return new Promise(function(resolve, reject) {
	    const decoded = jwt.decode(token, { complete: true });
	    if (decoded == null) {
	      return reject(new ValidationError('Unable to decoded the token.'));
	    }
	
	    return self.jwksClient.getSigningKey(decoded.header.kid, function(signingKeyError, key) {
	      if (signingKeyError) {
	        return reject(signingKeyError);
	      }
	
	      const signingKey = key.publicKey || key.rsaPublicKey;
	      return jwt.verify(token, signingKey, { algorithms: [ 'RS256' ] }, function(err, payload) {
	        if (err) {
	          return reject(err);
	        }
	
	        if (payload.iss !== 'https://' + self.options.rta + '/') {
	          return reject(new UnauthorizedError('Invalid issuer: ' + payload.iss));
	        }
	
	        if (!(payload && (payload.aud === audience
	          || (Array.isArray(payload.aud) && payload.aud.indexOf(audience) > -1)))) {
	          return reject(new UnauthorizedError('Audience mismatch for: ' + audience));
	        }
	
	        return resolve(payload);
	      });
	    });
	  });
	};
	
	/**
	 * Create a new session.
	 */
	SessionManager.prototype.create = function(idToken, accessToken, options) {
	  if (idToken === null || idToken === undefined) {
	    return Promise.reject(new ArgumentError('Must provide an id_token'));
	  }
	
	  if (typeof idToken !== 'string' || idToken.length === 0) {
	    return Promise.reject(new ArgumentError('The provided id_token is invalid: ' + idToken));
	  }
	
	  if (accessToken === null || accessToken === undefined) {
	    return Promise.reject(new ArgumentError('Must provide an access_token'));
	  }
	
	  if (typeof accessToken !== 'string' || accessToken.length === 0) {
	    return Promise.reject(new ArgumentError('The provided access_token is invalid: ' + accessToken));
	  }
	
	  if (options === null || options === undefined) {
	    return Promise.reject(new ArgumentError('Must provide the options'));
	  }
	
	  if (options.secret === null || options.secret === undefined) {
	    return Promise.reject(new ArgumentError('Must provide the secret'));
	  }
	
	  if (typeof options.secret !== 'string' || options.secret.length === 0) {
	    return Promise.reject(new ArgumentError('The provided secret is invalid: ' + options.secret));
	  }
	
	  if (options.audience === null || options.audience === undefined) {
	    return Promise.reject(new ArgumentError('Must provide the audience'));
	  }
	
	  if (typeof options.audience !== 'string' || options.audience.length === 0) {
	    return Promise.reject(new ArgumentError('The provided audience is invalid: ' + options.audience));
	  }
	
	  if (options.issuer === null || options.issuer === undefined) {
	    return Promise.reject(new ArgumentError('Must provide the issuer'));
	  }
	
	  if (typeof options.issuer !== 'string' || options.issuer.length === 0) {
	    return Promise.reject(new ArgumentError('The provided issuer is invalid: ' + options.issuer));
	  }
	
	  const self = this;
	  return Promise.all([
	    self.validateToken(self.options.clientId, self.options.clientId, idToken),
	    self.validateToken(self.options.clientId, self.managementApiAudience, accessToken)
	  ])
	    .then(function(tokens) {
	      if (tokens[1].azp !== self.options.clientId) {
	        return Promise.reject(new UnauthorizedError('The access_token\'s azp does not match the id_token'));
	      }
	
	      if (tokens[0].sub !== tokens[1].sub) {
	        return Promise.reject(new UnauthorizedError('Subjects don\'t match'));
	      }
	
	      const payload = {
	        sub: tokens[0].sub,
	        email: tokens[0].email,
	        exp: tokens[0].exp,
	        access_token: accessToken
	      };
	
	      return jwt.sign(payload, options.secret, {
	        algorithm: 'HS256',
	        issuer: options.issuer,
	        audience: options.audience
	      });
	    });
	};
	
	
	/**
	 * Module exports.
	 * @type {function}
	 */
	module.exports = SessionManager;


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(1);
	const fs = __webpack_require__(59);
	const Promise = __webpack_require__(3);
	
	const ArgumentError = __webpack_require__(2).ArgumentError;
	
	/**
	 * Create a new FileStorageContext.
	 * @param {string} path The full path to the file.
	 * @param {Object} options The options object.
	 * @param {boolean} options.mergeWrites Merge the data from the local file with the new payload when writing a file.
	 *     (defaults to `true` if options is not defined).
	 * @param {Object} options.defaultData The default data to use when the file does not exist or is empty.
	 * @constructor
	 */
	function FileStorageContext(path, options) {
	  if (path === null || path === undefined) {
	    throw new ArgumentError('Must provide the path to the file');
	  }
	
	  if (typeof path !== 'string' || path.length === 0) {
	    throw new ArgumentError('The provided path is invalid: ' + path);
	  }
	
	  options = options || { mergeWrites: true };
	
	  this.path = path;
	  this.mergeWrites = options.mergeWrites;
	  this.defaultData = options.defaultData || {};
	}
	
	/**
	 * Read payload from the file.
	 * @return {object} The object parsed from the file.
	 */
	FileStorageContext.prototype.read = function() {
	  const ctx = this;
	  return new Promise(function readFileStorageContext(resolve, reject) {
	    fs.readFile(ctx.path, 'utf8', function(err, data) {
	      if (err) {
	        if (err.code === 'ENOENT') {
	          return resolve(ctx.defaultData);
	        }
	
	        return reject(err);
	      }
	      try {
	        if (data && data.length) {
	          return resolve(JSON.parse(data));
	        }
	
	        return resolve(ctx.defaultData);
	      } catch (e) {
	        return reject(e);
	      }
	    });
	  });
	};
	
	/**
	 * Write payload to the file.
	 * @param {object} payload The object to write.
	 */
	FileStorageContext.prototype.write = function(payload) {
	  const ctx = this;
	  var writePromise = Promise.resolve(payload);
	
	  if (ctx.mergeWrites) {
	    writePromise = writePromise.then(function(data) {
	      return ctx.read()
	        .then(function(originalData) {
	          return _.extend({ }, originalData, data);
	        });
	    });
	  }
	
	  return writePromise.then(function(data) {
	    return new Promise(function(resolve, reject) {
	      try {
	        return fs.writeFile(ctx.path, JSON.stringify(data, null, 2), 'utf8', function(err) {
	          if (err) {
	            return reject(err);
	          }
	
	          return resolve();
	        });
	      } catch (e) {
	        return reject(e);
	      }
	    });
	  });
	};
	
	/**
	 * Module exports.
	 * @type {function}
	 */
	module.exports = FileStorageContext;


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	module.exports.FileStorageContext = __webpack_require__(76);
	module.exports.WebtaskStorageContext = __webpack_require__(78);


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	const Promise = __webpack_require__(3);
	
	const ArgumentError = __webpack_require__(2).ArgumentError;
	
	/**
	 * Create a new WebtaskStorageContext.
	 * @param {Object} storage The Webtask storage object.
	 * @param {Object} options The options object.
	 * @param {int} options.force Disregard the possibility of a conflict.
	 * @param {Object} options.defaultData The default data to use when the file does not exist or is empty.
	 * @constructor
	 */
	function WebtaskStorageContext(storage, options) {
	  if (storage === null || storage === undefined) {
	    throw new ArgumentError('Must provide the Webtask storage object');
	  }
	
	  options = options || { force: 1 };
	
	  this.storage = storage;
	  this.options = options;
	  this.defaultData = options.defaultData || {};
	}
	
	/**
	 * Read payload from Webtask storage.
	 * @return {object} The object parsed from Webtask storage.
	 */
	WebtaskStorageContext.prototype.read = function() {
	  const ctx = this;
	  return new Promise(function readWebtaskStorageContext(resolve, reject) {
	    ctx.storage.get(function(err, data) {
	      if (err) {
	        return reject(err);
	      }
	
	      return resolve(data || ctx.defaultData);
	    });
	  });
	};
	
	/**
	 * Write data to Webtask storage.
	 * @param {object} data The object to write.
	 */
	WebtaskStorageContext.prototype.write = function(data) {
	  const ctx = this;
	  return new Promise(function(resolve, reject) {
	    ctx.storage.set(data, ctx.options, function(err) {
	      if (err) {
	        return reject(err);
	      }
	
	      return resolve();
	    });
	  });
	};
	
	/**
	 * Module exports.
	 * @type {function}
	 */
	module.exports = WebtaskStorageContext;


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	const jwt = __webpack_require__(20);
	const HookTokenError = __webpack_require__(2).HookTokenError;
	
	module.exports = function validateHookToken(domain, webtaskUrl, hookPath, extensionSecret, hookToken) {
	  if (!hookToken) {
	    throw new HookTokenError('Hook token missing');
	  }
	
	  try {
	    jwt.verify(hookToken, extensionSecret, {
	      audience: webtaskUrl + hookPath,
	      issuer: 'https://' + domain
	    });
	    return true;
	  } catch (e) {
	    throw new HookTokenError('Invalid hook token', e);
	  }
	};


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(1);
	const Promise = __webpack_require__(3);
	const ValidationError = __webpack_require__(5).ValidationError;
	
	const constants = __webpack_require__(9);
	const configurables = __webpack_require__(35);
	
	/*
	 * Get all non-global clients
	 */
	const getClients = function(progress, client) {
	  if (progress.clients) {
	    return Promise.resolve(progress.clients);
	  }
	
	  /* Grab all non-global clients */
	  return Promise.all(client.clients.getAll({ global: false }))
	    .then(function(allClients) {
	      progress.clients = _.chain(allClients)
	        .flattenDeep()
	        .union()
	        .value();
	      return progress.clients;
	    });
	};
	
	/**
	 * Add the client grants if they have changed
	 *
	 * @param progress the state object
	 * @param client the management client
	 * @param unit the existing client
	 * @param metaData the client grant information
	 */
	const processClientGrants = function(progress, client, existingClient, metaData) {
	  /* Make sure grants have been specified, if not, simply return */
	  if (metaData && metaData.grants) {
	    const grantPromises = [];
	    _.keys(metaData.grants).forEach(function(audience) {
	      /* Foreach audience, set the client grants */
	      const filter = { audience: audience };
	      grantPromises.push(client.clientGrants.getAll(filter)
	        .then(function(clientGrantsForAudience) {
	          /* First check if we have actually found something */
	          var clientGrants = _.filter(clientGrantsForAudience, function(grant) {
	            return grant.client_id === existingClient.client_id;
	          });
	          if (clientGrants.length >= 1) {
	            if (clientGrants.length > 1) {
	              /* Shouldn't be able to get here */
	              progress.log('Strangely found too many client grants for ' + existingClient.name + ', audience: ' + audience);
	            }
	
	            /* Check if the scopes have changed */
	            if (JSON.stringify(clientGrants[0].scope) !== JSON.stringify(metaData.grants[audience])) {
	              /* Scopes have changed, run an update */
	              const updatePayload = { scope: metaData.grants[audience] };
	              return client.clientGrants.update({ id: clientGrants[0].id }, updatePayload)
	                .then(function() {
	                  return true;
	                });
	            }
	
	            /* No changes, just return that we didn't have to change anything */
	            return Promise.resolve(false);
	          }
	
	          /* Didn't find one, so let's just create it */
	          const createPayload = {
	            client_id: existingClient.client_id,
	            audience: audience,
	            scope: metaData.grants[audience]
	          };
	          return client.clientGrants.create(createPayload)
	            .then(function() {
	              return true;
	            });
	        }));
	    });
	
	    /* Resolve all of the promises and return true if any of them were true */
	    return Promise.all(grantPromises)
	      .then(function(results) {
	        return results.indexOf(true) >= 0;
	      });
	  }
	
	  /* return that no changes were made */
	  return Promise.resolve(false);
	};
	
	/**
	 * Update clients
	 * @param progress the progress object
	 * @client the Auth0 client for the management API
	 * @return Promise for creating new and updating existing clients
	 */
	const updateClients = function(progress, client) {
	  return configurables.update(constants.CLIENTS_CLIENT_NAME, progress, client, processClientGrants);
	};
	
	/**
	 * Make sure the management client exists and is filtered out, also make sure we have configFile defined for everything
	 * @param clients the list of clients to add or update
	 * @param managementClient the name of the management client
	 * @param existingClients the list of clients that already have been added
	 * @returns {Promise.<*>}
	 */
	const validateClientsExistence = function(progress, clients, managementClient, existingClients) {
	  var existingClientsFiltered = existingClients;
	  /* Make sure management client is valid */
	  if (managementClient) {
	    const priorSize = existingClientsFiltered.length;
	    existingClientsFiltered = _.filter(existingClients,
	      function(client) {
	        return client.client_id !== managementClient;
	      });
	
	    if (priorSize === existingClientsFiltered.length) {
	      const existingClientNames = _.map(existingClients, 'client_id');
	      return Promise.reject(
	        new ValidationError('Did not find ' + managementClient + ', in list of existing client IDs: ' + existingClientNames.join())
	      );
	    }
	  } else {
	    return Promise.reject(
	      new ValidationError('When specifying clients, you must specify which client is the management client for the deploy application.')
	    );
	  }
	
	  return Promise.resolve(existingClientsFiltered);
	};
	
	/*
	 * Validate clients before touching anything.
	 *
	 * Failure States => Ensure we are not touching the deploy client
	 *
	 * Side-effects => progress should include the set of clients that already exist with this name
	 *              => progress should include the set of clients that need to be created
	 *
	 */
	const validateClients = function(progress, client, clients, managementClient) {
	  const clientNames = _.keys(clients);
	  if (clientNames.length === 0) {
	    return Promise.resolve(true);
	  }
	
	  progress.log('Validating clients...');
	
	  return getClients(progress, client)
	    .then(function(existingClients) {
	      return validateClientsExistence(progress, clients, managementClient, existingClients)
	        .then(function(existingClientsFiltered) {
	          return configurables.validate(constants.CLIENTS_CLIENT_NAME, progress, client, clients, existingClientsFiltered, [ ], constants.CLIENTS_CLIENT_ID_NAME);
	        });
	    });
	};
	
	module.exports = {
	  getClients: getClients,
	  updateClients: updateClients,
	  validateClients: validateClients
	};


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(1);
	const Promise = __webpack_require__(3);
	const ValidationError = __webpack_require__(5).ValidationError;
	
	const utils = __webpack_require__(10);
	const constants = __webpack_require__(9);
	
	/*
	 * Get database connections.
	 */
	const getDatabaseConnections = function(progress, client, databases) {
	  if (progress.connections) {
	    return Promise.resolve(progress.connections);
	  }
	
	  const databaseNames = databases.map(function(database) {
	    return database.name;
	  });
	
	  return client.connections.getAll({ strategy: 'auth0' })
	    .then(function(connections) {
	      progress.connections = connections.filter(function(connection) {
	        return databaseNames.indexOf(connection.name) > -1;
	      });
	      return progress.connections;
	    });
	};
	
	/*
	 * Update a database.
	 */
	const updateDatabase = function(progress, client, connections, database) {
	  var allowedScripts = null;
	  progress.log('Processing connection ' + database.name);
	
	  const connection = _.find(connections, { name: database.name });
	  if (!connection) {
	    return Promise.reject(
	      new ValidationError('Unable to find connection named: ' + database.name)
	    );
	  }
	
	  const options = connection.options || {};
	  options.customScripts = {};
	
	  const databaseScriptKeys = Object.keys(database.scripts);
	
	  allowedScripts = (options.import_mode) ? constants.DATABASE_SCRIPTS_IMPORT : constants.DATABASE_SCRIPTS_NO_IMPORT;
	  /* Check if change_email is included and if it is, allow get_users for non-import */
	  if (!options.import_mode) {
	    if (databaseScriptKeys.indexOf(constants.DATABASE_SCRIPTS_CHANGE_EMAIL) >= 0) {
	      if (databaseScriptKeys.indexOf(constants.DATABASE_SCRIPTS_GET_USER) >= 0) {
	        allowedScripts = constants.DATABASE_SCRIPTS;
	      } else {
	        throw new ValidationError('The ' + constants.DATABASE_SCRIPTS_CHANGE_EMAIL + ' script requires the ' + constants.DATABASE_SCRIPTS_GET_USER + ' script for ' + database.name + '.');
	      }
	    }
	  }
	  progress.log('Import User to Auth0 enabled: ' + options.import_mode + '. Allowed scripts: ' + JSON.stringify(allowedScripts, null, 2));
	
	  // Set all custom scripts
	  _(databaseScriptKeys).forEach(function(scriptName) {
	    if (allowedScripts.indexOf(scriptName) < 0) {
	      throw new ValidationError('The ' + scriptName + ' script is not allowed for ' + database.name + '.');
	    }
	
	    if (!database.scripts[scriptName].scriptFile || database.scripts[scriptName].scriptFile.length === 0) {
	      throw new ValidationError('The ' + scriptName + ' script for ' + database.name + ' is empty.');
	    }
	
	    options.customScripts[scriptName] = database.scripts[scriptName].scriptFile;
	  });
	
	  progress.connectionsUpdated += 1;
	  progress.log('Updating database ' + connection.id + ': ' + JSON.stringify(options, utils.checksumReplacer(Object.keys(options.customScripts)), 2));
	  return client.connections.update({ id: connection.id }, { options: options });
	};
	
	/*
	 * Update all databases.
	 */
	const updateDatabases = function(progress, client, databases) {
	  if (databases.length === 0) {
	    return Promise.resolve(true);
	  }
	
	  return getDatabaseConnections(progress, client, databases)
	    .then(function(connections) {
	      return Promise.map(databases,
	        function(database) { return updateDatabase(progress, client, connections, database); },
	        { concurrency: constants.CONCURRENT_CALLS }
	      );
	    });
	};
	
	/*
	 * Validates that all databases included in the repository exist in the tenant.
	 */
	const validateDatabases = function(progress, client, databases) {
	  if (databases.length === 0) {
	    return Promise.resolve(true);
	  }
	
	  progress.log('Validating that configured databases exist in Auth0...');
	
	  return getDatabaseConnections(progress, client, databases)
	    .then(function(connections) {
	      const missingDatabases = _.difference(
	        _.map(databases, function(db) { return db.name; }),
	        _.map(connections, function(conn) { return conn.name; }));
	
	      if (missingDatabases.length > 0) {
	        return Promise.reject(
	          new ValidationError('The following databases do not exist in the Auth0 tenant: ' + missingDatabases)
	        );
	      }
	
	      return true;
	    });
	};
	
	module.exports = {
	  getDatabaseConnections: getDatabaseConnections,
	  updateDatabase: updateDatabase,
	  updateDatabases: updateDatabases,
	  validateDatabases: validateDatabases
	};


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	const rules = __webpack_require__(85);
	const pages = __webpack_require__(83);
	const connections = __webpack_require__(81);
	const clients = __webpack_require__(80);
	const resourceServers = __webpack_require__(84);
	
	module.exports = {
	  /* Connection and database operations */
	  validateDatabases: connections.validateDatabases,
	  updateDatabases: connections.updateDatabases,
	
	  /* Rule operations */
	  validateRules: rules.validateRules,
	  deleteRules: rules.deleteRules,
	  updateRules: rules.updateRules,
	
	  /* Client operations */
	  validateClients: clients.validateClients,
	  updateClients: clients.updateClients,
	
	  /* ResourceServer operations */
	  validateResourceServers: resourceServers.validateResourceServers,
	  updateResourceServers: resourceServers.updateResourceServers,
	
	  /* Page operations */
	  updatePages: pages.updatePages,
	  updateErrorPage: pages.updateErrorPage,
	  updatePasswordResetPage: pages.updatePasswordResetPage,
	  updateLoginPage: pages.updateLoginPage,
	  updateGuardianMultifactorPage: pages.updateGuardianMultifactorPage
	};


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(1);
	const Promise = __webpack_require__(3);
	
	const utils = __webpack_require__(10);
	const constants = __webpack_require__(9);
	
	const pages = module.exports = { };
	
	/*
	 * Get global client.
	 */
	pages.getGlobalClientId = function(progress, auth0) {
	  if (progress.globalClientId) {
	    return Promise.resolve(progress.globalClientId);
	  }
	
	  return Promise.all(auth0.clients.getAll())
	    .then(function(apps) {
	      const globalClient = _.find(apps, { global: true });
	      progress.globalClientId = globalClient.client_id;
	      return progress.globalClientId;
	    });
	};
	
	/*
	 * Get the page by its name.
	 *
	 */
	pages.getPage = function(files, pageName, mappings) {
	  const file = files[pageName];
	  if (!file) {
	    return null;
	  }
	
	  const page = {
	    html: file.htmlFile,
	    enabled: true
	  };
	
	  if (file.metadata) {
	    const metadata = utils.parseJsonFile(pageName, file.metadataFile, mappings);
	    page.enabled = metadata.enabled;
	  }
	
	  return page;
	};
	
	/*
	 * Update the password reset page.
	 */
	pages.updatePasswordResetPage = function(progress, client, files) {
	  const page = pages.getPage(files, constants.PAGE_PASSWORD_RESET, progress.mappings);
	  if (!page) {
	    return Promise.resolve(true);
	  }
	
	  progress.log('Updating change password page...');
	  return client.updateTenantSettings({
	    change_password: page
	  });
	};
	
	
	/*
	 * Update the error page.
	 */
	pages.updateErrorPage = function(progress, client, files) {
	  const page = pages.getPage(files, constants.PAGE_ERROR, progress.mappings);
	  if (!page) {
	    return Promise.resolve(true);
	  }
	
	  if (!page.enabled) {
	    page.html = '';
	  } else {
	    page.url = '';
	  }
	
	  delete page.enabled;
	
	  progress.log('Updating error page...');
	  return client.updateTenantSettings({
	    error_page: page
	  });
	};
	
	/*
	 * Update the guardian mfa page.
	 */
	pages.updateGuardianMultifactorPage = function(progress, client, files) {
	  const page = pages.getPage(files, constants.PAGE_GUARDIAN_MULTIFACTOR, progress.mappings);
	  if (!page) {
	    return Promise.resolve(true);
	  }
	
	  progress.log('Updating guardian multifactor page...');
	  return client.updateTenantSettings({
	    guardian_mfa_page: page
	  });
	};
	
	/*
	 * Update the custom login page.
	 */
	pages.updateLoginPage = function(progress, auth0, files) {
	  const page = pages.getPage(files, constants.PAGE_LOGIN, progress.mappings);
	  if (!page) {
	    return Promise.resolve(true);
	  }
	
	  progress.log('Updating login page...');
	  return pages.getGlobalClientId(progress, auth0).then(
	    function(clientId) {
	      return auth0.clients.update({ client_id: clientId }, {
	        custom_login_page: page.html,
	        custom_login_page_on: page.enabled
	      });
	    }
	  );
	};
	
	/*
	 * Update all pages.
	 */
	pages.updatePages = function(progress, auth0, files) {
	  progress.log('Updating pages...');
	
	  const promises = [
	    pages.updateLoginPage(progress, auth0, files),
	    pages.updateGuardianMultifactorPage(progress, auth0, files),
	    pages.updateErrorPage(progress, auth0, files),
	    pages.updatePasswordResetPage(progress, auth0, files)
	  ];
	
	  return Promise.all(promises);
	};


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(1);
	const Promise = __webpack_require__(3);
	const ValidationError = __webpack_require__(5).ValidationError;
	
	const constants = __webpack_require__(9);
	const configurables = __webpack_require__(35);
	
	/*
	 * Get all non-global resourceServers
	 */
	const getResourceServers = function(progress, client) {
	  if (progress.resourceServers) {
	    return Promise.resolve(progress.resourceServers);
	  }
	
	  /* Grab all non-global resourceServers */
	  return Promise.all(client.resourceServers.getAll({ is_system: false }))
	    .then(function(allResourceServers) {
	      progress.resourceServers = _.chain(allResourceServers)
	        .flattenDeep()
	        .union()
	        .value();
	      return progress.resourceServers;
	    });
	};
	
	/**
	 * Update resourceServers
	 * @param progress the progress object
	 * @client the Auth0 client for the management API
	 * @return Promise for creating new and updating existing resourceServers
	 */
	const updateResourceServers = function(progress, client) {
	  return configurables.update(constants.RESOURCE_SERVERS_CLIENT_NAME, progress, client);
	};
	
	/**
	 * Make sure they are not trying to update the Management API
	 * @param progress the deploy state object
	 * @param resourceServers the list of resourceServers to add or update
	 * @returns {Promise.<*>}
	 */
	const validateResourceServersExistence = function(progress, resourceServers) {
	  /* Make sure they are not trying to update the Management API */
	  if (_.keys(resourceServers).indexOf(constants.RESOURCE_SERVERS_MANAGEMENT_API_NAME) >= 0) {
	    return Promise.reject(
	      new ValidationError('You can not configure the ' + constants.RESOURCE_SERVERS_MANAGEMENT_API_NAME + '.')
	    );
	  }
	
	  return Promise.resolve();
	};
	
	/*
	 * Validate resourceServers before touching anything.
	 *
	 * Failure States => Ensure we are not touching the deploy client
	 *
	 * Side-effects => progress should include the set of resourceServers that already exist with this name
	 *              => progress should include the set of resourceServers that need to be created
	 *
	 */
	const validateResourceServers = function(progress, client, resourceServers) {
	  const clientNames = _.keys(resourceServers);
	  if (clientNames.length === 0) {
	    return Promise.resolve(true);
	  }
	
	  progress.log('Validating resourceServers...');
	
	  return getResourceServers(progress, client)
	    .then(function(existingResourceServers) {
	      return validateResourceServersExistence(progress, resourceServers)
	        .then(function() {
	          return configurables.validate(constants.RESOURCE_SERVERS_CLIENT_NAME, progress, client,
	            resourceServers, existingResourceServers, [ ], constants.RESOURCE_SERVERS_ID_NAME);
	        });
	    });
	};
	
	module.exports = {
	  getResourceServers: getResourceServers,
	  updateResourceServers: updateResourceServers,
	  validateResourceServers: validateResourceServers
	};


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(1);
	const Promise = __webpack_require__(3);
	const ValidationError = __webpack_require__(5).ValidationError;
	
	const utils = __webpack_require__(10);
	const constants = __webpack_require__(9);
	
	const mapToName = function(rule) {
	  return rule.name;
	};
	
	/*
	 * Get all rules in all stages.
	 */
	const getRules = function(progress, client) {
	  if (progress.rules) {
	    return Promise.resolve(progress.rules);
	  }
	
	  return Promise.all(constants.RULES_STAGES.map(function(stage) {
	    return client.rules.getAll({ stage: stage });
	  }))
	    .then(function(allRules) {
	      progress.rules = _.chain(allRules)
	        .flattenDeep()
	        .union()
	        .value();
	      return progress.rules;
	    });
	};
	
	/*
	 * Delete a rule.
	 */
	const deleteRule = function(progress, client, rules, existingRule, excluded) {
	  const ruleExists = _.keys(rules).indexOf(existingRule.name) > -1;
	  if (ruleExists) {
	    return Promise.resolve(true);
	  }
	
	  const isExcluded = excluded.indexOf(existingRule.name) >= 0;
	  if (isExcluded) {
	    progress.log('Skipping delete for manual rule: ' + existingRule.name + ' (' + existingRule.id + ')');
	    return Promise.resolve(true);
	  }
	
	  progress.rulesDeleted += 1;
	  progress.log('Deleting rule ' + existingRule.name + ' (' + existingRule.id + ')');
	  return client.rules.delete({ id: existingRule.id });
	};
	
	/*
	 * Delete all rules.
	 */
	const deleteRules = function(progress, client, rules, excluded) {
	  progress.log('Deleting rules that no longer exist in the repository...');
	
	  return getRules(progress, client)
	    .then(function(existingRules) {
	      progress.log(
	        'Existing rules: ' + JSON.stringify(existingRules.map(
	          function(rule) {
	            return { id: rule.id, name: rule.name, stage: rule.stage, order: rule.order };
	          }), null, 2));
	
	      return Promise.map(
	        existingRules,
	        function(rule) {
	          return deleteRule(progress, client, rules, rule, excluded);
	        },
	        { concurrency: constants.CONCURRENT_CALLS });
	    });
	};
	
	/*
	 * Update a single rule.
	 */
	const updateRule = function(progress, client, existingRules, ruleName, ruleData, excluded) {
	  const isExcluded = excluded.indexOf(ruleName) >= 0;
	  const metadata = (ruleData.metadata) ? utils.parseJsonFile(ruleName, ruleData.metadataFile, progress.mappings) : { enabled: true };
	
	  const payload = {
	    name: ruleName,
	    script: ruleData.scriptFile,
	    enabled: true
	  };
	
	  progress.log('Processing rule ' + ruleName);
	
	  // If a metadata file is provided, we'll apply these values to the rule.
	  const applyMetadata = function() {
	    if (metadata.enabled !== undefined) {
	      payload.enabled = metadata.enabled;
	    }
	
	    if (metadata.order) {
	      payload.order = metadata.order;
	    }
	  };
	
	  const existingRule = _.find(existingRules, { name: ruleName });
	  if (!existingRule) {
	    payload.stage = 'login_success';
	    payload.enabled = true;
	
	    applyMetadata();
	
	    progress.rulesCreated += 1;
	    progress.log('Creating rule ' + ruleName + ': ' + JSON.stringify(payload, utils.checksumReplacer('script'), 2));
	
	    return client.rules.create(payload);
	  }
	
	  if (isExcluded && payload.script) {
	    payload.script = null;
	    progress.log('Ignoring script payload for manual rule: ' + ruleName);
	  }
	
	  if (!payload.script) {
	    payload.script = existingRule.script;
	  }
	
	  applyMetadata();
	
	  // Update the rule.
	  progress.rulesUpdated += 1;
	  progress.log('Updating rule ' + ruleName + ' (' + existingRule.id + '):' + JSON.stringify(payload, utils.checksumReplacer('script'), 2));
	  return client.rules.update({ id: existingRule.id }, payload);
	};
	
	/*
	 * Update all rules.
	 */
	const updateRules = function(progress, client, rules, excluded) {
	  const ruleNames = _.keys(rules);
	  if (ruleNames.length === 0) {
	    return Promise.resolve(true);
	  }
	
	  progress.log('Updating rules...');
	
	  return getRules(progress, client)
	    .then(function(existingRules) {
	      progress.log(
	        'Existing rules: ' + JSON.stringify(existingRules.map(
	          function(rule) {
	            return { id: rule.id, name: rule.name, stage: rule.stage, order: rule.order };
	          }),
	          null,
	          2));
	      return Promise.map(
	        ruleNames,
	        function(ruleName) {
	          return updateRule(progress, client, existingRules, ruleName, rules[ruleName], excluded);
	        },
	        { concurrency: constants.CONCURRENT_CALLS }
	      );
	    });
	};
	
	/*
	 * Metadata cannot exist without rules unless the rule is excluded (manual rule);
	 */
	const validateRulesExistence = function(progress, client, rules, excluded) {
	  const invalidRules = _(rules)
	    .keys()
	    .filter(function(ruleName) {
	      return excluded.indexOf(ruleName) < 0 && rules[ruleName].metadata && !rules[ruleName].script;
	    })
	    .value();
	
	  if (invalidRules.length) {
	    return Promise.reject(
	      new ValidationError('The following rules have metadata files, but have no script files: ' + invalidRules.join())
	    );
	  }
	
	  return Promise.resolve(true);
	};
	
	/*
	 * Detect stage errors.
	 */
	const validateRulesStages = function(progress, client, rules, existingRules) {
	  // Invalid stages.
	  const invalidStages = _(rules)
	    .keys()
	    .filter(function(ruleName) {
	      if (!rules[ruleName].metadata) {
	        return false;
	      }
	
	      const metadata = utils.parseJsonFile(ruleName, rules[ruleName].metadataFile, progress.mappings);
	      return metadata.stage && constants.RULES_STAGES.indexOf(metadata.stage) < 0;
	    })
	    .value();
	  if (invalidStages.length) {
	    return Promise.reject(
	      new ValidationError('The following rules have invalid stages set in their metadata files: ' + invalidStages.join() +
	        '. Go to https://auth0.com/docs/api/management/v2#!/Rules/post_rules to find the valid stage names.'));
	  }
	
	  // Rules that changed state
	  const changeStages = _(rules)
	    .keys()
	    .filter(function(ruleName) {
	      if (!rules[ruleName].metadata) {
	        return false;
	      }
	
	      const metadata = utils.parseJsonFile(ruleName, rules[ruleName].metadataFile, progress.mappings);
	      return metadata.stage
	        && _.some(
	          existingRules,
	          function(existing) {
	            return existing.name === ruleName && existing.stage !== metadata.stage;
	          });
	    })
	    .value();
	
	  if (changeStages.length) {
	    return Promise.reject(
	      new ValidationError(
	        'The following rules changed stage which is not allowed: ' + changeStages.join() +
	        '. Rename the rules to recreate them and avoid this error.'
	      )
	    );
	  }
	
	  return existingRules;
	};
	
	/*
	 * Do not allow rules with the same order.
	 */
	const validateRulesOrder = function(progress, client, rules, existingRules) {
	  const rulesWithOrder = _(rules)
	    .keys()
	    .filter(function(ruleName) {
	      if (!rules[ruleName].metadata) {
	        return false;
	      }
	
	      const metadata = utils.parseJsonFile(ruleName, rules[ruleName].metadataFile, progress.mappings);
	      return metadata.order;
	    })
	    .map(function(ruleName) {
	      const metadata = utils.parseJsonFile(ruleName, rules[ruleName].metadataFile, progress.mappings);
	      return {
	        name: ruleName,
	        stage: metadata.stage || constants.DEFAULT_RULE_STAGE,
	        order: metadata.order
	      };
	    })
	    .value();
	
	  // Rules with the same order number
	  const duplicatedStageOrder = _(rulesWithOrder)
	    .countBy(function(rule) {
	      return 'Stage:' + rule.stage + '|Order:' + rule.order;
	    })
	    .omitBy(function(count) {
	      return count < 2;
	    })
	    .keys()
	    .value();
	  if (duplicatedStageOrder.length > 0) {
	    return Promise.reject(
	      new ValidationError('There are multiple rules for the following stage-order combinations [' + duplicatedStageOrder.join() + ']. ' +
	        'Only one rule must be defined for the same order number in a stage.'
	      )
	    );
	  }
	
	  // Rules with same order than existing rules
	  const rulesRepeatingOrder = _(rulesWithOrder)
	    .filter(function(rule) {
	      return _.some(existingRules, function(existing) {
	        return existing.name !== rule.name && existing.stage === rule.stage && existing.order === rule.order && !_.find(rulesWithOrder, { name: existing.name });
	      });
	    })
	    .map(mapToName)
	    .value();
	  if (rulesRepeatingOrder.length > 0) {
	    return Promise.reject(
	      new ValidationError('The following rules have the same order number that other existing rule: ' + rulesRepeatingOrder.join() +
	        '. Updating them may cause a failure in deployment, use different order numbers to ensure a succesful deployment'
	      )
	    );
	  }
	
	  return existingRules;
	};
	
	/*
	 * Validate rules before touching anything.
	 */
	const validateRules = function(progress, client, rules, excluded) {
	  const ruleNames = _.keys(rules);
	  if (ruleNames.length === 0) {
	    return Promise.resolve(true);
	  }
	
	  progress.log('Validating rules...');
	
	  return getRules(progress, client)
	    .then(function(existingRules) {
	      return validateRulesExistence(progress, client, rules, excluded)
	        .then(function() {
	          return validateRulesStages(progress, client, rules, existingRules);
	        })
	        .then(function() {
	          return validateRulesOrder(progress, client, rules, existingRules);
	        })
	        .then(function() {
	          return existingRules;
	        });
	    });
	};
	
	module.exports = {
	  getRules: getRules,
	  updateRules: updateRules,
	  deleteRules: deleteRules,
	  validateRules: validateRules
	};


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	const logger = __webpack_require__(87);
	const auth0 = __webpack_require__(82);
	const pushToSlack = __webpack_require__(88);
	const appendProgress = __webpack_require__(89);
	const utils = __webpack_require__(10);
	
	const trackProgress = function(progressData) {
	  const logs = [];
	  const log = function(message) {
	    logs.push({ date: new Date(), message: message });
	    logger.debug(message);
	  };
	
	  return {
	    id: progressData.id,
	    user: progressData.user,
	    sha: progressData.sha,
	    branch: progressData.branch,
	    repository: progressData.repository,
	    date: new Date(),
	    connectionsUpdated: 0,
	    configurables: {
	      clients: {
	        created: 0,
	        updated: 0,
	        deleted: 0
	      },
	      resourceServers: {
	        created: 0,
	        updated: 0,
	        deleted: 0
	      }
	    },
	    rulesCreated: 0,
	    rulesUpdated: 0,
	    rulesDeleted: 0,
	    error: null,
	    logs: logs,
	    log: log
	  };
	};
	
	module.exports = function(progressData, context, client, storage, config, slackTemplate) {
	  const progress = trackProgress(progressData);
	  progress.mappings = config('AUTH0_KEYWORD_REPLACE_MAPPINGS');
	  progress.log('Getting access token for ' + config('AUTH0_CLIENT_ID') + '/' + config('AUTH0_DOMAIN'));
	
	  // Send all changes to Auth0.
	  return context.init(progress)
	    .then(function() {
	      var assets = JSON.stringify({
	        clients: context.clients,
	        resourceServers: context.resourceServers,
	        rules: context.rules,
	        pages: context.pages,
	        databases: context.databases
	      }, utils.checksumReplacer([ 'htmlFile', 'scriptFile' ]));
	      progress.log('Assets: ' + assets, null, 2);
	    })
	    .then(function() {
	      return storage.read();
	    })
	    .then(function(data) {
	      context.excluded_rules = data.excluded_rules || [];
	    })
	    .then(function() {
	      return auth0.updatePages(progress, client, context.pages);
	    })
	    .then(function() {
	      return auth0.validateDatabases(progress, client, context.databases);
	    })
	    .then(function() {
	      return auth0.validateRules(progress, client, context.rules, context.excluded_rules);
	    })
	    .then(function() {
	      return auth0.validateResourceServers(progress, client, context.resourceServers);
	    })
	    .then(function() {
	      return auth0.validateClients(progress, client, context.clients, config('AUTH0_CLIENT_ID'));
	    })
	    .then(function() {
	      return auth0.updateDatabases(progress, client, context.databases);
	    })
	    .then(function() {
	      return auth0.deleteRules(progress, client, context.rules, context.excluded_rules);
	    })
	    .then(function() {
	      return auth0.updateRules(progress, client, context.rules, context.excluded_rules);
	    })
	    .then(function() {
	      return auth0.updateResourceServers(progress, client);
	    })
	    .then(function() {
	      return auth0.updateClients(progress, client);
	    })
	    .then(function() {
	      return progress.log('Done.');
	    })
	    .then(function() {
	      return pushToSlack(progress, slackTemplate, config('WT_URL') + '/login', config('SLACK_INCOMING_WEBHOOK_URL'));
	    })
	    .then(function() {
	      return appendProgress(storage, progress);
	    })
	    .then(function() {
	      return {
	        connections: {
	          updated: progress.connectionsUpdated
	        },
	        clients: progress.configurables.clients,
	        resourceServers: progress.configurables.resourceServers,
	        rules: {
	          created: progress.rulesCreated,
	          updated: progress.rulesUpdated,
	          deleted: progress.rulesDeleted
	        }
	      };
	    })
	    .catch(function(err) {
	      // Log error and persist.
	      progress.error = err;
	      progress.log('Error: ' + err.message);
	      progress.log('StackTrace: ' + err.stack);
	
	      // Final attempt to push to slack.
	      pushToSlack(progress, slackTemplate, config('WT_URL') + '/login', config('SLACK_INCOMING_WEBHOOK_URL'))
	        .then(function() {
	          appendProgress(storage, progress);
	        })
	        .catch(function() {
	          appendProgress(storage, progress);
	        });
	
	      // Continue.
	      throw err;
	    });
	};


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	const winston = __webpack_require__(63);
	
	winston.emitErrs = true;
	
	const logger = new winston.Logger({
	  transports: [
	    new winston.transports.Console({
	      timestamp: true,
	      level: 'debug',
	      handleExceptions: true,
	      json: false,
	      colorize: true
	    })
	  ],
	  exitOnError: false
	});
	
	module.exports = logger;


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	const Promise = __webpack_require__(3);
	const request = __webpack_require__(61);
	
	const createPayload = function(progress, template, extensionUrl) {
	  template = template || {};
	
	  const msg = {
	    username: 'auth0-deployments',
	    icon_emoji: ':rocket:',
	    attachments: []
	  };
	
	  const defaultTemplate = {
	    fallback: template.fallback || 'Source-control to Auth0 Deployment',
	    text: template.text || 'Source-control to Auth0 Deployment',
	    fields: [
	      { title: template.repository || 'Repository', value: progress.repository, short: true },
	      { title: template.branch || 'Branch', value: progress.branch, short: true },
	      { title: template.id || 'ID', value: progress.id, short: true },
	      { title: template.sha || 'Commit', value: progress.sha, short: true }
	    ],
	    error_field: { title: template.error || 'Error', value: (progress.error) ? progress.error.message : null, short: false }
	  };
	
	  const details = '(<' + extensionUrl + '|Details>)';
	
	  const fields = defaultTemplate.fields;
	
	  if (progress.error) {
	    fields.push(defaultTemplate.error_field);
	
	    msg.attachments.push({
	      color: '#F35A00',
	      fallback: defaultTemplate.fallback + ' failed: ' + progress.error.message,
	      text: defaultTemplate.text + ' failed: ' + details,
	      fields: defaultTemplate.fields
	    });
	  } else {
	    if (progress.connectionsUpdated) {
	      fields.push({ title: 'Connections Updated', value: progress.connectionsUpdated, short: true });
	    }
	    if (progress.rulesCreated) {
	      fields.push({ title: 'Rules Created', value: progress.rulesCreated, short: true });
	    }
	    if (progress.rulesUpdated) {
	      fields.push({ title: 'Rules Updated', value: progress.rulesUpdated, short: true });
	    }
	    if (progress.rulesDeleted) {
	      fields.push({ title: 'Rules Deleted', value: progress.rulesDeleted, short: true });
	    }
	    if (progress.configurables) {
	      if (progress.configurables.clients) {
	        if (progress.configurables.clients.created) {
	          fields.push({ title: 'Clients Created', value: progress.configurables.clients.created, short: true });
	        }
	        if (progress.configurables.clients.updated) {
	          fields.push({ title: 'Clients Updated', value: progress.configurables.clients.updated, short: true });
	        }
	        if (progress.configurables.clients.deleted) {
	          fields.push({ title: 'Clients Deleted', value: progress.configurables.clients.deleted, short: true });
	        }
	      }
	      if (progress.configurables.resourceServers) {
	        if (progress.configurables.resourceServers.created) {
	          fields.push({ title: 'Resource Servers Created', value: progress.configurables.resourceServers.created, short: true });
	        }
	        if (progress.configurables.resourceServers.updated) {
	          fields.push({ title: 'Resource Servers Updated', value: progress.configurables.resourceServers.updated, short: true });
	        }
	        if (progress.configurables.resourceServers.deleted) {
	          fields.push({ title: 'Resource Servers Deleted', value: progress.configurables.resourceServers.deleted, short: true });
	        }
	      }
	    }
	
	    msg.attachments.push({
	      color: '#7CD197',
	      fallback: defaultTemplate.fallback,
	      text: defaultTemplate.fallback + ' ' + details,
	      fields: fields
	    });
	  }
	
	  return msg;
	};
	
	module.exports = function(progress, template, extensionUrl, hook) {
	  if (!hook) {
	    return Promise.resolve();
	  }
	
	  progress.log('Sending progress to Slack.');
	
	  const msg = createPayload(progress, template, extensionUrl);
	  return new Promise(function(resolve) {
	    request
	      .post(hook)
	      .send(msg)
	      .set('Accept', 'application/json')
	      .end(function(err, res) {
	        if (err && err.status === 401) {
	          progress.log('Error sending to Slack: ' + err.status);
	        } else if (err && res && res.body) {
	          progress.log('Error sending to Slack: ' + err.status + ' - ' + res.body);
	        } else if (err) {
	          progress.log('Error sending to Slack: ' + err.status + ' - ' + err.message);
	        }
	
	        return resolve();
	      });
	  });
	};


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	const _ = __webpack_require__(1);
	
	/*
	 * Append progress to deployments.
	 */
	module.exports = function(storage, progress) {
	  return storage.read()
	    .then(function(data) {
	      data.deployments = data.deployments || [];
	      data.deployments.push(progress);
	      if (data.deployments.length > 10) {
	        data.deployments = _.drop(data.deployments, data.deployments.length - 10);
	      }
	
	      return data;
	    })
	    .then(function(data) {
	      return storage.write(data);
	    });
	};


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';
	
	var _path = __webpack_require__(33);
	
	var _path2 = _interopRequireDefault(_path);
	
	var _morgan = __webpack_require__(157);
	
	var _morgan2 = _interopRequireDefault(_morgan);
	
	var _express = __webpack_require__(8);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _bodyParser = __webpack_require__(153);
	
	var _bodyParser2 = _interopRequireDefault(_bodyParser);
	
	var _auth0ExtensionTools = __webpack_require__(5);
	
	var _auth0ExtensionTools2 = _interopRequireDefault(_auth0ExtensionTools);
	
	var _auth0ExtensionExpressTools = __webpack_require__(12);
	
	var _routes = __webpack_require__(98);
	
	var _routes2 = _interopRequireDefault(_routes);
	
	var _logger = __webpack_require__(13);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	var _config = __webpack_require__(4);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = function (configProvider, storageProvider) {
	  _config2.default.setProvider(configProvider);
	
	  var storage = storageProvider ? new _auth0ExtensionTools2.default.WebtaskStorageContext(storageProvider, { force: 1 }) : new _auth0ExtensionTools2.default.FileStorageContext(_path2.default.join(__dirname, './data.json'), { mergeWrites: true });
	
	  var app = new _express2.default();
	  app.use((0, _morgan2.default)(':method :url :status :response-time ms - :res[content-length]', {
	    stream: _logger2.default.stream
	  }));
	  app.use(_bodyParser2.default.json({
	    verify: function verify(req, res, buf, encoding) {
	      if (buf && buf.length) {
	        req.rawBody = buf.toString(encoding || 'utf8'); // eslint-disable-line no-param-reassign
	      }
	    }
	  }));
	  app.use(_bodyParser2.default.urlencoded({ extended: false }));
	
	  // Configure authentication.
	  app.use(_auth0ExtensionExpressTools.routes.dashboardAdmins({
	    secret: (0, _config2.default)('EXTENSION_SECRET'),
	    audience: 'urn:github-deploy',
	    rta: (0, _config2.default)('AUTH0_RTA').replace('https://', ''),
	    domain: (0, _config2.default)('AUTH0_DOMAIN'),
	    baseUrl: (0, _config2.default)('PUBLIC_WT_URL'),
	    clientName: 'GitHub Deploy Extension',
	    urlPrefix: '/admins',
	    sessionStorageKey: 'github-deploy:apiToken',
	    scopes: 'read:tenant_settings update:tenant_settings update:clients read:clients read:connections update:connections read:rules create:rules update:rules delete:rules'
	  }));
	
	  // Configure routes.
	  app.use('/app', _express2.default.static(_path2.default.join(__dirname, '../dist')));
	  app.use('/', (0, _routes2.default)(storage));
	
	  // Generic error handler.
	  app.use(_auth0ExtensionExpressTools.middlewares.errorHandler(_logger2.default.error.bind(_logger2.default)));
	  return app;
	};
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _crypto = __webpack_require__(58);
	
	var _crypto2 = _interopRequireDefault(_crypto);
	
	var _auth0ExtensionTools = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var calculateSignature = function calculateSignature(key, blob) {
	  return 'sha1=' + _crypto2.default.createHmac('sha1', key).update(blob).digest('hex');
	};
	
	var parse = function parse(headers, _ref) {
	  var _ref$ref = _ref.ref,
	      ref = _ref$ref === undefined ? '' : _ref$ref,
	      _ref$commits = _ref.commits,
	      commits = _ref$commits === undefined ? [] : _ref$commits,
	      _ref$head_commit = _ref.head_commit,
	      head_commit = _ref$head_commit === undefined ? {} : _ref$head_commit,
	      _ref$repository = _ref.repository,
	      repository = _ref$repository === undefined ? {} : _ref$repository,
	      _ref$sender = _ref.sender,
	      sender = _ref$sender === undefined ? {} : _ref$sender;
	  // eslint-disable-line camelcase
	  var refParts = ref.split('/');
	
	  return {
	    id: headers['x-github-delivery'],
	    event: headers['x-github-event'],
	    branch: refParts.length === 3 ? refParts[2] : '',
	    commits: commits,
	    repository: repository.full_name,
	    user: sender.login,
	    sha: head_commit.id
	  };
	};
	
	module.exports = function (secret) {
	  return function (req, res, next) {
	    if (!secret || secret.length === 0) {
	      return next(new _auth0ExtensionTools.UnauthorizedError('The extension secret is not set, unable to verify webhook signature.'));
	    }
	
	    if (!req.headers['x-github-delivery']) {
	      return next(new _auth0ExtensionTools.ArgumentError('The GitHub delivery identifier is missing.'));
	    }
	
	    if (!req.headers['x-github-event']) {
	      return next(new _auth0ExtensionTools.ArgumentError('The GitHub event name is missing.'));
	    }
	
	    var signature = calculateSignature(secret, req.rawBody);
	    if (signature !== req.headers['x-hub-signature']) {
	      return next(new _auth0ExtensionTools.UnauthorizedError('The GitHub webhook signature is incorrect.'));
	    }
	
	    req.webhook = parse(req.headers, req.body); // eslint-disable-line no-param-reassign
	    return next();
	  };
	};

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.validateHookToken = exports.githubWebhook = undefined;
	
	var _githubWebhook2 = __webpack_require__(91);
	
	var _githubWebhook3 = _interopRequireDefault(_githubWebhook2);
	
	var _validateHookToken2 = __webpack_require__(93);
	
	var _validateHookToken3 = _interopRequireDefault(_validateHookToken2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.githubWebhook = _githubWebhook3.default;
	exports.validateHookToken = _validateHookToken3.default;

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jsonwebtoken = __webpack_require__(20);
	
	var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
	
	var _config = __webpack_require__(4);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _logger = __webpack_require__(13);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = function (hookPath) {
	  return function (req, res, next) {
	    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
	      var token = req.headers.authorization.split(' ')[1];
	      _logger2.default.debug('Extension Hook validation token:', token);
	
	      var isValid = _jsonwebtoken2.default.verify(token, (0, _config2.default)('EXTENSION_SECRET'), {
	        audience: '' + (0, _config2.default)('WT_URL') + hookPath,
	        issuer: 'https://' + (0, _config2.default)('AUTH0_DOMAIN')
	      });
	
	      if (!isValid) {
	        _logger2.default.error('Invalid hook token:', token);
	        return res.sendStatus(401);
	      }
	
	      return next();
	    }
	
	    _logger2.default.error('Hook token is missing.');
	    return res.sendStatus(401);
	  };
	};

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var url = __webpack_require__(62);
	
	var USE_WILDCARD_DOMAIN = 3;
	var USE_CUSTOM_DOMAIN = 2;
	var USE_SHARED_DOMAIN = 1;
	var SANITIZE_RX = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
	
	function createRouteNormalizationRx(claims) {
	  if (!claims.container) {
	    return null;
	  }
	
	  var container = claims.container.replace(SANITIZE_RX, '\\$&');
	  var name = claims.jtn ? claims.jtn.replace(SANITIZE_RX, '\\$&') : '';
	
	  if (claims.url_format === USE_SHARED_DOMAIN) {
	    return new RegExp('^/api/run/' + container + '/(?:' + name + '/?)?');
	  } else if (claims.url_format === USE_CUSTOM_DOMAIN) {
	    return new RegExp('^/' + container + '/(?:' + name + '/?)?');
	  } else if (claims.url_format === USE_WILDCARD_DOMAIN) {
	    return new RegExp('^/(?:' + name + '/?)?');
	  } else {
	    throw new Error('Unsupported webtask URL format.');
	  }
	}
	
	module.exports.getUrl = function (req) {
	  var normalizeRouteRx = createRouteNormalizationRx(req.x_wt);
	  var requestOriginalUrl = req.url;
	  var requestUrl = req.url.replace(normalizeRouteRx, '/');
	  var requestPath = url.parse(requestUrl || '').pathname;
	
	  var originalUrl = url.parse(requestOriginalUrl || '').pathname || '';
	  return url.format({
	    protocol: 'https',
	    host: req.headers.host,
	    pathname: originalUrl.replace(requestPath, '').replace(/\/$/g, '')
	  });
	};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray2 = __webpack_require__(39);
	
	var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);
	
	var _lodash = __webpack_require__(1);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _express = __webpack_require__(8);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _auth0ExtensionExpressTools = __webpack_require__(12);
	
	var _rules = __webpack_require__(100);
	
	var _rules2 = _interopRequireDefault(_rules);
	
	var _deploy = __webpack_require__(37);
	
	var _deploy2 = _interopRequireDefault(_deploy);
	
	var _config = __webpack_require__(4);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var getRepository = function getRepository() {
	  var repo = (0, _config2.default)('GITHUB_REPOSITORY');
	
	  var parts = repo.split('/');
	  if (parts.length === 5) {
	    var _parts = (0, _slicedToArray3.default)(parts, 5),
	        account = _parts[3],
	        repository = _parts[4];
	
	    return account + '/' + repository;
	  }
	
	  return repo;
	};
	
	var setNotified = function setNotified(storage) {
	  return storage.read().then(function (data) {
	    data.isNotified = true; // eslint-disable-line no-param-reassign
	    return data;
	  }).then(function (data) {
	    return storage.write(data);
	  });
	};
	
	exports.default = function (storage) {
	  var api = _express2.default.Router(); // eslint-disable-line new-cap
	  api.use(_auth0ExtensionExpressTools.middlewares.authenticateAdmins({
	    credentialsRequired: true,
	    secret: (0, _config2.default)('EXTENSION_SECRET'),
	    audience: 'urn:github-deploy',
	    baseUrl: (0, _config2.default)('PUBLIC_WT_URL'),
	    onLoginSuccess: function onLoginSuccess(req, res, next) {
	      next();
	    }
	  }));
	
	  api.use('/rules', (0, _rules2.default)(storage));
	
	  api.post('/notified', function (req, res, next) {
	    setNotified(storage).then(function () {
	      return res.status(204).send();
	    }).catch(next);
	  });
	
	  api.get('/config', function (req, res, next) {
	    storage.read().then(function (data) {
	      if (data.isNotified) {
	        return {
	          showNotification: false,
	          secret: (0, _config2.default)('EXTENSION_SECRET'),
	          branch: (0, _config2.default)('GITHUB_BRANCH'),
	          repository: getRepository()
	        };
	      }
	
	      return req.auth0.rules.get().then(function (existingRules) {
	        var result = {
	          showNotification: false,
	          secret: (0, _config2.default)('EXTENSION_SECRET'),
	          branch: (0, _config2.default)('GITHUB_BRANCH'),
	          repository: getRepository()
	        };
	
	        if (existingRules && existingRules.length) {
	          result.showNotification = true;
	        } else {
	          setNotified(storage);
	        }
	
	        return result;
	      });
	    }).then(function (data) {
	      return res.json(data);
	    }).catch(next);
	  });
	
	  api.get('/deployments', function (req, res, next) {
	    return storage.read().then(function (data) {
	      return res.json(_lodash2.default.orderBy(data.deployments || [], ['date'], ['desc']));
	    }).catch(next);
	  });
	
	  api.post('/deployments', function (req, res, next) {
	    (0, _deploy2.default)(storage, 'manual', (0, _config2.default)('GITHUB_BRANCH'), getRepository(), req.body && req.body.sha || (0, _config2.default)('GITHUB_BRANCH'), req.user.sub, req.auth0).then(function (stats) {
	      return res.json(stats);
	    }).catch(next);
	  });
	  return api;
	};

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _express = __webpack_require__(8);
	
	var _auth0ExtensionExpressTools = __webpack_require__(12);
	
	var _config = __webpack_require__(4);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _logger = __webpack_require__(13);
	
	var _logger2 = _interopRequireDefault(_logger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  var hooks = (0, _express.Router)();
	  var hookValidator = _auth0ExtensionExpressTools.middlewares.validateHookToken((0, _config2.default)('AUTH0_DOMAIN'), (0, _config2.default)('WT_URL'), (0, _config2.default)('EXTENSION_SECRET'));
	
	  hooks.use('/on-uninstall', hookValidator('/.extensions/on-uninstall'));
	
	  hooks.delete('/on-uninstall', function (req, res) {
	    _logger2.default.debug('Uninstall running...');
	    req.auth0.clients.delete({ client_id: (0, _config2.default)('AUTH0_CLIENT_ID') }).then(function () {
	      _logger2.default.debug('Deleted client ' + (0, _config2.default)('AUTH0_CLIENT_ID'));
	      res.sendStatus(204);
	    }).catch(function (err) {
	      _logger2.default.debug('Error deleting client: ' + (0, _config2.default)('AUTH0_CLIENT_ID'));
	      _logger2.default.error(err);
	
	      // Even if deleting fails, we need to be able to uninstall the extension.
	      res.sendStatus(204);
	    });
	  });
	  return hooks;
	};

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _fs = __webpack_require__(59);
	
	var _fs2 = _interopRequireDefault(_fs);
	
	var _ejs = __webpack_require__(154);
	
	var _ejs2 = _interopRequireDefault(_ejs);
	
	var _path = __webpack_require__(33);
	
	var _path2 = _interopRequireDefault(_path);
	
	var _auth0ExtensionExpressTools = __webpack_require__(12);
	
	var _config = __webpack_require__(4);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  var template = '\n  <!DOCTYPE html>\n  <html lang="en">\n  <head>\n    <title>Auth0 - GitHub Deployments</title>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/4.6.13/lib/logos/img/favicon.png">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css">\n    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1715/css/index.min.css">\n    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.6.13/index.css">\n    <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>"><% } %>\n    <% if (assets.version) { %><link rel="stylesheet" type="text/css" href="//cdn.auth0.com/extensions/auth0-github-deploy/assets/auth0-github-deploy.ui.<%= assets.version %>.css"><% } %>\n  </head>\n  <body class="a0-extension">\n    <div id="app"></div>\n    <script type="text/javascript" src="//cdn.auth0.com/js/lock-9.0.min.js"></script>\n    <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1715/js/bundle.js"></script>\n    <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>\n    <% if (assets.vendors) { %><script type="text/javascript" src="/app/<%= assets.vendors %>"></script><% } %>\n    <% if (assets.app) { %><script type="text/javascript" src="//localhost:3000/app/<%= assets.app %>"></script><% } %>\n    <% if (assets.version) { %>\n    <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-github-deploy/assets/auth0-github-deploy.ui.vendors.<%= assets.version %>.js"></script>\n    <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-github-deploy/assets/auth0-github-deploy.ui.<%= assets.version %>.js"></script>\n    <% } %>\n  </body>\n  </html>\n  ';
	
	  return function (req, res) {
	    var settings = {
	      AUTH0_DOMAIN: (0, _config2.default)('AUTH0_DOMAIN'),
	      BASE_URL: _auth0ExtensionExpressTools.urlHelpers.getBaseUrl(req),
	      BASE_PATH: _auth0ExtensionExpressTools.urlHelpers.getBasePath(req),
	      AUTH0_MANAGE_URL: (0, _config2.default)('AUTH0_MANAGE_URL') || 'http://manage.auth0.com'
	    };
	
	    // Render from CDN.
	    var clientVersion = ("2.1.0");
	    if (clientVersion) {
	      return res.send(_ejs2.default.render(template, {
	        config: settings,
	        assets: { version: clientVersion }
	      }));
	    }
	
	    // Render locally.
	    return _fs2.default.readFile(_path2.default.join(__dirname, '../../dist/manifest.json'), 'utf8', function (err, data) {
	      var locals = {
	        config: settings,
	        assets: {
	          app: 'bundle.js'
	        }
	      };
	
	      if (!err && data) {
	        locals.assets = JSON.parse(data);
	      }
	
	      // Render the HTML page.
	      res.send(_ejs2.default.render(template, locals));
	    });
	  };
	};
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _express = __webpack_require__(8);
	
	var _auth0ExtensionExpressTools = __webpack_require__(12);
	
	var _api = __webpack_require__(95);
	
	var _api2 = _interopRequireDefault(_api);
	
	var _html = __webpack_require__(97);
	
	var _html2 = _interopRequireDefault(_html);
	
	var _meta = __webpack_require__(99);
	
	var _meta2 = _interopRequireDefault(_meta);
	
	var _hooks = __webpack_require__(96);
	
	var _hooks2 = _interopRequireDefault(_hooks);
	
	var _webhooks = __webpack_require__(101);
	
	var _webhooks2 = _interopRequireDefault(_webhooks);
	
	var _config = __webpack_require__(4);
	
	var _config2 = _interopRequireDefault(_config);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (storage) {
	  var routes = (0, _express.Router)();
	  routes.use(_auth0ExtensionExpressTools.middlewares.managementApiClient({
	    domain: (0, _config2.default)('AUTH0_DOMAIN'),
	    clientId: (0, _config2.default)('AUTH0_CLIENT_ID'),
	    clientSecret: (0, _config2.default)('AUTH0_CLIENT_SECRET')
	  }));
	  routes.use('/.extensions', (0, _hooks2.default)());
	  routes.get('/', (0, _html2.default)());
	  routes.use('/meta', (0, _meta2.default)());
	  routes.use('/webhooks', (0, _webhooks2.default)(storage));
	  routes.use('/api', (0, _api2.default)(storage));
	  return routes;
	};

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _express = __webpack_require__(8);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _webtask = __webpack_require__(141);
	
	var _webtask2 = _interopRequireDefault(_webtask);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	  var api = _express2.default.Router(); // eslint-disable-line new-cap
	  api.get('/', function (req, res) {
	    res.status(200).send(_webtask2.default);
	  });
	
	  return api;
	};

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _lodash = __webpack_require__(1);
	
	var _lodash2 = _interopRequireDefault(_lodash);
	
	var _express = __webpack_require__(8);
	
	var _express2 = _interopRequireDefault(_express);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (storage) {
	  var api = _express2.default.Router(); // eslint-disable-line new-cap
	  api.get('/', function (req, res, next) {
	    req.auth0.rules.get().then(function (rules) {
	      storage.read().then(function (data) {
	        var result = {};
	
	        if (data && data.excluded_rules) {
	          _lodash2.default.forEach(rules, function (rule) {
	            result[rule.name] = data.excluded_rules.indexOf(rule.name) >= 0;
	          });
	        } else {
	          _lodash2.default.forEach(rules, function (rule) {
	            result[rule.name] = false;
	          });
	        }
	
	        res.json(result);
	      }).catch(next);
	    }).catch(next);
	  });
	
	  api.post('/', function (req, res, next) {
	    var excludedRules = req.body.names || [];
	
	    storage.read().then(function (data) {
	      data.excluded_rules = excludedRules; // eslint-disable-line no-param-reassign
	      return data;
	    }).then(function (data) {
	      return storage.write(data);
	    }).then(function () {
	      return res.status(200).send();
	    }).catch(next);
	  });
	
	  return api;
	};

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _express = __webpack_require__(8);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _config = __webpack_require__(4);
	
	var _config2 = _interopRequireDefault(_config);
	
	var _deploy = __webpack_require__(37);
	
	var _deploy2 = _interopRequireDefault(_deploy);
	
	var _github = __webpack_require__(38);
	
	var _middlewares = __webpack_require__(92);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (storage) {
	  var activeBranch = (0, _config2.default)('GITHUB_BRANCH');
	  var githubSecret = (0, _config2.default)('EXTENSION_SECRET');
	
	  var webhooks = _express2.default.Router(); // eslint-disable-line new-cap
	  webhooks.post('/deploy', (0, _middlewares.githubWebhook)(githubSecret), function (req, res, next) {
	    var _req$webhook = req.webhook,
	        id = _req$webhook.id,
	        branch = _req$webhook.branch,
	        commits = _req$webhook.commits,
	        repository = _req$webhook.repository,
	        user = _req$webhook.user,
	        sha = _req$webhook.sha;
	
	    // Only accept push requests.
	
	    if (req.webhook.event !== 'push') {
	      return res.status(202).json({ message: 'Request ignored, the \'' + req.webhook.event + '\' event is not supported.' });
	    }
	
	    // Only for the active branch.
	    if (branch !== activeBranch) {
	      return res.status(202).json({ message: 'Request ignored, \'' + branch + '\' is not the active branch.' });
	    }
	
	    // Only run if there really are changes.
	    if (!(0, _github.hasChanges)(commits)) {
	      return res.status(202).json({ message: 'Request ignored, none of the Rules or Database Connection scripts were changed.' });
	    }
	
	    // Deploy the changes.
	    return (0, _deploy2.default)(storage, id, branch, repository, sha, user, req.auth0).then(function (stats) {
	      return res.status(200).json(stats);
	    }).catch(next);
	  });
	
	  return webhooks;
	};

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(108), __esModule: true };

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(109), __esModule: true };

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(110), __esModule: true };

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(111), __esModule: true };

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(112), __esModule: true };

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _assign = __webpack_require__(105);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	
	  return target;
	};

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(51);
	__webpack_require__(50);
	module.exports = __webpack_require__(136);

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(51);
	__webpack_require__(50);
	module.exports = __webpack_require__(137);

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(6)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(139);
	module.exports = __webpack_require__(6).Object.assign;

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(140);
	module.exports = __webpack_require__(6).Object.keys;

/***/ },
/* 113 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 114 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(28)
	  , toLength  = __webpack_require__(133)
	  , toIndex   = __webpack_require__(132);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(113);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11).document && document.documentElement;

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(17) && !__webpack_require__(18)(function(){
	  return Object.defineProperty(__webpack_require__(42)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(123)
	  , descriptor     = __webpack_require__(46)
	  , setToStringTag = __webpack_require__(47)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(14)(IteratorPrototype, __webpack_require__(7)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 120 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 121 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(25)
	  , gOPS     = __webpack_require__(125)
	  , pIE      = __webpack_require__(128)
	  , toObject = __webpack_require__(29)
	  , IObject  = __webpack_require__(44)
	  , $assign  = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(18)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(16)
	  , dPs         = __webpack_require__(124)
	  , enumBugKeys = __webpack_require__(43)
	  , IE_PROTO    = __webpack_require__(26)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(42)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(117).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(24)
	  , anObject = __webpack_require__(16)
	  , getKeys  = __webpack_require__(25);
	
	module.exports = __webpack_require__(17) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 125 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(19)
	  , toObject    = __webpack_require__(29)
	  , IE_PROTO    = __webpack_require__(26)('IE_PROTO')
	  , ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(19)
	  , toIObject    = __webpack_require__(28)
	  , arrayIndexOf = __webpack_require__(115)(false)
	  , IE_PROTO     = __webpack_require__(26)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 128 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(22)
	  , core    = __webpack_require__(6)
	  , fails   = __webpack_require__(18);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(14);

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(27)
	  , defined   = __webpack_require__(21);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(27)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(27)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(23);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(40)
	  , ITERATOR  = __webpack_require__(7)('iterator')
	  , Iterators = __webpack_require__(15);
	module.exports = __webpack_require__(6).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(16)
	  , get      = __webpack_require__(135);
	module.exports = __webpack_require__(6).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(40)
	  , ITERATOR  = __webpack_require__(7)('iterator')
	  , Iterators = __webpack_require__(15);
	module.exports = __webpack_require__(6).isIterable = function(it){
	  var O = Object(it);
	  return O[ITERATOR] !== undefined
	    || '@@iterator' in O
	    || Iterators.hasOwnProperty(classof(O));
	};

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(114)
	  , step             = __webpack_require__(120)
	  , Iterators        = __webpack_require__(15)
	  , toIObject        = __webpack_require__(28);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(45)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(22);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(122)});

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(29)
	  , $keys    = __webpack_require__(25);
	
	__webpack_require__(129)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 141 */
/***/ function(module, exports) {

	module.exports = {
		"title": "GitHub Deployments",
		"name": "auth0-github-deploy",
		"version": "2.1.0",
		"author": "auth0",
		"description": "This extension gives Auth0 customers the possibility to deploy Pages, Rules and Custom Database Connections from GitHub.",
		"type": "application",
		"docsUrl": "https://auth0.com/docs/extensions/github-deploy",
		"logoUrl": "https://cdn.auth0.com/extensions/auth0-github-deploy/assets/logo.svg",
		"initialUrlPath": "/admins/login",
		"uninstallConfirmMessage": "Do you really want to uninstall this extension? Doing so will stop any Pages, Rules and Database Connection scripts from being deployed from GitHub to Auth0",
		"repository": "https://github.com/auth0-extensions/auth0-github-deploy",
		"keywords": [
			"auth0",
			"extension",
			"github"
		],
		"auth0": {
			"createClient": true,
			"onUninstallPath": "/.extensions/on-uninstall",
			"scopes": "read:tenant_settings update:tenant_settings update:clients read:clients read:connections update:connections read:rules create:rules update:rules delete:rules delete:clients"
		},
		"secrets": {
			"GITHUB_REPOSITORY": {
				"example": "myorganization/myrepo",
				"description": "The repository from which you want to deploy rules and database scripts",
				"required": true
			},
			"GITHUB_BRANCH": {
				"description": "The branch we should monitor for commits",
				"default": "master",
				"required": true
			},
			"GITHUB_TOKEN": {
				"description": "Your personal access token for GitHub",
				"required": true,
				"type": "password"
			},
			"SLACK_INCOMING_WEBHOOK_URL": {
				"example": "https://hooks.slack.com/services/...",
				"description": "Webhook URL for Slack used to notify you of successful and failed deployments",
				"required": false
			}
		}
	};

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _JwksClient = __webpack_require__(30);
	
	var _errors = __webpack_require__(31);
	
	var errors = _interopRequireWildcard(_errors);
	
	var _hapi = __webpack_require__(144);
	
	var _express = __webpack_require__(143);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	module.exports = function (options) {
	  return new _JwksClient.JwksClient(options);
	};
	
	module.exports.ArgumentError = errors.ArgumentError;
	module.exports.JwksError = errors.JwksError;
	module.exports.JwksRateLimitError = errors.JwksRateLimitError;
	module.exports.SigningKeyNotFoundError = errors.SigningKeyNotFoundError;
	
	module.exports.expressJwtSecret = _express.expressJwtSecret;
	module.exports.hapiJwt2Key = _hapi.hapiJwt2Key;

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _errors = __webpack_require__(31);
	
	var _JwksClient = __webpack_require__(30);
	
	var handleSigningKeyError = function handleSigningKeyError(err, cb) {
	  // If we didn't find a match, can't provide a key.
	  if (err && err.name === 'SigningKeyNotFoundError') {
	    return cb(null);
	  }
	
	  // If an error occured like rate limiting or HTTP issue, we'll bubble up the error.
	  if (err) {
	    return cb(err);
	  }
	};
	
	module.exports.expressJwtSecret = function (options) {
	  if (options === null || options === undefined) {
	    throw new _errors.ArgumentError('An options object must be provided when initializing expressJwtSecret');
	  }
	
	  var client = new _JwksClient.JwksClient(options);
	  var onError = options.handleSigningKeyError || handleSigningKeyError;
	
	  return function secretProvider(req, header, payload, cb) {
	    // Only RS256 is supported.
	    if (!header || header.alg !== 'RS256') {
	      return cb(null, null);
	    }
	
	    client.getSigningKey(header.kid, function (err, key) {
	      if (err) {
	        return onError(err, function (newError) {
	          return cb(newError, null);
	        });
	      }
	
	      // Provide the key.
	      return cb(null, key.publicKey || key.rsaPublicKey);
	    });
	  };
	};

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _errors = __webpack_require__(31);
	
	var _JwksClient = __webpack_require__(30);
	
	var handleSigningKeyError = function handleSigningKeyError(err, cb) {
	  // If we didn't find a match, can't provide a key.
	  if (err && err.name === 'SigningKeyNotFoundError') {
	    return cb(null, null, null);
	  }
	
	  // If an error occured like rate limiting or HTTP issue, we'll bubble up the error.
	  if (err) {
	    return cb(err, null, null);
	  }
	};
	
	module.exports.hapiJwt2Key = function (options) {
	  if (options === null || options === undefined) {
	    throw new _errors.ArgumentError('An options object must be provided when initializing expressJwtSecret');
	  }
	
	  var client = new _JwksClient.JwksClient(options);
	  var onError = options.handleSigningKeyError || handleSigningKeyError;
	
	  return function secretProvider(decoded, cb) {
	    // We cannot find a signing certificate if there is no header (no kid).
	    if (!decoded || !decoded.header) {
	      return cb(null, null, null);
	    }
	
	    // Only RS256 is supported.
	    if (decoded.header.alg !== 'RS256') {
	      return cb(null, null, null);
	    }
	
	    client.getSigningKey(decoded.header.kid, function (err, key) {
	      if (err) {
	        return onError(err, function (newError) {
	          return cb(newError, null, null);
	        });
	      }
	
	      // Provide the key.
	      return cb(null, key.publicKey || key.rsaPublicKey, key);
	    });
	  };
	};

/***/ },
/* 145 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.certToPEM = certToPEM;
	exports.rsaPublicKeyToPEM = rsaPublicKeyToPEM;
	function certToPEM(cert) {
	  cert = cert.match(/.{1,64}/g).join('\n');
	  cert = '-----BEGIN CERTIFICATE-----\n' + cert + '\n-----END CERTIFICATE-----\n';
	  return cert;
	};
	
	function prepadSigned(hexStr) {
	  var msb = hexStr[0];
	  if (msb < '0' || msb > '7') {
	    return '00' + hexStr;
	  }
	  return hexStr;
	}
	
	function toHex(number) {
	  var nstr = number.toString(16);
	  if (nstr.length % 2) {
	    return '0' + nstr;
	  }
	  return nstr;
	}
	
	function encodeLengthHex(n) {
	  if (n <= 127) {
	    return toHex(n);
	  }
	  var nHex = toHex(n);
	  var lengthOfLengthByte = 128 + nHex.length / 2;
	  return toHex(lengthOfLengthByte) + nHex;
	}
	
	/*
	 * Source: http://stackoverflow.com/questions/18835132/xml-to-pem-in-node-js
	 */
	function rsaPublicKeyToPEM(modulusB64, exponentB64) {
	  var modulus = new Buffer(modulusB64, 'base64');
	  var exponent = new Buffer(exponentB64, 'base64');
	  var modulusHex = prepadSigned(modulus.toString('hex'));
	  var exponentHex = prepadSigned(exponent.toString('hex'));
	  var modlen = modulusHex.length / 2;
	  var explen = exponentHex.length / 2;
	
	  var encodedModlen = encodeLengthHex(modlen);
	  var encodedExplen = encodeLengthHex(explen);
	  var encodedPubkey = '30' + encodeLengthHex(modlen + explen + encodedModlen.length / 2 + encodedExplen.length / 2 + 2) + '02' + encodedModlen + modulusHex + '02' + encodedExplen + exponentHex;
	
	  var der = new Buffer(encodedPubkey, 'hex').toString('base64');
	
	  var pem = '-----BEGIN RSA PUBLIC KEY-----\n';
	  pem += '' + der.match(/.{1,64}/g).join('\n');
	  pem += '\n-----END RSA PUBLIC KEY-----\n';
	  return pem;
	};

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (client) {
	  var _ref = arguments.length <= 1 || arguments[1] === undefined ? options : arguments[1];
	
	  var _ref$cacheMaxEntries = _ref.cacheMaxEntries;
	  var cacheMaxEntries = _ref$cacheMaxEntries === undefined ? 5 : _ref$cacheMaxEntries;
	  var _ref$cacheMaxAge = _ref.cacheMaxAge;
	  var cacheMaxAge = _ref$cacheMaxAge === undefined ? (0, _ms2.default)('10h') : _ref$cacheMaxAge;
	
	  var logger = (0, _debug2.default)('jwks');
	  var getSigningKey = client.getSigningKey;
	
	  logger('Configured caching of singing keys. Max: ' + cacheMaxEntries + ' / Age: ' + cacheMaxAge);
	  return (0, _lruMemoizer2.default)({
	    load: function load(kid, callback) {
	      getSigningKey(kid, function (err, key) {
	        if (err) {
	          return callback(err);
	        }
	
	        logger('Caching signing key for \'' + kid + '\':', key);
	        return callback(null, key);
	      });
	    },
	    hash: function hash(kid) {
	      return kid;
	    },
	    maxAge: cacheMaxAge,
	    max: cacheMaxEntries
	  });
	};
	
	var _ms = __webpack_require__(60);
	
	var _ms2 = _interopRequireDefault(_ms);
	
	var _debug = __webpack_require__(32);
	
	var _debug2 = _interopRequireDefault(_debug);
	
	var _lruMemoizer = __webpack_require__(57);
	
	var _lruMemoizer2 = _interopRequireDefault(_lruMemoizer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.rateLimitSigningKey = exports.cacheSigningKey = undefined;
	
	var _cache = __webpack_require__(146);
	
	var _cache2 = _interopRequireDefault(_cache);
	
	var _rateLimit = __webpack_require__(148);
	
	var _rateLimit2 = _interopRequireDefault(_rateLimit);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.cacheSigningKey = _cache2.default;
	exports.rateLimitSigningKey = _rateLimit2.default;

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (client) {
	  var _ref = arguments.length <= 1 || arguments[1] === undefined ? options : arguments[1];
	
	  var _ref$jwksRequestsPerM = _ref.jwksRequestsPerMinute;
	  var jwksRequestsPerMinute = _ref$jwksRequestsPerM === undefined ? 10 : _ref$jwksRequestsPerM;
	
	  var logger = (0, _debug2.default)('jwks');
	  var getSigningKey = client.getSigningKey;
	
	  var limiter = new _limiter.RateLimiter(jwksRequestsPerMinute, 'minute', true);
	  logger('Configured rate limiting to JWKS endpoint at ' + jwksRequestsPerMinute + '/minute');
	
	  return function (kid, cb) {
	    limiter.removeTokens(1, function (err, remaining) {
	      if (err) {
	        return cb(err);
	      }
	
	      logger('Requests to the JWKS endpoint available for the next minute:', remaining);
	      if (remaining < 0) {
	        logger('Too many requests to the JWKS endpoint');
	        return cb(new _JwksRateLimitError2.default('Too many requests to the JWKS endpoint'));
	      } else {
	        return getSigningKey(kid, cb);
	      }
	    });
	  };
	};
	
	var _debug = __webpack_require__(32);
	
	var _debug2 = _interopRequireDefault(_debug);
	
	var _limiter = __webpack_require__(149);
	
	var _JwksRateLimitError = __webpack_require__(54);
	
	var _JwksRateLimitError2 = _interopRequireDefault(_JwksRateLimitError);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	
	exports.RateLimiter = __webpack_require__(150);
	exports.TokenBucket = __webpack_require__(56);


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	var TokenBucket = __webpack_require__(56);
	
	/**
	 * A generic rate limiter. Underneath the hood, this uses a token bucket plus
	 * an additional check to limit how many tokens we can remove each interval.
	 * @author John Hurliman <jhurliman@jhurliman.org>
	 *
	 * @param {Number} tokensPerInterval Maximum number of tokens that can be
	 *  removed at any given moment and over the course of one interval.
	 * @param {String|Number} interval The interval length in milliseconds, or as
	 *  one of the following strings: 'second', 'minute', 'hour', day'.
	 * @param {Boolean} fireImmediately Optional. Whether or not the callback
	 *  will fire immediately when rate limiting is in effect (default is false).
	 */
	var RateLimiter = function(tokensPerInterval, interval, fireImmediately) {
	  this.tokenBucket = new TokenBucket(tokensPerInterval, tokensPerInterval,
	    interval, null);
	
	  // Fill the token bucket to start
	  this.tokenBucket.content = tokensPerInterval;
	
	  this.curIntervalStart = +new Date();
	  this.tokensThisInterval = 0;
	  this.fireImmediately = fireImmediately;
	};
	
	RateLimiter.prototype = {
	  tokenBucket: null,
	  curIntervalStart: 0,
	  tokensThisInterval: 0,
	  fireImmediately: false,
	
	  /**
	   * Remove the requested number of tokens and fire the given callback. If the
	   * rate limiter contains enough tokens and we haven't spent too many tokens
	   * in this interval already, this will happen immediately. Otherwise, the
	   * removal and callback will happen when enough tokens become available.
	   * @param {Number} count The number of tokens to remove.
	   * @param {Function} callback(err, remainingTokens)
	   * @returns {Boolean} True if the callback was fired immediately, otherwise
	   *  false.
	   */
	  removeTokens: function(count, callback) {
	    // Make sure the request isn't for more than we can handle
	    if (count > this.tokenBucket.bucketSize) {
	      process.nextTick(callback.bind(null, 'Requested tokens ' + count +
	        ' exceeds maximum tokens per interval ' + this.tokenBucket.bucketSize,
	        null));
	      return false;
	    }
	
	    var self = this;
	    var now = Date.now();
	
	    // Advance the current interval and reset the current interval token count
	    // if needed
	    if (now - this.curIntervalStart >= this.tokenBucket.interval) {
	      this.curIntervalStart = now;
	      this.tokensThisInterval = 0;
	    }
	
	    // If we don't have enough tokens left in this interval, wait until the
	    // next interval
	    if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval) {
	      if (this.fireImmediately) {
	        process.nextTick(callback.bind(null, null, -1));
	      } else {
	        var waitInterval = Math.ceil(
	          this.curIntervalStart + this.tokenBucket.interval - now);
	
	        setTimeout(function() {
	          self.tokenBucket.removeTokens(count, afterTokensRemoved);
	        }, waitInterval);
	      }
	      return false;
	    }
	
	    // Remove the requested number of tokens from the token bucket
	    return this.tokenBucket.removeTokens(count, afterTokensRemoved);
	
	    function afterTokensRemoved(err, tokensRemaining) {
	      if (err) return callback(err, null);
	
	      self.tokensThisInterval += count;
	      callback(null, tokensRemaining);
	    }
	  },
	
	  /**
	   * Attempt to remove the requested number of tokens and return immediately.
	   * If the bucket (and any parent buckets) contains enough tokens and we
	   * haven't spent too many tokens in this interval already, this will return
	   * true. Otherwise, false is returned.
	   * @param {Number} count The number of tokens to remove.
	   * @param {Boolean} True if the tokens were successfully removed, otherwise
	   *  false.
	   */
	  tryRemoveTokens: function(count) {
	    // Make sure the request isn't for more than we can handle
	    if (count > this.tokenBucket.bucketSize)
	      return false;
	
	    var now = Date.now();
	
	    // Advance the current interval and reset the current interval token count
	    // if needed
	    if (now - this.curIntervalStart >= this.tokenBucket.interval) {
	      this.curIntervalStart = now;
	      this.tokensThisInterval = 0;
	    }
	
	    // If we don't have enough tokens left in this interval, return false
	    if (count > this.tokenBucket.tokensPerInterval - this.tokensThisInterval)
	      return false;
	
	    // Try to remove the requested number of tokens from the token bucket
	    return this.tokenBucket.tryRemoveTokens(count);
	  },
	
	  /**
	   * Returns the number of tokens remaining in the TokenBucket.
	   * @returns {Number} The number of tokens remaining.
	   */
	  getTokensRemaining: function () {
	    this.tokenBucket.drip();
	    return this.tokenBucket.content;
	  }
	};
	
	module.exports = RateLimiter;


/***/ },
/* 151 */
/***/ function(module, exports) {

	// From https://raw.githubusercontent.com/nikoskalogridis/deep-freeze/fb921b32064dce1645197be2bf975fe0385450b0/index.js
	// which is sadly, no longer maintained
	
	module.exports = function deepFreeze (o) {
	  if (o) {
	    Object.freeze(o);
	
	    Object.getOwnPropertyNames(o).forEach(function (prop) {
	      if (o.hasOwnProperty(prop)
	        && o[prop] !== null
	        && (typeof o[prop] === 'object' || typeof o[prop] === 'function')
	        && (o[prop].constructor !== Buffer)
	        && !Object.isFrozen(o[prop])) {
	          deepFreeze(o[prop]);
	        }
	    });
	
	  }
	  return o;
	};


/***/ },
/* 152 */
/***/ function(module, exports) {

	module.exports = require("auth0@2.4.0");

/***/ },
/* 153 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 154 */
/***/ function(module, exports) {

	module.exports = require("ejs");

/***/ },
/* 155 */
/***/ function(module, exports) {

	module.exports = require("github");

/***/ },
/* 156 */
/***/ function(module, exports) {

	module.exports = require("lru-cache");

/***/ },
/* 157 */
/***/ function(module, exports) {

	module.exports = require("morgan");

/***/ },
/* 158 */
/***/ function(module, exports) {

	module.exports = require("node-uuid");

/***/ },
/* 159 */
/***/ function(module, exports) {

	module.exports = require("request");

/***/ },
/* 160 */
/***/ function(module, exports) {

	module.exports = require("request-promise");

/***/ },
/* 161 */
/***/ function(module, exports) {

	module.exports = require("webtask-tools");

/***/ }
/******/ ]);