import Chat, { Bubble, useMessages } from '@sssound1/sgui';
import '@sssound1/sgui/dist/index.css';
import { useEffect } from 'react';
import Rasa from './Rasa'

const App = () => {
  const { messages, appendMsg, setTyping } = useMessages([]);

  function handleSend (type, val, initial=false) {
    if (type === 'text' && val.trim() && !initial) {
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });
      setTyping(true);
    }

    new Rasa(rasaHost)
    .sendMessage(val)
    .then(data => {
      const validMessageTypes = ["text", "image", "buttons", "attachment", "list"];

      data.filter((message) =>
        validMessageTypes.some(type => type in message)
      ).forEach((message) => {
        let validMessage = false;
        for (const property in message) {
          if (validMessageTypes.includes(property)) {
            validMessage = true;
            const content = {};
            content[property] = message[property];
            appendMsg({
              type: property,
              content,
            });
          }
        }
        if (validMessage === false)
          throw Error("Could not parse message from Bot or empty message");
      })
    })
  }

  function renderMessageContent(msg) {
    const { content } = msg;
    return <Bubble content={content.text} />;
  }

  useEffect(() => {
    handleSend('text', 'start', true)
  }, [] );

  return (
    <Chat
      navbar={{ title: 'Assistant' }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
    />
  );
};

export default App;