import { createLogger } from '@/lib/utils/logger';
import { logSyncMessage } from '@/store/sync/sync-debug.store';
import type { MessageType } from './message-types';
import type { ProtocolMessage, SendFn } from './protocol-message';

export type MessageHandler<T> = (content: T, send: SendFn) => void | Promise<void>;

const logger = createLogger('HandlerRegistry');

export class HandlerRegistry {
  private readonly handlers = new Map<MessageType, MessageHandler<unknown>>();

  register<T>(type: MessageType, handler: MessageHandler<T>): void {
    this.handlers.set(type, handler as MessageHandler<unknown>);
  }

  dispatch(message: ProtocolMessage<unknown>, send: SendFn): void {
    const handler = this.handlers.get(message.type);
    if (!handler) {
      logger.warn(`No handler registered for message type: ${message.type}`);
      return;
    }
    logger.debug('Dispatching message: ', message);
    logSyncMessage('received', message.type, message.content);
    handler(message.content, send);
  }
}
