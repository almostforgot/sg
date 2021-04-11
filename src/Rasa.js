import { uuidv4 } from "./utils";

export default class Rasa {
  constructor(host) {
    this.host = 'http://localhost:5005/webhooks/rest/webhook';
    this.uesrId = 'testUser'
  }

  async sendMessage (messageText) {
    if (messageText === "") return;

    const messageObj = {
      message: { type: "text", text: messageText },
      time: Date.now(),
      username: this.userId,
      uuid: uuidv4()
    };

    const rasaMessageObj = {
      message: messageObj.message.text,
      sender: this.userId
    };

    const response = await fetch(this.host, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rasaMessageObj)
    });

    const messages = await response.json();

    return messages;
  }
}
