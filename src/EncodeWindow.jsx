import React, { useState } from 'react';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button,  Divider,  Image,  Input, message, Upload } from 'antd';
import { decryptText, encryptText } from './cryptFunctions';
import { upload } from '@testing-library/user-event/dist/upload';
const { TextArea } = Input;



export const  EncodeWindow = () =>{


    const [text, setText] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
   const [uploading, setUploading] = useState(false);
   const [previewOpen, setPreviewOpen] = useState(false);
   const [previewImage, setPreviewImage] = useState('');
   const [resultImage,setResultImage] = useState('');
   const [resultOpen, setResultOpen] = useState(false);

   const downloadImage = (url) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'steganography_image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };



  
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
    if (!text) {
      message.error('Пожалуйста, введите текст.');
      setUploading(false);
      return;
    }
    const encryptedBytes = await encryptText(text,password);
    const encryptedBinary = encryptedBytes.reduce((acc, byte) => {
      return acc + byte.toString(2).padStart(8, '0');}, '');
    const canvas = document.createElement('canvas');
    

    const img =  document.createElement('img');

    img.src = imageFile;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Встраивание текста в LSB
     
      let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let index = 0;
      
       if (encryptedBinary.length > data.data.length/4){
         message.error('Длина текста не соответствует размеру изображения.');
       setUploading(false);
       return;
       }
      for (let i = 0; i < data.data.length && index < encryptedBinary.length; i += 4) {
        data.data[i] = (data.data[i] & ~1) | parseInt(encryptedBinary[index]);
        index++;
      }

      ctx.putImageData(data, 0, 0);
      const newImageUrl = canvas.toDataURL();
      setResultImage(newImageUrl);
      setResultOpen(true);
      downloadImage(newImageUrl);
    };
  
    

    setUploading(false);
  };
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

  const handlePreview = async () => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj);
    // }
    setPreviewImage(imageFile);
    setPreviewOpen(true);
  };
  const uploadButton = (
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
        Upload
      </div>
    </button>
  );


  return (
    <>
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
      <Divider />
      <Input.Password value={password}
        onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
      <Divider />
      <Upload listType="picture-card" onPreview={handlePreview} {...props} onDownload={(file)=>{
      }} maxCount={1}>
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
        {uploading ? 'Выгружается' : 'Зашифровать текст в изображение'}
      </Button>
      <Divider />
      {/* {resultImage && ( */}
        <Image
          // wrapperStyle={{
          //   display: 'none',
          // }}
          // preview={{
          //   visible: resultImage,
          //   onVisibleChange: (visible) => setResultOpen(visible),
          //   afterOpenChange: (visible) => !visible && setResultImage(''),
          // }}
          src={resultImage}
        />
      {/* )} */}
    </>
  );

}