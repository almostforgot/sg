import Chat, { Bubble, useMessages, Card, Goods } from '@sssound1/sgui';
import '@sssound1/sgui/dist/index.css';
import { useEffect } from 'react';
import Rasa from './Rasa'

const App = () => {
  const rasaHost = 'http://localhost:5005/webhooks/rest/webhook';

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
    if (msg.type === 'text') {
      return <Bubble content={content.text} />;
    }
    // If it's other type, handle it here to load different component
    if (msg.type === 'list') {
      return (
        <Card Card size="xl" >
          <Goods
            type="order"
            img="//gw.alicdn.com/tfs/TB1p_nirYr1gK0jSZR0XXbP8XXa-300-300.png"
            name="商品名称"
            desc="商品描述"
            tags={[
              { name: '3个月免息' },
              { name: '4.1折' },
            ]}
            currency="¥"
            price="300.00"
            count={8}
            unit="kg"
            status="交易关闭"
            action={{
              label: '详情',
              onClick (e) {
                console.log(e);
                e.stopPropagation();
              },
            }}
          />
          <Goods
            type="order"
            img="//gw.alicdn.com/tfs/TB1p_nirYr1gK0jSZR0XXbP8XXa-300-300.png"
            name="这个商品名称非常非常长长到会换行"
            desc="商品描述"
            tags={[
              { name: '3个月免息' },
              { name: '4.1折' },
              { name: '黑卡再省33.96' },
            ]}
            currency="$"
            price="300.00"
            count={8}
            unit="kg"
            action={{
              label: '详情',
              onClick (e) {
                console.log(e);
                e.stopPropagation();
              },
            }}
          />
        </Card>
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

  useEffect(() => {
    handleSend('text', 'start', true)
  }, [] );

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