import { FC } from 'react';
import { ViewProps } from 'react-native';
import { EventTarget } from 'event-target-shim';
declare class UnityManager extends EventTarget {
    private handshake;
    private handshakeResolved;
    private commandsMap;
    private commandsIdIterator;
    constructor();
    init(): Promise<undefined>;
    execCommand<R = undefined>(name: string, data?: object): Promise<R>;
    private checkHandshake;
    private invokeHandshake;
    private invokeCommand;
    private handleMessage;
}
declare const Unity: UnityManager;
declare const UnityResponderView: FC<ViewProps>;
export { Unity, UnityResponderView };
