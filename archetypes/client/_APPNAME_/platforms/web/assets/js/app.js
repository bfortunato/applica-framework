(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changePassword = exports.resetUserPassword = exports.resetPassword = exports.validateRecoveryCode = exports.requestRecoveryCode = exports.confirmAccount = exports.setActivationCode = exports.recoverAccount = exports.register = void 0;

var aj = _interopRequireWildcard(require("../aj/index"));

var _ajex = require("../utils/ajex");

var SessionApi = _interopRequireWildcard(require("../api/session"));

var AccountApi = _interopRequireWildcard(require("../api/account"));

var responses = _interopRequireWildcard(require("../api/responses"));

var _plugins = require("../plugins");

var _lang = require("../utils/lang");

var _strings = _interopRequireDefault(require("../strings"));

var _underscore = _interopRequireDefault(require("underscore"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var register = (0, _ajex.createAsyncAction)(_types.REGISTER, function (data) {
  if (_underscore["default"].isEmpty(data.name) || _underscore["default"].isEmpty(data.mail) || _underscore["default"].isEmpty(data.password)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("nameMailAndPasswordRequired"), "warning");
    return;
  }

  aj.dispatch({
    type: _types.REGISTER
  });
  (0, _plugins.showLoader)((0, _strings["default"])("registering"));
  AccountApi.register(data.name, data.mail, data.password).then(function () {
    (0, _plugins.hideLoader)();
    var message = (0, _lang.format)((0, _strings["default"])("welcomeMessage"), data.name, data.mail);
    register.complete({
      name: data.name,
      mail: data.mail,
      message: message
    });
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    register.fail();
  });
});
exports.register = register;
var recoverAccount = (0, _ajex.createAsyncAction)(_types.RECOVER_ACCOUNT, function (data) {
  if (_underscore["default"].isEmpty(data.mail)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("mailRequired"), "warning");
    return;
  }

  aj.dispatch({
    type: _types.RECOVER_ACCOUNT
  });
  (0, _plugins.showLoader)();
  AccountApi.recover(data.mail).then(function () {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("congratulations"), (0, _lang.format)((0, _strings["default"])("accountRecovered"), data.mail));
    recoverAccount.complete();
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    recoverAccount.fail();
  });
});
exports.recoverAccount = recoverAccount;
var setActivationCode = aj.createAction(_types.SET_ACTIVATION_CODE, function (data) {
  aj.dispatch({
    type: _types.SET_ACTIVATION_CODE,
    activationCode: data.activationCode
  });
});
exports.setActivationCode = setActivationCode;
var confirmAccount = (0, _ajex.createAsyncAction)(_types.CONFIRM_ACCOUNT, function (data) {
  if (_underscore["default"].isEmpty(data.activationCode)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("activationCodeRequired"), "warning");
    return;
  }

  aj.dispatch({
    type: _types.CONFIRM_ACCOUNT
  });
  (0, _plugins.showLoader)();
  AccountApi.confirm(data.activationCode).then(function () {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("congratulations"), (0, _strings["default"])("accountConfirmed"));
    confirmAccount.complete();
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    confirmAccount.fail();
  });
});
exports.confirmAccount = confirmAccount;
var requestRecoveryCode = (0, _ajex.createAsyncAction)(_types.REQUEST_RECOVERY_CODE, function (data) {
  if (_underscore["default"].isEmpty(data.mail)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("mailRequired"), "warning");
    return;
  }

  (0, _plugins.showLoader)();
  AccountApi.requestRecoveryCode(data.mail).then(function (resp) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("congratulations"), (0, _lang.format)((0, _strings["default"])("recoveryCodeSent"), data.mail));
    requestRecoveryCode.complete({
      mail: data.mail
    });
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    requestRecoveryCode.fail();
  });
});
exports.requestRecoveryCode = requestRecoveryCode;
var validateRecoveryCode = (0, _ajex.createAsyncAction)(_types.VALIDATE_RECOVERY_CODE, function (data) {
  if (_underscore["default"].isEmpty(data.mail)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("mailRequired"), "warning");
    return;
  }

  if (_underscore["default"].isNull(data.code) || _underscore["default"].isUndefined(data.code) || data.code.length === 0) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("validationCodeRequired"), "warning");
    return;
  }

  var codeSize = 5;

  if (data.code.length !== codeSize) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _lang.format)((0, _strings["default"])("validationCodeLengthMismatch"), codeSize), "warning");
    return;
  }

  (0, _plugins.showLoader)();
  AccountApi.validateRecoveryCode(data.mail, data.code).then(function (resp) {
    (0, _plugins.hideLoader)();
    validateRecoveryCode.complete({
      mail: data.mail,
      code: data.code
    });
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    validateRecoveryCode.fail();
  });
});
exports.validateRecoveryCode = validateRecoveryCode;
var resetPassword = (0, _ajex.createAsyncAction)(_types.RESET_PASSWORD, function (data) {
  if (_underscore["default"].isEmpty(data.mail)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("mailRequired"), "warning");
    return;
  }

  if (_underscore["default"].isNull(data.code) || _underscore["default"].isUndefined(data.code) || data.code.length === 0) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("validationCodeRequired"), "warning");
    return;
  }

  var codeSize = 5;

  if (data.code.length !== codeSize) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _lang.format)((0, _strings["default"])("validationCodeLengthMismatch"), codeSize), "warning");
    return;
  }

  if (_underscore["default"].isEmpty(data.password) | _underscore["default"].isUndefined(data.password) | _underscore["default"].isNull(data.password)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("passwordRequired"), "warning");
    return;
  }

  if (_underscore["default"].isEmpty(data.passwordConfirm) | _underscore["default"].isUndefined(data.passwordConfirm) | _underscore["default"].isNull(data.passwordConfirm)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("passwordConfirmRequired"), "warning");
    return;
  }

  if (data.password !== data.passwordConfirm) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("passwordConfirmMismatch"), "warning");
    return;
  }

  (0, _plugins.showLoader)();
  AccountApi.resetPassword(data.mail, data.code, data.password, data.passwordConfirm).then(function (resp) {
    (0, _plugins.hideLoader)();
    resetPassword.complete();
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)("Attenzione!", responses.msg(e));
    resetPassword.fail();
  });
});
exports.resetPassword = resetPassword;
var resetUserPassword = (0, _ajex.createAsyncAction)(_types.RESET_USER_PASSWORD, function (data) {
  aj.dispatch({
    type: _types.RESET_USER_PASSWORD
  });
  (0, _plugins.showLoader)();
  AccountApi.resetUserPassword(data.id).then(function (response) {
    (0, _plugins.hideLoader)();
    (0, _plugins.toast)((0, _strings["default"])("passwordSuccessfulChanged"));
    resetUserPassword.complete();
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)("Attenzione!", responses.msg(e));
    resetUserPassword.fail();
  });
});
exports.resetUserPassword = resetUserPassword;
var changePassword = (0, _ajex.createAsyncAction)(_types.CHANGE_PASSWORD, function (data) {
  aj.dispatch({
    type: _types.CHANGE_PASSWORD
  });
  (0, _plugins.showLoader)();
  AccountApi.changePassword(data.password, data.passwordConfirm).then(function (response) {
    (0, _plugins.hideLoader)();
    SessionApi.updateUserPassword(data.password);
    SessionApi.updateLoggedUser(response.value.user);
    SessionApi.updateSessionToken(response.value.token);
    (0, _plugins.toast)((0, _strings["default"])("passwordSuccessfulChanged"));
    changePassword.complete({
      firstLogin: false,
      user: response.value.user
    });
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)("Attenzione!", responses.msg(e));
    changePassword.fail({
      firstLogin: null
    });
  });
});
exports.changePassword = changePassword;

},{"../aj/index":12,"../api/account":15,"../api/responses":19,"../api/session":20,"../plugins":338,"../strings":347,"../utils/ajex":348,"../utils/lang":350,"./types":6,"underscore":337}],2:[function(require,module,exports){
/** Entities **/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRevisionEnableStatus = exports.freeSettingValues = exports.updateMultivalueSettings = exports.setMultivalueSettings = exports.freeSelect = exports.getSelectValues = exports.getSelectEntities = exports.freeLookup = exports.getLookupValues = exports.getLookupResult = exports.freeEntities = exports.getEntity = exports.newEntity = exports.saveEntity = exports.deleteEntities = exports.loadEntities = exports.getGrid = void 0;

var aj = _interopRequireWildcard(require("../aj/index"));

var _ajex = require("../utils/ajex");

var SessionApi = _interopRequireWildcard(require("../api/session"));

var responses = _interopRequireWildcard(require("../api/responses"));

var _plugins = require("../plugins");

var _strings = _interopRequireDefault(require("../strings"));

var GridsApi = _interopRequireWildcard(require("../api/grids"));

var EntitiesApi = _interopRequireWildcard(require("../api/entities"));

var ValuesApi = _interopRequireWildcard(require("../api/values"));

var _underscore = _interopRequireDefault(require("underscore"));

var _ui = require("./ui");

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var getGrid = (0, _ajex.createAsyncAction)(_types.GET_GRID, function (data) {
  if (_underscore["default"].isEmpty(data.id)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("pleaseSpecifyId"));
    return;
  }

  aj.dispatch({
    type: _types.GET_GRID
  });
  (0, _plugins.showLoader)();
  GridsApi.getGrid(data.id).then(function (response) {
    (0, _plugins.hideLoader)();
    getGrid.complete({
      grid: JSON.parse(response.value)
    });
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    getGrid.fail();
  });
});
exports.getGrid = getGrid;
var queries = {};
var loadEntities = (0, _ajex.createAsyncAction)(_types.LOAD_ENTITIES, function (data) {
  if (_underscore["default"].isEmpty(data.entity)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("pleaseSpecifyEntity"));
    return;
  }

  if (_underscore["default"].isEmpty(data.discriminator)) {
    throw new Error("Discriminator is required");
  }

  (0, _plugins.showLoader)();
  aj.dispatch({
    type: _types.LOAD_ENTITIES,
    discriminator: data.discriminator
  });
  var query = !_underscore["default"].isEmpty(data.query) ? data.query : null;
  queries[data.entity] = query;
  EntitiesApi.load(data.entity, query).then(function (response) {
    (0, _plugins.hideLoader)();
    loadEntities.complete({
      result: response.value,
      discriminator: data.discriminator
    });
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    loadEntities.fail({
      discriminator: data.discriminator
    });
  });
});
exports.loadEntities = loadEntities;
var deleteEntities = (0, _ajex.createAsyncAction)(_types.DELETE_ENTITIES, function (data) {
  if (_underscore["default"].isEmpty(data.entity)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("pleaseSpecifyEntity"));
    return;
  }

  if (_underscore["default"].isEmpty(data.ids)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("pleaseSpecifyId"));
    return;
  }

  if (_underscore["default"].isEmpty(data.discriminator)) {
    throw new Error("Discriminator is required");
  }

  (0, _plugins.showLoader)();
  aj.dispatch({
    type: _types.DELETE_ENTITIES,
    discriminator: data.discriminator
  });
  EntitiesApi.delete_(data.entity, data.ids).then(function () {
    (0, _plugins.hideLoader)();
    deleteEntities.complete({
      discriminator: data.discriminator
    });

    if (_underscore["default"].has(queries, data.entity)) {
      loadEntities({
        discriminator: data.discriminator,
        entity: data.entity,
        query: queries[data.entity]
      });
    }
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    deleteEntities.fail({
      discriminator: data.discriminator
    });
  });
});
exports.deleteEntities = deleteEntities;
var saveEntity = (0, _ajex.createAsyncAction)(_types.SAVE_ENTITY, function (data) {
  if (_underscore["default"].isEmpty(data.entity)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("pleaseSpecifyEntity"));
    return;
  }

  if (_underscore["default"].isEmpty(data.data)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("pleaseSpecifyData"));
    return;
  }

  if (_underscore["default"].isEmpty(data.discriminator)) {
    throw new Error("Discriminator is required");
  }

  (0, _plugins.showLoader)();
  aj.dispatch({
    type: _types.SAVE_ENTITY,
    discriminator: data.discriminator
  });
  EntitiesApi.save(data.entity, data.data).then(function (response) {
    (0, _plugins.hideLoader)();
    (0, _plugins.toast)((0, _strings["default"])("saveComplete"));
    saveEntity.complete({
      discriminator: data.discriminator,
      data: data.data
    });

    if (data.reload) {
      getEntity({
        discriminator: data.discriminator,
        entity: data.entity,
        id: response.value.id
      });
    }

    if (data.entity == "user") {
      if (SessionApi.getLoggedUser() != null && SessionApi.getLoggedUser().id == data.data.id) {
        (0, _ui.getUserProfileImage)();
        (0, _ui.getUserCoverImage)();
      }
    }
  })["catch"](function (r) {
    (0, _plugins.hideLoader)();

    if (r.responseCode === responses.ERROR_VALIDATION) {
      saveEntity.fail({
        discriminator: data.discriminator,
        data: data.data,
        validationError: true,
        validationResult: r.result
      });
    } else {
      (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(r.responseCode), "error");
      saveEntity.fail({
        discriminator: data.discriminator,
        data: data.data,
        validationError: false,
        validationResult: null
      });
    }
  });
});
exports.saveEntity = saveEntity;
var newEntity = aj.createAction(_types.NEW_ENTITY, function (data) {
  if (_underscore["default"].isEmpty(data.discriminator)) {
    throw new Error("Discriminator is required");
  }

  aj.dispatch({
    type: _types.NEW_ENTITY,
    discriminator: data.discriminator
  });
});
exports.newEntity = newEntity;
var getEntity = (0, _ajex.createAsyncAction)(_types.GET_ENTITY, function (data) {
  if (_underscore["default"].isEmpty(data.entity)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("pleaseSpecifyEntity"));
    return;
  }

  if (_underscore["default"].isEmpty(data.id)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("pleaseSpecifyId"));
    return;
  }

  if (_underscore["default"].isEmpty(data.discriminator)) {
    throw new Error("Discriminator is required");
  }

  (0, _plugins.showLoader)();
  aj.dispatch({
    type: _types.GET_ENTITY,
    discriminator: data.discriminator
  });
  EntitiesApi.get(data.entity, data.id, data.params).then(function (response) {
    (0, _plugins.hideLoader)();
    getEntity.complete({
      data: response.value,
      discriminator: data.discriminator
    });
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    getEntity.fail({
      discriminator: data.discriminator
    });
  });
});
exports.getEntity = getEntity;
var freeEntities = aj.createAction(_types.FREE_ENTITIES, function (data) {
  aj.dispatch({
    type: _types.FREE_ENTITIES,
    discriminator: data.discriminator
  });
});
/**
 * LOOKUP ACTIONS
 */

exports.freeEntities = freeEntities;
var getLookupResult = (0, _ajex.createAsyncAction)(_types.GET_LOOKUP_RESULT, function (data) {
  if (_underscore["default"].isEmpty(data.entity)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("pleaseSpecifyEntity"));
    return;
  }

  if (_underscore["default"].isEmpty(data.discriminator)) {
    throw new Error("Discriminator is required");
  }

  aj.dispatch({
    type: _types.GET_LOOKUP_RESULT,
    discriminator: data.discriminator
  });
  EntitiesApi.load(data.entity, !_underscore["default"].isEmpty(data.query) ? data.query : null).then(function (response) {
    getLookupResult.complete({
      result: response.value,
      discriminator: data.discriminator
    });
  })["catch"](function (e) {
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    getLookupResult.fail({
      discriminator: data.discriminator
    });
  });
});
exports.getLookupResult = getLookupResult;
var getLookupValues = (0, _ajex.createAsyncAction)(_types.GET_LOOKUP_VALUES, function (data) {
  if (_underscore["default"].isEmpty(data.collection)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("pleaseSpecifyEntity"));
    return;
  }

  if (_underscore["default"].isEmpty(data.discriminator)) {
    throw new Error("Discriminator is required");
  }

  aj.dispatch({
    type: _types.GET_LOOKUP_VALUES,
    discriminator: data.discriminator
  });
  ValuesApi.load(data.collection, data.keyword, {
    page: data.page,
    rowsPerPage: data.rowsPerPage
  }).then(function (response) {
    getLookupValues.complete({
      values: response.value,
      discriminator: data.discriminator
    });
  })["catch"](function (e) {
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    getLookupValues.fail({
      discriminator: data.discriminator
    });
  });
});
exports.getLookupValues = getLookupValues;
var freeLookup = aj.createAction(_types.FREE_LOOKUP, function (data) {
  aj.dispatch({
    type: _types.FREE_LOOKUP,
    discriminator: data.discriminator
  });
});
/**
 * SELECT ACTIONS
 */

exports.freeLookup = freeLookup;
var getSelectEntities = (0, _ajex.createAsyncAction)(_types.GET_SELECT_ENTITIES, function (data) {
  if (_underscore["default"].isEmpty(data.entity)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("pleaseSpecifyEntity"));
    return;
  }

  if (_underscore["default"].isEmpty(data.discriminator)) {
    throw new Error("Discriminator is required");
  }

  aj.dispatch({
    type: _types.GET_SELECT_ENTITIES,
    discriminator: data.discriminator
  });
  ValuesApi.loadEntities(data.entity, data.query).then(function (response) {
    getSelectEntities.complete({
      entities: response.value,
      discriminator: data.discriminator
    });
  })["catch"](function (e) {
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    getSelectEntities.fail({
      discriminator: data.discriminator
    });
  });
});
exports.getSelectEntities = getSelectEntities;
var getSelectValues = (0, _ajex.createAsyncAction)(_types.GET_SELECT_VALUES, function (data) {
  if (_underscore["default"].isEmpty(data.collection)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("pleaseSpecifyEntity"));
    return;
  }

  if (_underscore["default"].isEmpty(data.discriminator)) {
    throw new Error("Discriminator is required");
  }

  aj.dispatch({
    type: _types.GET_SELECT_VALUES,
    discriminator: data.discriminator
  });
  ValuesApi.load(data.collection, data.keyword).then(function (response) {
    getSelectValues.complete({
      values: response.value,
      discriminator: data.discriminator
    });
  })["catch"](function (e) {
    (0, _plugins.alert)((0, _strings["default"])("ooops"), responses.msg(e), "error");
    getSelectValues.fail({
      discriminator: data.discriminator
    });
  });
});
exports.getSelectValues = getSelectValues;
var freeSelect = aj.createAction(_types.FREE_SELECT, function (data) {
  aj.dispatch({
    type: _types.FREE_SELECT,
    discriminator: data.discriminator
  });
});
exports.freeSelect = freeSelect;
var setMultivalueSettings = aj.createAction(_types.SET_MULTIVALUE_SETTINGS, function (data) {
  aj.dispatch({
    type: _types.SET_MULTIVALUE_SETTINGS,
    items: data.items,
    discriminator: data.discriminator
  });
});
exports.setMultivalueSettings = setMultivalueSettings;
var updateMultivalueSettings = aj.createAction(_types.UPDATE_MULTIVALUE_SETTINGS, function (data) {
  aj.dispatch({
    type: _types.UPDATE_MULTIVALUE_SETTINGS,
    itemType: data.itemType,
    enabled: data.enabled,
    discriminator: data.discriminator
  });
});
exports.updateMultivalueSettings = updateMultivalueSettings;
var freeSettingValues = aj.createAction(_types.FREE_SETTINGS_VALUES, function (data) {
  aj.dispatch({
    type: _types.FREE_SETTINGS_VALUES,
    discriminator: data.discriminator
  });
});
exports.freeSettingValues = freeSettingValues;
var checkRevisionEnableStatus = (0, _ajex.createAsyncAction)(_types.CHECK_REVISION_ENABLE_STATUS, function (data) {
  aj.dispatch({
    type: _types.CHECK_REVISION_ENABLE_STATUS,
    discriminator: data.discriminator
  });
  EntitiesApi.checkRevisionEnableStatus(data.entity).then(function (response) {
    checkRevisionEnableStatus.complete({
      revisionEnabled: response.value,
      discriminator: data.discriminator
    });
  })["catch"](function (e) {
    checkRevisionEnableStatus.fail({
      discriminator: data.discriminator
    });
  });
});
exports.checkRevisionEnableStatus = checkRevisionEnableStatus;

},{"../aj/index":12,"../api/entities":16,"../api/grids":17,"../api/responses":19,"../api/session":20,"../api/values":23,"../plugins":338,"../strings":347,"../utils/ajex":348,"./types":6,"./ui":7,"underscore":337}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandMenuItem = exports.setActiveMenuItem = exports.setupMenu = exports.SETUP_MENU = void 0;

var aj = _interopRequireWildcard(require("../aj/index"));

var _types = require("./types");

var _menu = _interopRequireDefault(require("../model/menu"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var SETUP_MENU = "SETUP_MENU";
exports.SETUP_MENU = SETUP_MENU;
var setupMenu = aj.createAction(SETUP_MENU, function (data) {
  aj.dispatch({
    type: SETUP_MENU,
    user: data.user,
    menu: _menu["default"]
  });
});
exports.setupMenu = setupMenu;
var setActiveMenuItem = aj.createAction(_types.SET_ACTIVE_MENU_ITEM, function (data) {
  aj.dispatch({
    type: _types.SET_ACTIVE_MENU_ITEM,
    item: data.item
  });
});
exports.setActiveMenuItem = setActiveMenuItem;
var expandMenuItem = aj.createAction(_types.EXPAND_MENU_ITEM, function (data) {
  aj.dispatch({
    type: _types.EXPAND_MENU_ITEM,
    item: data.item
  });
});
exports.expandMenuItem = expandMenuItem;

},{"../aj/index":12,"../model/menu":29,"./types":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logout = exports.resumeSession = exports.login = void 0;

var aj = _interopRequireWildcard(require("../aj/index"));

var _ajex = require("../utils/ajex");

var SessionApi = _interopRequireWildcard(require("../api/session"));

var _plugins = require("../plugins");

var _strings = _interopRequireDefault(require("../strings"));

var _underscore = _interopRequireDefault(require("underscore"));

var _types = require("./types");

var _ui = require("./ui");

var _menu = require("./menu");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var login = (0, _ajex.createAsyncAction)(_types.LOGIN, function (data) {
  if (_underscore["default"].isEmpty(data.mail) || _underscore["default"].isEmpty(data.password)) {
    (0, _plugins.alert)((0, _strings["default"])("problemOccoured"), (0, _strings["default"])("mailAndPasswordRequired"), "warning");
    return;
  }

  aj.dispatch({
    type: _types.LOGIN
  });
  (0, _plugins.showLoader)();
  SessionApi.start(data.mail, data.password).then(function (user) {
    (0, _plugins.hideLoader)();
    (0, _plugins.toast)((0, _strings["default"])("welcome") + " " + user.name);
    login.complete({
      user: user
    });
    performLoginUserAction(user);
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    (0, _plugins.alert)((0, _strings["default"])("ooops"), (0, _strings["default"])("badLogin"), "error");
    login.fail();
  });
});
exports.login = login;

function performLoginUserAction(user) {
  if (user) {
    (0, _menu.setupMenu)({
      user: user
    });
  }

  (0, _ui.getUserProfileImage)();
  (0, _ui.getUserCoverImage)();
}

var resumeSession = (0, _ajex.createAsyncAction)(_types.RESUME_SESSION, function (data) {
  aj.dispatch({
    type: _types.RESUME_SESSION
  });
  SessionApi.resume().then(function (user) {
    (0, _plugins.hideLoader)();
    (0, _plugins.toast)((0, _strings["default"])("welcome") + " " + user.name);
    resumeSession.complete({
      user: user
    });
    performLoginUserAction(user);
  })["catch"](function (e) {
    (0, _plugins.hideLoader)();
    resumeSession.fail();
  });
});
exports.resumeSession = resumeSession;
var logout = aj.createAction(_types.LOGOUT, function (data) {
  SessionApi.destroy().then(function () {
    aj.dispatch({
      type: _types.LOGOUT
    });
  });
});
exports.logout = logout;

},{"../aj/index":12,"../api/session":20,"../plugins":338,"../strings":347,"../utils/ajex":348,"./menu":3,"./types":6,"./ui":7,"underscore":337}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.systemInformation = void 0;

var _types = require("./types");

var _ajex = require("../utils/ajex");

var SystemApi = _interopRequireWildcard(require("../api/system"));

var config = _interopRequireWildcard(require("../config"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var systemInformation = (0, _ajex.createAsyncAction)(_types.SYSTEM_INFORMATIONS, function (data) {
  SystemApi.getSystemInfos().then(function (response) {
    var systemInfos = {};
    systemInfos.backendVersion = config.backendVersion;
    systemInfos.apiVersion = response.value.apiVersion;
    systemInfos.copyrightInfos = config.copyrightInfos;
    systemInformation.complete(systemInfos);
  })["catch"](function (e) {});
});
exports.systemInformation = systemInformation;

},{"../api/system":21,"../config":25,"../utils/ajex":348,"./types":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SYSTEM_INFORMATIONS = exports.CHECK_REVISION_ENABLE_STATUS = exports.SET_MULTIVALUE_SETTINGS = exports.UPDATE_MULTIVALUE_SETTINGS = exports.FREE_SETTINGS_VALUES = exports.CHANGE_PASSWORD = exports.RESET_USER_PASSWORD = exports.GET_USER_PROFILE_IMAGE = exports.GET_USER_COVER_IMAGE = exports.EXPAND_MENU_ITEM = exports.SET_ACTIVE_MENU_ITEM = exports.SETUP_MENU = exports.FREE_SELECT = exports.GET_SELECT_VALUES = exports.GET_SELECT_ENTITIES = exports.FREE_LOOKUP = exports.GET_LOOKUP_VALUES = exports.GET_LOOKUP_RESULT = exports.FREE_ENTITIES = exports.GET_ENTITY = exports.NEW_ENTITY = exports.SAVE_ENTITY = exports.DELETE_ENTITIES = exports.LOAD_ENTITIES = exports.GET_GRID = exports.CONFIRM_ACCOUNT = exports.SET_ACTIVATION_CODE = exports.VALIDATE_RECOVERY_CODE = exports.RESET_PASSWORD = exports.REQUEST_RECOVERY_CODE = exports.RECOVER_ACCOUNT = exports.REGISTER = exports.LOGOUT = exports.RESUME_SESSION = exports.LOGIN = void 0;
var LOGIN = "LOGIN";
exports.LOGIN = LOGIN;
var RESUME_SESSION = "RESUME_SESSION";
exports.RESUME_SESSION = RESUME_SESSION;
var LOGOUT = "LOGOUT";
exports.LOGOUT = LOGOUT;
var REGISTER = "REGISTER";
exports.REGISTER = REGISTER;
var RECOVER_ACCOUNT = "RECOVER_ACCOUNT";
exports.RECOVER_ACCOUNT = RECOVER_ACCOUNT;
var REQUEST_RECOVERY_CODE = "REQUEST_RECOVERY_CODE";
exports.REQUEST_RECOVERY_CODE = REQUEST_RECOVERY_CODE;
var RESET_PASSWORD = "RESET_PASSWORD";
exports.RESET_PASSWORD = RESET_PASSWORD;
var VALIDATE_RECOVERY_CODE = "VALIDATE_RECOVERY_CODE";
exports.VALIDATE_RECOVERY_CODE = VALIDATE_RECOVERY_CODE;
var SET_ACTIVATION_CODE = "SET_ACTIVATION_CODE";
exports.SET_ACTIVATION_CODE = SET_ACTIVATION_CODE;
var CONFIRM_ACCOUNT = "CONFIRM_ACCOUNT";
exports.CONFIRM_ACCOUNT = CONFIRM_ACCOUNT;
var GET_GRID = "GET_GRID";
exports.GET_GRID = GET_GRID;
var LOAD_ENTITIES = "LOAD_ENTITIES";
exports.LOAD_ENTITIES = LOAD_ENTITIES;
var DELETE_ENTITIES = "DELETE_ENTITIES";
exports.DELETE_ENTITIES = DELETE_ENTITIES;
var SAVE_ENTITY = "SAVE_ENTITY";
exports.SAVE_ENTITY = SAVE_ENTITY;
var NEW_ENTITY = "NEW_ENTITY";
exports.NEW_ENTITY = NEW_ENTITY;
var GET_ENTITY = "GET_ENTITY";
exports.GET_ENTITY = GET_ENTITY;
var FREE_ENTITIES = "FREE_ENTITIES";
exports.FREE_ENTITIES = FREE_ENTITIES;
var GET_LOOKUP_RESULT = "GET_LOOKUP_RESULT";
exports.GET_LOOKUP_RESULT = GET_LOOKUP_RESULT;
var GET_LOOKUP_VALUES = "GET_LOOKUP_VALUES";
exports.GET_LOOKUP_VALUES = GET_LOOKUP_VALUES;
var FREE_LOOKUP = "FREE_LOOKUP";
exports.FREE_LOOKUP = FREE_LOOKUP;
var GET_SELECT_ENTITIES = "GET_SELECT_ENTITIES";
exports.GET_SELECT_ENTITIES = GET_SELECT_ENTITIES;
var GET_SELECT_VALUES = "GET_SELECT_VALUES";
exports.GET_SELECT_VALUES = GET_SELECT_VALUES;
var FREE_SELECT = "FREE_SELECT";
exports.FREE_SELECT = FREE_SELECT;
var SETUP_MENU = "SETUP_MENU";
exports.SETUP_MENU = SETUP_MENU;
var SET_ACTIVE_MENU_ITEM = "SET_ACTIVE_MENU_ITEM";
exports.SET_ACTIVE_MENU_ITEM = SET_ACTIVE_MENU_ITEM;
var EXPAND_MENU_ITEM = "EXPAND_MENU_ITEM";
exports.EXPAND_MENU_ITEM = EXPAND_MENU_ITEM;
var GET_USER_COVER_IMAGE = "GET_USER_COVER_IMAGE";
exports.GET_USER_COVER_IMAGE = GET_USER_COVER_IMAGE;
var GET_USER_PROFILE_IMAGE = "GET_USER_PROFILE_IMAGE";
exports.GET_USER_PROFILE_IMAGE = GET_USER_PROFILE_IMAGE;
var RESET_USER_PASSWORD = "RESET_USER_PASSWORD";
exports.RESET_USER_PASSWORD = RESET_USER_PASSWORD;
var CHANGE_PASSWORD = "CHANGE_PASSWORD";
exports.CHANGE_PASSWORD = CHANGE_PASSWORD;
var FREE_SETTINGS_VALUES = "FREE_SETTINGS_VALUES";
exports.FREE_SETTINGS_VALUES = FREE_SETTINGS_VALUES;
var UPDATE_MULTIVALUE_SETTINGS = "UPDATE_MULTIVALUE_SETTINGS";
exports.UPDATE_MULTIVALUE_SETTINGS = UPDATE_MULTIVALUE_SETTINGS;
var SET_MULTIVALUE_SETTINGS = "SET_MULTIVALUE_SETTINGS";
exports.SET_MULTIVALUE_SETTINGS = SET_MULTIVALUE_SETTINGS;
var CHECK_REVISION_ENABLE_STATUS = "CHECK_REVISION_ENABLE_STATUS";
exports.CHECK_REVISION_ENABLE_STATUS = CHECK_REVISION_ENABLE_STATUS;
var SYSTEM_INFORMATIONS = "SYSTEM_INFORMATIONS";
exports.SYSTEM_INFORMATIONS = SYSTEM_INFORMATIONS;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserProfileImage = exports.getUserCoverImage = void 0;

var aj = _interopRequireWildcard(require("../aj/index"));

var _ajex = require("../utils/ajex");

var SessionApi = _interopRequireWildcard(require("../api/session"));

var AccountApi = _interopRequireWildcard(require("../api/account"));

var _types = require("./types");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var getUserCoverImage = (0, _ajex.createAsyncAction)(_types.GET_USER_COVER_IMAGE, function (data) {
  var user = SessionApi.getLoggedUser();

  if (user == null) {
    return;
  }

  aj.dispatch({
    type: _types.GET_USER_COVER_IMAGE
  });
  AccountApi.getCoverImage(user.id).then(function (data) {
    getUserCoverImage.complete({
      data: data.value
    });
  })["catch"](function (e) {
    getUserCoverImage.fail({
      e: e
    });
  });
});
exports.getUserCoverImage = getUserCoverImage;
var getUserProfileImage = (0, _ajex.createAsyncAction)(_types.GET_USER_PROFILE_IMAGE, function (data) {
  var user = SessionApi.getLoggedUser();

  if (user == null) {
    return;
  }

  aj.dispatch({
    type: _types.GET_USER_PROFILE_IMAGE
  });
  AccountApi.getProfileImage(user.id).then(function (data) {
    getUserProfileImage.complete({
      data: data.value
    });
  })["catch"](function (e) {
    getUserProfileImage.fail({
      e: e
    });
  });
});
exports.getUserProfileImage = getUserProfileImage;

},{"../aj/index":12,"../api/account":15,"../api/session":20,"../utils/ajex":348,"./types":6}],8:[function(require,module,exports){
"use strict";

var _ = require("underscore");

exports.assertTrue = function (test, msg) {
  if (!test) {
    throw "Assertion failure: " + msg || "";
  }
};

exports.assertEquals = function (first, second, msg) {
  if (first != second) {
    throw "Assertion failure: " + msg || "";
  }
};

exports.assertNotNull = function (obj, msg) {
  if (obj == undefined || obj == null) {
    throw "Assertion failure: " + msg || "";
  }
};

exports.assertNotEmpty = function (obj, msg) {
  if (_.isEmpty(obj)) {
    throw "Assertion failure: " + msg || "";
  }
};

},{"underscore":337}],9:[function(require,module,exports){
'use strict';

var version = "2.1.9"; // constants

var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

var b64tab = function (bin) {
  var t = {};

  for (var i = 0, l = bin.length; i < l; i++) {
    t[bin.charAt(i)] = i;
  }

  return t;
}(b64chars);

var fromCharCode = String.fromCharCode; // encoder stuff

var cb_utob = function cb_utob(c) {
  if (c.length < 2) {
    var cc = c.charCodeAt(0);
    return cc < 0x80 ? c : cc < 0x800 ? fromCharCode(0xc0 | cc >>> 6) + fromCharCode(0x80 | cc & 0x3f) : fromCharCode(0xe0 | cc >>> 12 & 0x0f) + fromCharCode(0x80 | cc >>> 6 & 0x3f) + fromCharCode(0x80 | cc & 0x3f);
  } else {
    var cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
    return fromCharCode(0xf0 | cc >>> 18 & 0x07) + fromCharCode(0x80 | cc >>> 12 & 0x3f) + fromCharCode(0x80 | cc >>> 6 & 0x3f) + fromCharCode(0x80 | cc & 0x3f);
  }
};

var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;

var utob = function utob(u) {
  return u.replace(re_utob, cb_utob);
};

var cb_encode = function cb_encode(ccc) {
  var padlen = [0, 2, 1][ccc.length % 3],
      ord = ccc.charCodeAt(0) << 16 | (ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8 | (ccc.length > 2 ? ccc.charCodeAt(2) : 0),
      chars = [b64chars.charAt(ord >>> 18), b64chars.charAt(ord >>> 12 & 63), padlen >= 2 ? '=' : b64chars.charAt(ord >>> 6 & 63), padlen >= 1 ? '=' : b64chars.charAt(ord & 63)];
  return chars.join('');
};

var btoa = function btoa(b) {
  return b.replace(/[\s\S]{1,3}/g, cb_encode);
};

var _encode = function _encode(u) {
  return btoa(utob(u));
};

var encode = function encode(u, urisafe) {
  return !urisafe ? _encode(String(u)) : _encode(String(u)).replace(/[+\/]/g, function (m0) {
    return m0 == '+' ? '-' : '_';
  }).replace(/=/g, '');
};

var encodeURI = function encodeURI(u) {
  return encode(u, true);
}; // decoder stuff


var re_btou = new RegExp(['[\xC0-\xDF][\x80-\xBF]', '[\xE0-\xEF][\x80-\xBF]{2}', '[\xF0-\xF7][\x80-\xBF]{3}'].join('|'), 'g');

var cb_btou = function cb_btou(cccc) {
  switch (cccc.length) {
    case 4:
      var cp = (0x07 & cccc.charCodeAt(0)) << 18 | (0x3f & cccc.charCodeAt(1)) << 12 | (0x3f & cccc.charCodeAt(2)) << 6 | 0x3f & cccc.charCodeAt(3),
          offset = cp - 0x10000;
      return fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00);

    case 3:
      return fromCharCode((0x0f & cccc.charCodeAt(0)) << 12 | (0x3f & cccc.charCodeAt(1)) << 6 | 0x3f & cccc.charCodeAt(2));

    default:
      return fromCharCode((0x1f & cccc.charCodeAt(0)) << 6 | 0x3f & cccc.charCodeAt(1));
  }
};

var btou = function btou(b) {
  return b.replace(re_btou, cb_btou);
};

var cb_decode = function cb_decode(cccc) {
  var len = cccc.length,
      padlen = len % 4,
      n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
      chars = [fromCharCode(n >>> 16), fromCharCode(n >>> 8 & 0xff), fromCharCode(n & 0xff)];
  chars.length -= [0, 0, 2, 1][padlen];
  return chars.join('');
};

var atob = function atob(a) {
  return a.replace(/[\s\S]{1,4}/g, cb_decode);
};

var _decode = function _decode(a) {
  return btou(atob(a));
};

var decode = function decode(a) {
  return _decode(String(a).replace(/[-_]/g, function (m0) {
    return m0 == '-' ? '+' : '/';
  }).replace(/[^A-Za-z0-9\+\/]/g, ''));
}; // export Base64


module.exports = {
  VERSION: version,
  atob: atob,
  btoa: btoa,
  fromBase64: decode,
  toBase64: encode,
  utob: utob,
  encode: encode,
  encodeURI: encodeURI,
  btou: btou,
  decode: decode
};

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Observable = exports.EventEmitter = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var EventEmitter = {};
exports.EventEmitter = EventEmitter;

EventEmitter.addListener = function (obj, evt, handler) {
  var listeners = obj.$$events_listeners;

  if (!listeners) {
    listeners = {};
    obj.$$events_listeners = listeners;
  }

  if (!listeners[evt]) {
    listeners[evt] = [];
  }

  listeners[evt].push(handler);
};

EventEmitter.addCallback = function (obj, evt, handler) {
  var callbacks = obj.$$events_callbacks;

  if (!callbacks) {
    callbacks = {};
    obj.$$events_callbacks = callbacks;
  }

  if (!callbacks[evt]) {
    callbacks[evt] = [];
  }

  callbacks[evt].push(handler);
};

EventEmitter.addListeners = function (obj, listeners) {
  for (var key in listeners) {
    EventEmitter.addListener(obj, key, listeners[key]);
  }
};

EventEmitter.removeListener = function (obj, evt, listener) {
  if (obj.$$events_listeners && obj.$$events_listeners[evt]) {
    obj.$$events_listeners[evt] = obj.$$events_listeners[evt].filter(function (l) {
      return l != listener;
    });
  }
};

EventEmitter.on = function (obj, evt, handler) {
  if (_typeof(evt) === "object") {
    EventEmitter.addListeners(obj, evt);
  } else {
    EventEmitter.addListener(obj, evt, handler);
  }
};

EventEmitter.off = function (obj, evt, handler) {
  EventEmitter.removeListener(obj, evt, handler);
};

EventEmitter.live = function (obj, evt) {
  if (!obj.$$events_offs) obj.$$events_offs = {};

  if (evt) {
    obj.$$events_offs[evt] = false;
  } else {
    obj.$$events_off = false;
  }
};

EventEmitter.die = function (obj, evt) {
  if (!obj.$$events_offs) obj.$$events_offs = {};

  if (evt) {
    obj.$$events_offs[evt] = true;
  } else {
    obj.$$events_off = true;
  }
};

EventEmitter.invoke = function (obj, evt) {
  if (!obj.$$events_offs) obj.$$events_offs = {};
  if (obj.$$events_off) return;
  if (obj.$$events_offs[evt]) return;
  var listeners = obj.$$events_listeners;

  if (!listeners) {
    listeners = {};
    obj.$$events_listeners = listeners;
  }

  var handlers = listeners[evt];

  if (handlers) {
    var size = handlers.length;

    for (var i = 0; i < size; i++) {
      var h = handlers[i];
      h.apply(obj, Array.prototype.slice.call(arguments, 2));
    }
  }

  var callbacks = obj.$$events_callbacks;

  if (!callbacks) {
    callbacks = {};
    obj.$$events_callbacks = callbacks;
  }

  var callbackHandlers = callbacks[evt];

  if (callbackHandlers) {
    var _size = callbackHandlers.length;

    for (var _i = 0; _i < _size; _i++) {
      var _h = callbackHandlers[_i];

      _h.apply(obj, Array.prototype.slice.call(arguments, 2));
    }
  }

  callbacks[evt] = [];
};

var Observable =
/*#__PURE__*/
function () {
  function Observable() {
    _classCallCheck(this, Observable);
  }

  _createClass(Observable, [{
    key: "on",
    value: function on(evt, handler) {
      EventEmitter.on(this, evt, handler);
    }
  }, {
    key: "once",
    value: function once(evt, handler) {
      EventEmitter.addCallback(this, evt, handler);
    }
  }, {
    key: "off",
    value: function off(evt, handler) {
      EventEmitter.off(this, evt, handler);
    }
  }, {
    key: "invoke",
    value: function invoke(evt) {
      EventEmitter.invoke.apply(null, [this, evt].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }]);

  return Observable;
}();

exports.Observable = Observable;

},{}],11:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var assert = require("./assert");

var _ = require("underscore");

function buildQueryString(obj) {
  var q = "";
  var first = true;

  for (var k in obj) {
    var sep = first ? "" : "&";
    q += sep + k + "=" + encodeURIComponent(obj[k]);
    first = false;
  }

  return q;
}

var HttpClient =
/*#__PURE__*/
function () {
  function HttpClient(url, method, data) {
    _classCallCheck(this, HttpClient);

    this.url = url;
    this.method = method || "GET";
    this.headers = {};
    this.data = data || {};
    this.accept = null;
    this.contentType = null;
    this.rawResponse = false;
  }

  _createClass(HttpClient, [{
    key: "request",
    value: function request() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        try {
          assert.assertNotEmpty(_this.url, "url is not defined");
          assert.assertNotEmpty(_this.method, "method is not defined");
          var data = _.isObject(_this.data) ? buildQueryString(_this.data) : _this.data;
          var headers = _this.headers || {};
          logger.i(_this.method.toUpperCase() + " " + _this.url);

          if (data) {
            logger.i(data);
          }

          __httpClient.request(_this.url, _this.method, data, headers, _this.accept, _this.contentType, _this.rawResponse, function (error, value) {
            if (error) {
              logger.e("error");
              reject(error);
            } else {
              resolve(value);
            }
          });
        } catch (e) {
          logger.e(e);
          reject(e);
        }
      });
    }
  }]);

  return HttpClient;
}();

var request = function request(url, method, data, headers, accept, contentType, rawResponse) {
  var method = method || "GET";
  var data = data || {};
  var headers = headers || {};
  var rawResponse = rawResponse || false;
  var client = new HttpClient(url);
  client.method = method;
  client.data = data;
  client.headers = headers;
  client.rawResponse = rawResponse;
  client.accept = accept;
  client.contentType = contentType;
  return client.request();
};

exports.HttpClient = HttpClient;
exports.request = request;
/**
 * Makes a GET request to specified url
 * @param url
 * @param data, can be a string or object. If is an object will be converted in a form encoded string
 * @param headers
 * @returns A promise of result
 */

exports.get = function (url, data, headers) {
  var data = data || {};
  var headers = headers || {};
  return request(url, "GET", data, headers, null, null, false);
};
/**
 * Makes a POST request to specified url
 * @param url
 * @param data, can be a string or object. If is an object will be converted in a form encoded string
 * @param headers
 * @returns A promise of result
 */


exports.post = function (url, data, headers) {
  var data = data || {};
  var headers = headers || {};
  return request(url, "POST", data, headers, null, null, false);
};
/**
 * Makes a PUT request to specified url
 * @param url
 * @param data, can be a string or object. If is an object will be converted in a form encoded string
 * @param headers
 * @returns A promise of result
 */


exports.put = function (url, data, headers) {
  var data = data || {};
  var headers = headers || {};
  return request(url, "PUT", data, headers, null, null, false);
};
/**
 * Makes a DELETE request to specified url
 * @param url
 * @param data, can be a string or object. If is an object will be converted in a form encoded string
 * @param headers
 * @returns A promise of result
 */


exports["delete"] = function (url, data, headers) {
  var data = data || {};
  var headers = headers || {};
  return request(url, "DELETE", data, headers, null, null, false);
};
/**
 * Downloads a file from specified url
 * @param url
 * @param data, can be a string or object. If is an object will be converted in a form encoded string
 * @param headers
 * @returns A promise of result
 */


exports.download = function (url, data, headers) {
  var data = data || {};
  var headers = headers || {};
  return request(url, "GET", data, headers, null, null, true);
};

},{"./assert":8,"underscore":337}],12:[function(require,module,exports){
/**
 * AJ Framework main module. Contains functions to create hybrid applications using flux framework
 * @module aj
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuntime = createRuntime;
exports.createStore = createStore;
exports.createAction = createAction;
exports.dispatch = dispatch;
exports.run = _run;
exports.exec = exec;
exports.createBuffer = createBuffer;
exports.readBuffer = readBuffer;
exports.destroyBuffer = destroyBuffer;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _ = require("underscore");

var Observable = require("./events").Observable;

var __runtime = null;
var __stores = {};
var __actions = {};

function stringifyIfNotBrowser(obj) {
  if (window) {
    return obj;
  } else {
    JSON.stringify(obj);
  }
}

var AJRuntime =
/*#__PURE__*/
function () {
  function AJRuntime() {
    _classCallCheck(this, AJRuntime);
  }

  _createClass(AJRuntime, [{
    key: "exec",
    value: function exec() {
      throw "Not implemented";
    }
  }, {
    key: "createBuffer",
    value: function createBuffer(data) {
      throw "Not implemented";
    }
  }, {
    key: "loadBuffer",
    value: function loadBuffer(id) {
      throw "Not implemented";
    }
  }, {
    key: "destroyBuffer",
    value: function destroyBuffer(id) {
      throw "Not implemented";
    }
  }, {
    key: "__trigger",
    value: function __trigger(store, state) {
      throw "Not implemented";
    }
  }], [{
    key: "instance",
    value: function instance() {
      if (!__runtime) {
        throw "Runtime not initialized";
      }

      return __runtime;
    }
  }]);

  return AJRuntime;
}();

if (platform.test) {
  (function () {
    var vm = require("vm");

    var fs = require("fs");

    var buffers = {};
    var bufferId = 0;

    var AJTestRuntime =
    /*#__PURE__*/
    function (_AJRuntime) {
      _inherits(AJTestRuntime, _AJRuntime);

      function AJTestRuntime() {
        var _this;

        _classCallCheck(this, AJTestRuntime);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(AJTestRuntime).call(this));
        _this.semaphores = [];
        logger.i("New test runtime created");
        return _this;
      }

      _createClass(AJTestRuntime, [{
        key: "init",
        value: function init(options) {}
      }, {
        key: "exec",
        value: function exec(plugin, fn, data) {
          logger.i("Executing plugin ", plugin + "." + fn);
          return new Promise(function (resolve, reject) {
            resolve({});
          });
        }
      }, {
        key: "__trigger",
        value: function __trigger(store, state) {
          logger.i("Triggering", store);
          logger.i(stringifyIfNotBrowser(state));
        }
      }, {
        key: "createBuffer",
        value: function createBuffer(data) {
          return new Promise(function (resolve, reject) {
            var id = ++bufferId;
            buffers[id] = data;
            resolve(id);
          });
        }
      }, {
        key: "readBuffer",
        value: function readBuffer(id) {
          return new Promise(function (resolve, reject) {
            resolve(buffers[id]);
          });
        }
      }, {
        key: "destroyBuffer",
        value: function destroyBuffer(id) {
          return new Promise(function (resolve, reject) {
            delete buffers[id];
            resolve();
          });
        }
      }]);

      return AJTestRuntime;
    }(AJRuntime);

    AJRuntime.create = function () {
      return new AJTestRuntime();
    };
  })();
} else if (platform.engine == "node") {
  (function () {
    var vm = require("vm");

    var fs = require("fs");

    var AJWebSocketServerRuntime =
    /*#__PURE__*/
    function (_AJRuntime2) {
      _inherits(AJWebSocketServerRuntime, _AJRuntime2);

      function AJWebSocketServerRuntime() {
        var _this2;

        _classCallCheck(this, AJWebSocketServerRuntime);

        _this2 = _possibleConstructorReturn(this, _getPrototypeOf(AJWebSocketServerRuntime).call(this));
        _this2.semaphores = [];
        logger.i("New websocket server runtime created");
        return _this2;
      }

      _createClass(AJWebSocketServerRuntime, [{
        key: "init",
        value: function init(options) {
          var _this3 = this;

          this.socket = options.socket;

          if (!this.socket) {
            throw "Socket is required";
          }

          this.socket.on("run", function (action, json, ack) {
            async(function () {
              try {
                var data = JSON.parse(json);

                _run(action, data);

                ack();
              } catch (e) {
                if (e && e.stack) {
                  logger.e(e.stack);
                }

                logger.e(e);
              }
            });
          });
          this.socket.on("freeSemaphore", function (id, data) {
            try {
              _this3.freeSemaphore(id, data);
            } catch (e) {
              if (e && e.stack) {
                logger.e(e.stack);
              }

              logger.e(e);
            }
          });
          this.socket.on("error", function (e) {
            if (e && e.stack) {
              logger.e(e.stack);
            }

            logger.e(e);
          });
        }
      }, {
        key: "exec",
        value: function exec(plugin, fn, data) {
          var _this4 = this;

          logger.i("Executing plugin ", plugin + "." + fn);
          return new Promise(function (resolve, reject) {
            _this4.socket.emit("exec", plugin, fn, data, function (error, result) {
              if (!error) {
                resolve(result);
              } else {
                reject(result);
              }
            });
          });
        }
      }, {
        key: "__trigger",
        value: function __trigger(store, state) {
          var _this5 = this;

          if (DEBUG) {
            logger.i("Triggering", store);
            logger.i(stringifyIfNotBrowser(state));
          }

          return new Promise(function (resolve, reject) {
            _this5.socket.emit("trigger", store, state, function () {
              resolve();
            });
          });
        }
      }, {
        key: "freeSemaphore",
        value: function freeSemaphore(id, data) {
          var index = -1;
          var found = false;

          for (var i = 0; i < this.semaphores.length; i++) {
            index++;
            var semaphore = this.semaphores[i];

            if (semaphore.id == id) {
              found = true;
              semaphore.free(data);
              break;
            }
          }

          if (found) {
            this.semaphores.splice(index, 1);
            logger.i("Semaphore destroyed:", semaphore.name);
          }
        }
      }, {
        key: "createBuffer",
        value: function createBuffer(data) {
          var _this6 = this;

          return new Promise(function (resolve, reject) {
            _this6.socket.emit("createBuffer", data, function (error, id) {
              if (!error) {
                resolve(id);
              } else {
                reject();
              }
            });
          });
        }
      }, {
        key: "readBuffer",
        value: function readBuffer(id) {
          var _this7 = this;

          return new Promise(function (resolve, reject) {
            _this7.socket.emit("readBuffer", id, function (error, data) {
              if (!error) {
                resolve(data);
              } else {
                reject();
              }
            });
          });
        }
      }, {
        key: "destroyBuffer",
        value: function destroyBuffer(id) {
          var _this8 = this;

          return new Promise(function (resolve, reject) {
            _this8.socket.emit("readBuffer", id, function (error) {
              if (!error) {
                resolve();
              } else {
                reject();
              }
            });
          });
        }
      }]);

      return AJWebSocketServerRuntime;
    }(AJRuntime);

    AJRuntime.create = function () {
      return new AJWebSocketServerRuntime();
    };
  })();
} else {
  (function () {
    var AJNativeServerRuntime =
    /*#__PURE__*/
    function (_AJRuntime3) {
      _inherits(AJNativeServerRuntime, _AJRuntime3);

      function AJNativeServerRuntime() {
        var _this9;

        _classCallCheck(this, AJNativeServerRuntime);

        _this9 = _possibleConstructorReturn(this, _getPrototypeOf(AJNativeServerRuntime).call(this));
        logger.i("New native server runtime created");
        return _this9;
      }

      _createClass(AJNativeServerRuntime, [{
        key: "init",
        value: function init(options) {}
      }, {
        key: "run",
        value: function run(action, data) {
          _run(action, data);
        }
      }, {
        key: "__trigger",
        value: function (_trigger) {
          function __trigger(_x, _x2) {
            return _trigger.apply(this, arguments);
          }

          __trigger.toString = function () {
            return _trigger.toString();
          };

          return __trigger;
        }(function (store, state) {
          if (__trigger == undefined) {
            throw "__trigger function not defined";
          }

          if (DEBUG) {
            logger.i("Triggering", store);
            logger.i(stringifyIfNotBrowser(state));
          }

          return new Promise(function (resolve, reject) {
            try {
              __trigger(store, state);

              resolve();
            } catch (e) {
              reject(e);
            }
          });
        })
      }, {
        key: "exec",
        value: function exec(plugin, fn, data) {
          if (__exec == undefined) {
            throw "__exec function not defined";
          }

          logger.i("Executing plugin", plugin + "." + fn);
          return new Promise(function (resolve, reject) {
            __exec(plugin, fn, data, function (error, value) {
              if (error) {
                reject(value);
              } else {
                resolve(value);
              }
            });
          });
        }
      }, {
        key: "createBuffer",
        value: function createBuffer(data) {
          return new Promise(function (resolve, reject) {
            __buffersManager.create(data, function (error, value) {
              if (error) {
                reject(value);
              } else {
                resolve(value);
              }
            });
          });
        }
      }, {
        key: "readBuffer",
        value: function readBuffer(id) {
          return new Promise(function (resolve, reject) {
            __buffersManager.read(id, function (error, value) {
              if (error) {
                reject(value);
              } else {
                resolve(value);
              }
            });
          });
        }
      }, {
        key: "destroyBuffer",
        value: function destroyBuffer(id) {
          return new Promise(function (resolve, reject) {
            __buffersManager.destroy(id, function (error, value) {
              if (error) {
                reject(value);
              } else {
                resolve(value);
              }
            });
          });
        }
      }]);

      return AJNativeServerRuntime;
    }(AJRuntime);

    AJRuntime.create = function () {
      return new AJNativeServerRuntime();
    };
  })();
}

var Store =
/*#__PURE__*/
function (_Observable) {
  _inherits(Store, _Observable);

  function Store(type, reducer) {
    var _this10;

    _classCallCheck(this, Store);

    _this10 = _possibleConstructorReturn(this, _getPrototypeOf(Store).call(this));
    _this10.type = type;
    _this10.reducer = reducer;
    _this10.subscriptions = [];
    return _this10;
  }

  _createClass(Store, [{
    key: "init",
    value: function init(options) {}
  }, {
    key: "subscribe",
    value: function subscribe(owner, subscription) {
      this.subscriptions.push({
        owner: owner,
        subscription: subscription
      });
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(owner) {
      this.subscriptions = _.filter(this.subscriptions, function (s) {
        return s.owner != owner;
      });
    }
  }, {
    key: "trigger",
    value: function trigger(state) {
      var newState = state || this.state;

      _.each(this.subscriptions, function (s) {
        s.subscription(newState);
      });

      return __runtime.__trigger(this.type, newState);
    }
  }, {
    key: "dispatch",
    value: function dispatch(action) {
      if (_.isFunction(this.reducer)) {
        var newState = this.reducer(this.state, action);

        if (newState) {
          this.state = newState;
          this.trigger();
        }
      } else {
        logger.w("Cannot dispatch action:", this.type + "." + action);
      }
    }
  }]);

  return Store;
}(Observable);

var Semaphore =
/*#__PURE__*/
function () {
  function Semaphore(action) {
    _classCallCheck(this, Semaphore);

    this.complete = false;
    this.listeners = [];
    this.id = Semaphore.counter++;

    if (action) {
      this.runAction(action);
    }
  }

  _createClass(Semaphore, [{
    key: "runAction",
    value: function runAction(action) {
      var _this11 = this;

      async(function () {
        action();

        _this11.free();
      });
    }
  }, {
    key: "then",
    value: function then(action) {
      this.listeners.push(action);

      if (this.complete) {
        action();
      }

      return this;
    }
  }, {
    key: "free",
    value: function free(data) {
      this.listeners.forEach(function (l) {
        l(data);
      });
      this.complete = true;
      return this;
    }
  }]);

  return Semaphore;
}();

Semaphore.counter = 1;
/**
 * @function createRuntime
 * @description Creates a new instance of runtime. Usually used internally by devices runtimes
 * @returns singleton instance of runtime
 */

function createRuntime(options) {
  __runtime = AJRuntime.create();

  __runtime.init(options);

  return __runtime;
}

;
/**
 * @function createStore
 * @description Creates a new singleton instance of store
 * @param {string} type - Name of store to create
 * @param {function} reducer - Store reducer
 * @returns {store} - The newly created store
 */

function createStore(type, reducer) {
  if (_.has(__stores, type)) {
    throw "Cannot create store " + type + ". Only one instance of store is allowed";
  }

  var store = new Store(type, reducer);
  __stores[type] = store;
  logger.i("Store created:", type);
  return store;
}
/**
 * @function createAction
 * @Description Creates a new action for the application
 * @param {string} type - Type of action to create
 * @param {function} action - Action to execute
 * @returns {function} The newly created action
 */


function createAction(type, fn) {
  if (type == undefined) {
    throw new Error("Action type is undefined");
  }

  if (_.has(__actions, type)) {
    throw "Cannot create action " + type + ". Already created";
  }

  var act = __actions[type] = function (data) {
    if (DEBUG) {
      logger.i("Running action", type);
      logger.i(stringifyIfNotBrowser(data));
    }

    fn(data);
  };

  logger.i("Action created:", type);
  return act;
}
/**
 * @function dispatch
 * @description Dispatch action to stores, usually called by actions
 * @param {object} data - Data to pass to stores
 */


function dispatch(action) {
  if (DEBUG) {
    logger.i("Dispatching action", action.type);
    logger.i(stringifyIfNotBrowser(action));
  }

  _.each(__stores, function (store) {
    try {
      store.dispatch(action);
    } catch (e) {
      if (e && e.stack) {
        logger.e(e.stack);
      }

      logger.e(e);
    }
  });
}
/**
 * @function run
 * @description Run specified action. This is not the common method to call actions, but it's necessary for managing actions from
 * devices. On JS side, call actions directly
 * @param {type} type - Type of action to call
 * @param {data} type - Data to pass to action
 */


function _run(action, data) {
  if (_.has(__actions, action)) {
    __actions[action](data);
  } else {
    logger.w("Cannot find action: " + action);
  }
}
/**
 * @function exec
 * @description Exec a plugin method
 * @param {string} plugin - The plugin
 * @param {method} method - The plugin method to call
 * @param {data} data - Data to pass to plugin
 * @returns {Promise} - A promise of plugin call result
 */


function exec(plugin, fn, data) {
  return __runtime.exec(plugin, fn, data);
}

function createBuffer(data) {
  return __runtime.createBuffer(data);
}

function readBuffer(id) {
  return __runtime.readBuffer(id);
}

function destroyBuffer(id) {
  return __runtime.destroyBuffer(id);
}

},{"./events":10,"fs":380,"underscore":337,"vm":381}],13:[function(require,module,exports){
"use strict";

var _ = require("underscore");

exports.ext = function (path) {
  if (_.isEmpty(path)) {
    return "";
  }

  var index = path.lastIndexOf(".");

  if (index == -1) {
    return "";
  }

  return path.substring(index);
};

exports.removeExt = function (path) {
  if (_.isEmpty(path)) {
    return path;
  }

  var index = path.lastIndexOf(".");

  if (index == -1) {
    return path;
  }

  return path.substring(0, index);
};

},{"underscore":337}],14:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var assert = require("./assert");

var path = require("./path");

var base64 = require("./base64");

var StorageManager =
/*#__PURE__*/
function () {
  function StorageManager() {
    _classCallCheck(this, StorageManager);

    if (__storageManager == undefined) {
      throw "__storageManager undefined";
    }
  }
  /*
  Read text files and return a promise with the result as string
   */


  _createClass(StorageManager, [{
    key: "readText",
    value: function readText(path) {
      return new Promise(function (resolve, reject) {
        try {
          assert.assertNotEmpty(path, "path is not defined");
          logger.i("Reading text file", path);

          __storageManager.readText(path, function (error, value) {
            if (error) {
              logger.e(value);
              reject(value);
            } else {
              resolve(value);
            }
          });
        } catch (e) {
          logger.e(e);
          reject(e);
        }
      });
    }
    /*
     Read binary files and return a promise with the result as byte array (transfer with native using base64)
     */

  }, {
    key: "read",
    value: function read(path) {
      return new Promise(function (resolve, reject) {
        try {
          assert.assertNotEmpty(path, "path is not defined");
          logger.i("Reading binary file", path);

          __storageManager.read(path, function (error, value) {
            if (error) {
              logger.e(value);
              reject(value);
            } else {
              var bytes = base64.decode(value);
              resolve(bytes);
            }
          });
        } catch (e) {
          logger.e(e);
          reject(e);
        }
      });
    }
    /*
     Write text files and return a promise with the result of operation
     */

  }, {
    key: "writeText",
    value: function writeText(path, content) {
      return new Promise(function (resolve, reject) {
        try {
          assert.assertNotEmpty(path, "path is not defined");
          logger.i("Writing text file", path);

          __storageManager.writeText(path, content, function (error, value) {
            if (error) {
              logger.e(value);
              reject(value);
            } else {
              resolve(value);
            }
          });
        } catch (e) {
          logger.e(e);
          reject(e);
        }
      });
    }
    /*
     Write binary files and return a promise with the result of operation
     */

  }, {
    key: "write",
    value: function write(path, bytes) {
      return new Promise(function (resolve, reject) {
        try {
          assert.assertNotEmpty(path, "path is not defined");
          logger.i("Writing binary file", path);
          var content = base64.encode(bytes);

          __storageManager.write(path, content, function (error, value) {
            if (error) {
              logger.e(value);
              reject(value);
            } else {
              resolve(value);
            }
          });
        } catch (e) {
          logger.e(e);
          reject(e);
        }
      });
    }
    /*
     Delete a file and return a promise with the result of operation
     */

  }, {
    key: "delete",
    value: function _delete(path) {
      return new Promise(function (resolve, reject) {
        try {
          assert.assertNotEmpty(path, "path is not defined");
          logger.i("Deleting file", path);

          __storageManager["delete"](path, function (error, value) {
            if (error) {
              logger.e(value);
              reject(value);
            } else {
              resolve(value);
            }
          });
        } catch (e) {
          logger.e(e);
          reject(e);
        }
      });
    }
    /*
     Check file existence and return a promise with the result of operation
     */

  }, {
    key: "exists",
    value: function exists(path) {
      return new Promise(function (resolve, reject) {
        try {
          assert.assertNotEmpty(path, "path is not defined");
          logger.i("Checking file existence", path);

          __storageManager.exists(path, function (error, value) {
            if (error) {
              logger.e(value);
              reject(value);
            } else {
              resolve(value);
            }
          });
        } catch (e) {
          logger.e(e);
          reject(e);
        }
      });
    }
  }]);

  return StorageManager;
}();

var instance = new StorageManager();
/**
 * Reads text of file in specified path
 * @param path
 * @returns A promise with text result
 */

exports.readText = function (path) {
  return instance.readText(path);
};
/**
 * Reads binary file from specified path.
 * @param path
 * @returns A promise of result
 */


exports.read = function (path) {
  return instance.read(path);
};
/**
 * Writes text contents in specified file
 * @param path
 * @param content
 * @returns A promise of result
 */


exports.writeText = function (path, content) {
  return instance.writeText(path, content);
};
/**
 * Writes bytes contents in speified file
 * @param path
 * @param bytes
 * @returns A promise of result
 */


exports.write = function (path, bytes) {
  return instance.write(path, bytes);
};
/**
 * Deletes specified file from device storage
 * @param path
 * @returns A promise of result
 */


exports["delete"] = function (path) {
  return instance["delete"](path);
};
/**
 * Check if specified file exists in device storage
 * @param path
 * @returns A promise of result
 */


exports.exists = function (path) {
  return instance.exists(path);
};

},{"./assert":8,"./base64":9,"./path":13}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;
exports.recover = recover;
exports.confirm = confirm;
exports.getCoverImage = getCoverImage;
exports.getProfileImage = getProfileImage;
exports.changePassword = changePassword;
exports.resetUserPassword = resetUserPassword;
exports.requestRecoveryCode = requestRecoveryCode;
exports.validateRecoveryCode = validateRecoveryCode;
exports.resetPassword = resetPassword;

var config = _interopRequireWildcard(require("../framework/config"));

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function register(name, mail, password) {
  return (0, _utils.post)(config.get("account.register.url"), {
    name: name,
    mail: mail,
    password: password
  });
}

function recover(mail) {
  return (0, _utils.post)(config.get("account.recover.url"), {
    mail: mail
  });
}

function confirm(activationCode) {
  return (0, _utils.post)(config.get("account.confirm.url"), {
    activationCode: activationCode
  });
}

function getCoverImage(userId) {
  return (0, _utils.get)("".concat(config.get("account.url"), "/").concat(userId, "/cover"));
}

function getProfileImage(userId) {
  return (0, _utils.get)("".concat(config.get("account.url"), "/").concat(userId, "/profile/image"));
}

function changePassword(password, passwordConfirm) {
  return (0, _utils.post)(config.get("account.url") + "/changePassword", {
    password: password ? password : "",
    passwordConfirm: passwordConfirm ? passwordConfirm : ""
  });
}

function resetUserPassword(id) {
  return (0, _utils.post)(config.get("account.resetUserPassword.url"), {
    id: id
  });
}

function requestRecoveryCode(mail) {
  return (0, _utils.post)(config.get("account.requestRecoveryCode.url"), {
    mail: mail
  });
}

function validateRecoveryCode(mail, code) {
  return (0, _utils.post)(config.get("account.validateRecoveryCode.url"), {
    mail: mail,
    code: code
  });
}

function resetPassword(mail, code, password, passwordConfirm) {
  return (0, _utils.post)(config.get("account.resetPassword.url"), {
    mail: mail,
    code: code,
    password: password,
    passwordConfirm: passwordConfirm
  });
}

},{"../framework/config":26,"./utils":22}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.load = load;
exports.delete_ = delete_;
exports.save = save;
exports.get = get;
exports.checkRevisionEnableStatus = checkRevisionEnableStatus;

var config = _interopRequireWildcard(require("../framework/config"));

var utils = _interopRequireWildcard(require("./utils"));

var _underscore = _interopRequireDefault(require("underscore"));

var _lang = require("../utils/lang");

var http = _interopRequireWildcard(require("../aj/http"));

var responses = _interopRequireWildcard(require("./responses"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function find(entity, query) {
  return load(entity, query);
}

function load(entity, query) {
  var url = config.get("entities.url") + "/" + entity + "/find";
  return utils.postJson(url, query.cleaned());
}

function delete_(entity, ids) {
  if (!_underscore["default"].isArray(ids)) {
    throw new Error("ids is not an array");
  }

  var data = [];

  for (var i = 0; i < ids.length; i++) {
    data.push("".concat(ids[i]));
  }

  var url = config.get("entities.url") + "/" + entity + "/delete";
  return utils.post(url, {
    ids: data.join()
  });
}

function save(entity, data) {
  var url = config.get("entities.url") + "/" + entity;
  return new Promise(function (resolve, reject) {
    var json = typeof data === "string" ? data : JSON.stringify(data);
    var headers = {
      "Content-Type": "application/json"
    };
    http.post(url, json, (0, utils.addToken)(headers)).then(function (json) {
      if (_underscore["default"].isEmpty(json)) {
        reject(responses.ERROR);
      } else {
        var response = JSON.parse(json);

        if (responses.OK != response.responseCode) {
          reject(response);
        } else {
          resolve(response);
        }
      }
    })["catch"](function (e) {
      logger.e("Error in request:", e);
      reject(responses.ERROR);
    });
  });
}

function get(entity, id, params) {
  var url = config.get("entities.url") + "/" + entity + "/" + id;
  return utils.get(url, params);
}

function checkRevisionEnableStatus(entity) {
  var url = config.get("revision.url") + "/checkStatus/" + entity;
  return utils.get(url);
}

},{"../aj/http":11,"../framework/config":26,"../utils/lang":350,"./responses":19,"./utils":22,"underscore":337}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGrid = getGrid;

var config = _interopRequireWildcard(require("../framework/config"));

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function getGrid(id) {
  var url = config.get("grids.url") + "/" + id;
  return (0, _utils.get)(url);
}

},{"../framework/config":26,"./utils":22}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.Query = exports.RANGE = exports.AND = exports.OR = exports.ID = exports.NIN = exports.IN = exports.EQ = exports.LTE = exports.LT = exports.GTE = exports.NE = exports.GT = exports.LIKE = void 0;

var _underscore = _interopRequireDefault(require("underscore"));

var _events = require("../aj/events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LIKE = "like";
exports.LIKE = LIKE;
var GT = "gt";
exports.GT = GT;
var NE = "ne";
exports.NE = NE;
var GTE = "gte";
exports.GTE = GTE;
var LT = "lt";
exports.LT = LT;
var LTE = "lte";
exports.LTE = LTE;
var EQ = "eq";
exports.EQ = EQ;
var IN = "in";
exports.IN = IN;
var NIN = "nin";
exports.NIN = NIN;
var ID = "id";
exports.ID = ID;
var OR = "or";
exports.OR = OR;
var AND = "and";
exports.AND = AND;
var RANGE = "range";
exports.RANGE = RANGE;

var Query =
/*#__PURE__*/
function (_Observable) {
  _inherits(Query, _Observable);

  function Query(init) {
    var _this;

    _classCallCheck(this, Query);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Query).call(this));
    _this.page = 0;
    _this.rowsPerPage = 0;
    _this.sorts = [];
    _this.filters = [];
    _this.keyword = null;
    _this.invokationEnabled = true;

    _underscore["default"].assign(_assertThisInitialized(_this), init);

    return _this;
  }

  _createClass(Query, [{
    key: "live",
    value: function live() {
      this.invokationEnabled = true;
    }
  }, {
    key: "die",
    value: function die() {
      this.invokationEnabled = false;
    }
  }, {
    key: "filter",
    value: function filter(type, property, value) {
      if ((value === null || value === undefined) && _underscore["default"].any(this.filters, function (f) {
        return f.property === property;
      })) {
        this.unfilter(property);
        return this;
      }

      var current = _underscore["default"].find(this.filters, function (s) {
        return s.property == property;
      });

      if (current) {
        current.value = value;
        current.type = type;
      } else {
        this.filters.push({
          property: property,
          type: type,
          value: value
        });
      }

      this.invokeChange();
      return this;
    }
  }, {
    key: "unfilter",
    value: function unfilter(property) {
      this.filters = _underscore["default"].filter(this.filters, function (f) {
        return f.property != property;
      });
      this.invokeChange();
      return this;
    }
  }, {
    key: "like",
    value: function like(prop, value) {
      this.filter(LIKE, prop, value);
      return this;
    }
  }, {
    key: "gt",
    value: function gt(prop, value) {
      this.filter(GT, prop, value);
      return this;
    }
  }, {
    key: "ne",
    value: function ne(prop, value) {
      this.filter(NE, prop, value);
      return this;
    }
  }, {
    key: "gte",
    value: function gte(prop, value) {
      this.filter(GTE, prop, value);
      return this;
    }
  }, {
    key: "lt",
    value: function lt(prop, value) {
      this.filter(LT, prop, value);
      return this;
    }
  }, {
    key: "lte",
    value: function lte(prop, value) {
      this.filter(LTE, prop, value);
      return this;
    }
  }, {
    key: "eq",
    value: function eq(prop, value) {
      this.filter(EQ, prop, value);
      return this;
    }
  }, {
    key: "in",
    value: function _in(prop, value) {
      this.filter(IN, prop, value);
      return this;
    }
  }, {
    key: "nin",
    value: function nin(prop, value) {
      this.filter(NE, prop, value);
      return this;
    }
  }, {
    key: "id",
    value: function id(prop, value) {
      this.filter(ID, prop, value);
      return this;
    }
  }, {
    key: "or",
    value: function or(prop, value) {
      this.filter(OR, prop, value);
      return this;
    }
  }, {
    key: "and",
    value: function and(prop, value) {
      this.filter(AND, prop, value);
      return this;
    }
  }, {
    key: "range",
    value: function range(prop, value) {
      this.filter(RANGE, prop, value);
      return this;
    }
  }, {
    key: "gt",
    value: function gt(prop, value) {
      this.filter(GT, prop, value);
      return this;
    }
  }, {
    key: "ne",
    value: function ne(prop, value) {
      this.filter(NE, prop, value);
      return this;
    }
  }, {
    key: "sort",
    value: function sort(prop, descending) {
      var current = _underscore["default"].find(this.sorts, function (s) {
        return s.property == prop;
      });

      if (current) {
        current.descending = descending;
      } else {
        this.sorts.push({
          property: prop,
          descending: descending
        });
      }

      this.invokeChange();
      return this;
    }
  }, {
    key: "unsort",
    value: function unsort(prop) {
      this.sorts = _underscore["default"].filter(this.sorts, function (s) {
        return s.property != prop;
      });
      this.invokeChange();
      return this;
    }
  }, {
    key: "clearFilters",
    value: function clearFilters() {
      this.filters = [];
      this.invokeChange();
      return this;
    }
  }, {
    key: "setPage",
    value: function setPage(page) {
      this.page = page;
      this.invokeChange();
      return this;
    }
  }, {
    key: "setRowsPerPage",
    value: function setRowsPerPage(rowsPerPage) {
      this.rowsPerPage = rowsPerPage;
      this.invokeChange();
      return this;
    }
  }, {
    key: "setKeyword",
    value: function setKeyword(newValue) {
      this.keyword = newValue;
      this.invokeChange();
      return this;
    }
  }, {
    key: "invokeChange",
    value: function invokeChange() {
      if (this.invokationEnabled) {
        this.invoke("change");
      }
    }
  }, {
    key: "cleaned",
    value: function cleaned() {
      return {
        page: this.page,
        rowsPerPage: this.rowsPerPage,
        sorts: this.sorts,
        filters: this.filters,
        keyword: this.keyword
      };
    }
  }]);

  return Query;
}(_events.Observable);

exports.Query = Query;

function create(init) {
  var query = new Query(init);
  return query;
}

},{"../aj/events":10,"underscore":337}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.msg = msg;
exports.value = value;
exports.ERROR_DOCUMENT_NOT_FOUND = exports.ERROR_WAREHOUSE_NOT_FOUND = exports.ERROR_CUSTOMER_NOT_FOUND = exports.ERROR_COVER_COMPONENT_NOT_CONFIGURED = exports.ERROR_COVER_COMPONENT_ALREADY_EXISTS = exports.ERROR_USER_COMPANY_NOT_SETTED = exports.ERROR_INVALID_DEFAULT_ARTICLE = exports.ERROR_ARTICLE_NOT_FOUND = exports.ERROR_INVALID_DATA = exports.ERROR_IO = exports.ERROR_ROLE_NOT_FOUND = exports.ERROR_CONNECTOR = exports.ERROR_CONSTRAINT_VIOLATION = exports.ERROR_USER_NOT_FOUND = exports.ERROR_NOT_FOUND = exports.ERROR_VALIDATION = exports.ERROR_PASSWORD_NOT_VALID = exports.ERROR_MAIL_NOT_VALID = exports.ERROR_TOKEN_FORMAT = exports.ERROR_TOKEN_GENERATION = exports.ERROR_BAD_CREDENTIALS = exports.ERROR_MAIL_NOT_FOUND = exports.ERROR_MAIL_ALREADY_EXISTS = exports.UNAUTHORIZED = exports.ERROR = exports.OK = void 0;

var _strings = require("../strings");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var OK = 0;
exports.OK = OK;
var ERROR = 1;
exports.ERROR = ERROR;
var UNAUTHORIZED = 2;
exports.UNAUTHORIZED = UNAUTHORIZED;
var ERROR_MAIL_ALREADY_EXISTS = 1001;
exports.ERROR_MAIL_ALREADY_EXISTS = ERROR_MAIL_ALREADY_EXISTS;
var ERROR_MAIL_NOT_FOUND = 1002;
exports.ERROR_MAIL_NOT_FOUND = ERROR_MAIL_NOT_FOUND;
var ERROR_BAD_CREDENTIALS = 1003;
exports.ERROR_BAD_CREDENTIALS = ERROR_BAD_CREDENTIALS;
var ERROR_TOKEN_GENERATION = 1004;
exports.ERROR_TOKEN_GENERATION = ERROR_TOKEN_GENERATION;
var ERROR_TOKEN_FORMAT = 1005;
exports.ERROR_TOKEN_FORMAT = ERROR_TOKEN_FORMAT;
var ERROR_MAIL_NOT_VALID = 1006;
exports.ERROR_MAIL_NOT_VALID = ERROR_MAIL_NOT_VALID;
var ERROR_PASSWORD_NOT_VALID = 1007;
exports.ERROR_PASSWORD_NOT_VALID = ERROR_PASSWORD_NOT_VALID;
var ERROR_VALIDATION = 1008;
exports.ERROR_VALIDATION = ERROR_VALIDATION;
var ERROR_NOT_FOUND = 1009;
exports.ERROR_NOT_FOUND = ERROR_NOT_FOUND;
var ERROR_USER_NOT_FOUND = 1010;
exports.ERROR_USER_NOT_FOUND = ERROR_USER_NOT_FOUND;
var ERROR_CONSTRAINT_VIOLATION = 1011;
exports.ERROR_CONSTRAINT_VIOLATION = ERROR_CONSTRAINT_VIOLATION;
var ERROR_CONNECTOR = 1012;
exports.ERROR_CONNECTOR = ERROR_CONNECTOR;
var ERROR_ROLE_NOT_FOUND = 1013;
exports.ERROR_ROLE_NOT_FOUND = ERROR_ROLE_NOT_FOUND;
var ERROR_IO = 1014;
exports.ERROR_IO = ERROR_IO;
var ERROR_INVALID_DATA = 1015;
exports.ERROR_INVALID_DATA = ERROR_INVALID_DATA;
var ERROR_ARTICLE_NOT_FOUND = 2001;
exports.ERROR_ARTICLE_NOT_FOUND = ERROR_ARTICLE_NOT_FOUND;
var ERROR_INVALID_DEFAULT_ARTICLE = 2002;
exports.ERROR_INVALID_DEFAULT_ARTICLE = ERROR_INVALID_DEFAULT_ARTICLE;
var ERROR_USER_COMPANY_NOT_SETTED = 2003;
exports.ERROR_USER_COMPANY_NOT_SETTED = ERROR_USER_COMPANY_NOT_SETTED;
var ERROR_COVER_COMPONENT_ALREADY_EXISTS = 2004;
exports.ERROR_COVER_COMPONENT_ALREADY_EXISTS = ERROR_COVER_COMPONENT_ALREADY_EXISTS;
var ERROR_COVER_COMPONENT_NOT_CONFIGURED = 2005;
exports.ERROR_COVER_COMPONENT_NOT_CONFIGURED = ERROR_COVER_COMPONENT_NOT_CONFIGURED;
var ERROR_CUSTOMER_NOT_FOUND = 3001;
exports.ERROR_CUSTOMER_NOT_FOUND = ERROR_CUSTOMER_NOT_FOUND;
var ERROR_WAREHOUSE_NOT_FOUND = 4001;
exports.ERROR_WAREHOUSE_NOT_FOUND = ERROR_WAREHOUSE_NOT_FOUND;
var ERROR_DOCUMENT_NOT_FOUND = 5001;
exports.ERROR_DOCUMENT_NOT_FOUND = ERROR_DOCUMENT_NOT_FOUND;
var messages = {
  en: {},
  it: {}
};
messages["en"][OK] = "OK";
messages["en"][ERROR] = "Generic error";
messages["en"][ERROR_MAIL_ALREADY_EXISTS] = "Cannot register: mail already exists";
messages["en"][ERROR_MAIL_NOT_FOUND] = "Mail not found";
messages["en"][ERROR_BAD_CREDENTIALS] = "Cannot login: bad username or password";
messages["en"][ERROR_TOKEN_GENERATION] = "Error generating token";
messages["en"][ERROR_TOKEN_FORMAT] = "Bat token format";
messages["en"][ERROR_MAIL_NOT_VALID] = "Invalid email";
messages["en"][ERROR_PASSWORD_NOT_VALID] = "Password not valid";
messages["en"][ERROR_VALIDATION] = "Validation error. Please control inserted data and retry";
messages["en"][ERROR_NOT_FOUND] = "Not found";
messages["en"][ERROR_USER_NOT_FOUND] = "User not found";
messages["en"][ERROR_CONSTRAINT_VIOLATION] = "Constraint violation";
messages["en"][ERROR_CONNECTOR] = "There is a problem retrieving data from Gamma";
messages["en"][ERROR_ROLE_NOT_FOUND] = "Role not found";
messages["en"][ERROR_IO] = "IO error";
messages["en"][ERROR_INVALID_DATA] = "Invalid data";
messages["en"][ERROR_ARTICLE_NOT_FOUND] = "Article not found";
messages["en"][ERROR_INVALID_DEFAULT_ARTICLE] = "Invalid default article";
messages["en"][ERROR_USER_COMPANY_NOT_SETTED] = "User company not setted";
messages["en"][ERROR_COVER_COMPONENT_ALREADY_EXISTS] = "Cover component already exists";
messages["en"][ERROR_COVER_COMPONENT_NOT_CONFIGURED] = "Cover component not configured";
messages["en"][ERROR_CUSTOMER_NOT_FOUND] = "Customer not found";
messages["en"][ERROR_WAREHOUSE_NOT_FOUND] = "Warehouse not found";
messages["en"][ERROR_DOCUMENT_NOT_FOUND] = "Document not found";
messages["it"][OK] = "OK";
messages["it"][ERROR] = "Si è verificato un errore";
messages["it"][ERROR_MAIL_ALREADY_EXISTS] = "Impossibile registrarsi: indirizzo email già presente";
messages["it"][ERROR_MAIL_NOT_FOUND] = "Mail non trovata";
messages["it"][ERROR_BAD_CREDENTIALS] = "Impossibile accedere: email o password errati";
messages["it"][ERROR_TOKEN_GENERATION] = "Errore durante la generazione del token";
messages["it"][ERROR_TOKEN_FORMAT] = "Formato del token non valido";
messages["it"][ERROR_MAIL_NOT_VALID] = "Email non valida";
messages["it"][ERROR_PASSWORD_NOT_VALID] = "Password non valida";
messages["it"][ERROR_VALIDATION] = "Errore di validazione: ricontrollare i dati inseriti e riprovare";
messages["it"][ERROR_NOT_FOUND] = "Non trovato";
messages["it"][ERROR_USER_NOT_FOUND] = "Utente non trovato";
messages["it"][ERROR_CONSTRAINT_VIOLATION] = "Impossibile proseguire. Esistono entità collegate che dipendono da questa entità";
messages["it"][ERROR_CONNECTOR] = "Problema durante la comunicazione con Gamma";
messages["it"][ERROR_ROLE_NOT_FOUND] = "Ruolo non trovato";
messages["it"][ERROR_IO] = "IO error";
messages["it"][ERROR_INVALID_DATA] = "Dati non validi";
messages["it"][ERROR_ARTICLE_NOT_FOUND] = "Articolo non trovato";
messages["it"][ERROR_INVALID_DEFAULT_ARTICLE] = "Articolo predefinito non trovato";
messages["it"][ERROR_USER_COMPANY_NOT_SETTED] = "Azienda non configurata per l'utente corrente";
messages["it"][ERROR_COVER_COMPONENT_ALREADY_EXISTS] = "Componente di tipo rivestimento già presente";
messages["it"][ERROR_COVER_COMPONENT_NOT_CONFIGURED] = "Componente di tipo rivestimento non trovato";
messages["it"][ERROR_CUSTOMER_NOT_FOUND] = "Cliente non trovato";
messages["it"][ERROR_WAREHOUSE_NOT_FOUND] = "Magazzino non trovato";
messages["it"][ERROR_DOCUMENT_NOT_FOUND] = "Documento non trovato";

function msg(response) {
  var responseCode = null;

  if (_typeof(response) === "object") {
    if (response.message) return response.message;
    responseCode = response.responseCode;
  } else {
    responseCode = response;
  }

  if (_.has(messages[(0, _strings.getLanguage)()], responseCode)) {
    return messages[(0, _strings.getLanguage)()][responseCode];
  }

  return "Errore n. " + responseCode;
}
/**
 * Returns value of value responses. If o is a promise, a wrapped promise thar returns value will be returned
 */


function value(o) {
  if (o instanceof Promise) {
    return new Promise(function (resolve, reject) {
      o.then(function (result) {
        resolve(result.value);
      })["catch"](function (e) {
        return reject(e);
      });
    });
  } else {
    if (_.isObject(o)) {
      return o.value;
    }
  }

  logger.w(o, "is not a value response");
  return null;
}

},{"../strings":347}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = login;
exports.start = start;
exports.resume = resume;
exports.destroy = destroy;
exports.getLoggedUser = getLoggedUser;
exports.isLoggedIn = isLoggedIn;
exports.getSessionToken = getSessionToken;
exports.updateLoggedUser = updateLoggedUser;
exports.updateUserPassword = updateUserPassword;
exports.updateSessionToken = updateSessionToken;
exports.isSuperuser = isSuperuser;
exports.hasPermission = hasPermission;
exports.Permission = exports.TYPE_FACEBOOK = exports.TYPE_MAIL = void 0;

var http = _interopRequireWildcard(require("../aj/http"));

var preferences = _interopRequireWildcard(require("../framework/preferences"));

var config = _interopRequireWildcard(require("../framework/config"));

var _underscore = _interopRequireDefault(require("underscore"));

var responses = _interopRequireWildcard(require("./responses"));

var _lang = require("../utils/lang");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var _loggedUser;

var _sessionToken;

var TYPE_MAIL = "MAIL";
exports.TYPE_MAIL = TYPE_MAIL;
var TYPE_FACEBOOK = "FACEBOOK";
exports.TYPE_FACEBOOK = TYPE_FACEBOOK;
var STOP_OBJ = {};

function stop() {
  return STOP_OBJ;
}

function wrap(r, fn) {
  if (r == STOP_OBJ) {
    return STOP_OBJ;
  } else {
    return fn(r);
  }
}

function login(mail, password) {
  return new Promise(function (resolve, reject) {
    http.post(config.get("login.url"), {
      mail: mail,
      password: password
    }).then(function (json) {
      if (_underscore["default"].isEmpty(json)) {
        reject(responses.ERROR);
      } else {
        var response = JSON.parse(json);

        if (responses.OK != response.responseCode) {
          reject(response.responseCode);
        } else {
          resolve(response);
        }
      }
    })["catch"](function (e) {
      logger.e("Error logging in:", e);
      reject(responses.ERROR);
    });
  });
}

function start(mail, password) {
  return new Promise(function (resolve, reject) {
    _loggedUser = null;
    _sessionToken = null;
    var data = {};
    preferences.load().then(function () {
      return login(mail, password);
    }).then(function (response) {
      preferences.set("session.type", TYPE_MAIL);
      preferences.set("session.mail", mail);
      preferences.set("session.password", password);
      _sessionToken = response.token;
      console.log(_sessionToken);
      _loggedUser = response.user;
      return preferences.save();
    }).then(function (r) {
      resolve(_loggedUser);
    })["catch"](function (e) {
      _loggedUser = null;
      _sessionToken = null;
      preferences.load().then(function () {
        preferences.set("session.type", null);
        preferences.set("session.mail", null);
        preferences.set("session.password", null);
        return preferences.save();
      })["catch"](function (e) {
        logger.e(e);
      });
      reject(e);
    });
  });
}

function resume() {
  return new Promise(function (resolve, reject) {
    _loggedUser = null;
    _sessionToken = null;
    preferences.load().then(function () {
      var type = preferences.get("session.type");
      var mail = preferences.get("session.mail");
      var password = preferences.get("session.password");

      if (type == TYPE_MAIL && mail && password) {
        return start(mail, password);
      } else {
        reject(responses.ERROR);
        return stop();
      }
    }).then(function (r) {
      return wrap(r, function () {
        resolve(r);
      });
    })["catch"](function (e) {
      reject(e);
    });
  });
}

function destroy() {
  _loggedUser = null;
  _sessionToken = null;
  return preferences.load().then(function () {
    preferences.set("session.type", null);
    preferences.set("session.mail", null);
    preferences.set("session.password", null);
    return preferences.save();
  })["catch"](function (e) {
    logger.e(e);
  });
}

function getLoggedUser() {
  return _loggedUser;
}

function isLoggedIn() {
  return _loggedUser != null;
}

function getSessionToken() {
  return _sessionToken;
}

function updateLoggedUser(user) {
  _loggedUser = user;
}

function updateUserPassword(password) {
  preferences.set("session.password", password);
  preferences.save();
}

function updateSessionToken(token) {
  _sessionToken = token;
}
/**
 * Check if user has permissions
 * @param permissions --> array string ex: [document:list, document:new]
 */


function isSuperuser() {
  return _underscore["default"].any((0, _lang.safeGet)(getLoggedUser(), "roles"), function (r) {
    return _underscore["default"].any(r.permissions, function (p) {
      return p === "admin:superuser";
    });
  });
}

function hasPermission(permissions) {
  if (_underscore["default"].isEmpty(permissions) || isSuperuser()) return true;
  return _underscore["default"].any((0, _lang.safeGet)(getLoggedUser(), "roles"), function (r) {
    return _underscore["default"].intersection(r.permissions, permissions).length > 0;
  });
}

var Permission = {
  LIST: "list",
  NEW: "new",
  EDIT: "edit",
  DELETE: "delete",
  SAVE: "save"
};
exports.Permission = Permission;

},{"../aj/http":11,"../framework/config":26,"../framework/preferences":27,"../utils/lang":350,"./responses":19,"underscore":337}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSystemInfos = getSystemInfos;

var config = _interopRequireWildcard(require("../framework/config"));

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function getSystemInfos() {
  return (0, _utils.get)(config.get("system.url") + "/version");
}

},{"../framework/config":26,"./utils":22}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToken = addToken;
exports.post = post;
exports.postJson = postJson;
exports.get = get;
exports.delete_ = delete_;

var http = _interopRequireWildcard(require("../aj/http"));

var responses = _interopRequireWildcard(require("./responses"));

var _session = require("./session");

var _underscore = _interopRequireDefault(require("underscore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function addToken(headers) {
  if (!_underscore["default"].isEmpty((0, _session.getSessionToken)())) {
    return _underscore["default"].assign(headers || {}, {
      "x-auth-token": (0, _session.getSessionToken)()
    });
  } else {
    return headers;
  }
}

function post(url, data) {
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Promise(function (resolve, reject) {
    http.post(url, data, addToken(headers)).then(function (json) {
      if (_underscore["default"].isEmpty(json)) {
        reject(responses.ERROR);
      } else {
        var response = JSON.parse(json);

        if (responses.OK != response.responseCode) {
          reject(response);
        } else {
          resolve(response);
        }
      }
    })["catch"](function (e) {
      logger.e("Error in request:", e);
      reject(responses.ERROR);
    });
  });
}

function postJson(url, data) {
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Promise(function (resolve, reject) {
    var json = typeof data == "string" ? data : JSON.stringify(data);
    headers = _underscore["default"].assign(headers, {
      "Content-Type": "application/json"
    });
    http.post(url, json, addToken(headers)).then(function (json) {
      if (_underscore["default"].isEmpty(json)) {
        reject(responses.ERROR);
      } else {
        var response = JSON.parse(json);

        if (responses.OK != response.responseCode) {
          reject(response);
        } else {
          resolve(response);
        }
      }
    })["catch"](function (e) {
      logger.e("Error in request:", e);
      reject(responses.ERROR);
    });
  });
}

function get(url, data) {
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Promise(function (resolve, reject) {
    http.get(url, data, addToken(headers)).then(function (json) {
      if (_underscore["default"].isEmpty(json)) {
        reject(responses.ERROR);
      } else {
        var response = JSON.parse(json);

        if (responses.OK != response.responseCode) {
          reject(response);
        } else {
          resolve(response);
        }
      }
    })["catch"](function (e) {
      logger.e("Error in request:", e);
      reject(responses.ERROR);
    });
  });
}

function delete_(url, data, headers) {
  return new Promise(function (resolve, reject) {
    http["delete"](url, data, addToken(headers)).then(function (json) {
      if (_underscore["default"].isEmpty(json)) {
        reject(responses.ERROR);
      } else {
        var response = JSON.parse(json);

        if (responses.OK != response.responseCode) {
          reject(response);
        } else {
          resolve(response);
        }
      }
    })["catch"](function (e) {
      logger.e("Error in request:", e);
      reject(responses.ERROR);
    });
  });
}

},{"../aj/http":11,"./responses":19,"./session":20,"underscore":337}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadEntities = loadEntities;
exports.load = load;

var _underscore = _interopRequireDefault(require("underscore"));

var _lang = require("../utils/lang");

var query = _interopRequireWildcard(require("../api/query"));

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var aj = require("../aj");

var http = require("../aj/http");

var preferences = require("../framework/preferences");

var config = require("../framework/config");

function loadEntities(entity, _query) {
  if (_underscore["default"].isEmpty(_query)) {
    _query = query.create();
  }

  var url = config.get("values.entities.url") + "/" + entity;
  return (0, _utils.get)(url, (0, _lang.flatten)(_query.cleaned()));
}

function load(collection, keyword) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var url = config.get("values.url") + "/" + collection;

  if (!_underscore["default"].isEmpty(keyword)) {
    url += "?keyword=" + keyword;
  }

  var separator = "&";

  if (url.indexOf("?") == -1) {
    separator = "?";
  }

  var paramsString = "";

  _underscore["default"].each(_underscore["default"].allKeys(params), function (k) {
    paramsString += k + "=" + encodeURIComponent(params[k]) + "&";
  });

  if (!_underscore["default"].isEmpty(paramsString)) {
    url += separator + paramsString;
  }

  return (0, _utils.get)(url);
}

},{"../aj":12,"../aj/http":11,"../api/query":18,"../framework/config":26,"../framework/preferences":27,"../utils/lang":350,"./utils":22,"underscore":337}],24:[function(require,module,exports){
(function (global){
"use strict";

require("@babel/polyfill");

var _aj = require("./aj");

require("./stores/session");

require("./stores/account");

require("./stores/entities");

require("./stores/menu");

require("./stores/ui");

require("./actions/session");

require("./actions/entities");

require("./actions/menu");

require("./actions/ui");

global.main = function () {
  var runtime = (0, _aj.createRuntime)();

  if (platform.device == "browser") {
    var main = require("./web/main");

    main["default"]();
  }

  return runtime;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./actions/entities":2,"./actions/menu":3,"./actions/session":4,"./actions/ui":7,"./aj":12,"./stores/account":339,"./stores/entities":340,"./stores/menu":341,"./stores/session":343,"./stores/ui":346,"./web/main":359,"@babel/polyfill":30}],25:[function(require,module,exports){
"use strict";

var serviceBase = "http://localhost:8080/";

function getVersion() {
  return "1.0";
}

function getCopyright() {
  return "Applica SRL, 2019";
}

module.exports = {
  "service.url": "".concat(serviceBase),
  "fs.url": "".concat(serviceBase, "fs"),
  "login.url": "".concat(serviceBase, "auth/login"),
  "account.url": "".concat(serviceBase, "account"),
  "account.register.url": "".concat(serviceBase, "account/register"),
  "account.recover.url": "".concat(serviceBase, "account/recover"),
  "account.reset.url": "".concat(serviceBase, "account/reset"),
  "account.confirm.url": "".concat(serviceBase, "account/confirm"),
  "grids.url": "".concat(serviceBase, "grids"),
  "entities.url": "".concat(serviceBase, "entities"),
  "entities.delete.url": "".concat(serviceBase, "entities/delete"),
  "values.url": "".concat(serviceBase, "values"),
  "values.entities.url": "".concat(serviceBase, "values/entities"),
  "account.requestRecoveryCode.url": "".concat(serviceBase, "account/sendConfirmationCode"),
  "account.validateRecoveryCode.url": "".concat(serviceBase, "account/validateRecoveryCode"),
  "account.resetPassword.url": "".concat(serviceBase, "account/resetUserPassword"),
  "account.resetUserPassword.url": "".concat(serviceBase, "account/resetPassword"),
  "system.url": "".concat(serviceBase, "system"),
  "backendVersion": getVersion(),
  "copyrightInfos": getCopyright()
};

},{}],26:[function(require,module,exports){
"use strict";

var config = require("../config");

var _ = require("underscore");

exports.get = function (key) {
  if (_.has(config, key)) {
    return config[key];
  } else {
    throw "Config not found: " + key;
  }
};

},{"../config":25,"underscore":337}],27:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var storage = require("../aj/storage");

var Preferences =
/*#__PURE__*/
function () {
  _createClass(Preferences, null, [{
    key: "instance",
    value: function instance() {
      if (!Preferences._instance) {
        Preferences._instance = new Preferences();
      }

      return Preferences._instance;
    }
  }]);

  function Preferences() {
    _classCallCheck(this, Preferences);

    this.path = "preferences.json";
    this.data = {};
  }

  _createClass(Preferences, [{
    key: "load",
    value: function load() {
      var _this = this;

      logger.i("Loading preferences...");
      this.data = {};
      return new Promise(function (resolve, reject) {
        storage.exists(_this.path).then(function (exists) {
          if (exists) {
            return storage.readText(_this.path).then(function (content) {
              logger.i("Preferences:", content);

              try {
                _this.data = JSON.parse(content);
              } catch (e) {}

              resolve(_this);
            });
          } else {
            resolve(_this);
          }
        })["catch"](function (e) {
          return reject(e);
        });
      });
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.data[key];
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this.data[key] = value;
    }
  }, {
    key: "save",
    value: function save() {
      var _this2 = this;

      logger.i("Saving preferences", JSON.stringify(this.data));
      return new Promise(function (resolve, reject) {
        storage.writeText(_this2.path, JSON.stringify(_this2.data)).then(function () {
          resolve();
        })["catch"](function (e) {
          return reject(e);
        });
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      this.data = {};
    }
  }]);

  return Preferences;
}();

exports.Preferences = Preferences;

exports.load = function () {
  return Preferences.instance().load();
};

exports.get = function (key) {
  return Preferences.instance().get(key);
};

exports.set = function (key, value) {
  return Preferences.instance().set(key, value);
};

exports.save = function () {
  return Preferences.instance().save();
};

exports.clear = function () {
  return Preferences.instance().clear();
};

},{"../aj/storage":14}],28:[function(require,module,exports){
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 * Copyright (c) 2010 Chris O'Hara <cohara87@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function (exports) {
  var entities = {
    '&nbsp;': "\xA0",
    '&iexcl;': "\xA1",
    '&cent;': "\xA2",
    '&pound;': "\xA3",
    '&curren;': "\u20AC",
    '&yen;': "\xA5",
    '&brvbar;': "\u0160",
    '&sect;': "\xA7",
    '&uml;': "\u0161",
    '&copy;': "\xA9",
    '&ordf;': "\xAA",
    '&laquo;': "\xAB",
    '&not;': "\xAC",
    '&shy;': "\xAD",
    '&reg;': "\xAE",
    '&macr;': "\xAF",
    '&deg;': "\xB0",
    '&plusmn;': "\xB1",
    '&sup2;': "\xB2",
    '&sup3;': "\xB3",
    '&acute;': "\u017D",
    '&micro;': "\xB5",
    '&para;': "\xB6",
    '&middot;': "\xB7",
    '&cedil;': "\u017E",
    '&sup1;': "\xB9",
    '&ordm;': "\xBA",
    '&raquo;': "\xBB",
    '&frac14;': "\u0152",
    '&frac12;': "\u0153",
    '&frac34;': "\u0178",
    '&iquest;': "\xBF",
    '&Agrave;': "\xC0",
    '&Aacute;': "\xC1",
    '&Acirc;': "\xC2",
    '&Atilde;': "\xC3",
    '&Auml;': "\xC4",
    '&Aring;': "\xC5",
    '&AElig;': "\xC6",
    '&Ccedil;': "\xC7",
    '&Egrave;': "\xC8",
    '&Eacute;': "\xC9",
    '&Ecirc;': "\xCA",
    '&Euml;': "\xCB",
    '&Igrave;': "\xCC",
    '&Iacute;': "\xCD",
    '&Icirc;': "\xCE",
    '&Iuml;': "\xCF",
    '&ETH;': "\xD0",
    '&Ntilde;': "\xD1",
    '&Ograve;': "\xD2",
    '&Oacute;': "\xD3",
    '&Ocirc;': "\xD4",
    '&Otilde;': "\xD5",
    '&Ouml;': "\xD6",
    '&times;': "\xD7",
    '&Oslash;': "\xD8",
    '&Ugrave;': "\xD9",
    '&Uacute;': "\xDA",
    '&Ucirc;': "\xDB",
    '&Uuml;': "\xDC",
    '&Yacute;': "\xDD",
    '&THORN;': "\xDE",
    '&szlig;': "\xDF",
    '&agrave;': "\xE0",
    '&aacute;': "\xE1",
    '&acirc;': "\xE2",
    '&atilde;': "\xE3",
    '&auml;': "\xE4",
    '&aring;': "\xE5",
    '&aelig;': "\xE6",
    '&ccedil;': "\xE7",
    '&egrave;': "\xE8",
    '&eacute;': "\xE9",
    '&ecirc;': "\xEA",
    '&euml;': "\xEB",
    '&igrave;': "\xEC",
    '&iacute;': "\xED",
    '&icirc;': "\xEE",
    '&iuml;': "\xEF",
    '&eth;': "\xF0",
    '&ntilde;': "\xF1",
    '&ograve;': "\xF2",
    '&oacute;': "\xF3",
    '&ocirc;': "\xF4",
    '&otilde;': "\xF5",
    '&ouml;': "\xF6",
    '&divide;': "\xF7",
    '&oslash;': "\xF8",
    '&ugrave;': "\xF9",
    '&uacute;': "\xFA",
    '&ucirc;': "\xFB",
    '&uuml;': "\xFC",
    '&yacute;': "\xFD",
    '&thorn;': "\xFE",
    '&yuml;': "\xFF",
    '&quot;': "\"",
    '&lt;': "<",
    '&gt;': ">",
    '&apos;': "'",
    '&minus;': "\u2212",
    '&circ;': "\u02C6",
    '&tilde;': "\u02DC",
    '&Scaron;': "\u0160",
    '&lsaquo;': "\u2039",
    '&OElig;': "\u0152",
    '&lsquo;': "\u2018",
    '&rsquo;': "\u2019",
    '&ldquo;': "\u201C",
    '&rdquo;': "\u201D",
    '&bull;': "\u2022",
    '&ndash;': "\u2013",
    '&mdash;': "\u2014",
    '&trade;': "\u2122",
    '&scaron;': "\u0161",
    '&rsaquo;': "\u203A",
    '&oelig;': "\u0153",
    '&Yuml;': "\u0178",
    '&fnof;': "\u0192",
    '&Alpha;': "\u0391",
    '&Beta;': "\u0392",
    '&Gamma;': "\u0393",
    '&Delta;': "\u0394",
    '&Epsilon;': "\u0395",
    '&Zeta;': "\u0396",
    '&Eta;': "\u0397",
    '&Theta;': "\u0398",
    '&Iota;': "\u0399",
    '&Kappa;': "\u039A",
    '&Lambda;': "\u039B",
    '&Mu;': "\u039C",
    '&Nu;': "\u039D",
    '&Xi;': "\u039E",
    '&Omicron;': "\u039F",
    '&Pi;': "\u03A0",
    '&Rho;': "\u03A1",
    '&Sigma;': "\u03A3",
    '&Tau;': "\u03A4",
    '&Upsilon;': "\u03A5",
    '&Phi;': "\u03A6",
    '&Chi;': "\u03A7",
    '&Psi;': "\u03A8",
    '&Omega;': "\u03A9",
    '&alpha;': "\u03B1",
    '&beta;': "\u03B2",
    '&gamma;': "\u03B3",
    '&delta;': "\u03B4",
    '&epsilon;': "\u03B5",
    '&zeta;': "\u03B6",
    '&eta;': "\u03B7",
    '&theta;': "\u03B8",
    '&iota;': "\u03B9",
    '&kappa;': "\u03BA",
    '&lambda;': "\u03BB",
    '&mu;': "\u03BC",
    '&nu;': "\u03BD",
    '&xi;': "\u03BE",
    '&omicron;': "\u03BF",
    '&pi;': "\u03C0",
    '&rho;': "\u03C1",
    '&sigmaf;': "\u03C2",
    '&sigma;': "\u03C3",
    '&tau;': "\u03C4",
    '&upsilon;': "\u03C5",
    '&phi;': "\u03C6",
    '&chi;': "\u03C7",
    '&psi;': "\u03C8",
    '&omega;': "\u03C9",
    '&thetasym;': "\u03D1",
    '&upsih;': "\u03D2",
    '&piv;': "\u03D6",
    '&ensp;': "\u2002",
    '&emsp;': "\u2003",
    '&thinsp;': "\u2009",
    '&zwnj;': "\u200C",
    '&zwj;': "\u200D",
    '&lrm;': "\u200E",
    '&rlm;': "\u200F",
    '&sbquo;': "\u201A",
    '&bdquo;': "\u201E",
    '&dagger;': "\u2020",
    '&Dagger;': "\u2021",
    '&hellip;': "\u2026",
    '&permil;': "\u2030",
    '&prime;': "\u2032",
    '&Prime;': "\u2033",
    '&oline;': "\u203E",
    '&frasl;': "\u2044",
    '&euro;': "\u20AC",
    '&image;': "\u2111",
    '&weierp;': "\u2118",
    '&real;': "\u211C",
    '&alefsym;': "\u2135",
    '&larr;': "\u2190",
    '&uarr;': "\u2191",
    '&rarr;': "\u2192",
    '&darr;': "\u2193",
    '&harr;': "\u2194",
    '&crarr;': "\u21B5",
    '&lArr;': "\u21D0",
    '&uArr;': "\u21D1",
    '&rArr;': "\u21D2",
    '&dArr;': "\u21D3",
    '&hArr;': "\u21D4",
    '&forall;': "\u2200",
    '&part;': "\u2202",
    '&exist;': "\u2203",
    '&empty;': "\u2205",
    '&nabla;': "\u2207",
    '&isin;': "\u2208",
    '&notin;': "\u2209",
    '&ni;': "\u220B",
    '&prod;': "\u220F",
    '&sum;': "\u2211",
    '&lowast;': "\u2217",
    '&radic;': "\u221A",
    '&prop;': "\u221D",
    '&infin;': "\u221E",
    '&ang;': "\u2220",
    '&and;': "\u2227",
    '&or;': "\u2228",
    '&cap;': "\u2229",
    '&cup;': "\u222A",
    '&int;': "\u222B",
    '&there4;': "\u2234",
    '&sim;': "\u223C",
    '&cong;': "\u2245",
    '&asymp;': "\u2248",
    '&ne;': "\u2260",
    '&equiv;': "\u2261",
    '&le;': "\u2264",
    '&ge;': "\u2265",
    '&sub;': "\u2282",
    '&sup;': "\u2283",
    '&nsub;': "\u2284",
    '&sube;': "\u2286",
    '&supe;': "\u2287",
    '&oplus;': "\u2295",
    '&otimes;': "\u2297",
    '&perp;': "\u22A5",
    '&sdot;': "\u22C5",
    '&lceil;': "\u2308",
    '&rceil;': "\u2309",
    '&lfloor;': "\u230A",
    '&rfloor;': "\u230B",
    '&lang;': "\u2329",
    '&rang;': "\u232A",
    '&loz;': "\u25CA",
    '&spades;': "\u2660",
    '&clubs;': "\u2663",
    '&hearts;': "\u2665",
    '&diams;': "\u2666"
  };

  var decode = function decode(str) {
    if (!~str.indexOf('&')) return str; //Decode literal EntitiesApi

    for (var i in entities) {
      str = str.replace(new RegExp(i, 'g'), entities[i]);
    } //Decode hex EntitiesApi


    str = str.replace(/&#x(0*[0-9a-f]{2,5});?/gi, function (m, code) {
      return String.fromCharCode(parseInt(+code, 16));
    }); //Decode numeric EntitiesApi

    str = str.replace(/&#([0-9]{2,4});?/gi, function (m, code) {
      return String.fromCharCode(+code);
    });
    str = str.replace(/&amp;/g, '&');
    return str;
  };

  var encode = function encode(str) {
    str = str.replace(/&/g, '&amp;'); //IE doesn't accept &apos;

    str = str.replace(/'/g, '&#39;'); //Encode literal EntitiesApi

    for (var i in entities) {
      str = str.replace(new RegExp(entities[i], 'g'), i);
    }

    return str;
  };

  exports.entities = {
    encode: encode,
    decode: decode //This module is adapted from the CodeIgniter framework
    //The license is available at http://codeigniter.com/

  };
  var never_allowed_str = {
    'document.cookie': '[removed]',
    'document.write': '[removed]',
    '.parentNode': '[removed]',
    '.innerHTML': '[removed]',
    'window.location': '[removed]',
    '-moz-binding': '[removed]',
    '<!--': '&lt;!--',
    '-->': '--&gt;',
    '<![CDATA[': '&lt;![CDATA['
  };
  var never_allowed_regex = {
    'javascript\\s*:': '[removed]',
    'expression\\s*(\\(|&\\#40;)': '[removed]',
    'vbscript\\s*:': '[removed]',
    'Redirect\\s+302': '[removed]'
  };
  var non_displayables = [/%0[0-8bcef]/g, // url encoded 00-08, 11, 12, 14, 15
  /%1[0-9a-f]/g, // url encoded 16-31
  /[\x00-\x08]/g, // 00-08
  /\x0b/g, /\x0c/g, // 11,12
  /[\x0e-\x1f]/g];
  var compact_words = ['javascript', 'expression', 'vbscript', 'script', 'applet', 'alert', 'document', 'write', 'cookie', 'window'];

  exports.xssClean = function (str, is_image) {
    //Recursively clean objects and arrays
    if (str instanceof Array || _typeof(str) === 'object') {
      for (var i in str) {
        str[i] = exports.xssClean(str[i]);
      }

      return str;
    } //Remove invisible characters


    str = remove_invisible_characters(str); //Protect query string variables in URLs => 901119URL5918AMP18930PROTECT8198

    str = str.replace(/\&([a-z\_0-9]+)\=([a-z\_0-9]+)/i, xss_hash() + '$1=$2'); //Validate standard character EntitiesApi - add a semicolon if missing.  We do this to enable
    //the conversion of EntitiesApi to ASCII later.

    str = str.replace(/(&\#?[0-9a-z]{2,})([\x00-\x20])*;?/i, '$1;$2'); //Validate UTF16 two byte encoding (x00) - just as above, adds a semicolon if missing.

    str = str.replace(/(&\#x?)([0-9A-F]+);?/i, '$1;$2'); //Un-protect query string variables

    str = str.replace(xss_hash(), '&'); //Decode just in case stuff like this is submitted:
    //<a href="http://%77%77%77%2E%67%6F%6F%67%6C%65%2E%63%6F%6D">Google</a>

    str = decodeURIComponent(str); //Convert character EntitiesApi to ASCII - this permits our tests below to work reliably.
    //We only convert EntitiesApi that are within tags since these are the ones that will pose security problems.

    str = str.replace(/[a-z]+=([\'\"]).*?\\1/gi, function (m, match) {
      return m.replace(match, convert_attribute(match));
    }); //Remove invisible characters again

    str = remove_invisible_characters(str); //Convert tabs to spaces

    str = str.replace('\t', ' '); //Captured the converted string for later comparison

    var converted_string = str; //Remove strings that are never allowed

    for (var i in never_allowed_str) {
      str = str.replace(i, never_allowed_str[i]);
    } //Remove regex patterns that are never allowed


    for (var i in never_allowed_regex) {
      str = str.replace(new RegExp(i, 'i'), never_allowed_regex[i]);
    } //Compact any exploded words like:  j a v a s c r i p t
    // We only want to do this when it is followed by a non-word character


    for (var i in compact_words) {
      var spacified = compact_words[i].split('').join('\\s*') + '\\s*';
      str = str.replace(new RegExp('(' + spacified + ')(\\W)', 'ig'), function (m, compat, after) {
        return compat.replace(/\s+/g, '') + after;
      });
    } //Remove disallowed Javascript in links or img tags


    do {
      var original = str;

      if (str.match(/<a/i)) {
        str = str.replace(/<a\\s+([^>]*?)(>|$)/gi, function (m, attributes, end_tag) {
          attributes = filter_attributes(attributes.replace('<', '').replace('>', ''));
          return m.replace(attributes, attributes.replace(/href=.*?(alert\(|alert&\#40;|javascript\:|charset\=|window\.|document\.|\.cookie|<script|<xss|base64\\s*,)/gi, ''));
        });
      }

      if (str.match(/<img/i)) {
        str = str.replace(/<img\\s+([^>]*?)(\\s?\/?>|$)/gi, function (m, attributes, end_tag) {
          attributes = filter_attributes(attributes.replace('<', '').replace('>', ''));
          return m.replace(attributes, attributes.replace(/src=.*?(alert\(|alert&\#40;|javascript\:|charset\=|window\.|document\.|\.cookie|<script|<xss|base64\\s*,)/gi, ''));
        });
      }

      if (str.match(/script/i) || str.match(/xss/i)) {
        str = str.replace(/<(\/*)(script|xss)(.*?)\>/gi, '[removed]');
      }
    } while (original != str); //Remove JavaScript Event Handlers - Note: This code is a little blunt.  It removes the event
    //handler and anything up to the closing >, but it's unlikely to be a problem.


    event_handlers = ['[^a-z_\-]on\w*']; //Adobe Photoshop puts XML metadata into JFIF images, including namespacing,
    //so we have to allow this for images

    if (!is_image) {
      event_handlers.push('xmlns');
    }

    str = str.replace(new RegExp("<([^><]+?)(" + event_handlers.join('|') + ")(\\s*=\\s*[^><]*)([><]*)", 'i'), '<$1$4'); //Sanitize naughty HTML elements
    //If a tag containing any of the words in the list
    //below is found, the tag gets converted to EntitiesApi.
    //So this: <blink>
    //Becomes: &lt;blink&gt;

    naughty = 'alert|applet|audio|basefont|base|behavior|bgsound|blink|body|embed|expression|form|frameset|frame|head|html|ilayer|iframe|input|isindex|layer|link|meta|object|plaintext|style|script|textarea|title|video|xml|xss';
    str = str.replace(new RegExp('<(/*\\s*)(' + naughty + ')([^><]*)([><]*)', 'gi'), function (m, a, b, c, d) {
      return '&lt;' + a + b + c + d.replace('>', '&gt;').replace('<', '&lt;');
    }); //Sanitize naughty scripting elements Similar to above, only instead of looking for
    //tags it looks for PHP and JavaScript commands that are disallowed.  Rather than removing the
    //code, it simply converts the parenthesis to EntitiesApi rendering the code un-executable.
    //For example:  eval('some code')
    //Becomes:      eval&#40;'some code'&#41;

    str = str.replace(/(alert|cmd|passthru|eval|exec|expression|system|fopen|fsockopen|file|file_get_contents|readfile|unlink)(\\s*)\((.*?)\)/gi, '$1$2&#40;$3&#41;'); //This adds a bit of extra precaution in case something got through the above filters

    for (var i in never_allowed_str) {
      str = str.replace(i, never_allowed_str[i]);
    }

    for (var i in never_allowed_regex) {
      str = str.replace(new RegExp(i, 'i'), never_allowed_regex[i]);
    } //Images are handled in a special way


    if (is_image && str !== converted_string) {
      throw new Error('Image may contain XSS');
    }

    return str;
  };

  function remove_invisible_characters(str) {
    for (var i in non_displayables) {
      str = str.replace(non_displayables[i], '');
    }

    return str;
  }

  function xss_hash() {
    //TODO: Create a random hash
    return '!*$^#(@*#&';
  }

  function convert_attribute(str) {
    return str.replace('>', '&gt;').replace('<', '&lt;').replace('\\', '\\\\');
  } //Filter Attributes - filters tag attributes for consistency and safety


  function filter_attributes(str) {
    out = '';
    str.replace(/\\s*[a-z\-]+\\s*=\\s*(?:\042|\047)(?:[^\\1]*?)\\1/gi, function (m) {
      $out += m.replace(/\/\*.*?\*\//g, '');
    });
    return out;
  }

  var Validator = exports.Validator = function () {};

  Validator.prototype.check = function (str, fail_msg) {
    this.str = str == null || isNaN(str) && str.length == undefined ? '' : str + '';
    this.msg = fail_msg;
    this._errors = [];
    return this;
  }; //Create some aliases - may help code readability


  Validator.prototype.validate = Validator.prototype.check;
  Validator.prototype.assert = Validator.prototype.check;

  Validator.prototype.error = function (msg) {
    throw new Error(msg);
  };

  Validator.prototype.isEmail = function () {
    if (!this.str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)) {
      return this.error(this.msg || 'Invalid email');
    }

    return this;
  }; //Will work against Visa, MasterCard, American Express, Discover, Diners Club, and JCB card numbering formats


  Validator.prototype.isCreditCard = function () {
    this.str.replace(/[^0-9]+/g, ''); //remove all dashes, spaces, etc.

    if (!this.str.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return this.error(this.msg || 'Invalid credit card');
    }

    return this;
  };

  Validator.prototype.isUrl = function () {
    if (!this.str.match(/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/)) {
      return this.error(this.msg || 'Invalid URL');
    }

    return this;
  };

  Validator.prototype.isIP = function () {
    if (!this.str.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
      return this.error(this.msg || 'Invalid IP');
    }

    return this;
  };

  Validator.prototype.isAlpha = function () {
    if (!this.str.match(/^[a-zA-Z]+$/)) {
      return this.error(this.msg || 'Invalid characters');
    }

    return this;
  };

  Validator.prototype.isAlphanumeric = function () {
    if (!this.str.match(/^[a-zA-Z0-9]+$/)) {
      return this.error(this.msg || 'Invalid characters');
    }

    return this;
  };

  Validator.prototype.isNumeric = function () {
    if (!this.str.match(/^-?[0-9]+$/)) {
      return this.error(this.msg || 'Invalid number');
    }

    return this;
  };

  Validator.prototype.isLowercase = function () {
    if (!this.str.match(/^[a-z0-9]+$/)) {
      return this.error(this.msg || 'Invalid characters');
    }

    return this;
  };

  Validator.prototype.isUppercase = function () {
    if (!this.str.match(/^[A-Z0-9]+$/)) {
      return this.error(this.msg || 'Invalid characters');
    }

    return this;
  };

  Validator.prototype.isInt = function () {
    if (!this.str.match(/^(?:-?(?:0|[1-9][0-9]*))$/)) {
      return this.error(this.msg || 'Invalid integer');
    }

    return this;
  };

  Validator.prototype.isDecimal = function () {
    if (!this.str.match(/^(?:-?(?:0|[1-9][0-9]*))?(?:\.[0-9]*)?$/)) {
      return this.error(this.msg || 'Invalid decimal');
    }

    return this;
  };

  Validator.prototype.isFloat = function () {
    return this.isDecimal();
  };

  Validator.prototype.notNull = function () {
    if (this.str === '') {
      return this.error(this.msg || 'Invalid characters');
    }

    return this;
  };

  Validator.prototype.isNull = function () {
    if (this.str !== '') {
      return this.error(this.msg || 'Invalid characters');
    }

    return this;
  };

  Validator.prototype.notEmpty = function () {
    if (this.str.match(/^[\s\t\r\n]*$/)) {
      return this.error(this.msg || 'String is whitespace');
    }

    return this;
  };

  Validator.prototype.equals = function (equals) {
    if (this.str != equals) {
      return this.error(this.msg || 'Not equal');
    }

    return this;
  };

  Validator.prototype.isFiscalCode = function (fiscalCode) {
    if (!fiscalCode || fiscalCode == "") return this.error(this.msg || 'Not fiscal code');
    var cf = fiscalCode.toUpperCase();
    var cfReg = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;
    if (!cfReg.test(cf)) return this.error(this.msg || 'Not fiscal code');
    var set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
    var s = 0;

    for (var i = 1; i <= 13; i += 2) {
      s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
    }

    for (var i = 0; i <= 14; i += 2) {
      s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
    }

    if (s % 26 != cf.charCodeAt(15) - 'A'.charCodeAt(0)) return this.error(this.msg || 'Not fiscal code');
    return this;
  };

  Validator.prototype.contains = function (str) {
    if (this.str.indexOf(str) === -1) {
      return this.error(this.msg || 'Invalid characters');
    }

    return this;
  };

  Validator.prototype.notContains = function (str) {
    if (this.str.indexOf(str) >= 0) {
      return this.error(this.msg || 'Invalid characters');
    }

    return this;
  };

  Validator.prototype.regex = Validator.prototype.is = function (pattern, modifiers) {
    if (typeof pattern !== 'function') {
      pattern = new RegExp(pattern, modifiers);
    }

    if (!this.str.match(pattern)) {
      return this.error(this.msg || 'Invalid characters');
    }

    return this;
  };

  Validator.prototype.notRegex = Validator.prototype.not = function (pattern, modifiers) {
    if (typeof pattern !== 'function') {
      pattern = new RegExp(pattern, modifiers);
    }

    if (this.str.match(pattern)) {
      this.error(this.msg || 'Invalid characters');
    }

    return this;
  };

  Validator.prototype.len = function (min, max) {
    if (this.str.length < min) {
      this.error(this.msg || 'String is too small');
    }

    if (_typeof(max) !== undefined && this.str.length > max) {
      return this.error(this.msg || 'String is too large');
    }

    return this;
  }; //Thanks to github.com/sreuter for the idea.


  Validator.prototype.isUUID = function (version) {
    if (version == 3 || version == 'v3') {
      pattern = /[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
    } else if (version == 4 || version == 'v4') {
      pattern = /[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    } else {
      pattern = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
    }

    if (!this.str.match(pattern)) {
      return this.error(this.msg || 'Not a UUID');
    }

    return this;
  };

  Validator.prototype.isDate = function () {
    var intDate = Date.parse(this.str);

    if (isNaN(intDate)) {
      return this.error(this.msg || 'Not a date');
    }

    return this;
  };

  Validator.prototype["in"] = function (options) {
    if (options && typeof options.indexOf === 'function') {
      if (!~options.indexOf(this.str)) {
        return this.error(this.msg || 'Unexpected value');
      }

      return this;
    } else {
      return this.error(this.msg || 'Invalid in() argument');
    }
  };

  Validator.prototype.notIn = function (options) {
    if (options && typeof options.indexOf === 'function') {
      if (options.indexOf(this.str) !== -1) {
        return this.error(this.msg || 'Unexpected value');
      }

      return this;
    } else {
      return this.error(this.msg || 'Invalid notIn() argument');
    }
  };

  Validator.prototype.min = function (val) {
    var number = parseFloat(this.str);

    if (!isNaN(number) && number < val) {
      return this.error(this.msg || 'Invalid number');
    }

    return this;
  };

  Validator.prototype.max = function (val) {
    var number = parseFloat(this.str);

    if (!isNaN(number) && number > val) {
      return this.error(this.msg || 'Invalid number');
    }

    return this;
  };

  Validator.prototype.isArray = function () {
    if (!Array.isArray(this.str)) {
      return this.error(this.msg || 'Not an array');
    }

    return this;
  };

  var Filter = exports.Filter = function () {};

  var whitespace = '\\r\\n\\t\\s';

  Filter.prototype.modify = function (str) {
    this.str = str;
  }; //Create some aliases - may help code readability


  Filter.prototype.convert = Filter.prototype.sanitize = function (str) {
    this.str = str;
    return this;
  };

  Filter.prototype.xss = function (is_image) {
    this.modify(exports.xssClean(this.str, is_image));
    return this.str;
  };

  Filter.prototype.entityDecode = function () {
    this.modify(decode(this.str));
    return this.str;
  };

  Filter.prototype.entityEncode = function () {
    this.modify(encode(this.str));
    return this.str;
  };

  Filter.prototype.ltrim = function (chars) {
    chars = chars || whitespace;
    this.modify(this.str.replace(new RegExp('^[' + chars + ']+', 'g'), ''));
    return this.str;
  };

  Filter.prototype.rtrim = function (chars) {
    chars = chars || whitespace;
    this.modify(this.str.replace(new RegExp('[' + chars + ']+$', 'g'), ''));
    return this.str;
  };

  Filter.prototype.trim = function (chars) {
    if (this.str) {
      chars = chars || whitespace;
      this.modify(this.str.replace(new RegExp('^[' + chars + ']+|[' + chars + ']+$', 'g'), ''));
    }

    return this.str;
  };

  Filter.prototype.ifNull = function (replace) {
    if (!this.str || this.str === '') {
      this.modify(replace);
    }

    return this.str;
  };

  Filter.prototype.toFloat = function () {
    this.modify(parseFloat(this.str));
    return this.str;
  };

  Filter.prototype.toLowerCase = function () {
    this.modify(this.str.toLowerCase());
    return this.str;
  };

  Filter.prototype.toUpperCase = function () {
    this.modify(this.str.toUpperCase());
    return this.str;
  };

  Filter.prototype.toInt = function (radix) {
    radix = radix || 10;
    this.modify(parseInt(this.str), radix);
    return this.str;
  }; //Any strings with length > 0 (except for '0' and 'false') are considered true,
  //all other strings are false


  Filter.prototype.toBoolean = function () {
    if (!this.str || this.str == '0' || this.str == 'false' || this.str == '') {
      this.modify(false);
    } else {
      this.modify(true);
    }

    return this.str;
  }; //String must be equal to '1' or 'true' to be considered true, all other strings
  //are false


  Filter.prototype.toBooleanStrict = function () {
    if (this.str == '1' || this.str == 'true') {
      this.modify(true);
    } else {
      this.modify(false);
    }

    return this.str;
  }; //Quick access methods


  exports.sanitize = exports.convert = function (str) {
    var filter = new exports.Filter();
    return filter.sanitize(str);
  };

  exports.check = exports.validate = exports.assert = function (str, fail_msg) {
    var validator = new exports.Validator();
    return validator.check(str, fail_msg);
  };
})(typeof exports === 'undefined' ? window : exports);

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _strings = _interopRequireDefault(require("../strings"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = [{
  icon: "zmdi zmdi-shield-security",
  text: (0, _strings["default"])("security"),
  roles: ["admin"],
  children: [{
    icon: "zmdi zmdi-accounts-alt",
    text: (0, _strings["default"])("users"),
    href: "/#/entities/user?grid=users",
    permissions: ["user:list"]
  }, {
    icon: "zmdi zmdi-key",
    text: (0, _strings["default"])("roles"),
    href: "/#/entities/role?grid=roles",
    permissions: ["role:list"] // ,{
    //     icon: "zmdi zmdi-accounts-alt",
    //     text: M("entityRevisionSettings"),
    //     href: "/#/entities/single/revisionSettings",
    //     permissions: ["entityRevisionSettings:edit"]
    // }

  }]
}];
exports["default"] = _default;

},{"../strings":347}],30:[function(require,module,exports){
"use strict";

require("./noConflict");

function _global() {
  const data = _interopRequireDefault(require("core-js/library/fn/global"));

  _global = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_global().default._babelPolyfill && typeof console !== "undefined" && console.warn) {
  console.warn("@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended " + "and may have consequences if different versions of the polyfills are applied sequentially. " + "If you do need to load the polyfill more than once, use @babel/polyfill/noConflict " + "instead to bypass the warning.");
}

_global().default._babelPolyfill = true;
},{"./noConflict":31,"core-js/library/fn/global":44}],31:[function(require,module,exports){
"use strict";

require("core-js/es6");

require("core-js/fn/array/includes");

require("core-js/fn/array/flat-map");

require("core-js/fn/string/pad-start");

require("core-js/fn/string/pad-end");

require("core-js/fn/string/trim-start");

require("core-js/fn/string/trim-end");

require("core-js/fn/symbol/async-iterator");

require("core-js/fn/object/get-own-property-descriptors");

require("core-js/fn/object/values");

require("core-js/fn/object/entries");

require("core-js/fn/promise/finally");

require("core-js/web");

require("regenerator-runtime/runtime");
},{"core-js/es6":32,"core-js/fn/array/flat-map":33,"core-js/fn/array/includes":34,"core-js/fn/object/entries":35,"core-js/fn/object/get-own-property-descriptors":36,"core-js/fn/object/values":37,"core-js/fn/promise/finally":38,"core-js/fn/string/pad-end":39,"core-js/fn/string/pad-start":40,"core-js/fn/string/trim-end":41,"core-js/fn/string/trim-start":42,"core-js/fn/symbol/async-iterator":43,"core-js/web":335,"regenerator-runtime/runtime":336}],32:[function(require,module,exports){
require('../modules/es6.symbol');
require('../modules/es6.object.create');
require('../modules/es6.object.define-property');
require('../modules/es6.object.define-properties');
require('../modules/es6.object.get-own-property-descriptor');
require('../modules/es6.object.get-prototype-of');
require('../modules/es6.object.keys');
require('../modules/es6.object.get-own-property-names');
require('../modules/es6.object.freeze');
require('../modules/es6.object.seal');
require('../modules/es6.object.prevent-extensions');
require('../modules/es6.object.is-frozen');
require('../modules/es6.object.is-sealed');
require('../modules/es6.object.is-extensible');
require('../modules/es6.object.assign');
require('../modules/es6.object.is');
require('../modules/es6.object.set-prototype-of');
require('../modules/es6.object.to-string');
require('../modules/es6.function.bind');
require('../modules/es6.function.name');
require('../modules/es6.function.has-instance');
require('../modules/es6.parse-int');
require('../modules/es6.parse-float');
require('../modules/es6.number.constructor');
require('../modules/es6.number.to-fixed');
require('../modules/es6.number.to-precision');
require('../modules/es6.number.epsilon');
require('../modules/es6.number.is-finite');
require('../modules/es6.number.is-integer');
require('../modules/es6.number.is-nan');
require('../modules/es6.number.is-safe-integer');
require('../modules/es6.number.max-safe-integer');
require('../modules/es6.number.min-safe-integer');
require('../modules/es6.number.parse-float');
require('../modules/es6.number.parse-int');
require('../modules/es6.math.acosh');
require('../modules/es6.math.asinh');
require('../modules/es6.math.atanh');
require('../modules/es6.math.cbrt');
require('../modules/es6.math.clz32');
require('../modules/es6.math.cosh');
require('../modules/es6.math.expm1');
require('../modules/es6.math.fround');
require('../modules/es6.math.hypot');
require('../modules/es6.math.imul');
require('../modules/es6.math.log10');
require('../modules/es6.math.log1p');
require('../modules/es6.math.log2');
require('../modules/es6.math.sign');
require('../modules/es6.math.sinh');
require('../modules/es6.math.tanh');
require('../modules/es6.math.trunc');
require('../modules/es6.string.from-code-point');
require('../modules/es6.string.raw');
require('../modules/es6.string.trim');
require('../modules/es6.string.iterator');
require('../modules/es6.string.code-point-at');
require('../modules/es6.string.ends-with');
require('../modules/es6.string.includes');
require('../modules/es6.string.repeat');
require('../modules/es6.string.starts-with');
require('../modules/es6.string.anchor');
require('../modules/es6.string.big');
require('../modules/es6.string.blink');
require('../modules/es6.string.bold');
require('../modules/es6.string.fixed');
require('../modules/es6.string.fontcolor');
require('../modules/es6.string.fontsize');
require('../modules/es6.string.italics');
require('../modules/es6.string.link');
require('../modules/es6.string.small');
require('../modules/es6.string.strike');
require('../modules/es6.string.sub');
require('../modules/es6.string.sup');
require('../modules/es6.date.now');
require('../modules/es6.date.to-json');
require('../modules/es6.date.to-iso-string');
require('../modules/es6.date.to-string');
require('../modules/es6.date.to-primitive');
require('../modules/es6.array.is-array');
require('../modules/es6.array.from');
require('../modules/es6.array.of');
require('../modules/es6.array.join');
require('../modules/es6.array.slice');
require('../modules/es6.array.sort');
require('../modules/es6.array.for-each');
require('../modules/es6.array.map');
require('../modules/es6.array.filter');
require('../modules/es6.array.some');
require('../modules/es6.array.every');
require('../modules/es6.array.reduce');
require('../modules/es6.array.reduce-right');
require('../modules/es6.array.index-of');
require('../modules/es6.array.last-index-of');
require('../modules/es6.array.copy-within');
require('../modules/es6.array.fill');
require('../modules/es6.array.find');
require('../modules/es6.array.find-index');
require('../modules/es6.array.species');
require('../modules/es6.array.iterator');
require('../modules/es6.regexp.constructor');
require('../modules/es6.regexp.exec');
require('../modules/es6.regexp.to-string');
require('../modules/es6.regexp.flags');
require('../modules/es6.regexp.match');
require('../modules/es6.regexp.replace');
require('../modules/es6.regexp.search');
require('../modules/es6.regexp.split');
require('../modules/es6.promise');
require('../modules/es6.map');
require('../modules/es6.set');
require('../modules/es6.weak-map');
require('../modules/es6.weak-set');
require('../modules/es6.typed.array-buffer');
require('../modules/es6.typed.data-view');
require('../modules/es6.typed.int8-array');
require('../modules/es6.typed.uint8-array');
require('../modules/es6.typed.uint8-clamped-array');
require('../modules/es6.typed.int16-array');
require('../modules/es6.typed.uint16-array');
require('../modules/es6.typed.int32-array');
require('../modules/es6.typed.uint32-array');
require('../modules/es6.typed.float32-array');
require('../modules/es6.typed.float64-array');
require('../modules/es6.reflect.apply');
require('../modules/es6.reflect.construct');
require('../modules/es6.reflect.define-property');
require('../modules/es6.reflect.delete-property');
require('../modules/es6.reflect.enumerate');
require('../modules/es6.reflect.get');
require('../modules/es6.reflect.get-own-property-descriptor');
require('../modules/es6.reflect.get-prototype-of');
require('../modules/es6.reflect.has');
require('../modules/es6.reflect.is-extensible');
require('../modules/es6.reflect.own-keys');
require('../modules/es6.reflect.prevent-extensions');
require('../modules/es6.reflect.set');
require('../modules/es6.reflect.set-prototype-of');
module.exports = require('../modules/_core');

},{"../modules/_core":81,"../modules/es6.array.copy-within":183,"../modules/es6.array.every":184,"../modules/es6.array.fill":185,"../modules/es6.array.filter":186,"../modules/es6.array.find":188,"../modules/es6.array.find-index":187,"../modules/es6.array.for-each":189,"../modules/es6.array.from":190,"../modules/es6.array.index-of":191,"../modules/es6.array.is-array":192,"../modules/es6.array.iterator":193,"../modules/es6.array.join":194,"../modules/es6.array.last-index-of":195,"../modules/es6.array.map":196,"../modules/es6.array.of":197,"../modules/es6.array.reduce":199,"../modules/es6.array.reduce-right":198,"../modules/es6.array.slice":200,"../modules/es6.array.some":201,"../modules/es6.array.sort":202,"../modules/es6.array.species":203,"../modules/es6.date.now":204,"../modules/es6.date.to-iso-string":205,"../modules/es6.date.to-json":206,"../modules/es6.date.to-primitive":207,"../modules/es6.date.to-string":208,"../modules/es6.function.bind":209,"../modules/es6.function.has-instance":210,"../modules/es6.function.name":211,"../modules/es6.map":212,"../modules/es6.math.acosh":213,"../modules/es6.math.asinh":214,"../modules/es6.math.atanh":215,"../modules/es6.math.cbrt":216,"../modules/es6.math.clz32":217,"../modules/es6.math.cosh":218,"../modules/es6.math.expm1":219,"../modules/es6.math.fround":220,"../modules/es6.math.hypot":221,"../modules/es6.math.imul":222,"../modules/es6.math.log10":223,"../modules/es6.math.log1p":224,"../modules/es6.math.log2":225,"../modules/es6.math.sign":226,"../modules/es6.math.sinh":227,"../modules/es6.math.tanh":228,"../modules/es6.math.trunc":229,"../modules/es6.number.constructor":230,"../modules/es6.number.epsilon":231,"../modules/es6.number.is-finite":232,"../modules/es6.number.is-integer":233,"../modules/es6.number.is-nan":234,"../modules/es6.number.is-safe-integer":235,"../modules/es6.number.max-safe-integer":236,"../modules/es6.number.min-safe-integer":237,"../modules/es6.number.parse-float":238,"../modules/es6.number.parse-int":239,"../modules/es6.number.to-fixed":240,"../modules/es6.number.to-precision":241,"../modules/es6.object.assign":242,"../modules/es6.object.create":243,"../modules/es6.object.define-properties":244,"../modules/es6.object.define-property":245,"../modules/es6.object.freeze":246,"../modules/es6.object.get-own-property-descriptor":247,"../modules/es6.object.get-own-property-names":248,"../modules/es6.object.get-prototype-of":249,"../modules/es6.object.is":253,"../modules/es6.object.is-extensible":250,"../modules/es6.object.is-frozen":251,"../modules/es6.object.is-sealed":252,"../modules/es6.object.keys":254,"../modules/es6.object.prevent-extensions":255,"../modules/es6.object.seal":256,"../modules/es6.object.set-prototype-of":257,"../modules/es6.object.to-string":258,"../modules/es6.parse-float":259,"../modules/es6.parse-int":260,"../modules/es6.promise":261,"../modules/es6.reflect.apply":262,"../modules/es6.reflect.construct":263,"../modules/es6.reflect.define-property":264,"../modules/es6.reflect.delete-property":265,"../modules/es6.reflect.enumerate":266,"../modules/es6.reflect.get":269,"../modules/es6.reflect.get-own-property-descriptor":267,"../modules/es6.reflect.get-prototype-of":268,"../modules/es6.reflect.has":270,"../modules/es6.reflect.is-extensible":271,"../modules/es6.reflect.own-keys":272,"../modules/es6.reflect.prevent-extensions":273,"../modules/es6.reflect.set":275,"../modules/es6.reflect.set-prototype-of":274,"../modules/es6.regexp.constructor":276,"../modules/es6.regexp.exec":277,"../modules/es6.regexp.flags":278,"../modules/es6.regexp.match":279,"../modules/es6.regexp.replace":280,"../modules/es6.regexp.search":281,"../modules/es6.regexp.split":282,"../modules/es6.regexp.to-string":283,"../modules/es6.set":284,"../modules/es6.string.anchor":285,"../modules/es6.string.big":286,"../modules/es6.string.blink":287,"../modules/es6.string.bold":288,"../modules/es6.string.code-point-at":289,"../modules/es6.string.ends-with":290,"../modules/es6.string.fixed":291,"../modules/es6.string.fontcolor":292,"../modules/es6.string.fontsize":293,"../modules/es6.string.from-code-point":294,"../modules/es6.string.includes":295,"../modules/es6.string.italics":296,"../modules/es6.string.iterator":297,"../modules/es6.string.link":298,"../modules/es6.string.raw":299,"../modules/es6.string.repeat":300,"../modules/es6.string.small":301,"../modules/es6.string.starts-with":302,"../modules/es6.string.strike":303,"../modules/es6.string.sub":304,"../modules/es6.string.sup":305,"../modules/es6.string.trim":306,"../modules/es6.symbol":307,"../modules/es6.typed.array-buffer":308,"../modules/es6.typed.data-view":309,"../modules/es6.typed.float32-array":310,"../modules/es6.typed.float64-array":311,"../modules/es6.typed.int16-array":312,"../modules/es6.typed.int32-array":313,"../modules/es6.typed.int8-array":314,"../modules/es6.typed.uint16-array":315,"../modules/es6.typed.uint32-array":316,"../modules/es6.typed.uint8-array":317,"../modules/es6.typed.uint8-clamped-array":318,"../modules/es6.weak-map":319,"../modules/es6.weak-set":320}],33:[function(require,module,exports){
require('../../modules/es7.array.flat-map');
module.exports = require('../../modules/_core').Array.flatMap;

},{"../../modules/_core":81,"../../modules/es7.array.flat-map":321}],34:[function(require,module,exports){
require('../../modules/es7.array.includes');
module.exports = require('../../modules/_core').Array.includes;

},{"../../modules/_core":81,"../../modules/es7.array.includes":322}],35:[function(require,module,exports){
require('../../modules/es7.object.entries');
module.exports = require('../../modules/_core').Object.entries;

},{"../../modules/_core":81,"../../modules/es7.object.entries":323}],36:[function(require,module,exports){
require('../../modules/es7.object.get-own-property-descriptors');
module.exports = require('../../modules/_core').Object.getOwnPropertyDescriptors;

},{"../../modules/_core":81,"../../modules/es7.object.get-own-property-descriptors":324}],37:[function(require,module,exports){
require('../../modules/es7.object.values');
module.exports = require('../../modules/_core').Object.values;

},{"../../modules/_core":81,"../../modules/es7.object.values":325}],38:[function(require,module,exports){
'use strict';
require('../../modules/es6.promise');
require('../../modules/es7.promise.finally');
module.exports = require('../../modules/_core').Promise['finally'];

},{"../../modules/_core":81,"../../modules/es6.promise":261,"../../modules/es7.promise.finally":326}],39:[function(require,module,exports){
require('../../modules/es7.string.pad-end');
module.exports = require('../../modules/_core').String.padEnd;

},{"../../modules/_core":81,"../../modules/es7.string.pad-end":327}],40:[function(require,module,exports){
require('../../modules/es7.string.pad-start');
module.exports = require('../../modules/_core').String.padStart;

},{"../../modules/_core":81,"../../modules/es7.string.pad-start":328}],41:[function(require,module,exports){
require('../../modules/es7.string.trim-right');
module.exports = require('../../modules/_core').String.trimRight;

},{"../../modules/_core":81,"../../modules/es7.string.trim-right":330}],42:[function(require,module,exports){
require('../../modules/es7.string.trim-left');
module.exports = require('../../modules/_core').String.trimLeft;

},{"../../modules/_core":81,"../../modules/es7.string.trim-left":329}],43:[function(require,module,exports){
require('../../modules/es7.symbol.async-iterator');
module.exports = require('../../modules/_wks-ext').f('asyncIterator');

},{"../../modules/_wks-ext":180,"../../modules/es7.symbol.async-iterator":331}],44:[function(require,module,exports){
require('../modules/es7.global');
module.exports = require('../modules/_core').global;

},{"../modules/_core":47,"../modules/es7.global":61}],45:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],46:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":57}],47:[function(require,module,exports){
var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],48:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":45}],49:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":52}],50:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":53,"./_is-object":57}],51:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
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
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
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

},{"./_core":47,"./_ctx":48,"./_global":53,"./_has":54,"./_hide":55}],52:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],53:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],54:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],55:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":49,"./_object-dp":58,"./_property-desc":59}],56:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":49,"./_dom-create":50,"./_fails":52}],57:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],58:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":46,"./_descriptors":49,"./_ie8-dom-define":56,"./_to-primitive":60}],59:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],60:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":57}],61:[function(require,module,exports){
// https://github.com/tc39/proposal-global
var $export = require('./_export');

$export($export.G, { global: require('./_global') });

},{"./_export":51,"./_global":53}],62:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],63:[function(require,module,exports){
var cof = require('./_cof');
module.exports = function (it, msg) {
  if (typeof it != 'number' && cof(it) != 'Number') throw TypeError(msg);
  return +it;
};

},{"./_cof":77}],64:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":101,"./_wks":181}],65:[function(require,module,exports){
'use strict';
var at = require('./_string-at')(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

},{"./_string-at":158}],66:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],67:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"./_is-object":110,"dup":46}],68:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');

module.exports = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
  var O = toObject(this);
  var len = toLength(O.length);
  var to = toAbsoluteIndex(target, len);
  var from = toAbsoluteIndex(start, len);
  var end = arguments.length > 2 ? arguments[2] : undefined;
  var count = Math.min((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
  var inc = 1;
  if (from < to && to < from + count) {
    inc = -1;
    from += count - 1;
    to += count - 1;
  }
  while (count-- > 0) {
    if (from in O) O[to] = O[from];
    else delete O[to];
    to += inc;
    from += inc;
  } return O;
};

},{"./_to-absolute-index":166,"./_to-length":170,"./_to-object":171}],69:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"./_to-absolute-index":166,"./_to-length":170,"./_to-object":171}],70:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":166,"./_to-iobject":169,"./_to-length":170}],71:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":74,"./_ctx":83,"./_iobject":106,"./_to-length":170,"./_to-object":171}],72:[function(require,module,exports){
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var toLength = require('./_to-length');

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

},{"./_a-function":62,"./_iobject":106,"./_to-length":170,"./_to-object":171}],73:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":108,"./_is-object":110,"./_wks":181}],74:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":73}],75:[function(require,module,exports){
'use strict';
var aFunction = require('./_a-function');
var isObject = require('./_is-object');
var invoke = require('./_invoke');
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":62,"./_invoke":105,"./_is-object":110}],76:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":77,"./_wks":181}],77:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],78:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":66,"./_ctx":83,"./_descriptors":87,"./_for-of":97,"./_iter-define":114,"./_iter-step":116,"./_meta":123,"./_object-create":127,"./_object-dp":128,"./_redefine-all":146,"./_set-species":152,"./_validate-collection":178}],79:[function(require,module,exports){
'use strict';
var redefineAll = require('./_redefine-all');
var getWeak = require('./_meta').getWeak;
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var createArrayMethod = require('./_array-methods');
var $has = require('./_has');
var validate = require('./_validate-collection');
var arrayFind = createArrayMethod(5);
var arrayFindIndex = createArrayMethod(6);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (that) {
  return that._l || (that._l = new UncaughtFrozenStore());
};
var UncaughtFrozenStore = function () {
  this.a = [];
};
var findUncaughtFrozen = function (store, key) {
  return arrayFind(store.a, function (it) {
    return it[0] === key;
  });
};
UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function (key) {
    var index = arrayFindIndex(this.a, function (it) {
      return it[0] === key;
    });
    if (~index) this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;      // collection type
      that._i = id++;      // collection id
      that._l = undefined; // leak store for uncaught frozen objects
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function (key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME))['delete'](key);
        return data && $has(data, this._i) && delete data[this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key) {
        if (!isObject(key)) return false;
        var data = getWeak(key);
        if (data === true) return uncaughtFrozenStore(validate(this, NAME)).has(key);
        return data && $has(data, this._i);
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var data = getWeak(anObject(key), true);
    if (data === true) uncaughtFrozenStore(that).set(key, value);
    else data[that._i] = value;
    return that;
  },
  ufstore: uncaughtFrozenStore
};

},{"./_an-instance":66,"./_an-object":67,"./_array-methods":71,"./_for-of":97,"./_has":100,"./_is-object":110,"./_meta":123,"./_redefine-all":146,"./_validate-collection":178}],80:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var redefine = require('./_redefine');
var redefineAll = require('./_redefine-all');
var meta = require('./_meta');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var fails = require('./_fails');
var $iterDetect = require('./_iter-detect');
var setToStringTag = require('./_set-to-string-tag');
var inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":66,"./_export":91,"./_fails":93,"./_for-of":97,"./_global":99,"./_inherit-if-required":104,"./_is-object":110,"./_iter-detect":115,"./_meta":123,"./_redefine":147,"./_redefine-all":146,"./_set-to-string-tag":153}],81:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],82:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":128,"./_property-desc":145}],83:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"./_a-function":62,"dup":48}],84:[function(require,module,exports){
'use strict';
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var fails = require('./_fails');
var getTime = Date.prototype.getTime;
var $toISOString = Date.prototype.toISOString;

var lz = function (num) {
  return num > 9 ? num : '0' + num;
};

// PhantomJS / old WebKit has a broken implementations
module.exports = (fails(function () {
  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
}) || !fails(function () {
  $toISOString.call(new Date(NaN));
})) ? function toISOString() {
  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
  var d = this;
  var y = d.getUTCFullYear();
  var m = d.getUTCMilliseconds();
  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
} : $toISOString;

},{"./_fails":93}],85:[function(require,module,exports){
'use strict';
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');
var NUMBER = 'number';

module.exports = function (hint) {
  if (hint !== 'string' && hint !== NUMBER && hint !== 'default') throw TypeError('Incorrect hint');
  return toPrimitive(anObject(this), hint != NUMBER);
};

},{"./_an-object":67,"./_to-primitive":172}],86:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],87:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./_fails":93,"dup":49}],88:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"./_global":99,"./_is-object":110,"dup":50}],89:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],90:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":133,"./_object-keys":136,"./_object-pie":137}],91:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
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

},{"./_core":81,"./_ctx":83,"./_global":99,"./_hide":101,"./_redefine":147}],92:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

},{"./_wks":181}],93:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],94:[function(require,module,exports){
'use strict';
require('./es6.regexp.exec');
var redefine = require('./_redefine');
var hide = require('./_hide');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');
var regexpExec = require('./_regexp-exec');

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./_defined":86,"./_fails":93,"./_hide":101,"./_redefine":147,"./_regexp-exec":149,"./_wks":181,"./es6.regexp.exec":277}],95:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":67}],96:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var isArray = require('./_is-array');
var isObject = require('./_is-object');
var toLength = require('./_to-length');
var ctx = require('./_ctx');
var IS_CONCAT_SPREADABLE = require('./_wks')('isConcatSpreadable');

function flattenIntoArray(target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? ctx(mapper, thisArg, 3) : false;
  var element, spreadable;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      spreadable = false;
      if (isObject(element)) {
        spreadable = element[IS_CONCAT_SPREADABLE];
        spreadable = spreadable !== undefined ? !!spreadable : isArray(element);
      }

      if (spreadable && depth > 0) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1fffffffffffff) throw TypeError();
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
}

module.exports = flattenIntoArray;

},{"./_ctx":83,"./_is-array":108,"./_is-object":110,"./_to-length":170,"./_wks":181}],97:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":67,"./_ctx":83,"./_is-array-iter":107,"./_iter-call":112,"./_to-length":170,"./core.get-iterator-method":182}],98:[function(require,module,exports){
module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":155}],99:[function(require,module,exports){
arguments[4][53][0].apply(exports,arguments)
},{"dup":53}],100:[function(require,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"dup":54}],101:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"./_descriptors":87,"./_object-dp":128,"./_property-desc":145,"dup":55}],102:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":99}],103:[function(require,module,exports){
arguments[4][56][0].apply(exports,arguments)
},{"./_descriptors":87,"./_dom-create":88,"./_fails":93,"dup":56}],104:[function(require,module,exports){
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":110,"./_set-proto":151}],105:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],106:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":77}],107:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":117,"./_wks":181}],108:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":77}],109:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object');
var floor = Math.floor;
module.exports = function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor(it) === it;
};

},{"./_is-object":110}],110:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"dup":57}],111:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object');
var cof = require('./_cof');
var MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_cof":77,"./_is-object":110,"./_wks":181}],112:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":67}],113:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":101,"./_object-create":127,"./_property-desc":145,"./_set-to-string-tag":153,"./_wks":181}],114:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":91,"./_hide":101,"./_iter-create":113,"./_iterators":117,"./_library":118,"./_object-gpo":134,"./_redefine":147,"./_set-to-string-tag":153,"./_wks":181}],115:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":181}],116:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],117:[function(require,module,exports){
module.exports = {};

},{}],118:[function(require,module,exports){
module.exports = false;

},{}],119:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $expm1 = Math.expm1;
module.exports = (!$expm1
  // Old FF bug
  || $expm1(10) > 22025.465794806719 || $expm1(10) < 22025.4657948067165168
  // Tor Browser bug
  || $expm1(-2e-17) != -2e-17
) ? function expm1(x) {
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
} : $expm1;

},{}],120:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var sign = require('./_math-sign');
var pow = Math.pow;
var EPSILON = pow(2, -52);
var EPSILON32 = pow(2, -23);
var MAX32 = pow(2, 127) * (2 - EPSILON32);
var MIN32 = pow(2, -126);

var roundTiesToEven = function (n) {
  return n + 1 / EPSILON - 1 / EPSILON;
};

module.exports = Math.fround || function fround(x) {
  var $abs = Math.abs(x);
  var $sign = sign(x);
  var a, result;
  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
  a = (1 + EPSILON32 / EPSILON) * $abs;
  result = a - (a - $abs);
  // eslint-disable-next-line no-self-compare
  if (result > MAX32 || result != result) return $sign * Infinity;
  return $sign * result;
};

},{"./_math-sign":122}],121:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x) {
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};

},{}],122:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x) {
  // eslint-disable-next-line no-self-compare
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};

},{}],123:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":93,"./_has":100,"./_is-object":110,"./_object-dp":128,"./_uid":176}],124:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":77,"./_global":99,"./_task":165}],125:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":62}],126:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":93,"./_iobject":106,"./_object-gops":133,"./_object-keys":136,"./_object-pie":137,"./_to-object":171}],127:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":67,"./_dom-create":88,"./_enum-bug-keys":89,"./_html":102,"./_object-dps":129,"./_shared-key":154}],128:[function(require,module,exports){
arguments[4][58][0].apply(exports,arguments)
},{"./_an-object":67,"./_descriptors":87,"./_ie8-dom-define":103,"./_to-primitive":172,"dup":58}],129:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":67,"./_descriptors":87,"./_object-dp":128,"./_object-keys":136}],130:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":87,"./_has":100,"./_ie8-dom-define":103,"./_object-pie":137,"./_property-desc":145,"./_to-iobject":169,"./_to-primitive":172}],131:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":132,"./_to-iobject":169}],132:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":89,"./_object-keys-internal":135}],133:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],134:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":100,"./_shared-key":154,"./_to-object":171}],135:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":70,"./_has":100,"./_shared-key":154,"./_to-iobject":169}],136:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":89,"./_object-keys-internal":135}],137:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],138:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":81,"./_export":91,"./_fails":93}],139:[function(require,module,exports){
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

},{"./_object-keys":136,"./_object-pie":137,"./_to-iobject":169}],140:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var gOPN = require('./_object-gopn');
var gOPS = require('./_object-gops');
var anObject = require('./_an-object');
var Reflect = require('./_global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};

},{"./_an-object":67,"./_global":99,"./_object-gopn":132,"./_object-gops":133}],141:[function(require,module,exports){
var $parseFloat = require('./_global').parseFloat;
var $trim = require('./_string-trim').trim;

module.exports = 1 / $parseFloat(require('./_string-ws') + '-0') !== -Infinity ? function parseFloat(str) {
  var string = $trim(String(str), 3);
  var result = $parseFloat(string);
  return result === 0 && string.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

},{"./_global":99,"./_string-trim":163,"./_string-ws":164}],142:[function(require,module,exports){
var $parseInt = require('./_global').parseInt;
var $trim = require('./_string-trim').trim;
var ws = require('./_string-ws');
var hex = /^[-+]?0[xX]/;

module.exports = $parseInt(ws + '08') !== 8 || $parseInt(ws + '0x16') !== 22 ? function parseInt(str, radix) {
  var string = $trim(String(str), 3);
  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
} : $parseInt;

},{"./_global":99,"./_string-trim":163,"./_string-ws":164}],143:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],144:[function(require,module,exports){
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":67,"./_is-object":110,"./_new-promise-capability":125}],145:[function(require,module,exports){
arguments[4][59][0].apply(exports,arguments)
},{"dup":59}],146:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":147}],147:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var $toString = require('./_function-to-string');
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":81,"./_function-to-string":98,"./_global":99,"./_has":100,"./_hide":101,"./_uid":176}],148:[function(require,module,exports){
'use strict';

var classof = require('./_classof');
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};

},{"./_classof":76}],149:[function(require,module,exports){
'use strict';

var regexpFlags = require('./_flags');

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;

},{"./_flags":95}],150:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};

},{}],151:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":67,"./_ctx":83,"./_is-object":110,"./_object-gopd":130}],152:[function(require,module,exports){
'use strict';
var global = require('./_global');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_descriptors":87,"./_global":99,"./_object-dp":128,"./_wks":181}],153:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":100,"./_object-dp":128,"./_wks":181}],154:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":155,"./_uid":176}],155:[function(require,module,exports){
var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":81,"./_global":99,"./_library":118}],156:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":62,"./_an-object":67,"./_wks":181}],157:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":93}],158:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":86,"./_to-integer":168}],159:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":86,"./_is-regexp":111}],160:[function(require,module,exports){
var $export = require('./_export');
var fails = require('./_fails');
var defined = require('./_defined');
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

},{"./_defined":86,"./_export":91,"./_fails":93}],161:[function(require,module,exports){
// https://github.com/tc39/proposal-string-pad-start-end
var toLength = require('./_to-length');
var repeat = require('./_string-repeat');
var defined = require('./_defined');

module.exports = function (that, maxLength, fillString, left) {
  var S = String(defined(that));
  var stringLength = S.length;
  var fillStr = fillString === undefined ? ' ' : String(fillString);
  var intMaxLength = toLength(maxLength);
  if (intMaxLength <= stringLength || fillStr == '') return S;
  var fillLen = intMaxLength - stringLength;
  var stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if (stringFiller.length > fillLen) stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};

},{"./_defined":86,"./_string-repeat":162,"./_to-length":170}],162:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer');
var defined = require('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

},{"./_defined":86,"./_to-integer":168}],163:[function(require,module,exports){
var $export = require('./_export');
var defined = require('./_defined');
var fails = require('./_fails');
var spaces = require('./_string-ws');
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

},{"./_defined":86,"./_export":91,"./_fails":93,"./_string-ws":164}],164:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],165:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":77,"./_ctx":83,"./_dom-create":88,"./_global":99,"./_html":102,"./_invoke":105}],166:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":168}],167:[function(require,module,exports){
// https://tc39.github.io/ecma262/#sec-toindex
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
module.exports = function (it) {
  if (it === undefined) return 0;
  var number = toInteger(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length!');
  return length;
};

},{"./_to-integer":168,"./_to-length":170}],168:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],169:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":86,"./_iobject":106}],170:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":168}],171:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":86}],172:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"./_is-object":110,"dup":60}],173:[function(require,module,exports){
'use strict';
if (require('./_descriptors')) {
  var LIBRARY = require('./_library');
  var global = require('./_global');
  var fails = require('./_fails');
  var $export = require('./_export');
  var $typed = require('./_typed');
  var $buffer = require('./_typed-buffer');
  var ctx = require('./_ctx');
  var anInstance = require('./_an-instance');
  var propertyDesc = require('./_property-desc');
  var hide = require('./_hide');
  var redefineAll = require('./_redefine-all');
  var toInteger = require('./_to-integer');
  var toLength = require('./_to-length');
  var toIndex = require('./_to-index');
  var toAbsoluteIndex = require('./_to-absolute-index');
  var toPrimitive = require('./_to-primitive');
  var has = require('./_has');
  var classof = require('./_classof');
  var isObject = require('./_is-object');
  var toObject = require('./_to-object');
  var isArrayIter = require('./_is-array-iter');
  var create = require('./_object-create');
  var getPrototypeOf = require('./_object-gpo');
  var gOPN = require('./_object-gopn').f;
  var getIterFn = require('./core.get-iterator-method');
  var uid = require('./_uid');
  var wks = require('./_wks');
  var createArrayMethod = require('./_array-methods');
  var createArrayIncludes = require('./_array-includes');
  var speciesConstructor = require('./_species-constructor');
  var ArrayIterators = require('./es6.array.iterator');
  var Iterators = require('./_iterators');
  var $iterDetect = require('./_iter-detect');
  var setSpecies = require('./_set-species');
  var arrayFill = require('./_array-fill');
  var arrayCopyWithin = require('./_array-copy-within');
  var $DP = require('./_object-dp');
  var $GOPD = require('./_object-gopd');
  var dP = $DP.f;
  var gOPD = $GOPD.f;
  var RangeError = global.RangeError;
  var TypeError = global.TypeError;
  var Uint8Array = global.Uint8Array;
  var ARRAY_BUFFER = 'ArrayBuffer';
  var SHARED_BUFFER = 'Shared' + ARRAY_BUFFER;
  var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
  var PROTOTYPE = 'prototype';
  var ArrayProto = Array[PROTOTYPE];
  var $ArrayBuffer = $buffer.ArrayBuffer;
  var $DataView = $buffer.DataView;
  var arrayForEach = createArrayMethod(0);
  var arrayFilter = createArrayMethod(2);
  var arraySome = createArrayMethod(3);
  var arrayEvery = createArrayMethod(4);
  var arrayFind = createArrayMethod(5);
  var arrayFindIndex = createArrayMethod(6);
  var arrayIncludes = createArrayIncludes(true);
  var arrayIndexOf = createArrayIncludes(false);
  var arrayValues = ArrayIterators.values;
  var arrayKeys = ArrayIterators.keys;
  var arrayEntries = ArrayIterators.entries;
  var arrayLastIndexOf = ArrayProto.lastIndexOf;
  var arrayReduce = ArrayProto.reduce;
  var arrayReduceRight = ArrayProto.reduceRight;
  var arrayJoin = ArrayProto.join;
  var arraySort = ArrayProto.sort;
  var arraySlice = ArrayProto.slice;
  var arrayToString = ArrayProto.toString;
  var arrayToLocaleString = ArrayProto.toLocaleString;
  var ITERATOR = wks('iterator');
  var TAG = wks('toStringTag');
  var TYPED_CONSTRUCTOR = uid('typed_constructor');
  var DEF_CONSTRUCTOR = uid('def_constructor');
  var ALL_CONSTRUCTORS = $typed.CONSTR;
  var TYPED_ARRAY = $typed.TYPED;
  var VIEW = $typed.VIEW;
  var WRONG_LENGTH = 'Wrong length!';

  var $map = createArrayMethod(1, function (O, length) {
    return allocate(speciesConstructor(O, O[DEF_CONSTRUCTOR]), length);
  });

  var LITTLE_ENDIAN = fails(function () {
    // eslint-disable-next-line no-undef
    return new Uint8Array(new Uint16Array([1]).buffer)[0] === 1;
  });

  var FORCED_SET = !!Uint8Array && !!Uint8Array[PROTOTYPE].set && fails(function () {
    new Uint8Array(1).set({});
  });

  var toOffset = function (it, BYTES) {
    var offset = toInteger(it);
    if (offset < 0 || offset % BYTES) throw RangeError('Wrong offset!');
    return offset;
  };

  var validate = function (it) {
    if (isObject(it) && TYPED_ARRAY in it) return it;
    throw TypeError(it + ' is not a typed array!');
  };

  var allocate = function (C, length) {
    if (!(isObject(C) && TYPED_CONSTRUCTOR in C)) {
      throw TypeError('It is not a typed array constructor!');
    } return new C(length);
  };

  var speciesFromList = function (O, list) {
    return fromList(speciesConstructor(O, O[DEF_CONSTRUCTOR]), list);
  };

  var fromList = function (C, list) {
    var index = 0;
    var length = list.length;
    var result = allocate(C, length);
    while (length > index) result[index] = list[index++];
    return result;
  };

  var addGetter = function (it, key, internal) {
    dP(it, key, { get: function () { return this._d[internal]; } });
  };

  var $from = function from(source /* , mapfn, thisArg */) {
    var O = toObject(source);
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var iterFn = getIterFn(O);
    var i, length, values, result, step, iterator;
    if (iterFn != undefined && !isArrayIter(iterFn)) {
      for (iterator = iterFn.call(O), values = [], i = 0; !(step = iterator.next()).done; i++) {
        values.push(step.value);
      } O = values;
    }
    if (mapping && aLen > 2) mapfn = ctx(mapfn, arguments[2], 2);
    for (i = 0, length = toLength(O.length), result = allocate(this, length); length > i; i++) {
      result[i] = mapping ? mapfn(O[i], i) : O[i];
    }
    return result;
  };

  var $of = function of(/* ...items */) {
    var index = 0;
    var length = arguments.length;
    var result = allocate(this, length);
    while (length > index) result[index] = arguments[index++];
    return result;
  };

  // iOS Safari 6.x fails here
  var TO_LOCALE_BUG = !!Uint8Array && fails(function () { arrayToLocaleString.call(new Uint8Array(1)); });

  var $toLocaleString = function toLocaleString() {
    return arrayToLocaleString.apply(TO_LOCALE_BUG ? arraySlice.call(validate(this)) : validate(this), arguments);
  };

  var proto = {
    copyWithin: function copyWithin(target, start /* , end */) {
      return arrayCopyWithin.call(validate(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function every(callbackfn /* , thisArg */) {
      return arrayEvery(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function fill(value /* , start, end */) { // eslint-disable-line no-unused-vars
      return arrayFill.apply(validate(this), arguments);
    },
    filter: function filter(callbackfn /* , thisArg */) {
      return speciesFromList(this, arrayFilter(validate(this), callbackfn,
        arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function find(predicate /* , thisArg */) {
      return arrayFind(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function findIndex(predicate /* , thisArg */) {
      return arrayFindIndex(validate(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function forEach(callbackfn /* , thisArg */) {
      arrayForEach(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function indexOf(searchElement /* , fromIndex */) {
      return arrayIndexOf(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function includes(searchElement /* , fromIndex */) {
      return arrayIncludes(validate(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function join(separator) { // eslint-disable-line no-unused-vars
      return arrayJoin.apply(validate(this), arguments);
    },
    lastIndexOf: function lastIndexOf(searchElement /* , fromIndex */) { // eslint-disable-line no-unused-vars
      return arrayLastIndexOf.apply(validate(this), arguments);
    },
    map: function map(mapfn /* , thisArg */) {
      return $map(validate(this), mapfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function reduce(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduce.apply(validate(this), arguments);
    },
    reduceRight: function reduceRight(callbackfn /* , initialValue */) { // eslint-disable-line no-unused-vars
      return arrayReduceRight.apply(validate(this), arguments);
    },
    reverse: function reverse() {
      var that = this;
      var length = validate(that).length;
      var middle = Math.floor(length / 2);
      var index = 0;
      var value;
      while (index < middle) {
        value = that[index];
        that[index++] = that[--length];
        that[length] = value;
      } return that;
    },
    some: function some(callbackfn /* , thisArg */) {
      return arraySome(validate(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function sort(comparefn) {
      return arraySort.call(validate(this), comparefn);
    },
    subarray: function subarray(begin, end) {
      var O = validate(this);
      var length = O.length;
      var $begin = toAbsoluteIndex(begin, length);
      return new (speciesConstructor(O, O[DEF_CONSTRUCTOR]))(
        O.buffer,
        O.byteOffset + $begin * O.BYTES_PER_ELEMENT,
        toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - $begin)
      );
    }
  };

  var $slice = function slice(start, end) {
    return speciesFromList(this, arraySlice.call(validate(this), start, end));
  };

  var $set = function set(arrayLike /* , offset */) {
    validate(this);
    var offset = toOffset(arguments[1], 1);
    var length = this.length;
    var src = toObject(arrayLike);
    var len = toLength(src.length);
    var index = 0;
    if (len + offset > length) throw RangeError(WRONG_LENGTH);
    while (index < len) this[offset + index] = src[index++];
  };

  var $iterators = {
    entries: function entries() {
      return arrayEntries.call(validate(this));
    },
    keys: function keys() {
      return arrayKeys.call(validate(this));
    },
    values: function values() {
      return arrayValues.call(validate(this));
    }
  };

  var isTAIndex = function (target, key) {
    return isObject(target)
      && target[TYPED_ARRAY]
      && typeof key != 'symbol'
      && key in target
      && String(+key) == String(key);
  };
  var $getDesc = function getOwnPropertyDescriptor(target, key) {
    return isTAIndex(target, key = toPrimitive(key, true))
      ? propertyDesc(2, target[key])
      : gOPD(target, key);
  };
  var $setDesc = function defineProperty(target, key, desc) {
    if (isTAIndex(target, key = toPrimitive(key, true))
      && isObject(desc)
      && has(desc, 'value')
      && !has(desc, 'get')
      && !has(desc, 'set')
      // TODO: add validation descriptor w/o calling accessors
      && !desc.configurable
      && (!has(desc, 'writable') || desc.writable)
      && (!has(desc, 'enumerable') || desc.enumerable)
    ) {
      target[key] = desc.value;
      return target;
    } return dP(target, key, desc);
  };

  if (!ALL_CONSTRUCTORS) {
    $GOPD.f = $getDesc;
    $DP.f = $setDesc;
  }

  $export($export.S + $export.F * !ALL_CONSTRUCTORS, 'Object', {
    getOwnPropertyDescriptor: $getDesc,
    defineProperty: $setDesc
  });

  if (fails(function () { arrayToString.call({}); })) {
    arrayToString = arrayToLocaleString = function toString() {
      return arrayJoin.call(this);
    };
  }

  var $TypedArrayPrototype$ = redefineAll({}, proto);
  redefineAll($TypedArrayPrototype$, $iterators);
  hide($TypedArrayPrototype$, ITERATOR, $iterators.values);
  redefineAll($TypedArrayPrototype$, {
    slice: $slice,
    set: $set,
    constructor: function () { /* noop */ },
    toString: arrayToString,
    toLocaleString: $toLocaleString
  });
  addGetter($TypedArrayPrototype$, 'buffer', 'b');
  addGetter($TypedArrayPrototype$, 'byteOffset', 'o');
  addGetter($TypedArrayPrototype$, 'byteLength', 'l');
  addGetter($TypedArrayPrototype$, 'length', 'e');
  dP($TypedArrayPrototype$, TAG, {
    get: function () { return this[TYPED_ARRAY]; }
  });

  // eslint-disable-next-line max-statements
  module.exports = function (KEY, BYTES, wrapper, CLAMPED) {
    CLAMPED = !!CLAMPED;
    var NAME = KEY + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + KEY;
    var SETTER = 'set' + KEY;
    var TypedArray = global[NAME];
    var Base = TypedArray || {};
    var TAC = TypedArray && getPrototypeOf(TypedArray);
    var FORCED = !TypedArray || !$typed.ABV;
    var O = {};
    var TypedArrayPrototype = TypedArray && TypedArray[PROTOTYPE];
    var getter = function (that, index) {
      var data = that._d;
      return data.v[GETTER](index * BYTES + data.o, LITTLE_ENDIAN);
    };
    var setter = function (that, index, value) {
      var data = that._d;
      if (CLAMPED) value = (value = Math.round(value)) < 0 ? 0 : value > 0xff ? 0xff : value & 0xff;
      data.v[SETTER](index * BYTES + data.o, value, LITTLE_ENDIAN);
    };
    var addElement = function (that, index) {
      dP(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };
    if (FORCED) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME, '_d');
        var index = 0;
        var offset = 0;
        var buffer, byteLength, length, klass;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new $ArrayBuffer(byteLength);
        } else if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          buffer = data;
          offset = toOffset($offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - offset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + offset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (TYPED_ARRAY in data) {
          return fromList(TypedArray, data);
        } else {
          return $from.call(TypedArray, data);
        }
        hide(that, '_d', {
          b: buffer,
          o: offset,
          l: byteLength,
          e: length,
          v: new $DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });
      TypedArrayPrototype = TypedArray[PROTOTYPE] = create($TypedArrayPrototype$);
      hide(TypedArrayPrototype, 'constructor', TypedArray);
    } else if (!fails(function () {
      TypedArray(1);
    }) || !fails(function () {
      new TypedArray(-1); // eslint-disable-line no-new
    }) || !$iterDetect(function (iter) {
      new TypedArray(); // eslint-disable-line no-new
      new TypedArray(null); // eslint-disable-line no-new
      new TypedArray(1.5); // eslint-disable-line no-new
      new TypedArray(iter); // eslint-disable-line no-new
    }, true)) {
      TypedArray = wrapper(function (that, data, $offset, $length) {
        anInstance(that, TypedArray, NAME);
        var klass;
        // `ws` module bug, temporarily remove validation length for Uint8Array
        // https://github.com/websockets/ws/pull/645
        if (!isObject(data)) return new Base(toIndex(data));
        if (data instanceof $ArrayBuffer || (klass = classof(data)) == ARRAY_BUFFER || klass == SHARED_BUFFER) {
          return $length !== undefined
            ? new Base(data, toOffset($offset, BYTES), $length)
            : $offset !== undefined
              ? new Base(data, toOffset($offset, BYTES))
              : new Base(data);
        }
        if (TYPED_ARRAY in data) return fromList(TypedArray, data);
        return $from.call(TypedArray, data);
      });
      arrayForEach(TAC !== Function.prototype ? gOPN(Base).concat(gOPN(TAC)) : gOPN(Base), function (key) {
        if (!(key in TypedArray)) hide(TypedArray, key, Base[key]);
      });
      TypedArray[PROTOTYPE] = TypedArrayPrototype;
      if (!LIBRARY) TypedArrayPrototype.constructor = TypedArray;
    }
    var $nativeIterator = TypedArrayPrototype[ITERATOR];
    var CORRECT_ITER_NAME = !!$nativeIterator
      && ($nativeIterator.name == 'values' || $nativeIterator.name == undefined);
    var $iterator = $iterators.values;
    hide(TypedArray, TYPED_CONSTRUCTOR, true);
    hide(TypedArrayPrototype, TYPED_ARRAY, NAME);
    hide(TypedArrayPrototype, VIEW, true);
    hide(TypedArrayPrototype, DEF_CONSTRUCTOR, TypedArray);

    if (CLAMPED ? new TypedArray(1)[TAG] != NAME : !(TAG in TypedArrayPrototype)) {
      dP(TypedArrayPrototype, TAG, {
        get: function () { return NAME; }
      });
    }

    O[NAME] = TypedArray;

    $export($export.G + $export.W + $export.F * (TypedArray != Base), O);

    $export($export.S, NAME, {
      BYTES_PER_ELEMENT: BYTES
    });

    $export($export.S + $export.F * fails(function () { Base.of.call(TypedArray, 1); }), NAME, {
      from: $from,
      of: $of
    });

    if (!(BYTES_PER_ELEMENT in TypedArrayPrototype)) hide(TypedArrayPrototype, BYTES_PER_ELEMENT, BYTES);

    $export($export.P, NAME, proto);

    setSpecies(NAME);

    $export($export.P + $export.F * FORCED_SET, NAME, { set: $set });

    $export($export.P + $export.F * !CORRECT_ITER_NAME, NAME, $iterators);

    if (!LIBRARY && TypedArrayPrototype.toString != arrayToString) TypedArrayPrototype.toString = arrayToString;

    $export($export.P + $export.F * fails(function () {
      new TypedArray(1).slice();
    }), NAME, { slice: $slice });

    $export($export.P + $export.F * (fails(function () {
      return [1, 2].toLocaleString() != new TypedArray([1, 2]).toLocaleString();
    }) || !fails(function () {
      TypedArrayPrototype.toLocaleString.call([1, 2]);
    })), NAME, { toLocaleString: $toLocaleString });

    Iterators[NAME] = CORRECT_ITER_NAME ? $nativeIterator : $iterator;
    if (!LIBRARY && !CORRECT_ITER_NAME) hide(TypedArrayPrototype, ITERATOR, $iterator);
  };
} else module.exports = function () { /* empty */ };

},{"./_an-instance":66,"./_array-copy-within":68,"./_array-fill":69,"./_array-includes":70,"./_array-methods":71,"./_classof":76,"./_ctx":83,"./_descriptors":87,"./_export":91,"./_fails":93,"./_global":99,"./_has":100,"./_hide":101,"./_is-array-iter":107,"./_is-object":110,"./_iter-detect":115,"./_iterators":117,"./_library":118,"./_object-create":127,"./_object-dp":128,"./_object-gopd":130,"./_object-gopn":132,"./_object-gpo":134,"./_property-desc":145,"./_redefine-all":146,"./_set-species":152,"./_species-constructor":156,"./_to-absolute-index":166,"./_to-index":167,"./_to-integer":168,"./_to-length":170,"./_to-object":171,"./_to-primitive":172,"./_typed":175,"./_typed-buffer":174,"./_uid":176,"./_wks":181,"./core.get-iterator-method":182,"./es6.array.iterator":193}],174:[function(require,module,exports){
'use strict';
var global = require('./_global');
var DESCRIPTORS = require('./_descriptors');
var LIBRARY = require('./_library');
var $typed = require('./_typed');
var hide = require('./_hide');
var redefineAll = require('./_redefine-all');
var fails = require('./_fails');
var anInstance = require('./_an-instance');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var toIndex = require('./_to-index');
var gOPN = require('./_object-gopn').f;
var dP = require('./_object-dp').f;
var arrayFill = require('./_array-fill');
var setToStringTag = require('./_set-to-string-tag');
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length!';
var WRONG_INDEX = 'Wrong index!';
var $ArrayBuffer = global[ARRAY_BUFFER];
var $DataView = global[DATA_VIEW];
var Math = global.Math;
var RangeError = global.RangeError;
// eslint-disable-next-line no-shadow-restricted-names
var Infinity = global.Infinity;
var BaseBuffer = $ArrayBuffer;
var abs = Math.abs;
var pow = Math.pow;
var floor = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;
var BUFFER = 'buffer';
var BYTE_LENGTH = 'byteLength';
var BYTE_OFFSET = 'byteOffset';
var $BUFFER = DESCRIPTORS ? '_b' : BUFFER;
var $LENGTH = DESCRIPTORS ? '_l' : BYTE_LENGTH;
var $OFFSET = DESCRIPTORS ? '_o' : BYTE_OFFSET;

// IEEE754 conversions based on https://github.com/feross/ieee754
function packIEEE754(value, mLen, nBytes) {
  var buffer = new Array(nBytes);
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var i = 0;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  var e, m, c;
  value = abs(value);
  // eslint-disable-next-line no-self-compare
  if (value != value || value === Infinity) {
    // eslint-disable-next-line no-self-compare
    m = value != value ? 1 : 0;
    e = eMax;
  } else {
    e = floor(log(value) / LN2);
    if (value * (c = pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * pow(2, eBias - 1) * pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[i++] = m & 255, m /= 256, mLen -= 8);
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[i++] = e & 255, e /= 256, eLen -= 8);
  buffer[--i] |= s * 128;
  return buffer;
}
function unpackIEEE754(buffer, mLen, nBytes) {
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = eLen - 7;
  var i = nBytes - 1;
  var s = buffer[i--];
  var e = s & 127;
  var m;
  s >>= 7;
  for (; nBits > 0; e = e * 256 + buffer[i], i--, nBits -= 8);
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[i], i--, nBits -= 8);
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : s ? -Infinity : Infinity;
  } else {
    m = m + pow(2, mLen);
    e = e - eBias;
  } return (s ? -1 : 1) * m * pow(2, e - mLen);
}

function unpackI32(bytes) {
  return bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
}
function packI8(it) {
  return [it & 0xff];
}
function packI16(it) {
  return [it & 0xff, it >> 8 & 0xff];
}
function packI32(it) {
  return [it & 0xff, it >> 8 & 0xff, it >> 16 & 0xff, it >> 24 & 0xff];
}
function packF64(it) {
  return packIEEE754(it, 52, 8);
}
function packF32(it) {
  return packIEEE754(it, 23, 4);
}

function addGetter(C, key, internal) {
  dP(C[PROTOTYPE], key, { get: function () { return this[internal]; } });
}

function get(view, bytes, index, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = store.slice(start, start + bytes);
  return isLittleEndian ? pack : pack.reverse();
}
function set(view, bytes, index, conversion, value, isLittleEndian) {
  var numIndex = +index;
  var intIndex = toIndex(numIndex);
  if (intIndex + bytes > view[$LENGTH]) throw RangeError(WRONG_INDEX);
  var store = view[$BUFFER]._b;
  var start = intIndex + view[$OFFSET];
  var pack = conversion(+value);
  for (var i = 0; i < bytes; i++) store[start + i] = pack[isLittleEndian ? i : bytes - i - 1];
}

if (!$typed.ABV) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
    var byteLength = toIndex(length);
    this._b = arrayFill.call(new Array(byteLength), 0);
    this[$LENGTH] = byteLength;
  };

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, $DataView, DATA_VIEW);
    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
    var bufferLength = buffer[$LENGTH];
    var offset = toInteger(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError('Wrong offset!');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError(WRONG_LENGTH);
    this[$BUFFER] = buffer;
    this[$OFFSET] = offset;
    this[$LENGTH] = byteLength;
  };

  if (DESCRIPTORS) {
    addGetter($ArrayBuffer, BYTE_LENGTH, '_l');
    addGetter($DataView, BUFFER, '_b');
    addGetter($DataView, BYTE_LENGTH, '_l');
    addGetter($DataView, BYTE_OFFSET, '_o');
  }

  redefineAll($DataView[PROTOTYPE], {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments[1]);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1]));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackI32(get(this, 4, byteOffset, arguments[1])) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments[1]), 23, 4);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments[1]), 52, 8);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packI8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packI16, value, arguments[2]);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packI32, value, arguments[2]);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packF32, value, arguments[2]);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packF64, value, arguments[2]);
    }
  });
} else {
  if (!fails(function () {
    $ArrayBuffer(1);
  }) || !fails(function () {
    new $ArrayBuffer(-1); // eslint-disable-line no-new
  }) || fails(function () {
    new $ArrayBuffer(); // eslint-disable-line no-new
    new $ArrayBuffer(1.5); // eslint-disable-line no-new
    new $ArrayBuffer(NaN); // eslint-disable-line no-new
    return $ArrayBuffer.name != ARRAY_BUFFER;
  })) {
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, $ArrayBuffer);
      return new BaseBuffer(toIndex(length));
    };
    var ArrayBufferProto = $ArrayBuffer[PROTOTYPE] = BaseBuffer[PROTOTYPE];
    for (var keys = gOPN(BaseBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) hide($ArrayBuffer, key, BaseBuffer[key]);
    }
    if (!LIBRARY) ArrayBufferProto.constructor = $ArrayBuffer;
  }
  // iOS Safari 7.x bug
  var view = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = $DataView[PROTOTYPE].setInt8;
  view.setInt8(0, 2147483648);
  view.setInt8(1, 2147483649);
  if (view.getInt8(0) || !view.getInt8(1)) redefineAll($DataView[PROTOTYPE], {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8.call(this, byteOffset, value << 24 >> 24);
    }
  }, true);
}
setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);
hide($DataView[PROTOTYPE], $typed.VIEW, true);
exports[ARRAY_BUFFER] = $ArrayBuffer;
exports[DATA_VIEW] = $DataView;

},{"./_an-instance":66,"./_array-fill":69,"./_descriptors":87,"./_fails":93,"./_global":99,"./_hide":101,"./_library":118,"./_object-dp":128,"./_object-gopn":132,"./_redefine-all":146,"./_set-to-string-tag":153,"./_to-index":167,"./_to-integer":168,"./_to-length":170,"./_typed":175}],175:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var uid = require('./_uid');
var TYPED = uid('typed_array');
var VIEW = uid('view');
var ABV = !!(global.ArrayBuffer && global.DataView);
var CONSTR = ABV;
var i = 0;
var l = 9;
var Typed;

var TypedArrayConstructors = (
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
).split(',');

while (i < l) {
  if (Typed = global[TypedArrayConstructors[i++]]) {
    hide(Typed.prototype, TYPED, true);
    hide(Typed.prototype, VIEW, true);
  } else CONSTR = false;
}

module.exports = {
  ABV: ABV,
  CONSTR: CONSTR,
  TYPED: TYPED,
  VIEW: VIEW
};

},{"./_global":99,"./_hide":101,"./_uid":176}],176:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],177:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":99}],178:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":110}],179:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":81,"./_global":99,"./_library":118,"./_object-dp":128,"./_wks-ext":180}],180:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":181}],181:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":99,"./_shared":155,"./_uid":176}],182:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":76,"./_core":81,"./_iterators":117,"./_wks":181}],183:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { copyWithin: require('./_array-copy-within') });

require('./_add-to-unscopables')('copyWithin');

},{"./_add-to-unscopables":64,"./_array-copy-within":68,"./_export":91}],184:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $every = require('./_array-methods')(4);

$export($export.P + $export.F * !require('./_strict-method')([].every, true), 'Array', {
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":71,"./_export":91,"./_strict-method":157}],185:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":64,"./_array-fill":69,"./_export":91}],186:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":71,"./_export":91,"./_strict-method":157}],187:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":64,"./_array-methods":71,"./_export":91}],188:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":64,"./_array-methods":71,"./_export":91}],189:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $forEach = require('./_array-methods')(0);
var STRICT = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":71,"./_export":91,"./_strict-method":157}],190:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":82,"./_ctx":83,"./_export":91,"./_is-array-iter":107,"./_iter-call":112,"./_iter-detect":115,"./_to-length":170,"./_to-object":171,"./core.get-iterator-method":182}],191:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $indexOf = require('./_array-includes')(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

},{"./_array-includes":70,"./_export":91,"./_strict-method":157}],192:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });

},{"./_export":91,"./_is-array":108}],193:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":64,"./_iter-define":114,"./_iter-step":116,"./_iterators":117,"./_to-iobject":169}],194:[function(require,module,exports){
'use strict';
// 22.1.3.13 Array.prototype.join(separator)
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var arrayJoin = [].join;

// fallback for not array-like strings
$export($export.P + $export.F * (require('./_iobject') != Object || !require('./_strict-method')(arrayJoin)), 'Array', {
  join: function join(separator) {
    return arrayJoin.call(toIObject(this), separator === undefined ? ',' : separator);
  }
});

},{"./_export":91,"./_iobject":106,"./_strict-method":157,"./_to-iobject":169}],195:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toInteger = require('./_to-integer');
var toLength = require('./_to-length');
var $native = [].lastIndexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].lastIndexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
    // convert -0 to +0
    if (NEGATIVE_ZERO) return $native.apply(this, arguments) || 0;
    var O = toIObject(this);
    var length = toLength(O.length);
    var index = length - 1;
    if (arguments.length > 1) index = Math.min(index, toInteger(arguments[1]));
    if (index < 0) index = length + index;
    for (;index >= 0; index--) if (index in O) if (O[index] === searchElement) return index || 0;
    return -1;
  }
});

},{"./_export":91,"./_strict-method":157,"./_to-integer":168,"./_to-iobject":169,"./_to-length":170}],196:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":71,"./_export":91,"./_strict-method":157}],197:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var createProperty = require('./_create-property');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./_fails')(function () {
  function F() { /* empty */ }
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */) {
    var index = 0;
    var aLen = arguments.length;
    var result = new (typeof this == 'function' ? this : Array)(aLen);
    while (aLen > index) createProperty(result, index, arguments[index++]);
    result.length = aLen;
    return result;
  }
});

},{"./_create-property":82,"./_export":91,"./_fails":93}],198:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduceRight, true), 'Array', {
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: function reduceRight(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], true);
  }
});

},{"./_array-reduce":72,"./_export":91,"./_strict-method":157}],199:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

},{"./_array-reduce":72,"./_export":91,"./_strict-method":157}],200:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var html = require('./_html');
var cof = require('./_cof');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * require('./_fails')(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = new Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});

},{"./_cof":77,"./_export":91,"./_fails":93,"./_html":102,"./_to-absolute-index":166,"./_to-length":170}],201:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $some = require('./_array-methods')(3);

$export($export.P + $export.F * !require('./_strict-method')([].some, true), 'Array', {
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":71,"./_export":91,"./_strict-method":157}],202:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var fails = require('./_fails');
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

},{"./_a-function":62,"./_export":91,"./_fails":93,"./_strict-method":157,"./_to-object":171}],203:[function(require,module,exports){
require('./_set-species')('Array');

},{"./_set-species":152}],204:[function(require,module,exports){
// 20.3.3.1 / 15.9.4.4 Date.now()
var $export = require('./_export');

$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });

},{"./_export":91}],205:[function(require,module,exports){
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
var $export = require('./_export');
var toISOString = require('./_date-to-iso-string');

// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (Date.prototype.toISOString !== toISOString), 'Date', {
  toISOString: toISOString
});

},{"./_date-to-iso-string":84,"./_export":91}],206:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toObject = require('./_to-object');
var toPrimitive = require('./_to-primitive');

$export($export.P + $export.F * require('./_fails')(function () {
  return new Date(NaN).toJSON() !== null
    || Date.prototype.toJSON.call({ toISOString: function () { return 1; } }) !== 1;
}), 'Date', {
  // eslint-disable-next-line no-unused-vars
  toJSON: function toJSON(key) {
    var O = toObject(this);
    var pv = toPrimitive(O);
    return typeof pv == 'number' && !isFinite(pv) ? null : O.toISOString();
  }
});

},{"./_export":91,"./_fails":93,"./_to-object":171,"./_to-primitive":172}],207:[function(require,module,exports){
var TO_PRIMITIVE = require('./_wks')('toPrimitive');
var proto = Date.prototype;

if (!(TO_PRIMITIVE in proto)) require('./_hide')(proto, TO_PRIMITIVE, require('./_date-to-primitive'));

},{"./_date-to-primitive":85,"./_hide":101,"./_wks":181}],208:[function(require,module,exports){
var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  require('./_redefine')(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

},{"./_redefine":147}],209:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_bind":75,"./_export":91}],210:[function(require,module,exports){
'use strict';
var isObject = require('./_is-object');
var getPrototypeOf = require('./_object-gpo');
var HAS_INSTANCE = require('./_wks')('hasInstance');
var FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if (!(HAS_INSTANCE in FunctionProto)) require('./_object-dp').f(FunctionProto, HAS_INSTANCE, { value: function (O) {
  if (typeof this != 'function' || !isObject(O)) return false;
  if (!isObject(this.prototype)) return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while (O = getPrototypeOf(O)) if (this.prototype === O) return true;
  return false;
} });

},{"./_is-object":110,"./_object-dp":128,"./_object-gpo":134,"./_wks":181}],211:[function(require,module,exports){
var dP = require('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

},{"./_descriptors":87,"./_object-dp":128}],212:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":80,"./_collection-strong":78,"./_validate-collection":178}],213:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./_export');
var log1p = require('./_math-log1p');
var sqrt = Math.sqrt;
var $acosh = Math.acosh;

$export($export.S + $export.F * !($acosh
  // V8 bug: https://code.google.com/p/v8/issues/detail?id=3509
  && Math.floor($acosh(Number.MAX_VALUE)) == 710
  // Tor Browser bug: Math.acosh(Infinity) -> NaN
  && $acosh(Infinity) == Infinity
), 'Math', {
  acosh: function acosh(x) {
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});

},{"./_export":91,"./_math-log1p":121}],214:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./_export');
var $asinh = Math.asinh;

function asinh(x) {
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

// Tor Browser bug: Math.asinh(0) -> -0
$export($export.S + $export.F * !($asinh && 1 / $asinh(0) > 0), 'Math', { asinh: asinh });

},{"./_export":91}],215:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./_export');
var $atanh = Math.atanh;

// Tor Browser bug: Math.atanh(-0) -> 0
$export($export.S + $export.F * !($atanh && 1 / $atanh(-0) < 0), 'Math', {
  atanh: function atanh(x) {
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});

},{"./_export":91}],216:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./_export');
var sign = require('./_math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x) {
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});

},{"./_export":91,"./_math-sign":122}],217:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  clz32: function clz32(x) {
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});

},{"./_export":91}],218:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./_export');
var exp = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x) {
    return (exp(x = +x) + exp(-x)) / 2;
  }
});

},{"./_export":91}],219:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./_export');
var $expm1 = require('./_math-expm1');

$export($export.S + $export.F * ($expm1 != Math.expm1), 'Math', { expm1: $expm1 });

},{"./_export":91,"./_math-expm1":119}],220:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export = require('./_export');

$export($export.S, 'Math', { fround: require('./_math-fround') });

},{"./_export":91,"./_math-fround":120}],221:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./_export');
var abs = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2) { // eslint-disable-line no-unused-vars
    var sum = 0;
    var i = 0;
    var aLen = arguments.length;
    var larg = 0;
    var arg, div;
    while (i < aLen) {
      arg = abs(arguments[i++]);
      if (larg < arg) {
        div = larg / arg;
        sum = sum * div * div + 1;
        larg = arg;
      } else if (arg > 0) {
        div = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});

},{"./_export":91}],222:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./_export');
var $imul = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./_fails')(function () {
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y) {
    var UINT16 = 0xffff;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

},{"./_export":91,"./_fails":93}],223:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log10: function log10(x) {
    return Math.log(x) * Math.LOG10E;
  }
});

},{"./_export":91}],224:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./_export');

$export($export.S, 'Math', { log1p: require('./_math-log1p') });

},{"./_export":91,"./_math-log1p":121}],225:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  log2: function log2(x) {
    return Math.log(x) / Math.LN2;
  }
});

},{"./_export":91}],226:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./_export');

$export($export.S, 'Math', { sign: require('./_math-sign') });

},{"./_export":91,"./_math-sign":122}],227:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./_fails')(function () {
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x) {
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});

},{"./_export":91,"./_fails":93,"./_math-expm1":119}],228:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./_export');
var expm1 = require('./_math-expm1');
var exp = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x) {
    var a = expm1(x = +x);
    var b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});

},{"./_export":91,"./_math-expm1":119}],229:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./_export');

$export($export.S, 'Math', {
  trunc: function trunc(it) {
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});

},{"./_export":91}],230:[function(require,module,exports){
'use strict';
var global = require('./_global');
var has = require('./_has');
var cof = require('./_cof');
var inheritIfRequired = require('./_inherit-if-required');
var toPrimitive = require('./_to-primitive');
var fails = require('./_fails');
var gOPN = require('./_object-gopn').f;
var gOPD = require('./_object-gopd').f;
var dP = require('./_object-dp').f;
var $trim = require('./_string-trim').trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(require('./_object-create')(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}

},{"./_cof":77,"./_descriptors":87,"./_fails":93,"./_global":99,"./_has":100,"./_inherit-if-required":104,"./_object-create":127,"./_object-dp":128,"./_object-gopd":130,"./_object-gopn":132,"./_redefine":147,"./_string-trim":163,"./_to-primitive":172}],231:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./_export');

$export($export.S, 'Number', { EPSILON: Math.pow(2, -52) });

},{"./_export":91}],232:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export = require('./_export');
var _isFinite = require('./_global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it) {
    return typeof it == 'number' && _isFinite(it);
  }
});

},{"./_export":91,"./_global":99}],233:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', { isInteger: require('./_is-integer') });

},{"./_export":91,"./_is-integer":109}],234:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./_export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

},{"./_export":91}],235:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export = require('./_export');
var isInteger = require('./_is-integer');
var abs = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number) {
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});

},{"./_export":91,"./_is-integer":109}],236:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

},{"./_export":91}],237:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./_export');

$export($export.S, 'Number', { MIN_SAFE_INTEGER: -0x1fffffffffffff });

},{"./_export":91}],238:[function(require,module,exports){
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 20.1.2.12 Number.parseFloat(string)
$export($export.S + $export.F * (Number.parseFloat != $parseFloat), 'Number', { parseFloat: $parseFloat });

},{"./_export":91,"./_parse-float":141}],239:[function(require,module,exports){
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 20.1.2.13 Number.parseInt(string, radix)
$export($export.S + $export.F * (Number.parseInt != $parseInt), 'Number', { parseInt: $parseInt });

},{"./_export":91,"./_parse-int":142}],240:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var toInteger = require('./_to-integer');
var aNumberValue = require('./_a-number-value');
var repeat = require('./_string-repeat');
var $toFixed = 1.0.toFixed;
var floor = Math.floor;
var data = [0, 0, 0, 0, 0, 0];
var ERROR = 'Number.toFixed: incorrect invocation!';
var ZERO = '0';

var multiply = function (n, c) {
  var i = -1;
  var c2 = c;
  while (++i < 6) {
    c2 += n * data[i];
    data[i] = c2 % 1e7;
    c2 = floor(c2 / 1e7);
  }
};
var divide = function (n) {
  var i = 6;
  var c = 0;
  while (--i >= 0) {
    c += data[i];
    data[i] = floor(c / n);
    c = (c % n) * 1e7;
  }
};
var numToString = function () {
  var i = 6;
  var s = '';
  while (--i >= 0) {
    if (s !== '' || i === 0 || data[i] !== 0) {
      var t = String(data[i]);
      s = s === '' ? t : s + repeat.call(ZERO, 7 - t.length) + t;
    }
  } return s;
};
var pow = function (x, n, acc) {
  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
};
var log = function (x) {
  var n = 0;
  var x2 = x;
  while (x2 >= 4096) {
    n += 12;
    x2 /= 4096;
  }
  while (x2 >= 2) {
    n += 1;
    x2 /= 2;
  } return n;
};

$export($export.P + $export.F * (!!$toFixed && (
  0.00008.toFixed(3) !== '0.000' ||
  0.9.toFixed(0) !== '1' ||
  1.255.toFixed(2) !== '1.25' ||
  1000000000000000128.0.toFixed(0) !== '1000000000000000128'
) || !require('./_fails')(function () {
  // V8 ~ Android 4.3-
  $toFixed.call({});
})), 'Number', {
  toFixed: function toFixed(fractionDigits) {
    var x = aNumberValue(this, ERROR);
    var f = toInteger(fractionDigits);
    var s = '';
    var m = ZERO;
    var e, z, j, k;
    if (f < 0 || f > 20) throw RangeError(ERROR);
    // eslint-disable-next-line no-self-compare
    if (x != x) return 'NaN';
    if (x <= -1e21 || x >= 1e21) return String(x);
    if (x < 0) {
      s = '-';
      x = -x;
    }
    if (x > 1e-21) {
      e = log(x * pow(2, 69, 1)) - 69;
      z = e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1);
      z *= 0x10000000000000;
      e = 52 - e;
      if (e > 0) {
        multiply(0, z);
        j = f;
        while (j >= 7) {
          multiply(1e7, 0);
          j -= 7;
        }
        multiply(pow(10, j, 1), 0);
        j = e - 1;
        while (j >= 23) {
          divide(1 << 23);
          j -= 23;
        }
        divide(1 << j);
        multiply(1, 1);
        divide(2);
        m = numToString();
      } else {
        multiply(0, z);
        multiply(1 << -e, 0);
        m = numToString() + repeat.call(ZERO, f);
      }
    }
    if (f > 0) {
      k = m.length;
      m = s + (k <= f ? '0.' + repeat.call(ZERO, f - k) + m : m.slice(0, k - f) + '.' + m.slice(k - f));
    } else {
      m = s + m;
    } return m;
  }
});

},{"./_a-number-value":63,"./_export":91,"./_fails":93,"./_string-repeat":162,"./_to-integer":168}],241:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $fails = require('./_fails');
var aNumberValue = require('./_a-number-value');
var $toPrecision = 1.0.toPrecision;

$export($export.P + $export.F * ($fails(function () {
  // IE7-
  return $toPrecision.call(1, undefined) !== '1';
}) || !$fails(function () {
  // V8 ~ Android 4.3-
  $toPrecision.call({});
})), 'Number', {
  toPrecision: function toPrecision(precision) {
    var that = aNumberValue(this, 'Number#toPrecision: incorrect invocation!');
    return precision === undefined ? $toPrecision.call(that) : $toPrecision.call(that, precision);
  }
});

},{"./_a-number-value":63,"./_export":91,"./_fails":93}],242:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":91,"./_object-assign":126}],243:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":91,"./_object-create":127}],244:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperties: require('./_object-dps') });

},{"./_descriptors":87,"./_export":91,"./_object-dps":129}],245:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":87,"./_export":91,"./_object-dp":128}],246:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});

},{"./_is-object":110,"./_meta":123,"./_object-sap":138}],247:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject');
var $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_object-gopd":130,"./_object-sap":138,"./_to-iobject":169}],248:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./_object-sap')('getOwnPropertyNames', function () {
  return require('./_object-gopn-ext').f;
});

},{"./_object-gopn-ext":131,"./_object-sap":138}],249:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":134,"./_object-sap":138,"./_to-object":171}],250:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./_is-object');

require('./_object-sap')('isExtensible', function ($isExtensible) {
  return function isExtensible(it) {
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});

},{"./_is-object":110,"./_object-sap":138}],251:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./_is-object');

require('./_object-sap')('isFrozen', function ($isFrozen) {
  return function isFrozen(it) {
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});

},{"./_is-object":110,"./_object-sap":138}],252:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./_is-object');

require('./_object-sap')('isSealed', function ($isSealed) {
  return function isSealed(it) {
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});

},{"./_is-object":110,"./_object-sap":138}],253:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./_export');
$export($export.S, 'Object', { is: require('./_same-value') });

},{"./_export":91,"./_same-value":150}],254:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":136,"./_object-sap":138,"./_to-object":171}],255:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('preventExtensions', function ($preventExtensions) {
  return function preventExtensions(it) {
    return $preventExtensions && isObject(it) ? $preventExtensions(meta(it)) : it;
  };
});

},{"./_is-object":110,"./_meta":123,"./_object-sap":138}],256:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./_is-object');
var meta = require('./_meta').onFreeze;

require('./_object-sap')('seal', function ($seal) {
  return function seal(it) {
    return $seal && isObject(it) ? $seal(meta(it)) : it;
  };
});

},{"./_is-object":110,"./_meta":123,"./_object-sap":138}],257:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":91,"./_set-proto":151}],258:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof');
var test = {};
test[require('./_wks')('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  require('./_redefine')(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

},{"./_classof":76,"./_redefine":147,"./_wks":181}],259:[function(require,module,exports){
var $export = require('./_export');
var $parseFloat = require('./_parse-float');
// 18.2.4 parseFloat(string)
$export($export.G + $export.F * (parseFloat != $parseFloat), { parseFloat: $parseFloat });

},{"./_export":91,"./_parse-float":141}],260:[function(require,module,exports){
var $export = require('./_export');
var $parseInt = require('./_parse-int');
// 18.2.5 parseInt(string, radix)
$export($export.G + $export.F * (parseInt != $parseInt), { parseInt: $parseInt });

},{"./_export":91,"./_parse-int":142}],261:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var userAgent = require('./_user-agent');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":62,"./_an-instance":66,"./_classof":76,"./_core":81,"./_ctx":83,"./_export":91,"./_for-of":97,"./_global":99,"./_is-object":110,"./_iter-detect":115,"./_library":118,"./_microtask":124,"./_new-promise-capability":125,"./_perform":143,"./_promise-resolve":144,"./_redefine-all":146,"./_set-species":152,"./_set-to-string-tag":153,"./_species-constructor":156,"./_task":165,"./_user-agent":177,"./_wks":181}],262:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./_export');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var rApply = (require('./_global').Reflect || {}).apply;
var fApply = Function.apply;
// MS Edge argumentsList argument is optional
$export($export.S + $export.F * !require('./_fails')(function () {
  rApply(function () { /* empty */ });
}), 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList) {
    var T = aFunction(target);
    var L = anObject(argumentsList);
    return rApply ? rApply(T, thisArgument, L) : fApply.call(T, thisArgument, L);
  }
});

},{"./_a-function":62,"./_an-object":67,"./_export":91,"./_fails":93,"./_global":99}],263:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $export = require('./_export');
var create = require('./_object-create');
var aFunction = require('./_a-function');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var fails = require('./_fails');
var bind = require('./_bind');
var rConstruct = (require('./_global').Reflect || {}).construct;

// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(rConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  rConstruct(function () { /* empty */ });
});

$export($export.S + $export.F * (NEW_TARGET_BUG || ARGS_BUG), 'Reflect', {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return rConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = create(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

},{"./_a-function":62,"./_an-object":67,"./_bind":75,"./_export":91,"./_fails":93,"./_global":99,"./_is-object":110,"./_object-create":127}],264:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = require('./_object-dp');
var $export = require('./_export');
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":67,"./_export":91,"./_fails":93,"./_object-dp":128,"./_to-primitive":172}],265:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export = require('./_export');
var gOPD = require('./_object-gopd').f;
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var desc = gOPD(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});

},{"./_an-object":67,"./_export":91,"./_object-gopd":130}],266:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var Enumerate = function (iterated) {
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = [];      // keys
  var key;
  for (key in iterated) keys.push(key);
};
require('./_iter-create')(Enumerate, 'Object', function () {
  var that = this;
  var keys = that._k;
  var key;
  do {
    if (that._i >= keys.length) return { value: undefined, done: true };
  } while (!((key = keys[that._i++]) in that._t));
  return { value: key, done: false };
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target) {
    return new Enumerate(target);
  }
});

},{"./_an-object":67,"./_export":91,"./_iter-create":113}],267:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var gOPD = require('./_object-gopd');
var $export = require('./_export');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey) {
    return gOPD.f(anObject(target), propertyKey);
  }
});

},{"./_an-object":67,"./_export":91,"./_object-gopd":130}],268:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export = require('./_export');
var getProto = require('./_object-gpo');
var anObject = require('./_an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target) {
    return getProto(anObject(target));
  }
});

},{"./_an-object":67,"./_export":91,"./_object-gpo":134}],269:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var isObject = require('./_is-object');
var anObject = require('./_an-object');

function get(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var desc, proto;
  if (anObject(target) === receiver) return target[propertyKey];
  if (desc = gOPD.f(target, propertyKey)) return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if (isObject(proto = getPrototypeOf(target))) return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', { get: get });

},{"./_an-object":67,"./_export":91,"./_has":100,"./_is-object":110,"./_object-gopd":130,"./_object-gpo":134}],270:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./_export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey) {
    return propertyKey in target;
  }
});

},{"./_export":91}],271:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target) {
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});

},{"./_an-object":67,"./_export":91}],272:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./_export');

$export($export.S, 'Reflect', { ownKeys: require('./_own-keys') });

},{"./_export":91,"./_own-keys":140}],273:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export = require('./_export');
var anObject = require('./_an-object');
var $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target) {
    anObject(target);
    try {
      if ($preventExtensions) $preventExtensions(target);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":67,"./_export":91}],274:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export = require('./_export');
var setProto = require('./_set-proto');

if (setProto) $export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto) {
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_export":91,"./_set-proto":151}],275:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var dP = require('./_object-dp');
var gOPD = require('./_object-gopd');
var getPrototypeOf = require('./_object-gpo');
var has = require('./_has');
var $export = require('./_export');
var createDesc = require('./_property-desc');
var anObject = require('./_an-object');
var isObject = require('./_is-object');

function set(target, propertyKey, V /* , receiver */) {
  var receiver = arguments.length < 4 ? target : arguments[3];
  var ownDesc = gOPD.f(anObject(target), propertyKey);
  var existingDescriptor, proto;
  if (!ownDesc) {
    if (isObject(proto = getPrototypeOf(target))) {
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if (has(ownDesc, 'value')) {
    if (ownDesc.writable === false || !isObject(receiver)) return false;
    if (existingDescriptor = gOPD.f(receiver, propertyKey)) {
      if (existingDescriptor.get || existingDescriptor.set || existingDescriptor.writable === false) return false;
      existingDescriptor.value = V;
      dP.f(receiver, propertyKey, existingDescriptor);
    } else dP.f(receiver, propertyKey, createDesc(0, V));
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', { set: set });

},{"./_an-object":67,"./_export":91,"./_has":100,"./_is-object":110,"./_object-dp":128,"./_object-gopd":130,"./_object-gpo":134,"./_property-desc":145}],276:[function(require,module,exports){
var global = require('./_global');
var inheritIfRequired = require('./_inherit-if-required');
var dP = require('./_object-dp').f;
var gOPN = require('./_object-gopn').f;
var isRegExp = require('./_is-regexp');
var $flags = require('./_flags');
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (require('./_descriptors') && (!CORRECT_NEW || require('./_fails')(function () {
  re2[require('./_wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./_redefine')(global, 'RegExp', $RegExp);
}

require('./_set-species')('RegExp');

},{"./_descriptors":87,"./_fails":93,"./_flags":95,"./_global":99,"./_inherit-if-required":104,"./_is-regexp":111,"./_object-dp":128,"./_object-gopn":132,"./_redefine":147,"./_set-species":152,"./_wks":181}],277:[function(require,module,exports){
'use strict';
var regexpExec = require('./_regexp-exec');
require('./_export')({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});

},{"./_export":91,"./_regexp-exec":149}],278:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":87,"./_flags":95,"./_object-dp":128}],279:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object');
var toLength = require('./_to-length');
var advanceStringIndex = require('./_advance-string-index');
var regExpExec = require('./_regexp-exec-abstract');

// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

},{"./_advance-string-index":65,"./_an-object":67,"./_fix-re-wks":94,"./_regexp-exec-abstract":148,"./_to-length":170}],280:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var toInteger = require('./_to-integer');
var advanceStringIndex = require('./_advance-string-index');
var regExpExec = require('./_regexp-exec-abstract');
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

},{"./_advance-string-index":65,"./_an-object":67,"./_fix-re-wks":94,"./_regexp-exec-abstract":148,"./_to-integer":168,"./_to-length":170,"./_to-object":171}],281:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object');
var sameValue = require('./_same-value');
var regExpExec = require('./_regexp-exec-abstract');

// @@search logic
require('./_fix-re-wks')('search', 1, function (defined, SEARCH, $search, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[SEARCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative($search, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});

},{"./_an-object":67,"./_fix-re-wks":94,"./_regexp-exec-abstract":148,"./_same-value":150}],282:[function(require,module,exports){
'use strict';

var isRegExp = require('./_is-regexp');
var anObject = require('./_an-object');
var speciesConstructor = require('./_species-constructor');
var advanceStringIndex = require('./_advance-string-index');
var toLength = require('./_to-length');
var callRegExpExec = require('./_regexp-exec-abstract');
var regexpExec = require('./_regexp-exec');
var fails = require('./_fails');
var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';
var MAX_UINT32 = 0xffffffff;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { RegExp(MAX_UINT32, 'y'); });

// @@split logic
require('./_fix-re-wks')('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});

},{"./_advance-string-index":65,"./_an-object":67,"./_fails":93,"./_fix-re-wks":94,"./_is-regexp":111,"./_regexp-exec":149,"./_regexp-exec-abstract":148,"./_species-constructor":156,"./_to-length":170}],283:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject = require('./_an-object');
var $flags = require('./_flags');
var DESCRIPTORS = require('./_descriptors');
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (require('./_fails')(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

},{"./_an-object":67,"./_descriptors":87,"./_fails":93,"./_flags":95,"./_redefine":147,"./es6.regexp.flags":278}],284:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":80,"./_collection-strong":78,"./_validate-collection":178}],285:[function(require,module,exports){
'use strict';
// B.2.3.2 String.prototype.anchor(name)
require('./_string-html')('anchor', function (createHTML) {
  return function anchor(name) {
    return createHTML(this, 'a', 'name', name);
  };
});

},{"./_string-html":160}],286:[function(require,module,exports){
'use strict';
// B.2.3.3 String.prototype.big()
require('./_string-html')('big', function (createHTML) {
  return function big() {
    return createHTML(this, 'big', '', '');
  };
});

},{"./_string-html":160}],287:[function(require,module,exports){
'use strict';
// B.2.3.4 String.prototype.blink()
require('./_string-html')('blink', function (createHTML) {
  return function blink() {
    return createHTML(this, 'blink', '', '');
  };
});

},{"./_string-html":160}],288:[function(require,module,exports){
'use strict';
// B.2.3.5 String.prototype.bold()
require('./_string-html')('bold', function (createHTML) {
  return function bold() {
    return createHTML(this, 'b', '', '');
  };
});

},{"./_string-html":160}],289:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $at = require('./_string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos) {
    return $at(this, pos);
  }
});

},{"./_export":91,"./_string-at":158}],290:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var ENDS_WITH = 'endsWith';
var $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /* , endPosition = @length */) {
    var that = context(this, searchString, ENDS_WITH);
    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
    var len = toLength(that.length);
    var end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    var search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});

},{"./_export":91,"./_fails-is-regexp":92,"./_string-context":159,"./_to-length":170}],291:[function(require,module,exports){
'use strict';
// B.2.3.6 String.prototype.fixed()
require('./_string-html')('fixed', function (createHTML) {
  return function fixed() {
    return createHTML(this, 'tt', '', '');
  };
});

},{"./_string-html":160}],292:[function(require,module,exports){
'use strict';
// B.2.3.7 String.prototype.fontcolor(color)
require('./_string-html')('fontcolor', function (createHTML) {
  return function fontcolor(color) {
    return createHTML(this, 'font', 'color', color);
  };
});

},{"./_string-html":160}],293:[function(require,module,exports){
'use strict';
// B.2.3.8 String.prototype.fontsize(size)
require('./_string-html')('fontsize', function (createHTML) {
  return function fontsize(size) {
    return createHTML(this, 'font', 'size', size);
  };
});

},{"./_string-html":160}],294:[function(require,module,exports){
var $export = require('./_export');
var toAbsoluteIndex = require('./_to-absolute-index');
var fromCharCode = String.fromCharCode;
var $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x) { // eslint-disable-line no-unused-vars
    var res = [];
    var aLen = arguments.length;
    var i = 0;
    var code;
    while (aLen > i) {
      code = +arguments[i++];
      if (toAbsoluteIndex(code, 0x10ffff) !== code) throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});

},{"./_export":91,"./_to-absolute-index":166}],295:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export = require('./_export');
var context = require('./_string-context');
var INCLUDES = 'includes';

$export($export.P + $export.F * require('./_fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"./_export":91,"./_fails-is-regexp":92,"./_string-context":159}],296:[function(require,module,exports){
'use strict';
// B.2.3.9 String.prototype.italics()
require('./_string-html')('italics', function (createHTML) {
  return function italics() {
    return createHTML(this, 'i', '', '');
  };
});

},{"./_string-html":160}],297:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":114,"./_string-at":158}],298:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

},{"./_string-html":160}],299:[function(require,module,exports){
var $export = require('./_export');
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite) {
    var tpl = toIObject(callSite.raw);
    var len = toLength(tpl.length);
    var aLen = arguments.length;
    var res = [];
    var i = 0;
    while (len > i) {
      res.push(String(tpl[i++]));
      if (i < aLen) res.push(String(arguments[i]));
    } return res.join('');
  }
});

},{"./_export":91,"./_to-iobject":169,"./_to-length":170}],300:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});

},{"./_export":91,"./_string-repeat":162}],301:[function(require,module,exports){
'use strict';
// B.2.3.11 String.prototype.small()
require('./_string-html')('small', function (createHTML) {
  return function small() {
    return createHTML(this, 'small', '', '');
  };
});

},{"./_string-html":160}],302:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"./_export":91,"./_fails-is-regexp":92,"./_string-context":159,"./_to-length":170}],303:[function(require,module,exports){
'use strict';
// B.2.3.12 String.prototype.strike()
require('./_string-html')('strike', function (createHTML) {
  return function strike() {
    return createHTML(this, 'strike', '', '');
  };
});

},{"./_string-html":160}],304:[function(require,module,exports){
'use strict';
// B.2.3.13 String.prototype.sub()
require('./_string-html')('sub', function (createHTML) {
  return function sub() {
    return createHTML(this, 'sub', '', '');
  };
});

},{"./_string-html":160}],305:[function(require,module,exports){
'use strict';
// B.2.3.14 String.prototype.sup()
require('./_string-html')('sup', function (createHTML) {
  return function sup() {
    return createHTML(this, 'sup', '', '');
  };
});

},{"./_string-html":160}],306:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./_string-trim')('trim', function ($trim) {
  return function trim() {
    return $trim(this, 3);
  };
});

},{"./_string-trim":163}],307:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":67,"./_descriptors":87,"./_enum-keys":90,"./_export":91,"./_fails":93,"./_global":99,"./_has":100,"./_hide":101,"./_is-array":108,"./_is-object":110,"./_library":118,"./_meta":123,"./_object-create":127,"./_object-dp":128,"./_object-gopd":130,"./_object-gopn":132,"./_object-gopn-ext":131,"./_object-gops":133,"./_object-keys":136,"./_object-pie":137,"./_property-desc":145,"./_redefine":147,"./_set-to-string-tag":153,"./_shared":155,"./_to-iobject":169,"./_to-primitive":172,"./_uid":176,"./_wks":181,"./_wks-define":179,"./_wks-ext":180}],308:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $typed = require('./_typed');
var buffer = require('./_typed-buffer');
var anObject = require('./_an-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
var isObject = require('./_is-object');
var ArrayBuffer = require('./_global').ArrayBuffer;
var speciesConstructor = require('./_species-constructor');
var $ArrayBuffer = buffer.ArrayBuffer;
var $DataView = buffer.DataView;
var $isView = $typed.ABV && ArrayBuffer.isView;
var $slice = $ArrayBuffer.prototype.slice;
var VIEW = $typed.VIEW;
var ARRAY_BUFFER = 'ArrayBuffer';

$export($export.G + $export.W + $export.F * (ArrayBuffer !== $ArrayBuffer), { ArrayBuffer: $ArrayBuffer });

$export($export.S + $export.F * !$typed.CONSTR, ARRAY_BUFFER, {
  // 24.1.3.1 ArrayBuffer.isView(arg)
  isView: function isView(it) {
    return $isView && $isView(it) || isObject(it) && VIEW in it;
  }
});

$export($export.P + $export.U + $export.F * require('./_fails')(function () {
  return !new $ArrayBuffer(2).slice(1, undefined).byteLength;
}), ARRAY_BUFFER, {
  // 24.1.4.3 ArrayBuffer.prototype.slice(start, end)
  slice: function slice(start, end) {
    if ($slice !== undefined && end === undefined) return $slice.call(anObject(this), start); // FF fix
    var len = anObject(this).byteLength;
    var first = toAbsoluteIndex(start, len);
    var fin = toAbsoluteIndex(end === undefined ? len : end, len);
    var result = new (speciesConstructor(this, $ArrayBuffer))(toLength(fin - first));
    var viewS = new $DataView(this);
    var viewT = new $DataView(result);
    var index = 0;
    while (first < fin) {
      viewT.setUint8(index++, viewS.getUint8(first++));
    } return result;
  }
});

require('./_set-species')(ARRAY_BUFFER);

},{"./_an-object":67,"./_export":91,"./_fails":93,"./_global":99,"./_is-object":110,"./_set-species":152,"./_species-constructor":156,"./_to-absolute-index":166,"./_to-length":170,"./_typed":175,"./_typed-buffer":174}],309:[function(require,module,exports){
var $export = require('./_export');
$export($export.G + $export.W + $export.F * !require('./_typed').ABV, {
  DataView: require('./_typed-buffer').DataView
});

},{"./_export":91,"./_typed":175,"./_typed-buffer":174}],310:[function(require,module,exports){
require('./_typed-array')('Float32', 4, function (init) {
  return function Float32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":173}],311:[function(require,module,exports){
require('./_typed-array')('Float64', 8, function (init) {
  return function Float64Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":173}],312:[function(require,module,exports){
require('./_typed-array')('Int16', 2, function (init) {
  return function Int16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":173}],313:[function(require,module,exports){
require('./_typed-array')('Int32', 4, function (init) {
  return function Int32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":173}],314:[function(require,module,exports){
require('./_typed-array')('Int8', 1, function (init) {
  return function Int8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":173}],315:[function(require,module,exports){
require('./_typed-array')('Uint16', 2, function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":173}],316:[function(require,module,exports){
require('./_typed-array')('Uint32', 4, function (init) {
  return function Uint32Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":173}],317:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

},{"./_typed-array":173}],318:[function(require,module,exports){
require('./_typed-array')('Uint8', 1, function (init) {
  return function Uint8ClampedArray(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
}, true);

},{"./_typed-array":173}],319:[function(require,module,exports){
'use strict';
var global = require('./_global');
var each = require('./_array-methods')(0);
var redefine = require('./_redefine');
var meta = require('./_meta');
var assign = require('./_object-assign');
var weak = require('./_collection-weak');
var isObject = require('./_is-object');
var validate = require('./_validate-collection');
var NATIVE_WEAK_MAP = require('./_validate-collection');
var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;
var WEAK_MAP = 'WeakMap';
var getWeak = meta.getWeak;
var isExtensible = Object.isExtensible;
var uncaughtFrozenStore = weak.ufstore;
var InternalMap;

var wrapper = function (get) {
  return function WeakMap() {
    return get(this, arguments.length > 0 ? arguments[0] : undefined);
  };
};

var methods = {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key) {
    if (isObject(key)) {
      var data = getWeak(key);
      if (data === true) return uncaughtFrozenStore(validate(this, WEAK_MAP)).get(key);
      return data ? data[this._i] : undefined;
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value) {
    return weak.def(validate(this, WEAK_MAP), key, value);
  }
};

// 23.3 WeakMap Objects
var $WeakMap = module.exports = require('./_collection')(WEAK_MAP, wrapper, methods, weak, true, true);

// IE11 WeakMap frozen keys fix
if (NATIVE_WEAK_MAP && IS_IE11) {
  InternalMap = weak.getConstructor(wrapper, WEAK_MAP);
  assign(InternalMap.prototype, methods);
  meta.NEED = true;
  each(['delete', 'has', 'get', 'set'], function (key) {
    var proto = $WeakMap.prototype;
    var method = proto[key];
    redefine(proto, key, function (a, b) {
      // store frozen objects on internal weakmap shim
      if (isObject(a) && !isExtensible(a)) {
        if (!this._f) this._f = new InternalMap();
        var result = this._f[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}

},{"./_array-methods":71,"./_collection":80,"./_collection-weak":79,"./_global":99,"./_is-object":110,"./_meta":123,"./_object-assign":126,"./_redefine":147,"./_validate-collection":178}],320:[function(require,module,exports){
'use strict';
var weak = require('./_collection-weak');
var validate = require('./_validate-collection');
var WEAK_SET = 'WeakSet';

// 23.4 WeakSet Objects
require('./_collection')(WEAK_SET, function (get) {
  return function WeakSet() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value) {
    return weak.def(validate(this, WEAK_SET), value, true);
  }
}, weak, false, true);

},{"./_collection":80,"./_collection-weak":79,"./_validate-collection":178}],321:[function(require,module,exports){
'use strict';
// https://tc39.github.io/proposal-flatMap/#sec-Array.prototype.flatMap
var $export = require('./_export');
var flattenIntoArray = require('./_flatten-into-array');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var aFunction = require('./_a-function');
var arraySpeciesCreate = require('./_array-species-create');

$export($export.P, 'Array', {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen, A;
    aFunction(callbackfn);
    sourceLen = toLength(O.length);
    A = arraySpeciesCreate(O, 0);
    flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments[1]);
    return A;
  }
});

require('./_add-to-unscopables')('flatMap');

},{"./_a-function":62,"./_add-to-unscopables":64,"./_array-species-create":74,"./_export":91,"./_flatten-into-array":96,"./_to-length":170,"./_to-object":171}],322:[function(require,module,exports){
'use strict';
// https://github.com/tc39/Array.prototype.includes
var $export = require('./_export');
var $includes = require('./_array-includes')(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./_add-to-unscopables')('includes');

},{"./_add-to-unscopables":64,"./_array-includes":70,"./_export":91}],323:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":91,"./_object-to-array":139}],324:[function(require,module,exports){
// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = require('./_export');
var ownKeys = require('./_own-keys');
var toIObject = require('./_to-iobject');
var gOPD = require('./_object-gopd');
var createProperty = require('./_create-property');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});

},{"./_create-property":82,"./_export":91,"./_object-gopd":130,"./_own-keys":140,"./_to-iobject":169}],325:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":91,"./_object-to-array":139}],326:[function(require,module,exports){
// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = require('./_export');
var core = require('./_core');
var global = require('./_global');
var speciesConstructor = require('./_species-constructor');
var promiseResolve = require('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_core":81,"./_export":91,"./_global":99,"./_promise-resolve":144,"./_species-constructor":156}],327:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');

// https://github.com/zloirock/core-js/issues/280
var WEBKIT_BUG = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);

$export($export.P + $export.F * WEBKIT_BUG, 'String', {
  padEnd: function padEnd(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});

},{"./_export":91,"./_string-pad":161,"./_user-agent":177}],328:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-string-pad-start-end
var $export = require('./_export');
var $pad = require('./_string-pad');
var userAgent = require('./_user-agent');

// https://github.com/zloirock/core-js/issues/280
var WEBKIT_BUG = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(userAgent);

$export($export.P + $export.F * WEBKIT_BUG, 'String', {
  padStart: function padStart(maxLength /* , fillString = ' ' */) {
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});

},{"./_export":91,"./_string-pad":161,"./_user-agent":177}],329:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimLeft', function ($trim) {
  return function trimLeft() {
    return $trim(this, 1);
  };
}, 'trimStart');

},{"./_string-trim":163}],330:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./_string-trim')('trimRight', function ($trim) {
  return function trimRight() {
    return $trim(this, 2);
  };
}, 'trimEnd');

},{"./_string-trim":163}],331:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":179}],332:[function(require,module,exports){
var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":99,"./_hide":101,"./_iterators":117,"./_object-keys":136,"./_redefine":147,"./_wks":181,"./es6.array.iterator":193}],333:[function(require,module,exports){
var $export = require('./_export');
var $task = require('./_task');
$export($export.G + $export.B, {
  setImmediate: $task.set,
  clearImmediate: $task.clear
});

},{"./_export":91,"./_task":165}],334:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global = require('./_global');
var $export = require('./_export');
var userAgent = require('./_user-agent');
var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check
var wrap = function (set) {
  return function (fn, time /* , ...args */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : false;
    return set(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(this, args);
    } : fn, time);
  };
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout: wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});

},{"./_export":91,"./_global":99,"./_user-agent":177}],335:[function(require,module,exports){
require('../modules/web.timers');
require('../modules/web.immediate');
require('../modules/web.dom.iterable');
module.exports = require('../modules/_core');

},{"../modules/_core":81,"../modules/web.dom.iterable":332,"../modules/web.immediate":333,"../modules/web.timers":334}],336:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],337:[function(require,module,exports){
(function (global){
//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.9.1';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  var restArguments = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var has = function(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function(func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define == 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}());

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],338:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alert = alert;
exports.confirm = confirm;
exports.showLoader = showLoader;
exports.hideLoader = hideLoader;
exports.showUnobtrusiveLoader = showUnobtrusiveLoader;
exports.hideUnobtrusiveLoader = hideUnobtrusiveLoader;
exports.toast = toast;

var aj = _interopRequireWildcard(require("./aj"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var loaderCounter = 0;
var unobstrusiveLoaderCounter = 0;

function alert(title, message, type) {
  return aj.exec("Alert", "alert", {
    title: title,
    message: message,
    type: type
  }, function () {}).then(function () {})["catch"](function () {});
}

function confirm() {
  return new Promise(function (resolve, reject) {
    var callback = function callback(confirmed) {
      if (confirmed) {
        resolve();
      } else {
        reject();
      }
    };

    aj.exec("Alert", "confirm", {}, callback).then(function () {})["catch"](function () {
      return reject();
    });
  });
}

function showLoader() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

  if (loaderCounter <= 0) {
    aj.exec("Loader", "show", {
      message: message
    }, function () {}).then(function () {})["catch"](function () {});
  }

  loaderCounter++;
}

function hideLoader() {
  loaderCounter--;

  if (loaderCounter <= 0) {
    aj.exec("Loader", "hide", {}, function () {}).then(function () {})["catch"](function () {});
  }
}

function showUnobtrusiveLoader() {
  var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

  if (unobstrusiveLoaderCounter <= 0) {
    aj.exec("Loader", "showUnobtrusive", {
      message: message
    }, function () {}).then(function () {})["catch"](function () {});
  }

  unobstrusiveLoaderCounter++;
}

function hideUnobtrusiveLoader() {
  unobstrusiveLoaderCounter--;

  if (unobstrusiveLoaderCounter <= 0) {
    aj.exec("Loader", "hideUnobtrusive", {}, function () {}).then(function () {})["catch"](function () {});
  }
}

function toast(message) {
  aj.exec("Toast", "show", {
    message: message
  }, function () {}).then(function () {})["catch"](function () {});
}

},{"./aj":12}],339:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AccountStore = void 0;

var aj = _interopRequireWildcard(require("../aj/index"));

var _ajex = require("../utils/ajex");

var actions = _interopRequireWildcard(require("../actions/types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _types2 = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var AccountStore = aj.createStore(_types2.ACCOUNT, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    activationCode: ""
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case actions.REGISTER:
      return _underscore["default"].assign(state, {
        registered: false,
        error: false
      });

    case (0, _ajex.completed)(actions.REGISTER):
      return _underscore["default"].assign(state, {
        registered: true,
        error: false,
        name: action.name,
        mail: action.mail,
        message: action.message
      });

    case (0, _ajex.failed)(actions.REGISTER):
      return _underscore["default"].assign(state, {
        registered: false,
        error: true,
        message: action.message
      });

    case actions.SET_ACTIVATION_CODE:
      return _underscore["default"].assign(state, {
        activationCode: action.activationCode
      });

    case actions.CONFIRM_ACCOUNT:
      return _underscore["default"].assign(state, {
        confirmed: false,
        error: false
      });

    case (0, _ajex.completed)(actions.CONFIRM_ACCOUNT):
      return _underscore["default"].assign(state, {
        confirmed: true,
        error: false
      });

    case (0, _ajex.failed)(actions.CONFIRM_ACCOUNT):
      return _underscore["default"].assign(state, {
        confirmed: false,
        error: true,
        message: action.message
      });

    case actions.RECOVER_ACCOUNT:
      return _underscore["default"].assign(state, {
        recovered: false,
        error: false
      });

    case (0, _ajex.completed)(actions.RECOVER_ACCOUNT):
      return _underscore["default"].assign(state, {
        recovered: true,
        error: false
      });

    case (0, _ajex.failed)(actions.RECOVER_ACCOUNT):
      return _underscore["default"].assign(state, {
        recovered: false,
        error: true
      });
  }
});
exports.AccountStore = AccountStore;

},{"../actions/types":6,"../aj/index":12,"../utils/ajex":348,"./types":345,"underscore":337}],340:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiValueSettingsStore = exports.SelectStore = exports.LookupStore = exports.EntitiesStore = exports.GridsStore = void 0;

var aj = _interopRequireWildcard(require("../aj/index"));

var _ajex = require("../utils/ajex");

var actions = _interopRequireWildcard(require("../actions/types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _types2 = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var GridsStore = aj.createStore(_types2.GRIDS, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    grid: null
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case actions.GET_GRID:
      return _underscore["default"].assign(state, {
        error: false,
        grid: null
      });

    case (0, _ajex.completed)(actions.GET_GRID):
      return _underscore["default"].assign(state, {
        error: false,
        grid: action.grid
      });

    case (0, _ajex.failed)(actions.GET_GRID):
      return _underscore["default"].assign(state, {
        error: true,
        grid: null
      });
  }
});
exports.GridsStore = GridsStore;
var EntitiesStore = aj.createStore(_types2.ENTITIES, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case (0, _ajex.completed)(actions.LOAD_ENTITIES):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        result: action.result
      });

    case (0, _ajex.failed)(actions.LOAD_ENTITIES):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: true,
        result: null
      });

    case (0, _ajex.completed)(actions.DELETE_ENTITIES):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        result: action.result
      });

    case (0, _ajex.failed)(actions.DELETE_ENTITIES):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: true,
        result: null
      });

    case actions.NEW_ENTITY:
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        data: {},
        saved: false
      });

    case actions.GET_ENTITY:
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        data: null,
        saved: false
      });

    case (0, _ajex.completed)(actions.GET_ENTITY):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        data: action.data
      });

    case (0, _ajex.completed)(actions.CHECK_REVISION_ENABLE_STATUS):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        revisionEnabled: action.revisionEnabled
      });

    case (0, _ajex.failed)(actions.CHECK_REVISION_ENABLE_STATUS):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        revisionEnabled: false
      });

    case (0, _ajex.failed)(actions.GET_ENTITY):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: true,
        data: null,
        validationError: false,
        validationResult: null
      });

    case actions.FREE_ENTITIES:
      return _underscore["default"].omit(state, action.discriminator);

    case actions.SAVE_ENTITY:
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        getCompleted: false,
        validationError: false,
        validationResult: null,
        saved: false
      });

    case (0, _ajex.completed)(actions.SAVE_ENTITY):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        data: action.data,
        saved: true,
        validationError: false,
        validationResult: null
      });

    case (0, _ajex.failed)(actions.SAVE_ENTITY):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: true,
        data: action.data,
        saved: false,
        validationError: action.validationError,
        validationResult: action.validationResult
      });
  }
});
exports.EntitiesStore = EntitiesStore;
var LookupStore = aj.createStore(_types2.LOOKUP, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case (0, _ajex.completed)(actions.GET_LOOKUP_RESULT):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        result: action.result
      });

    case (0, _ajex.failed)(actions.GET_LOOKUP_RESULT):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: true,
        result: null
      });

    case (0, _ajex.completed)(actions.GET_LOOKUP_VALUES):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        values: action.values
      });

    case (0, _ajex.failed)(actions.GET_LOOKUP_VALUES):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: true,
        values: null
      });

    case actions.FREE_LOOKUP:
      return _underscore["default"].omit(state, action.discriminator);
  }
});
exports.LookupStore = LookupStore;
var SelectStore = aj.createStore(_types2.SELECT, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case actions.GET_SELECT_VALUES:
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        loading: true
      });

    case (0, _ajex.completed)(actions.GET_SELECT_VALUES):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        loading: false,
        values: action.values
      });

    case (0, _ajex.failed)(actions.GET_SELECT_VALUES):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: true,
        loading: false,
        values: null
      });

    case actions.GET_SELECT_ENTITIES:
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        loading: true
      });

    case (0, _ajex.completed)(actions.GET_SELECT_ENTITIES):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: false,
        loading: false,
        values: action.entities
      });

    case (0, _ajex.failed)(actions.GET_SELECT_ENTITIES):
      return (0, _ajex.discriminate)(state, action.discriminator, {
        error: true,
        loading: false,
        values: null
      });

    case actions.FREE_SELECT:
      return _underscore["default"].omit(state, action.discriminator);
  }
});
exports.SelectStore = SelectStore;
var MultiValueSettingsStore = aj.createStore(_types2.MULTIVALUE_SETTINGS, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var list = [];

  switch (action.type) {
    case actions.SET_MULTIVALUE_SETTINGS:
      debugger;
      return (0, _ajex.discriminate)(state, action.discriminator, {
        items: action.items
      });

    case actions.UPDATE_MULTIVALUE_SETTINGS:
      list = updatedList(discriminated(state, action.discriminator).items, function (r) {
        return r.itemType === action.itemType;
      }, function (r) {
        return _underscore["default"].assign({}, r, {
          enabled: action.enabled
        });
      }, true);
      return (0, _ajex.discriminate)(state, action.discriminator, {
        items: list
      });

    case actions.FREE_SETTINGS_VALUES:
      return _underscore["default"].omit(state, action.discriminator);
  }
});
exports.MultiValueSettingsStore = MultiValueSettingsStore;

},{"../actions/types":6,"../aj/index":12,"../utils/ajex":348,"./types":345,"underscore":337}],341:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MenuStore = void 0;

var aj = _interopRequireWildcard(require("../aj/index"));

var actions = _interopRequireWildcard(require("../actions/types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _lang = require("../utils/lang");

var _types2 = require("./types");

var _session = require("../api/session");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var MenuStore = aj.createStore(_types2.MENU, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case actions.SETUP_MENU:
      var menu = JSON.parse(JSON.stringify(action.menu)); //Clear childrens menu if user hasn't permission

      _underscore["default"].each(menu, function (m) {
        m.children = _underscore["default"].filter(m.children, function (c) {
          return _underscore["default"].isEmpty(c.permissions) || (0, _session.hasPermission)(c.permissions);
        });
      }); //Clear item menu if are empty


      return _underscore["default"].assign(state, {
        menu: _underscore["default"].filter(menu, function (m) {
          return !_underscore["default"].isEmpty(m.children) && m.href === undefined || _underscore["default"].isEmpty(m.children) && m.href !== undefined && (0, _session.hasPermission)(m.permissions);
        })
      });

    case actions.SET_ACTIVE_MENU_ITEM:
      return _underscore["default"].assign(state, {
        menu: (0, _lang.walk)(state.menu, "children", function (i) {
          i.active = i == action.item;
        })
      });

    case actions.EXPAND_MENU_ITEM:
      return _underscore["default"].assign(state, {
        menu: (0, _lang.walk)(state.menu, "children", function (i) {
          if (i == action.item) {
            i.expanded = !(action.item.expanded || false);
          }
        })
      });
  }
});
exports.MenuStore = MenuStore;

},{"../actions/types":6,"../aj/index":12,"../api/session":20,"../utils/lang":350,"./types":345,"underscore":337}],342:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passwordRecoveryDefaultState = passwordRecoveryDefaultState;
exports.PasswordRecoveryStore = void 0;

var aj = _interopRequireWildcard(require("../aj/index"));

var _ajex = require("../utils/ajex");

var actions = _interopRequireWildcard(require("../actions/types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _types2 = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function passwordRecoveryDefaultState() {
  return {
    recoveryStep: 1,
    mail: undefined,
    code: undefined
  };
}

var PasswordRecoveryStore = aj.createStore(_types2.PASSWORD_RECOVERY, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : passwordRecoveryDefaultState();
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case (0, _ajex.completed)(actions.REQUEST_RECOVERY_CODE):
      return _underscore["default"].assign(state, {
        error: false,
        mail: action.mail,
        recoveryStep: 2
      });

    case (0, _ajex.failed)(actions.REQUEST_RECOVERY_CODE):
      return _underscore["default"].assign(state, {
        error: true
      });

    case (0, _ajex.completed)(actions.VALIDATE_RECOVERY_CODE):
      return _underscore["default"].assign(state, {
        error: false,
        mail: action.mail,
        code: action.code,
        recoveryStep: 3
      });

    case (0, _ajex.failed)(actions.VALIDATE_RECOVERY_CODE):
      return _underscore["default"].assign(state, {
        error: true
      });

    case (0, _ajex.completed)(actions.RESET_PASSWORD):
      return _underscore["default"].assign(state, {
        error: false,
        recoveryStep: 4
      });

    case (0, _ajex.failed)(actions.RESET_PASSWORD):
      return _underscore["default"].assign(state, {
        error: true
      });
  }
});
exports.PasswordRecoveryStore = PasswordRecoveryStore;

},{"../actions/types":6,"../aj/index":12,"../utils/ajex":348,"./types":345,"underscore":337}],343:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionStore = void 0;

var aj = _interopRequireWildcard(require("../aj/index"));

var _ajex = require("../utils/ajex");

var actions = _interopRequireWildcard(require("../actions/types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _types2 = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var SessionStore = aj.createStore(_types2.SESSION, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case actions.LOGIN:
      return _underscore["default"].assign(state, {
        isLoggedIn: false
      });

    case (0, _ajex.completed)(actions.LOGIN):
      return _underscore["default"].assign(state, {
        isLoggedIn: true,
        user: action.user,
        error: false
      });

    case (0, _ajex.failed)(actions.LOGIN):
      return _underscore["default"].assign(state, {
        isLoggedIn: false,
        error: true
      });

    case actions.RESUME_SESSION:
      return _underscore["default"].assign(state, {
        isLoggedIn: false,
        resumeComplete: false
      });

    case (0, _ajex.completed)(actions.RESUME_SESSION):
      return _underscore["default"].assign(state, {
        isLoggedIn: true,
        user: action.user,
        error: false,
        resumeComplete: true
      });

    case (0, _ajex.failed)(actions.RESUME_SESSION):
      return _underscore["default"].assign(state, {
        isLoggedIn: false,
        error: true,
        resumeComplete: true
      });

    case actions.LOGOUT:
      return _underscore["default"].assign(state, {
        isLoggedIn: false,
        user: null,
        error: false,
        resumeComplete: false
      });

    case actions.CHANGE_PASSWORD:
      return _underscore["default"].assign(state, {
        action: actions.CHANGE_PASSWORD,
        error: null
      });

    case (0, _ajex.completed)(actions.CHANGE_PASSWORD):
      return _underscore["default"].assign(state, {
        action: actions.CHANGE_PASSWORD,
        firstLogin: action.firstLogin,
        user: action.user,
        error: false
      });

    case (0, _ajex.failed)(actions.CHANGE_PASSWORD):
      return _underscore["default"].assign(state, {
        action: actions.CHANGE_PASSWORD,
        error: true
      });
  }
});
exports.SessionStore = SessionStore;

},{"../actions/types":6,"../aj/index":12,"../utils/ajex":348,"./types":345,"underscore":337}],344:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SystemStore = void 0;

var aj = _interopRequireWildcard(require("../aj/index"));

var actions = _interopRequireWildcard(require("../actions/types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _types2 = require("./types");

var _ajex = require("../utils/ajex");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var SystemStore = aj.createStore(_types2.SYSTEM, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case (0, _ajex.completed)(actions.SYSTEM_INFORMATIONS):
      return _underscore["default"].assign(state, {
        apiVersion: action.apiVersion,
        backendVersion: action.backendVersion,
        copyrightInfos: action.copyrightInfos
      });
  }
});
exports.SystemStore = SystemStore;

},{"../actions/types":6,"../aj/index":12,"../utils/ajex":348,"./types":345,"underscore":337}],345:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SYSTEM = exports.MULTIVALUE_SETTINGS = exports.SELECT = exports.MENU = exports.LOOKUP = exports.ENTITIES = exports.GRIDS = exports.ACCOUNT = exports.SESSION = exports.UI = void 0;
var UI = "UI";
exports.UI = UI;
var SESSION = "SESSION";
exports.SESSION = SESSION;
var ACCOUNT = "ACCOUNT";
exports.ACCOUNT = ACCOUNT;
var GRIDS = "GRIDS";
exports.GRIDS = GRIDS;
var ENTITIES = "ENTITIES";
exports.ENTITIES = ENTITIES;
var LOOKUP = "LOOKUP";
exports.LOOKUP = LOOKUP;
var MENU = "MENU";
exports.MENU = MENU;
var SELECT = "SELECT";
exports.SELECT = SELECT;
var MULTIVALUE_SETTINGS = "MULTIVALUE_SETTINGS";
exports.MULTIVALUE_SETTINGS = MULTIVALUE_SETTINGS;
var SYSTEM = "SYSTEM";
exports.SYSTEM = SYSTEM;

},{}],346:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UIStore = void 0;

var aj = _interopRequireWildcard(require("../aj/index"));

var _ajex = require("../utils/ajex");

var actions = _interopRequireWildcard(require("../actions/types"));

var _underscore = _interopRequireDefault(require("underscore"));

var _types2 = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var UIStore = aj.createStore(_types2.UI, function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case actions.GET_USER_COVER_IMAGE:
      return _underscore["default"].assign(state, {
        error: false
      });

    case (0, _ajex.completed)(actions.GET_USER_COVER_IMAGE):
      return _underscore["default"].assign(state, {
        error: false,
        cover: action.data
      });

    case (0, _ajex.failed)(actions.GET_USER_COVER_IMAGE):
      return _underscore["default"].assign(state, {
        error: true
      });

    case actions.GET_USER_PROFILE_IMAGE:
      return _underscore["default"].assign(state, {
        error: false
      });

    case (0, _ajex.completed)(actions.GET_USER_PROFILE_IMAGE):
      return _underscore["default"].assign(state, {
        error: false,
        profileImage: action.data
      });

    case (0, _ajex.failed)(actions.GET_USER_PROFILE_IMAGE):
      return _underscore["default"].assign(state, {
        error: true
      });
  }
});
exports.UIStore = UIStore;

},{"../actions/types":6,"../aj/index":12,"../utils/ajex":348,"./types":345,"underscore":337}],347:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLanguage = setLanguage;
exports.getLanguage = getLanguage;
exports["default"] = M;

var _strings$it;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var language = "it";
var strings = {};
strings["en"] = {
  appName: "_APPNAME_",
  registering: "Registering...",
  ooops: "Ooops...",
  badLogin: "Cannot login! Please check your email address or password!",
  welcome: "Welcome",
  congratulations: "Congratulations",
  welcomeMessage: "Hi {0}, your registration is complete.\nA confirmation link was sent to {1}.\nPlease confirm before login",
  "continue": "Continue",
  register: "Register",
  forgotPassword: "Forgot password",
  signIn: "Sign in",
  mailAddress: "Mail Address",
  name: "Name",
  password: "Password",
  accountConfirmText: "Insert activation code that we sent to your mailbox to confirm your account",
  accountConfirmed: "Your account is confirmed. You can login now",
  mailAndPasswordRequired: "Email and password are required",
  nameMailAndPasswordRequired: "Name, email and password are required",
  mailRequired: "Email is required",
  activationCodeRequired: "Activation code required",
  accountRecoverText: "Please insert your email address to recover password. We will send a new password in your mailbox!",
  problemOccoured: "There is a problem",
  accountRecovered: "A new password was sent to {0}",
  pleaseSpecifyId: "Please specify an ID",
  pleaseSpecifyQuery: "Please specify a query",
  pleaseSpecifyEntity: "Please specify the entity",
  search: "Search",
  close: "Close",
  selectFilterType: "Select filter type",
  filterType: "Filter type",
  typeValueToSearch: "Type value to search",
  value: "Value",
  filters: "Filters",
  pagination: "Showing {0} to {1} of {2}",
  noResults: "there are no results with the specified criteria",
  selectAll: "Select all",
  "delete": "Delete",
  create: "Create",
  refresh: "Refresh",
  confirm: "Confirm",
  entityDeleteConfirm: "Are you sure to delete {0} entities?",
  submit: "Submit",
  cancel: "Cancel",
  add: "Add",
  pleaseSpecifyData: "Please specify data",
  ok: "OK",
  security: "Security",
  users: "Users",
  roles: "Roles",
  setup: "Setup",
  categories: "Categories",
  nElementsSelected: "{0} elements selected",
  oneElementSelected: "1 element selected",
  nothingSelected: "Nothing selected",
  usersListDescription: "Create, edit or delete system users",
  mail: "Email",
  active: "Active",
  editUser: "Edit user",
  editUserDescription: "Use this form to edit user informations",
  generalInformations: "General informations",
  rolesListDescription: "A role is an entity that gives to user authorization to do something",
  nameOfRole: "Name of role",
  role: "Role",
  permissions: "Permissions",
  selectPermissions: "Select permissions for role",
  back: "Back",
  save: "Save",
  saveAndGoBack: "Save and go back",
  revisions: "Revisions",
  image: "Image",
  cover: "Cover",
  saveComplete: "Save complete",
  articles: "Articles",
  articlesListDescription: "Articles must exists in Gamma system. Commodo only extends Gamma articles",
  company: "Company",
  id: "ID",
  description: "Description",
  companies: "Companies",
  companiesListDescription: "List of companies, read only!",
  components: "Components",
  componentsListDescription: "Components are base elements of a \"bill of materials\"",
  characteristic: "Characteristic",
  characteristics: "Characteristics",
  nameOfComponent: "Name of component",
  editComponent: "Edit component",
  editComponentDescription: "Use this form to edit component informations",
  optionValue: "Option value",
  nameOfCharacteristic: "Name of characteristic",
  addCharacteristic: "Add characteristic",
  newOption: "New option",
  areYouSureToRemoveCharacteristic: "Are you sure to remove characteristic '{0}'?",
  editArticle: "Edit article",
  editArticleDescription: "Not all article informations are editable in Commodo because is connected to TeamSystem Gamma",
  article: "Article",
  select: "Select",
  component: "Component",
  pleaseSpecifyComponentId: "Please specify component id",
  pleaseSelectComponent: "Please select component",
  characteristicValues: "Characteristic values",
  selectedComponent: "Selected component",
  noComponentSelected: "No component selected",
  versions: "Versions",
  version: "Version",
  versionsListDescription: "Use versions to create configurable associations with models",
  editVersion: "Edit version",
  editVersionDescription: "Use this form to edit version informations",
  nameOfVersion: "Name of version",
  collections: "Collections",
  collection: "Collection",
  collectionsListDescription: "Collections are used in models",
  editCollection: "Edit collection",
  editCollectionDescription: "Use this form to edit collection informations",
  nameOfCollection: "Name of collection",
  countries: "Countries",
  country: "Country",
  countriesListDescription: "Countries are used in models",
  editCountry: "Edit country",
  editCountryDescription: "Use this form to edit country informations",
  nameOfCountry: "Name of country",
  design: "Design",
  state: "State",
  model: "Model",
  models: "Models",
  nameOfModel: "Name of model",
  modelsListDescription: "Models are base entities to create a sofa",
  editModel: "Edit model",
  editModelDescription: "Use this form to edit model informations",
  code: "Code",
  extraSize: "Extra size",
  destinationCountry: "Destination country",
  revision: "Revision",
  lastUpdate: "Last update",
  editedBy: "Edited by",
  yes: "Yes",
  no: "No",
  notes: "Notes",
  makeACopy: "Make a copy",
  associateVersion: "Associate version",
  pleaseSpecifyVersion: "Please specify version",
  versionAlreadyAssociated: "Version already associated",
  areYouSureToRemoveVersion: "Are you sure to remove version '{0}'?",
  duplicate: "Duplicate",
  edit: "Edit",
  pleaseSaveTheModel: "Please save the model to continue",
  configurables: "Configurables",
  configurablesListDescription: "List of versions associated to models. Use Models registry to make new associations",
  nameOfConfigurable: "Name of configurable",
  addComponent: "Add component",
  editRole: "Edit role",
  editRoleDescription: "Use role to manage what an user can do in system",
  unableToExcludeDefaultArticle: "Unable to exclude an article marked as default",
  addArticleToComponent: "Add article to component {0}",
  selectByArticle: "Select by article",
  removeThisComponent: "Remove this component",
  addArticle: "Add article",
  confirmRemoveConfigurableComponent: "Do you want to remove {0}?",
  editConfigurable: "Edit configurable",
  editConfigurableDescription: "A configurable is the base object for a sofa customization. Use this area to design a model-version in all of its parts",
  noArticlesSelected: "No articles selected for component {0}",
  pleaseSelectDefaultArticleForComponent: "Please select default article for component {0}",
  invalidDefaultArticleSelectedForComponent: "Invalid default article selected for component {0}",
  accessories: "Accessories",
  accessoriesListDescription: "Accessories list",
  editAccessory: "Edit accessory",
  editAccessoryDescription: "Use this form to edit accessory informations",
  nameOfAccessory: "Name of accessory",
  unitOfMeasurements: "Unit of measurements",
  unitOfMeasurementsListDescription: "Unit of measurements list",
  shortName: "Short name",
  conversionFactor: "Conversion factor",
  status: "Status",
  quantity: "Quantity",
  remove: "Remove",
  unitOfMeasurement: "Unit of measurements",
  parts: "Parts",
  partsListDescription: "Represents a coverable part of a sofa",
  editPart: "Edit part",
  editPartDescription: "Use this form to edit part informations",
  nameOfPart: "Name of part",
  covers: "Covers",
  addPart: "Add part",
  type: "Type",
  coverTypes: "Cover types",
  coverTypesListDescription: "Types of coverings used for cover sofa",
  nameOfCoverType: "Name of cover type",
  editCoverType: "Edit cover type",
  editCoverTypeDescription: "Use this form to edit cover type informations",
  colors: "Colors",
  colorsListDescription: "List of colors used in your systems",
  nameOfColor: "Name of color",
  editColor: "Edit color",
  editColorDescription: "Use this form to edit color informations",
  removeThisPart: "Remove this part",
  coverOptions: "Cover options",
  addCoverOption: "Add cover option",
  removeThisCoverOption: "Remove this cover option",
  analogousColorArticles: "Analogous articles",
  complementaryColorArticles: "Complementary articles",
  addComplementaryArticleToCoverOption: "Add complementary article to cover option {0}",
  addAnalogousArticleToCoverOption: "Add analogous article to cover option {0}",
  coverType: "Cover type",
  color: "Color",
  characteristicsDisabledForCoverOptions: "Characteristics disabled for cover options",
  compositions: "Compositions",
  customers: "Customers",
  customersListDescription: "Create system customers",
  paymentCode: "Payment code",
  fiscalCode: "Fiscal code",
  editCustomer: "Edit customer",
  firstName: "First name",
  lastName: "Last name",
  companyName: "Company name",
  cityCode: "City code",
  countryCode: "Country code",
  tel1: "Telephonic number 1",
  tel2: "Telephonic number 2",
  fax: "Fax",
  cellNumber: "Cellular number",
  pec: "Pec",
  vatCode: "Vat",
  componentsAccessoriesCovers: "Components accessories covers",
  removeThisPhase: "Remove this phase",
  phases: "Phases",
  addPhase: "Add phase",
  addComponentToPhase: "Add component to phase",
  workingTime: "Working time",
  address: "Address",
  phasesListDescription: "Phases list description",
  defaultTime: "default time",
  editPhase: "Edit phase",
  editPhaseDescription: "Edit phase description",
  nameOfPhase: "Name of phase",
  production: "Production",
  customer: "Customer",
  coverings: "Coverings",
  allCoverings: "All coverings",
  allAccessories: "All accessories",
  confirmRemoveConfigurablePhase: "Confirm remove configurable phase",
  addArticleToPart: "Add article to part",
  email: "Email",
  website: "Web site",
  zipCode: "Zip code",
  city: "City",
  coverOptionColorConfiguration: "Cover option color configuration",
  addComplementaryArticleForColor: "Add complementary article for {0}",
  addAnalogousArticleForColor: "Add analogous article for {0}"
};
strings["it"] = (_strings$it = {
  appName: "_APPNAME_",
  registering: "Registrazione...",
  ooops: "Ooops...",
  badLogin: "Non riesco ad accedere! Per favore controlla il tuo indirizzo email o password!",
  welcome: "Benvenuto",
  congratulations: "Congratulazioni",
  welcomeMessage: "Ciao {0}, la tua registrazione è completa.\nUn link per la conferma è stato inviato a {1}.\nPer favore conferma prima di effettuare l'accesso",
  "continue": "Continuare",
  register: "Registrati",
  forgotPassword: "Dimenticato la password",
  signIn: "Rgistrati",
  mailAddress: "Indirizzo mail",
  name: "Nome",
  password: "Password",
  accountConfirmText: "Inserisci il codice di attivazione che abbiamo inviato alla tua casella mail per confermare il tuo account",
  accountConfirmed: "Il tuo account è confermato. Puoi effettuare l'accesso ora",
  mailAndPasswordRequired: "Email e password sono richieste",
  nameMailAndPasswordRequired: "Nome, email e password sono richieste",
  mailRequired: "Email è richiesta",
  activationCodeRequired: "Codice di attivazione richiesto",
  accountRecoverText: "Per favore inserisci il tuo indirizzo email per recuperare la password. Ti invieremo una nuova password al tuo indirizzo mail!",
  problemOccoured: "C'è un problema",
  accountRecovered: "Una nuova password è stata inviata a {0}",
  pleaseSpecifyId: "Per favore specifica il tuo ID",
  pleaseSpecifyQuery: "Per favore specifica la domanda",
  pleaseSpecifyEntity: "Per favore specifica l'entità",
  search: "Ricerca",
  close: "Chiudi",
  selectFilterType: "Seleziona il tipo di filtro",
  filterType: "Tipo di filtro",
  typeValueToSearch: "Tipo di valore da cercare",
  value: "Valore",
  filters: "Filtri",
  pagination: "Record da {0} a {1} di {2} totali",
  noResults: "Non ci sono risultati con i criteri specificati",
  selectAll: "Seleziona tutto",
  "delete": "Rimuovi",
  create: "Crea",
  refresh: "Ricarica",
  confirm: "Conferma",
  entityDeleteConfirm: "Sei sicuro di voler eliminare {0} entità?",
  submit: "Invia",
  cancel: "Annulla",
  add: "Aggiungi",
  pleaseSpecifyData: "Per favore specifica la data",
  ok: "OK",
  security: "Securezza",
  users: "Utenti",
  roles: "Ruoli",
  setup: "Setup",
  categories: "Categorie",
  nElementsSelected: "{0} elementi selezionati",
  oneElementSelected: "1 elemento selezionato",
  nothingSelected: "Niente selezionato",
  usersListDescription: "Creare, modificare o eliminare gli utenti di sistema",
  mail: "Email",
  active: "Attivo",
  editUser: "Modifica utente",
  editUserDescription: "Usa questo modulo per modificare le informazioni dell'utente",
  generalInformations: "Informazioni generali",
  rolesListDescription: "Un ruolo è un'entità che da all'utente l'autorizzazione per fare qualcosa",
  nameOfRole: "Nome del ruolo",
  role: "Ruolo",
  permissions: "Permessi",
  selectPermissions: "Seleziona i premessi per il ruolo",
  back: "Indietro",
  save: "Salva",
  saveAndGoBack: "Salva e torna alla lista",
  revisions: "Revisioni",
  image: "Immagine",
  cover: "Rivestimenti",
  saveComplete: "Salvataggio completato",
  articles: "Articoli",
  articlesListDescription: "Gli articoli devono essere presenti sul sistema Gamma. In commodo gli articoli vengono estesi per aggiungere funzionalità richiesta solo a Commodo",
  company: "Azienda",
  id: "ID",
  description: "Descrizione",
  companies: "Aziende",
  companiesListDescription: "Lista delle aziende, sola lettura!",
  components: "Componenti",
  componentsListDescription: "I componenti sono elementi base di una \"distinta di materiali\"",
  characteristic: "Caratteritica",
  characteristics: "Caratteristiche",
  nameOfComponent: "Nome del componente",
  editComponent: "Modifica componente",
  editComponentDescription: "Usa questo modulo per modificare le informazioni del componente",
  optionValue: "Valore di opzione",
  nameOfCharacteristic: "Nome della caratteristica",
  addCharacteristic: "Aggiungi caratteristica",
  newOption: "Nuova opzione",
  areYouSureToRemoveCharacteristic: "Sei sicuro di voler rimuovere la caratteristica '{0}'?",
  editArticle: "Modifica articolo",
  editArticleDescription: "Non tutte le informazini dell'articolo sono modificabili in Commodo perchè è connesso a TeamSystem Gamma",
  article: "Articolo",
  select: "Seleziona",
  component: "Componente",
  pleaseSpecifyComponentId: "Per favore specifica l'id del componente",
  pleaseSelectComponent: "Per favore seleziona il componente",
  characteristicValues: "Valori della caratteristica",
  selectedComponent: "Componente selezionato",
  noComponentSelected: "Nessun componente selezionato",
  versions: "Versioni",
  version: "Versione",
  versionsListDescription: "Usa le versioni per creare associazioni configurabili con i modelli",
  editVersion: "Modifica la versione",
  editVersionDescription: "Usa questo modulo per modificare le informazioni della versione",
  nameOfVersion: "Nome della versione",
  collections: "Collezioni",
  collection: "Collezione",
  collectionsListDescription: "Le collezioni sono usate nei modelli",
  editCollection: "Modifica collezioni",
  editCollectionDescription: "Usa questo modulo per modificare le informazioni delle collezioni",
  nameOfCollection: "Nome delle collezioni",
  countries: "Paesi",
  country: "Paese",
  countriesListDescription: "I paesi sono usati nei modelli",
  editCountry: "Modifica il paese",
  editCountryDescription: "Usa questo modulo per modificare le informazioni del paese",
  nameOfCountry: "Nome del paese",
  design: "Design",
  state: "Stato",
  model: "Modello",
  models: "Modelli",
  nameOfModel: "Nome del modello",
  modelsListDescription: "I modelli sono entità base per creare un divano",
  editModel: "Modifica modello",
  editModelDescription: "Usa questo modulo per modificare le informazioni del modello",
  code: "Codice",
  extraSize: "Extra size",
  destinationCountry: "Paese di destinazione",
  revision: "Revisione",
  lastUpdate: "Ultimo aggiornamento",
  editedBy: "Modificato da",
  yes: "Si",
  no: "No",
  notes: "Appunti",
  makeACopy: "Crea una copia",
  associateVersion: "Associa versione",
  pleaseSpecifyVersion: "Per favore specifica la versione",
  versionAlreadyAssociated: "Versione già associata",
  areYouSureToRemoveVersion: "Sei sicuro di voler rimuovere la versione '{0}'?",
  duplicate: "Duplica",
  edit: "Modifica",
  pleaseSaveTheModel: "Per favore salva il modello per continuare",
  configurables: "Configurabili",
  configurablesListDescription: "Lista delle versioni associate ai modelli. Usa il registro dei modelli per creare nuove associazioni",
  nameOfConfigurable: "Nome del configurabile",
  addComponent: "Aggiungi componente",
  editRole: "Modifica ruolo",
  editRoleDescription: "Usa un ruolo per gestire cosa può fare un utente nel sistema",
  unableToExcludeDefaultArticle: "Incapace di escludere un articolo contrassegnato come predefinito",
  addArticleToComponent: "Aggiungi articolo al componente {0}",
  selectByArticle: "Selezionare dall'articolo",
  removeThisComponent: "Rimuovi questo componente",
  addArticle: "Aggiungi articolo",
  confirmRemoveConfigurableComponent: "Desideri rimuovere {0}?",
  editConfigurable: "Modifica configurabile",
  editConfigurableDescription: "Un configurabile è l'oggetto base per la personalizzazione del divano. Usa quest'area per progettare un modello-versione in tutte le sue parti",
  noArticlesSelected: "Nessun artivolo selezionato per il componente {0}",
  pleaseSelectDefaultArticleForComponent: "Per favore seleziona l'articolo di default per il componente {0}",
  invalidDefaultArticleSelectedForComponent: "L'articolo di default invalido selezionato per il componente {0}",
  accessories: "Accessori",
  accessoriesListDescription: "Lista accessori",
  editAccessory: "Modifica accessori",
  editAccessoryDescription: "Usa questo modulo per modificare le informationi dell'accessorio",
  nameOfAccessory: "Nome dell'accessorio",
  unitOfMeasurements: "Unità di misura",
  unitOfMeasurementsListDescription: "Lista della unità di misura",
  shortName: "Nome breve",
  conversionFactor: "Fattore di conversione",
  status: "Stato",
  quantity: "Quantità",
  remove: "Rimuovi",
  unitOfMeasurement: "Unità di misura",
  parts: "Parti",
  partsListDescription: "Rappresenta una parte rivestibile di un divano",
  editPart: "Modifica parte",
  editPartDescription: "Usa questo modulo per modificare le informazioni della parte",
  nameOfPart: "Nome della parte",
  covers: "Rivestimenti",
  addPart: "Aggiungi parte",
  type: "Tipo",
  coverTypes: "Tipi di rivestimento",
  coverTypesListDescription: "Tipi di rivestimenti usati per rivestire il divano",
  nameOfCoverType: "Nome del tipo di rivestimento",
  editCoverType: "Modifica il tipo di rivestimento",
  editCoverTypeDescription: "Usa questo modulo per modificare il tipo di informazioni del rivestimento",
  colors: "Colori",
  colorsListDescription: "Lista dei colori utilizzati per i tuoi sistemi",
  nameOfColor: "Nome del colore",
  editColor: "Modifica colore",
  editColorDescription: "Usa questo modulo per modificare le informazioni del colore",
  removeThisPart: "Rimuovi questa parte",
  coverOptions: "Opzioni del rivestimento",
  addCoverOption: "Aggiungi opzione del rivestimento",
  removeThisCoverOption: "Rimuovi questa opzione del rivestimento"
}, _defineProperty(_strings$it, "noArticlesSelected", "Nessun articolo selezionato"), _defineProperty(_strings$it, "analogousColorArticles", "Articoli analoghi"), _defineProperty(_strings$it, "complementaryColorArticles", "Articoli complementari"), _defineProperty(_strings$it, "addComplementaryArticleToCoverOption", "Aggiungi articoli complementari per l'opzione del rivestimento {0}"), _defineProperty(_strings$it, "addAnalogousArticleToCoverOption", "Aggiungi articoli analoghi per l'opzione del rivestimento {0}"), _defineProperty(_strings$it, "coverType", "Tipo di rivestimento"), _defineProperty(_strings$it, "color", "Colore"), _defineProperty(_strings$it, "characteristicsDisabledForCoverOptions", "Caratteristiche disabilitate per le opzioni del rivestimento"), _defineProperty(_strings$it, "compositions", "Composizioni"), _defineProperty(_strings$it, "customers", "Clienti"), _defineProperty(_strings$it, "customersListDescription", "Creare clienti del sistema"), _defineProperty(_strings$it, "companyName", "Nome dell'Azienda"), _defineProperty(_strings$it, "paymentCode", "Codice di pagamento"), _defineProperty(_strings$it, "zipCode", "CAP"), _defineProperty(_strings$it, "fiscalCode", "Codice fiscale"), _defineProperty(_strings$it, "vatCode", "I.V.A."), _defineProperty(_strings$it, "componentsAccessoriesCovers", "Componenti dei rivestimenti degli accessori"), _defineProperty(_strings$it, "removeThisPhase", "Rimuovi questa fase"), _defineProperty(_strings$it, "phases", "Fasi"), _defineProperty(_strings$it, "addPhase", "Aggiungi fase"), _defineProperty(_strings$it, "addComponentToPhase", "Aggiungi componente alla fase"), _defineProperty(_strings$it, "workingTime", "Tempo di lavoro"), _defineProperty(_strings$it, "address", "Indirizzo"), _defineProperty(_strings$it, "city", "Città"), _defineProperty(_strings$it, "phasesListDescription", "Lista delle descrizioni della fase"), _defineProperty(_strings$it, "defaultTime", "Tempo predefinito"), _defineProperty(_strings$it, "editPhase", "Modifica fase"), _defineProperty(_strings$it, "editPhaseDescription", "Modifica la descrizione della fase"), _defineProperty(_strings$it, "nameOfPhase", "Nome della fase"), _defineProperty(_strings$it, "production", "Produzione"), _defineProperty(_strings$it, "customer", "Cliente"), _defineProperty(_strings$it, "coverings", "Rivestimenti"), _defineProperty(_strings$it, "allCoverings", "Tutti i rivestimenti"), _defineProperty(_strings$it, "allAccessories", "Tutti gli accessori"), _defineProperty(_strings$it, "confirmRemoveConfigurablePhase", "Conferma la rimozione della fase configurabile"), _defineProperty(_strings$it, "coverOptionColorConfiguration", "Configurazione i colori dell'opzione rivestimento"), _defineProperty(_strings$it, "addComplementaryArticleForColor", "Aggiungi articolo a contrasto a {0}"), _defineProperty(_strings$it, "addAnalogousArticleForColor", "Aggiungi articolo a {0}"), _defineProperty(_strings$it, "usersList", "Lista utenti"), _defineProperty(_strings$it, "rolesList", "Lista ruoli"), _strings$it);

function setLanguage(language_) {
  language = language_;
}

function getLanguage() {
  return language;
}

function M(key) {
  if (strings[language] && strings[language][key]) {
    return strings[language][key];
  } else {
    logger.w("String not found for language " + language + ":", key);
    return key;
  }
}

},{}],348:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.completed = completed;
exports.failed = failed;
exports.createAsyncAction = createAsyncAction;
exports.discriminate = discriminate;
exports.discriminated = discriminated;

var _underscore = _interopRequireDefault(require("underscore"));

var aj = _interopRequireWildcard(require("../aj"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function completed(action) {
  return action + "_COMPLETE";
}

function failed(action) {
  return action + "_FAIL";
}

function createAsyncAction(type, action) {
  var normal = aj.createAction(type, action);
  normal.complete = aj.createAction(completed(type), function (data) {
    aj.dispatch(_underscore["default"].assign({
      type: completed(type),
      error: false
    }, data));
  });
  normal.fail = aj.createAction(failed(type), function (data) {
    aj.dispatch(_underscore["default"].assign({
      type: failed(type),
      error: true
    }, data));
  });
  return normal;
}

function discriminate(state, discriminator, newValues) {
  var ds = state[discriminator] = state[discriminator] || {};

  _underscore["default"].assign(ds, newValues);

  return state;
}

function discriminated(state, discriminator) {
  return state[discriminator] || {};
}

},{"../aj":12,"underscore":337}],349:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixed = fixed;
exports.promised = promised;
exports.create = create;
exports.fromEnum = fromEnum;
exports.DataSource = void 0;

var _events = require("../aj/events");

var _underscore = _interopRequireDefault(require("underscore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function normalizeData(data) {
  var result = null;

  if (data) {
    if (_underscore["default"].isArray(data)) {
      result = {
        rows: data,
        totalRows: data.length
      };
    } else if (_underscore["default"].isObject(data)) {
      result = data;
    }
  }

  return result;
}

var DataSource =
/*#__PURE__*/
function (_Observable) {
  _inherits(DataSource, _Observable);

  function DataSource(initialData) {
    var _this;

    _classCallCheck(this, DataSource);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DataSource).call(this));
    _this.data = normalizeData(initialData);
    return _this;
  }

  _createClass(DataSource, [{
    key: "notifyChanged",
    value: function notifyChanged() {
      this.invoke("change", this.data);
    }
  }, {
    key: "setData",
    value: function setData(data) {
      this.data = normalizeData(data);
      this.notifyChanged();
    }
  }]);

  return DataSource;
}(_events.Observable);

exports.DataSource = DataSource;

function fixed(data) {
  return new DataSource(data);
}

function promised(promiseFn) {
  var dataSource = new DataSource();
  new Promise(promiseFn).then(function (data) {
    dataSource.setData(data);
  })["catch"](function (r) {
    logger.e(r);
  });
  return dataSource;
}

function create() {
  return new DataSource();
}

function fromEnum(Enum) {
  return new DataSource(_underscore["default"].map(_underscore["default"].keys(Enum), function (k) {
    return {
      label: M(k),
      value: Enum[k]
    };
  }));
}

},{"../aj/events":10,"underscore":337}],350:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.optional = optional;
exports.safeGet = safeGet;
exports.parseBoolean = parseBoolean;
exports.forceBoolean = forceBoolean;
exports.walk = walk;
exports.use = use;
exports.flatten = flatten;
exports.uuid = uuid;
exports.updatedList = updatedList;
exports.peek = peek;
exports.diff = diff;
exports.isDifferent = isDifferent;
exports.stringMatches = stringMatches;

var _underscore = _interopRequireDefault(require("underscore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Format a string message (es: format("My name is {0}", "Bruno") returns "My name is Brnuo")
 * @param fmt
 * @param values
 * @returns {void|XML|string|*}
 */
function format(fmt) {
  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  var args = values;
  return fmt.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
}
/**
 * Gets checked value (check for null or undefined) and gets the default value in case of fail
 * @param val Value of function to check
 * @param def Default value or function
 */


function optional(val, def) {
  var v;

  try {
    v = _underscore["default"].isFunction(val) ? val() : val;
  } catch (e) {}

  if (v == undefined || v == null) {
    v = _underscore["default"].isFunction(def) ? def() : def;
  }

  return v;
}
/**
 * safely get a property from object, returning default if not present)
 */


function safeGet(target, prop) {
  var def = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  if (target === undefined || target === null) {
    return null;
  } else {
    return optional(target[prop], def);
  }
}
/**
 * Gets a boolean value casting from val if is not null or undefined
 */


function parseBoolean(val) {
  if (val == null) {
    return null;
  }

  if (val == undefined) {
    return undefined;
  }

  return val == true || parseInt(val) > 0 || val == "true";
}
/**
 * Gets a forced boolean value casting also if is null or undefined (false in this case)
 */


function forceBoolean(val) {
  if (val == null) {
    return false;
  }

  if (val == undefined) {
    return false;
  }

  return val == true || parseInt(val) > 0 || val == "true";
}
/**
 * Walk in a composite object
 * @param tree
 * @param property
 * @param action
 */


function walk(tree) {
  var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "children";
  var action = arguments.length > 2 ? arguments[2] : undefined;

  if (_underscore["default"].isArray(tree)) {
    _underscore["default"].each(tree, function (i) {
      action(i);

      if (_underscore["default"].isArray(i[property])) {
        _underscore["default"].each(i[property], function (t) {
          return walk(t, property, action);
        });
      }
    });
  } else {
    action(tree);

    if (_underscore["default"].isArray(tree[property])) {
      _underscore["default"].each(tree[property], function (t) {
        return walk(t, property, action);
      });
    }
  }

  return tree;
}

var ObjectUser =
/*#__PURE__*/
function () {
  function ObjectUser(o) {
    _classCallCheck(this, ObjectUser);

    this.o = o;
  }

  _createClass(ObjectUser, [{
    key: "run",
    value: function run(fn) {
      fn(this.o);
      return this.o;
    }
  }, {
    key: "get",
    value: function get() {
      return this.o;
    }
  }]);

  return ObjectUser;
}();
/**
 * A strategy to do something with an object and get it
 */


function use(o) {
  return new ObjectUser(o);
}
/**
 * Make a flatten object from plain object
 */


function flatten(target) {
  if (!_underscore["default"].isObject(target)) {
    return {};
  }

  var delimiter = ".";
  var output = {};

  function step(obj, prev, currentKey) {
    var keys = _underscore["default"].keys(obj);

    _underscore["default"].each(keys, function (k) {
      var newKey = prev ? currentKey + delimiter + k : k;

      if (_underscore["default"].isArray(obj)) {
        newKey = currentKey + "[" + k + "]";
      }

      var value = obj[k];

      if (value != null && value != undefined) {
        if (_underscore["default"].isObject(value)) {
          step(value, obj, newKey);
        } else {
          output[newKey] = value;
        }
      }
    });
  }

  step(target, null, "");
  return output;
}
/**
 * Generates unique identifier
 * @returns {string}
 */


function uuid() {
  var d = new Date().getTime();

  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }

  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
}
/**
 * Updates list element found with predicate and return an updated copy of the list
 * @param list
 * @param predicate
 * @param updater
 */


function updatedList(list, predicate, updater) {
  var addIfNotFound = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  if (_underscore["default"].isArray(list) && _underscore["default"].isFunction(predicate) && _underscore["default"].isFunction(updater)) {
    var result = new Array(list.length);
    var found = false;

    for (var i = 0; i < list.length; i++) {
      var v = list[i];

      if (predicate(v)) {
        result[i] = _underscore["default"].assign({}, v, updater(v));
        found = true;
      } else {
        result[i] = v;
      }
    }

    if (addIfNotFound && !found) {
      result.push(updater(null));
    }

    return result;
  } else {
    logger.w("Bad parameters in updater. Returning an empty list");
    return [];
  }
}
/**
 * List on each list element and assign returned updater object to current element.
 * Each element will be a new element and list will be a new list, using immutability
 * @param list
 * @param updater
 */


function peek(list, updater) {
  var newList = [];

  _underscore["default"].each(list, function (i) {
    var obj = updater(i);

    if (obj === undefined && obj === null) {
      obj = {};
    }

    newList.push(_underscore["default"].assign({}, i, obj));
  });

  return newList;
}
/**
 * Gets object differences
 * @param o1
 * @param o2
 */


function diff(o1, o2) {
  var fo1 = flatten(o1);
  var fo2 = flatten(o2);
  var diff = [];

  _underscore["default"].each(_underscore["default"].keys(fo1), function (k) {
    var v1 = fo1[k];

    if (!_underscore["default"].has(fo2, k)) {
      diff.push({
        property: k,
        type: "add",
        value: v1
      });
    } else {
      var v2 = fo2[k];

      if (v1 !== v2) {
        diff.push({
          property: k,
          type: "change",
          value: v1,
          oldValue: v2
        });
      }
    }
  });

  _underscore["default"].each(_underscore["default"].keys(fo2), function (k) {
    if (!_underscore["default"].has(fo1, k)) {
      diff.push({
        property: k,
        type: "remove",
        value: fo2[k]
      });
    }
  });

  return diff;
}
/**
 * Return true if object tree is different
 * @param o1
 * @param o2
 */


function isDifferent(o1, o2) {
  var fo1 = flatten(o1);
  var fo2 = flatten(o2);

  try {
    _underscore["default"].each(_underscore["default"].keys(fo1), function (k) {
      var v1 = fo1[k];

      if (!_underscore["default"].has(fo2, k)) {
        throw true;
      } else {
        var v2 = fo2[k];

        if (v1 !== v2) {
          throw true;
        }
      }
    });

    _underscore["default"].each(_underscore["default"].keys(fo2), function (k) {
      if (!_underscore["default"].has(fo1, k)) {
        throw true;
      }
    });
  } catch (e) {
    return true;
  }

  return false;
}
/**
 * Gets matchings characters positions of s1 in s2, inspired to sublime text commands palette search mode
 */


function stringMatches(s1, s2) {
  var caseSensitive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var matches = [];

  if (!caseSensitive) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  }

  if (s1 && s1.length > 0 && s2 && s2.length > 0) {
    var i1 = 0;
    var i2 = 0;

    while (i1 < s1.length) {
      var c1 = s1.charAt(i1++);

      var _i = s2.indexOf(c1, _i + 1);

      if (_i != -1) {
        matches.push({
          index: _i,
          "char": c1
        });
      } else {
        break;
      }
    }
  }

  return matches;
}

window.stringMatches = stringMatches;

},{"underscore":337}],351:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HeaderBlockWithBreadcrumbs = exports.EditableText = exports.ActionsMatcher = exports.FloatingButton = exports.Card = exports.HeaderBlock = exports.Actions = exports.ActionButton = exports.DropdownActionButton = void 0;

var _lang = require("../../utils/lang");

var _keyboard = require("../utils/keyboard");

var ui = _interopRequireWildcard(require("../utils/ui"));

var _ = _interopRequireWildcard(require("underscore"));

var _session = require("../../api/session");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var DropdownActionButton =
/*#__PURE__*/
function (_React$Component) {
  _inherits(DropdownActionButton, _React$Component);

  function DropdownActionButton() {
    _classCallCheck(this, DropdownActionButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(DropdownActionButton).apply(this, arguments));
  }

  _createClass(DropdownActionButton, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var button = this.refs.button;
      $(button).dropdown();
    }
  }, {
    key: "onItemClick",
    value: function onItemClick(item) {
      if (_.isFunction(item.action)) {
        item.action.apply(this, this.props.arguments);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var index = 0;

      var dropdownItems = _.map(this.props.action.items, function (i) {
        return React.createElement("li", {
          key: index++
        }, React.createElement("a", {
          role: "menuitem",
          tabIndex: "-1",
          href: "javascript:;",
          onClick: _this.onItemClick.bind(_this, i)
        }, !_.isEmpty(i.icon) && React.createElement("i", {
          className: i.icon
        }), i.label));
      });

      var dropdownMenuClass = "dropdown-menu pull-left";
      var align = (0, _lang.optional)(this.props.action.align, "left");

      if (align === "right") {
        dropdownMenuClass = "dropdown-menu pull-right";
      }

      return React.createElement("div", {
        className: "dropdown"
      }, React.createElement("a", {
        ref: "button",
        href: "javascript:;",
        className: this.props.className,
        "data-toggle": "dropdown",
        "data-placement": "bottom",
        title: this.props.action.tooltip
      }, React.createElement("i", {
        className: this.props.action.icon
      })), React.createElement("ul", {
        className: dropdownMenuClass
      }, dropdownItems));
    }
  }]);

  return DropdownActionButton;
}(React.Component);

exports.DropdownActionButton = DropdownActionButton;

var ActionButton =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(ActionButton, _React$Component2);

  function ActionButton() {
    _classCallCheck(this, ActionButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(ActionButton).apply(this, arguments));
  }

  _createClass(ActionButton, [{
    key: "onClick",
    value: function onClick() {
      var action = this.props.action;

      if (_.isFunction(action.action)) {
        action.action.apply(this, this.props.arguments);
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      $(this.refs.button).tooltip({
        trigger: "hover"
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      $(this.refs.button).tooltip("dispose");
    }
  }, {
    key: "render",
    value: function render() {
      var className = "actions__item";

      if (this.props.className) {
        className += " " + this.props.className;
      }

      return React.createElement("a", {
        ref: "button",
        href: "javascript:;",
        className: className,
        "data-toggle": "tooltip",
        "data-placement": "bottom",
        title: this.props.action.tooltip,
        onClick: this.onClick.bind(this)
      }, React.createElement("i", {
        className: this.props.action.icon
      }));
    }
  }]);

  return ActionButton;
}(React.Component);

exports.ActionButton = ActionButton;

var Actions =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(Actions, _React$Component3);

  function Actions() {
    _classCallCheck(this, Actions);

    return _possibleConstructorReturn(this, _getPrototypeOf(Actions).apply(this, arguments));
  }

  _createClass(Actions, [{
    key: "getPermittedActions",
    value: function getPermittedActions() {
      return _.filter(this.props.actions, function (a) {
        return (0, _session.hasPermission)(a.permissions) === true;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var actionKey = 1;
      var actions = this.getPermittedActions();
      return !_.isEmpty(actions) && React.createElement("div", {
        className: "actions"
      }, actions.map(function (a) {
        return React.createElement(Actions.getButtonClass(a), {
          key: actionKey++,
          action: a
        });
      }));
    }
  }]);

  return Actions;
}(React.Component);

exports.Actions = Actions;

Actions.getButtonClass = function (action) {
  switch (action.type) {
    case "dropdown":
      return DropdownActionButton;

    default:
      return ActionButton;
  }
};

var HeaderBlock =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(HeaderBlock, _React$Component4);

  function HeaderBlock() {
    _classCallCheck(this, HeaderBlock);

    return _possibleConstructorReturn(this, _getPrototypeOf(HeaderBlock).apply(this, arguments));
  }

  _createClass(HeaderBlock, [{
    key: "render",
    value: function render() {
      return React.createElement("header", {
        className: "content__title"
      }, !_.isEmpty(this.props.title) && React.createElement("h1", null, this.props.title), !_.isEmpty(this.props.subtitle) && React.createElement("small", null, this.props.subtitle), !_.isEmpty(this.props.actions) && React.createElement(Actions, {
        actions: this.props.actions
      }));
    }
  }]);

  return HeaderBlock;
}(React.Component);

exports.HeaderBlock = HeaderBlock;

var Card =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(Card, _React$Component5);

  function Card() {
    _classCallCheck(this, Card);

    return _possibleConstructorReturn(this, _getPrototypeOf(Card).apply(this, arguments));
  }

  _createClass(Card, [{
    key: "render",
    value: function render() {
      var actionKey = 1;
      var cardClass = (0, _lang.optional)(this.props.className, "card");
      var bodyClass = "card-body";

      if (this.props.padding) {
        bodyClass += " card-padding";
      }

      var titleClass = "card-title";

      if (this.props.inverseHeader) {
        titleClass += " card-title-inverse";
      }

      var subtitleClass = "card-title";

      if (this.props.inverseHeader) {
        subtitleClass += " card-title-inverse";
      }

      return React.createElement("div", {
        className: cardClass
      }, React.createElement("div", {
        className: bodyClass
      }, !_.isEmpty(this.props.title) && React.createElement("h4", {
        className: titleClass
      }, this.props.title), !_.isEmpty(this.props.subtitle) && React.createElement("h6", {
        className: headerClass
      }, this.props.subtitle), !_.isEmpty(this.props.actions) && React.createElement(Actions, {
        actions: this.props.actions
      }), this.props.children));
    }
  }]);

  return Card;
}(React.Component);

exports.Card = Card;

var FloatingButton =
/*#__PURE__*/
function (_React$Component6) {
  _inherits(FloatingButton, _React$Component6);

  function FloatingButton() {
    _classCallCheck(this, FloatingButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(FloatingButton).apply(this, arguments));
  }

  _createClass(FloatingButton, [{
    key: "onClick",
    value: function onClick() {
      if (_.isFunction(this.props.onClick)) {
        this.props.onClick();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("button", {
        type: "button",
        className: "btn btn--action btn-danger",
        onClick: this.onClick.bind(this)
      }, React.createElement("i", {
        className: this.props.icon
      }));
    }
  }]);

  return FloatingButton;
}(React.Component);

exports.FloatingButton = FloatingButton;

var ActionsMatcher =
/*#__PURE__*/
function () {
  function ActionsMatcher(defaultActions) {
    _classCallCheck(this, ActionsMatcher);

    this.defaultActions = defaultActions;
  }

  _createClass(ActionsMatcher, [{
    key: "match",
    value: function match(userActions) {
      var _this2 = this;

      var actions = [];

      if (userActions) {
        if (!_.isArray(userActions)) {
          throw new Error("grid.actions must be an array but is " + userActions);
        }

        _.each(userActions, function (a) {
          if (_.isObject(a)) {
            actions.push(a);
          } else if (typeof a === "string") {
            var defaultAction = _.find(_this2.defaultActions, function (d) {
              return d.id === a;
            });

            if (!_.isEmpty(defaultAction)) {
              actions.push(defaultAction);
            } else {
              logger.w("Default action not found: " + a);
            }
          }
        });
      } else {
        actions = this.defaultActions;
      }

      return actions;
    }
  }]);

  return ActionsMatcher;
}();

exports.ActionsMatcher = ActionsMatcher;

var EditableText =
/*#__PURE__*/
function (_React$Component7) {
  _inherits(EditableText, _React$Component7);

  function EditableText(props) {
    var _this3;

    _classCallCheck(this, EditableText);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(EditableText).call(this, props));
    _this3.state = {
      editing: _.isEmpty(props.value),
      value: props.value
    };
    return _this3;
  }

  _createClass(EditableText, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(newProps) {
      this.setState({
        editing: _.isEmpty(newProps.value),
        value: newProps.value
      });
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      this.setState({
        editing: false,
        value: this.state.lastValue
      });
    }
  }, {
    key: "onValueChange",
    value: function onValueChange(e) {
      e.preventDefault();
      e.stopPropagation();
      this.setState(_.assign(this.state, {
        editing: true,
        value: e.target.value
      }));
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(e) {
      if ((0, _keyboard.isEnter)(e.which)) {
        e.preventDefault();
        e.stopPropagation();
        this.setState(_.assign(this.state, {
          editing: false,
          lastValue: this.state.value
        }));

        if (_.isFunction(this.props.onChange)) {
          this.props.onChange(this.state.value);
        }
      }
    }
  }, {
    key: "edit",
    value: function edit() {
      this.setState(_.assign(this.state, {
        editing: true,
        lastValue: this.state.value
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var className = this.props.className;
      return this.state.editing || _.isEmpty(this.state.value) ? React.createElement("div", {
        className: "fg-line editable-text " + (0, _lang.optional)(className, "")
      }, React.createElement("input", {
        ref: "name",
        type: "text",
        className: "form-control",
        onKeyDown: this.onKeyDown.bind(this),
        onChange: this.onValueChange.bind(this),
        value: (0, _lang.optional)(this.state.value, ""),
        placeholder: this.props.placeholder,
        autoFocus: "autoFocus",
        onBlur: this.onBlur.bind(this)
      })) : React.createElement("span", {
        className: (0, _lang.optional)(className, ""),
        onClick: this.edit.bind(this)
      }, this.state.value);
    }
  }]);

  return EditableText;
}(React.Component);

exports.EditableText = EditableText;

var HeaderBlockWithBreadcrumbs =
/*#__PURE__*/
function (_React$Component8) {
  _inherits(HeaderBlockWithBreadcrumbs, _React$Component8);

  function HeaderBlockWithBreadcrumbs(props) {
    _classCallCheck(this, HeaderBlockWithBreadcrumbs);

    return _possibleConstructorReturn(this, _getPrototypeOf(HeaderBlockWithBreadcrumbs).call(this, props));
  }

  _createClass(HeaderBlockWithBreadcrumbs, [{
    key: "render",
    value: function render() {
      var _this4 = this;

      var title;

      if (_.isArray(this.props.title)) {
        title = this.props.title.map(function (item, i) {
          return React.createElement(BreadcrumbItem, {
            key: Math.random(),
            title: item.title,
            url: item.url,
            first: i == 0,
            last: i < _this4.props.title.length - 1
          });
        });
      } else {
        title = this.props.title;
      }

      return React.createElement("header", {
        className: "content__title"
      }, !_.isEmpty(title) && React.createElement("h1", null, title), !_.isEmpty(this.props.subtitle) && React.createElement("small", null, this.props.subtitle), !_.isEmpty(this.props.actions) && React.createElement(Actions, {
        actions: this.props.actions
      }));
    }
  }]);

  return HeaderBlockWithBreadcrumbs;
}(React.Component);

exports.HeaderBlockWithBreadcrumbs = HeaderBlockWithBreadcrumbs;

var BreadcrumbItem =
/*#__PURE__*/
function (_React$Component9) {
  _inherits(BreadcrumbItem, _React$Component9);

  function BreadcrumbItem(props) {
    var _this5;

    _classCallCheck(this, BreadcrumbItem);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(BreadcrumbItem).call(this, props));
    _this5.title = _this5.props.title;
    _this5.url = _this5.props.url;
    _this5.last = (0, _lang.optional)(_this5.props.last, false);
    _this5.first = (0, _lang.optional)(_this5.props.first, false);
    return _this5;
  }

  _createClass(BreadcrumbItem, [{
    key: "onClick",
    value: function onClick() {
      if (this.url) {
        ui.navigate(this.url);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var style = {
        marginLeft: !this.first ? "10px" : "px"
      };
      if (this.url) style.cursor = "pointer";
      var iconStyle = {
        marginLeft: "10px"
      };
      return React.createElement("span", {
        onClick: this.onClick.bind(this),
        style: style
      }, this.title, this.last && React.createElement("i", {
        style: iconStyle,
        className: "zmdi zmdi-caret-right"
      }));
    }
  }]);

  return BreadcrumbItem;
}(React.Component);

},{"../../api/session":20,"../../utils/lang":350,"../utils/keyboard":377,"../utils/ui":379,"underscore":337}],352:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EntitiesMultiCheckContainer = exports.EntitiesSelectContainer = exports.ValuesSelectContainer = exports.ValuesLookupContainer = exports.EntitiesLookupContainer = exports.MultiCheckboxByValue = void 0;

var datasource = _interopRequireWildcard(require("../../utils/datasource"));

var _entities = require("../../stores/entities");

var _entities2 = require("../../actions/entities");

var _ajex = require("../../utils/ajex");

var query = _interopRequireWildcard(require("../../api/query"));

var _forms = require("./forms");

var _lang = require("../../utils/lang");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LOOKUP_DISCRIMINATOR = 1;

function nextLookupDiscriminator() {
  return "lookup_" + LOOKUP_DISCRIMINATOR++;
}

var MultiCheckboxByValue =
/*#__PURE__*/
function (_Control) {
  _inherits(MultiCheckboxByValue, _Control);

  function MultiCheckboxByValue(props) {
    var _this;

    _classCallCheck(this, MultiCheckboxByValue);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MultiCheckboxByValue).call(this, props));
    _this.state = {};
    _this.discriminator = props.field.property;
    return _this;
  }

  _createClass(MultiCheckboxByValue, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var model = this.props.model;
      var field = this.props.field;
      model.once("load", function () {
        var items = (0, _lang.optional)(model.get(field.property), []);
        (0, _entities2.setMultivalueSettings)({
          discriminator: _this2.discriminator,
          items: items
        });
      });

      _entities.MultiValueSettingsStore.subscribe(this, function (state) {
        _this2.state.items = (0, _ajex.discriminated)(state, _this2.discriminator).items;

        _this2.forceUpdate();
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _entities.MultiValueSettingsStore.unsubscribe(this);

      freeSettingValues({
        discriminator: this.discriminator
      });
    }
  }, {
    key: "onValueChange",
    value: function onValueChange(elem, e) {
      (0, _entities2.updateMultivalueSettings)({
        discriminator: this.discriminator,
        itemType: elem.itemType,
        enabled: e.target.checked
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var model = this.props.model;
      var field = this.props.field;
      var items = (0, _lang.optional)(this.state.items, []);
      model.set(field.property, items);

      var checks = _.map(items, function (elem, i) {
        var type = elem.itemType;
        var description = _.isFunction(_this3.props.formatter) ? _this3.props.formatter(elem) : M(type);
        var key = i + "_" + type;
        var enabled = elem.enabled;
        return React.createElement("div", {
          key: key,
          className: "col-xs-12 zero-padding"
        }, React.createElement("div", {
          className: "row"
        }, React.createElement("div", {
          className: "col-xs-10 zero-padding"
        }, React.createElement("p", {
          className: "margin-top-20 text-evaluation-description"
        }, description)), React.createElement("div", {
          className: "col-xs-2 zero-padding"
        }, React.createElement("div", {
          className: "toggle-switch yesno"
        }, React.createElement("input", {
          type: "checkbox",
          hidden: "hidden",
          onChange: _this3.onValueChange.bind(_this3, elem),
          name: key,
          id: key,
          "data-property": key,
          checked: (0, _lang.optional)(enabled, false)
        }), React.createElement("label", {
          htmlFor: key,
          className: "ts-helper"
        }), React.createElement("label", {
          htmlFor: key,
          className: "ts-label"
        }, field.placeholder)))));
      });

      return React.createElement("div", {
        className: "col-xs-12 zero-padding"
      }, checks);
    }
  }]);

  return MultiCheckboxByValue;
}(_forms.Control);

exports.MultiCheckboxByValue = MultiCheckboxByValue;

var EntitiesLookupContainer =
/*#__PURE__*/
function (_Control2) {
  _inherits(EntitiesLookupContainer, _Control2);

  function EntitiesLookupContainer(props) {
    var _this4;

    _classCallCheck(this, EntitiesLookupContainer);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(EntitiesLookupContainer).call(this, props));
    _this4.discriminator = props.id;

    if (_.isEmpty(_this4.discriminator)) {
      throw new Error("Please specify an id of this lookup");
    }

    _this4.query = query.create();

    _this4.query.setPage(1);

    _this4.query.setRowsPerPage(20);

    _this4.__queryOnChange = function () {
      (0, _entities2.getLookupResult)({
        discriminator: _this4.discriminator,
        entity: _this4.props.entity,
        query: _this4.query
      });
    };

    _this4.datasource = datasource.create();
    _this4.state = {
      result: {}
    };
    return _this4;
  }

  _createClass(EntitiesLookupContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this5 = this;

      _entities.LookupStore.subscribe(this, function (state) {
        _this5.datasource.setData((0, _ajex.discriminated)(state, _this5.discriminator).result);
      });

      this.query.on("change", this.__queryOnChange);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _entities.LookupStore.unsubscribe(this);

      this.query.off("change", this.__queryOnChange);
      (0, _entities2.freeLookup)({
        discriminator: this.discriminator
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_forms.Lookup, _.assign({}, this.props, {
        query: this.query,
        datasource: this.datasource
      }));
    }
  }]);

  return EntitiesLookupContainer;
}(_forms.Control);

exports.EntitiesLookupContainer = EntitiesLookupContainer;

var ValuesLookupContainer =
/*#__PURE__*/
function (_Control3) {
  _inherits(ValuesLookupContainer, _Control3);

  function ValuesLookupContainer(props) {
    var _this6;

    _classCallCheck(this, ValuesLookupContainer);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(ValuesLookupContainer).call(this, props));
    _this6.discriminator = props.id;

    if (_.isEmpty(_this6.discriminator)) {
      throw new Error("Please specify an id for lookup");
    }

    var collection = _this6.getCollection();

    if (_.isEmpty(collection)) {
      throw new Error("Please specify a collection for lookup");
    }

    _this6.__queryOnChange = function () {
      collection = _this6.getCollection();
      (0, _entities2.getLookupValues)({
        discriminator: _this6.discriminator,
        collection: collection,
        keyword: _this6.query.keyword,
        page: _this6.query.page,
        rowsPerPage: _this6.query.rowsPerPage
      });
    };

    _this6.query = query.create();

    _this6.query.setPage(1);

    _this6.query.setRowsPerPage(15);

    _this6.datasource = datasource.create();
    _this6.state = {
      values: {}
    };
    return _this6;
  }

  _createClass(ValuesLookupContainer, [{
    key: "getCollection",
    value: function getCollection() {
      var collection = this.props.collection;

      if (_.isFunction(this.props.getCollection)) {
        collection = this.props.getCollection(this.props.model);
      }

      return collection;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this7 = this;

      _entities.LookupStore.subscribe(this, function (state) {
        _this7.datasource.setData((0, _ajex.discriminated)(state, _this7.discriminator).values);
      });

      this.query.on("change", this.__queryOnChange);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _entities.LookupStore.unsubscribe(this);

      this.query.off("change", this.__queryOnChange);
      (0, _entities2.freeLookup)({
        discriminator: this.discriminator
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_forms.Lookup, _.assign({}, this.props, {
        query: this.query,
        datasource: this.datasource
      }));
    }
  }]);

  return ValuesLookupContainer;
}(_forms.Control);

exports.ValuesLookupContainer = ValuesLookupContainer;

var ValuesSelectContainer =
/*#__PURE__*/
function (_Control4) {
  _inherits(ValuesSelectContainer, _Control4);

  function ValuesSelectContainer(props) {
    var _this8;

    _classCallCheck(this, ValuesSelectContainer);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(ValuesSelectContainer).call(this, props));
    _this8.discriminator = props.id;

    if (_.isEmpty(_this8.discriminator)) {
      throw new Error("Please specify an id for select");
    }

    if (_.isEmpty(_this8.props.collection)) {
      throw new Error("Please specify a collection for select");
    }

    _this8.datasource = datasource.create();
    return _this8;
  }

  _createClass(ValuesSelectContainer, [{
    key: "reload",
    value: function reload() {
      (0, _entities2.getSelectValues)({
        discriminator: this.discriminator,
        collection: this.props.collection,
        params: this.getParams()
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this9 = this;

      _entities.SelectStore.subscribe(this, function (state) {
        _this9.datasource.setData((0, _ajex.discriminated)(state, _this9.discriminator).values);
      });

      this.reload();
    }
  }, {
    key: "getParams",
    value: function getParams() {
      return (0, _lang.optional)(this.props.params, {});
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _entities.SelectStore.unsubscribe(this);

      (0, _entities2.freeSelect)({
        discriminator: this.discriminator
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_forms.Select, _.assign({}, this.props, {
        datasource: this.datasource
      }));
    }
  }]);

  return ValuesSelectContainer;
}(_forms.Control);

exports.ValuesSelectContainer = ValuesSelectContainer;

var EntitiesSelectContainer =
/*#__PURE__*/
function (_Control5) {
  _inherits(EntitiesSelectContainer, _Control5);

  function EntitiesSelectContainer(props) {
    var _this10;

    _classCallCheck(this, EntitiesSelectContainer);

    _this10 = _possibleConstructorReturn(this, _getPrototypeOf(EntitiesSelectContainer).call(this, props));

    if (_.isEmpty(_this10.props.entity)) {
      throw new Error("Please specify an entity for select");
    }

    _this10.discriminator = "entity_select_".concat(_this10.props.entity);
    _this10.datasource = datasource.create();
    _this10.query = null;
    return _this10;
  }

  _createClass(EntitiesSelectContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this11 = this;

      _entities.SelectStore.subscribe(this, function (state) {
        _this11.datasource.setData((0, _ajex.discriminated)(state, _this11.discriminator).values);
      });

      var model = this.props.model;
      this.query = null;

      if (this.props.query) {
        if (_.isFunction(this.props.query)) {
          this.query = this.props.query(model);
        } else {
          this.query = this.props.query;
        }
      }

      if (!_.isEmpty(this.query)) {
        this.__onQueryChange = function () {
          (0, _entities2.getSelectEntities)({
            discriminator: _this11.discriminator,
            entity: _this11.props.entity,
            query: _this11.query
          });
        };

        this.query.on("change", this.__onQueryChange);
      }

      (0, _entities2.getSelectEntities)({
        discriminator: this.discriminator,
        entity: this.props.entity,
        query: this.query
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _entities.SelectStore.unsubscribe(this);

      if (this.query) {
        this.query.off("change", this.__onQueryChange);
      }

      (0, _entities2.freeSelect)({
        discriminator: this.discriminator
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_forms.Select, _.assign({}, this.props, {
        datasource: this.datasource
      }));
    }
  }]);

  return EntitiesSelectContainer;
}(_forms.Control);

exports.EntitiesSelectContainer = EntitiesSelectContainer;

var EntitiesMultiCheckContainer =
/*#__PURE__*/
function (_Control6) {
  _inherits(EntitiesMultiCheckContainer, _Control6);

  function EntitiesMultiCheckContainer(props) {
    var _this12;

    _classCallCheck(this, EntitiesMultiCheckContainer);

    _this12 = _possibleConstructorReturn(this, _getPrototypeOf(EntitiesMultiCheckContainer).call(this, props));
    _this12.discriminator = props.id;

    if (_.isEmpty(_this12.discriminator)) {
      throw new Error("Please specify an id of this lookup");
    }

    _this12.query = query.create();
    _this12.datasource = datasource.create();
    _this12.state = {
      result: {}
    };
    return _this12;
  }

  _createClass(EntitiesMultiCheckContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this13 = this;

      _entities.LookupStore.subscribe(this, function (state) {
        _this13.datasource.setData((0, _ajex.discriminated)(state, _this13.discriminator).result);
      });

      (0, _entities2.getLookupResult)({
        discriminator: this.discriminator,
        entity: this.props.entity,
        query: this.query
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      _entities.LookupStore.unsubscribe(this);

      this.query.off("change", this.__queryOnChange);
      (0, _entities2.freeLookup)({
        discriminator: this.discriminator
      });
    }
  }, {
    key: "render",
    value: function render() {
      var entityDescriptor = (0, _lang.optional)(this.props.entityDescriptor, {});
      return React.createElement(_forms.MultiCheckbox, _.assign({}, this.props, {
        query: this.query,
        datasource: this.datasource,
        entityDescriptor: entityDescriptor,
        activeColor: this.props.activeColor
      }));
    }
  }]);

  return EntitiesMultiCheckContainer;
}(_forms.Control);

exports.EntitiesMultiCheckContainer = EntitiesMultiCheckContainer;

},{"../../actions/entities":2,"../../api/query":18,"../../stores/entities":340,"../../utils/ajex":348,"../../utils/datasource":349,"../../utils/lang":350,"./forms":353}],353:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingleFile = exports.PasswordText = exports.SingleImage = exports.MultiFile = exports.Gallery = exports.Image = exports.File = exports.Lookup = exports.Select = exports.Number = exports.Switch = exports.YesNo = exports.DateTime = exports.Mail = exports.Spacer = exports.Color = exports.ReadOnlyText = exports.TextArea = exports.Text = exports.Control = exports.InlineField = exports.Field = exports.FORM_FOOTER = exports.Form = exports.FormBody = exports.FormSubmitEvent = exports.Tabs = exports.AreaNoCard = exports.Area = exports.Label = exports.Model = exports.VALIDATION_ERROR = void 0;

var _strings = _interopRequireDefault(require("../../strings"));

var _common = require("./common");

var _lang = require("../../utils/lang");

var _events = require("../../aj/events");

var _grids = require("./grids");

var query = _interopRequireWildcard(require("../../api/query"));

var _keyboard = require("../utils/keyboard");

var inputfile = _interopRequireWildcard(require("../utils/inputfile"));

var datasource = _interopRequireWildcard(require("../../utils/datasource"));

var _ = _interopRequireWildcard(require("underscore"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var VALIDATION_ERROR = {};
exports.VALIDATION_ERROR = VALIDATION_ERROR;

var Model =
/*#__PURE__*/
function (_Observable) {
  _inherits(Model, _Observable);

  function Model(form) {
    var _this;

    _classCallCheck(this, Model);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Model).call(this));
    _this.descriptor = null;
    _this.initialData = {};
    _this.data = {};
    _this.validationResult = {};
    _this.initialized = false;
    _this.form = form;
    _this.changesTrackingDisabled = false;
    return _this;
  }

  _createClass(Model, [{
    key: "invalidateForm",
    value: function invalidateForm() {
      if (this.form) {
        this.form.forceUpdate();
      }
    }
  }, {
    key: "load",
    value: function load(data) {
      this.data = data ? data : {};

      if (!this.initialized && data != null) {
        this.invoke("load", this);
        this.initialized = true;
        this.initialData = _.clone(this.data);
      }
    }
  }, {
    key: "findField",
    value: function findField(property) {
      if (this.descriptor == null) {
        throw new Error("Please specify a descriptor");
      }

      var Break = {};
      var field = null;

      try {
        if (!_.isEmpty(this.descriptor.areas)) {
          this.descriptor.areas.forEach(function (a) {
            if (!_.isEmpty(a.tabs)) {
              a.tabs.forEach(function (t) {
                if (!_.isEmpty(t.fields)) {
                  t.fields.forEach(function (f) {
                    if (f.property == property) {
                      field = f;
                      throw Break;
                    }
                  });
                }

                if (field != null) {
                  throw Break;
                }
              });
            }

            if (field != null) {
              return;
            }

            if (!_.isEmpty(a.fields)) {
              a.fields.forEach(function (f) {
                if (f.property == property) {
                  field = f;
                  throw Break;
                }
              });
            }

            if (field != null) {
              throw Break;
            }
          });
        }

        if (field == null) {
          if (!_.isEmpty(this.descriptor.tabs)) {
            this.descriptor.tabs.forEach(function (t) {
              if (!_.isEmpty(t.fields)) {
                t.fields.forEach(function (f) {
                  if (f.property == property) {
                    field = f;
                    throw Break;
                  }
                });
              }

              if (field != null) {
                throw Break;
              }
            });
          }
        }

        if (field == null) {
          if (!_.isEmpty(this.descriptor.fields)) {
            this.descriptor.fields.forEach(function (f) {
              if (f.property == property) {
                field = f;
                throw Break;
              }
            });
          }
        }
      } catch (e) {
        if (e !== Break) {
          throw e;
        }
      }

      return field;
    }
  }, {
    key: "hasChanges",
    value: function hasChanges() {
      var d = (0, _lang.diff)(this.data, this.initialData);
      return d.length > 0;
    }
  }, {
    key: "trackChanges",
    value: function trackChanges() {
      this.changesTrackingDisabled = false;
    }
  }, {
    key: "untrackChanges",
    value: function untrackChanges() {
      this.changesTrackingDisabled = true;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.initialized = false;
      this.data = {};
      this.initialData = {};
    }
  }, {
    key: "set",
    value: function set(property, value) {
      var initialValue = this.data[property];
      this.data[property] = value;

      if (!this.changesTrackingDisabled) {
        this.invoke("property:change", property, value);
      }
    }
  }, {
    key: "assign",
    value: function assign(property, value) {
      var actual = (0, _lang.optional)(this.get(property), {});
      this.set(property, _.assign(actual, value));
    }
  }, {
    key: "get",
    value: function get(property) {
      if (_.has(this.data, property)) {
        return this.data[property];
      } else {
        return null;
      }
    }
  }, {
    key: "validateField",
    value: function validateField(validationResult, field) {
      var value = this.data[field.property];

      try {
        if (_.isFunction(field.validator)) {
          field.validator(value);
        }

        validationResult[field.property] = {
          valid: true,
          message: null
        };
      } catch (e) {
        validationResult[field.property] = {
          valid: false,
          message: e.message
        };
      }
    }
  }, {
    key: "sanitized",
    value: function sanitized() {
      var _this2 = this;

      var sanitized = {};

      _.each(_.keys(this.data), function (property) {
        var value = _this2.data[property];

        var field = _this2.findField(property);

        if (field) {
          if (_.isFunction(field.sanitizer)) {
            value = field.sanitizer(value);
          }
        }

        sanitized[property] = value;
      });

      return sanitized;
    }
  }, {
    key: "validate",
    value: function validate() {
      var _this3 = this;

      this.validationResult = {};

      if (!_.isEmpty(this.descriptor.areas)) {
        this.descriptor.areas.forEach(function (a) {
          if (!_.isEmpty(a.tabs)) {
            a.tabs.forEach(function (t) {
              if (!_.isEmpty(t.fields)) {
                t.fields.forEach(function (f) {
                  _this3.validateField(_this3.validationResult, f);
                });
              }
            });
          }

          if (!_.isEmpty(a.fields)) {
            a.fields.forEach(function (f) {
              _this3.validateField(_this3.validationResult, f);
            });
          }
        });
      }

      if (!_.isEmpty(this.descriptor.tabs)) {
        this.descriptor.tabs.forEach(function (t) {
          if (!_.isEmpty(t.fields)) {
            t.fields.forEach(function (f) {
              _this3.validateField(_this3.validationResult, f);
            });
          }
        });
      }

      if (!_.isEmpty(this.descriptor.fields)) {
        this.descriptor.fields.forEach(function (f) {
          _this3.validateField(_this3.validationResult, f);
        });
      }

      var invalid = _.any(this.validationResult, function (v) {
        return !v.valid;
      });

      if (invalid) {
        throw VALIDATION_ERROR;
      }
    }
  }, {
    key: "resetValidation",
    value: function resetValidation() {
      this.validationResult = {};
    }
  }, {
    key: "setError",
    value: function setError(property, message) {
      this.validationResult[property] = {
        valid: false,
        message: message
      };
    }
  }, {
    key: "resetError",
    value: function resetError(property) {
      this.validationResult[property] = {
        valid: true
      };
    }
  }]);

  return Model;
}(_events.Observable);

exports.Model = Model;

var Label =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Label, _React$Component);

  function Label() {
    _classCallCheck(this, Label);

    return _possibleConstructorReturn(this, _getPrototypeOf(Label).apply(this, arguments));
  }

  _createClass(Label, [{
    key: "render",
    value: function render() {
      var field = this.props.field;
      var className = (0, _lang.optional)(this.props.className, "");
      return !_.isEmpty(field.label) && React.createElement("label", {
        style: {
          width: "100%"
        },
        htmlFor: field.property,
        className: className
      }, field.label);
    }
  }]);

  return Label;
}(React.Component);

exports.Label = Label;

var Area =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Area, _React$Component2);

  function Area() {
    _classCallCheck(this, Area);

    return _possibleConstructorReturn(this, _getPrototypeOf(Area).apply(this, arguments));
  }

  _createClass(Area, [{
    key: "isFieldVisible",
    value: function isFieldVisible(field) {
      var descriptor = this.props.descriptor;
      var model = this.props.model;

      if (_.isFunction(descriptor.visibility)) {
        return descriptor.visibility(field, model, descriptor);
      }

      return true;
    }
  }, {
    key: "getExtra",
    value: function getExtra() {
      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var descriptor = this.props.descriptor;
      var area = this.props.area;
      var inline = (0, _lang.optional)(descriptor.inline, false);
      inline = (0, _lang.optional)(area.inline, inline);
      var defaultFieldCass = inline ? InlineField : Field;
      var tabs = !_.isEmpty(area.tabs) && React.createElement(Tabs, {
        tabs: area.tabs,
        model: this.props.model,
        descriptor: descriptor
      });

      var fields = !_.isEmpty(area.fields) && _.filter(area.fields, function (f) {
        return _this4.isFieldVisible(f);
      }).map(function (f) {
        return React.createElement((0, _lang.optional)(function () {
          return f.component;
        }, function () {
          return defaultFieldCass;
        }), {
          key: f.property,
          model: _this4.props.model,
          field: f,
          descriptor: descriptor
        });
      });

      return React.createElement(_common.Card, {
        title: area.title,
        subtitle: area.subtitle,
        actions: area.actions
      }, tabs, React.createElement("div", {
        className: "row"
      }, React.createElement("div", {
        className: "col-md-12"
      }, fields)), React.createElement("div", {
        className: "clearfix"
      }), this.getExtra());
    }
  }]);

  return Area;
}(React.Component);

exports.Area = Area;

var AreaNoCard =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(AreaNoCard, _React$Component3);

  function AreaNoCard() {
    _classCallCheck(this, AreaNoCard);

    return _possibleConstructorReturn(this, _getPrototypeOf(AreaNoCard).apply(this, arguments));
  }

  _createClass(AreaNoCard, [{
    key: "isFieldVisible",
    value: function isFieldVisible(field) {
      var descriptor = this.props.descriptor;
      var model = this.props.model;

      if (_.isFunction(descriptor.visibility)) {
        return descriptor.visibility(field, model, descriptor);
      }

      return true;
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var descriptor = this.props.descriptor;
      var area = this.props.area;
      var tabs = !_.isEmpty(area.tabs) && React.createElement(Tabs, {
        tabs: area.tabs,
        model: this.props.model
      });

      var fields = !_.isEmpty(area.fields) && _.filter(area.fields, function (f) {
        return _this5.isFieldVisible(f);
      }).map(function (f) {
        return React.createElement((0, _lang.optional)(function () {
          return f.component;
        }, function () {
          return Field;
        }), {
          key: f.property,
          model: _this5.props.model,
          field: f,
          descriptor: descriptor
        });
      });

      var actionKey = 1;
      return React.createElement("div", {
        className: "area-no-card"
      }, React.createElement("div", {
        className: "area-no-card-header"
      }, area.title && React.createElement("h2", null, area.title, " ", area.subtitle && React.createElement("small", null, area.subtitle)), React.createElement(_common.Actions, {
        actions: area.actions
      })), React.createElement("div", {
        className: "area-no-card-body"
      }, tabs, React.createElement("div", {
        className: "row"
      }, fields)));
    }
  }]);

  return AreaNoCard;
}(React.Component);

exports.AreaNoCard = AreaNoCard;

var Tabs =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(Tabs, _React$Component4);

  function Tabs() {
    _classCallCheck(this, Tabs);

    return _possibleConstructorReturn(this, _getPrototypeOf(Tabs).apply(this, arguments));
  }

  _createClass(Tabs, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this6 = this;

      var me = ReactDOM.findDOMNode(this);
      $(me).find(".tab-button").click(function (e) {
        e.preventDefault();
        $(_this6).tab("show");
      });
    }
  }, {
    key: "isFieldVisible",
    value: function isFieldVisible(field) {
      var descriptor = this.props.descriptor;
      var model = this.props.model;

      if (_.isFunction(descriptor.visibility)) {
        return descriptor.visibility(field, model, descriptor);
      }

      return true;
    }
  }, {
    key: "render",
    value: function render() {
      var _this7 = this;

      var descriptor = this.props.descriptor;
      var first = true;
      var tabs = this.props.tabs;
      var nav = tabs.map(function (n) {
        var el = React.createElement("li", {
          key: "nav_" + n.key,
          className: first ? "active" : ""
        }, React.createElement("a", {
          className: "tab-button",
          role: "tab",
          "data-toggle": "tab",
          href: "#".concat(n.key)
        }, n.title));
        first = false;
        return el;
      });
      first = true;
      var panes = tabs.map(function (c) {
        var inline = (0, _lang.optional)(descriptor.inline, false);
        inline = (0, _lang.optional)(c.inline, inline);
        var defaultFieldClass = inline ? InlineField : Field;

        var fields = !_.isEmpty(c.fields) && _.filter(c.fields, function (f) {
          return _this7.isFieldVisible(f);
        }).map(function (f) {
          return React.createElement((0, _lang.optional)(function () {
            return f.component;
          }, function () {
            return defaultFieldClass;
          }), {
            key: f.property,
            model: _this7.props.model,
            field: f,
            onCancel: _this7.props.onCancel,
            canSave: _this7.props.canSave
          });
        });

        return React.createElement("div", {
          key: key,
          role: "tabpanel",
          className: "tab-pane " + _this7.getTabClass(selectedTab, c.id, firstTabId),
          id: "".concat(c.key)
        }, React.createElement("div", {
          className: "row"
        }, fields), React.createElement("div", {
          className: "clearfix"
        }));
        first = false;
        return el;
      });
      return React.createElement("div", null, React.createElement("ul", {
        className: "tab-nav",
        style: {
          textAlign: "center"
        },
        role: "tablist"
      }, nav), React.createElement("div", {
        className: "tab-content"
      }, panes));
    }
  }]);

  return Tabs;
}(React.Component);

exports.Tabs = Tabs;
var AREA_KEY = 1;
var TAB_KEY = 1;

function generateKeys(descriptor) {
  if (!descriptor.hasKeys) {
    if (!_.isEmpty(descriptor.areas)) {
      descriptor.areas.forEach(function (a) {
        if (_.isEmpty(a.key)) {
          a.key = "area" + AREA_KEY++;
        }

        if (!_.isEmpty(a.tabs)) {
          a.tabs.forEach(function (t) {
            if (_.isEmpty(t.key)) {
              t.key = "tab" + TAB_KEY++;
            }
          });
        }
      });
    }

    if (!_.isEmpty(descriptor.tabs)) {
      descriptor.tabs.forEach(function (t) {
        if (_.isEmpty(t.key)) {
          t.key = "tab" + TAB_KEY++;
        }
      });
    }

    descriptor.hasKeys = true;
  }
}

var FormSubmitEvent =
/*#__PURE__*/
function () {
  function FormSubmitEvent(form, model) {
    _classCallCheck(this, FormSubmitEvent);

    this.form = form;
    this.model = model;
    this.stopped = false;
  }

  _createClass(FormSubmitEvent, [{
    key: "stop",
    value: function stop() {
      this.stopped = true;
    }
  }, {
    key: "forceSubmit",
    value: function forceSubmit() {
      this.form.forceSubmit();
    }
  }]);

  return FormSubmitEvent;
}();

exports.FormSubmitEvent = FormSubmitEvent;

var FormBody =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(FormBody, _React$Component5);

  function FormBody() {
    _classCallCheck(this, FormBody);

    return _possibleConstructorReturn(this, _getPrototypeOf(FormBody).apply(this, arguments));
  }

  _createClass(FormBody, [{
    key: "isFieldVisible",
    value: function isFieldVisible(field) {
      var descriptor = this.props.descriptor;
      var model = this.props.model;

      if (_.isFunction(descriptor.visibility)) {
        return descriptor.visibility(field, model, descriptor);
      }

      return true;
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      var descriptor = this.props.descriptor;
      generateKeys(descriptor);
      var model = this.props.model;
      var inline = (0, _lang.optional)(descriptor.inline, false);
      var defaultFieldCass = inline ? InlineField : Field;
      var areas = !_.isEmpty(descriptor.areas) && descriptor.areas.map(function (a) {
        return React.createElement((0, _lang.optional)(function () {
          return a.component;
        }, function () {
          return Area;
        }), {
          key: a.key,
          model: model,
          area: a,
          descriptor: descriptor
        });
      });
      var tabs = !_.isEmpty(descriptor.tabs) && React.createElement(Tabs, {
        tabs: descriptor.tabs,
        model: model,
        descriptor: descriptor
      });

      var fields = !_.isEmpty(descriptor.fields) && _.filter(descriptor.fields, function (f) {
        return _this8.isFieldVisible(f);
      }).map(function (f) {
        return React.createElement((0, _lang.optional)(function () {
          return f.component;
        }, function () {
          return defaultFieldCass;
        }), {
          key: f.property,
          model: model,
          field: f,
          descriptor: descriptor,
          params: _this8.props.params,
          onCancel: _this8.props.onCancel
        });
      });

      var showInCard = (0, _lang.optional)(descriptor.showInCard, true);
      return React.createElement("div", {
        className: "form-body"
      }, areas, (tabs.length > 0 || fields.length > 0) && (showInCard ? React.createElement(_common.Card, {
        padding: "false"
      }, tabs, React.createElement("div", {
        className: "p-l-30 p-r-30"
      }, fields), React.createElement("div", {
        className: "clearfix"
      })) : React.createElement("div", {
        className: "form-body-content"
      }, tabs, fields, React.createElement("div", {
        className: "clearfix"
      }))));
    }
  }]);

  return FormBody;
}(React.Component);

exports.FormBody = FormBody;

var Form =
/*#__PURE__*/
function (_React$Component6) {
  _inherits(Form, _React$Component6);

  function Form(props) {
    var _this9;

    _classCallCheck(this, Form);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(Form).call(this, props));
    _this9.model = new Model(_assertThisInitialized(_this9));

    _this9.model.once("load", function () {
      var descriptor = _this9.props.descriptor;

      if (_.isFunction(descriptor.onModelLoadFirstTime)) {
        descriptor.onModelLoadFirstTime(_this9.model);
      }
    });

    _this9.model.on("load", function () {
      var descriptor = _this9.props.descriptor;

      if (_.isFunction(descriptor.onModelLoad)) {
        descriptor.onModelLoad(_this9.model);
      }
    });

    return _this9;
  }

  _createClass(Form, [{
    key: "submit",
    value: function submit() {
      this.onSubmit();
    }
  }, {
    key: "forceSubmit",
    value: function forceSubmit() {
      if (_.isFunction(this.props.onSubmit)) {
        this.props.onSubmit(this.model.sanitized());
      }
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(e) {
      if (e) {
        e.preventDefault();
      }

      var event = new FormSubmitEvent(this, this.model);

      try {
        var descriptor = this.props.descriptor;

        if (_.isFunction(descriptor.beforeSubmit)) {
          descriptor.beforeSubmit(event);

          if (event.stopped) {
            return;
          }
        }
      } catch (e) {
        if (e === VALIDATION_ERROR) {
          this.forceUpdate();
          return;
        } else {
          throw e;
        }
      }

      try {
        this.model.validate();

        if (_.isFunction(this.props.onSubmit)) {
          this.props.onSubmit(this.model.sanitized());
        }
      } catch (e) {
        if (e === VALIDATION_ERROR) {
          this.forceUpdate();
        } else {
          throw e;
        }
      }
    }
  }, {
    key: "onCancel",
    value: function onCancel(e) {
      if (_.isFunction(this.props.onCancel)) {
        this.props.onCancel();
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.model.descriptor = nextProps.descriptor;
      this.model.load(nextProps.data);
    }
  }, {
    key: "isFieldVisible",
    value: function isFieldVisible(field) {
      var descriptor = this.props.descriptor;
      var model = this.model;

      if (_.isFunction(descriptor.visibility)) {
        return descriptor.visibility(field, model, descriptor);
      }

      return true;
    }
  }, {
    key: "getExtra",
    value: function getExtra() {
      return null;
    }
  }, {
    key: "showFormFooter",
    value: function showFormFooter() {
      return (0, _lang.optional)(this.props.descriptor.showFormFooter, true);
    }
  }, {
    key: "render",
    value: function render() {
      var descriptor = this.props.descriptor;
      var model = this.model;
      var inline = (0, _lang.optional)(descriptor.inline, false);
      var className = inline ? "form-horizontal" : "";
      var canSave = this.props.canSave;
      var canCancel = this.props.canCancel;
      var showFormFooter = this.showFormFooter();
      return React.createElement("div", {
        className: "form"
      }, React.createElement("form", {
        action: "javascript:;",
        className: className,
        role: "form",
        onSubmit: this.onSubmit.bind(this)
      }, React.createElement(FormBody, {
        descriptor: descriptor,
        model: model
      }), showFormFooter && React.createElement(FormFooter, {
        descriptor: descriptor,
        model: model,
        onCancel: this.onCancel.bind(this)
      }), React.createElement("div", {
        className: "clearfix"
      }), this.getExtra()));
    }
  }]);

  return Form;
}(React.Component);

exports.Form = Form;

var FormFooter =
/*#__PURE__*/
function (_React$Component7) {
  _inherits(FormFooter, _React$Component7);

  function FormFooter(props) {
    _classCallCheck(this, FormFooter);

    return _possibleConstructorReturn(this, _getPrototypeOf(FormFooter).call(this, props));
  }

  _createClass(FormFooter, [{
    key: "onCancel",
    value: function onCancel() {
      if (_.isFunction(this.props.onCancel)) {
        this.props.onCancel();
      }
    }
  }, {
    key: "canSave",
    value: function canSave() {
      var descriptor = this.props.descriptor;
      return _.isFunction(descriptor.canSave) ? descriptor.canSave(this.props.model) : true;
    }
  }, {
    key: "canCancel",
    value: function canCancel() {
      var descriptor = this.props.descriptor;
      return _.isFunction(descriptor.canCancel) ? descriptor.canCancel(this.props.model) : true;
    }
  }, {
    key: "render",
    value: function render() {
      var descriptor = this.props.descriptor;
      var submitText = (0, _strings["default"])("save");
      var cancelText = (0, _strings["default"])("back");

      if (descriptor) {
        if (descriptor.submitText) {
          submitText = descriptor.submitText;
        }

        if (descriptor.cancelText) {
          cancelText = descriptor.cancelText;
        }
      }

      var style = {
        marginBottom: "30px"
      };
      var canSave = this.canSave();
      var canCancel = this.canCancel();
      return React.createElement("div", {
        className: "btn-actions-bar",
        style: style
      }, canCancel && React.createElement("button", {
        type: "button",
        className: "btn btn-dark",
        onClick: this.onCancel.bind(this)
      }, React.createElement("i", {
        className: "zmdi zmdi-arrow-back"
      }), " ", cancelText), canSave && React.createElement("button", {
        type: "submit",
        className: "btn btn-primary"
      }, React.createElement("i", {
        className: "zmdi zmdi-save"
      }), " ", submitText));
    }
  }]);

  return FormFooter;
}(React.Component);
/************************
    Controls and Fields
 ************************/


var FORM_FOOTER = "actionsButtons";
exports.FORM_FOOTER = FORM_FOOTER;

var Field =
/*#__PURE__*/
function (_React$Component8) {
  _inherits(Field, _React$Component8);

  function Field() {
    _classCallCheck(this, Field);

    return _possibleConstructorReturn(this, _getPrototypeOf(Field).apply(this, arguments));
  }

  _createClass(Field, [{
    key: "render",
    value: function render() {
      if (this.props.field.property == FORM_FOOTER) {
        return React.createElement(FormFooter, {
          descriptor: this.props.descriptor,
          model: this.props.model,
          onCancel: this.onCancel.bind(this)
        });
      }

      var model = this.props.model;
      var className = "form-group " + (this.props.field.size ? this.props.field.size : "col-sm-12");
      var control = React.createElement(_.isFunction(this.props.field.getControl) ? this.props.field.getControl(model) : this.props.field.control, _.assign({
        field: this.props.field,
        model: this.props.model
      }, this.props.field.props));
      var hasLabel = this.props.field.label != undefined && this.props.field.label != null;
      var validationResult = (0, _lang.optional)(model.validationResult[this.props.field.property], {
        valid: true
      });

      if (!validationResult.valid) {
        className += " has-error";
      }

      if (!_.isEmpty(this.props.field.className)) {
        className += " " + this.props.field.className;
      }

      return React.createElement("div", {
        className: className,
        style: {
          minHeight: 58
        }
      }, hasLabel && React.createElement(Label, {
        field: this.props.field
      }), control, !validationResult.valid && !_.isEmpty(validationResult.message) && React.createElement("small", {
        className: "help-block"
      }, validationResult.message), React.createElement("i", {
        className: "form-group__bar"
      }));
    }
  }]);

  return Field;
}(React.Component);

exports.Field = Field;

var InlineField =
/*#__PURE__*/
function (_React$Component9) {
  _inherits(InlineField, _React$Component9);

  function InlineField() {
    _classCallCheck(this, InlineField);

    return _possibleConstructorReturn(this, _getPrototypeOf(InlineField).apply(this, arguments));
  }

  _createClass(InlineField, [{
    key: "render",
    value: function render() {
      if (this.props.field.property == FORM_FOOTER) {
        return React.createElement(FormFooter, {
          descriptor: this.props.descriptor,
          model: this.props.model,
          onCancel: this.onCancel.bind(this)
        });
      }

      var model = this.props.model;
      var className = "form-group " + (this.props.field.size ? this.props.field.size : "col-sm-12");
      var control = React.createElement(this.props.field.control, _.assign({
        field: this.props.field,
        model: this.props.model
      }, this.props.field.props));
      var hasLabel = this.props.field.label != undefined && this.props.field.label != null;
      var inline = (0, _lang.optional)(this.props.inline, false);
      var controlSize = hasLabel ? "col-sm-10" : "col-sm-12";
      var validationResult = (0, _lang.optional)(model.validationResult[this.props.field.property], {
        valid: true
      });

      if (!validationResult.valid) {
        className += " has-error";
      }

      if (!_.isEmpty(this.props.field.className)) {
        className += " " + this.props.field.className;
      }

      return React.createElement("div", {
        className: className
      }, hasLabel && React.createElement("div", {
        className: "col-sm-2"
      }, React.createElement(Label, {
        field: this.props.field,
        className: "control-label"
      })), React.createElement("div", {
        className: controlSize
      }, control, !validationResult.valid && !_.isEmpty(validationResult.message) && React.createElement("small", {
        className: "help-block"
      }, validationResult.message)), React.createElement("i", {
        className: "form-group__bar"
      }));
    }
  }]);

  return InlineField;
}(React.Component);

exports.InlineField = InlineField;

var Control =
/*#__PURE__*/
function (_React$Component10) {
  _inherits(Control, _React$Component10);

  function Control(props) {
    _classCallCheck(this, Control);

    return _possibleConstructorReturn(this, _getPrototypeOf(Control).call(this, props));
  }

  _createClass(Control, [{
    key: "onValueChange",
    value: function onValueChange(e) {
      var value = e.target.value;
      var model = this.props.model;
      var field = this.props.field;
      model.set(field.property, value);
      this.forceUpdate();
    }
  }]);

  return Control;
}(React.Component);

exports.Control = Control;

var Text =
/*#__PURE__*/
function (_Control) {
  _inherits(Text, _Control);

  function Text() {
    _classCallCheck(this, Text);

    return _possibleConstructorReturn(this, _getPrototypeOf(Text).apply(this, arguments));
  }

  _createClass(Text, [{
    key: "render",
    value: function render() {
      var field = this.props.field;
      return React.createElement("input", {
        type: "text",
        className: "form-control input-sm",
        id: field.property,
        "data-property": field.property,
        placeholder: field.placeholder,
        value: (0, _lang.optional)(this.props.model.get(field.property), ""),
        onChange: this.onValueChange.bind(this)
      });
    }
  }]);

  return Text;
}(Control);

exports.Text = Text;

var TextArea =
/*#__PURE__*/
function (_Control2) {
  _inherits(TextArea, _Control2);

  function TextArea() {
    _classCallCheck(this, TextArea);

    return _possibleConstructorReturn(this, _getPrototypeOf(TextArea).apply(this, arguments));
  }

  _createClass(TextArea, [{
    key: "render",
    value: function render() {
      var field = this.props.field;
      var style = {
        height: (0, _lang.optional)(this.props.height, "150px")
      };
      return React.createElement("textarea", {
        style: style,
        className: "form-control",
        id: field.property,
        "data-property": field.property,
        placeholder: field.placeholder,
        value: (0, _lang.optional)(this.props.model.get(field.property), ""),
        onChange: this.onValueChange.bind(this)
      });
    }
  }]);

  return TextArea;
}(Control);

exports.TextArea = TextArea;

var ReadOnlyText =
/*#__PURE__*/
function (_Control3) {
  _inherits(ReadOnlyText, _Control3);

  function ReadOnlyText() {
    _classCallCheck(this, ReadOnlyText);

    return _possibleConstructorReturn(this, _getPrototypeOf(ReadOnlyText).apply(this, arguments));
  }

  _createClass(ReadOnlyText, [{
    key: "getText",
    value: function getText() {
      var _this10 = this;

      var field = this.props.field;
      var model = this.props.model;
      var formatter = (0, _lang.optional)(function () {
        return _this10.props.formatter;
      }, function () {
        return function (v) {
          return v;
        };
      });
      return (0, _lang.optional)(formatter(model.get(field.property)), "");
    }
  }, {
    key: "render",
    value: function render() {
      var field = this.props.field;
      return React.createElement("input", {
        disabled: "disabled",
        readOnly: "readOnly",
        type: "text",
        className: "form-control input-sm",
        id: field.property,
        "data-property": field.property,
        placeholder: field.placeholder,
        value: this.getText(),
        onChange: this.onValueChange.bind(this)
      });
    }
  }]);

  return ReadOnlyText;
}(Control);

exports.ReadOnlyText = ReadOnlyText;

var Color =
/*#__PURE__*/
function (_Control4) {
  _inherits(Color, _Control4);

  function Color() {
    _classCallCheck(this, Color);

    return _possibleConstructorReturn(this, _getPrototypeOf(Color).apply(this, arguments));
  }

  _createClass(Color, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this11 = this;

      var field = this.props.field;
      var model = this.props.model;
      var me = ReactDOM.findDOMNode(this);
      var input = $(me).find("#" + field.property);
      $(me).find(".color-picker").farbtastic(function (v) {
        model.set(field.property, v);

        _this11.forceUpdate();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var field = this.props.field;
      var value = this.props.model.get(field.property);
      var colorStyle = {
        backgroundColor: "".concat((0, _lang.optional)(value, "#000000"))
      };
      return React.createElement("div", {
        className: "cp-container"
      }, React.createElement("div", {
        className: ""
      }, React.createElement("div", {
        className: "dropdown"
      }, React.createElement("input", {
        type: "text",
        className: "form-control cp-value",
        "data-toggle": "dropdown",
        "aria-expanded": "false",
        id: field.property,
        "data-property": field.property,
        placeholder: field.placeholder,
        value: (0, _lang.optional)(this.props.model.get(field.property), ""),
        onChange: this.onValueChange.bind(this)
      }), React.createElement("div", {
        className: "dropdown-menu"
      }, React.createElement("div", {
        className: "color-picker",
        "data-cp-default": "#000000"
      })), React.createElement("i", {
        className: "cp-value",
        style: colorStyle
      }))));
    }
  }]);

  return Color;
}(Control);

exports.Color = Color;

var Spacer =
/*#__PURE__*/
function (_Control5) {
  _inherits(Spacer, _Control5);

  function Spacer() {
    _classCallCheck(this, Spacer);

    return _possibleConstructorReturn(this, _getPrototypeOf(Spacer).apply(this, arguments));
  }

  _createClass(Spacer, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "form-spacer-control"
      });
    }
  }]);

  return Spacer;
}(Control);

exports.Spacer = Spacer;

var Mail =
/*#__PURE__*/
function (_Control6) {
  _inherits(Mail, _Control6);

  function Mail() {
    _classCallCheck(this, Mail);

    return _possibleConstructorReturn(this, _getPrototypeOf(Mail).apply(this, arguments));
  }

  _createClass(Mail, [{
    key: "render",
    value: function render() {
      var field = this.props.field;
      return React.createElement("input", {
        type: "email",
        className: "form-control input-sm",
        id: field.property,
        "data-property": field.property,
        placeholder: field.placeholder,
        value: (0, _lang.optional)(this.props.model.get(field.property), ""),
        onChange: this.onValueChange.bind(this)
      });
    }
  }]);

  return Mail;
}(Control);

exports.Mail = Mail;

var DateTime =
/*#__PURE__*/
function (_Control7) {
  _inherits(DateTime, _Control7);

  function DateTime() {
    _classCallCheck(this, DateTime);

    return _possibleConstructorReturn(this, _getPrototypeOf(DateTime).apply(this, arguments));
  }

  _createClass(DateTime, [{
    key: "getDefaultFormat",
    value: function getDefaultFormat() {
      return "DD/MM/YYYY";
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var self = this;
      var me = ReactDOM.findDOMNode(this);
      var field = this.props.field;
      var model = this.props.model;
      $(me).on("dp.change", function (e) {
        if (e.date) {
          var date = e.date.toDate();
          var time = date.getTime();
          model.set(field.property, time);
        } else {
          model.set(field.property, null);
        }
      });
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(props, state) {
      if (props.model) {
        this.setData();
      }
    }
  }, {
    key: "setData",
    value: function setData() {
      var self = this;
      var options = {
        locale: this.props.locale,
        format: this.props.format ? this.props.format : self.getDefaultFormat()
      };
      var minDate = this.props.getMinDate && this.props.getMinDate(this.props.model);
      var maxDate = this.props.getMaxDate && this.props.getMaxDate(this.props.model);
      var disabledDates = this.props.getDisabledDates && this.props.getDisabledDates(this.props.model);

      if (minDate) {
        options["minDate"] = minDate;
      }

      if (maxDate) {
        options["maxDate"] = maxDate;
      }

      if (disabledDates) {
        options["disabledDates"] = disabledDates;
      }

      var field = this.props.field;
      var model = this.props.model;
      var me = ReactDOM.findDOMNode(this);
      var value = model.get(field.property);
      if ($(me).data('DateTimePicker')) $(me).data('DateTimePicker').destroy();
      $(me).datetimepicker(options);
      $(me).data("DateTimePicker").date(value ? new Date(value) : null);
    }
  }, {
    key: "isDisabled",
    value: function isDisabled() {
      return _.isFunction(this.props.isDisabled) ? this.props.isDisabled(this.props.model) : false;
    }
  }, {
    key: "render",
    value: function render() {
      var disabled = this.isDisabled();
      var field = this.props.field;
      return React.createElement("div", {
        className: "input-group"
      }, React.createElement("input", {
        disabled: disabled,
        type: "text",
        className: "form-control input-sm",
        id: field.property,
        "data-property": field.property,
        placeholder: field.placeholder
      }), React.createElement("div", {
        className: "input-group-addon"
      }, React.createElement("span", {
        className: "zmdi zmdi-calendar"
      })));
    }
  }]);

  return DateTime;
}(Control);

exports.DateTime = DateTime;

var YesNo =
/*#__PURE__*/
function (_Control8) {
  _inherits(YesNo, _Control8);

  function YesNo() {
    _classCallCheck(this, YesNo);

    return _possibleConstructorReturn(this, _getPrototypeOf(YesNo).apply(this, arguments));
  }

  _createClass(YesNo, [{
    key: "onValueChange",
    value: function onValueChange(e) {
      var value = (0, _lang.parseBoolean)(e.target.value);
      var model = this.props.model;
      var field = this.props.field;
      model.set(field.property, value);
      this.forceUpdate();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var model = this.props.model;
      var field = this.props.field;

      var fn = function fn() {
        var value = (0, _lang.parseBoolean)(model.get(field.property));

        if (value === null || value === undefined) {
          value = false;
        }

        model.untrackChanges();
        model.set(field.property, value);
        model.trackChanges();
      };

      model.once("load", fn);
      fn();
    }
  }, {
    key: "render",
    value: function render() {
      var field = this.props.field;
      var yesText = (0, _lang.optional)(this.props.yesText, "Yes");
      var noText = (0, _lang.optional)(this.props.noText, "No");
      var yesId = "__yesno-".concat(field.property, "-yes");
      var noId = "__yesno-".concat(field.property, "-no");
      return React.createElement("div", {
        className: "yesno"
      }, React.createElement("div", {
        className: "radio radio--inline"
      }, React.createElement("input", {
        id: yesId,
        type: "radio",
        name: field.property,
        value: "true",
        checked: (0, _lang.optional)(this.props.model.get(field.property), false),
        onChange: this.onValueChange.bind(this)
      }), React.createElement("label", {
        htmlFor: yesId,
        className: "radio__label"
      }, yesText)), React.createElement("div", {
        className: "radio radio--inline"
      }, React.createElement("input", {
        id: noId,
        type: "radio",
        name: field.property,
        value: "false",
        checked: !(0, _lang.optional)(this.props.model.get(field.property), false),
        onChange: this.onValueChange.bind(this)
      }), React.createElement("label", {
        htmlFor: noId,
        className: "radio__label"
      }, noText)));
    }
  }]);

  return YesNo;
}(Control);

exports.YesNo = YesNo;

var Switch =
/*#__PURE__*/
function (_Control9) {
  _inherits(Switch, _Control9);

  function Switch() {
    _classCallCheck(this, Switch);

    return _possibleConstructorReturn(this, _getPrototypeOf(Switch).apply(this, arguments));
  }

  _createClass(Switch, [{
    key: "onValueChange",
    value: function onValueChange(e) {
      var value = e.target.checked;
      var model = this.props.model;
      var field = this.props.field;
      model.set(field.property, value);
      this.forceUpdate();
    }
  }, {
    key: "render",
    value: function render() {
      var field = this.props.field;
      return React.createElement("div", {
        className: "toggle-switch"
      }, React.createElement("input", {
        type: "checkbox",
        hidden: "hidden",
        name: field.property,
        id: field.property,
        "data-property": field.property,
        checked: (0, _lang.optional)(this.props.model.get(field.property), false),
        onChange: this.onValueChange.bind(this)
      }), React.createElement("label", {
        htmlFor: field.property,
        className: "ts-helper"
      }), React.createElement("label", {
        htmlFor: field.property,
        className: "ts-label"
      }, field.placeholder));
    }
  }]);

  return Switch;
}(Control);

exports.Switch = Switch;

var Number =
/*#__PURE__*/
function (_Control10) {
  _inherits(Number, _Control10);

  function Number(props) {
    var _this12;

    _classCallCheck(this, Number);

    _this12 = _possibleConstructorReturn(this, _getPrototypeOf(Number).call(this, props));

    _this12.setState({});

    return _this12;
  } // getMinValue() {
  //     return _.isFunction(this.props.getMinValue) ? this.props.getMinValue(this.props.model) : 0;
  // }


  _createClass(Number, [{
    key: "onValueChange",
    value: function onValueChange(e) {
      var value = e.target.value;
      var model = this.props.model;
      var field = this.props.field;

      if (value == "" || value == "-" || (this.props.onlyInteger ? value.match(/^\d+$/) : value.match(/^-?(\d+\.?\d{0,9}|\.\d{1,9})$/))) {
        model.set(field.property, value);
        this.forceUpdate();

        if (_.isFunction(this.props.performOnChange)) {
          this.props.performOnChange(this.props.model, value);
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var field = this.props.field;
      return React.createElement("input", {
        ref: "text",
        type: "text",
        className: "form-control input-sm",
        id: field.property,
        "data-property": field.property,
        placeholder: field.placeholder,
        value: (0, _lang.optional)(this.props.model.get(field.property), ""),
        onChange: this.onValueChange.bind(this)
      });
    }
  }]);

  return Number;
}(Control);

exports.Number = Number;

var Select =
/*#__PURE__*/
function (_Control11) {
  _inherits(Select, _Control11);

  function Select(props) {
    var _this13;

    _classCallCheck(this, Select);

    _this13 = _possibleConstructorReturn(this, _getPrototypeOf(Select).call(this, props));

    _this13.__dataSourceOnChange = function (data) {
      _this13.forceUpdate();
    };

    return _this13;
  }

  _createClass(Select, [{
    key: "onValueChange",
    value: function onValueChange(e) {
      var multiple = (0, _lang.optional)(this.props.multiple, false);
      var value = $(e.target).val();
      var model = this.props.model;
      var field = this.props.field;

      if (multiple) {
        if (value == null) {
          value = [];
        }
      }

      model.set(field.property, value);
      this.forceUpdate();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!_.isEmpty(this.props.datasource)) {
        this.props.datasource.on("change", this.__dataSourceOnChange);
      }

      var me = ReactDOM.findDOMNode(this);
      var model = this.props.model;
      var field = this.props.field;
      var multiple = (0, _lang.optional)(this.props.multiple, false);
      $(me).focus(function () {
        $(me).addClass("fg-toggled");
      }).blur(function () {
        $(me).removeClass("fg-toggled");
      });
      $(me).find("select").select2({
        liveSearch: (0, _lang.optional)(this.props.searchEnabled, false)
      }).on("loaded.bs.select", function () {
        if (_.isEmpty(model.get(field.property))) {
          var value = $(this).val();

          if (multiple) {
            if (_.isEmpty(value)) {
              value = [];
            }
          }

          model.untrackChanges();
          model.set(field.property, value);
          model.trackChanges();
        }
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var model = this.props.model;
      var field = this.props.field;
      var me = ReactDOM.findDOMNode(this);
      var multiple = (0, _lang.optional)(this.props.multiple, false);
      $(me).find("select").select2();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!_.isEmpty(this.props.datasource)) {
        this.props.datasource.off("change", this.__dataSourceOnChange);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var model = this.props.model;
      var field = this.props.field;
      var datasource = this.props.datasource;
      var options = (0, _lang.optional)(function () {
        return datasource.data.rows;
      }, []).map(function (o) {
        return React.createElement("option", {
          key: o.value,
          value: o.value
        }, o.label);
      });
      var multiple = (0, _lang.optional)(this.props.multiple, false);
      return React.createElement("select", {
        id: field.property,
        className: "form-control",
        "data-property": field.property,
        onChange: this.onValueChange.bind(this),
        title: field.placeholder,
        value: (0, _lang.optional)(model.get(field.property), multiple ? [] : ""),
        multiple: multiple
      }, this.props.allowNull && React.createElement("option", {
        key: "empty",
        value: "",
        style: {
          color: "#999999"
        }
      }, (0, _lang.optional)(this.props.nullText, "(none)")), options);
    }
  }]);

  return Select;
}(Control);

exports.Select = Select;

var Lookup =
/*#__PURE__*/
function (_Control12) {
  _inherits(Lookup, _Control12);

  function Lookup(props) {
    var _this14;

    _classCallCheck(this, Lookup);

    _this14 = _possibleConstructorReturn(this, _getPrototypeOf(Lookup).call(this, props));
    _this14.datasource = _this14.props.datasource || datasource.create();
    _this14.query = _this14.props.query || query.create();

    _this14.__dataSourceOnChange = function (data) {
      _this14.forceUpdate();
    };

    _this14.__queryChange = function () {
      if (_.isFunction(_this14.props.loader)) {
        _this14.props.loader(_this14.query, _this14.datasource);
      }
    };

    return _this14;
  }

  _createClass(Lookup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.datasource.on("change", this.__dataSourceOnChange);
      this.query.on("change", this.__queryChange);
      var me = ReactDOM.findDOMNode(this);
      $(me).find(".selection-row").mouseenter(function () {
        $(this).find(".action").stop().fadeIn(250);
      }).mouseleave(function () {
        $(this).find(".action").stop().fadeOut(250);
      }).find(".action").hide();
      $(me).focus(function () {
        $(me).addClass("fg-toggled");
      }).blur(function () {
        $(me).removeClass("fg-toggled");
      });
      $(me).find(".lookup-grid").modal({
        show: false
      });

      if (_.isFunction(this.props.loader)) {
        this.props.loader(this.query, this.datasource);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.datasource.off("change", this.__dataSourceOnChange);
      this.query.off("change", this.__queryChange);
    }
  }, {
    key: "showEntities",
    value: function showEntities(e) {
      e.stopPropagation();

      if (!this.dialogAlreadyOpened) {
        if (this.props.query) {
          this.props.query.invokeChange();
        }
      }

      this.dialogAlreadyOpened = true;
      var me = ReactDOM.findDOMNode(this);
      $(me).find(".lookup-grid").modal("show");
    }
  }, {
    key: "select",
    value: function select() {
      var me = ReactDOM.findDOMNode(this);
      $(me).find(".lookup-grid").modal("hide");
      var model = this.props.model;
      var field = this.props.field;
      var grid = this.refs.searchGrid;
      var current = (0, _lang.optional)(model.get(field.property), []);
      var selection = (0, _lang.optional)(grid.getSelection(), []);
      var mode = this.checkedMode();
      var result = null;

      if (mode == "single") {
        if (selection.length == 0) {
          return;
        }

        result = selection[0];
      } else if (mode == "multiple") {
        result = _.union(current, []);
        selection.forEach(function (s) {
          var comparer = function comparer(r) {
            if (_.has(s, "id")) {
              return s.id == r.id;
            } else {
              return _.isEqual(s, r);
            }
          };

          if (!_.any(result, comparer)) {
            result.push(s);
          }
        });
      }

      model.set(field.property, result);
      this.forceUpdate();
    }
  }, {
    key: "remove",
    value: function remove(e) {
      e.stopPropagation();
      var mode = this.checkedMode();

      if (mode == "single") {
        this.removeAll();
      } else if (mode == "multiple") {
        this.removeSelection();
      }
    }
  }, {
    key: "removeRow",
    value: function removeRow(row) {
      var model = this.props.model;
      var field = this.props.field;
      var current = (0, _lang.optional)(model.get(field.property), []);

      var result = _.filter(current, function (r) {
        if (_.has(row, "id")) {
          return row.id != r.id;
        } else {
          return !_.isEqual(row, r);
        }
      });

      model.set(field.property, result);
      this.forceUpdate();
    }
  }, {
    key: "removeSelection",
    value: function removeSelection() {
      var model = this.props.model;
      var field = this.props.field;
      var grid = this.refs.selectionGrid;
      var selection = grid.getSelection();
      var current = (0, _lang.optional)(model.get(field.property), []);

      var result = _.filter(current, function (c) {
        return !_.any(selection, function (r) {
          if (_.has(c, "id")) {
            return c.id == r.id;
          } else {
            return _.isEqual(c, r);
          }
        });
      });

      model.set(field.property, result);
      this.forceUpdate();
    }
  }, {
    key: "removeAll",
    value: function removeAll() {
      var mode = this.checkedMode();
      var model = this.props.model;
      var field = this.props.field;
      var v = null;

      if (mode == "single") {
        v = null;
      } else if (mode == "multiple") {
        v = [];
      }

      model.set(field.property, v);
      this.forceUpdate();
    }
  }, {
    key: "checkedMode",
    value: function checkedMode() {
      var mode = this.props.mode;

      if ("multiple" != mode && "single" != mode) {
        throw new Error("Please specify a mode for lookup: [single|multiple]");
      }

      return mode;
    }
  }, {
    key: "getHeaderText",
    value: function getHeaderText() {
      var field = this.props.field;
      var mode = this.checkedMode();
      var model = this.props.model;
      var value = model.get(field.property);

      if (_.isEmpty(value)) {
        return React.createElement("span", {
          className: "placeholder"
        }, this.getPlaceholderText());
      } else {
        return this.getCurrentValueDescription();
      }
    }
  }, {
    key: "getCurrentValueDescription",
    value: function getCurrentValueDescription() {
      var model = this.props.model;
      var field = this.props.field;
      var mode = this.checkedMode();

      if (mode == "multiple") {
        var rows = model.get(field.property);
        return rows.length == 1 ? (0, _strings["default"])("oneElementSelected") : (0, _lang.format)((0, _strings["default"])("nElementsSelected"), rows.length);
      } else if (mode == "single") {
        var row = model.get(field.property);

        if (row == null) {
          return "";
        }

        var customFormatter = field.formatter || this.props.formatter;
        var formatter = _.isFunction(customFormatter) ? customFormatter : function (row) {
          if (_.has(row, "name")) {
            return row["name"];
          } else if (_.has(row, "description")) {
            return row["description"];
          } else {
            return JSON.stringify(row);
          }
        };
        return formatter(row);
      }
    }
  }, {
    key: "onGridKeyDown",
    value: function onGridKeyDown(e) {
      if ((0, _keyboard.isCancel)(e.which)) {
        this.remove(e);
        e.preventDefault();
      }
    }
  }, {
    key: "getPlaceholderText",
    value: function getPlaceholderText() {
      var field = this.props.field;

      if (field.placeholder) {
        return field.placeholder;
      } else {
        return (0, _strings["default"])("nothingSelected");
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this15 = this;

      var mode = this.checkedMode();
      var model = this.props.model;
      var field = this.props.field;
      var rows = model.get(field.property) || [];
      var selectionGrid = mode == "multiple" ? _.assign({}, this.props.selectionGrid, {
        columns: _.union(this.props.selectionGrid.columns, [{
          cell: _grids.ActionsCell,
          tdClassName: "grid-actions",
          actions: [{
            icon: "zmdi zmdi-delete",
            action: function action(row) {
              return _this15.removeRow(row);
            }
          }]
        }])
      }) : null;
      var addClassName;

      if (mode == "single") {
        addClassName = "zmdi zmdi-more";
      } else if (mode == "multiple") {
        addClassName = "zmdi zmdi-plus";
      }

      return React.createElement("div", {
        className: "fg-line",
        tabIndex: "0"
      }, React.createElement("div", {
        className: "lookup"
      }, React.createElement("div", {
        className: "lookup-header",
        onClick: this.showEntities.bind(this)
      }, React.createElement("div", {
        className: "actions"
      }, React.createElement("a", {
        href: "javascript:;",
        className: "actions__item",
        title: (0, _strings["default"])("remove"),
        onClick: this.remove.bind(this)
      }, React.createElement("i", {
        className: "zmdi zmdi-close"
      })), React.createElement("a", {
        href: "javascript:;",
        className: "actions__item",
        title: (0, _strings["default"])("add"),
        onClick: this.showEntities.bind(this)
      }, React.createElement("i", {
        className: addClassName
      }))), React.createElement("span", {
        className: "lookup-current-value"
      }, this.getHeaderText()), React.createElement("div", {
        className: "clearfix"
      })), mode == "multiple" && React.createElement(_grids.Grid, {
        ref: "selectionGrid",
        descriptor: selectionGrid,
        data: (0, _grids.resultToGridData)({
          rows: rows,
          totalRows: rows.length
        }),
        showInCard: "false",
        quickSearchEnabled: "false",
        headerVisible: "false",
        footerVisible: "false",
        summaryVisible: "false",
        noResultsVisible: "false",
        paginationEnabled: "false",
        tableClassName: "table table-condensed table-hover",
        onKeyDown: this.onGridKeyDown.bind(this)
      })), React.createElement("div", {
        className: "lookup-grid modal fade",
        id: "myModal",
        tabIndex: "-1",
        role: "dialog",
        "aria-labelledby": "myModalLabel"
      }, React.createElement("div", {
        className: "modal-dialog modal-lg",
        role: "document"
      }, React.createElement("div", {
        className: "modal-content"
      }, React.createElement("div", {
        className: "modal-header"
      }, React.createElement("h5", {
        className: "modal-title",
        id: "myModalLabel"
      }, field.label)), React.createElement("div", {
        className: "modal-body"
      }, React.createElement(_grids.Grid, {
        ref: "searchGrid",
        descriptor: this.props.popupGrid,
        data: (0, _grids.resultToGridData)(this.datasource.data),
        query: this.props.query,
        showInCard: "false",
        quickSearchEnabled: "true",
        footerVisible: "true",
        summaryVisible: "true",
        paginationEnabled: "true",
        tableClassName: "table table-condensed table-striped table-hover",
        onRowDoubleClick: this.select.bind(this)
      })), React.createElement("div", {
        className: "modal-footer"
      }, React.createElement("button", {
        type: "button",
        className: "btn btn-link",
        onClick: this.select.bind(this)
      }, (0, _strings["default"])("ok")), React.createElement("button", {
        type: "button",
        className: "btn btn-link",
        "data-dismiss": "modal"
      }, (0, _strings["default"])("cancel")))))));
    }
  }]);

  return Lookup;
}(Control);

exports.Lookup = Lookup;

var File =
/*#__PURE__*/
function (_Control13) {
  _inherits(File, _Control13);

  function File(props) {
    var _this16;

    _classCallCheck(this, File);

    _this16 = _possibleConstructorReturn(this, _getPrototypeOf(File).call(this, props));
    _this16.state = {
      filename: null
    };
    return _this16;
  }

  _createClass(File, [{
    key: "onFileSelected",
    value: function onFileSelected(e) {
      var _this17 = this;

      var model = this.props.model;
      var field = this.props.field;
      var file = e.target.files[0];
      inputfile.readDataUrl(file).then(function (result) {
        model.set(field.property, result);

        _this17.setState({
          filename: file.name
        });
      });
    }
  }, {
    key: "remove",
    value: function remove(e) {
      e.preventDefault();
      e.stopPropagation();
      var model = this.props.model;
      var field = this.props.field;
      model.set(field.property, null);
      this.setState({
        filename: null
      });
    }
  }, {
    key: "search",
    value: function search(e) {
      e.preventDefault();
      e.stopPropagation();
      var me = ReactDOM.findDOMNode(this);
      $(me).find("input[type=file]").click();
    }
  }, {
    key: "render",
    value: function render() {
      var model = this.props.model;
      var field = this.props.field;
      var value = model.get(field.property);
      var hasValue = !_.isEmpty(value);
      return React.createElement("div", {
        className: "input-file fg-line",
        tabIndex: "0"
      }, React.createElement("div", {
        onClick: this.search.bind(this)
      }, !hasValue ? React.createElement("div", null, React.createElement("div", {
        className: "actions pull-right"
      }, React.createElement("a", {
        href: "javascript:;",
        title: (0, _strings["default"])("search"),
        onClick: this.search.bind(this),
        className: "m-r-0"
      }, React.createElement("i", {
        className: "zmdi zmdi-search"
      }))), React.createElement("span", {
        className: "placeholder"
      }, field.placeholder)) : React.createElement("div", null, React.createElement("div", {
        className: "actions pull-right"
      }, React.createElement("a", {
        href: "javascript:;",
        title: (0, _strings["default"])("remove"),
        onClick: this.remove.bind(this),
        className: "m-r-0"
      }, React.createElement("i", {
        className: "zmdi zmdi-close"
      }))), React.createElement("span", {
        className: "input-file-name"
      }, React.createElement("span", {
        className: "zmdi zmdi-file"
      }), " ", this.state.filename))), React.createElement("input", {
        type: "file",
        accept: field.accept,
        onChange: this.onFileSelected.bind(this)
      }));
    }
  }]);

  return File;
}(Control);

exports.File = File;

var Image =
/*#__PURE__*/
function (_Control14) {
  _inherits(Image, _Control14);

  function Image(props) {
    _classCallCheck(this, Image);

    return _possibleConstructorReturn(this, _getPrototypeOf(Image).call(this, props));
  }

  _createClass(Image, [{
    key: "onFileSelected",
    value: function onFileSelected(e) {
      var _this18 = this;

      var model = this.props.model;
      var field = this.props.field;
      var file = e.target.files[0];
      inputfile.readDataUrl(file).then(function (result) {
        model.set(field.property, result);

        _this18.forceUpdate();
      });
    }
  }, {
    key: "delete",
    value: function _delete(e) {
      e.stopPropagation();
      e.preventDefault();
      var model = this.props.model;
      var field = this.props.field;
      var me = ReactDOM.findDOMNode(this);
      $(me).find("input[type=file]").val(null);
      model.set(field.property, null);
      this.forceUpdate();
    }
  }, {
    key: "search",
    value: function search(e) {
      e.preventDefault();
      e.stopPropagation();
      var me = ReactDOM.findDOMNode(this);
      $(me).find("input[type=file]").click();
    }
  }, {
    key: "render",
    value: function render() {
      var model = this.props.model;
      var field = this.props.field;
      var accept = field.accept || ".jpg,.png,.jpeg,.gif,.bmp";
      var imgStyle = {
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "contain",
        "backgroundPosition": "center",
        "height": "150px",
        "backgroundColor": "#F2F2F2"
      };

      if (this.props.width) {
        imgStyle.width = this.props.width;
      }

      if (this.props.height) {
        imgStyle.height = this.props.height;
      }

      var imageData = model.get(field.property);
      return React.createElement("div", {
        className: "input-image"
      }, React.createElement("div", {
        onClick: this.search.bind(this)
      }, !_.isEmpty(imageData) ? React.createElement("div", {
        className: "input-image-container"
      }, React.createElement("div", {
        className: "actions"
      }, React.createElement("a", {
        href: "javascript:;",
        onClick: this["delete"].bind(this),
        className: "delete-button"
      }, React.createElement("i", {
        className: "zmdi zmdi-close"
      }))), React.createElement("div", {
        className: "input-image",
        style: _.assign(imgStyle, {
          "backgroundImage": "url(\"".concat(imageData, "\")")
        })
      })) : React.createElement("div", {
        className: "input-image",
        style: _.assign(imgStyle, {
          "backgroundImage": "url(\"resources/images/noimage.png\")"
        })
      })), React.createElement("input", {
        type: "file",
        accept: accept,
        onChange: this.onFileSelected.bind(this)
      }));
    }
  }]);

  return Image;
}(Control);

exports.Image = Image;

var Gallery =
/*#__PURE__*/
function (_Control15) {
  _inherits(Gallery, _Control15);

  function Gallery(props) {
    var _this19;

    _classCallCheck(this, Gallery);

    _this19 = _possibleConstructorReturn(this, _getPrototypeOf(Gallery).call(this, props));
    _this19.state = {
      images: []
    };
    _this19.model = _this19.props.model;
    _this19.field = _this19.props.field;
    _this19.counter = 0;
    return _this19;
  }

  _createClass(Gallery, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this20 = this;

      this.model.once("load", function () {
        var value = (0, _lang.optional)(_this20.model.get(_this20.field.property), []);

        _.assign(_this20.state, {
          images: value
        });

        _this20.forceUpdate();
      });
    }
  }, {
    key: "onImageAdd",
    value: function onImageAdd(newImage) {
      var images = (0, _lang.optional)(this.state.images, []);

      if (!_.any(images, function (i) {
        return i === newImage;
      })) {
        images.push(newImage);

        _.assign(this.state, {
          images: images
        });

        this.model.set(this.field.property, images);
        this.forceUpdate();
        return true;
      }

      return false;
    }
  }, {
    key: "onImageDelete",
    value: function onImageDelete(imageToRemove) {
      var images = (0, _lang.optional)(this.state.images, []);
      images = _.filter(images, function (i) {
        return i !== imageToRemove;
      });

      _.assign(this.state, {
        images: images
      });

      this.model.set(this.field.property, images);
      this.forceUpdate();
    }
  }, {
    key: "createSingleImageComponent",
    value: function createSingleImageComponent(imageData) {
      this.counter++;
      return React.createElement(SingleImage, {
        key: this.field.property + "_" + this.counter,
        imageData: imageData,
        onImageAdd: this.onImageAdd.bind(this),
        onImageDelete: this.onImageDelete.bind(this)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this21 = this;

      var images = (0, _lang.optional)(this.state.images, []);
      var fields = [];
      var actions = [];

      if (images.length > 0) {
        _.forEach(images, function (e) {
          fields.push(_this21.createSingleImageComponent(e));
        });
      }

      fields.push(this.createSingleImageComponent());
      return React.createElement("div", null, fields);
    }
  }]);

  return Gallery;
}(Control);

exports.Gallery = Gallery;

var MultiFile =
/*#__PURE__*/
function (_Control16) {
  _inherits(MultiFile, _Control16);

  function MultiFile(props) {
    var _this22;

    _classCallCheck(this, MultiFile);

    _this22 = _possibleConstructorReturn(this, _getPrototypeOf(MultiFile).call(this, props));
    _this22.state = {
      files: []
    };
    _this22.model = _this22.props.model;
    _this22.field = _this22.props.field;
    _this22.counter = 0;
    _this22.fileTypes = _this22.field.fileTypes || "*";
    return _this22;
  }

  _createClass(MultiFile, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this23 = this;

      this.model.once("load", function () {
        var value = (0, _lang.optional)(_this23.model.get(_this23.field.property), []);

        _.assign(_this23.state, {
          files: value
        });

        _this23.forceUpdate();
      });
    }
  }, {
    key: "onAdd",
    value: function onAdd(newFile) {
      var files = (0, _lang.optional)(this.state.files, []);

      if (!_.any(files, function (i) {
        return i.data === newFile.data;
      })) {
        files.push(newFile);

        _.assign(this.state, {
          files: files
        });

        this.model.set(this.field.property, files);
        this.forceUpdate();
        return true;
      }

      return false;
    }
  }, {
    key: "onDelete",
    value: function onDelete(toRemove) {
      var files = (0, _lang.optional)(this.state.files, []);
      files = _.filter(files, function (i) {
        return i.data !== toRemove.data;
      });

      _.assign(this.state, {
        files: files
      });

      this.model.set(this.field.property, files);
      this.forceUpdate();
    }
  }, {
    key: "createSingleFileComponent",
    value: function createSingleFileComponent(data) {
      this.counter++;
      return React.createElement(SingleFile, {
        key: this.field.property + "_" + this.counter,
        file: data ? data : {},
        fileTypes: this.fileTypes,
        onAdd: this.onAdd.bind(this),
        onDelete: this.onDelete.bind(this)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this24 = this;

      var files = (0, _lang.optional)(this.state.files, []);
      var fields = [];
      var actions = [];
      var title = (0, _lang.optional)(this.props.field.title, (0, _strings["default"])("attachments"));

      if (files.length > 0) {
        _.forEach(files, function (e) {
          fields.push(_this24.createSingleFileComponent(e));
        });
      }

      fields.push(this.createSingleFileComponent());
      return React.createElement("div", null, React.createElement(HeaderBlock, {
        title: title,
        label: this.props.field.label,
        actions: actions
      }), fields);
    }
  }]);

  return MultiFile;
}(Control);

exports.MultiFile = MultiFile;

var SingleImage =
/*#__PURE__*/
function (_Control17) {
  _inherits(SingleImage, _Control17);

  function SingleImage(props) {
    var _this25;

    _classCallCheck(this, SingleImage);

    _this25 = _possibleConstructorReturn(this, _getPrototypeOf(SingleImage).call(this, props));
    _this25.state = {
      data: props.data
    };
    return _this25;
  }

  _createClass(SingleImage, [{
    key: "onFileSelected",
    value: function onFileSelected(e) {
      var _this26 = this;

      var file = e.target.files[0];
      inputfile.readDataUrl(file).then(function (result) {
        if (_.isFunction(_this26.props.onImageAdd)) {
          if (_this26.props.onImageAdd(result)) {
            _.assign(_this26.state, {
              imageData: result
            });

            _this26.forceUpdate();
          }
        }
      });
    }
  }, {
    key: "delete",
    value: function _delete(e) {
      e.stopPropagation();
      e.preventDefault();
      var me = ReactDOM.findDOMNode(this);
      $(me).find("input[type=file]").val(null);
      var image = this.state.imageData;

      _.assign(this.state, {
        imageData: null
      });

      this.forceUpdate();

      if (_.isFunction(this.props.onImageDelete)) {
        this.props.onImageDelete(image);
      }
    }
  }, {
    key: "search",
    value: function search(e) {
      e.preventDefault();
      e.stopPropagation();
      var me = ReactDOM.findDOMNode(this);
      $(me).find("input[type=file]").click();
    }
  }, {
    key: "render",
    value: function render() {
      var accept = ".jpg,.png,.jpeg,.gif,.bmp";
      var imgStyle = {
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "contain",
        "backgroundPosition": "center",
        "height": "150px",
        "backgroundColor": "#F2F2F2"
      };

      if (this.props.width) {
        imgStyle.width = this.props.width;
      }

      if (this.props.height) {
        imgStyle.height = this.props.height;
      }

      var imageData = (0, _lang.optional)(this.state.imageData, null);
      return React.createElement("div", {
        className: "input-image col-sm-4 col-ms-6",
        style: {
          marginBottom: '5px'
        }
      }, React.createElement("div", {
        onClick: this.search.bind(this)
      }, !_.isEmpty(imageData) ? React.createElement("div", {
        className: "input-image-container"
      }, React.createElement("div", {
        className: "actions"
      }, React.createElement("a", {
        href: "javascript:;",
        onClick: this["delete"].bind(this),
        className: "delete-button"
      }, React.createElement("i", {
        className: "zmdi zmdi-close"
      }))), React.createElement("div", {
        className: "input-image",
        style: _.assign(imgStyle, {
          "backgroundImage": "url(\"".concat(imageData, "\")")
        })
      })) : React.createElement("div", {
        className: "input-image",
        style: _.assign(imgStyle, {
          "backgroundImage": "url(\"resources/images/noimage.png\")"
        })
      })), React.createElement("input", {
        type: "file",
        accept: accept,
        onChange: this.onFileSelected.bind(this)
      }));
    }
  }]);

  return SingleImage;
}(Control);

exports.SingleImage = SingleImage;

var PasswordText =
/*#__PURE__*/
function (_Control18) {
  _inherits(PasswordText, _Control18);

  function PasswordText() {
    _classCallCheck(this, PasswordText);

    return _possibleConstructorReturn(this, _getPrototypeOf(PasswordText).apply(this, arguments));
  }

  _createClass(PasswordText, [{
    key: "render",
    value: function render() {
      var field = this.props.field;
      return React.createElement("div", {
        className: "fg-line"
      }, React.createElement("input", {
        type: "password",
        className: "form-control input-sm",
        id: field.property,
        "data-property": field.property,
        placeholder: field.placeholder,
        value: (0, _lang.optional)(this.props.model.get(field.property), ""),
        onChange: this.onValueChange.bind(this)
      }));
    }
  }]);

  return PasswordText;
}(Control);

exports.PasswordText = PasswordText;

var SingleFile =
/*#__PURE__*/
function (_Control19) {
  _inherits(SingleFile, _Control19);

  function SingleFile(props) {
    var _this27;

    _classCallCheck(this, SingleFile);

    _this27 = _possibleConstructorReturn(this, _getPrototypeOf(SingleFile).call(this, props));
    var filename = (0, _lang.optional)(props.file.filename, null);
    var data = (0, _lang.optional)(props.file.data, null);
    var base64 = (0, _lang.optional)(props.file.base64, null);
    _this27.state = {
      filename: filename,
      data: data,
      base64: base64
    };
    return _this27;
  }

  _createClass(SingleFile, [{
    key: "onFileSelected",
    value: function onFileSelected(e) {
      var _this28 = this;

      var file = e.target.files[0];
      showLoader();
      inputfile.readDataUrl(file).then(function (result) {
        if (_.isFunction(_this28.props.onAdd)) {
          _this28.props.onAdd({
            data: result,
            filename: file.name,
            base64: true
          });
        }

        hideLoader();
      });
    }
  }, {
    key: "remove",
    value: function remove(e) {
      e.stopPropagation();
      e.preventDefault();

      if (_.isFunction(this.props.onDelete)) {
        this.props.onDelete({
          data: this.state.data,
          filename: this.state.filename
        });
      }
    }
  }, {
    key: "download",
    value: function download(e) {
      e.preventDefault();
      e.stopPropagation();
      var value = (0, _lang.optional)(this.state.data, null);
      var url = config.get("service.url") + value;
      window.open(url);
    }
  }, {
    key: "search",
    value: function search(e) {
      e.preventDefault();
      e.stopPropagation();
      var me = ReactDOM.findDOMNode(this); //Serve per invocare il change se si seleziona un file uguale al precedente

      $(me).find("input[type=file]").val("");
      $(me).find("input[type=file]").click();
    }
  }, {
    key: "render",
    value: function render() {
      var value = (0, _lang.optional)(this.state.data, null); //let fileName = optional(this.state.filename, null)

      var hasValue = !_.isEmpty(value);
      var readOnly = (0, _lang.optional)(this.props.readOnly, false);
      var canDownload = hasValue && !value.includes("base64");
      var component = null;
      var fileTypes = (0, _lang.optional)(this.props.fileTypes, "*");

      if (!hasValue) {
        component = React.createElement("div", null, React.createElement("div", {
          className: "actions pull-right"
        }, React.createElement("a", {
          href: "javascript:;",
          title: (0, _strings["default"])("search"),
          onClick: this.search.bind(this),
          className: "m-r-0"
        }, React.createElement("i", {
          className: "zmdi zmdi-search"
        }))), React.createElement("span", {
          className: "placeholder"
        }));
      } else {
        component = React.createElement("div", null, React.createElement("div", {
          className: "actions pull-right"
        }, readOnly && React.createElement("a", {
          href: "javascript:;",
          title: (0, _strings["default"])("remove"),
          onClick: this.remove.bind(this),
          className: "m-r-0"
        }, React.createElement("i", {
          className: "zmdi zmdi-close"
        })), canDownload && React.createElement("a", {
          href: "javascript:;",
          title: (0, _strings["default"])("download"),
          onClick: this.download.bind(this),
          className: "m-r-0"
        }, React.createElement("i", {
          className: "zmdi zmdi-download"
        }))), React.createElement("span", {
          className: "input-file-name"
        }, React.createElement("span", {
          className: "zmdi zmdi-file"
        }), " ", this.state.filename, " "));
      }

      return React.createElement("div", {
        className: "col-sm-4 col-ms-6",
        style: {
          marginBottom: '5px'
        }
      }, React.createElement("div", {
        className: "input-file fg-line",
        tabIndex: "0"
      }, React.createElement("div", {
        onClick: this.search.bind(this)
      }, component), React.createElement("input", {
        type: "file",
        accept: fileTypes,
        onChange: this.onFileSelected.bind(this)
      })));
    }
  }]);

  return SingleFile;
}(Control);

exports.SingleFile = SingleFile;

},{"../../aj/events":10,"../../api/query":18,"../../strings":347,"../../utils/datasource":349,"../../utils/lang":350,"../utils/inputfile":376,"../utils/keyboard":377,"./common":351,"./grids":354,"underscore":337}],354:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayResult = arrayResult;
exports.resultToGridData = resultToGridData;
exports.createCell = createCell;
exports.ButtonCell = exports.EditCheckCell = exports.Grid = exports.QuickSearch = exports.NoCard = exports.ResultSummary = exports.Pagination = exports.Filters = exports.Filter = exports.KeywordSearch = exports.SelectCell = exports.ActionsCell = exports.CheckCell = exports.TextCell = exports.EditTextCell = exports.Cell = exports.GridFooter = exports.FooterCell = exports.GridBody = exports.Row = exports.GridHeader = exports.HeaderCell = exports.SearchDialog = void 0;

var query = _interopRequireWildcard(require("../../api/query"));

var _strings = _interopRequireDefault(require("../../strings"));

var _common = require("./common");

var _lang = require("../../utils/lang");

var _events = require("../../aj/events");

var _keyboard = require("../utils/keyboard");

var mobile = _interopRequireWildcard(require("../utils/mobile"));

var datasource = _interopRequireWildcard(require("../../utils/datasource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var EXPAND_ANIMATION_TIME = 250;
var CELL_PADDING_TOP = 15;
var CELL_PADDING_BOTTOM = 15;
/* 
 * hack to load forms when is useful but prevent circular references of modules. forms.jsx uses grids.jsx 
 */

var _forms = null;

function forms() {
  if (_forms == null) {
    //from this, the url is not absolute
    _forms = require("./forms");
  }

  return _forms;
}

function eachChildren(root, action) {
  if (_.isArray(root)) {
    root.forEach(function (c) {
      action(c);
      eachChildren(c.children, action);
    });
  }
}

function clearSelection() {
  if (document.selection && document.selection.empty) {
    document.selection.empty();
  } else if (window.getSelection) {
    var sel = window.getSelection();
    sel.removeAllRanges();
  }
}

function childrenData(children, index, childrenProp) {
  if (_.isArray(children)) {
    return children.map(function (r) {
      return {
        data: r,
        index: index.value++,
        children: childrenData(r[childrenProp], index, childrenProp),
        selected: false
      };
    });
  }

  return null;
}

function arrayResult(arr) {
  var narr = (0, _lang.optional)(arr, []);
  return {
    rows: narr,
    totalRows: narr.length
  };
}

function resultToGridData(result) {
  var childrenProp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "children";

  if (!result || !result.rows) {
    return {
      rows: [],
      totalRows: 0
    };
  }

  var index = {
    value: 0
  };
  return {
    totalRows: result.totalRows,
    rows: result.rows.map(function (r) {
      return {
        data: r,
        index: index.value++,
        children: childrenData(r[childrenProp], index, childrenProp),
        selected: false
      };
    })
  };
}

var Selection =
/*#__PURE__*/
function (_Observable) {
  _inherits(Selection, _Observable);

  function Selection(rows) {
    var _this;

    _classCallCheck(this, Selection);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Selection).call(this));
    _this.rows = rows;
    _this.shiftPressed = false;
    _this.controlPressed = false;
    _this.lastSelected = null;
    _this.rangeStartRow = null;
    _this.allSelected = false;
    _this.single = false;
    return _this;
  }

  _createClass(Selection, [{
    key: "flatRows",
    value: function flatRows() {
      var flatRows = [];

      var addRows = function addRows(children) {
        if (!children) {
          return;
        }

        children.forEach(function (c) {
          flatRows.push(c);

          if (c.expanded) {
            addRows(c.children);
          }
        });
      };

      addRows(this.rows);
      return flatRows;
    }
  }, {
    key: "handle",
    value: function handle(row) {
      var flatRows = this.flatRows();

      if (this.shiftPressed && !this.single) {
        flatRows.forEach(function (r) {
          return r.selected = false;
        });

        if (this.rangeStartRow == null) {
          this.rangeStartRow = this.lastSelected;

          if (this.rangeStartRow == null) {
            this.rangeStartRow = row;
          }

          this.lastSelected = row;
          row.selected = true;
        } else {
          var startIndex = Math.min(this.rangeStartRow.index, row.index);
          var endIndex = Math.max(this.rangeStartRow.index, row.index);
          flatRows.forEach(function (r) {
            if (r.index >= startIndex && r.index <= endIndex) {
              r.selected = true;
            }
          });
          this.lastSelected = row;
        }
      } else if (this.controlPressed && !this.single) {
        row.selected = !row.selected;
        this.rangeStartRow = row;
        this.lastSelected = row;
      } else {
        flatRows.forEach(function (r) {
          return r.selected = false;
        });
        row.selected = true;
        this.rangeStartRow = row;
        this.lastSelected = row;
      }

      this.invoke("change");
    }
  }, {
    key: "getSelectedData",
    value: function getSelectedData() {
      return _.map(_.filter(this.flatRows(), function (r) {
        return r.selected;
      }), function (r) {
        return r.data;
      });
    }
  }, {
    key: "toggleAll",
    value: function toggleAll() {
      var _this2 = this;

      this.flatRows().forEach(function (r) {
        return r.selected = !_this2.allSelected;
      });
      this.allSelected = !this.allSelected;
      this.lastSelected = null;
      this.rangeStartRow = null;
      this.invoke("change");
    }
  }, {
    key: "clear",
    value: function clear() {
      this.flatRows().forEach(function (r) {
        return r.selected = false;
      });
      this.allSelected = false;
      this.lastSelected = null;
      this.rangeStartRow = null;
      this.invoke("change");
    }
  }, {
    key: "down",
    value: function down() {
      var flatRows = this.flatRows();

      if (!flatRows || flatRows.length == 0) {
        return;
      }

      var index = -1;

      if (this.lastSelected != null) {
        index = flatRows.indexOf(this.lastSelected);
      }

      index++;

      if (index >= flatRows.length) {
        index = 0;
      }

      var newRow = flatRows[index];
      this.handle(newRow);
    }
  }, {
    key: "up",
    value: function up() {
      var flatRows = this.flatRows();

      if (!flatRows || flatRows.length == 0) {
        return;
      }

      var index = -1;

      if (this.lastSelected != null) {
        index = flatRows.indexOf(this.lastSelected);
      }

      index--;

      if (index < 0) {
        index = flatRows.length - 1;
      }

      var newRow = flatRows[index];
      this.handle(newRow);
    }
  }]);

  return Selection;
}(_events.Observable);

var STANDARD_SEARCH_FORM_DESCRIPTOR = function STANDARD_SEARCH_FORM_DESCRIPTOR(column) {
  return _.assign({}, {
    showInCard: false,
    fields: [{
      property: column.property,
      label: (0, _strings["default"])("value"),
      placeholder: (0, _strings["default"])("value"),
      control: forms().Text
    }, {
      property: "_filterType",
      label: (0, _strings["default"])("filterType"),
      control: forms().Select,
      props: {
        allowNull: false,
        datasource: datasource.fixed([{
          label: "Equals",
          value: "eq"
        }, {
          label: "Like",
          value: "like"
        }])
      }
    }]
  });
};

var SearchDialog =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SearchDialog, _React$Component);

  function SearchDialog(props) {
    var _this3;

    _classCallCheck(this, SearchDialog);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(SearchDialog).call(this, props));
    _this3.model = new (forms().Model)();
    return _this3;
  }

  _createClass(SearchDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {}
  }, {
    key: "onChangeValue",
    value: function onChangeValue(e) {
      var value = e.target.value;
      this.setState(_.assign(this.state, {
        value: value
      }));
    }
  }, {
    key: "onTypeChange",
    value: function onTypeChange(e) {
      var type = e.target.value;
      this.setState(_.assign(this.state, {
        type: type
      }));
    }
  }, {
    key: "close",
    value: function close() {
      var me = ReactDOM.findDOMNode(this);
      $(me).modal("hide");
    }
  }, {
    key: "getFieldFilterType",
    value: function getFieldFilterType(property) {
      var filterType = this.props.column.filterType;

      if (!filterType) {
        var field = this.model.findField(property);

        if (field) {
          return field.filterType;
        }
      } else return filterType;
    }
  }, {
    key: "filter",
    value: function filter() {
      var _this4 = this;

      if (this.props.query && this.props.column && this.props.column.property) {
        var manualFilterType = (0, _lang.optional)(this.model.get("_filterType"), "eq");
        var data = this.model.sanitized();
        this.props.query.die();

        _.each(_.keys(data), function (k) {
          if (k !== "_filterType") {
            var filterType = (0, _lang.optional)(_this4.getFieldFilterType(k), manualFilterType);

            _this4.props.query.filter(filterType, k, data[k]);
          }
        });

        this.props.query.page = 1;
        this.props.query.live();
        this.props.query.invokeChange();
        this.close();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var column = this.props.column;
      var searchForm = STANDARD_SEARCH_FORM_DESCRIPTOR(column);

      if (!_.isEmpty(column.searchForm)) {
        searchForm = column.searchForm;
      }

      this.model.descriptor = searchForm;
      var FormBody = forms().FormBody;
      return React.createElement("div", {
        className: "search-dialog modal fade",
        role: "dialog",
        tabIndex: "-1",
        style: {
          display: "none",
          zIndex: 1500
        }
      }, React.createElement("div", {
        className: "modal-dialog"
      }, React.createElement("div", {
        className: "modal-content"
      }, React.createElement("div", {
        className: "modal-header"
      }, React.createElement("h4", {
        className: "modal-title"
      }, this.props.column.header)), React.createElement("div", {
        className: "modal-body"
      }, React.createElement("div", {
        className: "row"
      }, React.createElement(FormBody, {
        model: this.model,
        descriptor: searchForm
      }))), React.createElement("div", {
        className: "modal-footer"
      }, React.createElement("button", {
        type: "button",
        className: "btn btn-link waves-effect",
        onClick: this.filter.bind(this)
      }, (0, _strings["default"])("search")), React.createElement("button", {
        type: "button",
        className: "btn btn-link waves-effect",
        "data-dismiss": "modal"
      }, (0, _strings["default"])("close"))))));
    }
  }]);

  return SearchDialog;
}(React.Component);

exports.SearchDialog = SearchDialog;

var HeaderCell =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(HeaderCell, _React$Component2);

  function HeaderCell(props) {
    var _this5;

    _classCallCheck(this, HeaderCell);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(HeaderCell).call(this, props));
    _this5.state = {
      sorting: false,
      sortDescending: false
    };
    return _this5;
  }

  _createClass(HeaderCell, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var me = $(ReactDOM.findDOMNode(this));
      var button = $(this.refs.search);
      me.mouseenter(function () {
        button.css({
          opacity: 0
        }).show().stop().animate({
          opacity: 1
        }, 250);
      }).mouseleave(function () {
        button.stop().animate({
          opacity: 0
        }, 250);
      });
    }
  }, {
    key: "changeSort",
    value: function changeSort() {
      if (!this.props.column.sortable) {
        return;
      }

      var newState = null;

      if (this.state.sorting == false) {
        newState = {
          sorting: true,
          sortDescending: false
        };
      } else if (this.state.sortDescending == false) {
        newState = {
          sorting: true,
          sortDescending: true
        };
      } else {
        newState = {
          sorting: false,
          sortDescending: false
        };
      }

      if (this.props.query) {
        if (newState.sorting) {
          this.props.query.sort(this.props.column.property, newState.sortDescending);
        } else {
          this.props.query.unsort(this.props.column.property);
        }
      }

      this.setState(newState);
    }
  }, {
    key: "search",
    value: function search() {
      var me = ReactDOM.findDOMNode(this);
      $(me).find(".search-dialog").modal();
    }
  }, {
    key: "render",
    value: function render() {
      var sortClass = "";

      if (this.state.sorting && this.state.sortDescending) {
        sortClass = "sorting_desc";
      } else if (this.state.sorting && !this.state.sortDescending) {
        sortClass = "sorting_asc";
      }

      var searchButtonRight = 10;

      if (sortClass != "") {
        searchButtonRight += 25;
      }

      return React.createElement("th", {
        className: "hover " + sortClass,
        style: {
          position: "relative"
        }
      }, React.createElement("span", {
        onClick: this.changeSort.bind(this),
        className: "pointer-cursor"
      }, this.props.column.header), this.props.column.searchable && React.createElement("a", {
        ref: "search",
        className: "btn btn-sm btn-light",
        href: "javascript:;",
        onClick: this.search.bind(this),
        style: {
          display: "none",
          marginTop: "-3px",
          position: "absolute",
          right: searchButtonRight
        }
      }, React.createElement("i", {
        className: "zmdi zmdi-search"
      })), this.props.column.searchable && React.createElement(SearchDialog, {
        column: this.props.column,
        query: this.props.query
      }));
    }
  }]);

  return HeaderCell;
}(React.Component);

exports.HeaderCell = HeaderCell;

var GridHeader =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(GridHeader, _React$Component3);

  function GridHeader() {
    _classCallCheck(this, GridHeader);

    return _possibleConstructorReturn(this, _getPrototypeOf(GridHeader).apply(this, arguments));
  }

  _createClass(GridHeader, [{
    key: "render",
    value: function render() {
      var _this6 = this;

      if (_.isEmpty(this.props.descriptor)) {
        return null;
      }

      var id = 1;
      var headerCells = this.props.descriptor.columns.map(function (c) {
        return React.createElement(HeaderCell, {
          key: id++,
          column: c,
          query: _this6.props.query
        });
      });
      return React.createElement("thead", null, React.createElement("tr", null, headerCells));
    }
  }]);

  return GridHeader;
}(React.Component);

exports.GridHeader = GridHeader;

var Row =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(Row, _React$Component4);

  function Row(props) {
    _classCallCheck(this, Row);

    return _possibleConstructorReturn(this, _getPrototypeOf(Row).call(this, props));
  }

  _createClass(Row, [{
    key: "doubleClick",
    value: function doubleClick(e) {
      if (_.isFunction(this.props.onDoubleClick)) {
        this.props.onDoubleClick(this.props.row);
        e.stopPropagation();
        e.preventDefault();
        clearSelection();
      }
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown(e) {
      if (_.isFunction(this.props.onMouseDown)) {
        this.props.onMouseDown(this.props.row);
        e.stopPropagation();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var expandedNow = this.props.row.expandedNow || false;

      if (expandedNow) {
        var me = ReactDOM.findDOMNode(this);
        this.props.row.expandedNow = undefined;
        $(me).find("td").css({
          paddingTop: 0,
          paddingBottom: 0
        }).stop().animate({
          paddingTop: CELL_PADDING_TOP,
          paddingBottom: CELL_PADDING_BOTTOM
        }, EXPAND_ANIMATION_TIME).end().find(".grid-cell-container").hide().slideDown(EXPAND_ANIMATION_TIME);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var collapsedNow = this.props.row.collapsedNow || false;

      if (collapsedNow) {
        var me = ReactDOM.findDOMNode(this);
        this.props.row.collapsedNow = undefined;
        $(me).find("td").stop().animate({
          paddingTop: 0,
          paddingBottom: 0
        }, EXPAND_ANIMATION_TIME).end().find(".grid-cell-container").slideUp(EXPAND_ANIMATION_TIME);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this7 = this;

      if (_.isEmpty(this.props.descriptor)) {
        return null;
      }

      var onExpand = function onExpand(row) {
        if (_.isFunction(_this7.props.onExpand)) {
          _this7.props.onExpand(row);
        }
      };

      var firstElement = true;
      var key = 1;
      var cells = this.props.descriptor.columns.map(function (c) {
        var cell = createCell(c, _this7.props.row, firstElement, onExpand, c.props);
        firstElement = false;
        return React.createElement("td", {
          key: key++,
          className: c.tdClassName
        }, React.createElement("div", {
          className: "grid-cell-container"
        }, cell));
      });
      var className = "level-".concat(this.props.row.level, " ") + (this.props.row.selected ? "selected" : "");
      var rowClassName = this.props.descriptor.rowClassName;

      if (rowClassName) {
        if (_.isFunction(rowClassName)) {
          className += " " + rowClassName(this.props.row.data);
        } else {
          className += " " + rowClassName;
        }
      }

      return React.createElement("tr", {
        onMouseDown: this.onMouseDown.bind(this),
        onDoubleClick: this.doubleClick.bind(this),
        className: className
      }, cells);
    }
  }]);

  return Row;
}(React.Component);

exports.Row = Row;

var GridBody =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(GridBody, _React$Component5);

  function GridBody() {
    _classCallCheck(this, GridBody);

    return _possibleConstructorReturn(this, _getPrototypeOf(GridBody).apply(this, arguments));
  }

  _createClass(GridBody, [{
    key: "onRowMouseDown",
    value: function onRowMouseDown(row) {
      if (_.isFunction(this.props.onRowMouseDown)) {
        this.props.onRowMouseDown(row);
      }
    }
  }, {
    key: "onRowDoubleClick",
    value: function onRowDoubleClick(row) {
      if (_.isFunction(this.props.onRowDoubleClick)) {
        this.props.onRowDoubleClick(row);
      }
    }
  }, {
    key: "onRowExpand",
    value: function onRowExpand(row) {
      if (_.isFunction(this.props.onRowExpand)) {
        this.props.onRowExpand(row);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      if (_.isEmpty(this.props.descriptor)) {
        return null;
      }

      var rows = this.props.data.rows || [];
      var rowElements = [];
      var level = this.props.level || 0;
      var index = 0;

      var addElements = function addElements(children, level, parentKey) {
        var key = 1;
        children.forEach(function (r) {
          r.index = index++;
          r.level = level;
          var element = React.createElement(Row, {
            key: parentKey + "_" + key++,
            descriptor: _this8.props.descriptor,
            row: r,
            query: _this8.props.query,
            onMouseDown: _this8.onRowMouseDown.bind(_this8),
            onDoubleClick: _this8.onRowDoubleClick.bind(_this8),
            onExpand: _this8.onRowExpand.bind(_this8)
          });
          rowElements.push(element);

          if (!_.isEmpty(r.children)) {
            if (r.expanded) {
              addElements(r.children, level + 1, parentKey + "_" + key);
            }
          }
        });
      };

      addElements(rows, level, "root");
      return React.createElement("tbody", null, rowElements);
    }
  }]);

  return GridBody;
}(React.Component);

exports.GridBody = GridBody;

var FooterCell =
/*#__PURE__*/
function (_React$Component6) {
  _inherits(FooterCell, _React$Component6);

  function FooterCell() {
    _classCallCheck(this, FooterCell);

    return _possibleConstructorReturn(this, _getPrototypeOf(FooterCell).apply(this, arguments));
  }

  _createClass(FooterCell, [{
    key: "render",
    value: function render() {
      return React.createElement("th", null, this.props.column.header);
    }
  }]);

  return FooterCell;
}(React.Component);

exports.FooterCell = FooterCell;

var GridFooter =
/*#__PURE__*/
function (_React$Component7) {
  _inherits(GridFooter, _React$Component7);

  function GridFooter() {
    _classCallCheck(this, GridFooter);

    return _possibleConstructorReturn(this, _getPrototypeOf(GridFooter).apply(this, arguments));
  }

  _createClass(GridFooter, [{
    key: "render",
    value: function render() {
      var _this9 = this;

      if (_.isEmpty(this.props.descriptor)) {
        return null;
      }

      var id = 1;
      var footerCells = this.props.descriptor.columns.map(function (c) {
        return React.createElement(FooterCell, {
          key: id++,
          column: c,
          query: _this9.props.query
        });
      });
      return React.createElement("tfoot", null, React.createElement("tr", null, footerCells));
    }
  }]);

  return GridFooter;
}(React.Component);

exports.GridFooter = GridFooter;

var Cell =
/*#__PURE__*/
function (_React$Component8) {
  _inherits(Cell, _React$Component8);

  function Cell() {
    _classCallCheck(this, Cell);

    return _possibleConstructorReturn(this, _getPrototypeOf(Cell).apply(this, arguments));
  }

  _createClass(Cell, [{
    key: "getValue",
    value: function getValue() {
      var column = this.props.column;
      var property = this.props.property;
      var row = this.props.row;
      return row.data[property];
    }
  }]);

  return Cell;
}(React.Component);

exports.Cell = Cell;

var EditTextCell =
/*#__PURE__*/
function (_Cell) {
  _inherits(EditTextCell, _Cell);

  function EditTextCell(props) {
    var _this10;

    _classCallCheck(this, EditTextCell);

    _this10 = _possibleConstructorReturn(this, _getPrototypeOf(EditTextCell).call(this, props));
    _this10.state = {
      value: ""
    };
    return _this10;
  }

  _createClass(EditTextCell, [{
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps, nextState) {
      if (nextProps.value != nextState.value) {
        this.setState({
          value: nextProps.value
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        value: this.props.value
      });
    }
  }, {
    key: "onValueChange",
    value: function onValueChange(e) {
      var newValue = e.target.value;
      this.setState({
        value: newValue
      });

      if (_.isFunction(this.props.onValueChange)) {
        var column = this.props.column;
        var property = this.props.property;
        var row = this.props.row;
        this.props.onValueChange(column, row.data, newValue);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var column = this.props.column;
      var property = this.props.property;
      var row = this.props.row;
      return React.createElement("div", {
        className: "edit-text-cell"
      }, React.createElement("input", {
        type: (0, _lang.optional)(this.props.type, "text"),
        className: "form-control input-sm",
        "data-property": property,
        placeholder: this.props.placeholder,
        value: (0, _lang.optional)(this.state.value, ""),
        onChange: this.onValueChange.bind(this)
      }));
    }
  }]);

  return EditTextCell;
}(Cell);

exports.EditTextCell = EditTextCell;

var TextCell =
/*#__PURE__*/
function (_Cell2) {
  _inherits(TextCell, _Cell2);

  function TextCell() {
    _classCallCheck(this, TextCell);

    return _possibleConstructorReturn(this, _getPrototypeOf(TextCell).apply(this, arguments));
  }

  _createClass(TextCell, [{
    key: "toggleExpand",
    value: function toggleExpand(e) {
      if (_.isFunction(this.props.onExpand)) {
        this.props.onExpand(this.props.row);
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var marginLeft = 30 * (this.props.row.level || 0);
      var icon = "zmdi ";

      if (!this.props.row.expanded) {
        icon += " zmdi-plus";
      } else {
        icon += " zmdi-minus";
      }

      var formatter = _.isFunction(this.props.formatter) ? this.props.formatter : function (v) {
        return v;
      };
      var caret = !_.isEmpty(this.props.row.children) && this.props.firstElement ? React.createElement("a", {
        style: {
          marginLeft: marginLeft,
          marginRight: 20
        },
        href: "javascript:;",
        className: "expand-button",
        onClick: this.toggleExpand.bind(this),
        onMouseDown: function onMouseDown(e) {
          return e.stopPropagation();
        }
      }, React.createElement("i", {
        className: "c-black " + icon
      })) : null;
      var style = {};

      if (caret == null && this.props.row.level > 0 && this.props.firstElement) {
        style.marginLeft = marginLeft + 20;
      }

      return React.createElement("div", null, caret, React.createElement("span", {
        style: style
      }, formatter(this.props.value)));
    }
  }]);

  return TextCell;
}(Cell);

exports.TextCell = TextCell;

var CheckCell =
/*#__PURE__*/
function (_Cell3) {
  _inherits(CheckCell, _Cell3);

  function CheckCell() {
    _classCallCheck(this, CheckCell);

    return _possibleConstructorReturn(this, _getPrototypeOf(CheckCell).apply(this, arguments));
  }

  _createClass(CheckCell, [{
    key: "render",
    value: function render() {
      var checked = this.props.value === true || this.props.value === "true" || parseInt(this.props.value) > 0;
      var icon = checked ? "zmdi zmdi-check" : "zmdi zmdi-square-o";
      return React.createElement("i", {
        className: icon
      });
    }
  }]);

  return CheckCell;
}(Cell);

exports.CheckCell = CheckCell;

var ActionsCell =
/*#__PURE__*/
function (_Cell4) {
  _inherits(ActionsCell, _Cell4);

  function ActionsCell() {
    _classCallCheck(this, ActionsCell);

    return _possibleConstructorReturn(this, _getPrototypeOf(ActionsCell).apply(this, arguments));
  }

  _createClass(ActionsCell, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var me = ReactDOM.findDOMNode(this);
      var showAlways = (0, _lang.parseBoolean)(this.props.showAlways);

      if (!showAlways) {
        $(me).closest("tr").mouseenter(function () {
          $(me).find(".grid-action").stop().fadeIn(250);
        }).mouseleave(function () {
          $(me).find(".grid-action").stop().fadeOut(250);
        }).find(".grid-action").hide();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this11 = this;

      var actionKey = 1;
      var actions = this.props.column.actions.map(function (a) {
        return React.createElement(_common.Actions.getButtonClass(a), {
          key: actionKey++,
          action: a,
          arguments: [_this11.props.row.data],
          className: "grid-action"
        });
      });
      return React.createElement("div", {
        className: "grid-actions-container"
      }, actions);
    }
  }]);

  return ActionsCell;
}(Cell);

exports.ActionsCell = ActionsCell;

var SelectCell =
/*#__PURE__*/
function (_Cell5) {
  _inherits(SelectCell, _Cell5);

  function SelectCell(props) {
    var _this12;

    _classCallCheck(this, SelectCell);

    _this12 = _possibleConstructorReturn(this, _getPrototypeOf(SelectCell).call(this, props));

    if (_.isEmpty(props.datasource)) {
      throw new Error("Datasource is null");
    }

    return _this12;
  }

  _createClass(SelectCell, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this13 = this;

      this.onDataSourceChange = this.props.datasource.on("change", function () {
        _this13.forceUpdate();
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.datasource.off("change", this.onDataSourceChange);
    }
  }, {
    key: "onChange",
    value: function onChange(e) {
      var value = e.target.value;
      var column = this.props.column;
      var row = this.props.row;

      if (_.isFunction(this.props.onChange)) {
        this.props.onChange(column, row.data, value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var datasource = this.props.datasource;
      var options = (0, _lang.optional)(function () {
        return datasource.data.rows;
      }, []).map(function (o) {
        return React.createElement("option", {
          key: o.value,
          value: o.value
        }, o.label);
      });
      var allowNull = (0, _lang.parseBoolean)(this.props.allowNull);
      return React.createElement("div", {
        className: "form-group select-cell"
      }, React.createElement("div", {
        className: "fg-line"
      }, React.createElement("div", {
        className: "select"
      }, React.createElement("select", {
        className: "form-control",
        value: (0, _lang.optional)(this.props.value, ""),
        onChange: this.onChange.bind(this)
      }, allowNull && React.createElement("option", {
        value: ""
      }), options))));
    }
  }]);

  return SelectCell;
}(Cell);

exports.SelectCell = SelectCell;

var KeywordSearch =
/*#__PURE__*/
function (_React$Component9) {
  _inherits(KeywordSearch, _React$Component9);

  function KeywordSearch() {
    _classCallCheck(this, KeywordSearch);

    return _possibleConstructorReturn(this, _getPrototypeOf(KeywordSearch).apply(this, arguments));
  }

  _createClass(KeywordSearch, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "col-md-offset-8 col-md-4 keyword-search"
      }, React.createElement("form", {
        action: "javascript:;"
      }, React.createElement("div", {
        className: "input-group"
      }, React.createElement("span", {
        className: "input-group-addon"
      }, React.createElement("i", {
        className: "zmdi zmdi-search"
      })), React.createElement("div", {
        className: "fg-line"
      }, React.createElement("input", {
        type: "text",
        className: "form-control",
        placeholder: "Search..."
      })))));
    }
  }]);

  return KeywordSearch;
}(React.Component);

exports.KeywordSearch = KeywordSearch;

var Filter =
/*#__PURE__*/
function (_React$Component10) {
  _inherits(Filter, _React$Component10);

  function Filter() {
    _classCallCheck(this, Filter);

    return _possibleConstructorReturn(this, _getPrototypeOf(Filter).apply(this, arguments));
  }

  _createClass(Filter, [{
    key: "unfilter",
    value: function unfilter() {
      if (!this.props.query) {
        return;
      }

      this.props.query.unfilter(this.props.data.property);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("button", {
        onClick: this.unfilter.bind(this),
        className: "btn btn-no-shadow btn-primary waves-effect m-r-10"
      }, (0, _strings["default"])(this.props.data.property), "=", this.props.data.value, " ", React.createElement("i", {
        className: "zmdi zmdi-close"
      }));
    }
  }]);

  return Filter;
}(React.Component);

exports.Filter = Filter;

var Filters =
/*#__PURE__*/
function (_React$Component11) {
  _inherits(Filters, _React$Component11);

  function Filters() {
    _classCallCheck(this, Filters);

    return _possibleConstructorReturn(this, _getPrototypeOf(Filters).apply(this, arguments));
  }

  _createClass(Filters, [{
    key: "clearFilters",
    value: function clearFilters() {
      if (!this.props.query) {
        return;
      }

      this.props.query.clearFilters();
    }
  }, {
    key: "render",
    value: function render() {
      var _this14 = this;

      var filters = [];

      if (this.props.query) {
        filters = this.props.query.filters.map(function (f) {
          return React.createElement(Filter, {
            key: f.property + f.type + f.value,
            data: f,
            query: _this14.props.query
          });
        });
      }

      var actions = [{
        icon: "zmdi zmdi-delete",
        action: this.clearFilters.bind(this)
      }];
      return React.createElement("div", {
        className: "filters p-30"
      }, React.createElement("button", {
        type: "button",
        onClick: this.clearFilters.bind(this),
        className: "btn btn-no-shadow btn-primary waves-effect m-r-10"
      }, React.createElement("i", {
        className: "zmdi zmdi-delete"
      })), filters);
    }
  }]);

  return Filters;
}(React.Component);

exports.Filters = Filters;

var Pagination =
/*#__PURE__*/
function (_React$Component12) {
  _inherits(Pagination, _React$Component12);

  function Pagination() {
    _classCallCheck(this, Pagination);

    return _possibleConstructorReturn(this, _getPrototypeOf(Pagination).apply(this, arguments));
  }

  _createClass(Pagination, [{
    key: "changePage",
    value: function changePage(page) {
      this.props.query.setPage(page);
    }
  }, {
    key: "getTotalPages",
    value: function getTotalPages() {
      if (!this.props.data || !this.props.data.rows || !this.props.query) {
        return 1;
      }

      var totalPages = parseInt(Math.ceil(this.props.data.totalRows / this.props.query.rowsPerPage));
      return totalPages;
    }
  }, {
    key: "nextPage",
    value: function nextPage() {
      var totalPages = this.getTotalPages();

      if (this.props.query.page < totalPages) {
        this.props.query.setPage(this.props.query.page + 1);
      }
    }
  }, {
    key: "previousPage",
    value: function previousPage() {
      if (this.props.query.page > 1) {
        this.props.query.setPage(this.props.query.page - 1);
      }
    }
  }, {
    key: "firstPage",
    value: function firstPage() {
      this.props.query.setPage(1);
    }
  }, {
    key: "lastPage",
    value: function lastPage() {
      this.props.query.setPage(this.getTotalPages());
    }
  }, {
    key: "render",
    value: function render() {
      var _this15 = this;

      if (_.isEmpty(this.props.query) || _.isEmpty(this.props.data.rows)) {
        return null;
      }

      var totalPages = this.getTotalPages();
      var visible = totalPages > 1;
      var page = parseInt(this.props.query.page || 1);
      var pages = [];
      var visiblePages = [];

      if (totalPages > 10) {
        if (page > 1) {
          visiblePages.push(page - 1);
        }

        visiblePages.push(page);

        if (page < totalPages) {
          visiblePages.push(page + 1);
        }

        var range = 10;

        if (totalPages > 100) {
          range = 100;
        } else if (totalPages > 1000) {
          range = 1000;
        }

        visiblePages = _.sortBy(_.union(visiblePages, _.range(range, totalPages, range)), function (i) {
          return i;
        });
      } else {
        visiblePages = _.range(1, totalPages + 1);
      }

      visiblePages.forEach(function (i) {
        var active = i === page ? "active" : "";
        pages.push(React.createElement("li", {
          key: i,
          className: active
        }, React.createElement("a", {
          href: "javascript:;",
          onClick: _this15.changePage.bind(_this15, i)
        }, i)));
      });
      return React.createElement("ul", {
        className: "pagination",
        hidden: !visible
      }, React.createElement("li", null, React.createElement("a", {
        href: "javascript:;",
        onClick: this.firstPage.bind(this),
        "aria-label": "First"
      }, React.createElement("i", {
        className: "zmdi zmdi-arrow-left"
      }))), React.createElement("li", null, React.createElement("a", {
        href: "javascript:;",
        onClick: this.previousPage.bind(this),
        "aria-label": "Previous"
      }, React.createElement("i", {
        className: "zmdi zmdi-chevron-left"
      }))), pages, React.createElement("li", null, React.createElement("a", {
        href: "javascript:;",
        onClick: this.nextPage.bind(this),
        "aria-label": "Next"
      }, React.createElement("i", {
        className: "zmdi zmdi-chevron-right"
      }))), React.createElement("li", null, React.createElement("a", {
        href: "javascript:;",
        onClick: this.lastPage.bind(this),
        "aria-label": "First"
      }, React.createElement("i", {
        className: "zmdi zmdi-arrow-right"
      }))));
    }
  }]);

  return Pagination;
}(React.Component);

exports.Pagination = Pagination;

var ResultSummary =
/*#__PURE__*/
function (_React$Component13) {
  _inherits(ResultSummary, _React$Component13);

  function ResultSummary() {
    _classCallCheck(this, ResultSummary);

    return _possibleConstructorReturn(this, _getPrototypeOf(ResultSummary).apply(this, arguments));
  }

  _createClass(ResultSummary, [{
    key: "render",
    value: function render() {
      var totalRows = 0;
      var start = 0;
      var stop = 0;
      var rowsPerPage = 0;
      var page = 0;

      if (this.props.query && this.props.data.rows) {
        rowsPerPage = this.props.query.rowsPerPage || 0;
        totalRows = this.props.data.totalRows;
        page = parseInt(this.props.query.page || 1);
        start = (page - 1) * rowsPerPage + 1;
        stop = Math.min(page * rowsPerPage, totalRows);
      }

      return React.createElement("p", {
        className: "result-summary"
      }, (0, _lang.format)((0, _strings["default"])("pagination"), start, stop, totalRows));
    }
  }]);

  return ResultSummary;
}(React.Component);

exports.ResultSummary = ResultSummary;

var NoCard =
/*#__PURE__*/
function (_React$Component14) {
  _inherits(NoCard, _React$Component14);

  function NoCard() {
    _classCallCheck(this, NoCard);

    return _possibleConstructorReturn(this, _getPrototypeOf(NoCard).apply(this, arguments));
  }

  _createClass(NoCard, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null, this.props.children);
    }
  }]);

  return NoCard;
}(React.Component);

exports.NoCard = NoCard;

var QuickSearch =
/*#__PURE__*/
function (_React$Component15) {
  _inherits(QuickSearch, _React$Component15);

  function QuickSearch(props) {
    var _this16;

    _classCallCheck(this, QuickSearch);

    _this16 = _possibleConstructorReturn(this, _getPrototypeOf(QuickSearch).call(this, props));
    _this16._onChange = _.debounce(function (keyword) {
      if (!_.isEmpty(_this16.props.query)) {
        _this16.props.query.setKeyword(keyword);
      }
    }, 250);
    return _this16;
  }

  _createClass(QuickSearch, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var me = ReactDOM.findDOMNode(this);
      $(me).find("input[type=search]").focus(function () {
        $(me).find(".quick-search").addClass("quick-search__active");
      }).blur(function () {
        $(me).find(".quick-search").removeClass("quick-search__active");
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "onChange",
    value: function onChange(e) {
      this._onChange(e.target.value);
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(e) {
      if ((0, _keyboard.isEnter)(e.which)) {
        e.preventDefault();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "quick-search-container"
      }, React.createElement("div", {
        className: "quick-search"
      }, React.createElement("i", {
        className: "zmdi zmdi-search pull-left"
      }), React.createElement("div", {
        className: "quick-search-input-container"
      }, React.createElement("input", {
        type: "search",
        onKeyDown: this.onKeyDown.bind(this),
        onChange: this.onChange.bind(this),
        placeholder: (0, _strings["default"])("search")
      }), React.createElement("div", {
        className: "form-control__bar"
      }))));
    }
  }]);

  return QuickSearch;
}(React.Component);

exports.QuickSearch = QuickSearch;

var Grid =
/*#__PURE__*/
function (_React$Component16) {
  _inherits(Grid, _React$Component16);

  function Grid(props) {
    var _this17;

    _classCallCheck(this, Grid);

    _this17 = _possibleConstructorReturn(this, _getPrototypeOf(Grid).call(this, props));
    _this17.selection = null;
    _this17.state = {
      rows: null
    };

    _this17.initSelection(props);

    return _this17;
  }

  _createClass(Grid, [{
    key: "getTotalRows",
    value: function getTotalRows() {
      var totalRows = parseInt(this.props.data.totalRows);
      return totalRows;
    }
  }, {
    key: "onKeyPress",
    value: function onKeyPress(e) {}
  }, {
    key: "onBlur",
    value: function onBlur() {
      if (this.selection) {
        this.selection.shiftPressed = false;
        this.selection.controlPressed = false;
      }
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(e) {
      var me = ReactDOM.findDOMNode(this);

      if (this.selection != null) {
        if ((0, _keyboard.isShift)(e.which)) {
          me.onselectstart = function () {
            return false;
          };

          this.selection.shiftPressed = true;
          e.preventDefault();
          return;
        } else if ((0, _keyboard.isControl)(e.which)) {
          this.selection.controlPressed = true;
          e.preventDefault();
          return;
        } else if ((0, _keyboard.isUp)(e.which)) {
          this.selection.up();
          e.preventDefault();
          return;
        } else if ((0, _keyboard.isDown)(e.which)) {
          this.selection.down();
          e.preventDefault();
          return;
        } else if ((0, _keyboard.isEsc)(e.which)) {
          this.selection.clear();
          e.preventDefault();
          return;
        }
      }

      if (_.isFunction(this.props.onKeyDown)) {
        this.props.onKeyDown(e);
      }
    }
  }, {
    key: "onKeyUp",
    value: function onKeyUp(e) {
      var me = ReactDOM.findDOMNode(this);

      if (this.selection != null) {
        if ((0, _keyboard.isShift)(e.which)) {
          me.onselectstart = null;
          this.selection.shiftPressed = false;
          e.preventDefault();
          return;
        } else if ((0, _keyboard.isControl)(e.which)) {
          this.selection.controlPressed = false;
          e.preventDefault();
          return;
        }
      }

      if (_.isFunction(this.props.onKeyUp)) {
        this.props.onKeyUp(e);
      }
    }
  }, {
    key: "onRowMouseDown",
    value: function onRowMouseDown(row) {
      var selectionEnabled = (0, _lang.optional)((0, _lang.parseBoolean)(this.props.selectionEnabled), true);

      if (!selectionEnabled) {
        return;
      }

      this.selection.handle(row);
    }
  }, {
    key: "onRowDoubleClick",
    value: function onRowDoubleClick(row) {
      if (_.isFunction(this.props.onRowDoubleClick)) {
        this.props.onRowDoubleClick(row.data);
      }
    }
  }, {
    key: "onRowExpand",
    value: function onRowExpand(row) {
      var _this18 = this;

      var expanded = !row.expanded;

      if (expanded) {
        eachChildren(row.children, function (r) {
          return r.expandedNow = true;
        });
      } else {
        eachChildren(row.children, function (r) {
          return r.collapsedNow = true;
        });
      }

      if (!expanded) {
        this.forceUpdate();
        setTimeout(function () {
          row.expanded = expanded;

          _this18.forceUpdate();
        }, EXPAND_ANIMATION_TIME);
      } else {
        row.expanded = expanded;
        this.forceUpdate();
      }

      if (_.isFunction(this.props.onRowExpand)) {
        this.props.onRowExpand(row.data, expanded);
      }
    }
  }, {
    key: "initSelection",
    value: function initSelection(props) {
      var _this19 = this;

      var selectionEnabled = (0, _lang.optional)((0, _lang.parseBoolean)(props.selectionEnabled), true);

      if (!selectionEnabled) {
        return;
      }

      var rows = props.data && props.data.rows;

      if (rows) {
        this.selection = new Selection(rows);
        this.selection.single = props.selectionMode === "single";
        this.selection.on("change", function () {
          _this19.setState(_this19.state);

          if (_.isFunction(_this19.props.onSelectionChanged)) {
            _this19.props.onSelectionChanged(_this19.selection.getSelectedData());
          }
        });
      }
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.initSelection(nextProps);
      var rows = nextProps.data && nextProps.data.rows;
      this.setState(_.assign(this.state, {
        rows: rows
      }));
    }
  }, {
    key: "toggleSelectAll",
    value: function toggleSelectAll() {
      var selectionEnabled = (0, _lang.optional)((0, _lang.parseBoolean)(this.props.selectionEnabled), true);

      if (!selectionEnabled) {
        return;
      }

      if (this.selection) {
        this.selection.toggleAll();
      }
    }
  }, {
    key: "clearSelection",
    value: function clearSelection() {
      var selectionEnabled = (0, _lang.optional)((0, _lang.parseBoolean)(this.props.selectionEnabled), true);

      if (!selectionEnabled) {
        return;
      }

      if (this.selection) {
        this.selection.clear();
      }
    }
  }, {
    key: "getSelection",
    value: function getSelection() {
      var selectionEnabled = (0, _lang.optional)((0, _lang.parseBoolean)(this.props.selectionEnabled), true);

      if (!selectionEnabled) {
        return;
      }

      if (this.selection) {
        return this.selection.getSelectedData();
      } else {
        return null;
      }
    }
  }, {
    key: "getTotalPages",
    value: function getTotalPages() {
      if (!this.props.data || !this.props.data.rows || !this.props.query) {
        return 1;
      }

      var totalPages = parseInt(Math.ceil(this.props.data.totalRows / this.props.query.rowsPerPage));
      return totalPages;
    }
  }, {
    key: "render",
    value: function render() {
      var _this20 = this;

      if (_.isEmpty(this.props.descriptor)) {
        return null;
      } //customization properties


      var quickSearchEnabled = (0, _lang.optional)((0, _lang.parseBoolean)(this.props.quickSearchEnabled), false);
      var headerVisible = (0, _lang.optional)((0, _lang.parseBoolean)(this.props.headerVisible), true);
      var footerVisible = (0, _lang.optional)((0, _lang.parseBoolean)(this.props.footerVisible), true);
      var summaryVisible = (0, _lang.optional)((0, _lang.parseBoolean)(this.props.summaryVisible), true);
      var noResultsVisible = (0, _lang.optional)((0, _lang.parseBoolean)(this.props.noResultsVisible), true); //let selectionEnabled = optional(parseBoolean(this.props.selectionEnabled), true)

      var paginationEnabled = (0, _lang.optional)((0, _lang.parseBoolean)(this.props.paginationEnabled), true);
      var tableClassName = (0, _lang.optional)(this.props.tableClassName, "table table-striped table-hover");
      var noResultsText = (0, _lang.optional)(this.props.noResultsText, (0, _strings["default"])("noResults"));
      var myQuery = (0, _lang.optional)(this.props.query, query.create());
      var showFilters = myQuery.filters.length > 0;
      var hasResults = this.props.data && this.props.data.rows ? this.props.data.rows.length > 0 : false;
      var hasPagination = this.getTotalPages() > 1;
      var Container = (0, _lang.optional)((0, _lang.parseBoolean)(this.props.showInCard), true) ? _common.Card : NoCard;
      var descriptor = mobile.isMobile() ? _.assign({}, this.props.descriptor, {
        columns: _.union(this.props.descriptor.columns, [{
          cell: ActionsCell,
          tdClassName: "grid-actions",
          actions: [{
            icon: "zmdi zmdi-edit",
            action: function action(row) {
              if (_.isFunction(_this20.props.onRowDoubleClick)) {
                _this20.props.onRowDoubleClick(row);
              }
            }
          }],
          props: {
            showAlways: true
          }
        }])
      }) : this.props.descriptor;
      return React.createElement("div", {
        className: "grid",
        tabIndex: "0",
        onBlur: this.onBlur.bind(this),
        onKeyPress: this.onKeyPress.bind(this),
        onKeyUp: this.onKeyUp.bind(this),
        onKeyDown: this.onKeyDown.bind(this)
      }, React.createElement(Container, null, React.createElement("div", null, quickSearchEnabled && React.createElement(QuickSearch, {
        query: myQuery
      }), showFilters && React.createElement(Filters, {
        query: myQuery
      }), React.createElement("div", {
        className: "clearfix"
      }), hasResults ? React.createElement("div", {
        className: "with-result"
      }, React.createElement("table", {
        className: tableClassName
      }, headerVisible && React.createElement(GridHeader, {
        descriptor: descriptor,
        query: myQuery
      }), React.createElement(GridBody, {
        descriptor: descriptor,
        data: this.props.data,
        query: myQuery,
        onRowExpand: this.onRowExpand.bind(this),
        onRowMouseDown: this.onRowMouseDown.bind(this),
        onRowDoubleClick: this.onRowDoubleClick.bind(this)
      }), footerVisible && React.createElement(GridFooter, {
        descriptor: descriptor
      })), hasPagination && paginationEnabled && React.createElement("div", {
        className: "pull-right m-20"
      }, React.createElement(Pagination, {
        data: this.props.data,
        query: myQuery
      })), summaryVisible && React.createElement(ResultSummary, {
        query: myQuery,
        data: this.props.data
      }), React.createElement("div", {
        className: "clearfix"
      })) : //no results
      noResultsVisible && React.createElement("div", {
        className: "no-results text-center p-30"
      }, React.createElement("h1", null, React.createElement("i", {
        className: "zmdi zmdi-info-outline"
      })), React.createElement("h4", null, noResultsText)))));
    }
  }]);

  return Grid;
}(React.Component);

exports.Grid = Grid;

var EditCheckCell =
/*#__PURE__*/
function (_Cell6) {
  _inherits(EditCheckCell, _Cell6);

  function EditCheckCell(props) {
    var _this21;

    _classCallCheck(this, EditCheckCell);

    _this21 = _possibleConstructorReturn(this, _getPrototypeOf(EditCheckCell).call(this, props));
    _this21.state = {
      value: "false"
    };
    return _this21;
  }

  _createClass(EditCheckCell, [{
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps, nextState) {
      if (nextProps.value != nextState.value) {
        this.setState({
          value: nextProps.value
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        value: this.props.value
      });
    }
  }, {
    key: "onValueChange",
    value: function onValueChange(e) {
      var newValue = $(e.target).is(":checked");
      this.setState({
        value: newValue
      });

      if (_.isFunction(this.props.onValueChange)) {
        var column = this.props.column;
        var property = this.props.property;
        var row = this.props.row;
        this.props.onValueChange(column, row.data, newValue);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var property = this.props.property;
      var value = (0, _lang.optional)(this.state.value, "false");
      var checked = value === true || value === "true";
      return React.createElement("div", {
        className: "checkbox",
        onClick: this.onValueChange.bind(this)
      }, React.createElement("label", null, React.createElement("input", {
        type: "checkbox",
        value: value,
        "data-property": property,
        checked: checked
      }), React.createElement("i", {
        className: "input-helper"
      })));
    }
  }]);

  return EditCheckCell;
}(Cell);

exports.EditCheckCell = EditCheckCell;

function createCell(column, row, firstElement, onExpand) {
  var props = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var key = column.property + "" + row.index;
  var value = row.data[column.property];
  var cell = _.isFunction(column.getCell) ? column.getCell(value, row) : column.cell;
  return React.createElement(cell, _.assign({
    key: key,
    column: column,
    property: column.property,
    row: row,
    value: value,
    firstElement: firstElement,
    onExpand: onExpand
  }, props));
}

var ButtonCell =
/*#__PURE__*/
function (_Cell7) {
  _inherits(ButtonCell, _Cell7);

  function ButtonCell() {
    _classCallCheck(this, ButtonCell);

    return _possibleConstructorReturn(this, _getPrototypeOf(ButtonCell).apply(this, arguments));
  }

  _createClass(ButtonCell, [{
    key: "onClick",
    value: function onClick() {
      if (_.isFunction(this.props.action)) {
        this.props.action(this.props.column, this.props.row.data, this.props.value);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var formatter = _.isFunction(this.props.formatter) ? this.props.formatter : function (v) {
        return v;
      };
      var className = (0, _lang.optional)(this.props.className, "btn btn-link ");
      var value = formatter(this.getValue());
      return value === "NA" ? React.createElement("span", null, value) : React.createElement("a", {
        ref: "button",
        href: "javascript:;",
        className: className,
        onClick: this.onClick.bind(this)
      }, React.createElement("span", null, value));
    }
  }]);

  return ButtonCell;
}(Cell);

exports.ButtonCell = ButtonCell;

},{"../../aj/events":10,"../../api/query":18,"../../strings":347,"../../utils/datasource":349,"../../utils/lang":350,"../utils/keyboard":377,"../utils/mobile":378,"./common":351,"./forms":353}],355:[function(require,module,exports){
"use strict";

var _menu = require("../../stores/menu");

var _session = require("../../stores/session");

var _ui = require("../../stores/ui");

var _menu2 = require("../../actions/menu");

var _session2 = require("../../actions/session");

var ui = _interopRequireWildcard(require("../utils/ui"));

var _loader = require("./loader");

var _aj = require("../utils/aj");

var _lang = require("../../utils/lang");

var _strings = _interopRequireDefault(require("../../strings"));

var _underscore = _interopRequireDefault(require("underscore"));

var _system = require("../../stores/system");

var _system2 = require("../../actions/system");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function showPageLoader() {
  $(".page-loader").show();
}

function hidePageLoader() {
  $(".page-loader").fadeOut(500);
}

var Header =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Header, _React$Component);

  function Header() {
    _classCallCheck(this, Header);

    return _possibleConstructorReturn(this, _getPrototypeOf(Header).apply(this, arguments));
  }

  _createClass(Header, [{
    key: "render",
    value: function render() {
      return React.createElement("header", {
        id: "header",
        className: "header clearfix"
      }, React.createElement("div", {
        className: "navigation-trigger hidden-xl-up",
        "data-ma-action": "aside-open",
        "data-ma-target": ".sidebar"
      }, React.createElement("div", {
        className: "navigation-trigger__inner"
      }, React.createElement("i", {
        className: "navigation-trigger__line"
      }), React.createElement("i", {
        className: "navigation-trigger__line"
      }), React.createElement("i", {
        className: "navigation-trigger__line"
      }))), React.createElement("div", {
        className: "header__logo hidden-sm-down"
      }, React.createElement("h1", null, React.createElement("a", {
        href: "index.html"
      }, (0, _strings["default"])("appName")))));
    }
  }]);

  return Header;
}(React.Component);

var ProfileBox =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(ProfileBox, _React$Component2);

  function ProfileBox(props) {
    var _this;

    _classCallCheck(this, ProfileBox);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProfileBox).call(this, props));
    (0, _aj.connect)(_assertThisInitialized(_this), [_session.SessionStore, _ui.UIStore]);
    _this.state = {};
    return _this;
  }

  _createClass(ProfileBox, [{
    key: "logout",
    value: function logout() {
      (0, _session2.logout)();
      ui.navigate("/login");
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement("div", {
        className: "user"
      }, React.createElement("div", {
        className: "user__info",
        "data-toggle": "dropdown"
      }, this.state.profileImage ? React.createElement("img", {
        className: "user__img",
        src: this.state.profileImage,
        alt: ""
      }) : React.createElement("img", {
        className: "user__img",
        src: "theme/img/demo/profile-pics/1.jpg",
        alt: ""
      }), React.createElement("img", {
        className: "user__img",
        src: "demo/img/profile-pics/8.jpg",
        alt: ""
      }), React.createElement("div", null, React.createElement("div", {
        className: "user__name"
      }, (0, _lang.optional)(function () {
        return _this2.state.user.name;
      }, "NA")), React.createElement("div", {
        className: "user__email"
      }, (0, _lang.optional)(function () {
        return _this2.state.user.mail;
      }, "NA")))), React.createElement("div", {
        className: "dropdown-menu"
      }, React.createElement("a", {
        className: "dropdown-item",
        href: "#"
      }, "View Profile"), React.createElement("a", {
        className: "dropdown-item",
        href: "#"
      }, "Settings"), React.createElement("a", {
        className: "dropdown-item",
        href: "#",
        onClick: this.logout.bind(this)
      }, React.createElement("i", {
        className: "zmdi zmdi-time-restore"
      }), " Logout")));
    }
  }]);

  return ProfileBox;
}(React.Component);

var MenuLevel =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(MenuLevel, _React$Component3);

  function MenuLevel() {
    _classCallCheck(this, MenuLevel);

    return _possibleConstructorReturn(this, _getPrototypeOf(MenuLevel).apply(this, arguments));
  }

  _createClass(MenuLevel, [{
    key: "onSelect",
    value: function onSelect(item) {
      if (item.href) {
        location.href = item.href;
      }

      if (_underscore["default"].isFunction(this.props.onSelect)) {
        this.props.onSelect(item);
      }

      var hasChildren = !_underscore["default"].isEmpty(item.children);

      if (hasChildren) {
        this.onExpand(item);
      }
    }
  }, {
    key: "onExpand",
    value: function onExpand(item) {
      if (_underscore["default"].isFunction(this.props.onExpand)) {
        this.props.onExpand(item);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var menu = (0, _lang.optional)(this.props.menu, []);
      var isMainMenu = (0, _lang.optional)((0, _lang.parseBoolean)(this.props.isMainMenu), false);
      var key = 1;
      var items = menu.map(function (i) {
        var className = "";

        if (i.active) {
          className += "active";
        }

        var hasChildren = !_underscore["default"].isEmpty(i.children);

        if (hasChildren) {
          className += " navigation__sub";
        }

        if (i.expanded) {
          className += " toggled";
        }

        return React.createElement("li", {
          key: key++,
          className: className
        }, React.createElement("a", {
          href: "javascript:;",
          onClick: _this3.onSelect.bind(_this3, i),
          "data-ma-action": hasChildren ? "submenu-toggle" : undefined
        }, React.createElement("i", {
          className: i.icon
        }), " ", i.text), hasChildren && React.createElement(MenuLevel, {
          parent: i,
          menu: i.children,
          onExpand: _this3.onExpand.bind(_this3, i),
          onSelect: _this3.onSelect.bind(_this3)
        }));
      });
      var expanded = !isMainMenu && this.props.parent.expanded === true;
      var style = {};

      if (expanded) {
        style.display = "block";
      }

      var className = "";

      if (isMainMenu) {
        className += "navigation";
      } else {
        className = "navigation__sub";
      }

      return React.createElement("ul", {
        className: className,
        style: style
      }, items);
    }
  }]);

  return MenuLevel;
}(React.Component);

var MainMenu =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(MainMenu, _React$Component4);

  function MainMenu() {
    _classCallCheck(this, MainMenu);

    return _possibleConstructorReturn(this, _getPrototypeOf(MainMenu).apply(this, arguments));
  }

  _createClass(MainMenu, [{
    key: "onExpand",
    value: function onExpand(item) {
      if (_underscore["default"].isFunction(this.props.onExpand)) {
        this.props.onExpand(item);
      }
    }
  }, {
    key: "onSelect",
    value: function onSelect(item) {
      if (_underscore["default"].isFunction(this.props.onSelect)) {
        this.props.onSelect(item);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var menu = this.props.menu;
      return React.createElement(MenuLevel, {
        menu: menu,
        isMainMenu: "true",
        onExpand: this.onExpand.bind(this),
        onSelect: this.onSelect.bind(this)
      });
    }
  }]);

  return MainMenu;
}(React.Component);

var SideBar =
/*#__PURE__*/
function (_React$Component5) {
  _inherits(SideBar, _React$Component5);

  function SideBar() {
    _classCallCheck(this, SideBar);

    return _possibleConstructorReturn(this, _getPrototypeOf(SideBar).apply(this, arguments));
  }

  _createClass(SideBar, [{
    key: "render",
    value: function render() {
      return React.createElement("aside", {
        id: "sidebar",
        className: "sidebar"
      }, React.createElement("div", {
        className: "scrollbar-inner"
      }, React.createElement(ProfileBox, null), React.createElement(MainMenuContainer, null)));
    }
  }]);

  return SideBar;
}(React.Component);

var MainMenuContainer =
/*#__PURE__*/
function (_React$Component6) {
  _inherits(MainMenuContainer, _React$Component6);

  function MainMenuContainer(props) {
    var _this4;

    _classCallCheck(this, MainMenuContainer);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(MainMenuContainer).call(this, props));
    (0, _aj.connect)(_assertThisInitialized(_this4), _menu.MenuStore, {
      menu: []
    });
    logger.i("Menu created");
    return _this4;
  }

  _createClass(MainMenuContainer, [{
    key: "onSelect",
    value: function onSelect(item) {
      (0, _menu2.setActiveMenuItem)({
        item: item
      });
    }
  }, {
    key: "onExpand",
    value: function onExpand(item) {
      (0, _menu2.expandMenuItem)({
        item: item
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(MainMenu, {
        menu: this.state.menu,
        onExpand: this.onExpand.bind(this),
        onSelect: this.onSelect.bind(this)
      });
    }
  }]);

  return MainMenuContainer;
}(React.Component);

var Footer =
/*#__PURE__*/
function (_React$Component7) {
  _inherits(Footer, _React$Component7);

  function Footer(props) {
    var _this5;

    _classCallCheck(this, Footer);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Footer).call(this, props));
    (0, _aj.connect)(_assertThisInitialized(_this5), _system.SystemStore, {});
    return _this5;
  }

  _createClass(Footer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      (0, _system2.systemInformation)();
    }
  }, {
    key: "render",
    value: function render() {
      var backendVersion = this.state.backendVersion;
      var apiVersion = this.state.apiVersion;
      var copyrightInfos = this.state.copyrightInfos;
      return React.createElement("footer", {
        className: "footer hidden-xs-down"
      }, React.createElement("ul", {
        className: "nav footer__nav"
      }, backendVersion && React.createElement("li", null, " Web: v ", backendVersion), apiVersion && React.createElement("li", null, " API: v ", apiVersion), copyrightInfos && React.createElement("li", null, " Copyright: ", copyrightInfos)));
    }
  }]);

  return Footer;
}(React.Component);

var Layout =
/*#__PURE__*/
function (_React$Component8) {
  _inherits(Layout, _React$Component8);

  function Layout() {
    _classCallCheck(this, Layout);

    return _possibleConstructorReturn(this, _getPrototypeOf(Layout).apply(this, arguments));
  }

  _createClass(Layout, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null, React.createElement(Header, null), React.createElement(SideBar, null), React.createElement("section", {
        className: "content"
      }, this.props.children), React.createElement(Footer, null));
    }
  }]);

  return Layout;
}(React.Component);

var FullScreenLayout =
/*#__PURE__*/
function (_React$Component9) {
  _inherits(FullScreenLayout, _React$Component9);

  function FullScreenLayout() {
    _classCallCheck(this, FullScreenLayout);

    return _possibleConstructorReturn(this, _getPrototypeOf(FullScreenLayout).apply(this, arguments));
  }

  _createClass(FullScreenLayout, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null, this.props.children);
    }
  }]);

  return FullScreenLayout;
}(React.Component);

var ScreenContainer =
/*#__PURE__*/
function (_React$Component10) {
  _inherits(ScreenContainer, _React$Component10);

  function ScreenContainer(props) {
    var _this6;

    _classCallCheck(this, ScreenContainer);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(ScreenContainer).call(this, props));
    _this6.state = {
      currentScreen: null
    };
    return _this6;
  }

  _createClass(ScreenContainer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this7 = this;

      ui.addScreenChangeListener(function (screen) {
        //showPageLoader()
        _this7.setState(_underscore["default"].assign(_this7.state, {
          currentScreen: screen
        })); //hidePageLoader()

      });
    }
  }, {
    key: "render",
    value: function render() {
      if (_underscore["default"].isEmpty(this.state.currentScreen)) {
        return React.createElement("div", null);
      }

      return this.state.currentScreen;
    }
  }]);

  return ScreenContainer;
}(React.Component);

var Screen =
/*#__PURE__*/
function (_React$Component11) {
  _inherits(Screen, _React$Component11);

  function Screen() {
    _classCallCheck(this, Screen);

    return _possibleConstructorReturn(this, _getPrototypeOf(Screen).apply(this, arguments));
  }

  return Screen;
}(React.Component);

var Index =
/*#__PURE__*/
function (_React$Component12) {
  _inherits(Index, _React$Component12);

  function Index(props) {
    var _this8;

    _classCallCheck(this, Index);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(Index).call(this, props));
    _this8.state = {};
    return _this8;
  }

  _createClass(Index, [{
    key: "render",
    value: function render() {
      return React.createElement("div", null, React.createElement(_loader.PageLoader, null), React.createElement(_loader.GlobalLoader, null), React.createElement(_loader.UnobtrusiveLoader, null), React.createElement(ScreenContainer, null));
    }
  }]);

  return Index;
}(React.Component);

exports.Index = Index;
exports.Screen = Screen;
exports.FullScreenLayout = FullScreenLayout;
exports.Layout = Layout;
exports.Header = Header;
exports.Footer = Footer;

},{"../../actions/menu":3,"../../actions/session":4,"../../actions/system":5,"../../stores/menu":341,"../../stores/session":343,"../../stores/system":344,"../../stores/ui":346,"../../strings":347,"../../utils/lang":350,"../utils/aj":373,"../utils/ui":379,"./loader":356,"underscore":337}],356:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hidePageLoader = hidePageLoader;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function hidePageLoader() {
  $(".page-loader").fadeOut(500);
}

var PageLoader =
/*#__PURE__*/
function (_React$Component) {
  _inherits(PageLoader, _React$Component);

  function PageLoader() {
    _classCallCheck(this, PageLoader);

    return _possibleConstructorReturn(this, _getPrototypeOf(PageLoader).apply(this, arguments));
  }

  _createClass(PageLoader, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.loading) {
        $(this.refs.page_loader).show();
      } else {
        $(this.refs.page_loader).fadeOut(500);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "page-loader",
        style: {
          display: "block"
        }
      }, React.createElement("div", {
        className: "preloader"
      }, React.createElement("svg", {
        className: "pl-circular",
        viewBox: "25 25 50 50"
      }, React.createElement("circle", {
        className: "plc-path",
        cx: "50",
        cy: "50",
        r: "20"
      })), React.createElement("p", null, "Please wait...")));
    }
  }]);

  return PageLoader;
}(React.Component);

var GlobalLoader =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(GlobalLoader, _React$Component2);

  function GlobalLoader() {
    _classCallCheck(this, GlobalLoader);

    return _possibleConstructorReturn(this, _getPrototypeOf(GlobalLoader).apply(this, arguments));
  }

  _createClass(GlobalLoader, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "global-loader",
        style: {
          display: "none"
        }
      }, React.createElement("div", {
        className: "layer"
      }), React.createElement("div", {
        className: "preloader"
      }, React.createElement("svg", {
        className: "pl-circular",
        viewBox: "25 25 50 50"
      }, React.createElement("circle", {
        className: "plc-path",
        cx: "50",
        cy: "50",
        r: "20"
      }))), React.createElement("p", {
        className: "message"
      }, "Please wait..."));
    }
  }]);

  return GlobalLoader;
}(React.Component);

var Preloader =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(Preloader, _React$Component3);

  function Preloader() {
    _classCallCheck(this, Preloader);

    return _possibleConstructorReturn(this, _getPrototypeOf(Preloader).apply(this, arguments));
  }

  _createClass(Preloader, [{
    key: "render",
    value: function render() {
      return this.props.visible || true ? React.createElement("div", {
        className: "preloader"
      }, React.createElement("svg", {
        className: "pl-circular",
        viewBox: "25 25 50 50"
      }, React.createElement("circle", {
        className: "plc-path",
        cx: "50",
        cy: "50",
        r: "20"
      }))) : null;
    }
  }]);

  return Preloader;
}(React.Component);

var UnobtrusiveLoader =
/*#__PURE__*/
function (_React$Component4) {
  _inherits(UnobtrusiveLoader, _React$Component4);

  function UnobtrusiveLoader() {
    _classCallCheck(this, UnobtrusiveLoader);

    return _possibleConstructorReturn(this, _getPrototypeOf(UnobtrusiveLoader).apply(this, arguments));
  }

  _createClass(UnobtrusiveLoader, [{
    key: "render",
    value: function render() {
      return React.createElement("div", {
        className: "unobtrusive-loader",
        style: {
          display: "none"
        }
      }, React.createElement("div", {
        className: "preloader pls-white pl-sm"
      }, React.createElement("svg", {
        className: "pl-circular",
        viewBox: "25 25 50 50"
      }, React.createElement("circle", {
        className: "plc-path",
        cx: "50",
        cy: "50",
        r: "20"
      }))));
    }
  }]);

  return UnobtrusiveLoader;
}(React.Component);

exports.PageLoader = PageLoader;
exports.GlobalLoader = GlobalLoader;
exports.Preloader = Preloader;
exports.UnobtrusiveLoader = UnobtrusiveLoader;

},{}],357:[function(require,module,exports){
"use strict";

var _login = _interopRequireDefault(require("../screens/login"));

var _aj = require("../utils/aj");

var _changePassword = _interopRequireDefault(require("../screens/changePassword"));

var _session = require("../../stores/session");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Secure =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Secure, _React$Component);

  function Secure(props) {
    var _this;

    _classCallCheck(this, Secure);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Secure).call(this, props));
    (0, _aj.connect)(_assertThisInitialized(_this), _session.SessionStore);
    return _this;
  }

  _createClass(Secure, [{
    key: "render",
    value: function render() {
      var toPrint = this.props.children;

      if (this.state.isLoggedIn && this.state.user && this.state.user.firstLogin) {
        toPrint = React.createElement(_changePassword["default"], null);
      } else if (!this.state.isLoggedIn) {
        toPrint = React.createElement(_login["default"], null);
      }

      return toPrint;
    }
  }]);

  return Secure;
}(React.Component);

module.exports = Secure;

},{"../../stores/session":343,"../screens/changePassword":361,"../screens/login":369,"../utils/aj":373}],358:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _grids = require("./components/grids");

var _validator = require("../libs/validator");

var _forms = require("./components/forms");

var _containers = require("./components/containers");

var _strings = _interopRequireDefault(require("../strings"));

var _session = require("../api/session");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var entities = {
  user: {
    grid: {
      title: (0, _strings["default"])("usersList"),
      subtitle: (0, _strings["default"])("usersListDescription"),
      descriptor: {
        columns: [{
          property: "name",
          header: (0, _strings["default"])("name"),
          cell: _grids.TextCell,
          sortable: true,
          searchable: true
        }, {
          property: "mail",
          header: (0, _strings["default"])("mail"),
          cell: _grids.TextCell,
          sortable: true,
          searchable: true
        }, {
          property: "active",
          header: (0, _strings["default"])("active"),
          cell: _grids.CheckCell,
          sortable: true,
          searchable: true
        }]
      }
    },
    form: {
      title: (0, _strings["default"])("editUser"),
      subtitle: (0, _strings["default"])("editUserDescription"),
      getActions: function getActions(data) {
        var actions = ["back", "save", "save-go-back", "revisions"];

        if ((0, _session.hasPermission)("canResetPassword")) {
          if (data && data.id) {
            actions.push({
              type: "button",
              icon: "zmdi zmdi-brush",
              tooltip: "Reset password",
              action: function action() {
                swal({
                  title: (0, _strings["default"])("confirm"),
                  text: "Verrà impostata una nuova password ed inviata all'indirizzo mail dell'utente",
                  showCancelButton: true
                }).then(function (res) {
                  if (res.value) {
                    resetUserPassword({
                      id: data.id
                    });

                    if (data.id === (0, _session.getLoggedUser)().id) {
                      swal({
                        title: (0, _strings["default"])("confirm"),
                        text: "La tua password è stata resettata. Dovrai eseguire un nuovo accesso",
                        showCancelButton: false
                      }).then(function (res) {
                        if (res.value) {
                          logout();
                          ui.navigate("/login");
                        }
                      });
                    }
                  }
                })["catch"](function (e) {
                  logger.i(e);
                });
              }
            });
          }
        }

        return actions;
      },
      descriptor: {
        areas: [{
          title: (0, _strings["default"])("generalInformations"),
          subtitle: null,
          fields: [{
            property: "name",
            control: _forms.Text,
            label: (0, _strings["default"])("name"),
            placeholder: (0, _strings["default"])("name"),
            sanitizer: function sanitizer(value) {
              return (0, _validator.sanitize)(value).trim();
            },
            validator: function validator(value) {
              return (0, _validator.check)(value).notEmpty();
            }
          }, {
            property: "mail",
            control: _forms.Mail,
            label: (0, _strings["default"])("mail"),
            placeholder: (0, _strings["default"])("mailAddress"),
            sanitizer: function sanitizer(value) {
              return (0, _validator.sanitize)(value).trim();
            },
            validator: function validator(value) {
              return (0, _validator.check)(value).isEmail();
            }
          }, {
            property: "password",
            control: _forms.PasswordText,
            label: (0, _strings["default"])("password"),
            placeholder: (0, _strings["default"])("password"),
            sanitizer: function sanitizer(value) {
              return (0, _validator.sanitize)(value).trim();
            }
          }, {
            property: "active",
            control: _forms.YesNo,
            label: (0, _strings["default"])("active"),
            sanitizer: function sanitizer(value) {
              return (0, _validator.sanitize)(value).toBoolean();
            }
          }, {
            property: "_image",
            control: _forms.Image,
            label: (0, _strings["default"])("image")
          }, {
            property: "_cover",
            control: _forms.Image,
            label: (0, _strings["default"])("cover")
          }, {
            property: "roles",
            label: (0, _strings["default"])("roles"),
            control: _containers.EntitiesLookupContainer,
            props: {
              id: "user_roles",
              mode: "multiple",
              entity: "role",
              selectionGrid: {
                columns: [{
                  property: "role",
                  header: (0, _strings["default"])("name"),
                  cell: _grids.TextCell
                }]
              },
              popupGrid: {
                columns: [{
                  property: "role",
                  header: (0, _strings["default"])("name"),
                  cell: _grids.TextCell
                }]
              }
            }
          }]
        }]
      }
    }
  },
  role: {
    grid: {
      title: (0, _strings["default"])("rolesList"),
      subtitle: (0, _strings["default"])("rolesListDescription"),
      quickSearchEnabled: true,
      descriptor: {
        columns: [{
          property: "role",
          header: "Role",
          cell: _grids.TextCell,
          sortable: true,
          searchable: true
        }]
      }
    },
    form: {
      title: "Edit role",
      subtitle: null,
      descriptor: {
        fields: [{
          property: "role",
          control: _forms.Text,
          label: (0, _strings["default"])("role"),
          placeholder: (0, _strings["default"])("nameOfRole"),
          sanitizer: function sanitizer(value) {
            return (0, _validator.sanitize)(value).trim();
          },
          validator: function validator(value) {
            return (0, _validator.check)(value).notEmpty();
          }
        }, {
          property: "_permissions",
          label: (0, _strings["default"])("permissions"),
          placeholder: (0, _strings["default"])("selectPermissions"),
          control: _containers.ValuesLookupContainer,
          //sanitizer: value => _.map(value, v => v.value),
          validator: function validator(value) {
            return (0, _validator.check)(value).notEmpty();
          },
          props: {
            id: "role_permissions",
            collection: "permissions",
            mode: "multiple",
            selectionGrid: {
              columns: [{
                property: "label",
                header: (0, _strings["default"])("name"),
                cell: _grids.TextCell
              }]
            },
            popupGrid: {
              columns: [{
                property: "label",
                header: (0, _strings["default"])("name"),
                cell: _grids.TextCell
              }]
            }
          }
        }]
      }
    } // ,revisionSettings: {
    //     form: {
    //         title: M("entityRevisionSettings"),
    //         subtitle: null,
    //         descriptor: {
    //             canGoBack() {
    //                 return false
    //             },
    //             fields: [
    //                 {
    //                     property: "items",
    //                     control: MultiCheckboxByValue,
    //                     size: "col-xs-12",
    //                     props: {
    //                         formatter: v => {
    //                             return M(v.itemType)
    //                         }
    //                     }
    //                 },
    //             ]
    //         }
    //     }
    // },
    // revision: {
    //     grid: {
    //         title: M("revisions"),
    //         descriptor: {
    //             columns: [
    //                 {property: "code", header: M("code"), cell: TextCell, sortable: false, searchable: false},
    //                 {property: "type", header: M("type"), cell: TextCell, sortable: false, searchable: false},
    //                 {
    //                     property: "creator",
    //                     header: M("author"),
    //                     cell: TextCell,
    //                     sortable: false,
    //                     searchable: false
    //                 },
    //
    //                 {
    //                     property: "dateToString",
    //                     header: M("date"),
    //                     cell: TextCell,
    //                     sortable: false,
    //                     searchable: false
    //                 },
    //                 {
    //                     property: "differences",
    //                     header: M("differences"),
    //                     cell: MultiTextCell,
    //                     sortable: false,
    //                     searchable: false,
    //                     props: {
    //                         singleItemFormatter(v) {
    //                             debugger
    //                             let previousValueString = "";
    //                             let newValueString = "";
    //                             previousValueString = M("previousValue") + ": " + (v.previousValueDescription? v.previousValueDescription : " null ") + ", ";
    //                             newValueString = M("newValue") + ": " + (v.newValueDescription? v.newValueDescription : " null ");
    //                             return M(v.name) + " -> " + previousValueString + newValueString
    //                         }
    //                     }
    //                 }
    //
    //             ]
    //         }
    //     },
    // }

  }
};
var _default = entities;
exports["default"] = _default;

},{"../api/session":20,"../libs/validator":28,"../strings":347,"./components/containers":352,"./components/forms":353,"./components/grids":354}],359:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = main;

var _layout = require("./components/layout");

var _login = _interopRequireDefault(require("./screens/login"));

var _register = _interopRequireDefault(require("./screens/register"));

var _recover = _interopRequireDefault(require("./screens/recover"));

var _home = _interopRequireDefault(require("./screens/home"));

var _registrationOk = _interopRequireDefault(require("./screens/registrationOk"));

var _confirm = _interopRequireDefault(require("./screens/confirm"));

var ui = _interopRequireWildcard(require("./utils/ui"));

var plugins = _interopRequireWildcard(require("./pluginsimpl"));

var _session = require("../actions/session");

var keyboard = _interopRequireWildcard(require("./utils/keyboard"));

var _session2 = require("../stores/session");

var _entities = require("./screens/entities");

var _loader = require("./components/loader");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function main() {
  /* Register plugins */
  plugins.register();
  /* Admin routes */

  ui.addRoute("/entities/:entity", function (params) {
    return ui.changeScreen(React.createElement(_entities.EntitiesGrid, {
      key: params.entity,
      entity: params.entity
    }));
  });
  ui.addRoute("/entities/:entity/:entityId", function (params) {
    return ui.changeScreen(React.createElement(_entities.EntityForm, {
      key: params.entity,
      entity: params.entity,
      entityId: params.entityId,
      params: params
    }));
  });
  ui.addRoute("/entities/single/:entity", function (params) {
    return ui.changeScreen(React.createElement(_entities.EntityForm, {
      key: params.entity,
      entity: params.entity,
      entityId: "_",
      params: params
    }));
  });
  ui.addRoute("/revision/:entity/:entityId", function (params) {
    return ui.changeScreen(React.createElement(_entities.RevisionGrid, {
      key: params.entity,
      entityId: params.entityId,
      entity: params.entity,
      params: params
    }));
  });
  ui.addRoute("/recover", function (params) {
    return ui.changeScreen(React.createElement(_recover["default"], null));
  });
  /* Account routes */

  ui.addRoute("/login", function (params) {
    return ui.changeScreen(React.createElement(_login["default"], null));
  });
  ui.addRoute("/register", function (params) {
    return ui.changeScreen(React.createElement(_register["default"], null));
  });
  ui.addRoute("/recover", function (params) {
    return ui.changeScreen(React.createElement(_recover["default"], null));
  });
  ui.addRoute("/registrationComplete", function (params) {
    return ui.changeScreen(React.createElement(_registrationOk["default"], null));
  });
  ui.addRoute("/confirm", function (params) {
    return ui.changeScreen(React.createElement(_confirm["default"], {
      activationCode: params.activationCode
    }));
  });
  /* home route */

  ui.addRoute("/", function (params) {
    return ui.changeScreen(React.createElement(_home["default"], null));
  });
  /* Attach keyboard for global key bindings */

  keyboard.attach();
  /* render main index page into dom */

  ReactDOM.render(React.createElement(_layout.Index, null), document.getElementById("entry-point"));
  /* Avoid going in screens that require login before trying session resume */

  var owner = {};

  _session2.SessionStore.subscribe(owner, function (state) {
    if (state.resumeComplete) {
      _session2.SessionStore.unsubscribe(owner);

      ui.startNavigation();
      (0, _loader.hidePageLoader)();
    }
  });
  /* automatic login, if possible */


  (0, _session.resumeSession)();
}

},{"../actions/session":4,"../stores/session":343,"./components/layout":355,"./components/loader":356,"./pluginsimpl":360,"./screens/confirm":362,"./screens/entities":366,"./screens/home":368,"./screens/login":369,"./screens/recover":370,"./screens/register":371,"./screens/registrationOk":372,"./utils/keyboard":377,"./utils/ui":379}],360:[function(require,module,exports){
"use strict";

exports.Alert = {
  alert: function alert(data, callback) {
    var title = data.title,
        message = data.message,
        type = data.type;

    var _callback = function _callback(v) {
      if (_.isFunction(callback)) {
        callback(v);
      }
    };

    swal({
      title: title,
      text: message,
      type: type
    }).then(function (res) {
      return _callback(res.value);
    });
  },
  confirm: function confirm(data, callback) {
    var title = data.title,
        message = data.message;

    var _callback = function _callback(v) {
      if (_.isFunction(callback)) {
        callback(v);
      }
    };

    swal({
      title: title,
      text: message,
      showCancelButton: true
    }).then(function (res) {
      return _callback(res.value);
    });
  }
};
var loaderCount = 0;
var unobtrusiveLoaderCount = 0;
exports.Loader = {
  show: function show(data, callback) {
    loaderCount++;
    $(".global-loader").find(".message").text(data.message).end().show();
  },
  hide: function hide(data, callback) {
    loaderCount--;

    if (loaderCount <= 0) {
      $(".global-loader").hide();
      loaderCount = 0;
    }
  },
  showUnobtrusive: function showUnobtrusive(data, callback) {
    unobtrusiveLoaderCount++;
    $(".unobtrusive-loader").show();
    $(".hide-on-unobtrusive-loading").hide();
  },
  hideUnobtrusive: function hideUnobtrusive(data, callback) {
    unobtrusiveLoaderCount--;

    if (unobtrusiveLoaderCount <= 0) {
      $(".unobtrusive-loader").hide();
      $(".hide-on-unobtrusive-loading").show();
    }
  }
};
exports.Toast = {
  show: function show(data, callback) {
    $.growl({
      message: data.message,
      url: ''
    }, {
      element: 'body',
      type: "inverse",
      allow_dismiss: true,
      placement: {
        from: "bottom",
        align: "center"
      },
      offset: {
        x: 20,
        y: 85
      },
      spacing: 10,
      z_index: 1031,
      delay: 2500,
      timer: 1000,
      url_target: '_blank',
      mouse_over: false,
      icon_type: 'class',
      template: '<div data-growl="container" class="alert" role="alert">' + '<button type="button" class="close" data-growl="dismiss">' + '<span aria-hidden="true">&times;</span>' + '<span class="sr-only">Close</span>' + '</button>' + '<span data-growl="icon"></span>' + '<span data-growl="message"></span>' + '<a href="#" data-growl="url"></a>' + '</div>'
    });
  }
};

exports.register = function () {
  window.Alert = exports.Alert;
  window.Toast = exports.Toast;
  window.Loader = exports.Loader;
};

},{}],361:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layout = require("../components/layout");

var _strings = _interopRequireDefault(require("../../strings"));

var _account = require("../../actions/account");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ChangePassword =
/*#__PURE__*/
function (_Screen) {
  _inherits(ChangePassword, _Screen);

  function ChangePassword(props) {
    var _this;

    _classCallCheck(this, ChangePassword);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ChangePassword).call(this, props));
    _this.state = {};
    return _this;
  }

  _createClass(ChangePassword, [{
    key: "changePassword",
    value: function changePassword() {
      (0, _account.changePassword)({
        password: this.state.password,
        passwordConfirm: this.state.passwordConfirm
      });
    }
  }, {
    key: "updatePassword",
    value: function updatePassword(value) {
      this.state.password = value.target.value;
    }
  }, {
    key: "updatePasswordConfirm",
    value: function updatePasswordConfirm(value) {
      this.state.passwordConfirm = value.target.value;
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_layout.FullScreenLayout, null, React.createElement("div", {
        className: "login-content"
      }, React.createElement("div", {
        className: "lc-block lc-block-alt toggled",
        id: "l-lockscreen"
      }, React.createElement("div", {
        className: "lcb-form",
        ref: "changePassword_form"
      }, React.createElement("p", null, "E' necessario impostare una password personale al primo accesso nel sistema"), React.createElement("div", {
        className: "input-group m-b-20"
      }, React.createElement("span", {
        className: "input-group-addon"
      }, React.createElement("i", {
        className: "zmdi zmdi-lock"
      })), React.createElement("div", {
        className: "fg-line"
      }, React.createElement("input", {
        type: "password",
        onChange: this.updatePassword.bind(this),
        name: "password",
        className: "form-control",
        placeholder: (0, _strings["default"])("password")
      }))), React.createElement("div", {
        className: "input-group m-b-20"
      }, React.createElement("span", {
        className: "input-group-addon"
      }, React.createElement("i", {
        className: "zmdi zmdi-lock-outline"
      })), React.createElement("div", {
        className: "fg-line"
      }, React.createElement("input", {
        type: "password",
        name: "confirmPassword",
        onChange: this.updatePasswordConfirm.bind(this),
        className: "form-control",
        placeholder: (0, _strings["default"])("passwordConfirm")
      })))), React.createElement("a", {
        href: "javascript:;",
        onClick: this.changePassword.bind(this),
        className: "btn btn-login btn-success btn-float waves-effect waves-circle waves-float"
      }, React.createElement("i", {
        className: "zmdi zmdi-arrow-forward"
      })))));
    }
  }]);

  return ChangePassword;
}(_layout.Screen);

exports["default"] = ChangePassword;

},{"../../actions/account":1,"../../strings":347,"../components/layout":355}],362:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _account = require("../../stores/account");

var _layout = require("../components/layout");

var ui = _interopRequireWildcard(require("../utils/ui"));

var forms = _interopRequireWildcard(require("../utils/forms"));

var _strings = _interopRequireDefault(require("../../strings"));

var _account2 = require("../../actions/account");

var _aj = require("../utils/aj");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Recover =
/*#__PURE__*/
function (_Screen) {
  _inherits(Recover, _Screen);

  function Recover(props) {
    var _this;

    _classCallCheck(this, Recover);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Recover).call(this, props));
    (0, _aj.connect)(_assertThisInitialized(_this), _account.AccountStore, {
      activationCode: ""
    });
    return _this;
  }

  _createClass(Recover, [{
    key: "confirm",
    value: function confirm() {
      var data = forms.serialize(this.refs.confirm_form);
      (0, _account2.confirmAccount)(data);
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(props, state) {
      if (state.confirmed) {
        ui.navigate("/");
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      (0, _account2.setActivationCode)({
        activationCode: this.props.activationCode
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_layout.FullScreenLayout, null, React.createElement("div", {
        className: "login-content"
      }, React.createElement("div", {
        className: "lc-block toggled",
        id: "l-forget-password"
      }, React.createElement("form", {
        action: "javascript:;",
        className: "lcb-form",
        onSubmit: this.confirm.bind(this),
        ref: "confirm_form"
      }, React.createElement("p", {
        className: "text-left"
      }, (0, _strings["default"])("accountConfirmText")), React.createElement("div", {
        className: "input-group m-b-20"
      }, React.createElement("span", {
        className: "input-group-addon"
      }, React.createElement("i", {
        className: "zmdi zmdi-lock"
      })), React.createElement("div", {
        className: "fg-line"
      }, React.createElement("input", {
        type: "text",
        name: "activationCode",
        className: "form-control",
        placeholder: (0, _strings["default"])("activationCode"),
        value: this.state.activationCode
      }))), React.createElement("button", {
        type: "submit",
        className: "btn btn-login btn-success btn-float animated fadeInLeft"
      }, React.createElement("i", {
        className: "zmdi zmdi-lock-open"
      }))), React.createElement("div", {
        className: "lcb-navigation"
      }, React.createElement("a", {
        href: "#login",
        "data-ma-block": "#l-login"
      }, React.createElement("i", {
        className: "zmdi zmdi-long-arrow-right"
      }), " ", React.createElement("span", null, (0, _strings["default"])("signIn"))), React.createElement("a", {
        href: "#register",
        "data-ma-block": "#l-register"
      }, React.createElement("i", {
        className: "zmdi zmdi-plus"
      }), " ", React.createElement("span", null, (0, _strings["default"])("register")))))));
    }
  }]);

  return Recover;
}(_layout.Screen);

exports["default"] = Recover;

},{"../../actions/account":1,"../../stores/account":339,"../../strings":347,"../components/layout":355,"../utils/aj":373,"../utils/forms":375,"../utils/ui":379}],363:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layout = require("../../components/layout");

var _strings = _interopRequireDefault(require("../../../strings"));

var _entities = require("../../../actions/entities");

var _common = require("../../components/common");

var _grids = require("../../components/grids");

var query = _interopRequireWildcard(require("../../../api/query"));

var _lang = require("../../../utils/lang");

var _keyboard = require("../../utils/keyboard");

var _entities2 = _interopRequireDefault(require("../../entities"));

var ui = _interopRequireWildcard(require("../../utils/ui"));

var _session = require("../../../api/session");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AbstractEntitiesGrid =
/*#__PURE__*/
function (_Screen) {
  _inherits(AbstractEntitiesGrid, _Screen);

  function AbstractEntitiesGrid(props) {
    var _this;

    _classCallCheck(this, AbstractEntitiesGrid);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractEntitiesGrid).call(this, props));

    if (_.isEmpty(_this.getEntity())) {
      throw new Error("Please specify entity for form");
    }

    var _query = _entities2["default"][_this.getEntity()].grid.initialQuery;

    if (_.isFunction(_entities2["default"][_this.getEntity()].grid.initialQuery)) {
      _query = _entities2["default"][_this.getEntity()].grid.initialQuery();
    }

    if (!_query) {
      _query = query.create();
      _query.page = 1;
      _query.rowsPerPage = 50;
    }

    _this.state = {
      grid: null,
      result: null,
      query: _query
    };
    return _this;
  }

  _createClass(AbstractEntitiesGrid, [{
    key: "getEntity",
    value: function getEntity() {
      return this.props.entity;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      (0, _entities.loadEntities)({
        discriminator: this.discriminator,
        entity: this.getEntity(),
        query: this.state.query
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      (0, _entities.freeEntities)({
        discriminator: this.discriminator
      });
    }
  }, {
    key: "onQueryChanged",
    value: function onQueryChanged() {
      (0, _entities.loadEntities)({
        discriminator: this.discriminator,
        entity: this.getEntity(),
        query: this.state.query
      });
    }
  }, {
    key: "editEntity",
    value: function editEntity(data) {
      if (!this.canEdit()) {
        return;
      }

      ui.navigate(this.getEditUrl(data));
    }
  }, {
    key: "createEntity",
    value: function createEntity() {
      if (!this.canCreate()) {
        return;
      }

      ui.navigate(this.getCreateUrl());
    }
  }, {
    key: "getCreateUrl",
    value: function getCreateUrl() {
      var grid = _entities2["default"][this.getEntity()].grid;

      var createUrl = grid.createUrl;

      if (_.isFunction(createUrl)) {
        createUrl = createUrl();
      }

      return (0, _lang.optional)(createUrl, "/entities/".concat(this.getEntity(), "/new"));
    }
  }, {
    key: "getEditUrl",
    value: function getEditUrl(data) {
      var grid = _entities2["default"][this.getEntity()].grid;

      if (_.isFunction(grid.editUrl)) {
        return (0, _lang.format)(grid.editUrl(data));
      } else if (!_.isEmpty(grid.editUrl)) {
        return (0, _lang.format)(grid.editUrl, data.id);
      } else {
        return "/entities/".concat(this.getEntity(), "/").concat(data.id);
      }
    }
  }, {
    key: "getDeleteMessage",
    value: function getDeleteMessage() {
      var message = (0, _lang.format)((0, _strings["default"])("entityDeleteConfirm"), this.refs.grid.getSelection().length);
      var entityMessage = this.getGrid().deleteMessage;
      if (entityMessage) message = (0, _lang.format)("{0}\n{1}", message, entityMessage);
      return message;
    }
  }, {
    key: "deleteEntities",
    value: function deleteEntities() {
      var _this2 = this;

      if (!this.canDelete()) {
        return;
      }

      var selection = this.refs.grid.getSelection();

      if (_.isEmpty(selection)) {
        return;
      }

      swal({
        title: (0, _strings["default"])("confirm"),
        text: this.getDeleteMessage(),
        showCancelButton: true
      }).then(function (res) {
        if (res.value) {
          (0, _entities.deleteEntities)({
            discriminator: _this2.discriminator,
            entity: _this2.getEntity(),
            ids: selection.map(function (s) {
              return s.id;
            })
          });
        }
      });
    }
  }, {
    key: "onGridRowDoubleClick",
    value: function onGridRowDoubleClick(row) {
      this.editEntity(row);
    }
  }, {
    key: "getTitle",
    value: function getTitle() {
      var grid = _entities2["default"][this.getEntity()].grid;

      return (0, _lang.optional)(grid.title, "List");
    }
  }, {
    key: "getSubtitle",
    value: function getSubtitle() {
      var grid = _entities2["default"][this.getEntity()].grid;

      return grid.subtitle;
    }
  }, {
    key: "getActions",
    value: function getActions() {
      var _this3 = this;

      var defaultActions = [{
        id: "refresh",
        type: "button",
        icon: "zmdi zmdi-refresh-alt",
        tooltip: (0, _strings["default"])("refresh"),
        permissions: [this.getEntity() + ":" + _session.Permission.LIST],
        action: function action() {
          (0, _entities.loadEntities)({
            discriminator: _this3.discriminator,
            entity: _this3.getEntity(),
            query: _this3.state.query
          });
        }
      }, {
        id: "create",
        type: "button",
        icon: "zmdi zmdi-plus",
        tooltip: (0, _strings["default"])("create"),
        permissions: [this.getEntity() + ":" + _session.Permission.NEW],
        action: function action() {
          _this3.createEntity();
        }
      }, {
        id: "delete",
        type: "button",
        icon: "zmdi zmdi-delete",
        tooltip: (0, _strings["default"])("delete"),
        permissions: [this.getEntity() + ":" + _session.Permission.DELETE],
        action: function action() {
          _this3.deleteEntities();
        }
      }, {
        id: "selectAll",
        type: "button",
        icon: "zmdi zmdi-select-all",
        tooltip: (0, _strings["default"])("selectAll"),
        action: function action() {
          _this3.refs.grid.toggleSelectAll();
        }
      }];

      var grid = _entities2["default"][this.getEntity()].grid;

      var matcher = new _common.ActionsMatcher(defaultActions);
      return matcher.match(grid.actions);
    }
  }, {
    key: "getGrid",
    value: function getGrid() {
      return this.refs.grid;
    }
  }, {
    key: "getDescriptor",
    value: function getDescriptor() {
      var grid = _entities2["default"][this.getEntity()].grid;

      return grid.descriptor;
    }
  }, {
    key: "getData",
    value: function getData() {
      return (0, _grids.resultToGridData)(this.state.result);
    }
  }, {
    key: "isQuickSearchEnabled",
    value: function isQuickSearchEnabled() {
      var grid = _entities2["default"][this.getEntity()].grid;

      return (0, _lang.optional)(grid.quickSearchEnabled, false);
    }
  }, {
    key: "canEdit",
    value: function canEdit() {
      var grid = _entities2["default"][this.getEntity()].grid;

      return (0, _lang.optional)(grid.canEdit, true);
    }
  }, {
    key: "canCreate",
    value: function canCreate() {
      var grid = _entities2["default"][this.getEntity()].grid;

      return (0, _lang.optional)(grid.canCreate, true);
    }
  }, {
    key: "canDelete",
    value: function canDelete() {
      var grid = _entities2["default"][this.getEntity()].grid;

      return (0, _lang.optional)(grid.canDelete, true);
    }
  }, {
    key: "hideFilters",
    value: function hideFilters() {
      return false;
    }
  }, {
    key: "generateHeaderBlock",
    value: function generateHeaderBlock() {
      var title = this.getTitle();
      var subtitle = this.getSubtitle();
      var actions = this.getActions();
      return React.createElement(_common.HeaderBlock, {
        title: title,
        subtitle: subtitle,
        actions: actions
      });
    }
  }, {
    key: "render",
    value: function render() {
      var descriptor = this.getDescriptor();
      var data = this.getData();
      var header = this.generateHeaderBlock();
      return React.createElement(_layout.Layout, null, header, React.createElement(_grids.Grid, {
        ref: "grid",
        descriptor: descriptor,
        data: data,
        hideFilters: this.hideFilters(),
        query: this.state.query //onKeyDown={this.onGridKeyDown.bind(this)}
        ,
        onRowDoubleClick: this.onGridRowDoubleClick.bind(this),
        quickSearchEnabled: this.isQuickSearchEnabled()
      }), this.canCreate() && React.createElement(_common.FloatingButton, {
        icon: "zmdi zmdi-plus",
        onClick: this.createEntity.bind(this)
      }));
    }
  }]);

  return AbstractEntitiesGrid;
}(_layout.Screen);

exports["default"] = AbstractEntitiesGrid;

},{"../../../actions/entities":2,"../../../api/query":18,"../../../api/session":20,"../../../strings":347,"../../../utils/lang":350,"../../components/common":351,"../../components/grids":354,"../../components/layout":355,"../../entities":358,"../../utils/keyboard":377,"../../utils/ui":379}],364:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _entities = require("../../../stores/entities");

var _aj = require("../../utils/aj");

var _abstractEntitiesGrid = _interopRequireDefault(require("./abstractEntitiesGrid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var EntitiesGrid =
/*#__PURE__*/
function (_AbstractEntitiesGrid) {
  _inherits(EntitiesGrid, _AbstractEntitiesGrid);

  function EntitiesGrid(props) {
    var _this;

    _classCallCheck(this, EntitiesGrid);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EntitiesGrid).call(this, props));

    _this.state.query.on("change", function () {
      _this.onQueryChanged();
    });

    _this.discriminator = "entity_grid_" + _this.getEntity();
    (0, _aj.connectDiscriminated)(_this.discriminator, _assertThisInitialized(_this), [_entities.EntitiesStore]);
    return _this;
  }

  return EntitiesGrid;
}(_abstractEntitiesGrid["default"]);

exports["default"] = EntitiesGrid;

},{"../../../stores/entities":340,"../../utils/aj":373,"./abstractEntitiesGrid":363}],365:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layout = require("../../components/layout");

var _strings = _interopRequireDefault(require("../../../strings"));

var _aj = require("../../utils/aj");

var _entities = require("../../../actions/entities");

var _forms = require("../../components/forms");

var _entities2 = _interopRequireDefault(require("../../entities"));

var ui = _interopRequireWildcard(require("../../utils/ui"));

var _lang = require("../../../utils/lang");

var _entities3 = require("../../../stores/entities");

var _common = require("../../components/common");

var _session = require("../../../api/session");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var EntityForm =
/*#__PURE__*/
function (_Screen) {
  _inherits(EntityForm, _Screen);

  function EntityForm(props) {
    var _this;

    _classCallCheck(this, EntityForm);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EntityForm).call(this, props));

    if (_.isEmpty(props.entity)) {
      throw new Error("Please specify entity for form");
    }

    _this.discriminator = "entity_form_" + props.entity;
    _this.initialEntity = null;
    _this.willGoBack = true;
    (0, _aj.connectDiscriminated)(_this.discriminator, _assertThisInitialized(_this), _entities3.EntitiesStore, {
      data: null
    });
    return _this;
  }

  _createClass(EntityForm, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var form = this.refs.form;
      var model = form.model;

      this.onBeforeUnload = function () {
        if (model.hasChanges()) {
          return (0, _strings["default"])("formChangeAlert");
        }
      };

      window.onbeforeunload = this.onBeforeUnload;
      ui.addOnBeforeChangeListener(this.onBeforeUnload);
      this.setState({
        isCreation: this.props.entityId == "new"
      });
      (0, _entities.getEntity)({
        discriminator: this.discriminator,
        entity: this.props.entity,
        id: this.props.entityId,
        params: this.props.params
      }); //checkRevisionEnableStatus({discriminator: this.discriminator, entity: this.props.entity})
    }
  }, {
    key: "goToRevision",
    value: function goToRevision() {
      ui.navigate("/revision/" + this.props.entity + "/" + this.getEntityId());
    }
  }, {
    key: "getEntityId",
    value: function getEntityId() {
      var id = this.state.data != null ? this.state.data.id : null;

      if (!id) {
        if (this.props.entityId !== "new" && this.props.entityId !== "_") id = this.props.entityId;
      }

      return id;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      (0, _entities.freeEntities)({
        discriminator: this.discriminator
      });
      window.onbeforeunload = null;
      ui.removeOnBeforeChangeListener(this.onBeforeUnload);
    }
  }, {
    key: "submit",
    value: function submit(goBack) {
      this.willGoBack = goBack;
      this.refs.form.submit();
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(data) {
      if (_.isFunction(this.props.onSubmit)) {
        this.props.onSubmit(data);
      } else {
        (0, _entities.saveEntity)({
          discriminator: this.discriminator,
          entity: this.props.entity,
          data: data,
          reload: !this.willGoBack
        });
      }
    }
  }, {
    key: "onCancel",
    value: function onCancel() {
      this.goBack();
    }
  }, {
    key: "goBack",
    value: function goBack() {
      var form = this.refs.form;
      var data = form.model.sanitized();
      ui.navigate(this.getGridUrl(data));
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(props, state) {
      if (state.saved) {
        this.refs.form.model.reset();
      }

      if (state.saved && this.willGoBack) {
        this.goBack();
        return false;
      }

      if (state.validationError) {
        if (state.validationResult) {
          var form = this.refs.form;

          if (form && form.model) {
            _.each(state.validationResult.errors, function (e) {
              form.model.setError(e.property, (0, _strings["default"])(e.message));
            });
          }
        }

        this.refs.form.model.invalidateForm();
      }

      if (state.loaded && !this.initialized) {
        this.onDataLoad(state.data);
        this.initialized = true;
      }
    }
  }, {
    key: "onDataLoad",
    value: function onDataLoad(data) {
      var form = _entities2["default"][this.getEntity()].form;

      if (_.isFunction(form.onDataLoad)) {
        form.onDataLoad(data, this.props.params);
      }
    }
  }, {
    key: "getEntity",
    value: function getEntity() {
      return this.props.entity;
    }
  }, {
    key: "getGridUrl",
    value: function getGridUrl(data) {
      var form = _entities2["default"][this.getEntity()].form;

      var gridUrl = form.gridUrl;

      if (_.isFunction(gridUrl)) {
        gridUrl = gridUrl(data);
      }

      return (0, _lang.optional)(gridUrl, "/entities/" + this.getEntity());
    }
  }, {
    key: "getActions",
    value: function getActions() {
      var _this2 = this;

      var defaultActions = [{
        id: "back",
        type: "button",
        icon: "zmdi zmdi-arrow-left",
        tooltip: (0, _strings["default"])("back"),
        action: function action() {
          _this2.goBack();
        }
      }];

      if (this.canSave()) {
        defaultActions.push({
          id: "save",
          type: "button",
          icon: "zmdi zmdi-save",
          tooltip: (0, _strings["default"])("save"),
          permissions: this.getEntitySavePermissions(),
          action: function action() {
            _this2.submit(false);
          }
        }, {
          id: "save-go-back",
          type: "button",
          icon: "zmdi zmdi-rotate-ccw",
          tooltip: (0, _strings["default"])("saveAndGoBack"),
          permissions: this.getEntitySavePermissions(),
          action: function action() {
            _this2.submit(true);
          }
        });
      }

      if (this.canShowRevisions()) {
        defaultActions.push({
          id: "revisions",
          type: "button",
          icon: "zmdi zmdi-time-restore",
          tooltip: (0, _strings["default"])("showRevisions"),
          action: function action() {
            _this2.goToRevision();
          }
        });
      }

      var form = _entities2["default"][this.getEntity()].form;

      var matcher = new _common.ActionsMatcher(defaultActions);
      return matcher.match(_.isFunction(form.getActions) ? form.getActions(this.state.data) : form.actions);
    }
  }, {
    key: "canShowRevisions",
    value: function canShowRevisions() {
      return this.state && this.state.revisionEnabled && this.state.revisionEnabled === true && this.getEntityId();
    }
  }, {
    key: "canSave",
    value: function canSave() {
      var form = _entities2["default"][this.getEntity()].form;

      return (0, _lang.optional)(form.canSave, (0, _session.hasPermission)(this.getEntitySavePermissions()));
    }
  }, {
    key: "getEntitySavePermissions",
    value: function getEntitySavePermissions() {
      return [this.getEntity() + ":" + _session.Permission.SAVE];
    }
  }, {
    key: "getEntityListPermissions",
    value: function getEntityListPermissions() {
      return [this.getEntity() + ":" + _session.Permission.LIST];
    }
  }, {
    key: "getPermittedActions",
    value: function getPermittedActions() {
      return _.filter(this.getActions(), function (a) {
        return (0, _session.hasPermission)(a.permissions) === true;
      });
    }
  }, {
    key: "canCancel",
    value: function canCancel() {
      var descriptor = this.getDescriptor();
      return _.isFunction(descriptor.canCancel) ? descriptor.canCancel(this.state.data) : true;
    }
  }, {
    key: "getTitle",
    value: function getTitle() {
      var form = _entities2["default"][this.getEntity()].form;

      return (0, _lang.optional)(form.title, "Edit");
    }
  }, {
    key: "getSubtitle",
    value: function getSubtitle() {
      var form = _entities2["default"][this.getEntity()].form;

      return form.subtitle;
    }
  }, {
    key: "getDescriptor",
    value: function getDescriptor() {
      var form = _entities2["default"][this.getEntity()].form;

      return form.descriptor;
    }
  }, {
    key: "getFormComponent",
    value: function getFormComponent() {
      var form = _entities2["default"][this.getEntity()].form;

      return (0, _lang.optional)(function () {
        return form.component;
      }, function () {
        return _forms.Form;
      });
    }
  }, {
    key: "render",
    value: function render() {
      var title = this.getTitle();
      var subtitle = this.getSubtitle();
      var actions = this.getActions();
      var descriptor = this.getDescriptor();
      var component = this.getFormComponent();
      var selectedTab = this.props.params.selectedTab;
      return React.createElement(_layout.Layout, null, React.createElement(_common.HeaderBlockWithBreadcrumbs, {
        title: title,
        subtitle: subtitle,
        actions: actions
      }), React.createElement(component, {
        ref: "form",
        descriptor: descriptor,
        data: this.state.data,
        selectedTab: selectedTab,
        onSubmit: this.onSubmit.bind(this),
        onCancel: this.onCancel.bind(this)
      }));
    }
  }]);

  return EntityForm;
}(_layout.Screen);

exports["default"] = EntityForm;

},{"../../../actions/entities":2,"../../../api/session":20,"../../../stores/entities":340,"../../../strings":347,"../../../utils/lang":350,"../../components/common":351,"../../components/forms":353,"../../components/layout":355,"../../entities":358,"../../utils/aj":373,"../../utils/ui":379}],366:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RevisionGrid = exports.EntityForm = exports.EntitiesGrid = void 0;

var EntitiesGrid = require("./entitiesGrid")["default"];

exports.EntitiesGrid = EntitiesGrid;

var EntityForm = require("./entityForm")["default"];

exports.EntityForm = EntityForm;

var RevisionGrid = require("./revisionsGrid")["default"];

exports.RevisionGrid = RevisionGrid;

},{"./entitiesGrid":364,"./entityForm":365,"./revisionsGrid":367}],367:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _entities = require("../../../stores/entities");

var _aj = require("../../utils/aj");

var _abstractEntitiesGrid = _interopRequireDefault(require("./abstractEntitiesGrid"));

var _strings = _interopRequireDefault(require("../../../strings"));

var _common = require("../../components/common");

var _entities2 = _interopRequireDefault(require("../../entities"));

var ui = _interopRequireWildcard(require("../../utils/ui"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RevisionsGrid =
/*#__PURE__*/
function (_AbstractEntitiesGrid) {
  _inherits(RevisionsGrid, _AbstractEntitiesGrid);

  function RevisionsGrid(props) {
    var _this;

    _classCallCheck(this, RevisionsGrid);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RevisionsGrid).call(this, props));

    _this.state.query.eq("entity", props.entity);

    if (props.entityId) {
      _this.state.query.eq("entityId", props.entityId);
    }

    _this.state.query.sort("date", true);

    _this.state.query.on("change", function () {
      _this.onQueryChanged();
    });

    _this.discriminator = "entity_grid_" + _this.getEntity();
    (0, _aj.connectDiscriminated)(_this.discriminator, _assertThisInitialized(_this), [_entities.EntitiesStore]);
    return _this;
  }

  _createClass(RevisionsGrid, [{
    key: "generateEntityUrl",
    value: function generateEntityUrl() {
      return "/entities/" + this.props.entity + "/" + this.props.entityId;
    }
  }, {
    key: "goBack",
    value: function goBack() {
      ui.navigate(this.generateEntityUrl());
    }
  }, {
    key: "hideFilters",
    value: function hideFilters() {
      return true;
    }
  }, {
    key: "getActions",
    value: function getActions() {
      var _this2 = this;

      var defaultActions = [{
        id: "back",
        type: "button",
        icon: "zmdi zmdi-arrow-left",
        tooltip: (0, _strings["default"])("back"),
        action: function action() {
          _this2.goBack();
        }
      }];

      var grid = _entities2["default"][this.getEntity()].grid;

      var matcher = new _common.ActionsMatcher(defaultActions);
      return matcher.match(grid.actions);
    }
  }, {
    key: "getEntity",
    value: function getEntity() {
      return "revision";
    }
  }, {
    key: "canEdit",
    value: function canEdit() {
      return false;
    }
  }, {
    key: "canCreate",
    value: function canCreate() {
      return false;
    }
  }, {
    key: "canDelete",
    value: function canDelete() {
      return false;
    }
  }, {
    key: "generateTitleItems",
    value: function generateTitleItems() {
      var items = [];
      items.push({
        title: (0, _strings["default"])(this.props.entity),
        url: this.generateEntityUrl()
      });
      items.push({
        title: this.getTitle()
      });
      return items;
    }
  }, {
    key: "generateHeaderBlock",
    value: function generateHeaderBlock() {
      var subtitle = this.getSubtitle();
      var title = this.generateTitleItems();
      var actions = this.getActions();
      return React.createElement(_common.HeaderBlockWithBreadcrumbs, {
        title: title,
        subtitle: subtitle,
        actions: actions
      });
    }
  }]);

  return RevisionsGrid;
}(_abstractEntitiesGrid["default"]);

exports["default"] = RevisionsGrid;

},{"../../../stores/entities":340,"../../../strings":347,"../../components/common":351,"../../entities":358,"../../utils/aj":373,"../../utils/ui":379,"./abstractEntitiesGrid":363}],368:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require("../components/layout"),
    Screen = _require.Screen,
    Layout = _require.Layout;

var Secure = require("../components/secure");

var Home =
/*#__PURE__*/
function (_Screen) {
  _inherits(Home, _Screen);

  function Home() {
    _classCallCheck(this, Home);

    return _possibleConstructorReturn(this, _getPrototypeOf(Home).apply(this, arguments));
  }

  _createClass(Home, [{
    key: "render",
    value: function render() {
      return React.createElement(Secure, null, React.createElement(Layout, null, React.createElement("div", {
        className: "card"
      }, "Home Screen")));
    }
  }]);

  return Home;
}(Screen);

exports["default"] = Home;

},{"../components/layout":355,"../components/secure":357}],369:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _layout = require("../components/layout");

var _session = require("../../actions/session");

var forms = _interopRequireWildcard(require("../utils/forms"));

var _strings = _interopRequireDefault(require("../../strings"));

var _session2 = require("../../stores/session");

var _aj = require("../utils/aj");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Login =
/*#__PURE__*/
function (_Screen) {
  _inherits(Login, _Screen);

  function Login(props) {
    var _this;

    _classCallCheck(this, Login);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Login).call(this, props));
    (0, _aj.connect)(_assertThisInitialized(_this), _session2.SessionStore);
    return _this;
  }

  _createClass(Login, [{
    key: "login",
    value: function login() {
      var data = forms.serialize(this.refs.login_form);
      (0, _session.login)(data);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var me = ReactDOM.findDOMNode(this);
      $(me).find(".form-control").change(function () {
        var x = $(this).val();

        if (!x.length == 0) {
          $(this).addClass("form-control--active");
        }
      }).change();
      $(me).on("blur input", ".form-group--float .form-control", function () {
        var i = $(this).val();

        if (i.length == 0) {
          $(this).removeClass("form-control--active");
        } else {
          $(this).addClass("form-control--active");
        }
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.isLoggedIn) {
        if (location.href.indexOf("login") != -1) {
          location.href = "/#/";
        }
      }

      var me = ReactDOM.findDOMNode(this);
      $(me).find(".form-control").change();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_layout.FullScreenLayout, null, React.createElement("div", {
        className: "login"
      }, React.createElement("div", {
        className: "login__block active",
        id: "l-login"
      }, React.createElement("div", {
        className: "login__block__header"
      }, React.createElement("i", {
        className: "zmdi zmdi-account-circle"
      }), "Hi there! Please Sign in", React.createElement("div", {
        className: "actions actions--inverse login__block__actions"
      }, React.createElement("div", {
        className: "dropdown"
      }, React.createElement("i", {
        "data-toggle": "dropdown",
        className: "zmdi zmdi-more-vert actions__item"
      }), React.createElement("div", {
        className: "dropdown-menu dropdown-menu-right"
      }, React.createElement("a", {
        className: "dropdown-item",
        href: "/#/register"
      }, "Create an account"), React.createElement("a", {
        className: "dropdown-item",
        href: "/#/recover"
      }, "Forgot password?"))))), React.createElement("form", {
        action: "javascript:",
        className: "lcb-form",
        onSubmit: this.login.bind(this),
        ref: "login_form"
      }, React.createElement("div", {
        className: "login__block__body"
      }, React.createElement("div", {
        className: "form-group form-group--float form-group--centered"
      }, React.createElement("input", {
        type: "email",
        name: "mail",
        className: "form-control",
        autoComplete: "username"
      }), React.createElement("label", null, "Email Address"), React.createElement("i", {
        className: "form-group__bar"
      })), React.createElement("div", {
        className: "form-group form-group--float form-group--centered"
      }, React.createElement("input", {
        type: "password",
        name: "password",
        className: "form-control",
        autoComplete: "current-password"
      }), React.createElement("label", null, "Password"), React.createElement("i", {
        className: "form-group__bar"
      })), React.createElement("button", {
        type: "submit",
        className: "btn btn--icon login__block__btn"
      }, React.createElement("i", {
        className: "zmdi zmdi-long-arrow-right"
      })))))));
    }
  }]);

  return Login;
}(_layout.Screen);

exports["default"] = Login;

},{"../../actions/session":4,"../../stores/session":343,"../../strings":347,"../components/layout":355,"../utils/aj":373,"../utils/forms":375}],370:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _account = require("../../stores/account");

var _strings = _interopRequireDefault(require("../../strings"));

var _aj = require("../utils/aj");

var _layout = require("../components/layout");

var ui = _interopRequireWildcard(require("../utils/ui"));

var _account2 = require("../../actions/account");

var forms = _interopRequireWildcard(require("../utils/forms"));

var _lang = require("../../utils/lang");

var _ = _interopRequireWildcard(require("underscore"));

var _passwordRecovery = require("../../stores/passwordRecovery");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Recover =
/*#__PURE__*/
function (_Screen) {
  _inherits(Recover, _Screen);

  function Recover(props) {
    var _this;

    _classCallCheck(this, Recover);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Recover).call(this, props));
    (0, _aj.connect)(_assertThisInitialized(_this), [_account.AccountStore, _passwordRecovery.PasswordRecoveryStore]);
    return _this;
  }

  _createClass(Recover, [{
    key: "requestCode",
    value: function requestCode(data) {
      (0, _account2.requestRecoveryCode)(data);
    }
  }, {
    key: "requestNewCode",
    value: function requestNewCode() {
      var data = {
        mail: this.state.mail
      };
      this.requestCode(data);
    }
  }, {
    key: "validateCode",
    value: function validateCode(data) {
      data.mail = this.state.mail;
      (0, _account2.validateRecoveryCode)(data);
    }
  }, {
    key: "resetPassword",
    value: function resetPassword(data) {
      _.assign(data, {
        mail: this.state.mail,
        code: this.state.code
      });

      (0, _account2.resetPassword)(data);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var me = ReactDOM.findDOMNode(this);
      $(me).find(".form-control").change(function () {
        var x = $(this).val();

        if (!x.length == 0) {
          $(this).addClass("form-control--active");
        }
      }).change();
      $(me).on("blur input", ".form-group--float .form-control", function () {
        var i = $(this).val();

        if (i.length == 0) {
          $(this).removeClass("form-control--active");
        } else {
          $(this).addClass("form-control--active");
        }
      });
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(props, state) {
      if (state.recovered) {// ui.navigate("/")
      }
    }
  }, {
    key: "getContent",
    value: function getContent() {
      var recoveryStep = (0, _lang.safeGet)(this.state, "recoveryStep", 1);

      switch (recoveryStep) {
        case 1:
          return React.createElement(CodeRequestForm, {
            onSubmit: this.requestCode.bind(this)
          });

        case 2:
          return React.createElement(CodeValidationForm, {
            onSubmit: this.validateCode.bind(this),
            onTryAgain: this.requestNewCode.bind(this)
          });

        case 3:
          return React.createElement(PasswordChangeForm, {
            onSubmit: this.resetPassword.bind(this)
          });

        case 4:
          return ui.navigate("/");

        default:
          return "";
      }
    }
  }, {
    key: "render",
    value: function render() {
      var content = this.getContent();
      return React.createElement(_layout.FullScreenLayout, null, React.createElement("div", {
        className: "login"
      }, React.createElement("div", {
        "class": "login__block active",
        id: "l-forget-password"
      }, React.createElement("div", {
        "class": "login__block__header palette-Purple bg"
      }, React.createElement("i", {
        "class": "zmdi zmdi-account-circle"
      }), "Forgot Password?", React.createElement("div", {
        "class": "actions actions--inverse login__block__actions"
      }, React.createElement("div", {
        "class": "dropdown"
      }, React.createElement("i", {
        "data-toggle": "dropdown",
        "class": "zmdi zmdi-more-vert actions__item"
      }), React.createElement("div", {
        "class": "dropdown-menu dropdown-menu-right"
      }, React.createElement("a", {
        "class": "dropdown-item",
        href: "/#/login"
      }, "Already have an account?"), React.createElement("a", {
        "class": "dropdown-item",
        href: "/#/register"
      }, "Create an account"))))), React.createElement("div", {
        "class": "login__block__body"
      }, content))));
    }
  }]);

  return Recover;
}(_layout.Screen);

exports["default"] = Recover;

var CodeRequestForm =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CodeRequestForm, _React$Component);

  function CodeRequestForm(props) {
    _classCallCheck(this, CodeRequestForm);

    return _possibleConstructorReturn(this, _getPrototypeOf(CodeRequestForm).call(this, props));
  }

  _createClass(CodeRequestForm, [{
    key: "onSubmit",
    value: function onSubmit() {
      var data = forms.serialize(this.refs.recover_form);

      if (_.isFunction(this.props.onSubmit)) {
        this.props.onSubmit(data);
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("form", {
        action: "javascript:;",
        className: "lcb-form",
        onSubmit: this.onSubmit.bind(this),
        ref: "recover_form"
      }, React.createElement("p", {
        className: "text-left"
      }, (0, _strings["default"])("accountRecoverText")), React.createElement("div", {
        "class": "form-group form-group--float form-group--centered"
      }, React.createElement("input", {
        type: "text",
        name: "mail",
        "class": "form-control"
      }), React.createElement("label", null, "Email Address"), React.createElement("i", {
        "class": "form-group__bar"
      })), React.createElement("button", {
        type: "submit",
        className: "btn btn--icon login__block__btn"
      }, React.createElement("i", {
        className: "zmdi zmdi-check"
      })));
    }
  }]);

  return CodeRequestForm;
}(React.Component);

var CodeValidationForm =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(CodeValidationForm, _React$Component2);

  function CodeValidationForm(props) {
    _classCallCheck(this, CodeValidationForm);

    return _possibleConstructorReturn(this, _getPrototypeOf(CodeValidationForm).call(this, props));
  }

  _createClass(CodeValidationForm, [{
    key: "onSubmit",
    value: function onSubmit() {
      var data = forms.serialize(this.refs.validate_code_form);

      if (_.isFunction(this.props.onSubmit)) {
        this.props.onSubmit(data);
      }
    }
  }, {
    key: "onTryAgain",
    value: function onTryAgain() {
      if (_.isFunction(this.props.onTryAgain)) {
        this.props.onTryAgain();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("form", {
        action: "javascript:;",
        className: "lcb-form",
        onSubmit: this.onSubmit.bind(this),
        ref: "validate_code_form"
      }, React.createElement("p", {
        className: "text-left"
      }, (0, _strings["default"])("codeValidationText")), React.createElement("div", {
        "class": "form-group form-group--float form-group--centered"
      }, React.createElement("input", {
        type: "text",
        name: "code",
        "class": "form-control"
      }), React.createElement("label", null, "Validation code"), React.createElement("i", {
        "class": "form-group__bar"
      })), React.createElement("button", {
        type: "button",
        className: "btn btn--icon login__block__btn",
        onClick: this.onTryAgain.bind(this)
      }, React.createElement("i", {
        className: "zmdi zmdi-refresh"
      }), (0, _strings["default"])("requestNew")), React.createElement("button", {
        type: "submit",
        className: "btn btn--icon login__block__btn"
      }, React.createElement("i", {
        className: "zmdi zmdi-check"
      })));
    }
  }]);

  return CodeValidationForm;
}(React.Component);

var PasswordChangeForm =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(PasswordChangeForm, _React$Component3);

  function PasswordChangeForm(props) {
    var _this2;

    _classCallCheck(this, PasswordChangeForm);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(PasswordChangeForm).call(this, props));
    _this2.state = {};
    return _this2;
  }

  _createClass(PasswordChangeForm, [{
    key: "onSubmit",
    value: function onSubmit() {
      var data = {
        password: this.state.password,
        passwordConfirm: this.state.passwordConfirm
      };

      if (_.isFunction(this.props.onSubmit)) {
        this.props.onSubmit(data);
      }
    }
  }, {
    key: "updatePassword",
    value: function updatePassword(e) {
      this.setState({
        password: e.target.value
      });
    }
  }, {
    key: "updatePasswordConfirm",
    value: function updatePasswordConfirm(e) {
      this.setState({
        passwordConfirm: e.target.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("form", {
        action: "javascript:;",
        className: "lcb-form",
        onSubmit: this.onSubmit.bind(this),
        ref: "validate_code_form"
      }, React.createElement("p", {
        className: "text-left"
      }, (0, _strings["default"])("newPasswordText")), React.createElement("div", {
        className: "input-group m-b-20"
      }, React.createElement("span", {
        className: "input-group-addon"
      }, React.createElement("i", {
        className: "zmdi zmdi-lock"
      })), React.createElement("div", {
        className: "fg-line"
      }, React.createElement("input", {
        type: "password",
        name: "password",
        className: "form-control",
        placeholder: (0, _strings["default"])("password"),
        onChange: this.updatePassword.bind(this)
      }))), React.createElement("div", {
        className: "input-group m-b-20"
      }, React.createElement("span", {
        className: "input-group-addon"
      }, React.createElement("i", {
        className: "zmdi zmdi-lock-outline"
      })), React.createElement("div", {
        className: "fg-line"
      }, React.createElement("input", {
        type: "password",
        name: "passwordConfirm",
        className: "form-control",
        placeholder: (0, _strings["default"])("passwordConfirm"),
        onChange: this.updatePasswordConfirm.bind(this)
      }))), React.createElement("button", {
        type: "submit",
        className: "btn btn-login btn-success btn-float animated fadeInLeft"
      }, React.createElement("i", {
        className: "zmdi zmdi-check"
      })));
    }
  }]);

  return PasswordChangeForm;
}(React.Component);

},{"../../actions/account":1,"../../stores/account":339,"../../stores/passwordRecovery":342,"../../strings":347,"../../utils/lang":350,"../components/layout":355,"../utils/aj":373,"../utils/forms":375,"../utils/ui":379,"underscore":337}],371:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _account = require("../../stores/account");

var _strings = _interopRequireDefault(require("../../strings"));

var _aj = require("../utils/aj");

var _layout = require("../components/layout");

var ui = _interopRequireWildcard(require("../utils/ui"));

var _account2 = require("../../actions/account");

var forms = _interopRequireWildcard(require("../utils/forms"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Register =
/*#__PURE__*/
function (_Screen) {
  _inherits(Register, _Screen);

  function Register(props) {
    var _this;

    _classCallCheck(this, Register);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Register).call(this, props));
    (0, _aj.connect)(_assertThisInitialized(_this), _account.AccountStore);
    return _this;
  }

  _createClass(Register, [{
    key: "register",
    value: function register() {
      var data = forms.serialize(this.refs.register_form);
      (0, _account2.register)(data);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var me = ReactDOM.findDOMNode(this);
      $(me).find(".form-control").change(function () {
        var x = $(this).val();

        if (!x.length == 0) {
          $(this).addClass("form-control--active");
        }
      }).change();
      $(me).on("blur input", ".form-group--float .form-control", function () {
        var i = $(this).val();

        if (i.length == 0) {
          $(this).removeClass("form-control--active");
        } else {
          $(this).addClass("form-control--active");
        }
      });
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(props, state) {
      if (state.registered) {
        ui.navigate("/registrationComplete");
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_layout.FullScreenLayout, null, React.createElement("div", {
        className: "login"
      }, React.createElement("div", {
        className: "login__block active"
      }, React.createElement("div", {
        className: "login__block__header palette-Blue bg"
      }, React.createElement("i", {
        className: "zmdi zmdi-account-circle"
      }), "Create an account", React.createElement("div", {
        className: "actions actions--inverse login__block__actions"
      }, React.createElement("div", {
        className: "dropdown"
      }, React.createElement("i", {
        "data-toggle": "dropdown",
        className: "zmdi zmdi-more-vert actions__item"
      }), React.createElement("div", {
        className: "dropdown-menu dropdown-menu-right"
      }, React.createElement("a", {
        className: "dropdown-item",
        href: "/#/login"
      }, "Already have an account?"), React.createElement("a", {
        className: "dropdown-item",
        href: "/#/recover"
      }, "Forgot password?"))))), React.createElement("form", {
        action: "javascript:;",
        className: "lcb-form",
        onSubmit: this.register.bind(this),
        ref: "register_form"
      }, React.createElement("div", {
        className: "login__block__body"
      }, React.createElement("div", {
        className: "form-group form-group--float form-group--centered"
      }, React.createElement("input", {
        type: "text",
        name: "name",
        className: "form-control"
      }), React.createElement("label", null, "Name"), React.createElement("i", {
        className: "form-group__bar"
      })), React.createElement("div", {
        className: "form-group form-group--float form-group--centered"
      }, React.createElement("input", {
        type: "email",
        name: "mail",
        className: "form-control"
      }), React.createElement("label", null, "Email Address"), React.createElement("i", {
        className: "form-group__bar"
      })), React.createElement("div", {
        className: "form-group form-group--float form-group--centered"
      }, React.createElement("input", {
        type: "password",
        name: "password",
        className: "form-control"
      }), React.createElement("label", null, "Password"), React.createElement("i", {
        className: "form-group__bar"
      })), React.createElement("div", {
        className: "checkbox"
      }, React.createElement("input", {
        type: "checkbox",
        id: "accept"
      }), React.createElement("label", {
        className: "checkbox__label",
        htmlFor: "accept"
      }, "Accept the license agreement")), React.createElement("button", {
        type: "submit",
        className: "btn btn--icon login__block__btn"
      }, React.createElement("i", {
        className: "zmdi zmdi-check"
      })))))));
    }
  }]);

  return Register;
}(_layout.Screen);

exports["default"] = Register;

},{"../../actions/account":1,"../../stores/account":339,"../../strings":347,"../components/layout":355,"../utils/aj":373,"../utils/forms":375,"../utils/ui":379}],372:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _account = require("../../stores/account");

var _strings = _interopRequireDefault(require("../../strings"));

var _aj = require("../utils/aj");

var _layout = require("../components/layout");

var ui = _interopRequireWildcard(require("../utils/ui"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RegistrationOk =
/*#__PURE__*/
function (_Screen) {
  _inherits(RegistrationOk, _Screen);

  function RegistrationOk(props) {
    var _this;

    _classCallCheck(this, RegistrationOk);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RegistrationOk).call(this, props));
    (0, _aj.connect)(_assertThisInitialized(_this), _account.AccountStore);
    return _this;
  }

  _createClass(RegistrationOk, [{
    key: "goHome",
    value: function goHome() {
      ui.navigate("/");
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_layout.FullScreenLayout, null, React.createElement("div", {
        className: "login-content"
      }, React.createElement("div", {
        className: "lc-block toggled",
        id: "l-login"
      }, React.createElement("div", {
        className: "text-center m-b-10"
      }, React.createElement("img", {
        src: "resources/images/logo.png"
      })), React.createElement("div", {
        className: "jumbotron p-20"
      }, React.createElement("h1", null, (0, _strings["default"])("congratulations"), "!"), React.createElement("p", null, this.state.message), React.createElement("p", null, React.createElement("a", {
        className: "btn btn-primary btn-lg waves-effect",
        href: "javascript:;",
        onClick: this.goHome.bind(this),
        role: "button"
      }, (0, _strings["default"])("continue")))), React.createElement("div", {
        className: "lcb-navigation"
      }, React.createElement("a", {
        href: "#register",
        "data-ma-block": "#l-register"
      }, React.createElement("i", {
        className: "zmdi zmdi-plus"
      }), " ", React.createElement("span", null, (0, _strings["default"])("register"))), React.createElement("a", {
        href: "#recover",
        "data-ma-block": "#l-forget-password"
      }, React.createElement("i", null, "?"), " ", React.createElement("span", null, (0, _strings["default"])("forgotPassword")))))));
    }
  }]);

  return RegistrationOk;
}(_layout.Screen);

exports["default"] = RegistrationOk;

},{"../../stores/account":339,"../../strings":347,"../components/layout":355,"../utils/aj":373,"../utils/ui":379}],373:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;
exports.connectDiscriminated = connectDiscriminated;

var _ajex = require("../../utils/ajex");

function connectInternal(setState, component, stores, localState) {
  var singleStore = !_.isArray(stores);

  if (!_.isArray(stores)) {
    stores = [stores];
  }

  var originals = {
    componentDidMount: component.componentDidMount,
    componentWillUnmount: component.componentWillUnmount
  };

  if (singleStore) {
    component.state = singleStore.state || localState;
  }

  component.componentDidMount = function () {
    _.each(stores, function (store) {
      store.subscribe(component, function (state) {
        return setState(component, state);
      });
      setState(component, store.state || {});
    });

    if (_.isFunction(originals.componentDidMount)) {
      originals.componentDidMount.call(component);
    }
  };

  component.componentWillUnmount = function () {
    _.each(stores, function (store) {
      store.unsubscribe(component);
    });

    if (_.isFunction(originals.componentWillUnmount)) {
      originals.componentWillUnmount.call(component);
    }
  };
}

function connect(component, stores) {
  var localState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return connectInternal(function (component, state) {
    return component.setState(state);
  }, component, stores, localState);
}

function connectDiscriminated(discriminator, component, stores) {
  var localState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return connectInternal(function (component, state) {
    return component.setState((0, _ajex.discriminated)(state, discriminator));
  }, component, stores, localState);
}

},{"../../utils/ajex":348}],374:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EventEmitter = {};

EventEmitter.addListener = function (obj, evt, handler) {
  var listeners = obj.__events_listeners;

  if (!listeners) {
    listeners = {};
    obj.__events_listeners = listeners;
  }

  if (!listeners[evt]) {
    listeners[evt] = [];
  }

  listeners[evt].push(handler);
};

EventEmitter.addListeners = function (obj, listeners) {
  for (var key in listeners) {
    events.addListener(obj, key, listeners[key]);
  }
};

EventEmitter.removeListener = function (obj, evt, listener) {
  if (obj.__events_listeners && obj.__events_listeners[evt]) {
    obj.__events_listeners[evt] = obj.__events_listeners[evt].filter(function (l) {
      return l != listener;
    });
  }
};

EventEmitter.on = function (obj, evt, handler) {
  if ($.isPlainObject(evt)) {
    EventEmitter.addListeners(obj, evt);
  } else {
    EventEmitter.addListener(obj, evt, handler);
  }
};

EventEmitter.live = function (obj, evt) {
  if (!obj.__events_offs) obj.__events_offs = {};

  if (evt) {
    obj.__events_offs[evt] = false;
  } else {
    obj.__events_off = false;
  }
};

EventEmitter.die = function (obj, evt) {
  if (!obj.__events_offs) obj.__events_offs = {};

  if (evt) {
    obj.__events_offs[evt] = true;
  } else {
    obj.__events_off = true;
  }
};

EventEmitter.invoke = function (obj, evt) {
  if (!obj.__events_offs) obj.__events_offs = {};
  if (obj.__events_off) return;
  if (obj.__events_offs[evt]) return;
  var listeners = obj.__events_listeners;

  if (!listeners) {
    listeners = {};
    obj.__events_listeners = listeners;
  }

  var handlers = listeners[evt];

  if (handlers) {
    var size = handlers.length;

    for (var i = 0; i < size; i++) {
      var h = handlers[i];
      h.apply(obj, Array.prototype.slice.call(arguments, 2));
    }
  }
};

var Observable =
/*#__PURE__*/
function () {
  function Observable() {
    _classCallCheck(this, Observable);
  }

  _createClass(Observable, [{
    key: "addListener",
    value: function addListener(evt, handler) {
      EventEmitter.addListener(this, evt, handler);
    }
  }, {
    key: "addListeners",
    value: function addListeners(listeners) {
      EventEmitter.addListeners(this, listeners);
    }
  }, {
    key: "removeListener",
    value: function removeListener(evt, handler) {
      EventEmitter.removeListener(evt, handler);
    }
  }, {
    key: "on",
    value: function on(evt, fn) {
      EventEmitter.on(this, evt, fn);
    }
  }, {
    key: "live",
    value: function live(evt) {
      EventEmitter.live(this, evt);
    }
  }, {
    key: "die",
    value: function die(evt) {
      EventEmitter.die(this, evt);
    }
  }, {
    key: "invoke",
    value: function invoke(evt) {
      Array.prototype.splice.call(arguments, 0, 0, this);
      EventEmitter.invoke.apply(this, arguments);
    }
  }]);

  return Observable;
}();

exports.EventEmitter = EventEmitter;
exports.Observable = Observable;

},{}],375:[function(require,module,exports){
"use strict";

function serialize(form) {
  var o = {};
  var a = $(form).serializeArray();
  $.each(a, function () {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }

      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
}

exports.serialize = serialize;

},{}],376:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanedData = cleanedData;
exports.dataUrl = dataUrl;
exports.readData = readData;
exports.readDataUrl = readDataUrl;

function cleanedData(data) {
  if (_.isEmpty(data)) {
    return null;
  }

  var search = ";base64,";
  var index = data.indexOf(search);

  if (index == -1) {
    return null;
  }

  var startIndex = index + search.length;
  return data.substring(startIndex);
}

function dataUrl(data, format) {
  return "data;base64," + data;
}

function _unchangedData(data) {
  return data;
}

function _readDataInternal(file, cleaner) {
  return new Promise(function (resolve, reject) {
    try {
      var reader = new FileReader();

      reader.onload = function (e) {
        resolve(cleaner(e.target.result));
      };

      reader.readAsDataURL(file);
    } catch (e) {
      reject(e);
    }
  });
}

function readData(file) {
  return _readDataInternal(file, cleanedData);
}

function readDataUrl(file) {
  return _readDataInternal(file, _unchangedData);
}

},{}],377:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isControl = isControl;
exports.isShift = isShift;
exports.isUp = isUp;
exports.isDown = isDown;
exports.isEnter = isEnter;
exports.isCancel = isCancel;
exports.isEsc = isEsc;
exports.attach = attach;
exports.detach = detach;
exports.isShiftPressed = isShiftPressed;
exports.isControlPressed = isControlPressed;
var pressedKeys = {};

var onWindowKeyUp = function onWindowKeyUp(e) {
  pressedKeys[e.which] = false;
};

var onWindowKeyDown = function onWindowKeyDown(e) {
  pressedKeys[e.which] = true;
};

var onWindowBlur = function onWindowBlur(e) {
  pressedKeys = {};
};

function isMac() {
  return navigator.platform.indexOf('Mac') > -1;
}

function isControl(which) {
  if (isMac()) {
    return which == 91 || which == 93;
  } else {
    return which == 17;
  }
}

function isShift(which) {
  return which == 16;
}

function isUp(which) {
  return which == 38;
}

function isDown(which) {
  return which == 40;
}

function isEnter(which) {
  return which == 13;
}

function isCancel(which) {
  return which == 46 || which == 8;
}

function isEsc(which) {
  return which == 27;
}

function attach() {
  window.addEventListener("keydown", onWindowKeyDown);
  window.addEventListener("keyup", onWindowKeyUp);
  window.addEventListener("blur", onWindowBlur);

  if (DEBUG) {
    logger.i("Keyboard attached to global key events");
  }
}

function detach() {
  window.removeEventListener("keydown", onWindowKeyDown);
  window.removeEventListener("keyup", onWindowKeyUp);
  window.removeEventListener("blur", onWindowBlur);

  if (DEBUG) {
    logger.i("Keyboard detached from global key events");
  }
}

function isShiftPressed() {
  return pressedKeys[16];
}

function isControlPressed() {
  if (isMac()) {
    return pressedKeys[91] || pressedKeys[93];
  } else {
    return pressedKeys[17];
  }
}

},{}],378:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAndroid = isAndroid;
exports.isiOS = isiOS;
exports.isOpera = isOpera;
exports.isBlackBerry = isBlackBerry;
exports.isWindows = isWindows;
exports.isMobile = isMobile;

function isAndroid() {
  return navigator.userAgent.match(/Android/i);
}

function isiOS() {
  return navigator.userAgent.match(/iPhone|iPad|iPod/i);
}

function isOpera() {
  return navigator.userAgent.match(/Opera Mini/i);
}

function isBlackBerry() {
  return navigator.userAgent.match(/BlackBerry/i);
}

function isWindows() {
  return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
}

function isMobile() {
  return isAndroid() || isBlackBerry() || isiOS() || isOpera() || isWindows();
}

},{}],379:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUrlParameter = getUrlParameter;

var _strings = _interopRequireDefault(require("../../strings"));

var _events = require("./events");

var _keyboard = require("./keyboard");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = new RouteRecognizer();
var base = null;
var lastFragment = null;
var veryLastFragment = null;
var screens = new _events.Observable();
var beforeChangeListeners = [];
var routerDisabledNextTime = false;
var changeScreenConfirmEnabled = true;

function getUrlParameter(sParam) {
  var queryStringIndex = window.location.href.indexOf("?");

  if (queryStringIndex == -1) {
    return null;
  }

  var sPageURL = decodeURIComponent(window.location.href.substring(queryStringIndex + 1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
}

;

function _handleRoute(fragment) {
  var route = router.recognize(fragment);

  if (route) {
    var params = _.extend(route[0].params, route.queryParams || {});

    route[0].handler(params);
  }
}

function _clearSlashes(path) {
  return path.toString().replace(/\/$/, '').replace(/^\//, '');
}

exports.addRoute = function (path, handler) {
  router.add([{
    path: path,
    handler: handler
  }]);
};

exports.startNavigation = function (_base) {
  base = _base || "#";

  var loop = function loop() {
    var fragment = "/";

    if (location.href.indexOf("#") !== -1) {
      fragment = _clearSlashes(location.href.split("#")[1]);
    }

    if (lastFragment !== fragment) {
      veryLastFragment = lastFragment;
      lastFragment = fragment;

      if (!routerDisabledNextTime) {
        _handleRoute(fragment);
      }

      routerDisabledNextTime = false;
    }

    window.setTimeout(loop, 100);
  };

  loop();
};

exports.addQueryParam = function (param, value) {
  updateQueryStringParam(param, value);
};

function updateQueryStringParam(key, value) {
  var base = [location.protocol, '//', location.host, location.pathname].join("");

  if (location.href.indexOf("#") !== -1) {
    base = base + "#/" + _clearSlashes(location.href.split("#")[1].split("?")[0]);
  }

  var urlQueryString = location.href.split("?")[1];
  var newParams = key + '=' + value; // If the "search" string exists, then build params from it

  if (urlQueryString) {
    urlQueryString.split("&").forEach(function (e, i) {
      if (e.split("=")[0] != key) {
        newParams = newParams + "&" + e;
      }
    });
  }

  base = base + "?" + newParams;
  history.replaceState({}, "", base);
}

exports.navigate = function (path) {
  var openInNewTab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if ((0, _keyboard.isShiftPressed)()) {
    window.open(_clearSlashes(base + path)).focus();
  } else if ((0, _keyboard.isControlPressed)() || openInNewTab) {
    $("<a>").attr("href", _clearSlashes(base + path)).attr("target", "_blank").get(0).click();
  } else {
    history.pushState(null, null, _clearSlashes(base + path));
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }
};

exports.enableChangeScreenConfirm = function () {
  changeScreenConfirmEnabled = true;
};

exports.disableChangeScreenConfirm = function () {
  changeScreenConfirmEnabled = false;
};

exports.changeScreen = function (screen) {
  for (var i = 0; i < beforeChangeListeners.length; i++) {
    var listener = beforeChangeListeners[i];

    if (_.isFunction(listener)) {
      var out = listener();

      if (changeScreenConfirmEnabled) {
        if (out) {
          swal({
            title: (0, _strings["default"])("confirm"),
            text: (0, _strings["default"])("formChangeAlert"),
            showCancelButton: true
          }).then(function (res) {
            if (res.value) {
              screens.invoke("screen.change", screen);
            } else {
              if (!_.isEmpty(veryLastFragment)) {
                routerDisabledNextTime = true;
                window.location.href = "#" + veryLastFragment;
              }
            }
          });
          return;
        }
      } else {
        screens.invoke("screen.change", screen);
      }
    }
  }

  screens.invoke("screen.change", screen);
};

exports.addScreenChangeListener = function (listener) {
  screens.addListener("screen.change", listener);
};

exports.removeScreenChangeListener = function (listener) {
  screens.removeListener("screen.change", listener);
};

exports.addOnBeforeChangeListener = function (listener) {
  beforeChangeListeners.push(listener);
};

exports.removeOnBeforeChangeListener = function (listener) {
  beforeChangeListeners = _.filter(beforeChangeListeners, function (l) {
    return l !== listener;
  });
};

},{"../../strings":347,"./events":374,"./keyboard":377}],380:[function(require,module,exports){

},{}],381:[function(require,module,exports){
var indexOf = function (xs, item) {
    if (xs.indexOf) return xs.indexOf(item);
    else for (var i = 0; i < xs.length; i++) {
        if (xs[i] === item) return i;
    }
    return -1;
};
var Object_keys = function (obj) {
    if (Object.keys) return Object.keys(obj)
    else {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    }
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

var defineProp = (function() {
    try {
        Object.defineProperty({}, '_', {});
        return function(obj, name, value) {
            Object.defineProperty(obj, name, {
                writable: true,
                enumerable: false,
                configurable: true,
                value: value
            })
        };
    } catch(e) {
        return function(obj, name, value) {
            obj[name] = value;
        };
    }
}());

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

function Context() {}
Context.prototype = {};

var Script = exports.Script = function NodeScript (code) {
    if (!(this instanceof Script)) return new Script(code);
    this.code = code;
};

Script.prototype.runInContext = function (context) {
    if (!(context instanceof Context)) {
        throw new TypeError("needs a 'context' argument.");
    }
    
    var iframe = document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';
    
    document.body.appendChild(iframe);
    
    var win = iframe.contentWindow;
    var wEval = win.eval, wExecScript = win.execScript;

    if (!wEval && wExecScript) {
        // win.eval() magically appears when this is called in IE:
        wExecScript.call(win, 'null');
        wEval = win.eval;
    }
    
    forEach(Object_keys(context), function (key) {
        win[key] = context[key];
    });
    forEach(globals, function (key) {
        if (context[key]) {
            win[key] = context[key];
        }
    });
    
    var winKeys = Object_keys(win);

    var res = wEval.call(win, this.code);
    
    forEach(Object_keys(win), function (key) {
        // Avoid copying circular objects like `top` and `window` by only
        // updating existing context properties or new properties in the `win`
        // that was only introduced after the eval.
        if (key in context || indexOf(winKeys, key) === -1) {
            context[key] = win[key];
        }
    });

    forEach(globals, function (key) {
        if (!(key in context)) {
            defineProp(context, key, win[key]);
        }
    });
    
    document.body.removeChild(iframe);
    
    return res;
};

Script.prototype.runInThisContext = function () {
    return eval(this.code); // maybe...
};

Script.prototype.runInNewContext = function (context) {
    var ctx = Script.createContext(context);
    var res = this.runInContext(ctx);

    if (context) {
        forEach(Object_keys(ctx), function (key) {
            context[key] = ctx[key];
        });
    }

    return res;
};

forEach(Object_keys(Script.prototype), function (name) {
    exports[name] = Script[name] = function (code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
    };
});

exports.isContext = function (context) {
    return context instanceof Context;
};

exports.createScript = function (code) {
    return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
    var copy = new Context();
    if(typeof context === 'object') {
        forEach(Object_keys(context), function (key) {
            copy[key] = context[key];
        });
    }
    return copy;
};

},{}]},{},[24])

//# sourceMappingURL=app.js.map
