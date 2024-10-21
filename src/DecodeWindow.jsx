import React, { useState } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button,  Divider,  Image,  Input, message, Upload } from 'antd';
import { decryptText, encryptText } from './cryptFunctions';
import { upload } from '@testing-library/user-event/dist/upload';
const { TextArea } = Input;

const binaryToUint8Array = (binaryString) => {
    // Разбиваем двоичную строку на группы по 8 бит
    const bytes = binaryString.match(/.{1,8}/g); // Разделяем строку на байты (группы по 8 бит)
    
    if (!bytes) {
        return new Uint8Array(); // Если нет байтов, возвращаем пустой Uint8Array
    }

    // Преобразуем каждый байт в число и создаем Uint8Array
    const uint8Array = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
        uint8Array[i] = parseInt(bytes[i], 2); // Преобразуем двоичный байт в десятичное число
    }

    return uint8Array;
};



export const  DecodeWindow = () =>{


    const [text, setText] = useState('');
    const [text2, setText2] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
   const [uploading, setUploading] = useState(false);
   const [previewOpen, setPreviewOpen] = useState(false);
   const [previewImage, setPreviewImage] = useState('');
   



  
  const handleUpload = async () => {
    setUploading(true);
    if (!imageFile) {
        message.error('Пожалуйста, загрузите изображение.');
        setUploading(false);
        return;
      }
      if (!password) {
        message.error('Пожалуйста, введите пароль.');
        setUploading(false);
        return;
      }
      const img =  document.createElement('img');
      img.src = imageFile;
      
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let binaryText = '';
        
        for (let i = 0; i < data.data.length; i += 4) {
          binaryText += (data.data[i] & 1).toString();
        }
        try{
            const decryptedText = await decryptText(binaryToUint8Array(binaryText),password) ;
            setText(decryptedText);
        }
        catch{
            message.error("Ошибка расшифровки")
        }
        

    
  };

  setUploading(false);
}
  const props = {
    onRemove: (file) => {
      //const index = fileList.indexOf(file);
      //const newFileList = fileList.slice();
      //newFileList.splice(index, 1);
      setFile(null);
    },
    beforeUpload: (file) => {
      setFile(file);
      const formData = new FormData();
    
    formData.append('file',file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageFile(e.target.result);
    };
    reader.readAsDataURL(file);
      return false;
    },


    file,
  };

  const handlePreview = async (files) => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }
    setPreviewImage(imageFile);
    setPreviewOpen(true);
  };
 

  return (
    <>
      <Input.Password value={password}
        onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
        <Divider />
      <Upload listType="picture-card" onPreview={handlePreview} {...props} maxCount={1}>
        <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Выбрать изображение
      </div>
    </button>
      </Upload>
      <Divider />
      {previewImage && (
        <Image
          wrapperStyle={{
            display: 'none',
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
      <Divider />
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={!file}
        loading={uploading}
        style={{
          marginTop: 16,
        }}
      >
        {uploading ? 'Загружается' : 'Дешифровать'}
      </Button>
      <Divider />
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Текст"
        autoSize={{
          minRows: 3,
          maxRows: 5,
        }}
      />
    </>
  );

}