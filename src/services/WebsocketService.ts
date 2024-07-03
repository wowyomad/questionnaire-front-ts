// WebSocketService.ts

import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

const WEBSOCKET_URL = 'http://localhost:8080/ws';

class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private subscriptions: { [key: string]: Stomp.Subscription } = {};

  connect(): void {
    if (this.stompClient && this.stompClient.connected) {
      return;
    }

    const socket = new SockJS(WEBSOCKET_URL);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      console.log('WebSocket connected');
    }, error => {
      console.error('WebSocket connection error:', error);
    });
  }

  subscribe(topic: string, callback: () => void): void {
    if (this.stompClient && this.stompClient.connected) {
      this.subscriptions[topic] = this.stompClient.subscribe(topic, callback);
    } else {
      console.warn('WebSocket not connected. Retrying subscription...');
      setTimeout(() => {
        this.subscribe(topic, callback);
      }, 500);
    }
  }

  unsubscribe(topic: string): void {
    const subscription = this.subscriptions[topic];
    if (subscription) {
      subscription.unsubscribe();
      delete this.subscriptions[topic];
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      Object.keys(this.subscriptions).forEach(topic => {
        this.unsubscribe(topic);
      });

      this.stompClient.disconnect(() => {
        console.log('WebSocket disconnected');
      });

      this.stompClient = null;
    }
  }
}

export default WebSocketService;
