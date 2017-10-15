/*!
 * SimpleOekaki.js
 * ----------------
 * Author: Srod Karim (github.com/Sind)
 * Last updated: Sun Oct 15 2017
 */
var SimpleOekaki =
/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdateSimpleOekaki"];
/******/ 	this["webpackHotUpdateSimpleOekaki"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "37aa7b92fe67ff5ecddb"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/test";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(7)(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var round = Math.round;

module.exports = {
  name: "rgb",

  fromHsv: function fromHsv(hsv) {
    var r, g, b, i, f, p, q, t;
    var h = hsv.h / 360,
        s = hsv.s / 100,
        v = hsv.v / 100;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v, g = t, b = p;break;
      case 1:
        r = q, g = v, b = p;break;
      case 2:
        r = p, g = v, b = t;break;
      case 3:
        r = p, g = q, b = v;break;
      case 4:
        r = t, g = p, b = v;break;
      case 5:
        r = v, g = p, b = q;break;
    }
    return { r: round(r * 255), g: round(g * 255), b: round(b * 255) };
  },

  toHsv: function toHsv(rgb) {
    // Modified from https://github.com/bgrins/TinyColor/blob/master/tinycolor.js#L446
    var r = rgb.r / 255,
        g = rgb.g / 255,
        b = rgb.b / 255;
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        delta = max - min;
    var hue;
    switch (max) {
      case min:
        hue = 0;
        break;
      case r:
        hue = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      case b:
        hue = (r - g) / delta + 4;
        break;
    }
    hue /= 6;
    return {
      h: round(hue * 360),
      s: round(max === 0 ? 0 : delta / max * 100),
      v: round(max * 100)
    };
  }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(17)(undefined);
// imports


// module
exports.push([module.i, ".SimpleOekaki {\n  display: flex;\n  position: relative;\n  flex-direction: column;\n  background-color: #222222;\n  border-top-right-radius: 10px;\n  border-top-left-radius: 10px;\n  overflow: hidden;\n  user-select: none; }\n  .SimpleOekaki .color-select {\n    border: 3px solid #EEEEEE;\n    height: 32px;\n    border-radius: 10px;\n    box-sizing: border-box; }\n  .SimpleOekaki .optionsholder {\n    display: flex;\n    flex-direction: column; }\n    .SimpleOekaki .optionsholder .optionsrow {\n      display: flex;\n      flex-direction: row;\n      padding: 5px 10px;\n      align-items: center; }\n      .SimpleOekaki .optionsholder .optionsrow.reverse {\n        flex-direction: row-reverse; }\n      .SimpleOekaki .optionsholder .optionsrow.center {\n        justify-content: center; }\n      .SimpleOekaki .optionsholder .optionsrow .option {\n        margin: 2px;\n        color: #EEEEEE; }\n        .SimpleOekaki .optionsholder .optionsrow .option.grow {\n          flex-grow: 1; }\n        .SimpleOekaki .optionsholder .optionsrow .option.label {\n          font-size: 26px;\n          font-family: 'Roboto', sans-serif; }\n  .SimpleOekaki .canvasholder {\n    border-top: 4px dashed #222222;\n    padding: 50px;\n    background-color: #888888;\n    display: flex;\n    align-items: center;\n    justify-content: center; }\n    .SimpleOekaki .canvasholder canvas {\n      border: 4px dashed #222222; }\n  .SimpleOekaki .material-icons {\n    font-size: 32px;\n    cursor: pointer;\n    border-radius: 20px;\n    box-sizing: border-box; }\n  .SimpleOekaki .invisible-overlay {\n    position: absolute;\n    width: 100%;\n    height: 100%; }\n    .SimpleOekaki .invisible-overlay.hidden {\n      display: none; }\n  .SimpleOekaki .layer-menu {\n    position: absolute;\n    top: 0px;\n    right: 0px;\n    height: 100%;\n    width: 200px;\n    transition: all 1s;\n    background: #888888;\n    border-left: 4px dashed #222222;\n    box-sizing: border-box; }\n    .SimpleOekaki .layer-menu.hidden {\n      margin-right: -200px; }\n    .SimpleOekaki .layer-menu .layer-list {\n      display: flex;\n      flex-direction: column; }\n    .SimpleOekaki .layer-menu .layer {\n      margin: 10px;\n      border: 4px dashed #888888;\n      border-radius: 20px;\n      width: 180px;\n      box-sizing: border-box;\n      background: #222222; }\n      .SimpleOekaki .layer-menu .layer.selected {\n        background: #888888;\n        border-color: #222222; }\n  .SimpleOekaki .color-menu {\n    position: absolute;\n    left: 0px;\n    bottom: 0px;\n    width: 100%;\n    height: 400px;\n    transition: all 1s;\n    background: blue; }\n    .SimpleOekaki .color-menu.hidden {\n      margin-bottom: -400px; }\n    .SimpleOekaki .color-menu .color-wheel-holder {\n      width: 320px;\n      height: 320px; }\n  .SimpleOekaki [type='range'] {\n    -webkit-appearance: none;\n    margin: 10px 0;\n    width: 100px; }\n    .SimpleOekaki [type='range']:focus {\n      outline: 0; }\n      .SimpleOekaki [type='range']:focus::-webkit-slider-runnable-track {\n        background: white; }\n      .SimpleOekaki [type='range']:focus::-ms-fill-lower {\n        background: #FFFFFF; }\n      .SimpleOekaki [type='range']:focus::-ms-fill-upper {\n        background: white; }\n    .SimpleOekaki [type='range']::-webkit-slider-runnable-track {\n      cursor: pointer;\n      height: 14px;\n      transition: all .2s ease;\n      width: 100px;\n      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2), 0 0 0px rgba(13, 13, 13, 0.2);\n      background: #FFFFFF;\n      border: 6px solid #222222;\n      border-radius: 0px; }\n    .SimpleOekaki [type='range']::-webkit-slider-thumb {\n      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2), 0 0 0px rgba(13, 13, 13, 0.2);\n      background: #222222;\n      border: 2px solid #ffffff;\n      border-radius: 0px;\n      cursor: pointer;\n      height: 20px;\n      width: 10px;\n      -webkit-appearance: none;\n      margin-top: -9px; }\n    .SimpleOekaki [type='range']::-moz-range-track {\n      cursor: pointer;\n      height: 14px;\n      transition: all .2s ease;\n      width: 100px;\n      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2), 0 0 0px rgba(13, 13, 13, 0.2);\n      background: #FFFFFF;\n      border: 6px solid #222222;\n      border-radius: 0px; }\n    .SimpleOekaki [type='range']::-moz-range-thumb {\n      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2), 0 0 0px rgba(13, 13, 13, 0.2);\n      background: #222222;\n      border: 2px solid #ffffff;\n      border-radius: 0px;\n      cursor: pointer;\n      height: 20px;\n      width: 10px; }\n    .SimpleOekaki [type='range']::-ms-track {\n      cursor: pointer;\n      height: 14px;\n      transition: all .2s ease;\n      width: 100px;\n      background: transparent;\n      border-color: transparent;\n      border-width: 10px 0;\n      color: transparent; }\n    .SimpleOekaki [type='range']::-ms-fill-lower {\n      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2), 0 0 0px rgba(13, 13, 13, 0.2);\n      background: #f2f2f2;\n      border: 6px solid #222222;\n      border-radius: 0px; }\n    .SimpleOekaki [type='range']::-ms-fill-upper {\n      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2), 0 0 0px rgba(13, 13, 13, 0.2);\n      background: #FFFFFF;\n      border: 6px solid #222222;\n      border-radius: 0px; }\n    .SimpleOekaki [type='range']::-ms-thumb {\n      box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2), 0 0 0px rgba(13, 13, 13, 0.2);\n      background: #222222;\n      border: 2px solid #ffffff;\n      border-radius: 0px;\n      cursor: pointer;\n      height: 20px;\n      width: 10px;\n      margin-top: 0; }\n", ""]);

// exports


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function addColorStops(gradient, colorStops) {
  for (stop in colorStops) {
    gradient.addColorStop(stop, colorStops[stop]);
  }
  return gradient;
};

module.exports = {
  linear: function linear(ctx, x1, y1, x2, y2, colorStops) {
    return addColorStops(ctx.createLinearGradient(x1, y1, x2, y1), colorStops);
  },
  radial: function radial(ctx, x, y, min, max, colorStops) {
    return addColorStops(ctx.createRadialGradient(x, y, min, x, y, max), colorStops);
  }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
  * @constructor marker UI
  * @param {Object} ctx - canvas 2d context to draw on
  * @param {Object} opts - options
*/
var marker = function marker(ctx, opts) {
  this.opts = opts;
  this._ctx = ctx;
  this._last = false;
};

marker.prototype = {
  /**
    * @desc Draw a ring (only used internally)
    * @param {Number} x - centerpoint x coordinate
    * @param {Number} y - centerpoint y coordinate
    * @param {String} color - css color of the ring
    * @param {Number} lineWidth - width of the ring stroke
    * @private
  */
  _ring: function _ring(x, y, color, lineWidth) {
    var ctx = this._ctx;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.arc(x, y, this.opts.r, 0, 2 * Math.PI);
    ctx.stroke();
  },

  /**
    * @desc move markerpoint to centerpoint (x, y) and redraw
    * @param {Number} x - point x coordinate
    * @param {Number} y - point y coordinate
  */
  move: function move(x, y) {
    // Get the current position
    var last = this._last;
    var radius = this.opts.r + 4;
    // Clear the current marker
    if (last) this._ctx.clearRect(last.x - radius, last.y - radius, radius * 2, radius * 2);
    // Redraw at the new coordinates
    this._ring(x, y, "#333", 4);
    this._ring(x, y, "#fff", 2);
    // Update the position
    this._last = { x: x, y: y };
  }
};

module.exports = marker;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _hsl = __webpack_require__(5);

var _hsl2 = _interopRequireDefault(_hsl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  name: "hslString",

  fromHsv: function fromHsv(hsv) {
    var color = _hsl2.default.fromHsv(hsv);
    return "hsl" + (color.a ? "a" : "") + "(" + color.h + ", " + color.s + "%, " + color.l + "%" + (color.a ? ", " + color.a : "") + ")";
  },

  toHsv: function toHsv(hslString) {
    var parsed = hslString.match(/(hsla?)\((\d+)(?:\D+?)(\d+)(?:\D+?)(\d+)(?:\D+?)?([0-9\.]+?)?\)/i);
    return _hsl2.default.toHsv({
      h: parseInt(parsed[2]),
      s: parseInt(parsed[3]),
      l: parseInt(parsed[4])
    });
  }
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var round = Math.round;

module.exports = {
  name: "hsl",

  fromHsv: function fromHsv(hsv) {
    var s = hsv.s / 100,
        v = hsv.v / 100;
    var p = (2 - s) * v;
    s = s == 0 ? 0 : s * v / (p < 1 ? p : 2 - p);
    return {
      h: hsv.h,
      s: round(s * 100),
      l: round(p * 50)
    };
  },

  toHsv: function toHsv(hsl) {
    var s = hsl.s / 50,
        l = hsl.l / 100;
    s *= l <= 1 ? l : 2 - l;
    return {
      h: hsl.h,
      s: round(2 * s / (l + s) * 100),
      v: round((l + s) * 100)
    };
  }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Quick reference to the document object and some strings since we usethem more than once
var doc = document,
    READYSTATE_COMPLETE = "complete",
    READYSTATE_CHANGE = "readystatechange";

/**
 * @desc iterate a list (or create a one-item list from a string), calling callback with each item
 * @param {ArrayOrString} list an array or string, callback will be called for each array item, or once if a string is given
 * @param {Function} callback a function to call for each item, the item will be passed as the first parameter
 * @access private
*/
function iterateList(list, callback) {
  list = "string" == typeof list ? [list] : list;
  list.forEach(callback);
};

module.exports = {
  /**
   * @desc find a html element that matches a CSS selector
   * @param {String} selector the CSS selector to be used to target a HTML element
   * @return {Element} the HTML element that matches the selector given
  */
  $: function $(selector) {
    return doc.querySelector(selector);
  },

  /**
   * @desc create a new HTML element
   * @param {String} tagName the tag type of the element to create
   * @return {Element} the newly created HTML element
  */
  create: function create(tagName) {
    return doc.createElement(tagName);
  },

  /**
   * @desc append a child element to an element
   * @param {Element} el the parent element to append to
   * @param {Element} child the child element to append
   * @return {Element} the child element, now appended to the parent
  */
  append: function append(el, child) {
    return el.appendChild(child);
  },

  /**
   * @desc get an element's attribute by name
   * @param {Element} el target element
   * @param {String} attrName the name of the attribute to get
   * @return {String} the value of the attribute
  */
  attr: function attr(el, attrName) {
    return el.getAttribute(attrName);
  },

  /**
   * @desc listen to one or more events on an element
   * @param {Element} el target element
   * @param {ArrayOrString} eventList the events to listen to
   * @param {Function} callback the event callback function
  */
  listen: function listen(el, eventList, callback) {
    iterateList(eventList, function (eventName) {
      el.addEventListener(eventName, callback);
    });
  },

  /**
   * @desc remove an event listener on an element
   * @param {Element} el target element
   * @param {ArrayOrString} eventList the events to remove
   * @param {Function} callback the event callback function
  */
  unlisten: function unlisten(el, eventList, callback) {
    iterateList(eventList, function (eventName) {
      el.removeEventListener(eventName, callback);
    });
  },

  /**
   * @desc call callback when the page document is ready
   * @param {Function} callback callback function to be called
  */
  whenReady: function whenReady(callback) {
    var _this = this;
    if (doc.readyState == READYSTATE_COMPLETE) {
      callback();
    } else {
      _this.listen(doc, READYSTATE_CHANGE, function stateChange(e) {
        if (doc.readyState == READYSTATE_COMPLETE) {
          callback();
          _this.unlisten(doc, READYSTATE_CHANGE, stateChange);
        }
      });
    }
  }
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colorPicker = __webpack_require__(8);

var _colorPicker2 = _interopRequireDefault(_colorPicker);

var _sortablejs = __webpack_require__(15);

var _sortablejs2 = _interopRequireDefault(_sortablejs);

__webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// const fs = require('fs');


var SimpleOekakiCanvas = __webpack_require__(20);
var utils = __webpack_require__(25);

var SimpleOekaki = function (_SimpleOekakiCanvas) {
  _inherits(SimpleOekaki, _SimpleOekakiCanvas);

  function SimpleOekaki(div) {
    _classCallCheck(this, SimpleOekaki);

    if (div == null || div.tagName !== 'DIV') {
      throw new Error('You must provide a div as input parameter.');
    }
    // html
    var maindiv = document.createElement('div');
    maindiv.classList.add('SimpleOekaki');
    maindiv.setAttribute('oncontextmenu', 'return false;');
    var optionsholder = document.createElement('div');
    optionsholder.classList.add('optionsholder');
    var canvasholder = document.createElement('div');
    canvasholder.classList.add('canvasholder');
    var toprow = document.createElement('div');
    toprow.classList.add('optionsrow');
    var bottomrow = document.createElement('div');
    bottomrow.classList.add('optionsrow');

    var _this = _possibleConstructorReturn(this, (SimpleOekaki.__proto__ || Object.getPrototypeOf(SimpleOekaki)).call(this, canvasholder));

    _this._incSizeButton = document.createElement('i');
    _this._incSizeButton.classList.add('material-icons');
    _this._incSizeButton.classList.add('option');
    _this._incSizeButton.innerHTML = 'add';

    _this._decSizeButton = document.createElement('i');
    _this._decSizeButton.classList.add('material-icons');
    _this._decSizeButton.classList.add('option');
    _this._decSizeButton.innerHTML = 'remove';

    _this._sizeSlider = document.createElement('input');
    _this._sizeSlider.setAttribute('type', 'range');
    _this._sizeSlider.classList.add('option');
    _this._sizeSlider.step = 2;
    _this._sizeSlider.value = SimpleOekakiCanvas.DEFAULT_BRUSH_SIZE;
    _this._sizeSlider.min = SimpleOekakiCanvas.MIN_BRUSH_SIZE;
    _this._sizeSlider.max = SimpleOekakiCanvas.MAX_BRUSH_SIZE;

    _this._layerMenuOpenButton = document.createElement('i');
    _this._layerMenuOpenButton.classList.add('material-icons');
    _this._layerMenuOpenButton.classList.add('option');
    _this._layerMenuOpenButton.innerHTML = 'layers';

    _this._backgroundColorSelector = document.createElement('input');
    _this._backgroundColorSelector.setAttribute('type', 'color');
    _this._backgroundColorSelector.setAttribute('value', utils.RGBtoHTML(_this.backgroundColor));

    _this._invisibleLayerMenuOverlay = document.createElement('div');
    _this._invisibleLayerMenuOverlay.classList.add('invisible-overlay');
    _this._invisibleLayerMenuOverlay.classList.add('hidden');

    _this._layerMenu = document.createElement('div');
    _this._layerMenu.classList.add('layer-menu');
    _this._layerMenu.classList.add('hidden');

    var layerMenuOptionsHolder = document.createElement('div');
    layerMenuOptionsHolder.classList.add('optionsholder');

    var layerMenuOptionsRow = document.createElement('div');
    layerMenuOptionsRow.classList.add('optionsrow');
    layerMenuOptionsRow.classList.add('reverse');

    _this._layerMenuCloseButton = document.createElement('i');
    _this._layerMenuCloseButton.classList.add('material-icons');
    _this._layerMenuCloseButton.classList.add('option');
    _this._layerMenuCloseButton.innerHTML = 'close';

    _this._layerList = document.createElement('div');
    _this._layerList.classList.add('layer-list');
    _this._layerList.classList.add('list-group');

    _this._layers = [document.createElement('div'), document.createElement('div'), document.createElement('div')];

    _this._layers.forEach(function (layer, index) {
      layer.classList.add('layer');
      layer.classList.add('list-group-item');
      layer.classList.add('optionsholder');
      layer.setAttribute('data-layer-id', 2 - index);
      if (index === 0) layer.classList.add('selected');

      var text = document.createElement('div');
      text.classList.add('optionsrow');
      text.classList.add('layer-selector');

      var label = document.createElement('div');
      label.classList.add('option');
      label.classList.add('label');
      label.innerHTML = 'Layer ' + (3 - index);

      var options = document.createElement('div');
      options.classList.add('optionsrow');

      var visibilityButton = document.createElement('i');
      visibilityButton.classList.add('material-icons');
      visibilityButton.classList.add('option');
      visibilityButton.innerHTML = 'visibility';

      var colorSelect = document.createElement('div');
      colorSelect.classList.add('color-select');
      colorSelect.classList.add('option');
      colorSelect.classList.add('grow');

      text.appendChild(label);
      options.appendChild(visibilityButton);
      options.appendChild(colorSelect);
      layer.appendChild(text);
      layer.appendChild(options);
      _this._layerList.appendChild(layer);
    });

    _sortablejs2.default.create(_this._layerList);

    _this._backgroundLayer = document.createElement('div');
    _this._backgroundLayer.classList.add('layer');
    _this._backgroundLayer.classList.add('optionsholder');
    _this._backgroundLayer.setAttribute('data-layer-id', -1);

    var text = document.createElement('div');
    text.classList.add('optionsrow');
    text.classList.add('layer-selector');

    var label = document.createElement('div');
    label.classList.add('option');
    label.classList.add('label');
    label.innerHTML = 'Background';

    var options = document.createElement('div');
    options.classList.add('optionsrow');

    var colorSelect = document.createElement('div');
    colorSelect.classList.add('color-select');
    colorSelect.classList.add('option');
    colorSelect.classList.add('grow');

    text.appendChild(label);
    _this._backgroundLayer.appendChild(text);
    options.appendChild(colorSelect);
    _this._backgroundLayer.appendChild(options);

    _this._invisibleColorMenuOverlay = document.createElement('div');
    _this._invisibleColorMenuOverlay.classList.add('invisible-overlay');
    _this._invisibleColorMenuOverlay.classList.add('hidden');

    _this._colorMenu = document.createElement('div');
    _this._colorMenu.classList.add('color-menu');
    _this._colorMenu.classList.add('hidden');

    var colorMenuOptionsHolder = document.createElement('div');
    colorMenuOptionsHolder.classList.add('optionsholder');

    var colorMenuOptionsRow = document.createElement('div');
    colorMenuOptionsRow.classList.add('optionsrow');
    colorMenuOptionsRow.classList.add('reverse');

    _this._colorMenuCloseButton = document.createElement('i');
    _this._colorMenuCloseButton.classList.add('material-icons');
    _this._colorMenuCloseButton.classList.add('option');
    _this._colorMenuCloseButton.innerHTML = 'close';

    var colorMenuPickerRow = document.createElement('div');
    colorMenuPickerRow.classList.add('optionsrow');
    colorMenuPickerRow.classList.add('center');

    var colorPickerHolder = document.createElement('div');
    colorPickerHolder.classList.add('color-wheel-holder');
    colorPickerHolder.id = 'color-wheel-holder';

    div.appendChild(maindiv);
    maindiv.appendChild(optionsholder);
    optionsholder.appendChild(toprow);
    optionsholder.appendChild(bottomrow);
    toprow.appendChild(_this._decSizeButton);
    toprow.appendChild(_this._sizeSlider);
    toprow.appendChild(_this._incSizeButton);
    toprow.appendChild(_this._backgroundColorSelector);
    toprow.appendChild(_this._layerMenuOpenButton);
    maindiv.appendChild(canvasholder);

    maindiv.appendChild(_this._invisibleLayerMenuOverlay);
    maindiv.appendChild(_this._layerMenu);
    _this._layerMenu.appendChild(layerMenuOptionsHolder);
    layerMenuOptionsHolder.appendChild(layerMenuOptionsRow);
    layerMenuOptionsRow.appendChild(_this._layerMenuCloseButton);
    _this._layerMenu.appendChild(_this._layerList);
    _this._layerMenu.appendChild(_this._backgroundLayer);

    maindiv.appendChild(_this._invisibleColorMenuOverlay);
    maindiv.append(_this._colorMenu);
    _this._colorMenu.appendChild(colorMenuOptionsHolder);
    colorMenuOptionsHolder.appendChild(colorMenuOptionsRow);
    colorMenuOptionsRow.appendChild(_this._colorMenuCloseButton);
    colorMenuPickerRow.appendChild(colorPickerHolder);
    colorMenuOptionsHolder.appendChild(colorMenuPickerRow);
    _this._colorPicker = new _colorPicker2.default('#color-wheel-holder');

    _this._setHTMLInputCallbacks();
    return _this;
  }

  _createClass(SimpleOekaki, [{
    key: '_onBrushSizeChange',
    value: function _onBrushSizeChange(brushSize) {
      this._sizeSlider.value = brushSize;
    }
  }, {
    key: '_onCurrentLayerChange',
    value: function _onCurrentLayerChange(id) {
      this._layers.forEach(function (layer) {
        if (id === layer.getAttribute('data-layer-id')) {
          layer.classList.add('selected');
        } else {
          layer.classList.remove('selected');
        }
      });
    }
  }, {
    key: '_setHTMLInputCallbacks',
    value: function _setHTMLInputCallbacks() {
      var _this2 = this;

      this._decSizeButton.addEventListener('click', function () {
        _this2.brushSize -= 2;
      });
      this._incSizeButton.addEventListener('click', function () {
        _this2.brushSize += 2;
      });
      this._sizeSlider.addEventListener('change', function () {
        _this2.brushSize = parseInt(_this2._sizeSlider.value, 10);
      });
      this._backgroundColorSelector.addEventListener('input', function () {
        _this2.backgroundColor = utils.HTMLtoRGB(_this2._backgroundColorSelector.value);
      });
      this._layerMenuOpenButton.addEventListener('click', function () {
        _this2.openLayerMenu();
      });
      this._layerMenuCloseButton.addEventListener('click', function () {
        _this2.closeLayerMenu();
      });
      this._invisibleLayerMenuOverlay.addEventListener('click', function () {
        _this2.closeLayerMenu();
      });
      this._colorMenuCloseButton.addEventListener('click', function () {
        _this2.closeColorMenu();
      });
      this._invisibleColorMenuOverlay.addEventListener('click', function () {
        _this2.closeColorMenu();
      });

      Array.prototype.forEach.call(document.getElementsByClassName('layer-selector'), function (text) {
        var id = text.parentNode.getAttribute('data-layer-id');
        if (id === -1) return;
        text.addEventListener('click', function () {
          _this2.currentLayer = id;
        });
      });
    }
  }, {
    key: 'openLayerMenu',
    value: function openLayerMenu() {
      this._layerMenu.classList.remove('hidden');
      this._invisibleLayerMenuOverlay.classList.remove('hidden');
    }
  }, {
    key: 'closeLayerMenu',
    value: function closeLayerMenu() {
      this._layerMenu.classList.add('hidden');
      this._invisibleLayerMenuOverlay.classList.add('hidden');
    }
  }, {
    key: 'openColorMenu',
    value: function openColorMenu() {
      this._colorMenu.classList.remove('hidden');
      this._invisibleColorMenuOverlay.classList.remove('hidden');
    }
  }, {
    key: 'closeColorMenu',
    value: function closeColorMenu() {
      this._colorMenu.classList.add('hidden');
      this._invisibleColorMenuOverlay.classList.add('hidden');
    }
  }]);

  return SimpleOekaki;
}(SimpleOekakiCanvas);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleOekaki;
}

if (window) {
  window.SimpleOekaki = SimpleOekaki;
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _wheel = __webpack_require__(9);

var _wheel2 = _interopRequireDefault(_wheel);

var _slider = __webpack_require__(10);

var _slider2 = _interopRequireDefault(_slider);

var _dom = __webpack_require__(6);

var _dom2 = _interopRequireDefault(_dom);

var _color = __webpack_require__(11);

var _color2 = _interopRequireDefault(_color);

var _stylesheet = __webpack_require__(14);

var _stylesheet2 = _interopRequireDefault(_stylesheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// When the user starts to interact with a color picker's UI, a referece to that coloPicker will be stored globally
var activeColorWheel = false;

// Global mousemove + touchmove event handler
_dom2.default.listen(document, ["mousemove", "touchmove"], function (e) {
  // If there is an active colorWheel, call its mousemove handler
  if (activeColorWheel) activeColorWheel._mouseMove(e);
});

// Global mouseup + touchend event handler
_dom2.default.listen(document, ["mouseup", "touchend"], function (e) {
  // If there is an active colorWheel, stop it from handling input and clear the active colorWheel reference
  if (activeColorWheel) {
    e.preventDefault();
    activeColorWheel.emit("input:end");
    activeColorWheel._mouseTarget = false;
    activeColorWheel = false;
  }
});

/**
  @constructor color wheel object
  @param {ElementOrString} el - a DOM element or the CSS selector for a DOM element to use as a container for the UI
  @param {Object} opts - options for this instance
*/
var colorWheel = function colorWheel(el, opts) {
  if (!(this instanceof colorWheel)) return new colorWheel(el, opts);
  opts = opts || {};
  // event storage for `on` and `off`
  this._events = {};
  this._mouseTarget = false;
  this._onChange = false;
  // Create an iroStyleSheet for this colorWheel's CSS overrides
  this.stylesheet = new _stylesheet2.default();
  this.css = opts.css || opts.styles || undefined;
  // Create an iroColor to store this colorWheel's selected color
  this.color = new _color2.default(opts.color || "#fff");

  // Wait for the document to be ready, then init the UI
  _dom2.default.whenReady(function () {
    // If `el` is a string, use it to select an Element, else assume it's an element
    el = "string" == typeof el ? _dom2.default.$(el) : el;
    // Make sure the canvas wrapper is position:relative
    // This is because we'll be using position:absolute to stack the canvas layers
    el.style.cssText += "position:relative";
    // Find the width and height for the UI
    // If not defined in the options, try the HTML width + height attributes of the wrapper, else default to 320
    var width = opts.width || parseInt(_dom2.default.attr(el, "width")) || 320;
    var height = opts.height || parseInt(_dom2.default.attr(el, "height")) || 320;
    // Create UI layers
    // To support devices with hidpi screens, we scale the canvas so that it has more pixels, but still has the same size visually
    // This implementation is based on https://www.html5rocks.com/en/tutorials/canvas/hidpi/
    var pxRatio = devicePixelRatio || 1;
    // Multiply the visual width and height by the pixel ratio
    // These dimensions will be used as the internal pixel dimensions for the canvas
    var pxWidth = width * pxRatio;
    var pxHeight = height * pxRatio;
    // When we make new layers we'll add them to this object
    var layers = {};
    var layerNames = ["main", "over"];
    // Create a layer for each name
    layerNames.forEach(function (name, index) {
      // Create a new canvas and add it to the page
      var canvas = _dom2.default.append(el, _dom2.default.create("canvas"));
      var ctx = canvas.getContext("2d");
      var style = canvas.style;
      // Set the internal dimensions for the canvas
      canvas.width = pxWidth;
      canvas.height = pxHeight;
      // Set the visual dimensions for the canvas
      style.cssText += "width:" + width + "px;height:" + height + "px";
      // Scale the canvas context to counter the manual scaling of the element
      ctx.scale(pxRatio, pxRatio);
      // Since we're creating multiple "layers" from seperate canvas we need them to be visually stacked ontop of eachother
      // Here, any layer that isn't the first will be forced to the same position relative to their wrapper element
      // The first layer isn't forced, so the space it takes up will still be considered in page layout
      if (index != 0) style.cssText += "position:absolute;top:0;left:0";
      layers[name] = {
        ctx: ctx,
        canvas: canvas
      };
    });
    this.el = el;
    this.layers = layers;
    // Calculate layout variables
    var padding = opts.padding + 2 || 6,
        borderWidth = opts.borderWidth || 0,
        markerRadius = opts.markerRadius || 8,
        sliderMargin = opts.sliderMargin || 24,
        sliderHeight = opts.sliderHeight || markerRadius * 2 + padding * 2 + borderWidth * 2,
        bodyWidth = Math.min(height - sliderHeight - sliderMargin, width),
        wheelRadius = bodyWidth / 2 - borderWidth,
        leftMargin = (width - bodyWidth) / 2;
    var marker = {
      r: markerRadius
    };
    var borderStyles = {
      w: borderWidth,
      color: opts.borderColor || "#fff"
    };
    // Create UI elements
    this.ui = [new _wheel2.default(layers, {
      cX: leftMargin + bodyWidth / 2,
      cY: bodyWidth / 2,
      r: wheelRadius,
      rMax: wheelRadius - (markerRadius + padding),
      marker: marker,
      border: borderStyles
    }), new _slider2.default(layers, {
      sliderType: "v",
      x: leftMargin + borderWidth,
      y: bodyWidth + sliderMargin,
      w: bodyWidth - borderWidth * 2,
      h: sliderHeight - borderWidth * 2,
      r: sliderHeight / 2 - borderWidth,
      marker: marker,
      border: borderStyles
    })];
    // Whenever the selected color changes, trigger a colorWheel update too
    this.color.watch(this._update.bind(this), true);
    // Add handler for mousedown + touchdown events on this element
    _dom2.default.listen(el, ["mousedown", "touchstart"], this._mouseDown.bind(this));
  }.bind(this));
};

colorWheel.prototype = {
  /**
    * @desc Set a callback function that gets called whenever the selected color changes
    * @param {Function} callback The watch callback
    * @param {Boolean} callImmediately set to true if you want to call the callback as soon as it is added
  */
  watch: function watch(callback, callImmediately) {
    this.on("color:change", callback);
    this._onChange = callback;
    if (callImmediately) callback(this.color);
  },

  /**
    * @desc Remove the watch callback
  */
  unwatch: function unwatch() {
    this.off("color:change", this._onChange);
  },

  /**
    * @desc Set a callback function for an event
    * @param {String} eventType The name of the event to listen to, pass "*" to listen to all events
    * @param {Function} callback The watch callback
  */
  on: function on(eventType, callback) {
    var events = this._events;
    (events[eventType] || (events[eventType] = [])).push(callback);
  },

  /**
    * @desc Remove a callback function for an event added with on()
    * @param {String} eventType The name of the event
    * @param {Function} callback The watch callback to remove from the event
  */
  off: function off(eventType, callback) {
    var events = this._events;
    if (events[eventType]) {
      events[eventType].splice(events[eventType].indexOf(callback), 1);
    }
  },

  /**
    * @desc Emit an event
    * @param {String} eventType The name of the event to emit
    * @param {Object} data data to pass to all the callback functions
  */
  emit: function emit(eventType, data) {
    var events = this._events;
    (events[eventType] || []).map(function (callback) {
      callback(data);
    });
    (events["*"] || []).map(function (callback) {
      callback(data);
    });
  },

  /**
    * @desc Get the local-space X and Y pointer position from an input event
    * @param {Event} e A mouse or touch event
    * @return {Object} x and y coordinates from the top-left of the UI
    * @access protected
  */
  _getLocalPoint: function _getLocalPoint(e) {
    // Prevent default event behaviour, like scrolling
    e.preventDefault();
    // Detect if the event is a touch event by checking if it has the `touches` property
    // If it is a touch event, use the first touch input
    var point = e.touches ? e.changedTouches[0] : e,

    // Get the screen position of the UI
    rect = this.layers.main.canvas.getBoundingClientRect();
    // Convert the screen-space pointer position to local-space
    return {
      x: point.clientX - rect.left,
      y: point.clientY - rect.top
    };
  },

  /**
    * @desc Handle a pointer input at local-space point (x, y)
    * @param {Event} e A mouse or touch event
    * @return {Object} x and y coordinates from the top-left of the UI
    * @access protected
  */
  _handleInput: function _handleInput(x, y) {
    // Use the active UI element to handle translating the input to a change in the color
    this.color.set(this._mouseTarget.input(x, y));
  },

  /**
    * @desc mousedown event handler
    * @param {Event} e A mouse or touch event
    * @access protected
  */
  _mouseDown: function _mouseDown(e) {
    var _this = this;

    // Get the local-space position of the mouse input
    var point = this._getLocalPoint(e),
        x = point.x,
        y = point.y;

    // Loop through each UI element and check if the point "hits" it
    this.ui.forEach(function (uiElement) {
      // If the element is hit, this means the user has clicked the element and is trying to interact with it
      if (uiElement.checkHit(x, y)) {
        // Set a reference to this colorWheel instance so that the global event handlers know about it
        activeColorWheel = _this;
        // Set an internal reference to the uiElement being interacted with, for other internal event handlers
        _this._mouseTarget = uiElement;
        // Emit input start event
        _this.emit("input:start");
        // Finally, use the position to update the picked color
        _this._handleInput(x, y);
      }
    });
  },

  /**
    * @desc mousemose event handler
    * @param {Event} e A mouse or touch event
    * @access protected
  */
  _mouseMove: function _mouseMove(e) {
    // If there is an active colorWheel (set in _mouseDown) then update the input as the user interacts with it
    if (this == activeColorWheel) {
      // Get the local-space position of the mouse input
      var point = this._getLocalPoint(e);
      // Use the position to update the picker color
      this._handleInput(point.x, point.y);
    }
  },

  /**
    * @desc update the selected color
    * @param {Object} newValue - the new HSV values
    * @param {Object} oldValue - the old HSV values
    * @param {Object} changes - booleans for each HSV channel: true if the new value is different to the old value, else false
    * @access protected
  */
  _update: function _update(newValue, oldValue, changes) {
    var color = this.color;
    var rgb = color.rgbString;
    var css = this.css;
    // Loop through each UI element and update it
    this.ui.forEach(function (uiElement) {
      uiElement.update(color, changes);
    });
    // Update the stylesheet too
    for (var selector in css) {
      var properties = css[selector];
      for (var prop in properties) {
        this.stylesheet.setRule(selector, prop, rgb);
      }
    }
    // Call the color change event
    this.emit("color:change", color);
  }
};

module.exports = colorWheel;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _gradient = __webpack_require__(2);

var _gradient2 = _interopRequireDefault(_gradient);

var _marker = __webpack_require__(3);

var _marker2 = _interopRequireDefault(_marker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Quick references to reused math functions
var PI = Math.PI,
    pow = Math.pow,
    sqrt = Math.sqrt,
    abs = Math.abs,
    round = Math.round;

/**
  * @constructor hue wheel UI
*/
var wheel = function wheel(layers, opts) {
  this._ctx = layers.main.ctx;
  this._opts = opts;
  this.type = "wheel";
  this.marker = new _marker2.default(layers.over.ctx, opts.marker);
};

wheel.prototype = {

  /**
    * @desc redraw this UI element
    * @param {Number} value - The hsv value component to use when drawing
  */
  draw: function draw(value) {
    var ctx = this._ctx;
    var opts = this._opts;
    var x = opts.cX,
        y = opts.cY,
        border = opts.border,
        borderWidth = border.w,
        radius = opts.r;

    // Clear the area where the wheel will be drawn
    ctx.clearRect(x - radius - borderWidth, y - radius - borderWidth, (radius + borderWidth) * 2, (radius + borderWidth) * 2);

    // Draw border
    if (borderWidth) {
      ctx.lineWidth = radius + borderWidth * 2;
      ctx.strokeStyle = border.color;
      ctx.beginPath();
      ctx.arc(x, y, radius / 2, 0, 2 * PI);
      ctx.stroke();
    }

    ctx.lineWidth = radius;

    // The hue wheel is basically drawn with a series of thin "pie slices" - one slice for each hue degree
    // Here we calculate the angle for each slice, in radians
    var sliceAngle = 2 * PI / 360;

    // Create a loop to draw each slice
    for (var hue = 0, sliceStart = 0; hue < 360; hue++, sliceStart += sliceAngle) {
      // Create a HSL color for the slice using the current hue value
      ctx.strokeStyle = "hsl(" + hue + ",100%," + value / 2 + "%)";
      ctx.beginPath();
      // For whatever reason (maybe a rounding issue?) the slices had a slight gap between them, which caused rendering artifacts
      // So we make them overlap ever so slightly by adding a tiny value to the slice angle
      ctx.arc(x, y, radius / 2, sliceStart, sliceStart + sliceAngle + 0.04);
      ctx.stroke();
    }

    // Create a radial gradient for "saturation"
    var hslString = "hsla(0,0%," + value + "%,";
    ctx.fillStyle = _gradient2.default.radial(ctx, x, y, 0, opts.rMax, {
      // The center of the color wheel should be pure white (0% saturation)
      0: hslString + "1)",
      // It gradially tapers to transparent white (or, visually, 100% saturation color already drawn) at the edge of the wheel
      1: hslString + "0)"
    });
    // Draw a rect using the gradient as a fill style
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  },

  /**
    * @desc updates this element to represent a new color value
    * @param {Object} color - an iroColor object with the new color value
    * @param {Object} changes - an object that gives a boolean for each HSV channel, indicating whether ot not that channel has changed
  */
  update: function update(color, changes) {
    var opts = this._opts;
    var hsv = color.hsv;
    // If the V channel has changed, redraw the wheel UI with the new value
    if (changes.v) {
      this.draw(hsv.v);
    }
    // If the H or S channel has changed, move the marker to the right position
    if (changes.h || changes.s) {
      // convert the hue value to radians, since we'll use it as an angle
      var hueAngle = hsv.h * (PI / 180);
      // convert the saturation value to a distance between the center of the ring and the edge
      var dist = hsv.s / 100 * opts.rMax;
      // Move the marker based on the angle and distance
      this.marker.move(opts.cX + dist * Math.cos(hueAngle), opts.cY + dist * Math.sin(hueAngle));
    }
  },

  /**
    * @desc Takes a point at (x, y) and returns HSV values based on this input -- use this to update a color from mouse input
    * @param {Number} x - point x coordinate
    * @param {Number} y - point y coordinate
    * @return {Object} - new HSV color values (some channels may be missing)
  */
  input: function input(x, y) {
    var opts = this._opts,
        cX = opts.cX,
        cY = opts.cY,
        radius = opts.r,
        rangeMax = opts.rMax;

    // Angle in radians, anticlockwise starting at 12 o'clock
    var angle = Math.atan2(x - cX, y - cY),

    // Calculate the hue by converting the angle to radians, and normalising the angle to 3 o'clock
    hue = 360 - (round(angle * (180 / PI)) + 270) % 360,

    // Find the point's distance from the center of the wheel
    // This is used to show the saturation level
    dist = Math.min(sqrt(pow(cX - x, 2) + pow(cY - y, 2)), rangeMax);

    // Return just the H and S channels, the wheel element doesn't do anything with the L channel
    return {
      h: hue,
      s: round(100 / rangeMax * dist)
    };
  },

  /**
    * @desc Check if a point at (x, y) is inside this element
    * @param {Number} x - point x coordinate
    * @param {Number} y - point y coordinate
    * @return {Boolean} - true if the point is a "hit", else false
  */
  checkHit: function checkHit(x, y) {
    var opts = this._opts;

    // Check if the point is within the hue ring by comparing the point's distance from the centre to the ring's radius
    // If the distance is smaller than the radius, then we have a hit
    var dx = abs(x - opts.cX),
        dy = abs(y - opts.cY);
    return sqrt(dx * dx + dy * dy) < opts.r;
  }
};

module.exports = wheel;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _gradient = __webpack_require__(2);

var _gradient2 = _interopRequireDefault(_gradient);

var _marker = __webpack_require__(3);

var _marker2 = _interopRequireDefault(_marker);

var _hslString = __webpack_require__(4);

var _hslString2 = _interopRequireDefault(_hslString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
  * @constructor slider UI
*/
var slider = function slider(layers, opts) {
  this._ctx = layers.main.ctx;
  opts.x1 = opts.x;
  opts.y1 = opts.y;
  opts.x2 = opts.x + opts.w;
  opts.y2 = opts.y + opts.h;

  // "range" limits how far the slider's marker can travel, and where it stops and starts along the X axis
  opts.range = {
    min: opts.x + opts.r,
    max: opts.x2 - opts.r,
    w: opts.w - opts.r * 2
  };
  opts.sliderType = opts.sliderType || "v";
  this.type = "slider";
  this.marker = new _marker2.default(layers.over.ctx, opts.marker);
  this._opts = opts;
};

slider.prototype = {
  /**
    * @desc redraw this UI element
  */
  draw: function draw(hsv) {
    var ctx = this._ctx;
    var opts = this._opts;
    var x1 = opts.x1,
        y1 = opts.y1,
        x2 = opts.x2,
        y2 = opts.y2,
        w = opts.w,
        h = opts.h,
        r = opts.r,
        border = opts.border,
        borderWidth = border.w;

    // Clear the existing UI
    ctx.clearRect(x1 - borderWidth, y1 - borderWidth, w + borderWidth * 2, h + borderWidth * 2);

    // Draw a rounded rect
    // Modified from http://stackoverflow.com/a/7838871
    ctx.beginPath();
    ctx.moveTo(x1 + r, y1);
    ctx.arcTo(x2, y1, x2, y2, r);
    ctx.arcTo(x2, y2, x1, y2, r);
    ctx.arcTo(x1, y2, x1, y1, r);
    ctx.arcTo(x1, y1, x2, y1, r);
    ctx.closePath();

    // I plan to have different slider "types" in the future
    // (I'd like to add a transparency slider at some point, for example)
    var fill;

    // For now the only type is "V", meaning this slider adjusts the HSV V channel
    if (opts.sliderType == "v") {
      fill = _gradient2.default.linear(ctx, x1, y1, x2, y2, {
        0: "#000",
        1: _hslString2.default.fromHsv({ h: hsv.h, s: hsv.s, v: 100 })
      });
    }

    // Draw border
    if (borderWidth) {
      ctx.strokeStyle = border.color;
      ctx.lineWidth = borderWidth * 2;
      ctx.stroke();
    }

    // Draw gradient
    ctx.fillStyle = fill;
    ctx.fill();
  },

  /**
    * @desc updates this element to represent a new color value
    * @param {Object} color - an iroColor object with the new color value
    * @param {Object} changes - an object that gives a boolean for each HSV channel, indicating whether ot not that channel has changed
  */
  update: function update(color, changes) {
    var opts = this._opts;
    var range = opts.range;
    var hsv = color.hsv;
    if (opts.sliderType == "v") {
      if (changes.h || changes.s) {
        this.draw(hsv);
      }
      if (changes.v) {
        var percent = hsv.v / 100;
        this.marker.move(range.min + percent * range.w, opts.y1 + opts.h / 2);
      }
    }
  },

  /**
    * @desc Takes a point at (x, y) and returns HSV values based on this input -- use this to update a color from mouse input
    * @param {Number} x - point x coordinate
    * @param {Number} y - point y coordinate
    * @return {Object} - new HSV color values (some channels may be missing)
  */
  input: function input(x, y) {
    var opts = this._opts;
    var range = opts.range;
    var dist = Math.max(Math.min(x, range.max), range.min) - range.min;
    return {
      v: Math.round(100 / range.w * dist)
    };
  },

  /**
    * @desc Check if a point at (x, y) is inside this element
    * @param {Number} x - point x coordinate
    * @param {Number} y - point y coordinate
    * @return {Boolean} - true if the point is a "hit", else false
  */
  checkHit: function checkHit(x, y) {
    var opts = this._opts;
    return x > opts.x1 && x < opts.x2 && y > opts.y1 && y < opts.y2;
  }
};

module.exports = slider;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _hsl = __webpack_require__(5);

var _hsl2 = _interopRequireDefault(_hsl);

var _rgb = __webpack_require__(0);

var _rgb2 = _interopRequireDefault(_rgb);

var _hslString = __webpack_require__(4);

var _hslString2 = _interopRequireDefault(_hslString);

var _rgbString = __webpack_require__(12);

var _rgbString2 = _interopRequireDefault(_rgbString);

var _hexString = __webpack_require__(13);

var _hexString2 = _interopRequireDefault(_hexString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var colorModels = [_hsl2.default, _rgb2.default, _hslString2.default, _rgbString2.default, _hexString2.default];

/**
  @constructor color object
  @param {String} str (optional) CSS color string to use as the start color for this element
*/
var color = function color(str) {
  var _this = this;

  if (!(this instanceof color)) return new color(str);
  // The watch callback function for this color will be stored here
  this._onChange = false;
  // The default color value
  this._value = { h: undefined, s: undefined, v: undefined };
  this.register("hsv", {
    get: this.get,
    set: this.set
  });
  // Loop through each external color model and register it
  colorModels.forEach(function (model) {
    _this.register(model.name, {
      set: function set(value) {
        this.hsv = model.toHsv(value);
      },
      get: function get() {
        return model.fromHsv(this.hsv);
      }
    });
  });
  if (str) this.fromString(str);
};

color.prototype = {

  /**
    * @desc Register a new color model on this instance
    * @param {String} name The name of the color model
    * @param {Object} descriptor The property descriptor (see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Description)
  */
  register: function register(name, descriptor) {
    Object.defineProperty(this, name, descriptor);
  },

  /**
    * @desc Set a callback function that gets called whenever the selected color changes
    * @param {Function} callback The watch callback
    * @param {Boolean} callImmediately set to true if you want to call the callback as soon as it is added
  */
  watch: function watch(callback, callImmediately) {
    this._onChange = callback;
    if (callImmediately) this.forceUpdate();
  },

  /**
    * @desc Remove the watch callback
  */
  unwatch: function unwatch() {
    this.watch(false);
  },

  /**
    * @desc Force an update
  */
  forceUpdate: function forceUpdate() {
    var value = this._value;
    this._onChange(value, value, { h: true, s: true, v: true });
  },

  /**
    * @desc Set the color from a HSV value
    * @param {Object} newValue - HSV object
  */
  set: function set(newValue) {
    // Loop through the channels and check if any of them have changed
    var changes = {};
    var oldValue = this._value;
    for (var channel in oldValue) {
      if (!newValue.hasOwnProperty(channel)) newValue[channel] = oldValue[channel];
      changes[channel] = !(newValue[channel] == oldValue[channel]);
    }
    // Update the old value
    this._value = newValue;
    // If the value has changed, call hook callback
    var callback = this._onChange;
    if ((changes.h || changes.s || changes.v) && "function" == typeof callback) callback(newValue, oldValue, changes);
  },

  /**
    * @desc Get the HSV value
    * @return HSV object
  */
  get: function get() {
    return this._value;
  },

  /**
    * @desc Set the color from a CSS string
    * @param {String} str - HEX, rgb, or hsl color string
  */
  fromString: function fromString(str) {
    if (/^rgb/.test(str)) {
      this.rgbString = str;
    } else if (/^hsl/.test(str)) {
      this.hslString = str;
    } else if (/^#[0-9A-Fa-f]/.test(str)) {
      this.hexString = str;
    }
  }
};

module.exports = color;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _rgb = __webpack_require__(0);

var _rgb2 = _interopRequireDefault(_rgb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  name: "rgbString",

  fromHsv: function fromHsv(hsv) {
    var color = _rgb2.default.fromHsv(hsv);
    return "rgb" + (color.a ? "a" : "") + "(" + color.r + ", " + color.g + ", " + color.b + (color.a ? ", " + color.a : "") + ")";
  },

  toHsv: function toHsv(rgbString) {
    var parsed = rgbString.match(/(rgba?)\((\d+)(?:\D+?)(\d+)(?:\D+?)(\d+)(?:\D+?)?([0-9\.]+?)?\)/i);
    return _rgb2.default.toHsv({
      r: parseInt(parsed[2]),
      g: parseInt(parsed[3]),
      b: parseInt(parsed[4])
    });
  }
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _rgb = __webpack_require__(0);

var _rgb2 = _interopRequireDefault(_rgb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  name: "hexString",

  fromHsv: function fromHsv(hsv) {
    var color = _rgb2.default.fromHsv(hsv),
        r = color.r,
        g = color.g,
        b = color.b;
    // If each RGB channel's value is a multiple of 17, we can use HEX shorthand notation
    var useShorthand = r % 17 == 0 && g % 17 == 0 && b % 17 == 0,

    // If we're using shorthand notation, divide each channel by 17
    divider = useShorthand ? 17 : 1,

    // bitLength of each channel (for example, F is 4 bits long while FF is 8 bits long)
    bitLength = useShorthand ? 4 : 8,

    // Target length of the string (ie "#FFF" or "#FFFFFF")
    strLength = useShorthand ? 4 : 7,

    // Combine the channels together into a single integer
    int = r / divider << bitLength * 2 | g / divider << bitLength | b / divider,

    // Convert that integer to a hex string
    str = int.toString(16);
    // Add right amount of left-padding
    return "#" + new Array(strLength - str.length).join("0") + str;
  },

  toHsv: function toHsv(hex) {
    // Strip any "#" characters
    hex = hex.replace(/#/g, '');
    // Prefix the hex string with "0x" which indicates a number in hex notation, then convert to an integer
    var int = parseInt("0x" + hex),

    // If the length of the input is only 3, then it is a shorthand hex color
    isShorthand = hex.length == 3,

    // bitMask for isolating each channel
    bitMask = isShorthand ? 0xF : 0xFF,

    // bitLength of each channel (for example, F is 4 bits long while FF is 8 bits long)
    bitLength = isShorthand ? 4 : 8,

    // If we're using shorthand notation, multiply each channel by 17
    multiplier = isShorthand ? 17 : 1;

    return _rgb2.default.toHsv({
      r: (int >> bitLength * 2 & bitMask) * multiplier,
      g: (int >> bitLength & bitMask) * multiplier,
      b: (int & bitMask) * multiplier
    });
  }
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _dom = __webpack_require__(6);

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var doc = document;

/**
  @constructor stylesheet writer
  @param {Object} overrides - an object representing the CSS rules that this stylesheet updates
*/
var stylesheet = function stylesheet(overrides) {
  // Create a new style element
  var style = _dom2.default.create("style");
  // Webkit apparently requires a text node to be inserted into the style element
  // (according to https://davidwalsh.name/add-rules-stylesheets)
  _dom2.default.append(style, doc.createTextNode(""));
  // Add that stylesheet to the document <head></head>
  _dom2.default.append(doc.head, style);
  this.style = style;
  // Create a reference to the style element's CSSStyleSheet object
  // CSSStyleSheet API: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet
  var sheet = style.sheet;
  this.sheet = sheet;
  // Get a reference to the sheet's CSSRuleList object
  // CSSRuleList API: https://developer.mozilla.org/en-US/docs/Web/API/CSSRuleList
  this.rules = sheet.rules || sheet.cssRules;
  // We'll store references to all the CSSStyleDeclaration objects that we change here, keyed by the CSS selector they belong to
  // CSSStyleDeclaration API: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
  this.map = {};
};

stylesheet.prototype = {

  /**
    * @desc Turns the stylesheet "on", allowing the styles to be rendered
  */
  on: function on() {
    this.sheet.disabled = false;
  },

  /**
    * @desc Turns the stylesheet "off", preventing the styles from being rendered
  */
  off: function off() {
    this.sheet.disabled = true;
  },

  /**
    * @desc Set a specific rule for a given selector
    * @param {String} selector - the CSS selector for this rule (e.g. "body", ".class", "#id")
    * @param {String} property - the CSS property to set (e.g. "background-color", "font-family", "z-index")
    * @param {String} value    - the new value for the rule (e.g. "rgb(255, 255, 255)", "Helvetica", "99")
  */
  setRule: function setRule(selector, property, value) {
    var sheet = this.sheet;
    var rules = sheet.rules || sheet.cssRules;
    var map = this.map;
    // Convert property from camelCase to snake-case
    property = property.replace(/([A-Z])/g, function ($1) {
      return "-" + $1.toLowerCase();
    });
    if (!map.hasOwnProperty(selector)) {
      // If the selector hasn't been used yet we want to insert the rule at the end of the CSSRuleList, so we use its length as the index value
      var index = rules.length;
      // Prepare the rule declaration text, since both insertRule and addRule take this format
      var declaration = property + ": " + value;
      // Insert the new rule into the stylesheet
      try {
        // Some browsers only support insertRule, others only support addRule, so we have to use both
        sheet.insertRule(selector + " {" + declaration + ";}", index);
      } catch (e) {
        sheet.addRule(selector, declaration, index);
      } finally {
        // Because safari is perhaps the worst browser in all of history, we have to remind it to keep the sheet rules up-to-date
        rules = sheet.rules || sheet.cssRules;
        // Add our newly inserted rule's CSSStyleDeclaration object to the internal map
        map[selector] = rules[index].style;
      }
    } else {
      map[selector].setProperty(property, value);
    }
  },

  /**
    * @desc Get an object representing the current css styles
    * @return {Object} css object
  */
  getCss: function getCss() {
    var map = this.map;
    var ret = {};
    for (var selector in map) {
      var ruleSet = map[selector];
      ret[selector] = {};
      for (var i = 0; i < ruleSet.length; i++) {
        var property = ruleSet[i];
        ret[selector][property] = ruleSet.getPropertyValue(property);
      }
    }
    return ret;
  },

  /**
    * @desc Get the stylesheet text
    * @return {String} css text
  */
  getCssText: function getCssText() {
    var map = this.map;
    var ret = [];
    for (var selector in map) {
      ret.push(selector.replace(/,\W/g, ",\n") + " {\n\t" + map[selector].cssText.replace(/;\W/g, ";\n\t") + "\n}");
    }
    return ret.join("\n");
  }
};

module.exports = stylesheet;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */

(function sortableModule(factory) {
	"use strict";

	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module != "undefined" && typeof module.exports != "undefined") {
		module.exports = factory();
	} else {
		/* jshint sub:true */
		window["Sortable"] = factory();
	}
})(function sortableFactory() {
	"use strict";

	if (typeof window == "undefined" || !window.document) {
		return function sortableError() {
			throw new Error("Sortable.js requires a window with a document");
		};
	}

	var dragEl,
	    parentEl,
	    ghostEl,
	    cloneEl,
	    rootEl,
	    nextEl,
	    lastDownEl,
	    scrollEl,
	    scrollParentEl,
	    scrollCustomFn,
	    lastEl,
	    lastCSS,
	    lastParentCSS,
	    oldIndex,
	    newIndex,
	    activeGroup,
	    putSortable,
	    autoScroll = {},
	    tapEvt,
	    touchEvt,
	    moved,


	/** @const */
	R_SPACE = /\s+/g,
	    R_FLOAT = /left|right|inline/,
	    expando = 'Sortable' + new Date().getTime(),
	    win = window,
	    document = win.document,
	    parseInt = win.parseInt,
	    $ = win.jQuery || win.Zepto,
	    Polymer = win.Polymer,
	    captureMode = false,
	    supportDraggable = !!('draggable' in document.createElement('div')),
	    supportCssPointerEvents = function (el) {
		// false when IE11
		if (!!navigator.userAgent.match(/Trident.*rv[ :]?11\./)) {
			return false;
		}
		el = document.createElement('x');
		el.style.cssText = 'pointer-events:auto';
		return el.style.pointerEvents === 'auto';
	}(),
	    _silent = false,
	    abs = Math.abs,
	    min = Math.min,
	    savedInputChecked = [],
	    touchDragOverListeners = [],
	    _autoScroll = _throttle(function ( /**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl) {
		// Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
		if (rootEl && options.scroll) {
			var _this = rootEl[expando],
			    el,
			    rect,
			    sens = options.scrollSensitivity,
			    speed = options.scrollSpeed,
			    x = evt.clientX,
			    y = evt.clientY,
			    winWidth = window.innerWidth,
			    winHeight = window.innerHeight,
			    vx,
			    vy,
			    scrollOffsetX,
			    scrollOffsetY;

			// Delect scrollEl
			if (scrollParentEl !== rootEl) {
				scrollEl = options.scroll;
				scrollParentEl = rootEl;
				scrollCustomFn = options.scrollFn;

				if (scrollEl === true) {
					scrollEl = rootEl;

					do {
						if (scrollEl.offsetWidth < scrollEl.scrollWidth || scrollEl.offsetHeight < scrollEl.scrollHeight) {
							break;
						}
						/* jshint boss:true */
					} while (scrollEl = scrollEl.parentNode);
				}
			}

			if (scrollEl) {
				el = scrollEl;
				rect = scrollEl.getBoundingClientRect();
				vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
				vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
			}

			if (!(vx || vy)) {
				vx = (winWidth - x <= sens) - (x <= sens);
				vy = (winHeight - y <= sens) - (y <= sens);

				/* jshint expr:true */
				(vx || vy) && (el = win);
			}

			if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el) {
				autoScroll.el = el;
				autoScroll.vx = vx;
				autoScroll.vy = vy;

				clearInterval(autoScroll.pid);

				if (el) {
					autoScroll.pid = setInterval(function () {
						scrollOffsetY = vy ? vy * speed : 0;
						scrollOffsetX = vx ? vx * speed : 0;

						if ('function' === typeof scrollCustomFn) {
							return scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt);
						}

						if (el === win) {
							win.scrollTo(win.pageXOffset + scrollOffsetX, win.pageYOffset + scrollOffsetY);
						} else {
							el.scrollTop += scrollOffsetY;
							el.scrollLeft += scrollOffsetX;
						}
					}, 24);
				}
			}
		}
	}, 30),
	    _prepareGroup = function _prepareGroup(options) {
		function toFn(value, pull) {
			if (value === void 0 || value === true) {
				value = group.name;
			}

			if (typeof value === 'function') {
				return value;
			} else {
				return function (to, from) {
					var fromGroup = from.options.group.name;

					return pull ? value : value && (value.join ? value.indexOf(fromGroup) > -1 : fromGroup == value);
				};
			}
		}

		var group = {};
		var originalGroup = options.group;

		if (!originalGroup || (typeof originalGroup === "undefined" ? "undefined" : _typeof(originalGroup)) != 'object') {
			originalGroup = { name: originalGroup };
		}

		group.name = originalGroup.name;
		group.checkPull = toFn(originalGroup.pull, true);
		group.checkPut = toFn(originalGroup.put);
		group.revertClone = originalGroup.revertClone;

		options.group = group;
	};

	/**
  * @class  Sortable
  * @param  {HTMLElement}  el
  * @param  {Object}       [options]
  */
	function Sortable(el, options) {
		if (!(el && el.nodeType && el.nodeType === 1)) {
			throw 'Sortable: `el` must be HTMLElement, and not ' + {}.toString.call(el);
		}

		this.el = el; // root element
		this.options = options = _extend({}, options);

		// Export instance
		el[expando] = this;

		// Default options
		var defaults = {
			group: Math.random(),
			sort: true,
			disabled: false,
			store: null,
			handle: null,
			scroll: true,
			scrollSensitivity: 30,
			scrollSpeed: 10,
			draggable: /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
			ghostClass: 'sortable-ghost',
			chosenClass: 'sortable-chosen',
			dragClass: 'sortable-drag',
			ignore: 'a, img',
			filter: null,
			preventOnFilter: true,
			animation: 0,
			setData: function setData(dataTransfer, dragEl) {
				dataTransfer.setData('Text', dragEl.textContent);
			},
			dropBubble: false,
			dragoverBubble: false,
			dataIdAttr: 'data-id',
			delay: 0,
			forceFallback: false,
			fallbackClass: 'sortable-fallback',
			fallbackOnBody: false,
			fallbackTolerance: 0,
			fallbackOffset: { x: 0, y: 0 }
		};

		// Set default options
		for (var name in defaults) {
			!(name in options) && (options[name] = defaults[name]);
		}

		_prepareGroup(options);

		// Bind all private methods
		for (var fn in this) {
			if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
				this[fn] = this[fn].bind(this);
			}
		}

		// Setup drag mode
		this.nativeDraggable = options.forceFallback ? false : supportDraggable;

		// Bind events
		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);
		_on(el, 'pointerdown', this._onTapStart);

		if (this.nativeDraggable) {
			_on(el, 'dragover', this);
			_on(el, 'dragenter', this);
		}

		touchDragOverListeners.push(this._onDragOver);

		// Restore sorting
		options.store && this.sort(options.store.get(this));
	}

	Sortable.prototype = /** @lends Sortable.prototype */{
		constructor: Sortable,

		_onTapStart: function _onTapStart( /** Event|TouchEvent */evt) {
			var _this = this,
			    el = this.el,
			    options = this.options,
			    preventOnFilter = options.preventOnFilter,
			    type = evt.type,
			    touch = evt.touches && evt.touches[0],
			    target = (touch || evt).target,
			    originalTarget = evt.target.shadowRoot && evt.path && evt.path[0] || target,
			    filter = options.filter,
			    startIndex;

			_saveInputCheckedState(el);

			// Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.
			if (dragEl) {
				return;
			}

			if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
				return; // only left button or enabled
			}

			target = _closest(target, options.draggable, el);

			if (!target) {
				return;
			}

			if (lastDownEl === target) {
				// Ignoring duplicate `down`
				return;
			}

			// Get the index of the dragged element within its parent
			startIndex = _index(target, options.draggable);

			// Check filter
			if (typeof filter === 'function') {
				if (filter.call(this, evt, target, this)) {
					_dispatchEvent(_this, originalTarget, 'filter', target, el, startIndex);
					preventOnFilter && evt.preventDefault();
					return; // cancel dnd
				}
			} else if (filter) {
				filter = filter.split(',').some(function (criteria) {
					criteria = _closest(originalTarget, criteria.trim(), el);

					if (criteria) {
						_dispatchEvent(_this, criteria, 'filter', target, el, startIndex);
						return true;
					}
				});

				if (filter) {
					preventOnFilter && evt.preventDefault();
					return; // cancel dnd
				}
			}

			if (options.handle && !_closest(originalTarget, options.handle, el)) {
				return;
			}

			// Prepare `dragstart`
			this._prepareDragStart(evt, touch, target, startIndex);
		},

		_prepareDragStart: function _prepareDragStart( /** Event */evt, /** Touch */touch, /** HTMLElement */target, /** Number */startIndex) {
			var _this = this,
			    el = _this.el,
			    options = _this.options,
			    ownerDocument = el.ownerDocument,
			    dragStartFn;

			if (target && !dragEl && target.parentNode === el) {
				tapEvt = evt;

				rootEl = el;
				dragEl = target;
				parentEl = dragEl.parentNode;
				nextEl = dragEl.nextSibling;
				lastDownEl = target;
				activeGroup = options.group;
				oldIndex = startIndex;

				this._lastX = (touch || evt).clientX;
				this._lastY = (touch || evt).clientY;

				dragEl.style['will-change'] = 'transform';

				dragStartFn = function dragStartFn() {
					// Delayed drag has been triggered
					// we can re-enable the events: touchmove/mousemove
					_this._disableDelayedDrag();

					// Make the element draggable
					dragEl.draggable = _this.nativeDraggable;

					// Chosen item
					_toggleClass(dragEl, options.chosenClass, true);

					// Bind the events: dragstart/dragend
					_this._triggerDragStart(evt, touch);

					// Drag start event
					_dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, oldIndex);
				};

				// Disable "draggable"
				options.ignore.split(',').forEach(function (criteria) {
					_find(dragEl, criteria.trim(), _disableDraggable);
				});

				_on(ownerDocument, 'mouseup', _this._onDrop);
				_on(ownerDocument, 'touchend', _this._onDrop);
				_on(ownerDocument, 'touchcancel', _this._onDrop);
				_on(ownerDocument, 'pointercancel', _this._onDrop);
				_on(ownerDocument, 'selectstart', _this);

				if (options.delay) {
					// If the user moves the pointer or let go the click or touch
					// before the delay has been reached:
					// disable the delayed drag
					_on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchend', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
					_on(ownerDocument, 'mousemove', _this._disableDelayedDrag);
					_on(ownerDocument, 'touchmove', _this._disableDelayedDrag);
					_on(ownerDocument, 'pointermove', _this._disableDelayedDrag);

					_this._dragStartTimer = setTimeout(dragStartFn, options.delay);
				} else {
					dragStartFn();
				}
			}
		},

		_disableDelayedDrag: function _disableDelayedDrag() {
			var ownerDocument = this.el.ownerDocument;

			clearTimeout(this._dragStartTimer);
			_off(ownerDocument, 'mouseup', this._disableDelayedDrag);
			_off(ownerDocument, 'touchend', this._disableDelayedDrag);
			_off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
			_off(ownerDocument, 'mousemove', this._disableDelayedDrag);
			_off(ownerDocument, 'touchmove', this._disableDelayedDrag);
			_off(ownerDocument, 'pointermove', this._disableDelayedDrag);
		},

		_triggerDragStart: function _triggerDragStart( /** Event */evt, /** Touch */touch) {
			touch = touch || (evt.pointerType == 'touch' ? evt : null);

			if (touch) {
				// Touch device support
				tapEvt = {
					target: dragEl,
					clientX: touch.clientX,
					clientY: touch.clientY
				};

				this._onDragStart(tapEvt, 'touch');
			} else if (!this.nativeDraggable) {
				this._onDragStart(tapEvt, true);
			} else {
				_on(dragEl, 'dragend', this);
				_on(rootEl, 'dragstart', this._onDragStart);
			}

			try {
				if (document.selection) {
					// Timeout neccessary for IE9
					setTimeout(function () {
						document.selection.empty();
					});
				} else {
					window.getSelection().removeAllRanges();
				}
			} catch (err) {}
		},

		_dragStarted: function _dragStarted() {
			if (rootEl && dragEl) {
				var options = this.options;

				// Apply effect
				_toggleClass(dragEl, options.ghostClass, true);
				_toggleClass(dragEl, options.dragClass, false);

				Sortable.active = this;

				// Drag start event
				_dispatchEvent(this, rootEl, 'start', dragEl, rootEl, oldIndex);
			} else {
				this._nulling();
			}
		},

		_emulateDragOver: function _emulateDragOver() {
			if (touchEvt) {
				if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY) {
					return;
				}

				this._lastX = touchEvt.clientX;
				this._lastY = touchEvt.clientY;

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', 'none');
				}

				var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),
				    parent = target,
				    i = touchDragOverListeners.length;

				if (parent) {
					do {
						if (parent[expando]) {
							while (i--) {
								touchDragOverListeners[i]({
									clientX: touchEvt.clientX,
									clientY: touchEvt.clientY,
									target: target,
									rootEl: parent
								});
							}

							break;
						}

						target = parent; // store last element
					}
					/* jshint boss:true */
					while (parent = parent.parentNode);
				}

				if (!supportCssPointerEvents) {
					_css(ghostEl, 'display', '');
				}
			}
		},

		_onTouchMove: function _onTouchMove( /**TouchEvent*/evt) {
			if (tapEvt) {
				var options = this.options,
				    fallbackTolerance = options.fallbackTolerance,
				    fallbackOffset = options.fallbackOffset,
				    touch = evt.touches ? evt.touches[0] : evt,
				    dx = touch.clientX - tapEvt.clientX + fallbackOffset.x,
				    dy = touch.clientY - tapEvt.clientY + fallbackOffset.y,
				    translate3d = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';

				// only set the status to dragging, when we are actually dragging
				if (!Sortable.active) {
					if (fallbackTolerance && min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance) {
						return;
					}

					this._dragStarted();
				}

				// as well as creating the ghost element on the document body
				this._appendGhost();

				moved = true;
				touchEvt = touch;

				_css(ghostEl, 'webkitTransform', translate3d);
				_css(ghostEl, 'mozTransform', translate3d);
				_css(ghostEl, 'msTransform', translate3d);
				_css(ghostEl, 'transform', translate3d);

				evt.preventDefault();
			}
		},

		_appendGhost: function _appendGhost() {
			if (!ghostEl) {
				var rect = dragEl.getBoundingClientRect(),
				    css = _css(dragEl),
				    options = this.options,
				    ghostRect;

				ghostEl = dragEl.cloneNode(true);

				_toggleClass(ghostEl, options.ghostClass, false);
				_toggleClass(ghostEl, options.fallbackClass, true);
				_toggleClass(ghostEl, options.dragClass, true);

				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');
				_css(ghostEl, 'pointerEvents', 'none');

				options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);

				// Fixing dimensions.
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width * 2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height * 2 - ghostRect.height);
			}
		},

		_onDragStart: function _onDragStart( /**Event*/evt, /**boolean*/useFallback) {
			var dataTransfer = evt.dataTransfer,
			    options = this.options;

			this._offUpEvents();

			if (activeGroup.checkPull(this, this, dragEl, evt)) {
				cloneEl = _clone(dragEl);

				cloneEl.draggable = false;
				cloneEl.style['will-change'] = '';

				_css(cloneEl, 'display', 'none');
				_toggleClass(cloneEl, this.options.chosenClass, false);

				rootEl.insertBefore(cloneEl, dragEl);
				_dispatchEvent(this, rootEl, 'clone', dragEl);
			}

			_toggleClass(dragEl, options.dragClass, true);

			if (useFallback) {
				if (useFallback === 'touch') {
					// Bind touch events
					_on(document, 'touchmove', this._onTouchMove);
					_on(document, 'touchend', this._onDrop);
					_on(document, 'touchcancel', this._onDrop);
					_on(document, 'pointermove', this._onTouchMove);
					_on(document, 'pointerup', this._onDrop);
				} else {
					// Old brwoser
					_on(document, 'mousemove', this._onTouchMove);
					_on(document, 'mouseup', this._onDrop);
				}

				this._loopId = setInterval(this._emulateDragOver, 50);
			} else {
				if (dataTransfer) {
					dataTransfer.effectAllowed = 'move';
					options.setData && options.setData.call(this, dataTransfer, dragEl);
				}

				_on(document, 'drop', this);
				setTimeout(this._dragStarted, 0);
			}
		},

		_onDragOver: function _onDragOver( /**Event*/evt) {
			var el = this.el,
			    target,
			    dragRect,
			    targetRect,
			    revert,
			    options = this.options,
			    group = options.group,
			    activeSortable = Sortable.active,
			    isOwner = activeGroup === group,
			    isMovingBetweenSortable = false,
			    canSort = options.sort;

			if (evt.preventDefault !== void 0) {
				evt.preventDefault();
				!options.dragoverBubble && evt.stopPropagation();
			}

			if (dragEl.animated) {
				return;
			}

			moved = true;

			if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
			: putSortable === this || (activeSortable.lastPullMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt)) && (evt.rootEl === void 0 || evt.rootEl === this.el) // touch fallback
			) {
					// Smart auto-scrolling
					_autoScroll(evt, options, this.el);

					if (_silent) {
						return;
					}

					target = _closest(evt.target, options.draggable, el);
					dragRect = dragEl.getBoundingClientRect();

					if (putSortable !== this) {
						putSortable = this;
						isMovingBetweenSortable = true;
					}

					if (revert) {
						_cloneHide(activeSortable, true);
						parentEl = rootEl; // actualization

						if (cloneEl || nextEl) {
							rootEl.insertBefore(dragEl, cloneEl || nextEl);
						} else if (!canSort) {
							rootEl.appendChild(dragEl);
						}

						return;
					}

					if (el.children.length === 0 || el.children[0] === ghostEl || el === evt.target && _ghostIsLast(el, evt)) {
						//assign target only if condition is true
						if (el.children.length !== 0 && el.children[0] !== ghostEl && el === evt.target) {
							target = el.lastElementChild;
						}

						if (target) {
							if (target.animated) {
								return;
							}

							targetRect = target.getBoundingClientRect();
						}

						_cloneHide(activeSortable, isOwner);

						if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt) !== false) {
							if (!dragEl.contains(el)) {
								el.appendChild(dragEl);
								parentEl = el; // actualization
							}

							this._animate(dragRect, dragEl);
							target && this._animate(targetRect, target);
						}
					} else if (target && !target.animated && target !== dragEl && target.parentNode[expando] !== void 0) {
						if (lastEl !== target) {
							lastEl = target;
							lastCSS = _css(target);
							lastParentCSS = _css(target.parentNode);
						}

						targetRect = target.getBoundingClientRect();

						var width = targetRect.right - targetRect.left,
						    height = targetRect.bottom - targetRect.top,
						    floating = R_FLOAT.test(lastCSS.cssFloat + lastCSS.display) || lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0,
						    isWide = target.offsetWidth > dragEl.offsetWidth,
						    isLong = target.offsetHeight > dragEl.offsetHeight,
						    halfway = (floating ? (evt.clientX - targetRect.left) / width : (evt.clientY - targetRect.top) / height) > 0.5,
						    nextSibling = target.nextElementSibling,
						    after = false;

						if (floating) {
							var elTop = dragEl.offsetTop,
							    tgTop = target.offsetTop;

							if (elTop === tgTop) {
								after = target.previousElementSibling === dragEl && !isWide || halfway && isWide;
							} else if (target.previousElementSibling === dragEl || dragEl.previousElementSibling === target) {
								after = (evt.clientY - targetRect.top) / height > 0.5;
							} else {
								after = tgTop > elTop;
							}
						} else if (!isMovingBetweenSortable) {
							after = nextSibling !== dragEl && !isLong || halfway && isLong;
						}

						var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

						if (moveVector !== false) {
							if (moveVector === 1 || moveVector === -1) {
								after = moveVector === 1;
							}

							_silent = true;
							setTimeout(_unsilent, 30);

							_cloneHide(activeSortable, isOwner);

							if (!dragEl.contains(el)) {
								if (after && !nextSibling) {
									el.appendChild(dragEl);
								} else {
									target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
								}
							}

							parentEl = dragEl.parentNode; // actualization

							this._animate(dragRect, dragEl);
							this._animate(targetRect, target);
						}
					}
				}
		},

		_animate: function _animate(prevRect, target) {
			var ms = this.options.animation;

			if (ms) {
				var currentRect = target.getBoundingClientRect();

				if (prevRect.nodeType === 1) {
					prevRect = prevRect.getBoundingClientRect();
				}

				_css(target, 'transition', 'none');
				_css(target, 'transform', 'translate3d(' + (prevRect.left - currentRect.left) + 'px,' + (prevRect.top - currentRect.top) + 'px,0)');

				target.offsetWidth; // repaint

				_css(target, 'transition', 'all ' + ms + 'ms');
				_css(target, 'transform', 'translate3d(0,0,0)');

				clearTimeout(target.animated);
				target.animated = setTimeout(function () {
					_css(target, 'transition', '');
					_css(target, 'transform', '');
					target.animated = false;
				}, ms);
			}
		},

		_offUpEvents: function _offUpEvents() {
			var ownerDocument = this.el.ownerDocument;

			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'pointermove', this._onTouchMove);
			_off(ownerDocument, 'mouseup', this._onDrop);
			_off(ownerDocument, 'touchend', this._onDrop);
			_off(ownerDocument, 'pointerup', this._onDrop);
			_off(ownerDocument, 'touchcancel', this._onDrop);
			_off(ownerDocument, 'pointercancel', this._onDrop);
			_off(ownerDocument, 'selectstart', this);
		},

		_onDrop: function _onDrop( /**Event*/evt) {
			var el = this.el,
			    options = this.options;

			clearInterval(this._loopId);
			clearInterval(autoScroll.pid);
			clearTimeout(this._dragStartTimer);

			// Unbind events
			_off(document, 'mousemove', this._onTouchMove);

			if (this.nativeDraggable) {
				_off(document, 'drop', this);
				_off(el, 'dragstart', this._onDragStart);
			}

			this._offUpEvents();

			if (evt) {
				if (moved) {
					evt.preventDefault();
					!options.dropBubble && evt.stopPropagation();
				}

				ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

				if (rootEl === parentEl || Sortable.active.lastPullMode !== 'clone') {
					// Remove clone
					cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
				}

				if (dragEl) {
					if (this.nativeDraggable) {
						_off(dragEl, 'dragend', this);
					}

					_disableDraggable(dragEl);
					dragEl.style['will-change'] = '';

					// Remove class's
					_toggleClass(dragEl, this.options.ghostClass, false);
					_toggleClass(dragEl, this.options.chosenClass, false);

					// Drag stop event
					_dispatchEvent(this, rootEl, 'unchoose', dragEl, rootEl, oldIndex);

					if (rootEl !== parentEl) {
						newIndex = _index(dragEl, options.draggable);

						if (newIndex >= 0) {
							// Add event
							_dispatchEvent(null, parentEl, 'add', dragEl, rootEl, oldIndex, newIndex);

							// Remove event
							_dispatchEvent(this, rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);

							// drag from one list and drop into another
							_dispatchEvent(null, parentEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
						}
					} else {
						if (dragEl.nextSibling !== nextEl) {
							// Get the index of the dragged element within its parent
							newIndex = _index(dragEl, options.draggable);

							if (newIndex >= 0) {
								// drag & drop within the same list
								_dispatchEvent(this, rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);
								_dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
							}
						}
					}

					if (Sortable.active) {
						/* jshint eqnull:true */
						if (newIndex == null || newIndex === -1) {
							newIndex = oldIndex;
						}

						_dispatchEvent(this, rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);

						// Save sorting
						this.save();
					}
				}
			}

			this._nulling();
		},

		_nulling: function _nulling() {
			rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = scrollEl = scrollParentEl = tapEvt = touchEvt = moved = newIndex = lastEl = lastCSS = putSortable = activeGroup = Sortable.active = null;

			savedInputChecked.forEach(function (el) {
				el.checked = true;
			});
			savedInputChecked.length = 0;
		},

		handleEvent: function handleEvent( /**Event*/evt) {
			switch (evt.type) {
				case 'drop':
				case 'dragend':
					this._onDrop(evt);
					break;

				case 'dragover':
				case 'dragenter':
					if (dragEl) {
						this._onDragOver(evt);
						_globalDragOver(evt);
					}
					break;

				case 'selectstart':
					evt.preventDefault();
					break;
			}
		},

		/**
   * Serializes the item into an array of string.
   * @returns {String[]}
   */
		toArray: function toArray() {
			var order = [],
			    el,
			    children = this.el.children,
			    i = 0,
			    n = children.length,
			    options = this.options;

			for (; i < n; i++) {
				el = children[i];
				if (_closest(el, options.draggable, this.el)) {
					order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
				}
			}

			return order;
		},

		/**
   * Sorts the elements according to the array.
   * @param  {String[]}  order  order of the items
   */
		sort: function sort(order) {
			var items = {},
			    rootEl = this.el;

			this.toArray().forEach(function (id, i) {
				var el = rootEl.children[i];

				if (_closest(el, this.options.draggable, rootEl)) {
					items[id] = el;
				}
			}, this);

			order.forEach(function (id) {
				if (items[id]) {
					rootEl.removeChild(items[id]);
					rootEl.appendChild(items[id]);
				}
			});
		},

		/**
   * Save the current sorting
   */
		save: function save() {
			var store = this.options.store;
			store && store.set(this);
		},

		/**
   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
   * @param   {HTMLElement}  el
   * @param   {String}       [selector]  default: `options.draggable`
   * @returns {HTMLElement|null}
   */
		closest: function closest(el, selector) {
			return _closest(el, selector || this.options.draggable, this.el);
		},

		/**
   * Set/get option
   * @param   {string} name
   * @param   {*}      [value]
   * @returns {*}
   */
		option: function option(name, value) {
			var options = this.options;

			if (value === void 0) {
				return options[name];
			} else {
				options[name] = value;

				if (name === 'group') {
					_prepareGroup(options);
				}
			}
		},

		/**
   * Destroy
   */
		destroy: function destroy() {
			var el = this.el;

			el[expando] = null;

			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);
			_off(el, 'pointerdown', this._onTapStart);

			if (this.nativeDraggable) {
				_off(el, 'dragover', this);
				_off(el, 'dragenter', this);
			}

			// Remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = el = null;
		}
	};

	function _cloneHide(sortable, state) {
		if (sortable.lastPullMode !== 'clone') {
			state = true;
		}

		if (cloneEl && cloneEl.state !== state) {
			_css(cloneEl, 'display', state ? 'none' : '');

			if (!state) {
				if (cloneEl.state) {
					if (sortable.options.group.revertClone) {
						rootEl.insertBefore(cloneEl, nextEl);
						sortable._animate(dragEl, cloneEl);
					} else {
						rootEl.insertBefore(cloneEl, dragEl);
					}
				}
			}

			cloneEl.state = state;
		}
	}

	function _closest( /**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx) {
		if (el) {
			ctx = ctx || document;

			do {
				if (selector === '>*' && el.parentNode === ctx || _matches(el, selector)) {
					return el;
				}
				/* jshint boss:true */
			} while (el = _getParentOrHost(el));
		}

		return null;
	}

	function _getParentOrHost(el) {
		var parent = el.host;

		return parent && parent.nodeType ? parent : el.parentNode;
	}

	function _globalDragOver( /**Event*/evt) {
		if (evt.dataTransfer) {
			evt.dataTransfer.dropEffect = 'move';
		}
		evt.preventDefault();
	}

	function _on(el, event, fn) {
		el.addEventListener(event, fn, captureMode);
	}

	function _off(el, event, fn) {
		el.removeEventListener(event, fn, captureMode);
	}

	function _toggleClass(el, name, state) {
		if (el) {
			if (el.classList) {
				el.classList[state ? 'add' : 'remove'](name);
			} else {
				var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
				el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
			}
		}
	}

	function _css(el, prop, val) {
		var style = el && el.style;

		if (style) {
			if (val === void 0) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					val = document.defaultView.getComputedStyle(el, '');
				} else if (el.currentStyle) {
					val = el.currentStyle;
				}

				return prop === void 0 ? val : val[prop];
			} else {
				if (!(prop in style)) {
					prop = '-webkit-' + prop;
				}

				style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}

	function _find(ctx, tagName, iterator) {
		if (ctx) {
			var list = ctx.getElementsByTagName(tagName),
			    i = 0,
			    n = list.length;

			if (iterator) {
				for (; i < n; i++) {
					iterator(list[i], i);
				}
			}

			return list;
		}

		return [];
	}

	function _dispatchEvent(sortable, rootEl, name, targetEl, fromEl, startIndex, newIndex) {
		sortable = sortable || rootEl[expando];

		var evt = document.createEvent('Event'),
		    options = sortable.options,
		    onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1);

		evt.initEvent(name, true, true);

		evt.to = rootEl;
		evt.from = fromEl || rootEl;
		evt.item = targetEl || rootEl;
		evt.clone = cloneEl;

		evt.oldIndex = startIndex;
		evt.newIndex = newIndex;

		rootEl.dispatchEvent(evt);

		if (options[onName]) {
			options[onName].call(sortable, evt);
		}
	}

	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt, willInsertAfter) {
		var evt,
		    sortable = fromEl[expando],
		    onMoveFn = sortable.options.onMove,
		    retVal;

		evt = document.createEvent('Event');
		evt.initEvent('move', true, true);

		evt.to = toEl;
		evt.from = fromEl;
		evt.dragged = dragEl;
		evt.draggedRect = dragRect;
		evt.related = targetEl || toEl;
		evt.relatedRect = targetRect || toEl.getBoundingClientRect();
		evt.willInsertAfter = willInsertAfter;

		fromEl.dispatchEvent(evt);

		if (onMoveFn) {
			retVal = onMoveFn.call(sortable, evt, originalEvt);
		}

		return retVal;
	}

	function _disableDraggable(el) {
		el.draggable = false;
	}

	function _unsilent() {
		_silent = false;
	}

	/** @returns {HTMLElement|false} */
	function _ghostIsLast(el, evt) {
		var lastEl = el.lastElementChild,
		    rect = lastEl.getBoundingClientRect();

		// 5 — min delta
		// abs — нельзя добавлять, а то глюки при наведении сверху
		return evt.clientY - (rect.top + rect.height) > 5 || evt.clientX - (rect.left + rect.width) > 5;
	}

	/**
  * Generate id
  * @param   {HTMLElement} el
  * @returns {String}
  * @private
  */
	function _generateId(el) {
		var str = el.tagName + el.className + el.src + el.href + el.textContent,
		    i = str.length,
		    sum = 0;

		while (i--) {
			sum += str.charCodeAt(i);
		}

		return sum.toString(36);
	}

	/**
  * Returns the index of an element within its parent for a selected set of
  * elements
  * @param  {HTMLElement} el
  * @param  {selector} selector
  * @return {number}
  */
	function _index(el, selector) {
		var index = 0;

		if (!el || !el.parentNode) {
			return -1;
		}

		while (el && (el = el.previousElementSibling)) {
			if (el.nodeName.toUpperCase() !== 'TEMPLATE' && (selector === '>*' || _matches(el, selector))) {
				index++;
			}
		}

		return index;
	}

	function _matches( /**HTMLElement*/el, /**String*/selector) {
		if (el) {
			selector = selector.split('.');

			var tag = selector.shift().toUpperCase(),
			    re = new RegExp('\\s(' + selector.join('|') + ')(?=\\s)', 'g');

			return (tag === '' || el.nodeName.toUpperCase() == tag) && (!selector.length || ((' ' + el.className + ' ').match(re) || []).length == selector.length);
		}

		return false;
	}

	function _throttle(callback, ms) {
		var args, _this;

		return function () {
			if (args === void 0) {
				args = arguments;
				_this = this;

				setTimeout(function () {
					if (args.length === 1) {
						callback.call(_this, args[0]);
					} else {
						callback.apply(_this, args);
					}

					args = void 0;
				}, ms);
			}
		};
	}

	function _extend(dst, src) {
		if (dst && src) {
			for (var key in src) {
				if (src.hasOwnProperty(key)) {
					dst[key] = src[key];
				}
			}
		}

		return dst;
	}

	function _clone(el) {
		return $ ? $(el).clone(true)[0] : Polymer && Polymer.dom ? Polymer.dom(el).cloneNode(true) : el.cloneNode(true);
	}

	function _saveInputCheckedState(root) {
		var inputs = root.getElementsByTagName('input');
		var idx = inputs.length;

		while (idx--) {
			var el = inputs[idx];
			el.checked && savedInputChecked.push(el);
		}
	}

	// Fixed #973: 
	_on(document, 'touchmove', function (evt) {
		if (Sortable.active) {
			evt.preventDefault();
		}
	});

	try {
		window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
			get: function get() {
				captureMode = {
					capture: false,
					passive: false
				};
			}
		}));
	} catch (err) {}

	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		is: function is(el, selector) {
			return !!_closest(el, selector, el);
		},
		extend: _extend,
		throttle: _throttle,
		closest: _closest,
		toggleClass: _toggleClass,
		clone: _clone,
		index: _index
	};

	/**
  * Create sortable instance
  * @param {HTMLElement}  el
  * @param {Object}      [options]
  */
	Sortable.create = function (el, options) {
		return new Sortable(el, options);
	};

	// Export
	Sortable.version = '1.6.1';
	return Sortable;
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(1);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(18)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(1, function() {
			var newContent = __webpack_require__(1);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(19);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _canvas = __webpack_require__(21);

var _canvas2 = _interopRequireDefault(_canvas);

var _canvas3 = __webpack_require__(22);

var _canvas4 = _interopRequireDefault(_canvas3);

var _layer = __webpack_require__(23);

var _layer2 = _interopRequireDefault(_layer);

var _layer3 = __webpack_require__(24);

var _layer4 = _interopRequireDefault(_layer3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VERSION = '0.2.1';
var MIN_BRUSH_SIZE = 1;
var MAX_BRUSH_SIZE = 31;
var DEFAULT_BRUSH_SIZE = 1;

var DEFAULT_BACKGROUND_COLOR = [1, 1, 1];
var DEFAULT_LAYER_COLOR = [0, 0, 0];

var SimpleOekakiCanvas = function () {
  _createClass(SimpleOekakiCanvas, null, [{
    key: 'VERSION',

    // Constants
    get: function get() {
      return VERSION;
    }
  }, {
    key: 'MIN_BRUSH_SIZE',
    get: function get() {
      return MIN_BRUSH_SIZE;
    }
  }, {
    key: 'MAX_BRUSH_SIZE',
    get: function get() {
      return MAX_BRUSH_SIZE;
    }
  }, {
    key: 'DEFAULT_BRUSH_SIZE',
    get: function get() {
      return DEFAULT_BRUSH_SIZE;
    }
  }, {
    key: 'DEFAULT_BACKGROUND_COLOR',
    get: function get() {
      return DEFAULT_BACKGROUND_COLOR;
    }
  }, {
    key: 'DEFAULT_LAYER_COLOR',
    get: function get() {
      return DEFAULT_LAYER_COLOR;
    }
  }]);

  function SimpleOekakiCanvas(div) {
    _classCallCheck(this, SimpleOekakiCanvas);

    // Drawing state
    this._diameter = DEFAULT_BRUSH_SIZE;
    this._backgroundColor = DEFAULT_BACKGROUND_COLOR;
    this._currentLayer = 2;
    this._layerOrder = [0, 1, 2];
    this._layerColors = [DEFAULT_LAYER_COLOR, DEFAULT_LAYER_COLOR, DEFAULT_LAYER_COLOR];
    this._layerVisibility = [1, 1, 1];

    this._canvas = document.createElement('canvas');
    this._canvas.height = 800;
    this._canvas.width = 800;

    div.appendChild(this._canvas);

    // Initialize the GL context
    this._initializeGL();
    if (!this._gl) {
      throw new Error('could not create webgl context');
    }
    this._setInputCallbacks();
  }

  _createClass(SimpleOekakiCanvas, [{
    key: 'getLayerColor',
    value: function getLayerColor(id) {
      return this._layerColors[id];
    }
  }, {
    key: 'setLayerColor',
    value: function setLayerColor(id, colors) {
      this._layerColors[id] = colors;
      if (this._onLayerColorChange) this._onLayerColorChange(id, colors);
    }
  }, {
    key: 'paintLine',
    value: function paintLine(x0, y0, x1, y1) {
      this._gl.useProgram(this._layerShaderProgram);
      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._canvasFBO);
      this._gl.uniform4f(this._fragmentLineUniform, Math.round(x0) + 0.5, 800 - Math.round(y0) + 0.5, Math.round(x1) + 0.5, 800 - Math.round(y1) + 0.5);
      this._gl.uniform1f(this._fragmentSizeUniform, this._diameter);
      this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
    }
  }, {
    key: 'paintGL',
    value: function paintGL() {
      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
      this._gl.useProgram(this._canvasShaderProgram);
      this._gl.clearColor(this._backgroundColor[0], this._backgroundColor[1], this._backgroundColor[2], 1.0);
      this._gl.clear(this._gl.COLOR_BUFFER_BIT);
      this._gl.uniform3fv(this._fragmentBackgroundColorUniform, this._backgroundColor);
      this._gl.uniform3iv(this._fragmentLayerOrderUniform, this._layerOrder);
      this._gl.uniform3fv(this._fragmentLayerVisibilityUniform, this._layerVisibility);
      this._gl.uniformMatrix3fv(this._fragmentLayerColorsUniform, false, this._layerColors[0].concat(this._layerColors[1], this._layerColors[2]));
      this._gl.drawArrays(this._gl.TRIANGLE_STRIP, 0, 4);
    }
  }, {
    key: '_getShader',
    value: function _getShader(str, type) {
      var shader = this._gl.createShader(type);
      this._gl.shaderSource(shader, str);
      this._gl.compileShader(shader);
      if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
        console.log('JS:Shader compile failed');
        console.log(this._gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }
  }, {
    key: '_initBuffers',
    value: function _initBuffers() {
      var canvasBuffer = this._gl.createBuffer();
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, canvasBuffer);
      this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), this._gl.STATIC_DRAW);
      this._gl.vertexAttribPointer(this._vertexPositionAttribute2, 2, this._gl.FLOAT, false, 0, 0);
      this._gl.vertexAttribPointer(this._vertexPositionAttribute, 2, this._gl.FLOAT, false, 0, 0);

      this._canvasFBO = this._gl.createFramebuffer();
      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._canvasFBO);
      this._canvasFBO.width = this._canvas.width;
      this._canvasFBO.height = this._canvas.height;

      this._canvasTexture = this._gl.createTexture();
      this._gl.bindTexture(this._gl.TEXTURE_2D, this._canvasTexture);
      this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);
      this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
      this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
      this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
      this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._canvasFBO.width, this._canvasFBO.height, 0, this._gl.RGBA, this._gl.UNSIGNED_BYTE, null);
      this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, this._gl.COLOR_ATTACHMENT0, this._gl.TEXTURE_2D, this._canvasTexture, 0);

      this._gl.clearColor(0, 0, 0, 1);
      this._gl.clear(this._gl.COLOR_BUFFER_BIT);

      this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
    }
  }, {
    key: '_initShaderProgram',
    value: function _initShaderProgram(fsh, vsh) {
      var vertexShader = this._getShader(vsh, this._gl.VERTEX_SHADER);
      var fragmentShader = this._getShader(fsh, this._gl.FRAGMENT_SHADER);
      var shaderProgram = this._gl.createProgram();
      this._gl.attachShader(shaderProgram, vertexShader);
      this._gl.attachShader(shaderProgram, fragmentShader);
      this._gl.linkProgram(shaderProgram);
      if (!this._gl.getProgramParameter(shaderProgram, this._gl.LINK_STATUS)) {
        console.log('Could not initialise shaders');
        console.log(this._gl.getProgramInfoLog(shaderProgram));
      }
      this._gl.useProgram(shaderProgram);
      var VertexPositionAttribute = this._gl.getAttribLocation(shaderProgram, 'position');
      this._gl.enableVertexAttribArray(VertexPositionAttribute);
      return shaderProgram;
    }
  }, {
    key: '_initShaders',
    value: function _initShaders() {
      this._canvasShaderProgram = this._initShaderProgram(_canvas4.default, _canvas2.default);
      this._fragmentBackgroundColorUniform = this._gl.getUniformLocation(this._canvasShaderProgram, 'backgroundColor');
      this._fragmentLayerOrderUniform = this._gl.getUniformLocation(this._canvasShaderProgram, 'layerOrder');
      this._fragmentLayerColorsUniform = this._gl.getUniformLocation(this._canvasShaderProgram, 'layerColors');
      this._fragmentLayerVisibilityUniform = this._gl.getUniformLocation(this._canvasShaderProgram, 'layerVisibility');

      this._layerShaderProgram = this._initShaderProgram(_layer4.default, _layer2.default);
      this._fragmentLineUniform = this._gl.getUniformLocation(this._layerShaderProgram, 'line');
      this._fragmentSizeUniform = this._gl.getUniformLocation(this._layerShaderProgram, 'size');
    }
  }, {
    key: '_setInputCallbacks',
    value: function _setInputCallbacks() {
      var _this = this;

      var isDown = void 0;
      var currentMousePos = void 0;
      var getMouse = function getMouse(e) {
        var bbox = _this._canvas.getBoundingClientRect();
        var mx = e.clientX - bbox.left * (_this._canvas.width / bbox.width);
        var my = e.clientY - bbox.top * (_this._canvas.height / bbox.height);
        return { x: mx, y: my };
      };

      this._canvas.addEventListener('mousedown', function (startEvent) {
        currentMousePos = getMouse(startEvent);
        _this.paintLine(currentMousePos.x, currentMousePos.y, currentMousePos.x, currentMousePos.y);
        isDown = true;
      });

      document.addEventListener('mouseup', function () {
        isDown = false;
      });
      document.addEventListener('mousemove', function (moveEvent) {
        if (!isDown) return;
        var nextPos = getMouse(moveEvent);
        _this.paintLine(currentMousePos.x, currentMousePos.y, nextPos.x, nextPos.y);
        currentMousePos = nextPos;
        moveEvent.preventDefault();
      });

      this._canvas.addEventListener('touchstart', function (startEvent) {
        currentMousePos = getMouse(startEvent.targetTouches[0]);
        _this.paintLine(currentMousePos.x, currentMousePos.y, currentMousePos.x, currentMousePos.y);
        isDown = true;
      });
      document.addEventListener('touchend', function () {
        isDown = false;
      });
      this._canvas.addEventListener('touchmove', function (moveEvent) {
        if (!isDown) return;
        moveEvent.preventDefault();

        var nextPos = getMouse(moveEvent.targetTouches[0]);

        _this.paintLine(currentMousePos.x, currentMousePos.y, nextPos.x, nextPos.y);
        currentMousePos = nextPos;
        moveEvent.stopPropagation();
        moveEvent.cancelBubble = true;
      });
    }
  }, {
    key: '_initializeGL',
    value: function _initializeGL() {
      this._gl = this._canvas.getContext('webgl') || this._canvas.getContext('experimental-webgl');
      this._gl.clearColor(0.0, 0.0, 0.0, 1.0);

      this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);

      // Initialize the shader program
      this._initShaders();
      this._initBuffers();
      var self = this;
      setInterval(function () {
        self.paintGL();
      }, 15);
    }
  }, {
    key: 'backgroundColor',
    get: function get() {
      return this._backgroundColor;
    },
    set: function set(colorArray) {
      this._backgroundColor = colorArray;
      console.log('backgroundColor set:', this.backgroundColor);
    }
  }, {
    key: 'currentLayer',
    get: function get() {
      return this._currentLayer;
    },
    set: function set(id) {
      if (id === this._currentLayer) return;
      if (id >= 0 && id < 3) {
        this._currentLayer = id;
        if (this._onCurrentLayerChange) this._onCurrentLayerChange(id);
      }
    }
  }, {
    key: 'brushSize',
    get: function get() {
      return this._diameter;
    },
    set: function set(size) {
      if (size === this._diameter) return;
      this._diameter = size;
      if (this._diameter < MIN_BRUSH_SIZE) {
        this._diameter = MIN_BRUSH_SIZE;
      }
      if (this._diameter > MAX_BRUSH_SIZE) {
        this._diameter = MAX_BRUSH_SIZE;
      }
      console.log('brush size changed to', this._diameter);
      if (this._onBrushSizeChange) this._onBrushSizeChange(this._diameter);
    }
  }]);

  return SimpleOekakiCanvas;
}();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleOekakiCanvas;
}

if (window) {
  window.SimpleOekakiCanvas = SimpleOekakiCanvas;
}

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 position;\nvarying vec2 Texcoord;\nvoid main(void) {\n  Texcoord = (position+1.0) / 2.0;\n  gl_Position = vec4(position, 0.0, 1.0);\n}"

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\n\nvarying vec2 Texcoord;\nuniform vec3 backgroundColor;\nuniform sampler2D imageTex;\n\nuniform ivec3 layerOrder;\nuniform vec3 layerVisibility;\nuniform mat3 layerColors;\n\nvoid main(void){\n  vec4 texColor = texture2D(imageTex,Texcoord);\n\n  vec3 outputColor = backgroundColor;\n\n  for(int i = 0; i < 3; i++){\n    int currentLayer = layerOrder[i];\n\n  if(currentLayer == 0){\n      vec3 currentColor = layerColors[0];\n      float currentSet = texColor[0];\n      currentSet = currentSet * layerVisibility[0];\n      outputColor = currentSet * currentColor + outputColor * (1.0-currentSet); \n    } else if(currentLayer == 1){\n      vec3 currentColor = layerColors[1];\n      float currentSet = texColor[1];\n      currentSet = currentSet * layerVisibility[1];\n      outputColor = currentSet * currentColor + outputColor * (1.0-currentSet);\n    } else {\n      vec3 currentColor = layerColors[2];\n      float currentSet = texColor[2];\n      currentSet = currentSet * layerVisibility[2];\n      outputColor = currentSet * currentColor + outputColor * (1.0-currentSet);\n    }\n  }\n  gl_FragColor = vec4(outputColor,1.0);\n}"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "attribute vec2 position;\nvoid main(void) {\n  gl_Position = vec4(position, 0.0, 1.0);\n}"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\n\nuniform vec4 line;\nuniform float size;\n\nvoid main(void){\n  float x = gl_FragCoord.x;\n  float y = gl_FragCoord.y;\n  \n  float x1 = line[0];\n  float y1 = line[1];\n  float x2 = line[2];\n  float y2 = line[3];\n\n  float A = x - x1;\n  float B = y - y1;\n  float C = x2 - x1;\n  float D = y2 - y1;\n  \n  float dot = A * C + B * D;\n  float len_sq = C * C + D * D;\n  float param = -1.0;\n  if (len_sq != 0.0) //in case of 0 length line\n      param = dot / len_sq;\n  \n  float xx, yy;\n  \n  if (param < 0.0){\n    xx = x1;\n    yy = y1;\n  } else if(param > 1.0){\n    xx = x2;\n    yy = y2;\n  } else if(abs(C) > abs(D)){\n    xx = floor(x1 + param * C) + 0.5;\n    yy = floor(y1 + (xx - x1) / C * D) + 0.5;\n  }else{\n    yy = floor(y1 + param * D) + 0.5;\n    xx = floor(x1 + (yy - y1) / D * C) +0.5;\n  }\n  float d = distance(vec2(x,y),vec2(xx,yy));\n\n  if(d > size/2.0) discard;\n\n  gl_FragColor = vec4(1.0,1.0,1.0,1.0);\n}"

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DECtoHEX = function DECtoHEX(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};

var HTMLtoRGB = function HTMLtoRGB(htmlcolor) {
  return htmlcolor.match(/[A-Za-z0-9]{2}/g).map(function (v) {
    return parseInt(v, 16) / 255;
  });
};

var RGBtoHTML = function RGBtoHTML(rgbcolor) {
  return "#" + DECtoHEX(rgbcolor[0] * 255) + DECtoHEX(rgbcolor[1] * 255) + DECtoHEX(rgbcolor[2] * 255);
};

module.exports = {
  DECtoHEX: DECtoHEX,
  HTMLtoRGB: HTMLtoRGB,
  RGBtoHTML: RGBtoHTML
};

/***/ })
/******/ ]);
//# sourceMappingURL=SimpleOekaki.js.map