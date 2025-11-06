"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnityResponderView = exports.Unity = void 0;
const react_native_1 = require("react-native");
const event_target_shim_1 = require("event-target-shim");
const { RNUnity } = react_native_1.NativeModules;
const RNUnityEventEmitter = new react_native_1.NativeEventEmitter(RNUnity);
class UnityManager extends event_target_shim_1.EventTarget {
    handshake = null;
    handshakeResolved = false;
    commandsMap = {};
    commandsIdIterator = 0;
    constructor() {
        super();
    }
    init() {
        RNUnity.initialize();
        RNUnityEventEmitter.addListener('UnityMessage', this.handleMessage.bind(this));
        if (this.handshake === null) {
            this.handshake = new UnityCommand();
            this.handshake.promise.then(res => {
                this.handshakeResolved = true;
                return res;
            });
            this.checkHandshake();
        }
        return this.handshake.promise;
    }
    execCommand(name, data) {
        const id = ++this.commandsIdIterator;
        const command = new UnityCommand(id, name, data);
        this.commandsMap[id] = command;
        this.invokeCommand(command.getMessage());
        return command.promise;
    }
    checkHandshake() {
        if (!this.handshakeResolved) {
            this.invokeHandshake();
            setTimeout(this.checkHandshake.bind(this), 300);
        }
    }
    invokeHandshake() {
        RNUnity.invokeHandshake();
    }
    invokeCommand(message) {
        RNUnity.invokeCommand(message);
    }
    handleMessage(message) {
        try {
            const messageData = JSON.parse(message);
            const { type, name, data } = messageData;
            switch (type) {
                case 'handshake': {
                    this.handshake?.resolve();
                    break;
                }
                case 'event': {
                    this.dispatchEvent({ type: name, data });
                    break;
                }
                case 'result': {
                    const { id, resolved, result } = data;
                    if (this.commandsMap[id]) {
                        const command = this.commandsMap[id];
                        if (resolved) {
                            command.resolve(result);
                        }
                        else {
                            command.reject(result);
                        }
                        delete this.commandsMap[id];
                    }
                    break;
                }
            }
        }
        catch (e) {
            console.warn(e instanceof Error ? e.message : e);
        }
    }
}
class UnityCommand {
    id = null;
    name = null;
    data = null;
    promise;
    resolve;
    reject;
    constructor(id, name, data) {
        this.id = id || null;
        this.name = name || null;
        this.data = data || null;
        this.promise = new Promise((res, rej) => {
            this.resolve = res;
            this.reject = rej;
        });
    }
    getMessage() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            data: this.data,
        });
    }
}
const Unity = new UnityManager();
exports.Unity = Unity;
const UnityResponderView = (0, react_native_1.requireNativeComponent)('UnityResponderView');
exports.UnityResponderView = UnityResponderView;
//# sourceMappingURL=index.js.map