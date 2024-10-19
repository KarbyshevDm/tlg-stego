import React, { useState } from 'react';
import { Button, Menu } from 'antd';
import { EncodeWindow } from './EncodeWindow';
import { DecodeWindow } from './DecodeWindow';

const App: React.FC = () => {
  const items = [
    {
      label: 'Зашифровать',
      key: 'encode',

    },
    {
      label: 'Дешифровать',
      key: 'decode',
    }]
  const [current, setCurrent] = useState('encode');
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return <div className="App">
    <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
  {current === 'encode'?<EncodeWindow />:current === 'decode'?<DecodeWindow />:undefined}
  
  </div>
};

export default App;