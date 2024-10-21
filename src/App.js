import React, { useState } from "react";
import { Layout, Menu, Typography, ConfigProvider, Button, Drawer, Switch } from "antd";
import { EncodeWindow } from "./EncodeWindow";
import { DecodeWindow } from "./DecodeWindow";
import "./App.css"

const { Header, Content } = Layout;
const { Title } = Typography;

// Цвета, схожие с Telegram
const telegramColors = {
  light: {
    primary: "#0088cc", // Основной цвет
    background: "#ffffff", // Фоновый цвет
    text: "#000000", // Цвет текста
  },
  dark: {
    primary: "#0088cc", // Основной цвет
    background: "#1e1e1e", // Фоновый цвет
    text: "#ffffff", // Цвет текста
  },
};

const App = () => {
  const [theme, setTheme] = useState("light");
  const [switchTheme, setSwithTheme] = useState(true);


  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const items = [
    {
      label: "Зашифровать",
      key: "encode",
    },
    {
      label: "Дешифровать",
      key: "decode",
    },
  ];


  const [current, setCurrent] = useState("encode");
  const onClick = (e) => {
    setCurrent(e.key);
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: telegramColors[theme].primary,
          colorBgBase: telegramColors[theme].background,
          colorTextBase: telegramColors[theme].text,
          
        },
        components:{
          Menu:{
            horizontalItemSelectedColor: telegramColors[theme].text,
            //itemColor: telegramColors[theme].text,
            itemBg: telegramColors[theme].primary,
          darkItemBg:telegramColors[theme].primary,
            itemHoverColor: telegramColors[theme].text,
          },
          Button:{
            primaryShadow: "0 0",
          }
        }
      }}
    >
      <Layout
        style={{
          minHeight: "100vh",
          background: telegramColors[theme].background,
        }}
      >
        <Header className="header" style={{ background: telegramColors[theme].primary }}>
        <div className="header-content">
          <Title level={3} style={{ color: telegramColors[theme].text, margin: 0}}>Стего </Title>
          <Menu
            theme={theme}
            onClick={onClick}
            className="desktop-menu"
            style={{
              //color: telegramColors[theme].text,
              flex: "auto",
              collapsedWidth:40,
              minWidth: 20,
              //background: telegramColors[theme].primary,
            }}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
          />
          <div className="header-buttons">
            <Switch  onChange={toggleTheme} checkedChildren="Dark" unCheckedChildren="light" defaultChecked />  
          </div>
          </div>
        </Header>
        <Content style={{ padding: "20px" }}>
          {/* <Title level={4} style={{ color: telegramColors[theme].text }}>
            Введите текст, пароль и выберите изображение, в которое хотите поместить зашифрованное послание
          </Title>
          <p style={{ color: telegramColors[theme].text }}>
            Используйте форматы изображения без сжатия (png)
          </p> */}
          {current === "encode" ? (
            <EncodeWindow />
          ) : current === "decode" ? (
            <DecodeWindow />
          ) : undefined}
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
