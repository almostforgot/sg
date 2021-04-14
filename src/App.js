import Chat, { Bubble, useMessages, Card, Goods } from '@sssound1/sgui';
import '@sssound1/sgui/dist/index.css';
import { useEffect } from 'react';
import Rasa from './Rasa'

const App = () => {
  const rasaHost = 'https://seniorguardian.uc.r.appspot.com/webhooks/rest/webhook';

  const { messages, appendMsg, setTyping } = useMessages([]);

  const generateMsg = message => {
    for (const property in message) {
      const content = {};
      content[property] = message[property];
      appendMsg({
        type: property,
        content,
      });
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
        // allow multiple line response
        if('text' in message) {
          const lines = message.text.split('\\n')
          lines.forEach(line => {
            const msg = {}
            msg['text'] = line.trim()
            generateMsg(msg)
          });
        } else {
          generateMsg(message)
        }
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

  useEffect ( () => {
    handleSend('text', 'start', true)
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

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