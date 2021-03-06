﻿g.Character = function (name, accessKey) {
    return new g.ModulesPage(name, accessKey, g.services.componetService.characterComponentFactories, ["wanderer-core-modules", "wanderer-core-save"], true);
};

g.StartPageController = function (accessKey) {
    return new g.ModulesPage("Start", accessKey, g.services.componetService.startComponentFactories, ["wanderer-core-modules", "core-start-add-character", "core-start-recent-characters", "core-start-switch-account"], false);
};

g.ModulesPage = function (name, accessKey, componentFactories, startingComponents, autosave) {
    var that = this;

    var comboKey = function (id, key) {
        return id + "_" + key;
    };
    var versionComboKey = function (id, key) {
        return "Version_" + id + "_" + key;
    };
    var comFactory = function (getSaveJson, id, version) {
        return {
            read: function (key) {
                return getSaveJson()[key];
            },
            canRead: function (key) {
                return getSaveJson() !== undefined && getSaveJson()[key] !== undefined;
            },
            write: function (key, value) {
                if (getSaveJson() !== undefined) {
                    getSaveJson()[key] = value;
                }
            },
            lastVersion: function () {
                if (getSaveJson() === undefined) {
                    return -1;
                }
                if (getSaveJson()[g.constants.META] === undefined) {
                    return -1;
                }
                if (getSaveJson()[g.constants.META][g.constants.VERSION] === undefined) {
                    return -1;
                }
                return getSaveJson()[g.constants.META][g.constants.VERSION];
            },
            readNotCharacter: function (key) {
                return window.localStorage.getItem(comboKey(id, key));
            },
            readNotCharacterVersion: function (key) {
                return window.localStorage.getItem(versionComboKey(id, key));
            },
            canReadNotCharacter: function (key) {
                return window.localStorage.getItem(comboKey(id, key)) !== undefined;
            }, writeNotCharacter: function (key, value) {
                window.localStorage.setItem(comboKey(id, key), value);
                window.localStorage.setItem(versionComboKey(id, key), version);
            }
        };
    };


    var logFactory = function () {
        var TypeEnum = {
            VERBOSE: 1,
            DEBUG: 2,
            INFO: 3,
            WARN: 4,
            ERROR: 5,
            WTF: 6
        };

        var displayTypeMap = {};
        displayTypeMap[TypeEnum.VERBOSE] = "Verbose";
        displayTypeMap[TypeEnum.DEBUG] = "Debug";
        displayTypeMap[TypeEnum.INFO] = "Info";
        displayTypeMap[TypeEnum.WARN] = "Warn";
        displayTypeMap[TypeEnum.ERROR] = "Error";
        displayTypeMap[TypeEnum.WTF] = "WTF";

        var logTimeout = 1000 * 20;
        var logLevel = TypeEnum.VERBOSE;

        return {
            logs: [],
            displayLogs: function () {
                var now = new Date().getTime();
                var res = [];
                this.logs.forEach(function (log) {
                    if (log.type > logLevel && now - logTimeout < log.timeStamp && !log.closed) {
                        res.push(log);
                    }
                });
                return res;
            },
            
            logWithAction: function (message, type, title, callBack) {
                this.logs.push({
                    action: {
                        title: title,
                        callBack: callBack    
                    },
                    message: message,
                    type: type,
                    displayType: displayTypeMap[type],
                    closed: false,
                    timeStamp: new Date().getTime()
                });
            },
            debugWithAction: function (message, title, callBack) {
                this.logWithAction(message, TypeEnum.DEBUG, title, callBack);
            },
            infoWithAction: function (message, title, callBack) {
                this.logWithAction(message, TypeEnum.INFO, title, callBack);
            },
            warnWithAction: function (message, title, callBack) {
                this.logWithAction(message, TypeEnum.WARN,  title, callBack);
            },
            errorWithAction: function (message, title, callBack) {
                this.logWithAction(message, TypeEnum.ERROR, title, callBack);
            },
            wtfWithAction: function (message, title, callBack) {
                this.logWithAction(message, TypeEnum.WTF, title, callBack);
            },
             
            log: function (message, type) {
                this.logs.push({
                    message: message,
                    type: type,
                    displayType: displayTypeMap[type],
                    closed: false,
                    timeStamp: new Date().getTime()
                });
            },
            debug: function (message) {
                this.log(message, TypeEnum.DEBUG);
            },
            info: function (message) {
                this.log(message, TypeEnum.INFO);
            },
            warn: function (message) {
                this.log(message, TypeEnum.WARN);
            },
            error: function (message) {
                this.log(message, TypeEnum.ERROR);
            },
            wtf: function (message) {
                this.log(message, TypeEnum.WTF);
            }
        };
    };
    this.displayName = function () {
        var name = that.getName();
        if (name === null || name === undefined || name === "") {
            return "untilted";
        } else {
            return name;
        }
    };

    var modList = [];

    componentFactories.forEach(function (item) {
        var tem = new item();
        tem.injected = {};
        modList.push(tem);
    });

    this.exposedPage = new g.ExposedPage(modList, startingComponents, name, accessKey, autosave);

    this.load = function (json) {
        that.exposedPage.name = json["name"];
        that.exposedPage.accessKey = json["id"];
        that.exposedPage.updateLastLoaded(json["json"]);
        that.exposedPage.getComponents().forEach(function (item) {
            item.injected.json = json["json"][item.getId()];
            if (item.OnLoad !== undefined) {
                try {
                    item.OnLoad();
                } catch (e) {
                    console.log("error:" + e);
                }
            }
        });
    };

    modList.forEach(function (item) {
        var myLogger = logFactory();

        // we inject module related info that the modules don't need to know about 
        item.injected = {
            logger: myLogger,
            json:{}
        };

        if (item.OnStart !== undefined) {

            var communicator = comFactory(function () { return item.injected.json; }, item.getId(), item.getPublic().getVersion());

            var dependencies = [];
            if (item.getRequires !== undefined) {
                var lookingFors = item.getRequires();
                for (var i = 0; i < lookingFors.length; i++) {
                    var pimary = that.exposedPage.getComponent(lookingFors[i]);
                    if (pimary !== null) {
                        dependencies.push(that.exposedPage.getComponent(lookingFors[i]));
                    } else {
                        throw { message: "component: " + lookingFors[i] };
                        // is this an error case?
                    }
                }
            }


            // we start.
            item.OnStart(communicator, myLogger, that.exposedPage, dependencies);
        }
    });


    this.getName = function () {
        return that.exposedPage.name;
    };
    this.modules = function () {
        return that.exposedPage.getActiveComponents();
    };
    this.Remove = function (module) {
        that.exposedPage.toggle(module);
    };
};