import { server } from "./request";

class WS {
  ws: WebSocket;
  constructor(url: string, onMessage: (code: string, data: string) => void, onOpen?: () => void, onClose?: () => void) {
    this.ws = new WebSocket(server + url);
    this.ws.onmessage = (ev: MessageEvent) => {
      const message = JSON.parse(ev.data) as {code: string, data: string};
      onMessage(message.code, message.data);
    }
    if (onOpen) this.ws.onopen = () => { onOpen(); };
    if (onClose) this.ws.onclose = () => { onClose(); };
  }
}

export default WS;
