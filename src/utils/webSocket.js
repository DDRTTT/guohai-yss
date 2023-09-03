import SockJS from 'sockjs-client';
const Stomp = require('stompjs');

/**
 * 将后台传过来的json字符串转换为object
 * @param data
 */
function transJson(data) {
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  return data;
}

class WEBSOCKET {
  constructor(socketHost, headers = {}) {
    this._instance = null;
    this.url = socketHost;
    this.headers = headers;
    this.socket = new SockJS(this.url, null, { timeout: 15000 });
  }

  init() {
    return new Promise(resolve => {
      if (!this._instance) {
        this._instance = Stomp.over(this.socket);
        this._instance.debug = function(e) {
          console.log('e', e);
        };
        this._instance.connect(
          this.headers,
          () => {
            console.log('websocket 连接已建立');
            resolve();
          },
          () => {
            console.log('websocket 连接已断开');
            if (this._instance) {
              this._instance.disconnect();
              this._instance = null;
              if (this.socket) {
                this.socket.close();
                this.socket = null;
              }
            }
          },
        );
      }
    });
  }

  close() {
    if (this._instance) {
      try {
        this._instance.disconnect();
        this._instance = null;
        if (this.socket) {
          this.socket.close();
          this.socket = null;
        }
      } catch {}
    }
  }

  getMessage(subscribe, callback) {
    this._instance.subscribe(subscribe, response => callback(transJson(response.body)));
  }

  sendMessage(subscribe, message) {
    this._instance.send(subscribe, {}, message);
  }
}

export { WEBSOCKET };
