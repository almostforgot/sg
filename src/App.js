import Chat, { Bubble, Popup, useMessages, Card, Goods, Button } from '@sssound1/sgui';
import '@sssound1/sgui/dist/index.css';
import { useEffect, useState } from 'react';
import Rasa from './Rasa'

const App = () => {
  const rasaHost = 'https://seniorguardian.uc.r.appspot.com/webhooks/rest/webhook';
  // const rasaHost = 'http://localhost:5005/webhooks/rest/webhook';

  const { messages, appendMsg, setTyping } = useMessages([]);
  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const generateMsg = message => {
    for (const property in message) {
      const content = {};
      content[property] = message[property];
      switch (property) {
        case 'text':
          const lines = message.text.split('\\n')
          lines.forEach(line => {
            const textContent = {}
            textContent['text'] = line.trim()
            appendMsg({
              type: 'text',
              content: textContent,
            });
          })
          break;

        default:
          appendMsg({
            type: property,
            content,
          });
      }
    }
  }

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
      data.forEach((message) => {
        generateMsg(message)
      })
    })
  }

  function renderMessageContent (msg) {
    const { content } = msg;
    if (msg.type === 'text') {
      return <Bubble content={content.text} />;
    }

    // https://rasa.com/docs/rasa/responses#buttons
    // https://chatui.io/components/button
    if (msg.type === 'buttons') {
      const buttons = content.buttons
      const buttonList = buttons.map((button) => {
        function buttonCallBack (button) {
          const {title, payload} = button
          appendMsg({
            type: 'text',
            content: { text: title } ,
            position: 'right',
          });
          setTyping(true)
          new Rasa(rasaHost)
          .sendMessage(payload)
          .then(data => {
            data.forEach((message) => {
              generateMsg(message)
            })
          })
        }
        return <span><Button key={button.title} color="primary" onClick={() => buttonCallBack(button)}>{button.title}</Button>&nbsp;&nbsp;&nbsp;</span>
      })
      return (
        <div>
          {buttonList}
        </div>
      );
    }

    // If it's other type, handle it here to load different component
    if (msg.type === 'custom' && msg.content.custom.results) {
      const results = msg.content.custom.results
      console.log(results)

      const list = results.map((item) => {
        return (
          <Goods
            key={item.name}
            type="order"
            img="https://dvh1deh6tagwk.cloudfront.net/niche-builder/5dbba46f052d1.png"
            name={item.name}
            desc={item.productDescription}
            tags={[
              { name: '3个月免息' },
              { name: '4.1折' },
            ]}
            currency="$"
            price={item.price}
            // count={8}
            // unit="kg"
            // status="交易关闭"
            action={{
              label: 'get quote',
              onClick (e) {
                // console.log(e);
                e.stopPropagation();
                window.open(item.quoteLink)
              },
            }}
          >
          </Goods>
        )
      })
      return (
        <div>
          <Button color="primary" onClick={handleOpen}>
            Click here to see the result!
          </Button>
          <Popup
            active={open}
            title="result"
            onClose={handleClose}
          >
            {list}
          </Popup>
        </div>
      );
    }

    if (msg.type === 'image') {
      return (
        <div>
          <Bubble type="image">
            <img src={content.image} alt="" />
          </Bubble>
        </div>
      );
    }
  }

  useEffect ( () => {
    handleSend('text', 'start', true)
  }, [] );// eslint-disable-line react-hooks/exhaustive-deps

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
