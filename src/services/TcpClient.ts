import net from 'react-native-tcp-socket';

/**
 * Status of the TCP client connection
 * - 'connected': Client is connected to the server
 * - 'closed': Client is not connected to the server
 */
export type TcpClientStatus = 'connected' | 'closed';

/**
 * Event handlers for the TCP client
 * - onReceived: Called when data is received from the server
 * - onStatusChange: Called when the connection status changes
 * - onError: Called when an error occurs
 */
export interface TcpClientEvent {
  onReceived?: (data: object) => void;
  onStatusChange?: (status: TcpClientStatus) => void;
  onError?: (error: Error) => void;
}

/**
 * TCP Client for secure communication with the nutritionist server
 *
 * This class handles the TLS encrypted TCP connection to the server for patient data synchronization.
 * It provides methods to connect, send data, and handle connection events.
 */
class TcpClient {
  private client: net.Socket | null;
  private callbacks: TcpClientEvent;

  constructor() {
    this.client = null;
    this.callbacks = {};
  }

  /**
   * Establishes a TLS encrypted connection to the server
   * @param host - Server hostname or IP address
   * @param port - Server port number
   */
  connect(host: string, port: number) {
    if (this.client != null) this.disconnect();
    this.client = net.connectTLS(
      {
        port,
        host,
        reuseAddress: true,
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        ca: require('./../../assets/crypto/server-cert.pem'),
      },
      () => {
        console.log('Connected !');
        if (this.callbacks.onStatusChange) {
          this.callbacks.onStatusChange('connected');
        }
      },
    );
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

  /**
   * Sends data to the server
   * @param data - Object to send to the server (will be JSON serialized)
   * @returns boolean indicating success or false if client is not connected
   */
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

  /**
   * Disconnects from the server and cleans up resources
   */
  disconnect() {
    if (this.client) {
      this.client.destroy();
      this.client = null;
    }
  }

  /**
   * Subscribes to TCP client events
   * @param events - Event handlers for received data, status changes, and errors
   */
  subscribe(events: TcpClientEvent) {
    this.callbacks = events;
  }
}

export default new TcpClient();
