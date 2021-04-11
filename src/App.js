import Chat, { Bubble, useMessages } from '@sssound1/sgui';
import '@sssound1/sgui/dist/index.css';
import Rasa from './Rasa'

const App = () => {
  const rasaHost = 'http://localhost:5005/webhooks/rest/webhook';

  const { messages, appendMsg, setTyping } = useMessages([]);

  function handleSend (type, val) {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        content: { text: val },
        position: 'right',
      });

      setTyping(true);

      new Rasa(rasaHost)
        .sendMessage(val)
        .then(data => {
          const validMessageTypes = ["text", "image", "buttons", "attachment"];

          data.filter((message) =>
            validMessageTypes.some(type => type in message)
          ).forEach((message) => {
            let validMessage = false;
            if (message.text) {
              validMessage = true;
              appendMsg({
                type: 'text',
                content: { text: message.text },
              });
            }

            if (message.buttons) {
              validMessage = true;
              // append other component
            }

            if (message.image) {
              validMessage = true;
              // append other component
            }

            if (validMessage === false)
              throw Error("Could not parse message from Bot or empty message");
          })
        })
    }
  }

  function renderMessageContent(msg) {
    const { content } = msg;
    return <Bubble content={content.text} />;
  }

  return (
    <Chat
      navbar={{ title: 'Senior Guardian' }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
    />
  );
};

export default App;