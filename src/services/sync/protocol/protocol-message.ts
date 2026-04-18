import type { MessageType } from './message-types';

export interface ProtocolMessage<T> {
  type: MessageType;
  content: T;
}

export type SendFn = (message: ProtocolMessage<unknown>) => void;
