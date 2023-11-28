import React, { Suspense, useEffect, useState } from 'react';
import axios from 'axios';
import './assets/css/main.css';
import chat from './assets/img/ch1.gif';
import he from 'he';
import Card from './Component/Card';
import Button from './Component/Button';
import Table from './Component/Table';
import Titlecard from './Component/Titlecard';
import Titlecardtemp from './Component/Titlecardtemp';

const App = () => {
  const [session, setSession] = useState(true); // maintain session
  const [inputValue, setInputValue] = useState(''); // input
  const [usermessage, addUsermessage] = useState([]); // store user chat
  const [botmessage, addBotmessage] = useState([]); // store bot chat
  const [temp, settemp] = useState(false); // store bot chat
  const [parsedData, setParsedData] = useState([]); // store parsed data
  const [isChatVisible, setIsChatVisible] = useState(false);

    // add bot response in 1 index
    const botmsg = (newValue) => {
      addBotmessage([newValue, ...botmessage]);
    };
  

  // add user input in 1 index
  const usermsg = (newValue) => {
    botmsg("Typing...")
    addUsermessage([newValue, ...usermessage]);
  };

  const isEncodedString = (str) => {
    // Regular expression to check for HTML entities
    const htmlEntityRegex = /&quot;|&lt;|&gt;|&amp;|&#39;/g;

    // Test if the string contains HTML entities
    return htmlEntityRegex.test(str);
  };

  // useEffect(() => {
  //   console.log(botmessage);
  // }, [botmessage]);

  // add bot response in 1 index
  const reload = () => {
    setSession(true);
    addUsermessage([]);
    addBotmessage([]);
    setIsChatVisible(true);
  };


  // axios cred
  const axiosInstance = axios.create({
    baseURL: "https://bots.kore.ai/chatbot/v2/webhook/st-fd5785f8-91e5-5c45-8821-1bd775044124",
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6ImNzLTU2NDYzN2NiLWE4MjEtNTIwMS1iNThjLTg5M2IzZjFhYWFjNCIsInN1YiI6IjEyMzQ1Njc4OTAifQ.UWO4dOIOE0bpjkgiVTtaL-KXkQ0oVmbOW8qVCY0_akA`
    }
  });

  // send message to webhook
  const sendMessage = async (message) => {
    // console.log(session);
    const requestData = {
      session: {
        new: session
      },
      message: {
        type: 'text',
        val: message
      },
      from: {
        id: 'U12345',
        userInfo: {
          firstName: "hari",
          lastName: "guptha",
          email: "harihariguptha@gmail.com"
        }
      },
      mergeIdentity: false
    };

    try {
      const response = await axiosInstance.post('', requestData);
      setSession(false); //custom template
      if (isEncodedString(response.data.data[0].val)) {
        // Decode HTML entities
        const decodedString = he.decode(response.data.data[0].val);

        // Parse the JSON string
        const parsedData = JSON.parse(decodedString);
        setParsedData(parsedData)
        if (parsedData.type === "cardTemplate") {
          botmsg(parsedData.val)
        } else {
          botmsg(parsedData.chatup)
        }
        settemp(true)

      } else {
        if (response.data.data[0].type === "text") {
          if (response.data.data.length < 2) {
            botmsg(response.data.data[0].val);

          } else {

            addBotmessage(prevBotMessages => [
              response.data.data[0].val + "\n" + response.data.data[1].val,
              ...prevBotMessages,
            ]);
          }
        } else {
          console.log("template")
        }
      }
    } catch (error) {
      botmsg("Something went wrong");
      console.error('Error:', error);
    }
  };

  // handle enter key press to send msg
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage(inputValue);
      usermsg(inputValue);
      setInputValue('');
      settemp(false)
    }
  };

  // catch value from input
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <div>
        {temp === false ? (
          <div id="bg"></div>
        ) : (
          <>
            {parsedData.type === "cardTemplate" && (
              <div id='cardtemplate'>
                {parsedData.products.map((product, index) => (
                  <Card
                    key={index}
                    name={product.Name}
                    btn={product.btn}
                    imglink={product.imglink}
                    price={product.price}
                    playload={product.playload}
                    playloadhandler={sendMessage}
                    hider={settemp}
                    msg={usermsg}
                  />
                ))}
              </div>
            )}

            {parsedData.type === "TitleCardTemplate" && (
              <div id='TitleCardTemplate'>
                <h3 id='supercardtitle'>{parsedData.supertitle}</h3>
                <div style={{ padding: "25px 25px" }}>
                  {parsedData.val.map((content, index) => (
                    <Titlecard
                      key={index}
                      content={content}
                      playloadhandler={sendMessage}
                      hider={settemp}
                    />
                  ))}
                </div>
              </div>
            )}

            {parsedData.type === "TitleCardTemp" && (
              <div id='TitleCardTemplate'>
                <h3 id='supercardtitle'>{parsedData.supertitle}</h3>
                <div style={{ padding: "25px 25px" }}>
                  <Titlecardtemp
                    content={parsedData.val}
                    btn={parsedData.hyper}
                    playloadhandler={botmsg}
                    hider={settemp} 
                    msg={usermsg}/>
                </div>

              </div>
            )}

            {parsedData.type === "buttonTemplate" && (
              <div id='buttontemplate'>
                <h1 id="btntitle">{parsedData.val}</h1>
                {parsedData.button.map((button, index) => (
                  <Button
                    key={index}
                    content={button.content}
                    playload={button.playload}
                    playloadhandler={sendMessage}
                    hider={settemp}
                    msg={usermsg}
                  />
                ))}
              </div>
            )}

            {parsedData.type === "TableTemplate" && (
              <div id='tabletemplate'>
                <div id="tablemain">
                  <h1 id='tabltitle'>{parsedData.val}</h1>
                  <div style={{ padding: "40px 60px" }}>
                    {Array.from({ length: parsedData.col1.length }, (_, i) => (
                      <Table key={i} content1={parsedData.col1[i]} content2={parsedData.col2[i]} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", height: "100vh" }}>
        <div style={{ alignSelf: "flex-end", marginLeft: "auto" }}>
          <div id='chatcont'>
            <div id='chatdisplay' className={isChatVisible ? '' : 'hidder'} style={{ position: "relative", display: "flex", flexDirection: "column-reverse" }}>
              {(() => {
                // handle the msg displayed by the first three index value
                const elements = [];
                // const end = Math.min(2, usermessage.length); // Ending index (up to the first 3 elements)
                for (let i = 0; i < usermessage.length; i++) {
                  elements.push(
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "right" }}>
                        <div id='msgbox2' className={isChatVisible ? '' : 'hidder'} >
                          <h1 id='msg' >{usermessage[i]}</h1>
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "left" }}>
                        <div id='msgbox1' className={isChatVisible ? '' : 'hidder'}>
                          <h1 id='msg'>{botmessage[i]}</h1>
                        </div>
                      </div>
                    </div>
                  );
                }
                return elements;
              })()}
            </div>

            <div style={{ display: "flex" }}>
              <input
                id="chatmessage"
                type="text"
                className={isChatVisible ? '' : 'hidder'}
                placeholder='Enter the message'
                value={inputValue}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
              />
              <img id='chatimg' onClick={(e) => setIsChatVisible(!isChatVisible)} style={{ zIndex: 1 }} src={chat} alt="chat" />
            </div>
            <div style={{ display: "flex", justifyContent: "center", width: "100%", gap: 20 }}>
              <h2 id='button' className={isChatVisible ? '' : 'hidder'} onClick={(e) => { reload(), settemp(false) }} style={{ cursor: 'pointer' }}>Reload</h2>
              <h2 id='button' className={isChatVisible ? '' : 'hidder'} onClick={(e) => { setIsChatVisible(false), settemp(false) }} style={{ cursor: 'pointer' }}>Close</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
