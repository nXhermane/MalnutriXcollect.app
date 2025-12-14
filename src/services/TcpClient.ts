import net from 'react-native-tcp-socket';
export type TcpClientStatus = 'connected' | 'closed';
export interface TcpClientEvent {
  onReceived?: (data: object) => void;
  onStatusChange?: (status: TcpClientStatus) => void;
  onError?: (error: Error) => void;
}
class TcpClient {
  private client: net.Socket | null;
  private callbacks: TcpClientEvent;
  private status: TcpClientStatus;
  private error: Error | null;
  constructor() {
    this.client = null;
    this.callbacks = {};
    this.status = 'closed';
    this.error = null;
  }

  connect(host: string, port: number) {
    if (this.client != null) this.disconnect();
    this.client = net.createConnection({ port, host }, () => {
      console.log('Connected !');
      if (this.callbacks.onStatusChange) {
        this.callbacks.onStatusChange('connected');
      }
    });
    this.client.on('data', (data) => {
      if (this.callbacks.onReceived) this.callbacks.onReceived(JSON.parse(data.toString()));
    });
    this.client.on('error', (error) => {
      if (this.callbacks.onError) {
        console.error(error);
        this.callbacks.onError(error);
      }
    });
  }

  send(data: object) {
    if (this.client) {
      return this.client.write(JSON.stringify(data), 'utf-8', (error) => {
        if (error) {
          if (this.callbacks.onError) {
            this.callbacks.onError(error);
          }
        }
      });
    } else {
      console.warn('Start the tcp client before start data writting.');
      return false;
    }
  }
  disconnect() {
    if (this.client) {
      this.client.destroy();
      this.client = null;
    }
  }
  subscribe(events: TcpClientEvent) {
    this.callbacks = events;
  }
}
export default new TcpClient();
