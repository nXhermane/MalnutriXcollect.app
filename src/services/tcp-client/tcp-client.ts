import { createLogger } from '@/lib/utils/logger';
import net from 'react-native-tcp-socket';
import { Framer } from './framer';
// eslint-disable-next-line import/no-unresolved
import serverCert from '@/../assets/crypto/server-cert.pem';

export type TcpClientStatus = 'connected' | 'closed';

export interface TcpClientEvent {
  onReceived?: (data: object) => void;
  onStatusChange?: (status: TcpClientStatus) => void;
  onError?: (error: Error) => void;
}

const logger = createLogger('TcpClient');

class TcpClient {
  private client: net.Socket | null;
  private callbacks: TcpClientEvent;
  private framer: Framer | null;

  constructor() {
    this.client = null;
    this.callbacks = {};
    this.framer = null;
  }

  connect(host: string, port: number) {
    if (this.client != null) this.disconnect();

    this.framer = new Framer();
    this.framer.onMessage = (msg) => {
      if (this.callbacks.onReceived) this.callbacks.onReceived(msg);
    };
    this.framer.onError = (err) => {
      logger.error('TCP Framer Error', err);
      if (this.callbacks.onError) this.callbacks.onError(err);
    };

    this.client = net.connectTLS(
      {
        port,
        host,
        reuseAddress: true,
        ca: serverCert,
      },
      () => {
        console.log('Connected !');
        if (this.callbacks.onStatusChange) {
          this.callbacks.onStatusChange('connected');
        }
      },
    );
    this.client.on('data', (data) => {
      if (this.framer) this.framer.feed(data.toString());
    });
    this.client.on('error', (error) => {
      if (this.callbacks.onError) {
        logger.error('TCP Client Error', error);
        this.callbacks.onError(error);
      }
    });
  }

  send(data: object) {
    if (this.client && this.framer) {
      return this.client.write(this.framer.encode(data), 'utf-8', (error) => {
        if (error) {
          if (this.callbacks.onError) {
            this.callbacks.onError(error);
          }
        }
      });
    } else {
      logger.warn('Start the tcp client before start data writting.');
      return false;
    }
  }

  disconnect() {
    if (this.client) {
      this.client.destroy();
      this.client = null;
      this.framer = null;
    }
  }

  subscribe(events: TcpClientEvent) {
    this.callbacks = events;
  }
}

export default new TcpClient();
