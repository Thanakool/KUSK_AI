//Kasetsart university insect detect function
//because we are knowladge of the land
//faculty of education and developing science

const line = require('@line/bot-sdk')
const express = require('express')
const axios = require('axios').default
const dotenv = require('dotenv')
const fs = require('fs');
const path = require('path');
const util = require('util')
const env = dotenv.config().parsed
const app = express()
const { pipeline } = require('stream')
const lineConfig = {
    channelAccessToken: env.ACCESS_TOKEN,
    channelSecret: env.SECRET_TOKEN
}
var pestdata
var found
var logid = {}
var insideFunction = {}

const API_KEY = env.API_KEY
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { type } = require('os');
const genAI = new GoogleGenerativeAI(process.env.API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

const status = {}

const ku =
    [
        '  ku80ku80ku80ku80ku80ku80ku80ku80',
        '  ku80ku80ku80ku80ku80ku80ku80ku80',
        '  ku80  80ku80  80ku  ku80ku  ku80',
        '  ku80  80ku80  80ku  ku80ku  ku80',
        '  ku80  80ku  ku80ku  ku80ku  ku80',
        '  ku80  80  80ku80ku  ku80ku  ku80',
        '  ku80    ku80ku80ku  ku80ku  ku80',
        '  ku80  80  80ku80ku  ku80ku  ku80',
        '  ku80  80ku  ku80ku  ku80ku  ku80',
        '  ku80  80ku80  80ku  ku80ku  ku80',
        '  ku80  80ku80  80ku          ku80',
        '  ku80ku80ku80ku80ku80ku80ku80ku80',
        '  ku80ku80ku80ku80ku80ku80ku80ku80',
        '  ku80                        ku80',
        '  ku80ku80ku80ku80ku80ku80ku80ku80',
        '  ku80ku80ku80ku80ku80ku80ku80ku80',
        '                                ',
        'knowladgeoftheland-kasetsartuniversity',
        'facultyofeducationanddevelopingscience'
    ]
console.log(ku)

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const client = new line.Client(lineConfig);

app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
    try {
        const events = req.body.events;
        console.log('event =>>>>', events);
        return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send('Connecting sucessfully')
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
})

const handleEvent = async (event) => {
    if (event.deliveryContext.isRedelivery == false) {
        console.log(event)
        if (event.type != 'message') {
            readmem(event.postback.data, event)
        }
        else if (event.message.type == 'text') {
            if (event.source.userId in logid) {
                if (event.message.text == 'logout') {
                    delete logid[event.source.userId]
                    return client.pushMessage(event.source.userId, { type: 'text', text: 'ออกจากระบบเรียบร้อยแล้ว' })
                } else if (event.message.text == 'รายละเอียด') {
                    return
                } else if (event.source.userId in insideFunction) {
                    const id = insideFunction[event.source.userId]
                    if (event.message.text == '-q') {
                        delete insideFunction[event.source.userId]
                        return client.pushMessage(event.source.userId, {
                            type: "flex",
                            altText: "This is a Flex message",
                            contents: {
                                "type": "bubble",
                                "direction": "ltr",
                                "header": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "Mode Selecting",
                                            "size": "xxs",
                                            "align": "start",
                                            "gravity": "center",
                                            "contents": []
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xxl",
                                            "color": "#FFFFFFFF"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xl",
                                            "color": "#130F0FFF"
                                        },
                                        {
                                            "type": "text",
                                            "text": "ออกจากโหมดเดิมเรียบร้อย",
                                            "weight": "regular",
                                            "align": "center",
                                            "margin": "xl",
                                            "contents": []
                                        },
                                        {
                                            "type": "text",
                                            "text": "กรุณาเลือกโหมด",
                                            "align": "center",
                                            "gravity": "center",
                                            "contents": []
                                        },
                                        {
                                            "type": "text",
                                            "text": "จาก4ฟังก์ชั่นต่อไปนี้",
                                            "align": "center",
                                            "gravity": "bottom",
                                            "margin": "none",
                                            "contents": []
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xxl"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "none",
                                            "color": "#000000FF"
                                        }
                                    ]
                                },
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ระบบตรวจจับแมลง (ภาพ)",
                                                "text": "1"
                                            },
                                            "color": "#3EBC18FF",
                                            "margin": "none",
                                            "height": "md",
                                            "style": "primary"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xl",
                                            "color": "#FFFFFFFF"
                                        },
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ระบบตรวจจับวัชพืช (ภาพ)",
                                                "text": "2"
                                            },
                                            "color": "#3EBC18FF",
                                            "style": "primary"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xl"
                                        },
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ระบบตรวจจับโรคพืช (ภาพ)",
                                                "text": "3"
                                            },
                                            "color": "#3EBC18FF",
                                            "style": "primary"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xl"
                                        },
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ระบบการให้คำแนะนำ (ข้อความ)",
                                                "text": "4"
                                            },
                                            "color": "#3EBC18FF",
                                            "style": "primary"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xxl",
                                            "color": "#FFFFFFFF"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xxl",
                                            "color": "#000000FF"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xl",
                                            "color": "#FFFFFFFF"
                                        },
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ออกจากระบบ",
                                                "text": "logout"
                                            },
                                            "color": "#B9B9B9FF",
                                            "style": "primary"
                                        }
                                    ]
                                }
                            }
                        })
                    } else if (event.message.text == 'mode') {
                        if (event.message.text == '-q') {
                            delete insideFunction[event.source.userId]
                            return client.pushMessage(event.source.userId, {
                                type: "flex",
                                altText: "This is a Flex message",
                                contents: {
                                    "type": "bubble",
                                    "direction": "ltr",
                                    "header": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": "Mode Selecting",
                                                "size": "xxs",
                                                "align": "start",
                                                "gravity": "center",
                                                "contents": []
                                            },
                                            {
                                                "type": "separator",
                                                "margin": "xxl",
                                                "color": "#FFFFFFFF"
                                            },
                                            {
                                                "type": "separator",
                                                "margin": "xl",
                                                "color": "#130F0FFF"
                                            },
                                            {
                                                "type": "text",
                                                "text": "กลับสู่การเลือกโหมดสำเร็จ",
                                                "weight": "regular",
                                                "align": "center",
                                                "margin": "xl",
                                                "contents": []
                                            },
                                            {
                                                "type": "text",
                                                "text": "กรุณาเลือกโหมด",
                                                "align": "center",
                                                "gravity": "center",
                                                "contents": []
                                            },
                                            {
                                                "type": "text",
                                                "text": "จาก4ฟังก์ชั่นต่อไปนี้",
                                                "align": "center",
                                                "gravity": "bottom",
                                                "margin": "none",
                                                "contents": []
                                            },
                                            {
                                                "type": "separator",
                                                "margin": "xxl"
                                            },
                                            {
                                                "type": "separator",
                                                "margin": "none",
                                                "color": "#000000FF"
                                            }
                                        ]
                                    },
                                    "body": {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "button",
                                                "action": {
                                                    "type": "message",
                                                    "label": "ระบบตรวจจับแมลง (ภาพ)",
                                                    "text": "1"
                                                },
                                                "color": "#3EBC18FF",
                                                "margin": "none",
                                                "height": "md",
                                                "style": "primary"
                                            },
                                            {
                                                "type": "separator",
                                                "margin": "xl",
                                                "color": "#FFFFFFFF"
                                            },
                                            {
                                                "type": "button",
                                                "action": {
                                                    "type": "message",
                                                    "label": "ระบบตรวจจับวัชพืช (ภาพ)",
                                                    "text": "2"
                                                },
                                                "color": "#3EBC18FF",
                                                "style": "primary"
                                            },
                                            {
                                                "type": "separator",
                                                "margin": "xl"
                                            },
                                            {
                                                "type": "button",
                                                "action": {
                                                    "type": "message",
                                                    "label": "ระบบตรวจจับโรคพืช (ภาพ)",
                                                    "text": "3"
                                                },
                                                "color": "#3EBC18FF",
                                                "style": "primary"
                                            },
                                            {
                                                "type": "separator",
                                                "margin": "xl"
                                            },
                                            {
                                                "type": "button",
                                                "action": {
                                                    "type": "message",
                                                    "label": "ระบบการให้คำแนะนำ (ข้อความ)",
                                                    "text": "4"
                                                },
                                                "color": "#3EBC18FF",
                                                "style": "primary"
                                            },
                                            {
                                                "type": "separator",
                                                "margin": "xxl",
                                                "color": "#FFFFFFFF"
                                            },
                                            {
                                                "type": "separator",
                                                "margin": "xxl",
                                                "color": "#000000FF"
                                            },
                                            {
                                                "type": "separator",
                                                "margin": "xl",
                                                "color": "#FFFFFFFF"
                                            },
                                            {
                                                "type": "button",
                                                "action": {
                                                    "type": "message",
                                                    "label": "ออกจากระบบ",
                                                    "text": "logout"
                                                },
                                                "color": "#B9B9B9FF",
                                                "style": "primary"
                                            }
                                        ]
                                    }
                                }
                            })
                        }
                    } else if (id == '4') {
                        const result = await model.generateContent(event.message.text);
                        const response = await result.response;
                        const text = response.text();
                        console.log(text);
                        delete insideFunction[event.source.userId]
                        return client.pushMessage(event.source.userId, { type: 'text', text: text })
                    }
                    else {
                        return client.pushMessage(event.source.userId, {
                            type: "flex",
                            altText: "This is a Flex message",
                            contents: {
                                "type": "bubble",
                                "direction": "ltr",
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "กรุณาส่งภาพ หรือ ออกจากโหมดส่งภาพ",
                                            "align": "center",
                                            "contents": []
                                        }
                                    ]
                                },
                                "footer": {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "นำฉันออกจากโหมดส่งภาพ",
                                                "text": "-q"
                                            },
                                            "style": "secondary"
                                        }
                                    ]
                                }
                            }
                        })
                    }
                } else {
                    if (event.message.text.substring(0, 1) == '1') {
                        insideFunction[event.source.userId] = '1'
                        console.log(insideFunction)
                        console.log(event.source.userId)
                        return client.pushMessage(event.source.userId, {
                            type: "flex",
                            altText: "This is a Flex message",
                            contents: {
                                "type": "bubble",
                                "direction": "ltr",
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "เลือกระบบการตรวจจับแมลงแล้ว",
                                            "align": "center",
                                            "contents": []
                                        }
                                    ]
                                },
                                "footer": {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ออกจากฟังก์ชัน",
                                                "text": "-q"
                                            },
                                            "style": "secondary"
                                        }
                                    ]
                                }
                            }
                        })
                    } else if (event.message.text.substring(0, 1) == '2') {
                        insideFunction[event.source.userId] = '2'
                        console.log(insideFunction)
                        return client.pushMessage(event.source.userId, {
                            type: "flex",
                            altText: "This is a Flex message",
                            contents: {
                                "type": "bubble",
                                "direction": "ltr",
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "เลือกระบบการตรวจจับวัชพืชแล้ว",
                                            "align": "center",
                                            "contents": []
                                        }
                                    ]
                                },
                                "footer": {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ออกจากฟังก์ชัน",
                                                "text": "-q"
                                            },
                                            "style": "secondary"
                                        }
                                    ]
                                }
                            }
                        })
                    } else if (event.message.text.substring(0, 1) == '3') {
                        insideFunction[event.source.userId] = '3'
                        console.log(insideFunction)
                        return client.pushMessage(event.source.userId, {
                            type: "flex",
                            altText: "This is a Flex message",
                            contents: {
                                "type": "bubble",
                                "direction": "ltr",
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "เลือกระบบการตรวจจับโรคพืชแล้ว",
                                            "align": "center",
                                            "contents": []
                                        }
                                    ]
                                },
                                "footer": {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ออกจากฟังก์ชัน",
                                                "text": "-q"
                                            },
                                            "style": "secondary"
                                        }
                                    ]
                                }
                            }
                        })
                    } else if (event.message.text.substring(0, 1) == '4') {
                        insideFunction[event.source.userId] = '4'
                        console.log(insideFunction)
                        return client.pushMessage(event.source.userId, {
                            type: "flex",
                            altText: "This is a Flex message",
                            contents: {
                                "type": "bubble",
                                "direction": "ltr",
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "เลือกระบบการให้คำแนะนำแล้ว",
                                            "align": "center",
                                            "contents": []
                                        }
                                    ]
                                },
                                "footer": {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ออกจากฟังก์ชัน",
                                                "text": "-q"
                                            },
                                            "style": "secondary"
                                        }
                                    ]
                                }
                            }
                        })
                    } else if (event.message.text == '6638') {
                        return client.pushMessage(event.source.userId, {
                            type: "flex",
                            altText: "กรุณาเลือกโหมดใช้งานดังนี้",
                            contents:
                            {
                                "type": "bubble",
                                "direction": "ltr",
                                "header": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "Header",
                                            "align": "center",
                                            "contents": []
                                        }
                                    ]
                                },
                                "hero": {
                                    "type": "image",
                                    "url": "https://vos.line-scdn.net/bot-designer-template-images/bot-designer-icon.png",
                                    "size": "full",
                                    "aspectRatio": "1.51:1",
                                    "aspectMode": "fit"
                                },
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "Body",
                                            "align": "center",
                                            "contents": []
                                        }
                                    ]
                                },
                                "footer": {
                                    "type": "box",
                                    "layout": "horizontal",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "postback",
                                                "label": "Button",
                                                "text": "ส่งกลับ",
                                                "data": "อะไร"
                                            }
                                        }
                                    ]
                                }
                            }
                        })
                    }
                    else {
                        return client.pushMessage(event.source.userId, {
                            type: "flex",
                            altText: "This is a Flex message",
                            contents: {
                                "type": "bubble",
                                "direction": "ltr",
                                "header": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "Mode Selecting",
                                            "size": "xxs",
                                            "align": "start",
                                            "gravity": "center",
                                            "contents": []
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xxl",
                                            "color": "#FFFFFFFF"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xl",
                                            "color": "#130F0FFF"
                                        },
                                        {
                                            "type": "text",
                                            "text": "ขออภัย เราไม่ทราบโหมดของคุณ",
                                            "weight": "regular",
                                            "align": "center",
                                            "margin": "xl",
                                            "contents": []
                                        },
                                        {
                                            "type": "text",
                                            "text": "กรุณาเลือกโหมด",
                                            "align": "center",
                                            "gravity": "center",
                                            "contents": []
                                        },
                                        {
                                            "type": "text",
                                            "text": "จาก4ฟังก์ชั่นต่อไปนี้",
                                            "align": "center",
                                            "gravity": "bottom",
                                            "margin": "none",
                                            "contents": []
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xxl"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "none",
                                            "color": "#000000FF"
                                        }
                                    ]
                                },
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ระบบตรวจจับแมลง",
                                                "text": "1"
                                            },
                                            "color": "#3EBC18FF",
                                            "margin": "none",
                                            "height": "md",
                                            "style": "primary"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xl",
                                            "color": "#FFFFFFFF"
                                        },
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ระบบตรวจจับวัชพืช",
                                                "text": "2"
                                            },
                                            "color": "#3EBC18FF",
                                            "style": "primary"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xl"
                                        },
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ระบบตรวจจับโรคพืช",
                                                "text": "3"
                                            },
                                            "color": "#3EBC18FF",
                                            "style": "primary"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xl"
                                        },
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ระบบการให้คำแนะนำ",
                                                "text": "4"
                                            },
                                            "color": "#3EBC18FF",
                                            "style": "primary"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xxl",
                                            "color": "#FFFFFFFF"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xxl",
                                            "color": "#000000FF"
                                        },
                                        {
                                            "type": "separator",
                                            "margin": "xl",
                                            "color": "#FFFFFFFF"
                                        },
                                        {
                                            "type": "button",
                                            "action": {
                                                "type": "message",
                                                "label": "ออกจากระบบ",
                                                "text": "logout"
                                            },
                                            "color": "#B9B9B9FF",
                                            "style": "primary"
                                        }
                                    ]
                                }
                            }
                        })
                    }
                }
            } else if (event.message.text == 'ku admin') {
                logid[event.source.userId] = '1'
                return client.pushMessage(event.source.userId, {
                    type: "flex",
                    altText: "This is a Flex message",
                    contents: {
                        "type": "bubble",
                        "direction": "ltr",
                        "header": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "Mode Selecting",
                                    "size": "xxs",
                                    "align": "start",
                                    "gravity": "center",
                                    "contents": []
                                },
                                {
                                    "type": "separator",
                                    "margin": "xxl",
                                    "color": "#FFFFFFFF"
                                },
                                {
                                    "type": "separator",
                                    "margin": "xl",
                                    "color": "#130F0FFF"
                                },
                                {
                                    "type": "text",
                                    "text": "ลงทะเบียนชั่วคราวสำเร็จแล้ว",
                                    "weight": "regular",
                                    "align": "center",
                                    "margin": "xl",
                                    "contents": []
                                },
                                {
                                    "type": "text",
                                    "text": "กรุณาเลือกโหมด",
                                    "align": "center",
                                    "gravity": "center",
                                    "contents": []
                                },
                                {
                                    "type": "text",
                                    "text": "จาก4ฟังก์ชั่นต่อไปนี้",
                                    "align": "center",
                                    "gravity": "bottom",
                                    "margin": "none",
                                    "contents": []
                                },
                                {
                                    "type": "separator",
                                    "margin": "xxl"
                                },
                                {
                                    "type": "separator",
                                    "margin": "none",
                                    "color": "#000000FF"
                                }
                            ]
                        },
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "button",
                                    "action": {
                                        "type": "message",
                                        "label": "ระบบตรวจจับแมลง (ภาพ)",
                                        "text": "1"
                                    },
                                    "color": "#3EBC18FF",
                                    "margin": "none",
                                    "height": "md",
                                    "style": "primary"
                                },
                                {
                                    "type": "separator",
                                    "margin": "xl",
                                    "color": "#FFFFFFFF"
                                },
                                {
                                    "type": "button",
                                    "action": {
                                        "type": "message",
                                        "label": "ระบบตรวจจับวัชพืช (ภาพ)",
                                        "text": "2"
                                    },
                                    "color": "#3EBC18FF",
                                    "style": "primary"
                                },
                                {
                                    "type": "separator",
                                    "margin": "xl"
                                },
                                {
                                    "type": "button",
                                    "action": {
                                        "type": "message",
                                        "label": "ระบบตรวจจับโรคพืช (ภาพ)",
                                        "text": "3"
                                    },
                                    "color": "#3EBC18FF",
                                    "style": "primary"
                                },
                                {
                                    "type": "separator",
                                    "margin": "xl"
                                },
                                {
                                    "type": "button",
                                    "action": {
                                        "type": "message",
                                        "label": "ระบบการให้คำแนะนำ (ข้อความ)",
                                        "text": "4"
                                    },
                                    "color": "#3EBC18FF",
                                    "style": "primary"
                                },
                                {
                                    "type": "separator",
                                    "margin": "xxl",
                                    "color": "#FFFFFFFF"
                                },
                                {
                                    "type": "separator",
                                    "margin": "xxl",
                                    "color": "#000000FF"
                                },
                                {
                                    "type": "separator",
                                    "margin": "xl",
                                    "color": "#FFFFFFFF"
                                },
                                {
                                    "type": "button",
                                    "action": {
                                        "type": "message",
                                        "label": "ออกจากระบบ",
                                        "text": "logout"
                                    },
                                    "color": "#B9B9B9FF",
                                    "style": "primary"
                                }
                            ]
                        }
                    }
                })
            } else {
                return client.pushMessage(event.source.userId, {
                    type: "flex",
                    altText: "This is a Flex message",
                    contents: {
                        "type": "bubble",
                        "direction": "ltr",
                        "header": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "คุณยังไม่ได้ลงทะเบียนเข้าใช้งานระบบ",
                                    "flex": null,
                                    "align": "start",
                                    "contents": []
                                },
                                {
                                    "type": "text",
                                    "text": "กรุณาลงทะเบียนก่อน",
                                    "contents": []
                                },
                                {
                                    "type": "separator",
                                    "margin": "xl",
                                    "color": "#110C0CFF"
                                }
                            ]
                        },
                        "hero": {
                            "type": "image",
                            "url": "https://vos.line-scdn.net/bot-designer-template-images/bot-designer-icon.png",
                            "size": "full",
                            "aspectRatio": "1.51:1",
                            "aspectMode": "fit"
                        },
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "หากคุณยังไม่มีสิทธิเข้าใช้งาน",
                                    "align": "center",
                                    "contents": []
                                },
                                {
                                    "type": "text",
                                    "text": "สามารถติดต่อทดลองใช้ - ซื้อlicense",
                                    "contents": []
                                },
                                {
                                    "type": "text",
                                    "text": "ได้ที่คณะผู้ประดิษฐ์โดยตรง",
                                    "contents": []
                                }
                            ]
                        },
                        "footer": {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "button",
                                    "action": {
                                        "type": "uri",
                                        "label": "ติดต่อเรา",
                                        "uri": "https://kus.kps.ku.ac.th"
                                    },
                                    "color": "#3EBC18FF",
                                    "style": "primary",
                                    "gravity": "bottom"
                                }
                            ]
                        }
                    }
                })
            }

        } else if (event.message.type == 'image') {
            const id = insideFunction[event.source.userId]
            if (id == '1') {
                pest(event)
            } else if (id == '2') {
                unwened_plant(event)
            } else if (id == '3') {
                rice_disease(event)
            } else if (id == '4') {
                return client.pushMessage(event.source.userId, {
                    type: "flex",
                    altText: "This is a Flex message",
                    contents: {
                        "type": "bubble",
                        "direction": "ltr",
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "กรุณาส่งข้อความ หรือ ออกจากโหมดส่งช้อความ",
                                    "align": "center",
                                    "contents": []
                                }
                            ]
                        },
                        "footer": {
                            "type": "box",
                            "layout": "horizontal",
                            "contents": [
                                {
                                    "type": "button",
                                    "action": {
                                        "type": "message",
                                        "label": "นำฉันออกจากโหมดส่งข้อความ",
                                        "text": "-q"
                                    },
                                    "style": "secondary"
                                }
                            ]
                        }
                    }
                })
            }else{
                    return client.pushMessage(event.source.userId, {
                        type: "flex",
                        altText: "This is a Flex message",
                        contents: {
                            "type": "bubble",
                            "direction": "ltr",
                            "header": {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "คุณยังไม่ได้ลงทะเบียนเข้าใช้งานระบบ",
                                        "flex": null,
                                        "align": "start",
                                        "contents": []
                                    },
                                    {
                                        "type": "text",
                                        "text": "กรุณาลงทะเบียนก่อน",
                                        "contents": []
                                    },
                                    {
                                        "type": "separator",
                                        "margin": "xl",
                                        "color": "#110C0CFF"
                                    }
                                ]
                            },
                            "hero": {
                                "type": "image",
                                "url": "https://vos.line-scdn.net/bot-designer-template-images/bot-designer-icon.png",
                                "size": "full",
                                "aspectRatio": "1.51:1",
                                "aspectMode": "fit"
                            },
                            "body": {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "หากคุณยังไม่มีสิทธิเข้าใช้งาน",
                                        "align": "center",
                                        "contents": []
                                    },
                                    {
                                        "type": "text",
                                        "text": "สามารถติดต่อทดลองใช้ - ซื้อlicense",
                                        "contents": []
                                    },
                                    {
                                        "type": "text",
                                        "text": "ได้ที่คณะผู้ประดิษฐ์โดยตรง",
                                        "contents": []
                                    }
                                ]
                            },
                            "footer": {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "button",
                                        "action": {
                                            "type": "uri",
                                            "label": "ติดต่อเรา",
                                            "uri": "https://kus.kps.ku.ac.th"
                                        },
                                        "color": "#3EBC18FF",
                                        "style": "primary",
                                        "gravity": "bottom"
                                    }
                                ]
                            }
                        }
                    })
            }
        } else {
            return client.pushMessage(event.source.userId, {
                type: "flex",
                altText: "This is a Flex message",
                contents: {
                    "type": "bubble",
                    "direction": "ltr",
                    "header": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "text": "Mode Selecting",
                                "size": "xxs",
                                "align": "start",
                                "gravity": "center",
                                "contents": []
                            },
                            {
                                "type": "separator",
                                "margin": "xxl",
                                "color": "#FFFFFFFF"
                            },
                            {
                                "type": "separator",
                                "margin": "xl",
                                "color": "#130F0FFF"
                            },
                            {
                                "type": "text",
                                "text": "ขออภัย เราไม่ทราบโหมดของคุณ",
                                "weight": "regular",
                                "align": "center",
                                "margin": "xl",
                                "contents": []
                            },
                            {
                                "type": "text",
                                "text": "กรุณาเลือกโหมด",
                                "align": "center",
                                "gravity": "center",
                                "contents": []
                            },
                            {
                                "type": "text",
                                "text": "จาก4ฟังก์ชั่นต่อไปนี้",
                                "align": "center",
                                "gravity": "bottom",
                                "margin": "none",
                                "contents": []
                            },
                            {
                                "type": "separator",
                                "margin": "xxl"
                            },
                            {
                                "type": "separator",
                                "margin": "none",
                                "color": "#000000FF"
                            }
                        ]
                    },
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "button",
                                "action": {
                                    "type": "message",
                                    "label": "ระบบตรวจจับแมลง (ภาพ)",
                                    "text": "1"
                                },
                                "color": "#3EBC18FF",
                                "margin": "none",
                                "height": "md",
                                "style": "primary"
                            },
                            {
                                "type": "separator",
                                "margin": "xl",
                                "color": "#FFFFFFFF"
                            },
                            {
                                "type": "button",
                                "action": {
                                    "type": "message",
                                    "label": "ระบบตรวจจับวัชพืช (ภาพ)",
                                    "text": "2"
                                },
                                "color": "#3EBC18FF",
                                "style": "primary"
                            },
                            {
                                "type": "separator",
                                "margin": "xl"
                            },
                            {
                                "type": "button",
                                "action": {
                                    "type": "message",
                                    "label": "ระบบตรวจจับโรคพืช (ภาพ)",
                                    "text": "3"
                                },
                                "color": "#3EBC18FF",
                                "style": "primary"
                            },
                            {
                                "type": "separator",
                                "margin": "xl"
                            },
                            {
                                "type": "button",
                                "action": {
                                    "type": "message",
                                    "label": "ระบบการให้คำแนะนำ (ข้อความ)",
                                    "text": "4"
                                },
                                "color": "#3EBC18FF",
                                "style": "primary"
                            },
                            {
                                "type": "separator",
                                "margin": "xxl",
                                "color": "#FFFFFFFF"
                            },
                            {
                                "type": "separator",
                                "margin": "xxl",
                                "color": "#000000FF"
                            },
                            {
                                "type": "separator",
                                "margin": "xl",
                                "color": "#FFFFFFFF"
                            },
                            {
                                "type": "button",
                                "action": {
                                    "type": "message",
                                    "label": "ออกจากระบบ",
                                    "text": "logout"
                                },
                                "color": "#B9B9B9FF",
                                "style": "primary"
                            }
                        ]
                    }
                }
            })
        }
    } else {
        console.log('webhook redelivery')
    }
}

async function downloadcontent(mid, downloadpath) {
    const stream = await client.getMessageContent(mid)
    const piplineSync = util.promisify(pipeline)
    const folder_download = fs.createWriteStream(downloadpath)
    await piplineSync(stream, folder_download)
}

app.listen(4000, () => {
    console.log('listening on 4000')
})







async function pest(event) {
    if (event.message.contentProvider.type === 'line') {
        const dlpath = path.join(__dirname, 'download', `${event.message.id}.jpg`)
        const filename = `${event.message.id}.jpg`
        await downloadcontent(event.message.id, dlpath)
        console.log('download compleat', filename)

        const axios = require("axios");
        const fs = require("fs");
        const image = fs.readFileSync(`C:/Users/kendo/OneDrive/เดสก์ท็อป/line2/download/${filename}`, {
            encoding: "base64"
        });
        await axios({
            method: "POST",
            url: "https://detect.roboflow.com/kusk-ai-pest-detection/1",
            params: {
                api_key: "1mimHtmRAmNkqIUyYaGQ"
            },
            data: image,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(function (response) {
                pestdata = response.data
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error.message);
            });

        await sleep(10000);
        console.log(pestdata)
        if ((pestdata.predictions.length == 0)) {
            delete insideFunction[event.source.userId]
            return client.pushMessage(event.source.userId, { type: 'text', text: 'ไม่พบแมลงในภาพดังกล่าว' })
        } else {
            if ((pestdata.predictions.length == 1)) {
                var name = pestdata.predictions.class
                console.log(pestdata.predictions.class)
                console.log(pestdata.predictions[0].class)
                var name = pestdata.predictions[0].class
            } else {
                var name = pestdata.predictions[0].class
                console.log(pestdata.predictions[0].class)
            }

            if (name === 'predators') {
                found = ['แมลงตัวห้ำ', 'https://puechkaset.com/wp-content/uploads/2014/03/มวนเพชรฆาต.jpg', 'คือ แมลงตัวห้ำ ซึ่งมาหลายชนิด เป็นแมลงที่มีประโยชน์ต่อเกษตรกร ปกติแล้ว หากินเหยื่อที่เป็นแมลงด้วยกันเป็นอาหาร บางชนิดเป็นแมลงตัวห้ำทั้งในระยะที่เป็นตัวอ่อนและตัวเต็มวัย  จะออกหากินเหยื่อโดยการกัดกินตัวเหยื่อ หรือ การดูดกินของเหลวในตัวเหยื่อ โดยแมลงตัวหำ้นั้นสามารถช่วยกำจัดแมลงศัตรูพืชได้ ข้อมูลเพิ่มเติม https://www.dnp.go.th/foremic/nforemic/Predator/index_Pred.htm']
            } else if (name === 'Bombaylocust') {
                found = ['ตั๊กแตนปาทังกา', 'https://static.thairath.co.th/media/dFQROr7oWzulq5FZYjmzvpRNySEkykSu74U4XkpnyjW6IpLOWOXpnLucWrPg8Gb8TFJ.jpg', 'คือตั๊กแตนปาทังกา เป็นตั๊กแตนที่มีขนาดใหญ่ ตัวอ่อนจะมีสีเขียว เหลือง แต่เมื่อเป็นตัวแก่จะมีสีน้ำตาลอ่อนหรือสีน้ำตาลเข้ม  ลักษณะเด่นชัด คือ ที่แก้มทั้ง 2 ข้าง มีแถบสีดำ พาดจากขอบตารวมด้านล่างถึงปาก  ส่วนอกตรงกลางจะคอดเข้าเล็กน้อย  ด้านข้างอกทั้ง 2 ด้าน มีแถบสีน้ำตาลดำ พาดเป็นทางยาว ต่อไปยังปีกหน้าจนถึงปลายปีก 1-2 แถบ  ด้านหลังมีแถบสีเหลืองอ่อน พาดจากส่วนหัวจนถึงปลายปีก ปีกยาวคลุมปิดปลายปล้องท้อง   ตั๊กแตนปาทังกานั้นมักจะมีนิสัยที่จะกัดกินใบและต้นข้าว สามารถกำจัดได้โดยการใช้น้ำหมักสะเดา ตรวจสอบข้อมูลเพิ่มเติม https://tinyurl.com/3ukpcrm9']
            } else if (name === 'stinkbug') {
                found = ['แมลงสิง', 'https://phichit.doae.go.th/province/wp-content/uploads/2022/09/ดาวน์โหลด.jpg', 'คือแมลงสิง เป็นแมลงมวนชนิดหนึ่ง มีอีกชื่อว่าแมลงฉง ตัวเต็มวัยมีรูปร่างเพรียวยาว ตัวด้านบนสีน้ำตาล ปล่อยกินเหม็นออกมาจากส่วนท้องได้ เมื่อเราสัมผัสหรืไปรบกวนมันจะบินหนี แลงสิงนั้นมักจะดูดกินเมล็ดข้าวทั้งเมล็ดอ่อนและเมล็ดแข็งโดยตัวเต็มวัยจะทำความเสียหายมากกว่า เพราะดูดกินเป็นเวลานานกว่าทำให้เมล็ดลีบ หรือเมล็ดไม่สมบูรณ์และผลผลิตข้าวลดลง การป้องกันกำจัด 1). กำจัดวัชพืชในนาข้าว คันนาและรอบๆแปลง 2).ใช้สวิงโฉบจับตัวอ่อนและตัวเต็มวัยในนาข้าวที่พบระบาดและนำมาทำลาย 3). ตัวเต็มวัยชอบกินเนื้อเน่า นำเนื้อเน่าแขวนไว้ตามนาข้าว และจับมาทำลาย 4). หลีกเลี่ยงการปลูกข้าวต่อเนื่องเพื่อลดการแพร่ขยายพันธุ์ ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=56-1.htm']
            } else if (name === 'brownplanthopper') {
                found = ['เพลี้ยกระโดดสีน้ำตาล', 'http://webold.ricethailand.go.th/rkb3/bug_002_05.jpg', 'คือเพลี้ยกระโดดสีน้ำตาล ตัวเต็มวัยมีลำตัวสีน้ำตาลถึงสีน้ำตาลปนดำ ส่วนใหญ่วางไข่ที่กาบใบข้าว หรือเส้นกลางใบ โดยวางไข่เป็นกลุ่ม เรียงแถวตามแนวตั้งฉากกับกาบใบข้าว บริเวณที่วางไข่จะมีรอยช้ำเป็นสีน้ำตาล ไข่มีลักษณะรูปกระสวยโค้งคล้ายกล้วยหอม มีสีขาวขุ่น เพลี้ยกระโดดสีน้ำตาลนั้นมักจะดูดกินน้ำเลี้ยวต้นข้าว ทำให้ต้นข้าวมีอาการใบเหลืองแห้งเป็นหย่อม ๆ หรือใบไหม้ และเพลี้ยกระโดดสีน้ำตาลยังเป็นตัวนำเชื้อไวรัส โรคใบหงิก มาสู่ต้นข้าว ทำให้ต้นข้าวมีอาการแคระแกร็น ตรวจสอบข้อมูลเพิ่มเติมได้ที่  ในแหล่งที่มีการระบาด และควบคุมระดับน้ำในนาได้ หลังปักดำหรือหว่าน 2-3 สัปดาห์จนถึงระยะตั้งท้องควบคุมน้ำในแปลงนาให้พอดินเปียก หรือมีน้ำเรี่ยผิวดินนาน 7-10 วัน แล้วปล่อยขังทิ้งไว้ให้แห้งเองสลับกันไป จะช่วยลดการระบาดของเพลี้ยกระโดดสีน้ำตาล http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=46-1.htm']
            } else if (name === 'riceleaffolder') {
                found = ['หนอนห่อใบข้าว', 'http://webold.ricethailand.go.th/rkb3/rice_xx2-05_bug03_clip_image004.jpg', 'คือหนอนห่อใบข้าว เต็ม มาจะแทะผิวใบข้าวส่วนที่เป็นสีเขียว ทำให้เห็นเป็นแถบยาวสีขาว มีผลให้การสังเคราะห์แสงลดลง หนอนจะใช้ใยเหนียวที่สกัดจากปาก ดึงขอบใบข้าวทั้งสองด้านเข้าหากันเพี่อห่อหุ้มตัวหนอนไว้หนอนจะทำลายใบข้าว ทุกระยะการเจริญเติบโตของข้าว ตรวจสอบข้อมูลเพิ่มเติม https://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=50-1.htm วิธีกำจัด สามารถใช้น้ำส้มควันไม้ได้ ในแหล่งที่มีการระบาด และควบคุมระดับน้ำในนาได้ หลังปักดำหรือหว่าน 2-3 สัปดาห์จนถึงระยะตั้งท้องควบคุมน้ำในแปลงนาให้พอดินเปียก หรือมีน้ำเรี่ยผิวดินนาน 7-10 วัน แล้วปล่อยขังทิ้งไว้ให้แห้งเองสลับกันไป จะช่วยลดการระบาดของเพลี้ยกระโดดสีน้ำตาล https://www3.rdi.ku.ac.th/?p=34938']
            } else if (name === 'Mealydug') {
                found = ['เพลี้ยแป้ง', 'http://webold.ricethailand.go.th/rkb3/rice_xx2-05_bug87_clip_image004.jpg', 'คือเพลี้ยแป้ง มีลำตัวเป็นข้อ ปล้อง รูปร่างกลมหรือยาวรี ส่วนหัวและขาอยู่ใต้ลำตัว มี 6 ขา ไม่มีปีก มีผงแป้งคลุมตัว ปากเป็นแบบดูดกิน ขยายพันธุ์ได้ทั้งโดยการใช้เพศและไม่ใช้เพศ เพลี้ยแป้งนั้นมักจะดูดกินน้ำเลี้ยงของต้นข้าว ทำให้ต้นข้าวใบเหลืองจนแห้งตายทั้งกอ หากต้นข้าวที่ไม่ตายออกรวงมาจะทำให้ข้าวมีเมล็ดลีบ ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=49-1.htm สามารถกำจัดได้โดย การใช้น้ำหมักสะเดา http://www.pmc06.doae.go.th/pdf%20file%20pmc%20knowledge/Azadirechtine.pdf']
            } else if (name === 'yellowstemborer') {
                found = ['หนอนกอข้าวสีครีม', 'http://webold.ricethailand.go.th/rkb3/bug_020.jpg', 'คือหนอนกอข้าวสีครีม ตัวหนอนสีขาวหรือครีม หัวสีน้ำตาลแกมเหลือง ลำตัวยาว หัวท้ายเรียวแหลม มี 6 ระยะ และเข้าดักแด้ภายในลำตัวบริเวณข้อปล้องเหนือผิวน้ำ ทำให้กาบใบมีสีเหลืองหรือน้ำตาล ซึ่งจะเห็นเป็นอาการช้ำๆ เมื่อฉีกกาบใบดูจะพบตัวหนอน ตรวจข้อมูลเพิ่มเติม http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=44-1.htm อาจใช้บิวเวอร์เรียในการกำจัด http://www.pmc08.doae.go.th/beauveria.htm']
            } else if (name === 'ricethrips') {
                found = ['เพลี้ยไฟ', 'http://webold.ricethailand.go.th/rkb3/bug_001.jpg', 'คือเพลี้ยไฟ เป็นเพลี้ยชนิดหนึง แมลงจำพวกปากดูด ขนาดเล็กลำตัวยาวประมาณ 1-2 มิลลิเมตร มีทั้งชนิดมีปีกและไม่มีปีก เพลี้ยไฟทั้งตัวอ่อนและตัวเต็มวัยจะทำลายข้าวโดยการดูดกินน้ำเลี้ยง จากใบข้าวที่ยังอ่อนโดยอาศัยอยู่ตามซอกใบ ระบาดในระยะกล้า เมื่อใบข้าวโตขึ้นใบที่ถูกทำลายปลายใบจะเหี่ยวขอบใบจะม้วนเข้าหากลางใบ ข้อมูลเพิ่มเติม http://www.ricethailand.go.th/rkb3/Insect.htm  ใช้บิวเวอร์เรีย และน้ำส้มควันไม้ในการกำจัด http://www.pmc08.doae.go.th/beauveria.htm  https://www3.rdi.ku.ac.th/?p=34938']
            } else if (name === 'ScarabBeetle') {
                found = ['มวนง่าม,ด้วงดำ,แมลงหล่า', 'http://webold.ricethailand.go.th/rkb3/bug_n001.jpg', 'อาจจะเป็น มวนง่าม ด้วงดำ หรือแมลงหล่า เนื่องจากมีลักษณะที่คล้ายกัน มวนง่ามเคลื่อนที่ช้าและชอบเกาะนิ่งอยู่ตามส่วนต่างๆของต้นข้าวทำลายข้าวโดยดูดกินน้ำเลี้ยงจากลำต้นและใบ มวนง่ามมีปากแบบเจาะดูด มี Stylet พับอยู่ใต้ส่วนหัว มวนง่ามทุกวัยสามารถทำลายข้าวโดยใช้ Stylet เจาะลงไปในใบและลำต้นข้าวแล้วดูดกินน้ำเลี้ยง จากส่วนต่างๆ ของต้นข้าว ทำให้ลำต้นและใบเหี่ยวเฉา นอกจากนี้ตัวเต็มวัยซึ่งมีขนาดใหญ่ เมื่อไปเกาะตามลำต้นและใบ เป็นจำนวนมาก สามารถทำให้ลำต้น และใบในระยะกล้าและหลังปักดำใหม่หักพับเสียหายมากด้วงดำ เป็นแมลงจำพวกด้วงปีกแข็งชนิดหนึ่งซึ่งเป็นศัตรูที่สำคัญของการปลูกข้าว โดยวิธีหว่านข้าวแห้งในภาคตะวันออกเฉียงเหนือ เมื่อถอนต้นข้าวขึ้นมารากข้าวจะหลุดทำให้เข้าใจว่าด้วงชนิดนี้ทำลายรากข้าว ด้วย แต่ ถ้าใช้วิธีขุดต้นข้าวที่แสดงอาการใบเหลือง เหี่ยว จะพบว่ารากข้าวไม่ถูกกัดกินแต่อย่างไร ด้วงดำจะเคลื่อนย้ายทำลายข้าวต้นอื่นๆโดยการทำโพรงอยู่ใต้ดินในระดับใต้ราก ข้าวทำให้เห็นรอยขุยดินเป็นแนว ส่วนใหญ่มักพบตัวเต็มวัยของด้วงดำชนิดนี้ 1 ตัวต่อจุดที่ขุดสำรวจ และพบไข่มีลักษณะกลมสีขาวขุ่นขนาดเท่าเม็ดสาคูขนาดเล็ก 5-6 ฟอง แมลงหล่า เป็นมวนชนิดหนึ่ง มีลักษณะค่อนข้างกลมคล้ายโล่ห์ ด้านหัวและอกเป็นรูปสามเหลี่ยม ลำตัวมีสีน้ำตาลหรือดำเป็นมันวาว ตัวอ่อนและตัวเต็มวัยดูดกินน้ำเลี้ยงจากกาบใบข้าวบริเวณโคนต้นข้าว ทำให้บริเวณที่ถูกทำลายเป็นสีน้ำตาลแดงหรือเหลือง การป้องกันกำจัดแมลงหล่า 1) ใช้แสงไฟฟ้าล่อแมลงและทำลายในช่วงที่มีการระบาด 2) ปลูกข้าวที่มีอายุเก็บเกี่ยวสั้นเพื่อลดการเพิ่มประชากรในนาข้าว 3 ) กำจัดวัชพืชที่ขึ้นหนาแน่นในนาข้าวการป้องกันกำจัดด้วงดำ 1.ควรหว่านข้าวตามฤดูกาล (สิงหาคม) ไม่ควรหว่านช่วงระหว่างปลายเมษายนถึงต้นมิถุนายน 2. ล่อและทำลายตัวเต็มวัยของด้วงดำ โดยใช้หลอดไฟชนิดแบล็กไลท์ที่เกษตรกรในภาคตะวันออกเฉียงเหนือนิยมใช้ล่อแมลงดานา 3. สำรวจนาข้าวเมื่อพบตัวเต็มวัยด้วงดำในกับดักแสงไฟปริมาณมากกว่าปกติการป้องกันกำจัดมวนง่าม 1). เก็บกลุ่มไข่ทำลาย 2). ใช้สวิงโฉบจับตัวอ่อนและตัวเต็มวัยไปทำลาย ข้อมูลเพิ่มเติม http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=40-1.htm http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=53-1.htm http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=55-1.htm ']
            } else if (name === 'redcucurbitleafbeetle') {
                found = ['ด้วงเต่าแตงแดง', 'https://www.dynamicseeds.com/sites/3926/files/u/บทความ/ด้วงเต่าแตง/1.jpg', 'คือ ด้วงเต่าแตงแดง เป็นแมลงปีกแข็งสีแดงแสด จะมีสีของลำตัว 2 สี คือ ชนิดสีดำ และเต่าแตงชนิดสีแดง เคลื่อนไหวช้า กัดกินใบพืช กินเป็นวง ๆ กัดที่โคนต้นพืช จึงทำให้พืชเป็นแผล ข้อมูลเพิ่มเติม https://tinyurl.com/y5masx94  กำจัดโดยการใช้กากกาแฟ หรือน้ำส้มควันไม้ ในการขับไล่ https://kasetgo.com/t/topic/41278 https://www3.rdi.ku.ac.th/?p=34938']
            } else if (name === 'human') {
                found = ['มนุษย์', 'https://mpics.mgronline.com/pics/Images/555000004672601.JPEG', 'คือมนุษย์ มนุษย์เป็นสัตว์สายพันธุ์หนึ่งที่อยู่ในกลุ่มสัตว์เลี้ยงลูกด้วยนม  มนุษย์เป็นสัตว์ที่มีความสามารถในการคิด แสดงอารมณ์ และมีการสื่อสารด้วยภาษา รวมถึงสามารถสร้างเครื่องมือและเทคโนโลยีต่าง ๆ เพื่อชีวิตอยู่ร่วมกับสิ่งแวดล้อมได้อย่างหลากหลาย มนุษย์มีลักษณะพิเศษ คือ มีสมองใหญ่เมื่อเทียบกับขนาดตัว โดยเฉพาะสมองชั้นนอก สมองส่วนหน้า และสมองกลีบขมับที่พัฒนาเป็นอย่างดี ข้อมูลเพิ่มเติม https://tinyurl.com/3xfzbfns']
            } else if (name === 'ricegallmidge') {
                found = ['แมลงบั่ว', 'http://webold.ricethailand.go.th/rkb3/bug_015.jpg', 'คือแมลงบั่ว มีลักษณะคล้ายยุงหรือริ้น  ตัวหนอนคล้ายหนอนแมลงวัน ส่วนใหญ่ระบาดในภาคเหนือตอนบนหรือภาคตะวันออกเฉียงเหนือ (ภาคอีสาน) ตัวหนอนที่ฟักจากไข่จะคลานตามบริเวณกาบใบเพื่อแทรกตัวเข้าไปในกาบใบ เข้าไปอาศัยกัดกินที่จุดกำเนิดของหน่ออ่อน ทำลายยอดข้าวทำให้ข้าวไม่สามารถออกรวงได้ ทำให้ต้นข้าวและกอข้าวแคระแกรน ในระยะที่ข้าวแตกกอจะเป็นระยะแมลงบั่วนั้นจะทำลายหรืระบาดมาก พบมากในช่วงฤดูฝน ตรวจสอบข้อมูลได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=45-1.htm สามารถกำจัดได้โดยการกำจัดวัชพืชบริเวณนา ไม่ควรใช้ยาฆ่าแมลง เนื่องจากไม่สามารถทำลายแมลงบั่วได้']
            } else if (name === 'Goldenapplesnail') {
                found = ['หอยเชอรี่', 'https://f.ptcdn.info/090/017/000/1395728290-Pomaceacan-o.jpg', 'คือหอยเชอรี่ หอยโข่งอเมริกาใต้ หรือ หอยเป๋าฮื้อน้ำจืด กินข้าวอ่อนจนถึงระยะข้าวแตกกอ โดยจะเริ่มต้นเข้ากัดกินต้นกล้าข้าวใต้น้ำเหนือจากพื้นดิน 1- 2 นิ้ว แล้วจึงกัดกินส่วนใบที่อยู่เหนือน้ำจนหมด วิธีการกำจัด อาจจะใช้เป็นกากชา หรือ กากกาแฟโรยบริเวณนาข้าว https://kasetgo.com/t/topic/41278 หรือจุดที่มีหอยเชอร์รี่อาศัยอยู่ได้ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://tinyurl.com/ueekauek']
            } else if (name === 'Mite') {
                found = ['ตัวไร', 'https://dh-thailand.com/wp-content/uploads/2020/03/dustmites.jpg', 'คือตัวไร มีขนาดเล็กสามารถมองเห็นไรขาวได้โดยการมองผ่านกล้องจุลทรรศน์ เป็นศัตรูพืชชีวภาพอย่างหนึ่ง มักพบระบาดหนักในฤดูฝนช่วงเดือนกรกฎาคมถึงกันยายน ทำให้เกิดการหยุดเจริญในพืช วิธีการป้องกันและกำจัด ตรวจดูไรขาวบนใบพืชตั้งแต่เริ่มปลูกอย่างสม่ำเสมอ ถ้าเริ่มตรวจพบให้รีบกำจัดโดยการใช้สารฆ่าเฉพาะไร อาจเป็นสารสกัดจากพืช  หรือศัตรูทางชีวภาพของไรขาวเช่นไรตัวห้ำ']
            } else if (name === 'caterpillar') {
                found = ['หนอนบุ้ง', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0hJkBDBgTbt71LEw6iEzFpRwmc2vGEQluTiOn79NTFQ&s', 'คือหนอนบุ้ง บุ้ง เป็นระยะตัวอ่อนของผีเสื้อ ตามลำตัวจะมีขนคัน โดยที่ปลายขนจะมีลักษณะเป็นหนามแหลม ตรงกลางเป็นท่อกลวง ซึ่งขนของบุ้งจะมีพิษ เป็นอันตรายต่อมนุษย์ โดยน้ำพิษจะถูกหลั่งออกมาเมื่อถูกสัมผัส เป็นศัตรูพืชของต้นหม่อนเนื่องจากมักพบกินใบของต้นหม่อน สามารถใช้ น้ำที่สกัดจาก ยาสูบ ตะไคร้หอม ขมิ้นชัน ผกากรอง สะเดา ในการฉีดพ่นเพื่อไล่หนอนบุ้งได้ ข้อมูลเพิ่มเติม https://www.scimath.org/article-science/item/9100-2018-10-18-08-32-45 https://www.baanlaesuan.com/109057/plant-scoop/larva_butterfly ']
            } else if (name === 'riceblackbug') {
                found = ['แมลงหล่า', 'https://erawanagri.com/wp-content/uploads/2023/01/rice-black-bug-300x300.png', 'คือ แมลงหล่า ตัวอ่อนและตัวเต็มวัยดูดกินน้ำเลี้ยงจากกาบใบข้าวบริเวณโคนต้นข้าว ทำให้บริเวณที่ถูกทำลายเป็นสีน้ำตาลแดงหรือเหลือง ขอบใบข้าวเปลี่ยนเป็นสีน้ำตาลดำคล้ายข้าวเป็นโรคไหม้ ตามข้อของลำต้นข้าวเป็นบริเวณที่แมลงหล่าชอบเพราะเป็นแหล่งที่มีน้ำเลี้ยง ทำให้กอข้าวแคระแกร็น วิธีการกำจัดใช้แสงไฟฟ้าล่อแมลงและทำลายในช่วงที่มีการระบาด เนื่องจากแมลงหล่าชอบบินมาเล่นแสงไฟเวลากลางคืน https://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=55-1.htm']
            } else if (name === 'ricerootweevil') {
                found = ['ด้วงงวงกินรากข้าว', 'https://expertpestsystem.com/images/knowledge/sitophilus-oryzae-2.jpg', 'คือด้วงงวงกินรากข้าว ตัวเต็มวัยมีสีน้ำตาลดำ ระบาดในบางพื้นที่  ด้านหัวมีส่วนโค้งยื่นออกมา ตัวหนอนที่ฟักออกมาจะกัดกินบริเวณรากข้าว หนอนมีสีขาว และเข้าดักแด้จนกระทั่งเป็นตัวเต็มวัย ทำลายข้าวโดยตัวหนอนกัดกินรากข้าว ทำให้ต้นข้าวเหี่ยวและแห้งตาย เนื่องจากรากข้าวถูกหนอนกัดกินจนหมด ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=54-1.htm การป้องกันและกำจัด กำจัดวัชพืชรอบแปลงนา การปล่อยน้ำเข้านา']
            } else if (name === 'ricehispa') {
                found = ['แมลงดำหนาม', 'https://www.doa.go.th/fc/nakhonsawan/wp-content/uploads/2020/06/damnaml2-243x300.jpg', 'คือแมลงดำหนาม หนอนกัดกินภายในใบข้าว คล้ายหนอนชอนใบ ตัวเต็มวัยกัดกินผิวใบข้าวด้านบน ทำให้เกิดเป็นรอยขูดเป็นทางสีขาวยาวขนานกับเส้นกลางใบของใบข้าว ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=52.htm อาจจะแก้โดยการไม่ใช้ปุ๋ยไนโตรเจนมากเกินไป']
            } else if (name === 'zigzagleafhopper') {
                found = ['เพลี้ยจักจั่นปลายปีกหยัก', 'https://www.unicorgroup.com/images/content/original-1671091720397.jpg', 'คือเพลี้ยจักจั่นปีกลายหยัก ปีกสองข้างมีลายหยักสีน้ำตาลเป็นทาง ทั้งตัวอ่อนและตัวเต็มวัยดูดกินน้ำเลี้ยงจากใบและกาบใบข้าว ข้าวที่ถูกทำลายปลายใบจะแห้งและขอบใบเปลี่ยนเป็นสีส้ม ต่อมาข้าวทั้งใบจะ เป็นสีส้มและขอบใบหงิกงอ อาการของโรคจะปรากฏที่ใบแก่ก่อน นอกจากนี้ยังเป็นพาหะนำโรคใบสีส้ม ตรวจสอบข้อมูลเพิ่มเติมได้ที่http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=48-1.htm อาจจะใช้แสงไฟเพื่อล่อแมลง']
            } else if (name === 'greenriceleafhopper') {
                found = ['เพลี้ยจักจั่น', 'https://www.luckyworm.net/wp-content/uploads/2023/03/เพลี้ยจักจั่น1.jpg', 'คือเพลี้ยจักจั่น เพลี้ยจักจั่นสีเขียวเป็นแมลงจำพวกปากดูด ที่พบทำลายข้าวในประเทศไทย มี2ชนิด ตัวเต็มวัยของแมลงทั้ง 2 ชนิดมีสีเขียวอ่อนและอาจมีแต้มดำบนหัวหรือปีก ขนาดลำตัวยาว ตัวเต็มวัยไม่มีชนิดปีกสั้น เคลื่อนย้ายรวดเร็วเมื่อถูกรบกวน  สามารถบินได้เป็นระยะทางไกลหลายกิโลเมตร  ชอบบินมาเล่นไฟตอนกลางคืน ข้อมูลเพิ่มเติม http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=47.htm การป้องกันกำจัด 1). ใช้แสงไฟล่อแมลงและทำลายเมื่อมีการระบาดรุนแรง 2). ปลูกข้าวพร้อม ๆ กัน และปล่อยพื้นนาว่างไว้ระยะหนึ่ง เพื่อตัดวงจรชีวิตของแมลง']
            } else if (name === 'riceearcutting') {
                found = ['หนอนกระทู้คอรวง', 'https://www.unicorgroup.com/images/content/original-1511080468255.jpg', 'คือ หนอนกระทู้คอรวง หนอนกระทู้คอรวงมีอีกชื่อคือ หนอนกระทู้ควายพระอินทร์ ตัวเต็มวัยเป็นผีเสื้อกลางคืน ปีกคู่หน้าสีน้ำตาลอ่อน แทรกสีน้ำตาลแดง ชอบกัดกินส่วนคอรวงหรือระแง้ของรวงข้าวที่กำลังจะสุก ทำให้คอรวงขาด หนอนจะกัดกินต้นข้าวทุกวันจนกระทั่งเข้าดักแด้ พบระบาดมากหลังน้ำท่วมหรือฝนตกหนัก หลังผ่านช่วงแล้งที่ยาวนานแล้วตามด้วยฝนตกหนัก การทำลายจะเสียหายรุนแรง ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://www.ricethailand.go.thrkb3/title-index.php-file=content.php&id=58-1.htm อาจกำจัดได้โดยการกำจัดวัชพืชบริเวณนา']
            } else if (name === 'fly') {
                found = ['แมลงวัน', 'https://www.cheminpestcontrol.com/cdn/shop/products/1_6d7f492d-af19-4cab-a12c-c939b518d1d2_grande.jpg?v=1543376715', 'คือแมลงวัน เป็นแมลงที่อาศัยอยู่กับชุมชนมนุษย์ชนิดหนึ่ง ส่วนมากคนจะรู้จักบางชนิด มักจะกินอาหารที่เป็นเนื้อสัตว์และเศษอาหาร ตามกองขยะ และชอบหากินเวลากลางวัน อาจใช้กาวดักแมลงวัน แต่แมลงวันไม่ได้ถือเป็นแมลงศัตรูพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://www.cheminpestcontrol.com/products/product-36']
            } else if (name === 'ant') {
                found = ['มด', 'https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcSROuAANlKCYJYO097DEsN1JnGplyAPTTG-sfq7AZ1-QKd40gCit1UTsx7H79DoSula', 'คือมด มดเป็นสัตว์สังคมในกลุ่มแมลง ซึ่งเป็นสัตว์เล็ก ๆ มดมีลักษณะก้านตัวแบ่งออกเป็นส่วนๆ ประกอบด้วยศอก ลำตัวและสะโพก มดมีเปลือกแข็งที่เรียกว่าเกราะ ซึ่งช่วยปกป้องส่วนของตัวมดและให้ความแข็งแรง แต่มดไม่ได้เป็นศัตรูพืช ซึ่งไม่ได้มีการทำลายต้นพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://www.cheminpestcontrol.com/blogs/ant/infoant']
            } else if (name === 'cockroach') {
                found = ['แมลงสาบ', 'https://www.baygon.co.th/~/media/raid/bugs/roaches/large-roaches/american-roach.png?la=th-th', 'คือแมลงสาบ มีลักษณะลำตัวยาวรีเป็นรูปไข่ เป็นสีดำหรือสีน้ำตาลเข้ม มีส่วนหัวซ่อนอยู่ใต้อก มีหนวดยาวคล้ายเส้นด้าย ส่วนขายาวมีหนามคลุม ตัวเต็มวัยมีทั้ง มีปีกและไม่มีปีก เป็นแมลงที่หากินตามพื้นดินเป็นหลักตามที่มืด ๆ หรือในเวลากลางคืน ไม่ชอบที่จะบิน และวิ่งได้เร็วมาก ไม่เป็นศัตรูพืช หรือกล่าวได้ว่าแมลงสาบไม่ได้ทำอันตรายต่อพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://www.one-step.co.th/?p=29']
            } else if (name === 'LonghornedGrasshopper') {
                found = ['ตั๊กแตนหนวดยาว', 'https://www.greenbestproduct.com/images/content/original-1529337586512.jpg', 'คือ ตั๊กแตนหนวดยาว  ลักษณะเด่นมีหนวดยาวกว่าลำตัว หัวและอกสีเขียว ฟีเมอร์ของขาคู่หลังขยายใหญ่มีสีเขียว ส่วนปลายที่ติดกับทิเบียจะเรียวเล็ก ทิเบียมีหนามสีดำ ปีกหน้าสีเขียวปนน้ำตาล เป็นตัวห้ำกินไข่ผีเสื้อหนอนกอ ตัวอ่อนของเพลี้ยกระโดดและเพลี้ยจักจั่น ช่วยกำจัดศัตรูพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://tinyurl.com/3fjc3r9v']
            } else if (name === 'ladybug') {
                found = ['เต่าทอง', 'http://webold.ricethailand.go.th/rkb3/rice_xx2-05_bug58_clip_image002_0002.jpg', 'คือเต่าทอง จัดเป็นแมลงขนาดเล็กเมื่อเทียบกับแมลงปีกแข็งทั่วไป  ลำตัวอ้วนกลม ส่วนใหญ่ที่พบในประเทศไทย มักมีปีกสีแดง ส้ม เหลือง และมักจะแต้มด้วยสีดำเป็นจุด ไม่ได้เป็นศัตรูพืชแต่กำจัด(กิน)ศัตรูพืชตามธรรมชาติ (เป็นตัวห้ำ) https://oer.learn.in.th/search_detail/result/261694']
            } else if (name === 'spider') {
                found = ['แมลงมุม', 'https://ichef.bbci.co.uk/news/640/cpsprodpb/e5df/live/b95dbe80-d23d-11ed-8875-2716ed28db16.jpg', 'คือแมงมุม จัดเป็นสิ่งมีชีวิตพวกสัตว์ขาปล้อง มี 8 ขา แมงมุมมีลำตัวเพียงสองส่วนเท่านั้น  และส่วนที่เป็นลำตัวประกอบไปด้วยส่วนหัวและส่วนอกเชื่อมติดต่อกัน ส่วนหลังเรียกว่าส่วนท้อง แมงมุมจะไม่มีปีก ไม่ได้เป็นศัตรูพืชแต่มีส่วนในการกำจัดศัตรูพืชตามธรรมชาติ ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://tinyurl.com/4dwzaddx']
            } else if (name === 'dragonfly') {
                found = ['แมลงปอ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Dragonfly_%282%29.jpg/800px-Dragonfly_%282%29.jpg', 'คือแมลงปอ มีจุดเด่น คือ มีส่วนหัวที่กลมโตใหญ่ มีดวงตาขนาดใหญ่ 2 ดวงอยู่ด้านข้าง แมลงปอ มีขากรรไกรล่างที่แข็งแรง แหลมคม มีขนาดใหญ่ โฉบจับแมลงต่าง ๆ กินเป็นอาหาร ไม่ใช่ศัตรูพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=86-1.htm']
            } else if (name === 'longhornedcicada') {
                found = ['จักจั่นหนวดยาว', 'https://www.greenbestproduct.com/images/content/original-1529242851724.jpg', 'คือ จักจั่นหนวดยาว เป็นแมลงที่มีตาขนาดใหญ่ อยู่ด้านข้างของหัว มีประสาทการรับรู้ที่ดีอยู่บนปีก ดูดกินน้ำเลี้ยงจากพืชเป็นอาหาร ซึ่งมีหนวดยาวและมีรูปร่างที่สวยงาม เป็นแมลงที่มีขนาดใหญ่มากถึง 2-6 เซนติเมตร และมีหนวดยาวอันหนาที่เรียกว่า "หนวดกราด" ซึ่งเป็นเอกลักษณ์ที่แตกต่างจากแมลงส่วนใหญ่ ส่วนใหญ่จักจั่นหนวดยาวมีเปลือกแข็งและเป็นเพลียวเรียว โดยมีสีและลวดลายที่หลากหลาย ข้อมูลเพิ่มเติม https://tinyurl.com/ah7kbbvy ใช้บิวเวอร์เรียกำจัด http://www.pmc08.doae.go.th/beauveria.htm']
            } else if (name === 'Bugs') {
                found = ['มวน', 'https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcTrDLGUNI_aPMCcGbZgALOFxy_7t5YfGjmD2KBQyJoPfpAY88mTAjaSFNAScbyWrury', 'คือมวน มวนดูดไข่มีสีน้ำตาล ปีกหน้าสีน้ำตาลอ่อนตลอดทั้งปีก เป็นตัวห้ำทำลายไข่เพลี้ยกระโดดและเพลี้ยจักจั่น มีอีกชนิดคล้าย ๆ กันคือ มวนเขียวดูดไข่มีสีเขียวหนวด หัว และอกสีดำ เพศผู้โคนปีกหน้าสีเขียว ปลายปีกสีเทาหรือดำอ่อน เป็นตัวห้ำดูดกินไข่เพลี้ยกระโดดสีน้ำตาลและเพลี้ยจักจั่นทำให้ไข่แฟบ มวนตัวห้ำนี้เป็นศัตรูธรรมชาติของเพลี้ยกระโดดสีน้ำตาล ตรวจสอบข้อมูลมวนดูดไข่ได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=74-1.htm ตรวจสอบข้อมูลมวนเขียวดูดไข่ได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=73-1.htm']
            } else if (name === 'Colliurispensylvanica') {
                found = ['ด้วงดิน', 'https://www.greenbestproduct.com/images/content/original-1529337110533.jpg', 'คือด้วงดิน  ตัวเต็มวัยยาวประมาณ 7-8 มิลลิเมตร หนวดยาว ปลายหนวดมีสีน้ำตาลดำเข้ม อกส่วนหน้ายาวกลมลักษณะคล้ายคอ มีสีน้ำตาลแดง  ด้วงดินเป็นตัวห้ำของตัวอ่อนและตัวเต็มวัยของเพลี้ยกระโดดและเพลี้ยจักจั่น หนอนและดักแด้ของผีเสื้อกินใบ  ไข่ผีเสื้อหนอน  หนอนและดักแด้แมลงบั่ว ดังนั้นจึงช่วยกำจัดแมลงศัตรูพืชได้ ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=78-1.htm']
            } else if (name === 'Habrobraconhebetor') {
                found = ['แตนเบียนหนอน', 'https://lh3.googleusercontent.com/proxy/P7M6WkLa3HxNR5oGwUR2GBzmUFee7AXZA5D8UtzpFR-SXp-PFztLiRJW70doixFlQClNoy9-j8Bp36NnXTw0UmjnVMX-E7GacrRhfPRjabbB-UlWb9AdaA', 'คือแตนเบียนหนอน ตัวเต็มวัยมีขนาดยาวประมาณ 8 มิลลิเมตร สีน้ำตาลดำ ส่วนปล้องท้องมีสีน้ำตาลแดง มีสีน้ำตาลดำแถบพาดขวางเป็นช่วงๆ  เป็นแตนเบียนของหนอนกอแถบลาย  หนอนกอสีครีม และหนอนห่อใบข้าว ช่วยลดปริมาณของศัตรูพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=65-1.htm']
            } else if (name === 'Paederusdermatitis') {
                found = ['ด้วงก้นกระดก', 'https://www.sikarin.com/wp-content/uploads/2022/01/adult-whiplash-beetle-genus-paederus2-1024x683.jpeg', 'คือด้วงก้นกระดก เป็นด้วงขนาดเล็ก โคนหนวดสีน้ำตาลแดง ส่วนปลายสีน้ำตาลดำ มีขนตามปล้องหนวด หัวแบนสีดำ อกหน้าแบนยาว สีน้ำตาลไหม้ ปีกมีสีดำ ปีกสีน้ำเงินเข้มเป็นแมลงที่มีอายุอยู่ได้ยาวนาน มีความว่องไว ไต่ไปตามต้นข้าว และบินได้ ช่วยควบคุมการระบาดของแมลงศัตรูพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=77-1.htm ส่วนโทษ ของด้วงก้นกระดกคือ หากเราสัมผัสถูกพิษของมันเข้าอาจจะทำให้เกิดแผลพุพองได้ ตรวจสอบข้อมูลเพิ่เติมได้ที่ https://tinyurl.com/2s4j7rf6']
            } else if (name === 'riceseedlingarmyworm') {
                found = ['หนอนกระทู้กล้า', 'https://erawanagri.com/wp-content/uploads/2023/01/rice-seedling-armyworm-300x300.png', 'คือ หนอนกระทู้กล้า แมลงที่ใช้ปากกัด และทำลายต้นข้าวในระยะที่เป็นตัวหนอนเท่านั้น ตัวแก่ของมันมีลักษณะคล้ายผีเสื้อ ตัวหนอนจะเข้าทำลายต้นกล้า โดยใช้ปากกัดกินใบตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://web.ku.ac.th/nk40/nk/data/03/lab1k62.htm วิธีการกำจัด เอาต้นหญ้า หรือฟางข้าวมากองไว้บนคันนา เพื่อล่อให้ตัวหนอนเข้าไปอาศัยในเวลากลางวัน ในเวลาบ่ายให้เก็บเอาตัวหนอนออกมาทำลาย หรืออาจใช้น้ำส้มควันไม้ https://www3.rdi.ku.ac.th/?p=34938']
            } else if (name === 'Mantis') {
                found = ['ตั๊กแตนตำข้าว', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Praying_mantis_india.jpg/800px-Praying_mantis_india.jpg', 'คือ ตั๊กแตนตำข้าว ตัวเมียมีขนาดที่ตัวใหญ่กว่าตัวผู้ มีลำตัวสีเขียว หรือสีน้ำตาล มีอกปล้องแรกยาว มีลักษณะท่าทีชอบยืนขยับตัวขึ้นลง ๆ เนื่องจากมีขาคู่หน้าที่พัฒนาให้กลายเป็นขาหนีบใช้สำหรับจับเหยื่อ เวลาเมื่อไม่ได้ใช้งาน มักจะยกขึ้นประกบกันอยู่ที่ด้านหน้า เป็นแมลงที่ควบคุมศัตรูพืช แมลงชนิดนี้มีรูปร่างค่อนข้างยาวและมีหนวดยาวสองอันที่ยื่นออกมาจากหัว ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://www.jardineriaon.com/mantis-religiosa.html']
            } else {
                found = `Answer is over paramiter Error code : Thanakool name of class is ${name}`
                delete insideFunction[event.source.userId]
                return client.pushMessage(event.source.userId, { type: 'text', text: found })
            }
            delete insideFunction[event.source.userId]
            senddata(found, name, event)
        }
    }
}





async function unwened_plant(event) {
    if (event.message.contentProvider.type === 'line') {
        const dlpath = path.join(__dirname, 'download', `${event.message.id}.jpg`)
        const filename = `${event.message.id}.jpg`
        await downloadcontent(event.message.id, dlpath)
        console.log('download compleat', filename)

        const axios = require("axios");
        const fs = require("fs");
        const image = fs.readFileSync(`C:/Users/kendo/OneDrive/เดสก์ท็อป/line2/download/${filename}`, {
            encoding: "base64"
        });
        axios({
            method: "POST",
            url: "https://detect.roboflow.com/weed-zbmth/1",
            params: {
                api_key: "aG4lCnEDUN94j6kCBNT9"
            },
            data: image,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(function (response) {
                pestdata = response.data
                console.log(response.data);z
            })
            .catch(function (error) {
                console.log(error.message);
            });

        await sleep(10000);
        console.log(pestdata)

        if ((pestdata.predictions.length == 0)) {
            delete insideFunction[event.source.userId]
            return client.pushMessage(event.source.userId, { type: 'text', text: 'ไม่มีพบวัชพืชในภาพดังกล่าว' })
        } else {
            var name = pestdata.predictions[0].class
            if (name === 'eastindianjewsmallow') {
                found = ['ปอวัชพืช', 'https://thaifarmer.lib.ku.ac.th/f/0dd38e743e7d4e0a1ba67ba718e4b45bdd2b5dcbc2632b4ea04f1a210de10eff.jpeg', 'คือ ปอวัชพืช หรือ กระเจานา ลำต้นตั้งตรงแตกกิ่งก้านสาขามาก สูงประมาณ 1 เมตรมีลำต้นแข็ง มีใบกว้าง ชอบขึ้นในสภาพไร่ มีลำต้นสูง ใบใหญ่คล้ายปอกระเจาขึ้นในนาหว่านข้าวแห้ง ขยายพันธุ์ด้วยเมล็ด 1. เมื่อเริ่มมีฝนหรือจะเริ่มทำนา ควรรอให้ปอวัชพืชงอกขึ้นมา พอสมควรก่อนแล้วจึงทำการไถดะ 2. หลังจากนั้นเว้นช่วงให้มีฝนตกและปอวัชพืชงอกมาอีกแล้วจึงไถแปร 3. และหากจะคราดควรจะทิ้งให้ปอวัชพืชงอกมาอีกครั้ง หลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ 4.สำหรับนาหยอดหลังข้าวงอกให้กำจัดด้วยการใช้จอบถากก่อนที่ใบข้าวจะเจริญเติบโตยาวปกคลุมผิวดินจนหมดโดยทำ 2 ครั้งคือ ครั้งที่ 1 หลังข้าวงอก 2 สัปดาห์ และครั้งที่ 2 หลังข้าวงอก 4 สัปดาห์']
            } else if (name === 'bermudagrass') {
                found = ['หญ้าแพรก', 'https://medthai.com/wp-content/uploads/2014/07/ต้นหญ้าแพรก.jpg', 'คือ หญ้าแพรก ลำต้นทอดนาบกับพื้นและยกสูงขึ้นได้ประมาณ 30 ซ.ม. แผ่นใบแหลมเล็กแคบเรียว ผิวใบเกลี้ยง ลิ้นใบเป็นแผ่นบาง ช่อดอกมี 3-7 ช่อดอกย่อยซี่งอยู่ติดกันตรงปลายโคนก้านเรียงเป็นวงรอบข้อ ขยายพันธุ์ด้วยเมล็ด, ไหล และลำต้นเจริญเติบโตได้ดีในสภาพดินแห้งและชื้นในข้าวไร่และนาดอนนาน้ำฝนจะขึ้นพร้อมข้าว 1. ไถดะเพื่อกลบทำลายหญ้าแพรกซึ่งมักขึ้นจากไหลตั้งแต่ได้รับฝนแรก แต่หากยังขึ้นมาได้อีกอาจต้องไถซ้ำ หากยังมีหลงเหลืออยู่ให้เก็บทำลายไหลและลำต้นให้หมดขณะที่คราดทำเทือก 2. นาหว่านข้าวแห้ง - เมื่อเริ่มมีฝนหรือจะเริ่มทำนาโดยการหว่านข้าวแห้ง หรือนาหยอดก็ตามควรรอให้หญ้าแพรกที่งอกจากเมล็ดขึ้นมาพอสมควรก่อนแล้วจึงทำการไถดะ - หลังจากนั้นเว้นช่วงให้มีฝนตกและหญ้าแพรกงอกมาอีกแล้วจึงไถแปร - และหากจะคราดควรจะทิ้งให้หญ้าแพรกงอกมาอีกครั้ง หลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ3.สำหรับนาหยอดหลังข้าวงอกให้กำจัดด้วยการใช้จอบถากก่อนที่ใบข้าวจะเจริญเติบโตยาวปกคลุมผิวดินจนหมดโดยทำ 2 ครั้ง คือ ครั้งที่ 1 หลังข้าวงอก 2 สัปดาห์ และครั้งที่ 2 หลังข้าวงอก 4 สัปดาห์']
            } else if (name === 'waterclover') {
                found = ['ผักแว่น', 'https://www.samunpri.com/wp-content/uploads/2018/12/Marsilea-crenata.jpg', 'คือ ผักแว่น ลำต้นทอดเลื้อยไปตามพื้น ใบมีสี่แฉกโดยมีก้านใบชูขึ้น ไม่มีดอกไม่มีเมล็ดขยายพันธุ์ด้วยไหล และสปอร์ โดยสปอร์เป็นจุดสีดำอยู่ด้านหลังใบ ขึ้นในที่ชื้น มีน้ำขัง และทางน้ำหากดินแฉะรากจะหยั่งดินตื้นๆ หากมีน้ำขังจะลอยน้ำ ระบาดรุนแรงจะทำให้ข้าวไม่แตกกอและให้ผลผลิตต่ำ  1. นาดำให้ปักดำถี่ขึ้น และใช้พันธุ์ข้าวที่มีการเจริญเติบโตเร็ว สำหรับนาหว่านน้ำตม พบการระบาดของผักแว่นน้อย เนื่องจากต้นข้าวเบียดกันแน่น 2. การปลูกเลี้ยงแหนแดงให้เจริญเติบโตปกคลุมพื้นที่ผิวน้ำป้องกันการระบาดของผักแว่น']
            } else if (name === 'tallfringerush') {
                found = ['หญ้าหนวดปลาดุก', 'https://down-th.img.susercontent.com/file/a3a01b50e42e33f66d4f8523a54c5e0e', 'คือ หญ้าหนวดปลาดุก มีอีกชือคือ หนวดแมว, หญ้าน้ำร้อน    ใบแตกขึ้นเป็นกอ  แบนและบอบบางคล้ายพัด  ลำต้นอาจมีลักษณะกลมหรือเป็นสามเหลี่ยมไม่มีข้อปล้อง ใบไม่แยกเป็นก้านใบและแผ่นใบ  ใบแหลมแผ่นใบเล็กและยาว  ก้านชูดอกสูง 25-50 ซม.  ช่อดอกเป็นรูปคล้ายร่มซ้อนกันหลายชั้น  ประกอบด้วยดอกย่อย 50-100 ดอก  แต่ละดอกจะเป็นรูปกลมไม่มีก้าน ประกอบด้วยดอกจำนวนมาก  ออกดอกหลังงอกเพียง 1-2 เดือน  มีวงจรชีวิตประมาณ 3-4 เดือน  ชอบงอกในสภาพดินชื้น ไม่งอกใต้น้ำที่ลึกกว่า 2 ซม. เมื่องอกแล้วเจริญได้ในที่น้ำขัง  เติบโตได้ในที่แห้งและน้ำขัง  พบมากในที่ดินมีฟอสฟอรัสสูง  ขยายพันธุ์ด้วยเมล็ดแพร่ระบาดโดยลมและน้ำ ']
            } else if (name === 'swollenfingergrass') {
                found = ['หญ้ารังนก', 'https://media.komchadluek.net/media/img/size1/2017/04/07/97jhic9k858ka8fjihe86.jpg?x-image-process=style/LG', 'คือ หญ้ารักนก ลำnoต้นทอดไปกับพื้นและยกสูงขึ้นได้ประมาณ 30-100 ซ.ม. กาบใบเกลี้ยงลิ้นใบเป็นแผ่นบางด้านข้างมีขนยาว  ช่อดอกมี 9-12 แขนง ช่อดอกย่อยซี่งอยู่กระจายปลายโคน ก้านดอกลักษณะเหมือนพู่   ออกดอกตลอดปี  ขยายพันธุ์ด้วยเมล็ด  โดยทั่วไปแล้วจะงอกพร้อมข้าวและมักพบในที่รกร้างและริมถนน " 1. เมื่อเริ่มมีฝนหรือจะเริ่มทำนา ควรรอให้หญ้ารังนกงอกขึ้นมา พอสมควรก่อนแล้วจึงทำการไถดะ 2. หลังจากนั้นเว้นช่วงให้มีฝนตกและหญ้ารังนกงอกมาอีกแล้วจึงไถแปร 3. และหากจะคราดควรจะทิ้งให้หญ้ารังนกงอกมาอีกครั้ง หลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ 4.สำหรับนาหยอดหลังข้าวงอกให้กำจัดด้วยการใช้จอบถากก่อนที่ใบข้าวจะเจริญเติบโตยาวปกคลุมผิวดินจนหมดโดยทำ 2 ครั้ง คือ ครั้งที่ 1 หลังข้าวงอก 2 สัปดาห์  และครั้งที่ 2  หลังข้าวงอก 4 สัปดาห์"']
            } else if (name === 'indianheliotrope') {
                found = ['ผักงวงช้าง', 'https://newwebs2.ricethailand.go.th/webmain/rkb3/weed51_36.jpg', 'คือ ผักงวงช้าง ชอบขึ้นในสภาพไร่ มีดอกเป็นงวงยาว สีขาว ใบใหญ่ ไม่เรียบ มีขนตามลำต้นและใบ ต้นเตี้ย ขยายพันธุ์ด้วยเมล็ด มีขึ้นในนาหว่านข้าวแห้งและนาหยอด "   1. เมื่อเริ่มมีฝนหรือจะเริ่มทำนา ควรรอให้ผักงวงช้างงอกขึ้นมาพอสมควรก่อนแล้วจึงทำการไถดะ     2. หลังจากนั้นเว้นช่วงให้มีฝนตกและผักงวงช้างงอกมาอีกแล้วจึงไถแปร     3. และหากจะคราดควรจะทิ้งให้ผักงวงช้างงอกมาอีกครั้ง หลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ     4.สำหรับนาหยอดหลังข้าวงอกให้กำจัดด้วยการใช้จอบถาก ก่อนที่ใบข้าวจะเจริญเติบโตยาวปกคลุมผิวดินจนหมด โดยทำ 2 ครั้งคือ ครั้งที่ 1 หลังข้าวงอก 2 สัปดาห์ และครั้งที่ 2  หลังข้าวงอก 4 สัปดาห์  "']
            } else if (name === 'junglerice.') {
                found = ['หญ้านกสีชมพู', 'https://baka.co.th/wp-content/uploads/2020/07/หญ้านกสีชมพู-747x480.jpg', 'คือ หญ้านกสีชมพู ลำต้นตั้งตรงสูง 30-60 ซ.ม.  กอแผ่บนผิวดิน ใบมีความเรียวและเรียบ ออกดอกเมื่ออายุประมาณ 50 วันออกดอกได้ตลอดปีและมีวงจรชีวิตประมาณ 3 เดือน  ชอบงอกในสภาพดินแห้งและมีความชื้น  มักงอกพร้อมหรือหลังข้าว 1-2 สัปดาห์  ไม่สามารถยืดตัวหนีน้ำได้แต่ทนน้ำท่วมได้ 2 สัปดาห์ 1. หลังเก็บเกี่ยวข้าว ปล่อยให้แปลงนาให้แห้ง 1-2 สัปดาห์จากนั้นไขน้ำเข้านาให้แปลงอยู่ในสภาพดินชื้นเพื่อล่อให้เมล็ดหญ้านกสีชมพูงอก แล้วจึงไถดะ     2. ในกรณีที่มีการระบาดของหญ้านกสีชมพูรุนแรงให้ทำการล่อให้งอกแล้วไถทำลาย 1-2 ครั้ง แล้วจึงเตรียมดิน ปรับพื้นที่นาให้สม่ำเสมอเพื่อหว่านข้าวต่อไป     3.หากมีการเตรียมดินดีเรียบสม่ำเสมอ จะสามารถเอาน้ำเข้านาได้หลังหว่านข้าวงอกแล้ว 7 วัน โดยการขังน้ำจะควบคุมไม่ให้หญ้านกสีชมพูงอกขึ้นมาได้  แต่ที่งอกมาก่อนหน้าการขังน้ำก็ยังสามารถเจริญเติบโตได้       ']
            } else if (name === 'barnyardgrass') {
                found = ['หญ้าข้าวนก', 'https://lh3.googleusercontent.com/proxy/3pyMOxEhrg9kN3hn3EaMQWpQHz6lFhfeag5Va2lJ8B9OZY4eFhdwI_BkiaU0mHg0ML0jkHsUzjYhjamnmHUD9Uf9omwrue9PLmBV', 'คือ หญ้าข้าวนก หรือ หญ้าคอมมิวนิสต์ หรือ หญ้าพุ่มพวง ใบอ่อนจะเป็นคลื่นสีเขียวอ่อนถึงสีเขียว เส้นใบสีเขียวอ่อน ใบจะยาวกว่าใบข้าว ดอกเป็นช่อ ออกดอกได้ตลอดปีเมื่ออายุ 2-3 เดือน ชอบขึ้นในสภาพดินชื้นแฉะความชื้นตั้งแต่ 50 % สามารถงอกใต้น้ำได้ลึก 1-2 เซนติเมตร การขังน้ำไว้ประมาณ 3-7 วัน จะสามารถทำลายการพักตัวของเมล็ดได้ เจริญเติบโตได้ดีในสภาพน้ำขัง "1. ล่อให้งอกโดยการไขน้ำเข้านาแล้วขังไว้ 3 - 7 วัน ระบายน้ำออกทิ้งไว้ในสภาพดินชื้น 1-2 สัปดาห์ จะงอกขึ้นมาจำนวนมาก 2. เมื่อหญ้าข้าวนกงอกขึ้นมาเป็นจำนวนมากแล้วจึงไถกลบทำลาย และเตรียมดิน 3. หากมีการเตรียมดินดีเรียบสม่ำเสมอ จะสามารถเอาน้ำเข้านาได้หลังหว่านข้าวงอกแล้ว 7 วัน โดยขังน้ำลึกกว่า 2 เซนติเมตรจะควบคุมไม่ให้หญ้าข้าวนกงอกขึ้นมาได้ แต่ที่งอกมาก่อนหน้าการขังน้ำก็ยังสามารถเจริญเติบโตได้ "']
            } else if (name === 'redsprangletop') {
                found = ['หญ้าดอกขาว', 'http://webold.ricethailand.go.th/rkb3/weed04-2.jpg', 'คือ หญ้าดอกขาว หรือ หญ้าไม้กวาด หรือ หญ้าลิเก ลำต้นตรงหรือโน้ม ความสูง 12-120 ซ.ม.  ใบเรียบและปรกแหลมและเรียวยาว  กาบใบเรียบ มีเยื่อกันน้ำฝนเป็นแผ่นบาง ออกดอกได้ตลอดปี  ชอบขึ้นในสภาพดินแห้งถึงชื้น ไม่ชอบขึ้นในสภาพดินแฉะและไม่สามารถงอกใต้น้ำได้  หากงอกแล้วจะสามารถเจริญเติบโตได้ดีในสภาพน้ำขัง  แต่ไม่สามารถยืดตัวหนีน้ำได้ " 1. ล่อให้งอกในสภาพดินแห้งถึงชื้นแล้วไถกลบทำลาย     2.  ทำการล่อให้งอกแล้วไถกลบทำลาย 2-3  ครั้ง  จะช่วยทำลายเมล็ดสะสมในดินได้จำนวนมาก     3. หากมีการเตรียมดินเรียบสม่ำเสมอเพื่อหว่านข้าว จะสามารถเอาน้ำเข้านาได้หลังหว่านข้าวงอกแล้ว 7 วัน โดยการขังน้ำจะควบคุมไม่ให้หญ้าดอกขาวงอกขึ้นมาได้ แต่ที่งอกมาก่อนหน้าการขังน้ำก็ยังสามารถเจริญเติบโตได้"']
            } else if (name === 'pickerelweed') {
                found = ['ขาเขียด', 'http://webold.ricethailand.go.th/rkb3/weed06-2s.jpg', 'คือ ขาเขียด หรือ ผักอีฮีน พืชใบเลี้ยงเดี่ยว พืชน้ำที่รากหยั่งดินหรือในดินแฉะ ส่วนที่อยู่เหนือดินเป็นกอ ใบที่แตกจากลำต้นเรียงสลับสองแถว  สูงประมาณ 30 เซนติเมตร ช่อดอกออกที่กลางก้านใบ  ประกอบด้วยดอกย่อย 2-15 ดอก  สีม่วงน้ำเงินอ่อนหรือฟ้า  งอกได้ในที่ชื้นและน้ำขัง  ในสภาพที่ดินดี ขึ้นหนาแน่นน้อย น้ำตื้น  ใบจะป้อม  และเป็นปัญหารุนแรงในสภาพที่ดินมีความอุดมสมบูรณ์สูง แต่หากสภาพดินเลว หรือขึ้นหนาแน่นมาก หรือน้ำลึก  ใบจะแหลมเล็ก 1. เนื่องจากขาเขียดชอบสภาพน้ำขังการล่อให้งอกจึงต้องให้มีน้ำขังเล็กน้อย2. เมื่อปล่อยให้งอกสัก 1-2 สัปดาห์ แล้วจึงไถกลบทำลาย']
            } else if (name === 'smallflowerumbrellasedge') {
                found = ['กกขนาก', 'http://webold.ricethailand.go.th/rkb3/weed51_26.jpg', 'คือ กกขนาก ลำต้นมีลักษณะเป็นสามเหลี่ยมไม่มีข้อปล้อง ใบไม่แยกเป็นก้านใบและแผ่นใบ ก้านชูดอกสูง 30-40 ซ.ม. ดอกเป็นดอกช่อ ลักษณะแน่นกลม คล้ายร่มที่ซ้อนกัน ออกดอกตลอดปี เมื่ออายุ 2-3 เดือน ขยายพันธุ์ด้วยเมล็ด ชอบขึ้นในที่ชื้นแต่ไม่งอกใต้น้ำ เมื่องอกแล้วเจริญเติบโตได้ในที่น้ำขัง 1. ล่อให้งอกโดยการไขน้ำเข้านาแล้วขังไว้ 3 วัน  ระบายน้ำออกทิ้งไว้ในสภาพดินชื้น 1-2 สัปดาห์ กกขนากจะงอกขึ้นมาจำนวนมาก 2. เมื่อกกขนากงอกขึ้นมาเป็นจำนวนมากแล้วจึงไถกลบทำลาย และเตรียมดิน 3. หากมีการเตรียมดินดีเรียบสม่ำเสมอ  จะสามารถเอาน้ำเข้านาได้หลังหว่านข้าวงอกแล้ว 7 วัน โดยขังน้ำลึกกว่า 2 เซนติเมตรจะควบคุมไม่ให้กกขนากงอกขึ้นมาได้แต่ที่งอกมาก่อนหน้าการขังน้ำก็ยังสามารถเจริญเติบโตได้ 4. ระดับน้ำที่เพิ่มขึ้นอย่างรวดเร็วที่ท่วมยอดกกขนากจะทำให้เน่าตายได้ 5. การหว่านข้าวให้สม่ำเสมอไม่ปล่อยให้มีที่ว่างจะช่วยควบคุมกกขนากได้']
            } else if (name === 'swampmorningglory') {
                found = ['ผักบุ้ง', 'http://webold.ricethailand.go.th/rkb3/weed11-1s.jpg', 'คือ ผักบุ้ง ลำต้นกลมเป็นเถาเลื้อยยาวหลายเมตร ขยายพันธุ์ด้วยเมล็ดและลำต้น  ทั้งลำต้นและใบเมื่อตัดแล้วจะมียางสีขาว ลำต้นกลวงลอยน้ำได้ จึงสามารถอยู่ได้ในสภาพระดับน้ำลึกได้ 1. หากมีการระบาดของผักบุ้งอยู่ก่อนการเตรียมดินในขณะที่ไม่มีฝน ดินเริ่มแห้ง แดดแรง ให้ไถดะเพื่อพลิกกลบเถาผักบุ้ง 1-2 ครั้ง    2. เมื่อทำการไถแปรและคราดทำเทือก ให้คราดเอาเถาผักบุ้งเพื่อเก็บเถาขึ้นให้หมด เพราะผักบุ้งสามารถขยายพันธุ์จากลำต้นที่ขาดตกอยู่ในนาได้  3. ล่อให้งอกโดยการไชน้ำเข้านาแล้วขังไว้ 3 วัน ระบายน้ำออกทิ้งไว้ในสภาพดินชื้น 1-2 สัปดาห์ ผักบุ้งจะงอกขึ้นมาจำนวนมาก    4. เมื่อผักบุ้งงอกขึ้นมาเป็นจำนวนมากแล้วจึงไถกลบทำลาย ']
            } else if (name === 'wirebush') {
                found = ['เซ่งใบมน', 'http://webold.ricethailand.go.th/rkb3/weed51_15_1.jpg', 'คือ เซ่งใบมน ลำต้นสูง 50-170 ซม. เมล็ดพ้นระยะพักตัวได้ด้วยความร้อนจากการเผาฟางข้าว เมล็ดงอกได้ดีในสภาพดินแห้งถึงชื้น ไม่สามารถขึ้นน้ำได้ แต่เจริญเติบโตได้ในน้ำขัง ออกดอกราวกันยายน-ตุลาคม พบมากในนาหว่านข้าวแห้ง 1. หลังเผาฟางข้าวแล้วปล่อยให้ผ่านฝนตกหนักจนงอกขึ้นมาเป็นจำนวนมาก    2. เมื่อเซ่งใบมนงอกขึ้นมาเป็นจำนวนมากแล้วจึงไถกลบทำลาย และเตรียมดินสารกำจัดวัชพืช']
            } else if (name === 'spreadingdayflower') {
                found = ['ผักปราบนา', 'http://webold.ricethailand.go.th/rkb3/weed51_44.jpg', 'คือ ผักปราบนา ลำต้นและใบอวบน้ำเลื้อยใบแหลมยาว ขึ้นได้ในสภาพไร่หรือในที่ชื้นเจริญเติบโตได้ดีในที่ชื้นหรือมีน้ำขัง งอกพร้อมข้าวหรือหลังฝนตกหนักแข่งขันกับข้าวได้รุนแรงเพราะมีลำต้นยาวเจริญเติบโตได้ดีในที่น้ำลึกจึงอยู่ได้ในสภาพน้ำลึกแต่จะตายเมื่อถูกน้ำท่วมยอด ออกดอกในเดือนกันยายนเป็นต้นไป เนื่องจากลำต้นยาวและลอยน้ำได้ประกอบกับเป็นวัชพืชอายุข้ามปีจึงแข่งขันกับข้าวได้ไปจนถึงระยะเก็บเกี่ยว  1. เมื่อเริ่มมีฝนหรือจะเริ่มทำนา ควรรอให้ผักปราบนางอกขึ้นมาพอสมควรก่อนแล้วจึงทำการไถดะ   2. หลังจากนั้นเว้นช่วงให้มีฝนตกและผักปราบนางอกมาอีกแล้วจึงไถแปร   3. และหากจะคราดควรจะทิ้งให้ผักปราบนางอกมาอีกครั้งหลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ    4.สำหรับนาหยอดหลังข้าวงอกให้กำจัดด้วยการใช้จอบถากก่อนที่ใบข้าวจะเจริญเติบโตยาวปกคลุมผิวดินจนหมดโดยทำ 2 ครั้ง คือ ครั้งที่ 1 หลังข้าวงอก 2 สัปดาห์ และครั้งที่ 2 หลังข้าวงอก 4 สัปดาห์']
            } else if (name === 'waterprimrose') {
                found = ['เทียนนา', 'http://webold.ricethailand.go.th/rkb3/weed51_48.jpg', 'คือ เทียนนา ลำต้นตั้งตรงแตกกิ่งก้านสูง 25-70 ซ.ม. ขยายพันธุ์ด้วยเมล็ดชอบขึ้นในที่ชื้น ไม่สามารถงอกใต้น้ำ เมื่องอกแล้วเจริญเติบโตได้ในที่ชื้นหรือมีน้ำขังแต่ไม่สามารถยืดตัวหนีน้ำได้ ออกดอกเมื่ออายุประมาณ 2 เดือน เมล็ดสุกแก่และตายเมื่ออายุประมาณ 4 เดือน 1. ล่อให้งอกโดยการไขน้ำเข้านาแล้วขังไว้ 3 วัน ระบายน้ำออกทิ้งไว้ในสภาพดินชื้น 1-2 สัปดาห์ เทียนนาจะงอกขึ้นมาจำนวนมาก     2. เมื่อเทียนนางอกขึ้นมาเป็นจำนวนมากแล้วจึงไถกลบทำลายและเตรียมดิน   3. หากมีการเตรียมดินดีเรียบสม่ำเสมอ จะสามารถเอาน้ำเข้านาได้หลังหว่านข้าวงอกแล้ว 7 วัน โดยขังน้ำลึกกว่า 2 เซนติเมตร จะควบคุมไม่ให้เทียนนางอกขึ้นมาได้ แต่ที่งอกมาก่อนหน้าการขังน้ำก็ยังสามารถเจริญเติบโตได้ ']
            } else if (name === 'crowfootgrass') {
                found = ['หญ้าปากควาย', 'http://webold.ricethailand.go.th/rkb3/weed51_11.jpg', 'คือ หญ้าปากควาย หรือ หญ้าปากคอก  ลำต้นทอดนาบกับพื้นและยกสูงขึ้นได้ประมาณ 40-50 ซ.ม. กาบใบเป็นแผ่นหนาเนื้อหยาบ ลิ้นใบเป็นแผ่นบางมีขน ช่อดอกมี 4-5 ช่อดอกย่อยซี่งอยู่ติดกันตรงปลายโคนก้านดอก ออกดอกตลอดปี ขยายพันธุ์ด้วยเมล็ด เจริญเติบโตได้ดีในสภาพดินชื้นในข้าวไร่จะขึ้นพร้อมข้าว 1. เมื่อเริ่มมีฝนหรือจะเริ่มทำนา ควรรอให้หญ้าปากควายงอกขึ้นมาพอสมควรก่อนแล้วจึงทำการไถดะ   2. หลังจากนั้นเว้นช่วงให้มีฝนตกและหญ้าปากควายงอกมาอีกแล้วจึงไถแปร   3. และหากจะคราดควรจะทิ้งให้หญ้าปากควายงอกมาอีกครั้ง    หลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ   4.สำหรับนาหยอดหลังข้าวงอกให้กำจัดด้วยการใช้จอบถากก่อนที่ใบข้าวจะเจริญเติบโตยาวปกคลุมผิวดินจนหมดโดยทำ 2 ครั้งคือ ครั้งที่ 1 หลังข้าวงอก 2 สัปดาห์  และครั้งที่ 2  หลังข้าวงอก 4 สัปดาห์']
            } else if (name === 'fingergrass') {
                found = ['หญ้าตีนนก', 'http://webold.ricethailand.go.th/rkb3/weed51_30.jpg', 'คือ หญ้าตีนนก ลำต้นทอดไปกับพื้นและยกสูงขึ้นได้ประมาณ 30-50 เซนติเมตร กาบใบเกลี้ยง ลิ้นใบเป็นแผ่นยาว ช่อดอกมี 4-7 แขนง ช่อดอกย่อยซึ่งกระจายจากปลายโคนก้านลักษณะเหมือนพู่ โดยทั่วไปแล้วจะงอกพร้อมข้าว มักพบในที่รกร้างและริมถนน 1. เมื่อเริ่มมีฝนหรือจะเริ่มทำนา ควรรอให้หญ้าตีนนกงอกขึ้นมาพอสมควรก่อน แล้วจึงทำการไถดะ    2. หลังจากนั้นเว้นช่วงให้มีฝนตกและหญ้าตีนนกงอกมาอีกแล้วจึงไถแปร  3. และหากจะคราดควรจะทิ้งให้หญ้าตีนนกงอกมาอีกครั้ง หลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ   4.สำหรับนาหยอดหลังข้าวงอกให้กำจัดด้วยการใช้จอบถากก่อนที่ใบข้าวจะเจริญเติบโตยาวปกคลุมผิวดินจนหมดโดยทำ 2 ครั้ง คือ ครั้งที่ 1 หลังข้าวงอก 2 สัปดาห์  และครั้งที่ 2  หลังข้าวงอก 4 สัปดาห์']
            } else if (name === 'couchgrass') {
                found = ['หญ้าตีนหา', 'http://webold.ricethailand.go.th/rkb3/weed51_25.jpg', 'คือ หญ้าตีนกา หรือสะกาดน้ำเค็ม ลำต้นตั้งตรงหรือแผ่ราบไปกับพื้นมีลำต้นใต้ดินและไหลอยู่ใต้ดินอย่างหนาแน่น แตกกิ่งก้านในแนวราบ ชูช่อดอกสูงถึง 60 เซนติเมตรขยายพันธุ์ด้วยเมล็ด, ไหลและลำต้นใต้ดิน ชอบขึ้นในดินชื้นแฉะหรือน้ำขังและที่แห้ง มีการเจริญเติบโตรวดเร็ว พบมากในนาดำและนาหว่านข้าวแห้ง "1. ไถดะเพื่อกลบทำลายหญ้าชะกาดน้ำเค็มซึ่งมักขึ้นจากไหล ตั้งแต่ได้รับฝนแรก แต่หากยังขึ้นมาได้อีกอาจต้องไถซ้ำหากยังมีหลงเหลืออยู่ให้เก็บทำลายไหลและลำต้นให้หมดขณะที่คราดทำเทือก     2.  นาหว่านข้าวแห้ง  -  เมื่อเริ่มมีฝนหรือจะเริ่มทำนาโดยการหว่านข้าวแห้ง หรือนาหยอดก็ตาม ควรรอให้หญ้าชะกาดน้ำเค็มที่งอกจากเมล็ดขึ้นมาพอสมควรก่อนแล้วจึงทำการไถดะ    - หลังจากนั้นเว้นช่วงให้มีฝนตกและหญ้าแพรกงอกมาอีก แล้วจึงไถแปร    -  และหากจะคราดควรจะทิ้งให้หญ้าชะกาดน้ำเค็มงอกมา อีกครั้ง หลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ"']
            } else if (name === 'housepurslane') {
                found = ['ผักเบี้ยหิน', 'http://webold.ricethailand.go.th/rkb3/weed25-1s_2.jpg', 'คือ ผักเบี้ยหิน ลำต้นแผ่แนบไปตามพื้น ใบและลำต้นอวบน้ำ กิ่งก้านโปร่งมีขนละเอียดออกดอกได้ตลอดปี ผลมีลักษณะเป็นฝักอยู่ติดตามซอกใบขยายพันธุ์ด้วยเมล็ดงอกได้ในสภาพดินแห้งและชื้น เจริญเติบโตได้ในสภาพแห้งไม่ชอบสภาพน้ำขัง พบในข้าวไร่และนาดอนพื้นที่นาน้ำฝน 1. เมื่อเริ่มมีฝนหรือจะเริ่มทำนา ควรรอให้ผักเบี้ยหินงอกขึ้นมาพอสมควรก่อนแล้วจึงทำการไถดะ  2. หลังจากนั้นเว้นช่วงให้มีฝนตกและผักเบี้ยหินงอกมาอีกแล้วจึงไถแปร     3. และหากจะคราดควรจะทิ้งให้ผักเบี้ยหินงอกมาอีกครั้ง หลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ    4.สำหรับนาหยอดหลังข้าวงอกให้กำจัดด้วยการใช้จอบถากก่อนที่ใบข้าวจะเจริญเติบโตยาวปกคลุมผิวดินจนหมดโดยทำ 2 ครั้งคือ ครั้งที่ 1  หลังข้าวงอก 2 สัปดาห์  และครั้งที่ 2  หลังข้าวงอก 4 สัปดาห์ สารกำจัดวัชพืช']
            } else if (name === 'almorira') {
                found = ['สะอึก', 'http://webold.ricethailand.go.th/rkb3/weed27-1s.jpg', 'คือ สะอึก ชอบขึ้นในสภาพดินชื้นแฉะ ทนแล้ง แต่ก็เจริญเติบโตได้ในน้ำขังและทนน้ำท่วม มีลักษณะเป็นเถาเลื้อยเหนียว ระบบรากเหนียวแน่นถอนยาก เมื่อตัดใบหรือเถาจะมียางเหนียวสีขาวไหลออกมาขยายพันธุ์ด้วยเมล็ด มีขึ้นในนาดำและนาหว่านข้าวแห้ง  1. เมื่อเริ่มมีฝนหรือจะเริ่มทำนา ควรรอให้สะอึกงอกขึ้นมาพอสมควรก่อนแล้วจึงทำการไถดะ   2. หลังจากนั้นเว้นช่วงให้มีฝนตกและสะอึกงอกมาอีกแล้วจึงไถแปร 3. และหากจะคราดควรจะทิ้งให้สะอึกงอกมาอีกครั้ง  หลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ     4.สำหรับนาหยอดหลังข้าวงอกให้กำจัดด้วยการใช้จอบถากก่อนที่ใบข้าวจะเจริญเติบโตยาวปกคลุมผิวดินจนหมดโดยทำ 2 ครั้ง คือ ครั้งที่ 1 หลังข้าวงอก 2 สัปดาห์ และครั้งที่ 2  หลังข้าวงอก 4 สัปดาห์  ']
            } else if (name === 'slenderamaranth') {
                found = ['ผักโขมไร้หนาม', 'http://webold.ricethailand.go.th/rkb3/weed28-1s.jpg', 'คือ ผักโขมไร้หนาม หรือ ผักโขม ลำต้นตั้งตรง บางส่วนอาจราบไปกับพื้น สูง 30 - 90 เซนติเมตรชอบขึ้นในสภาพไร่ ดินร่วน ใบรูปร่างอ่อนนุ่ม ลำต้นอวบอ่อนเจริญเติบโตเร็วแตกกิ่งก้านออกด้านข้างมาก ขยายพันธุ์ด้วยเมล็ด ชอบขึ้นในนาหว่านข้าวแห้ง และนาหยอด  1. เมื่อเริ่มมีฝนหรือจะเริ่มทำนา ควรรอให้ผักโขมไร้หนามงอกขึ้นมาพอสมควรก่อนแล้วจึงทำการไถดะ      2. หลังจากนั้นเว้นช่วงให้มีฝนตกและผักโขมไร้หนามงอกมาอีกแล้วจึงไถแปร   3. และหากจะคราดควรจะทิ้งให้ผักโขมไร้หนามงอกมาอีกครั้ง   หลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ     4.สำหรับนาหยอดหลังข้าวงอกให้กำจัดด้วยการใช้จอบถากก่อนที่ใบข้าวจะเจริญเติบโตยาวปกคลุมผิวดินจนหมดโดยทำ 2 ครั้งคือ ครั้งที่ 1 หลังข้าวงอก 2 สัปดาห์ และครั้งที่ 2  หลังข้าวงอก 4 สัปดาห์ ']
            } else if (name === 'falsedaisy') {
                found = ['กะเม็ง', 'http://webold.ricethailand.go.th/rkb3/weed31-1s_2.jpg', 'คือ กะเม็ง ลำต้นกลมตั้งตรงสูง 30-60 ซ.ม. มีขนแข็งสากมือ แตกแขนงมาก ที่โคนต้นอาจมีสีแดงอมม่วง ใบเป็นใบเดี่ยวออกจากลำต้นตรงข้ามเป็นคู่ ใบค่อนข้างแคบเรียวยาว ไม่มีก้านใบ มีขนสั้นๆ สีขาวปกคลุมทั่วใบ ชอบขึ้นและเติบโตในสภาพดินมีความชื้นและแห้ง ขยายพันธุ์ด้วยเมล็ด ขึ้นได้ในสภาพไร่ ดินชื้น แฉะหรือน้ำขัง  1. เมื่อเริ่มมีฝนหรือจะเริ่มทำนา ควรรอให้กะเม็งงอกขึ้นมาพอสมควรก่อนแล้วจึงทำการไถดะ   2. หลังจากนั้นเว้นช่วงให้มีฝนตกและกะเม็งงอกมาอีกแล้วจึงไถแปร   3. และหากจะคราดควรจะทิ้งให้กะเม็งงอกมาอีกครั้ง หลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ     4.สำหรับนาหยอดหลังข้าวงอกให้กำจัดด้วยการใช้จอบถากก่อนที่ใบข้าวจะเจริญเติบโตยาวปกคลุมผิวดินจนหมดโดยทำ 2 ครั้ง คือ ครั้งที่ 1 หลังข้าวงอก 2 สัปดาห์  และครั้งที่ 2 หลังข้าวงอก 4 สัปดาห์']
            } else if (name === 'alyceclover') {
                found = ['ถั่วลิสงนา', 'http://webold.ricethailand.go.th/rkb3/weed32-1s.jpg', 'คือ ถั่วลิสงนา ชอบขึ้นในสภาพไร่ มีลำต้นแผ่คลุมดิน ใบกลมแตกออกในด้านตรงกันข้าม ขยายพันธุ์ด้วยเมล็ด มีในนาหว่านข้าวแห้ง 1. เมื่อเริ่มมีฝนหรือจะเริ่มทำนา ควรรอให้ถั่วลิสงนางอกขึ้นมาพอสมควรก่อนแล้วจึงทำการไถดะ   2. หลังจากนั้นเว้นช่วงให้มีฝนตกและถั่วลิสงนางอกมาอีกแล้วจึงไถแปร   3. และหากจะคราดควรจะทิ้งให้ถั่วลิสงนางอกมาอีกครั้ง หลังจากนั้นจึงหว่านข้าวแห้งและคราดกลบ   4.สำหรับนาหยอดหลังข้าวงอกให้กำจัดด้วยการใช้จอบถากก่อนที่ใบข้าวจะเจริญเติบโตยาวปกคลุมผิวดินจนหมดโดยทำ 2 ครั้ง คือ ครั้งที่ 1 หลังข้าวงอก 2 สัปดาห์  และครั้งที่ 2  หลังข้าวงอก 4 สัปดาห์']
            } else {
                found = 'Answer is over paramiter Error code : Thanakool'
                delete insideFunction[event.source.userId]
                return client.pushMessage(event.source.userId, { type: 'text', text: found })
            }
            delete insideFunction[event.source.userId]
            //senddata(found,name,event)
        }
    }
}





async function rice_disease(event) {
    if (event.message.contentProvider.type === 'line') {
        const dlpath = path.join(__dirname, 'download', `${event.message.id}.jpg`)
        const filename = `${event.message.id}.jpg`
        await downloadcontent(event.message.id, dlpath)
        console.log('download compleat', filename)

        const axios = require("axios");
        const fs = require("fs");
        const image = fs.readFileSync(`C:/Users/kendo/OneDrive/เดสก์ท็อป/line2/download/${filename}`, {
            encoding: "base64"
        });
        axios({
            method: "POST",
            url: "https://detect.roboflow.com/rice-disease-detect/2",
            params: {
                api_key: "XzOAiDFyhcjDKyvfHXPl"
            },
            data: image,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then(function (response) {
                pestdata = response.data
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error.message);
            });

        await sleep(10000);
        console.log(pestdata)

        if ((pestdata.predictions.length == 0)) {
            delete insideFunction[event.source.userId]
            return client.pushMessage(event.source.userId, { type: 'text', text: 'ไม่พบโรคพืขในภาพดังกล่าว' })
        } else {
            var name = pestdata.predictions[0].class
            if (name === 'SheathRotDisease') {
                found = ['โรคกาบใบเน่า', 'https://newwebs2.ricethailand.go.th/webmain/rkb3/โรคกาบใบเน่า%20(2).JPG', 'คือ โรคกาบใบเน่า พบมากในนาชลประทาน ภาคกลาง ข้าวจะแสดงอาการในระยะตั้งท้องโดยเกิดแผลสีน้ำตาลดำบนกาบห่อรวง ขนาดแผลประมาณ 2-7 x 4-18 มิลลิเมตร ตรงกลางแผลมีกลุ่มเส้นใยสีขาวอมชมพู แผลนี้จะขยายติดต่อกันทำให้บริเวณกาบหุ้มรวงมีสีน้ำตาลดำและรวงข้าวส่วนใหญ่โผล่ไม่พ้นกาบหุ้มรวง หรือโผล่ได้บางส่วน ทำให้เมล็ดลีบและมีสีดำ โดยมีตัวไรเป็นพาหะนำเชื้อ เชื้อรานี้ติดอยู่บนเมล็ดได้นาน นอกจากนี้ พบว่า “ไรขาว” ซึ่งอาศัยดูดกินน้ำเลี้ยงต้นข้าวในบริเวณกาบใบด้านใน สามารถเป็นพาหะช่วยทำให้โรคแพร่ระบาดได้รุนแรง และกว้างยิ่งขึ้น ควรใช้พันธุ์ข้าวที่ค่อนข้างต้านทานที่เหมาะสมกับสภาพท้องที่ เช่น กข27 สำหรับนาลุ่มที่มีน้ำขัง ใช้พันธุ์ข้าวที่ลำต้นสูง แตกกอน้อย ลดจำนวนประชากรไรขาว พาหะแพร่เชื้อ ในช่วงอากาศแห้งแล้ง ใช้ไตรโคโดม่า โดยการฉีดไตรโคโดม่าทุก ๆ 7 วัน หรือการใช้น้ำหมักมูลไส้เดือนโดยการนำมูลไส้เดือนไปหมักสามารถทำตามหรือตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://youtu.be/xiKjnYdO7XM?si=ju_Mg5APPrlQnYhU']
            } else if (name === 'SheathBlightDisease') {
                found = ['โรคกาบใบแห้ง', 'https://unilife.co.th/wp-content/uploads/2020/06/โรคกาบใบแห้งข้าว02.jpg', 'คือ โรคกาบใบแห้ง สามารถพบได้ในนาชลประทาน ภาคกลาง ภาคเหนือ และ ภาคใต้ เริ่มพบโรคในระยะแตกกอ จนถึงระยะใกล้เก็บเกี่ยว ยิ่งต้นข้าวมีการแตกกอ ต้นข้าวก็จะเบียดเสียดกันมากขึ้น โรคก็จะเป็นรุนแรง ลักษณะแผลเป็นสีเขียวปนเทา ปรากฏตามกาบใบ ตรงบริเวณใกล้ระดับน้ำ แผลจะลุกลามขยายใหญ่ขึ้นและลุกลามขยายขึ้นถึงใบข้าว ถ้าเป็นพันธุ์ข้าวที่อ่อนแอ แผลสามารถลุกลามถึงใบธงและกาบหุ้มรวงข้าว ทำให้ใบและกาบใบเหี่ยวแห้ง ผลผลิตจะลดลง เชื้อราสามารถสร้างเม็ดขยายพันธุ์ อยู่ได้นานในตอซังหรือวัชพืชในนาตามดินนา และสามารถอยู่ข้ามฤดูหมุนเวียนและทำลายข้าวได้ตลอดฤดูการทำนา "หลังเก็บเกี่ยวข้าว และเริ่มฤดูใหม่ ควรพลิกไถหน้าดินตากแดด เพื่อทำลายเม็ดขยายพันธุ์ ของเชื้อราสาเหตุโรค กำจัดวัชพืชตามคันนาและแหล่งน้ำ เพื่อทำลายพืชที่เป็นแหล่งอาศัยของเชื้อราสาเหตุโรค"']
            } else if (name === 'BacterialLeafStreak') {
                found = ['โรคใบขีดโปร่งแสง', 'https://newwebs2.ricethailand.go.th/webmain/rkb3/โรคใบขีดโปร่งแสง1%201.jpg', 'คือ โรคใบขีดโปร่งแสง ในนาน้ำฝน และ นาชลประทาน ภาคกลาง ภาคตะวันออกเฉียงเหนือ และ ภาคใต้ โรคนี้เป็นได้ตั้งแต่ระยะข้าวแตกกอจนถึงฺออกรวง อาการปรากฏที่ใบ เริ่มแรกเห็นเป็นขีดช้ำยาวไปตามเส้นใบ ต่อมาค่อยๆ เปลี่ยนเป็นสีเหลืองหรือส้ม เมื่อแผลขยายรวมกันก็จะเป็นแผลใหญ่ แสงสามารถทะลุผ่านได้ และพบแบคทีเรียในรูปหยดน้ำสีเหลืองคล้ายยางสนกลมๆ ขนาดเล็กปรากฏอยู่บนแผล ความยาวของแผลขึ้นอยู่กับความต้านทานของพันธุ์ข้าว และความรุนแรงของเชื้อ ในพันธุ์ที่อ่อนแอต่อโรค แผลจะขยายจนใบไหม้ไปถึงกาบใบ ลักษณะของแผลจะคล้ายคลึงกับเกิดบนใบ ส่วนในพันธุ์ต้านทาน จำนวนแผลจะน้อยและแผลจะไม่ขยายตามความยาวของใบ รอบๆ แผลจะมีสีน้ำตาลดำ ในสภาพที่มีฝนตก ลมพัดแรง จะช่วยให้โรคแพร่ระบาดอย่างกว้างขวางรวดเร็ว และถ้าสภาพแวดล้อมไม่เหมาะสม ใบข้าวที่แตกใหม่ อาจไม่แสดงอาการโรคเลยในดินที่อุดมสมบูรณ์ไม่ควรใส่ปุ๋ยไนโตรเจนมาก ไม่ควรปลูกข้าวแน่นเกินไปและอย่าให้ระดับน้ำในนาสูงเกินควร']
            } else if (name === 'BrownSpotDisease') {
                found = ['โรคใบจุดสีน้ำตาล', 'https://media.komchadluek.net/media/img/size1/2016/07/11/a9ec8e7hcadcbbgebfegi.jpg', 'คือ โรคใบจุดสีน้ำตาล พบใน ข้าวนาสวน (นาปีและนาปรัง) และข้าวไร่ ทุกภาคของประเทศไทย แผลที่ใบข้าว พบมากในระยะแตกกอมีลักษณะเป็นจุดสีน้ำตาล รูปกลมหรือรูปไข่ ขอบนอกสุดของแผลมีสีเหลือง ขนาดเล็ก แผลที่มีการพัฒนาเต็มที่ขนาดประมาณ 1-2 x 4-10 มิลลิเมตร บางครั้งจะพบแผล แต่จะเป็นรอยเปื้อนคล้ายสนิมกระจัดกระจายทั่วไปบนใบข้าว แผลยังสามารถเกิดบนเมล็ดข้าวเปลือก(โรคเมล็ดด่าง) บางแผลมีขนาดเล็ก บางแผลอาจใหญ่คลุมเมล็ดข้าวเปลือก ทำให้เมล็ดข้าวเปลือกสกปรก เสื่อมคุณภาพ เมื่อนำไปสีข้าวสารจะหักง่าย เกิดจากสปอร์ของเชื้อราปลิวไปตามลม และติดไปกับเมล็ด “การปลูกข้าวแบบต่อเนื่อง ไม่พักดินและขาดการปรับปรุงบำรุงดิน เพิ่มการระบาดของโรคอาการใบจุดสีน้ำตาลที่ใบ ใช้พันธุ์ต้านทานที่เหมาะสมกับสภาพท้องที่ และโดยเฉพาะพันธุ์ที่มีคุณสมบัติต้านทานโรคใบสีส้ม เช่น ภาคกลางใช้พันธุ์ปทุมธานี 1 ภาคเหนือและภาคตะวันออกเฉียงเหนือ ใช้พันธุ์เหนียวสันป่าตอง และหางยี 71 กำจัดวัชพืชในนา ดูแลแปลงให้สะอาด ปรับปรุงดินโดยการไถกลบฟาง หรือเพิ่มความอุดมสมบูรณ์ดินโดยการปลูกพืชปุ๋ยสด หรือปลูกพืชหมุนเวียนเพื่อช่วยลดความรุนแรงของโรค']
            } else if (name === 'LeafScaldDisease') {
                found = ['โรคใบวงสีน้ำตาล', 'https://unilife.co.th/wp-content/uploads/2022/03/Slide_ใบจุดสีน้ำตาล1.jpg', 'คือ โรคใบวงสีน้ำตาล พบในข้าวไร่ภาคเหนือและภาคใต้ และ ข้าวนาสวน (นาปี) ภาคตะวันออกเฉียงเหนือ ระยะกล้าข้าวจะแสดงอาการไหม้ที่ปลายใบและมีสีน้ำตาลเข้ม ระยะแตกกออาการส่วนใหญ่จะเกิดบนใบ แต่มักจะเกิดแผลที่ปลายใบมากกว่าบริเวณอื่นๆ ของใบ แผลที่เกิดบนใบในระยะแรกมีลักษณะเป็นรอยช้ำ รูปไข่ยาวๆ แผลสีน้ำตาลปนเทา ขอบแผลสีน้ำตาลอ่อน จากนั้นแผลจะขยายใหญ่ขึ้นเป็นรูปวงรี ติดต่อกัน ทำให้เกิดอาการใบไหม้บริเวณกว้าง และเปลี่ยนเป็นสีฟางข้าว ในที่สุดแผลจะมีลักษณะเป็นวงซ้อนๆ กันลุกลามเข้ามาที่โคนใบ มีผลทำให้ข้าวแห้งก่อนกำหนด การแพร่กระจาย มีพืชอาศัย เช่น หญ้าชันกาด และหญ้าขนใช้พันธุ์ข้าวต้านทาน เช่น ในภาคตะวันออกเฉียงเหนือใช้ หางยี 71 กำจัดพืชอาศัยของเชื้อราสาเหตุโรค ใช้ไตรโคโดม่า โดยการฉีดไตรโคโดม่าทุก ๆ 7 วัน']
            } else if (name === 'orangeleafdisease') {
                found = ['โรคใบสีแสด', 'https://kas.siamkubota.co.th/wp-content/uploads/2022/09/20170207165517-1024x707.jpg', 'คือ โรคใบสีแสด สามารถพบได้ในนาชลประทาน ภาคกลาง ข้าวเป็นโรคได้ ตั้งแต่ระยะแตกกอจนถึงระยะตั้งท้อง ต้นข้าวที่เป็นโรคนี้ ใบแสดงอาการสีแสดจากปลายใบที่ใบล่าง และเป็นสีแสดทั่วทั้งใบยกเว้นเส้นกลางใบ ใบที่เป็นโรคจะม้วนจากขอบใบทั้งสองข้างเข้ามาหาเส้นกลางใบ และใบจะแห้งตายในที่สุด ต้นข้าวสูงตามปกติ แต่แตกกอน้อย และตายอย่างรวดเร็ว โรคใบสีแสดนี้เกิดเป็นกอๆ ไม่แพร่กระจายเป็นบริเวณกว้างเหมือนโรคใบสีส้ม เชื้อสาเหตุโรคถ่ายทอดได้โดยแมลงพาหะ คือ เพลี้ยจักจั่นปีกลายหยักเชื้อสามารถอาศัยอยู่ตามวัชพืชและพืชอาศัยชนิดต่างๆ กำจัดหรือทำลายเชื้อสาเหตุโรค โดยไถกลบหรือเผาตอซังในนาที่มีโรค กำจัดวัชพืช โดยเฉพาะวัชพืชใกล้แหล่งน้ำที่เป็นที่อยู่อาศัยและขยายพันธุ์ของแมลงพาหะ ใช้พันธุ์ข้าวต้านทานแมลงเพลี้ยจักจั่นปีกลายหยัก เช่น กข1 กข3 แต่ไม่ควรปลูกข้าวพันธุ์ดังกล่าว ติดต่อกันเป็นแปลงขนาดใหญ่ เนื่องจากแมลงสามารถปรับตัว เข้าทำลายพันธุ์ข้าวที่ต้านทานได้ ถ้าปฏิบัติได้ เมื่อมีโรคระบาดรุนแรงควรงดปลูกข้าว 1-2 ฤดู เพื่อตัดวงจรชีวิตของแมลงพาหะ หรือกำจัดแมลงพาหะด้วยน้ำหมักสะเดา']
            } else if (name === 'RiceRaggedStuntDisease') {
                found = ['โรคใบหงิก', 'https://cdn.chiangmainews.co.th/wp-content/uploads/2018/01/07084916/B6-2.jpg', 'คือ โรคใบหงิก สามารถพบได้ในนาชลประทาน ภาคกลาง และภาคเหนือตอนล่าง ต้นข้าวเป็นโรคได้ ทั้ง ระยะกล้า แตกกอ ตั้งท้อง อาการของต้นข้าวที่เป็นโรค สังเกตได้ง่าย คือ ข้าวต้นเตี้ยกว่าปกติ ใบแคบและสั้นสีเขียวเข้ม แตกใบใหม่ช้ากว่าปกติ แผ่นใบไม่สมบูรณ์ ปลายใบบิดเป็นเกลียว ขอบใบแหว่งวิ่นและเส้นใบบวมโป่งเป็นแนวยาวทั้งที่ใบและกาบใบ ข้าวที่เป็นโรคออกรวงล่าช้าและให้รวงไม่สมบูรณ์ เมล็ดลีบ ทำให้ผลผลิตลดลง และข้าวพันธุ์อ่อนแอที่เป็นโรคในระยะกล้า ต้นข้าวอาจตายและไม่ได้ผลผลิตเลย เชื้อไวรัสสาเหตุโรคถ่ายทอดได้โดยแมลงพาหะ คือ เพลี้ยกระโดดสีน้ำตาล และเชื้อไวรัสสามารถคงอยู่ในตอซัง และหญ้าบางชนิด กำจัดหรือทำลายเชื้อไวรัส โดยไถกลบหรือเผาตอซังในนาที่มีโรค กำจัดวัชพืช โดยเฉพาะวัชพืชใกล้แหล่งน้ำซึ่งเป็นที่อยู่อาศัยและขยายพันธุ์ของแมลงพาหะ ใช้พันธุ์ที่ต้านทานต่อเพลี้ยกระโดดสีน้ำตาล เช่น พันธุ์สุพรรณบุรี 90 สุพรรณบุรี 3 และชัยนาท 2 แต่ไม่ควรปลูกข้าวพันธุ์ดังกล่าว ติดต่อกันเนื่องจากแมลงสามารถปรับตัว เข้าทำลายพันธุ์ข้าวที่ต้านทานได้ ถ้าปฏิบัติได้ เมื่อมีโรคระบาดรุนแรงควรงดปลูกข้าว 1 – 2 ฤดู เพื่อตัดวงจรชีวิตของแมลงพาหะ หรือกำจัดแมลงพาหะด้วยน้ำหมักสะเดา']
            } else if (name === 'Dirtypanicledisease') {
                found = ['โรคเมล็ดด่าง', 'https://erawanagri.com/wp-content/uploads/2023/01/Rice-Diseases-02-300x300.png', 'คือ โรคเมล็ดด่าง สามารถพบได้ในนาชลประทาน ภาคกลาง ภาคตะวันตก ภาคเหนือ ภาคตะวันออกเฉียงเหนือ และ ภาคใต้ ในระยะออกรวง พบแผลสีต่างๆ เช่นเป็นจุดสีน้ำตาลหรือดำหรือมีลายสีน้ำตาลดำหรือสีเทาปนชมพูที่เมล็ดบนรวงข้าว ทั้งนี้เพราะมีเชื้อราหลายชนิดที่สามารถเข้าทำลายและทำให้เกิดอาการต่างกันไป การเข้าทำลายของเชื้อรามักจะเกิดในช่วงดอกข้าวเริ่มโผล่จากกาบหุ้มรวงจนถึงระยะเมล็ดข้าวเริ่มเป็นน้ำนม และอาการเมล็ดด่าง จะปรากฏเด่นชัดในระยะใกล้เก็บเกี่ยว เชื้อราสามารถแพร่กระจายไปกับลม ติดไปกับเมล็ด และสามารถแพร่กระจายในยุ้งฉางได้ เชื้อบางชนิดสามารถสร้างสารพิษ ซึ่งเป็นอันตรายต่อสุขภาพได้ เมล็ดพันธุ์ที่ใช้ปลูก ควรคัดเลือกจากแปลงที่ไม่เป็นโรค']
            } else if (name === 'RiceBlastDisease') {
                found = ['โรคไหม้', 'https://i.postimg.cc/4NfdKZ9d/g55gfjakhad5a59kich7j.png', 'คือ โรคไหม้ พบทุกภาคในประเทศไทย ในข้าวนาสวน ทั้งนาปีและนาปรัง และข้าวไร่ ระยะกล้า ใบมีแผล จุดสีน้ำตาลคล้ายรูปตา มีสีเทาอยู่ตรงกลางแผล ความกว้างของแผลประมาณ 2-5 มิลลิเมตร และความยาวประมาณ 10-15 มิลลิเมตร แผลสามารถขยายลุกลามและกระจายทั่วบริเวณใบ ถ้าโรครุนแรงกล้าข้าวจะแห้งฟุบตาย อาการคล้ายถูกไฟไหม้อาการแบ่งออกเป็นระยะดังนี้ิ ระยะแตกกอ อาการพบได้ที่ใบ ข้อต่อของใบ และข้อต่อของลำต้น ขนาดแผลจะใหญ่กว่าที่พบในระยะกล้า แผลลุกลามติดต่อกันได้ที่บริเวณข้อต่อ ใบจะมีลักษณะแผลช้ำสีน้ำตาลดำ และมักหลุดจากกาบใบเสมอ ระยะออกรวง (โรคไหม้คอรวง หรือ โรคเน่าคอรวง) ถ้าข้าวเพิ่งจะเริ่มให้รวง เมื่อถูกเชื้อราเข้าทำลาย เมล็ดจะลีบหมด แต่ถ้าเป็นโรคตอนรวงข้าวแก่ใกล้เก็บเกี่ยว จะปรากฏรอยแผลช้ำสีน้ำตาลที่บริเวณคอรวง ทำให้เปราะหักง่าย รวงข้าวร่วงหล่นเสียหายมาก การแพร่ระบาด พบโรคในแปลงที่ต้นข้าวหนาแน่น ทำให้อับลม ถ้าใส่ปุ๋ยไนโตรเจนสูงและมีสภาพแห้งในตอนกลางวันและชื้นจัดในตอนกลางคืน น้ำค้างยาวนานถึงตอนสายราว 9 โมง อากาศค่อนข้างเย็น ลมแรงจะช่วยให้โรคแพร่กระจายได้ดี ใช้พันธุ์ค่อนข้างต้านทานโรค ภาคกลาง เช่น สุพรรณบุรี 1 สุพรรณบุรี 60 ปราจีนบุรี 1 พลายงาม ข้าวเจ้าหอมพิษณุโลก 1ภาคเหนือ และตะวันออกเฉียงเหนือ เช่น ข้าวเจ้าหอมพิษณุโลก 1 สุรินทร์ 1 เหนียวอุบล 2 สันปาตอง 1 หางยี 71 ภาคใต้ ข้อควรระวัง : ข้าวพันธุ์สุพรรณบุรี 1 สุพรรณบุรี 60 และชัยนาท 1 ที่ปลูกในภาคเหนือตอนล่าง พบว่า แสดงอาการรุนแรงในบางพื้นที่ และบางปี โดยเฉพาะเมื่อสภาพแวดล้อมเอื้ออำนวย เช่น ฝนพรำ หรือหมอก น้ำค้างจัด อากาศเย็น ใส่ปุ๋ยมากเกินความจำเป็น หรือเป็นดินหลังน้ำท่วม หว่านเมล็ดพันธุ์ในอัตราที่เหมาะสม คือ 15-20 กิโลกรัม/ไร่ ควรแบ่งแปลงให้มีการระบายถ่ายเทอากาศดี และไม่ควรใส่ปุ๋ยไนโตรเจนสูงเกินไป ถ้าสูงถึง 50 กิโลกรัม/ไร่ โรคไหม้จะพัฒนาอย่าง รวดเร็ว']
            } else {
                found = 'Answer is over paramiter Error code : Thanakool'
                delete insideFunction[event.source.userId]
                return client.pushMessage(event.source.userId, { type: 'text', text: found })
            }
            delete insideFunction[event.source.userId]
            //senddata(found,name,event)
        }
    }
}
function readmem(name, event) {
    if (name === 'SheathRotDisease') {
        found = 'คือ โรคกาบใบเน่า พบมากในนาชลประทาน ภาคกลาง ข้าวจะแสดงอาการในระยะตั้งท้องโดยเกิดแผลสีน้ำตาลดำบนกาบห่อรวง ขนาดแผลประมาณ 2-7 x 4-18 มิลลิเมตร ตรงกลางแผลมีกลุ่มเส้นใยสีขาวอมชมพู แผลนี้จะขยายติดต่อกันทำให้บริเวณกาบหุ้มรวงมีสีน้ำตาลดำและรวงข้าวส่วนใหญ่โผล่ไม่พ้นกาบหุ้มรวง หรือโผล่ได้บางส่วน ทำให้เมล็ดลีบและมีสีดำ โดยมีตัวไรเป็นพาหะนำเชื้อ เชื้อรานี้ติดอยู่บนเมล็ดได้นาน นอกจากนี้ พบว่า “ไรขาว” ซึ่งอาศัยดูดกินน้ำเลี้ยงต้นข้าวในบริเวณกาบใบด้านใน สามารถเป็นพาหะช่วยทำให้โรคแพร่ระบาดได้รุนแรง และกว้างยิ่งขึ้น ควรใช้พันธุ์ข้าวที่ค่อนข้างต้านทานที่เหมาะสมกับสภาพท้องที่ เช่น กข27 สำหรับนาลุ่มที่มีน้ำขัง ใช้พันธุ์ข้าวที่ลำต้นสูง แตกกอน้อย ลดจำนวนประชากรไรขาว พาหะแพร่เชื้อ ในช่วงอากาศแห้งแล้ง ใช้ไตรโคโดม่า โดยการฉีดไตรโคโดม่าทุก ๆ 7 วัน หรือการใช้น้ำหมักมูลไส้เดือนโดยการนำมูลไส้เดือนไปหมักสามารถทำตามหรือตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://youtu.be/xiKjnYdO7XM?si=ju_Mg5APPrlQnYhU'
    } else if (name === 'SheathBlightDisease') {
        found = 'คือ โรคกาบใบแห้ง สามารถพบได้ในนาชลประทาน ภาคกลาง ภาคเหนือ และ ภาคใต้ เริ่มพบโรคในระยะแตกกอ จนถึงระยะใกล้เก็บเกี่ยว ยิ่งต้นข้าวมีการแตกกอ ต้นข้าวก็จะเบียดเสียดกันมากขึ้น โรคก็จะเป็นรุนแรง ลักษณะแผลเป็นสีเขียวปนเทา ปรากฏตามกาบใบ ตรงบริเวณใกล้ระดับน้ำ แผลจะลุกลามขยายใหญ่ขึ้นและลุกลามขยายขึ้นถึงใบข้าว ถ้าเป็นพันธุ์ข้าวที่อ่อนแอ แผลสามารถลุกลามถึงใบธงและกาบหุ้มรวงข้าว ทำให้ใบและกาบใบเหี่ยวแห้ง ผลผลิตจะลดลง เชื้อราสามารถสร้างเม็ดขยายพันธุ์ อยู่ได้นานในตอซังหรือวัชพืชในนาตามดินนา และสามารถอยู่ข้ามฤดูหมุนเวียนและทำลายข้าวได้ตลอดฤดูการทำนา "หลังเก็บเกี่ยวข้าว และเริ่มฤดูใหม่ ควรพลิกไถหน้าดินตากแดด เพื่อทำลายเม็ดขยายพันธุ์ ของเชื้อราสาเหตุโรค กำจัดวัชพืชตามคันนาและแหล่งน้ำ เพื่อทำลายพืชที่เป็นแหล่งอาศัยของเชื้อราสาเหตุโรค"'
    } else if (name === 'BacterialLeafStreak') {
        found = 'คือ โรคใบขีดโปร่งแสง ในนาน้ำฝน และ นาชลประทาน ภาคกลาง ภาคตะวันออกเฉียงเหนือ และ ภาคใต้ โรคนี้เป็นได้ตั้งแต่ระยะข้าวแตกกอจนถึงฺออกรวง อาการปรากฏที่ใบ เริ่มแรกเห็นเป็นขีดช้ำยาวไปตามเส้นใบ ต่อมาค่อยๆ เปลี่ยนเป็นสีเหลืองหรือส้ม เมื่อแผลขยายรวมกันก็จะเป็นแผลใหญ่ แสงสามารถทะลุผ่านได้ และพบแบคทีเรียในรูปหยดน้ำสีเหลืองคล้ายยางสนกลมๆ ขนาดเล็กปรากฏอยู่บนแผล ความยาวของแผลขึ้นอยู่กับความต้านทานของพันธุ์ข้าว และความรุนแรงของเชื้อ ในพันธุ์ที่อ่อนแอต่อโรค แผลจะขยายจนใบไหม้ไปถึงกาบใบ ลักษณะของแผลจะคล้ายคลึงกับเกิดบนใบ ส่วนในพันธุ์ต้านทาน จำนวนแผลจะน้อยและแผลจะไม่ขยายตามความยาวของใบ รอบๆ แผลจะมีสีน้ำตาลดำ ในสภาพที่มีฝนตก ลมพัดแรง จะช่วยให้โรคแพร่ระบาดอย่างกว้างขวางรวดเร็ว และถ้าสภาพแวดล้อมไม่เหมาะสม ใบข้าวที่แตกใหม่ อาจไม่แสดงอาการโรคเลยในดินที่อุดมสมบูรณ์ไม่ควรใส่ปุ๋ยไนโตรเจนมาก ไม่ควรปลูกข้าวแน่นเกินไปและอย่าให้ระดับน้ำในนาสูงเกินควร'
    } else if (name === 'BrownSpotDisease') {
        found = 'คือ โรคใบจุดสีน้ำตาล พบใน ข้าวนาสวน (นาปีและนาปรัง) และข้าวไร่ ทุกภาคของประเทศไทย แผลที่ใบข้าว พบมากในระยะแตกกอมีลักษณะเป็นจุดสีน้ำตาล รูปกลมหรือรูปไข่ ขอบนอกสุดของแผลมีสีเหลือง ขนาดเล็ก แผลที่มีการพัฒนาเต็มที่ขนาดประมาณ 1-2 x 4-10 มิลลิเมตร บางครั้งจะพบแผล แต่จะเป็นรอยเปื้อนคล้ายสนิมกระจัดกระจายทั่วไปบนใบข้าว แผลยังสามารถเกิดบนเมล็ดข้าวเปลือก(โรคเมล็ดด่าง) บางแผลมีขนาดเล็ก บางแผลอาจใหญ่คลุมเมล็ดข้าวเปลือก ทำให้เมล็ดข้าวเปลือกสกปรก เสื่อมคุณภาพ เมื่อนำไปสีข้าวสารจะหักง่าย เกิดจากสปอร์ของเชื้อราปลิวไปตามลม และติดไปกับเมล็ด “การปลูกข้าวแบบต่อเนื่อง ไม่พักดินและขาดการปรับปรุงบำรุงดิน เพิ่มการระบาดของโรคอาการใบจุดสีน้ำตาลที่ใบ ใช้พันธุ์ต้านทานที่เหมาะสมกับสภาพท้องที่ และโดยเฉพาะพันธุ์ที่มีคุณสมบัติต้านทานโรคใบสีส้ม เช่น ภาคกลางใช้พันธุ์ปทุมธานี 1 ภาคเหนือและภาคตะวันออกเฉียงเหนือ ใช้พันธุ์เหนียวสันป่าตอง และหางยี 71 กำจัดวัชพืชในนา ดูแลแปลงให้สะอาด ปรับปรุงดินโดยการไถกลบฟาง หรือเพิ่มความอุดมสมบูรณ์ดินโดยการปลูกพืชปุ๋ยสด หรือปลูกพืชหมุนเวียนเพื่อช่วยลดความรุนแรงของโรค'
    } else if (name === 'LeafScaldDisease') {
        found = 'คือ โรคใบวงสีน้ำตาล พบในข้าวไร่ภาคเหนือและภาคใต้ และ ข้าวนาสวน (นาปี) ภาคตะวันออกเฉียงเหนือ ระยะกล้าข้าวจะแสดงอาการไหม้ที่ปลายใบและมีสีน้ำตาลเข้ม ระยะแตกกออาการส่วนใหญ่จะเกิดบนใบ แต่มักจะเกิดแผลที่ปลายใบมากกว่าบริเวณอื่นๆ ของใบ แผลที่เกิดบนใบในระยะแรกมีลักษณะเป็นรอยช้ำ รูปไข่ยาวๆ แผลสีน้ำตาลปนเทา ขอบแผลสีน้ำตาลอ่อน จากนั้นแผลจะขยายใหญ่ขึ้นเป็นรูปวงรี ติดต่อกัน ทำให้เกิดอาการใบไหม้บริเวณกว้าง และเปลี่ยนเป็นสีฟางข้าว ในที่สุดแผลจะมีลักษณะเป็นวงซ้อนๆ กันลุกลามเข้ามาที่โคนใบ มีผลทำให้ข้าวแห้งก่อนกำหนด การแพร่กระจาย มีพืชอาศัย เช่น หญ้าชันกาด และหญ้าขนใช้พันธุ์ข้าวต้านทาน เช่น ในภาคตะวันออกเฉียงเหนือใช้ หางยี 71 กำจัดพืชอาศัยของเชื้อราสาเหตุโรค ใช้ไตรโคโดม่า โดยการฉีดไตรโคโดม่าทุก ๆ 7 วัน'
    } else if (name === 'orangeleafdisease') {
        found = 'คือ โรคใบสีแสด สามารถพบได้ในนาชลประทาน ภาคกลาง ข้าวเป็นโรคได้ ตั้งแต่ระยะแตกกอจนถึงระยะตั้งท้อง ต้นข้าวที่เป็นโรคนี้ ใบแสดงอาการสีแสดจากปลายใบที่ใบล่าง และเป็นสีแสดทั่วทั้งใบยกเว้นเส้นกลางใบ ใบที่เป็นโรคจะม้วนจากขอบใบทั้งสองข้างเข้ามาหาเส้นกลางใบ และใบจะแห้งตายในที่สุด ต้นข้าวสูงตามปกติ แต่แตกกอน้อย และตายอย่างรวดเร็ว โรคใบสีแสดนี้เกิดเป็นกอๆ ไม่แพร่กระจายเป็นบริเวณกว้างเหมือนโรคใบสีส้ม เชื้อสาเหตุโรคถ่ายทอดได้โดยแมลงพาหะ คือ เพลี้ยจักจั่นปีกลายหยักเชื้อสามารถอาศัยอยู่ตามวัชพืชและพืชอาศัยชนิดต่างๆ กำจัดหรือทำลายเชื้อสาเหตุโรค โดยไถกลบหรือเผาตอซังในนาที่มีโรค กำจัดวัชพืช โดยเฉพาะวัชพืชใกล้แหล่งน้ำที่เป็นที่อยู่อาศัยและขยายพันธุ์ของแมลงพาหะ ใช้พันธุ์ข้าวต้านทานแมลงเพลี้ยจักจั่นปีกลายหยัก เช่น กข1 กข3 แต่ไม่ควรปลูกข้าวพันธุ์ดังกล่าว ติดต่อกันเป็นแปลงขนาดใหญ่ เนื่องจากแมลงสามารถปรับตัว เข้าทำลายพันธุ์ข้าวที่ต้านทานได้ ถ้าปฏิบัติได้ เมื่อมีโรคระบาดรุนแรงควรงดปลูกข้าว 1-2 ฤดู เพื่อตัดวงจรชีวิตของแมลงพาหะ หรือกำจัดแมลงพาหะด้วยน้ำหมักสะเดา'
    } else if (name === 'RiceRaggedStuntDisease') {
        found = 'คือ โรคใบหงิก สามารถพบได้ในนาชลประทาน ภาคกลาง และภาคเหนือตอนล่าง ต้นข้าวเป็นโรคได้ ทั้ง ระยะกล้า แตกกอ ตั้งท้อง อาการของต้นข้าวที่เป็นโรค สังเกตได้ง่าย คือ ข้าวต้นเตี้ยกว่าปกติ ใบแคบและสั้นสีเขียวเข้ม แตกใบใหม่ช้ากว่าปกติ แผ่นใบไม่สมบูรณ์ ปลายใบบิดเป็นเกลียว ขอบใบแหว่งวิ่นและเส้นใบบวมโป่งเป็นแนวยาวทั้งที่ใบและกาบใบ ข้าวที่เป็นโรคออกรวงล่าช้าและให้รวงไม่สมบูรณ์ เมล็ดลีบ ทำให้ผลผลิตลดลง และข้าวพันธุ์อ่อนแอที่เป็นโรคในระยะกล้า ต้นข้าวอาจตายและไม่ได้ผลผลิตเลย เชื้อไวรัสสาเหตุโรคถ่ายทอดได้โดยแมลงพาหะ คือ เพลี้ยกระโดดสีน้ำตาล และเชื้อไวรัสสามารถคงอยู่ในตอซัง และหญ้าบางชนิด กำจัดหรือทำลายเชื้อไวรัส โดยไถกลบหรือเผาตอซังในนาที่มีโรค กำจัดวัชพืช โดยเฉพาะวัชพืชใกล้แหล่งน้ำซึ่งเป็นที่อยู่อาศัยและขยายพันธุ์ของแมลงพาหะ ใช้พันธุ์ที่ต้านทานต่อเพลี้ยกระโดดสีน้ำตาล เช่น พันธุ์สุพรรณบุรี 90 สุพรรณบุรี 3 และชัยนาท 2 แต่ไม่ควรปลูกข้าวพันธุ์ดังกล่าว ติดต่อกันเนื่องจากแมลงสามารถปรับตัว เข้าทำลายพันธุ์ข้าวที่ต้านทานได้ ถ้าปฏิบัติได้ เมื่อมีโรคระบาดรุนแรงควรงดปลูกข้าว 1 ถึง 2 ฤดู เพื่อตัดวงจรชีวิตของแมลงพาหะ หรือกำจัดแมลงพาหะด้วยน้ำหมักสะเดา'
    } else if (name === 'Dirtypanicledisease') {
        found = 'คือ โรคเมล็ดด่าง สามารถพบได้ในนาชลประทาน ภาคกลาง ภาคตะวันตก ภาคเหนือ ภาคตะวันออกเฉียงเหนือ และ ภาคใต้ ในระยะออกรวง พบแผลสีต่างๆ เช่นเป็นจุดสีน้ำตาลหรือดำหรือมีลายสีน้ำตาลดำหรือสีเทาปนชมพูที่เมล็ดบนรวงข้าว ทั้งนี้เพราะมีเชื้อราหลายชนิดที่สามารถเข้าทำลายและทำให้เกิดอาการต่างกันไป การเข้าทำลายของเชื้อรามักจะเกิดในช่วงดอกข้าวเริ่มโผล่จากกาบหุ้มรวงจนถึงระยะเมล็ดข้าวเริ่มเป็นน้ำนม และอาการเมล็ดด่าง จะปรากฏเด่นชัดในระยะใกล้เก็บเกี่ยว เชื้อราสามารถแพร่กระจายไปกับลม ติดไปกับเมล็ด และสามารถแพร่กระจายในยุ้งฉางได้ เชื้อบางชนิดสามารถสร้างสารพิษ ซึ่งเป็นอันตรายต่อสุขภาพได้ เมล็ดพันธุ์ที่ใช้ปลูก ควรคัดเลือกจากแปลงที่ไม่เป็นโรค'
    } else if (name === 'RiceBlastDisease') {
        found = 'คือ โรคไหม้ พบทุกภาคในประเทศไทย ในข้าวนาสวน ทั้งนาปีและนาปรัง และข้าวไร่ ระยะกล้า ใบมีแผล จุดสีน้ำตาลคล้ายรูปตา มีสีเทาอยู่ตรงกลางแผล ความกว้างของแผลประมาณ 2-5 มิลลิเมตร และความยาวประมาณ 10-15 มิลลิเมตร แผลสามารถขยายลุกลามและกระจายทั่วบริเวณใบ ถ้าโรครุนแรงกล้าข้าวจะแห้งฟุบตาย อาการคล้ายถูกไฟไหม้อาการแบ่งออกเป็นระยะดังนี้ิ ระยะแตกกอ อาการพบได้ที่ใบ ข้อต่อของใบ และข้อต่อของลำต้น ขนาดแผลจะใหญ่กว่าที่พบในระยะกล้า แผลลุกลามติดต่อกันได้ที่บริเวณข้อต่อ ใบจะมีลักษณะแผลช้ำสีน้ำตาลดำ และมักหลุดจากกาบใบเสมอ ระยะออกรวง (โรคไหม้คอรวง หรือ โรคเน่าคอรวง) ถ้าข้าวเพิ่งจะเริ่มให้รวง เมื่อถูกเชื้อราเข้าทำลาย เมล็ดจะลีบหมด แต่ถ้าเป็นโรคตอนรวงข้าวแก่ใกล้เก็บเกี่ยว จะปรากฏรอยแผลช้ำสีน้ำตาลที่บริเวณคอรวง ทำให้เปราะหักง่าย รวงข้าวร่วงหล่นเสียหายมาก การแพร่ระบาด พบโรคในแปลงที่ต้นข้าวหนาแน่น ทำให้อับลม ถ้าใส่ปุ๋ยไนโตรเจนสูงและมีสภาพแห้งในตอนกลางวันและชื้นจัดในตอนกลางคืน น้ำค้างยาวนานถึงตอนสายราว 9 โมง อากาศค่อนข้างเย็น ลมแรงจะช่วยให้โรคแพร่กระจายได้ดี ใช้พันธุ์ค่อนข้างต้านทานโรค ภาคกลาง เช่น สุพรรณบุรี 1 สุพรรณบุรี 60 ปราจีนบุรี 1 พลายงาม ข้าวเจ้าหอมพิษณุโลก 1ภาคเหนือ และตะวันออกเฉียงเหนือ เช่น ข้าวเจ้าหอมพิษณุโลก 1 สุรินทร์ 1 เหนียวอุบล 2 สันปาตอง 1 หางยี 71 ภาคใต้ ข้อควรระวัง : ข้าวพันธุ์สุพรรณบุรี 1 สุพรรณบุรี 60 และชัยนาท 1 ที่ปลูกในภาคเหนือตอนล่าง พบว่า แสดงอาการรุนแรงในบางพื้นที่ และบางปี โดยเฉพาะเมื่อสภาพแวดล้อมเอื้ออำนวย เช่น ฝนพรำ หรือหมอก น้ำค้างจัด อากาศเย็น ใส่ปุ๋ยมากเกินความจำเป็น หรือเป็นดินหลังน้ำท่วม หว่านเมล็ดพันธุ์ในอัตราที่เหมาะสม คือ 15-20 กิโลกรัม/ไร่ ควรแบ่งแปลงให้มีการระบายถ่ายเทอากาศดี และไม่ควรใส่ปุ๋ยไนโตรเจนสูงเกินไป ถ้าสูงถึง 50 กิโลกรัม/ไร่ โรคไหม้จะพัฒนาอย่าง รวดเร็ว'
    } else if (name === 'predators') {
        found = 'คือ แมลงตัวห้ำ ซึ่งมาหลายชนิด เป็นแมลงที่มีประโยชน์ต่อเกษตรกร ปกติแล้ว หากินเหยื่อที่เป็นแมลงด้วยกันเป็นอาหาร บางชนิดเป็นแมลงตัวห้ำทั้งในระยะที่เป็นตัวอ่อนและตัวเต็มวัย  จะออกหากินเหยื่อโดยการกัดกินตัวเหยื่อ หรือ การดูดกินของเหลวในตัวเหยื่อ โดยแมลงตัวหำ้นั้นสามารถช่วยกำจัดแมลงศัตรูพืชได้ ข้อมูลเพิ่มเติม https://www.dnp.go.th/foremic/nforemic/Predator/index_Pred.htm'
    } else if (name === 'Bombaylocust') {
        found = 'คือตั๊กแตนปาทังกา เป็นตั๊กแตนที่มีขนาดใหญ่ ตัวอ่อนจะมีสีเขียว เหลือง แต่เมื่อเป็นตัวแก่จะมีสีน้ำตาลอ่อนหรือสีน้ำตาลเข้ม  ลักษณะเด่นชัด คือ ที่แก้มทั้ง 2 ข้าง มีแถบสีดำ พาดจากขอบตารวมด้านล่างถึงปาก  ส่วนอกตรงกลางจะคอดเข้าเล็กน้อย  ด้านข้างอกทั้ง 2 ด้าน มีแถบสีน้ำตาลดำ พาดเป็นทางยาว ต่อไปยังปีกหน้าจนถึงปลายปีก 1-2 แถบ  ด้านหลังมีแถบสีเหลืองอ่อน พาดจากส่วนหัวจนถึงปลายปีก ปีกยาวคลุมปิดปลายปล้องท้อง   ตั๊กแตนปาทังกานั้นมักจะมีนิสัยที่จะกัดกินใบและต้นข้าว สามารถกำจัดได้โดยการใช้น้ำหมักสะเดา ตรวจสอบข้อมูลเพิ่มเติม https://tinyurl.com/3ukpcrm9'
    } else if (name === 'stinkbug') {
        found = 'คือแมลงสิง เป็นแมลงมวนชนิดหนึ่ง มีอีกชื่อว่าแมลงฉง ตัวเต็มวัยมีรูปร่างเพรียวยาว ตัวด้านบนสีน้ำตาล ปล่อยกินเหม็นออกมาจากส่วนท้องได้ เมื่อเราสัมผัสหรืไปรบกวนมันจะบินหนี แลงสิงนั้นมักจะดูดกินเมล็ดข้าวทั้งเมล็ดอ่อนและเมล็ดแข็งโดยตัวเต็มวัยจะทำความเสียหายมากกว่า เพราะดูดกินเป็นเวลานานกว่าทำให้เมล็ดลีบ หรือเมล็ดไม่สมบูรณ์และผลผลิตข้าวลดลง การป้องกันกำจัด 1). กำจัดวัชพืชในนาข้าว คันนาและรอบๆแปลง 2).ใช้สวิงโฉบจับตัวอ่อนและตัวเต็มวัยในนาข้าวที่พบระบาดและนำมาทำลาย 3). ตัวเต็มวัยชอบกินเนื้อเน่า นำเนื้อเน่าแขวนไว้ตามนาข้าว และจับมาทำลาย 4). หลีกเลี่ยงการปลูกข้าวต่อเนื่องเพื่อลดการแพร่ขยายพันธุ์ ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=56-1.htm'
    } else if (name === 'brownplanthopper') {
        found = 'คือเพลี้ยกระโดดสีน้ำตาล ตัวเต็มวัยมีลำตัวสีน้ำตาลถึงสีน้ำตาลปนดำ ส่วนใหญ่วางไข่ที่กาบใบข้าว หรือเส้นกลางใบ โดยวางไข่เป็นกลุ่ม เรียงแถวตามแนวตั้งฉากกับกาบใบข้าว บริเวณที่วางไข่จะมีรอยช้ำเป็นสีน้ำตาล ไข่มีลักษณะรูปกระสวยโค้งคล้ายกล้วยหอม มีสีขาวขุ่น เพลี้ยกระโดดสีน้ำตาลนั้นมักจะดูดกินน้ำเลี้ยวต้นข้าว ทำให้ต้นข้าวมีอาการใบเหลืองแห้งเป็นหย่อม ๆ หรือใบไหม้ และเพลี้ยกระโดดสีน้ำตาลยังเป็นตัวนำเชื้อไวรัส โรคใบหงิก มาสู่ต้นข้าว ทำให้ต้นข้าวมีอาการแคระแกร็น ตรวจสอบข้อมูลเพิ่มเติมได้ที่  ในแหล่งที่มีการระบาด และควบคุมระดับน้ำในนาได้ หลังปักดำหรือหว่าน 2-3 สัปดาห์จนถึงระยะตั้งท้องควบคุมน้ำในแปลงนาให้พอดินเปียก หรือมีน้ำเรี่ยผิวดินนาน 7-10 วัน แล้วปล่อยขังทิ้งไว้ให้แห้งเองสลับกันไป จะช่วยลดการระบาดของเพลี้ยกระโดดสีน้ำตาล http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=46-1.htm'
    } else if (name === 'riceleaffolder') {
        found = 'คือหนอนห่อใบข้าว เต็ม มาจะแทะผิวใบข้าวส่วนที่เป็นสีเขียว ทำให้เห็นเป็นแถบยาวสีขาว มีผลให้การสังเคราะห์แสงลดลง หนอนจะใช้ใยเหนียวที่สกัดจากปาก ดึงขอบใบข้าวทั้งสองด้านเข้าหากันเพี่อห่อหุ้มตัวหนอนไว้หนอนจะทำลายใบข้าว ทุกระยะการเจริญเติบโตของข้าว ตรวจสอบข้อมูลเพิ่มเติม https://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=50-1.htm วิธีกำจัด สามารถใช้น้ำส้มควันไม้ได้ ในแหล่งที่มีการระบาด และควบคุมระดับน้ำในนาได้ หลังปักดำหรือหว่าน 2-3 สัปดาห์จนถึงระยะตั้งท้องควบคุมน้ำในแปลงนาให้พอดินเปียก หรือมีน้ำเรี่ยผิวดินนาน 7-10 วัน แล้วปล่อยขังทิ้งไว้ให้แห้งเองสลับกันไป จะช่วยลดการระบาดของเพลี้ยกระโดดสีน้ำตาล https://www3.rdi.ku.ac.th/?p=34938'
    } else if (name === 'Mealydug') {
        found = 'คือเพลี้ยแป้ง มีลำตัวเป็นข้อ ปล้อง รูปร่างกลมหรือยาวรี ส่วนหัวและขาอยู่ใต้ลำตัว มี 6 ขา ไม่มีปีก มีผงแป้งคลุมตัว ปากเป็นแบบดูดกิน ขยายพันธุ์ได้ทั้งโดยการใช้เพศและไม่ใช้เพศ เพลี้ยแป้งนั้นมักจะดูดกินน้ำเลี้ยงของต้นข้าว ทำให้ต้นข้าวใบเหลืองจนแห้งตายทั้งกอ หากต้นข้าวที่ไม่ตายออกรวงมาจะทำให้ข้าวมีเมล็ดลีบ ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=49-1.htm สามารถกำจัดได้โดย การใช้น้ำหมักสะเดา http://www.pmc06.doae.go.th/pdf%20file%20pmc%20knowledge/Azadirechtine.pdf'
    } else if (name === 'yellowstemborer') {
        found = 'คือหนอนกอข้าวสีครีม ตัวหนอนสีขาวหรือครีม หัวสีน้ำตาลแกมเหลือง ลำตัวยาว หัวท้ายเรียวแหลม มี 6 ระยะ และเข้าดักแด้ภายในลำตัวบริเวณข้อปล้องเหนือผิวน้ำ ทำให้กาบใบมีสีเหลืองหรือน้ำตาล ซึ่งจะเห็นเป็นอาการช้ำๆ เมื่อฉีกกาบใบดูจะพบตัวหนอน ตรวจข้อมูลเพิ่มเติม http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=44-1.htm อาจใช้บิวเวอร์เรียในการกำจัด http://www.pmc08.doae.go.th/beauveria.htm'
    } else if (name === 'ricethrips') {
        found = 'คือเพลี้ยไฟ เป็นเพลี้ยชนิดหนึง แมลงจำพวกปากดูด ขนาดเล็กลำตัวยาวประมาณ 1-2 มิลลิเมตร มีทั้งชนิดมีปีกและไม่มีปีก เพลี้ยไฟทั้งตัวอ่อนและตัวเต็มวัยจะทำลายข้าวโดยการดูดกินน้ำเลี้ยง จากใบข้าวที่ยังอ่อนโดยอาศัยอยู่ตามซอกใบ ระบาดในระยะกล้า เมื่อใบข้าวโตขึ้นใบที่ถูกทำลายปลายใบจะเหี่ยวขอบใบจะม้วนเข้าหากลางใบ ข้อมูลเพิ่มเติม http://www.ricethailand.go.th/rkb3/Insect.htm  ใช้บิวเวอร์เรีย และน้ำส้มควันไม้ในการกำจัด http://www.pmc08.doae.go.th/beauveria.htm  https://www3.rdi.ku.ac.th/?p=34938'
    } else if (name === 'ScarabBeetle') {
        found = 'อาจจะเป็น มวนง่าม ด้วงดำ หรือแมลงหล่า เนื่องจากมีลักษณะที่คล้ายกัน มวนง่ามเคลื่อนที่ช้าและชอบเกาะนิ่งอยู่ตามส่วนต่างๆของต้นข้าวทำลายข้าวโดยดูดกินน้ำเลี้ยงจากลำต้นและใบ มวนง่ามมีปากแบบเจาะดูด มี Stylet พับอยู่ใต้ส่วนหัว มวนง่ามทุกวัยสามารถทำลายข้าวโดยใช้ Stylet เจาะลงไปในใบและลำต้นข้าวแล้วดูดกินน้ำเลี้ยง จากส่วนต่างๆ ของต้นข้าว ทำให้ลำต้นและใบเหี่ยวเฉา นอกจากนี้ตัวเต็มวัยซึ่งมีขนาดใหญ่ เมื่อไปเกาะตามลำต้นและใบ เป็นจำนวนมาก สามารถทำให้ลำต้น และใบในระยะกล้าและหลังปักดำใหม่หักพับเสียหายมากด้วงดำ เป็นแมลงจำพวกด้วงปีกแข็งชนิดหนึ่งซึ่งเป็นศัตรูที่สำคัญของการปลูกข้าว โดยวิธีหว่านข้าวแห้งในภาคตะวันออกเฉียงเหนือ เมื่อถอนต้นข้าวขึ้นมารากข้าวจะหลุดทำให้เข้าใจว่าด้วงชนิดนี้ทำลายรากข้าว ด้วย แต่ ถ้าใช้วิธีขุดต้นข้าวที่แสดงอาการใบเหลือง เหี่ยว จะพบว่ารากข้าวไม่ถูกกัดกินแต่อย่างไร ด้วงดำจะเคลื่อนย้ายทำลายข้าวต้นอื่นๆโดยการทำโพรงอยู่ใต้ดินในระดับใต้ราก ข้าวทำให้เห็นรอยขุยดินเป็นแนว ส่วนใหญ่มักพบตัวเต็มวัยของด้วงดำชนิดนี้ 1 ตัวต่อจุดที่ขุดสำรวจ และพบไข่มีลักษณะกลมสีขาวขุ่นขนาดเท่าเม็ดสาคูขนาดเล็ก 5-6 ฟอง แมลงหล่า เป็นมวนชนิดหนึ่ง มีลักษณะค่อนข้างกลมคล้ายโล่ห์ ด้านหัวและอกเป็นรูปสามเหลี่ยม ลำตัวมีสีน้ำตาลหรือดำเป็นมันวาว ตัวอ่อนและตัวเต็มวัยดูดกินน้ำเลี้ยงจากกาบใบข้าวบริเวณโคนต้นข้าว ทำให้บริเวณที่ถูกทำลายเป็นสีน้ำตาลแดงหรือเหลือง การป้องกันกำจัดแมลงหล่า 1) ใช้แสงไฟฟ้าล่อแมลงและทำลายในช่วงที่มีการระบาด 2) ปลูกข้าวที่มีอายุเก็บเกี่ยวสั้นเพื่อลดการเพิ่มประชากรในนาข้าว 3 ) กำจัดวัชพืชที่ขึ้นหนาแน่นในนาข้าวการป้องกันกำจัดด้วงดำ 1.ควรหว่านข้าวตามฤดูกาล (สิงหาคม) ไม่ควรหว่านช่วงระหว่างปลายเมษายนถึงต้นมิถุนายน 2. ล่อและทำลายตัวเต็มวัยของด้วงดำ โดยใช้หลอดไฟชนิดแบล็กไลท์ที่เกษตรกรในภาคตะวันออกเฉียงเหนือนิยมใช้ล่อแมลงดานา 3. สำรวจนาข้าวเมื่อพบตัวเต็มวัยด้วงดำในกับดักแสงไฟปริมาณมากกว่าปกติการป้องกันกำจัดมวนง่าม 1). เก็บกลุ่มไข่ทำลาย 2). ใช้สวิงโฉบจับตัวอ่อนและตัวเต็มวัยไปทำลาย ข้อมูลเพิ่มเติม http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=40-1.htm http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=53-1.htm http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=55-1.htm '
    } else if (name === 'redcucurbitleafbeetle') {
        found = 'คือ ด้วงเต่าแตง เป็นแมลงปีกแข็งสีแดงแสด จะมีสีของลำตัว 2 สี คือ ชนิดสีดำ และเต่าแตงชนิดสีแดง เคลื่อนไหวช้า กัดกินใบพืช กินเป็นวง ๆ กัดที่โคนต้นพืช จึงทำให้พืชเป็นแผล ข้อมูลเพิ่มเติม https://tinyurl.com/y5masx94  กำจัดโดยการใช้กากกาแฟ หรือน้ำส้มควันไม้ ในการขับไล่ https://kasetgo.com/t/topic/41278 https://www3.rdi.ku.ac.th/?p=34938'
    } else if (name === 'human') {
        found = 'คือมนุษย์ มนุษย์เป็นสัตว์สายพันธุ์หนึ่งที่อยู่ในกลุ่มสัตว์เลี้ยงลูกด้วยนม  มนุษย์เป็นสัตว์ที่มีความสามารถในการคิด แสดงอารมณ์ และมีการสื่อสารด้วยภาษา รวมถึงสามารถสร้างเครื่องมือและเทคโนโลยีต่าง ๆ เพื่อชีวิตอยู่ร่วมกับสิ่งแวดล้อมได้อย่างหลากหลาย มนุษย์มีลักษณะพิเศษ คือ มีสมองใหญ่เมื่อเทียบกับขนาดตัว โดยเฉพาะสมองชั้นนอก สมองส่วนหน้า และสมองกลีบขมับที่พัฒนาเป็นอย่างดี ข้อมูลเพิ่มเติม https://tinyurl.com/3xfzbfns'
    } else if (name === 'ricegallmidge') {
        found = 'คือแมลงบั่ว มีลักษณะคล้ายยุงหรือริ้น  ตัวหนอนคล้ายหนอนแมลงวัน ส่วนใหญ่ระบาดในภาคเหนือตอนบนหรือภาคตะวันออกเฉียงเหนือ (ภาคอีสาน) ตัวหนอนที่ฟักจากไข่จะคลานตามบริเวณกาบใบเพื่อแทรกตัวเข้าไปในกาบใบ เข้าไปอาศัยกัดกินที่จุดกำเนิดของหน่ออ่อน ทำลายยอดข้าวทำให้ข้าวไม่สามารถออกรวงได้ ทำให้ต้นข้าวและกอข้าวแคระแกรน ในระยะที่ข้าวแตกกอจะเป็นระยะแมลงบั่วนั้นจะทำลายหรืระบาดมาก พบมากในช่วงฤดูฝน ตรวจสอบข้อมูลได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=45-1.htm สามารถกำจัดได้โดยการกำจัดวัชพืชบริเวณนา ไม่ควรใช้ยาฆ่าแมลง เนื่องจากไม่สามารถทำลายแมลงบั่วได้'
    } else if (name === 'Goldenapplesnail') {
        found = 'คือหอยเชอรี่ หอยโข่งอเมริกาใต้ หรือ หอยเป๋าฮื้อน้ำจืด กินข้าวอ่อนจนถึงระยะข้าวแตกกอ โดยจะเริ่มต้นเข้ากัดกินต้นกล้าข้าวใต้น้ำเหนือจากพื้นดิน 1- 2 นิ้ว แล้วจึงกัดกินส่วนใบที่อยู่เหนือน้ำจนหมด วิธีการกำจัด อาจจะใช้เป็นกากชา หรือ กากกาแฟโรยบริเวณนาข้าว https://kasetgo.com/t/topic/41278 หรือจุดที่มีหอยเชอร์รี่อาศัยอยู่ได้ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://tinyurl.com/ueekauek'
    } else if (name === 'Mite') {
        found = 'คือตัวไร มีขนาดเล็กสามารถมองเห็นไรขาวได้โดยการมองผ่านกล้องจุลทรรศน์ เป็นศัตรูพืชชีวภาพอย่างหนึ่ง มักพบระบาดหนักในฤดูฝนช่วงเดือนกรกฎาคมถึงกันยายน ทำให้เกิดการหยุดเจริญในพืช วิธีการป้องกันและกำจัด ตรวจดูไรขาวบนใบพืชตั้งแต่เริ่มปลูกอย่างสม่ำเสมอ ถ้าเริ่มตรวจพบให้รีบกำจัดโดยการใช้สารฆ่าเฉพาะไร อาจเป็นสารสกัดจากพืช  หรือศัตรูทางชีวภาพของไรขาวเช่นไรตัวห้ำ'
    } else if (name === 'caterpillar') {
        found = 'คือหนอนบุ้ง บุ้ง เป็นระยะตัวอ่อนของผีเสื้อ ตามลำตัวจะมีขนคัน โดยที่ปลายขนจะมีลักษณะเป็นหนามแหลม ตรงกลางเป็นท่อกลวง ซึ่งขนของบุ้งจะมีพิษ เป็นอันตรายต่อมนุษย์ โดยน้ำพิษจะถูกหลั่งออกมาเมื่อถูกสัมผัส เป็นศัตรูพืชของต้นหม่อนเนื่องจากมักพบกินใบของต้นหม่อน สามารถใช้ น้ำที่สกัดจาก ยาสูบ ตะไคร้หอม ขมิ้นชัน ผกากรอง สะเดา ในการฉีดพ่นเพื่อไล่หนอนบุ้งได้ ข้อมูลเพิ่มเติม https://www.scimath.org/article-science/item/9100-2018-10-18-08-32-45 https://www.baanlaesuan.com/109057/plant-scoop/larva_butterfly '
    } else if (name === 'riceblackbug') {
        found = 'ตัวอ่อนและตัวเต็มวัยดูดกินน้ำเลี้ยงจากกาบใบข้าวบริเวณโคนต้นข้าว ทำให้บริเวณที่ถูกทำลายเป็นสีน้ำตาลแดงหรือเหลือง ขอบใบข้าวเปลี่ยนเป็นสีน้ำตาลดำคล้ายข้าวเป็นโรคไหม้ ตามข้อของลำต้นข้าวเป็นบริเวณที่แมลงหล่าชอบเพราะเป็นแหล่งที่มีน้ำเลี้ยง ทำให้กอข้าวแคระแกร็น วิธีการกำจัดใช้แสงไฟฟ้าล่อแมลงและทำลายในช่วงที่มีการระบาด เนื่องจากแมลงหล่าชอบบินมาเล่นแสงไฟเวลากลางคืน https://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=55-1.htm'
    } else if (name === 'ricerootweevil') {
        found = 'คือด้วงงวงกินรากข้าว ตัวเต็มวัยมีสีน้ำตาลดำ ระบาดในบางพื้นที่  ด้านหัวมีส่วนโค้งยื่นออกมา ตัวหนอนที่ฟักออกมาจะกัดกินบริเวณรากข้าว หนอนมีสีขาว และเข้าดักแด้จนกระทั่งเป็นตัวเต็มวัย ทำลายข้าวโดยตัวหนอนกัดกินรากข้าว ทำให้ต้นข้าวเหี่ยวและแห้งตาย เนื่องจากรากข้าวถูกหนอนกัดกินจนหมด ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=54-1.htm การป้องกันและกำจัด กำจัดวัชพืชรอบแปลงนา การปล่อยน้ำเข้านา'
    } else if (name === 'ricehispa') {
        found = 'คือแมลงดำหนาม หนอนกัดกินภายในใบข้าว คล้ายหนอนชอนใบ ตัวเต็มวัยกัดกินผิวใบข้าวด้านบน ทำให้เกิดเป็นรอยขูดเป็นทางสีขาวยาวขนานกับเส้นกลางใบของใบข้าว ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=52.htm อาจจะแก้โดยการไม่ใช้ปุ๋ยไนโตรเจนมากเกินไป'
    } else if (name === 'zigzagleafhopper') {
        found = 'คือเพลี้ยจักจั่นปีกลายหยัก ปีกสองข้างมีลายหยักสีน้ำตาลเป็นทาง ทั้งตัวอ่อนและตัวเต็มวัยดูดกินน้ำเลี้ยงจากใบและกาบใบข้าว ข้าวที่ถูกทำลายปลายใบจะแห้งและขอบใบเปลี่ยนเป็นสีส้ม ต่อมาข้าวทั้งใบจะ เป็นสีส้มและขอบใบหงิกงอ อาการของโรคจะปรากฏที่ใบแก่ก่อน นอกจากนี้ยังเป็นพาหะนำโรคใบสีส้ม ตรวจสอบข้อมูลเพิ่มเติมได้ที่http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=48-1.htm อาจจะใช้แสงไฟเพื่อล่อแมลง'
    } else if (name === 'greenriceleafhopper') {
        found = 'คือเพลี้ยจักจั่น เพลี้ยจักจั่นสีเขียวเป็นแมลงจำพวกปากดูด ที่พบทำลายข้าวในประเทศไทย มี2ชนิด ตัวเต็มวัยของแมลงทั้ง 2 ชนิดมีสีเขียวอ่อนและอาจมีแต้มดำบนหัวหรือปีก ขนาดลำตัวยาว ตัวเต็มวัยไม่มีชนิดปีกสั้น เคลื่อนย้ายรวดเร็วเมื่อถูกรบกวน  สามารถบินได้เป็นระยะทางไกลหลายกิโลเมตร  ชอบบินมาเล่นไฟตอนกลางคืน ข้อมูลเพิ่มเติม http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=47.htm การป้องกันกำจัด 1). ใช้แสงไฟล่อแมลงและทำลายเมื่อมีการระบาดรุนแรง 2). ปลูกข้าวพร้อม ๆ กัน และปล่อยพื้นนาว่างไว้ระยะหนึ่ง เพื่อตัดวงจรชีวิตของแมลง'
    } else if (name === 'riceearcutting') {
        found = 'คือ หนอนกระทู้คอรวง หนอนกระทู้คอรวงมีอีกชื่อคือ หนอนกระทู้ควายพระอินทร์ ตัวเต็มวัยเป็นผีเสื้อกลางคืน ปีกคู่หน้าสีน้ำตาลอ่อน แทรกสีน้ำตาลแดง ชอบกัดกินส่วนคอรวงหรือระแง้ของรวงข้าวที่กำลังจะสุก ทำให้คอรวงขาด หนอนจะกัดกินต้นข้าวทุกวันจนกระทั่งเข้าดักแด้ พบระบาดมากหลังน้ำท่วมหรือฝนตกหนัก หลังผ่านช่วงแล้งที่ยาวนานแล้วตามด้วยฝนตกหนัก การทำลายจะเสียหายรุนแรง ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://www.ricethailand.go.thrkb3/title-index.php-file=content.php&id=58-1.htm อาจกำจัดได้โดยการกำจัดวัชพืชบริเวณนา'
    } else if (name === 'fly') {
        found = 'คือแมลงวัน เป็นแมลงที่อาศัยอยู่กับชุมชนมนุษย์ชนิดหนึ่ง ส่วนมากคนจะรู้จักบางชนิด มักจะกินอาหารที่เป็นเนื้อสัตว์และเศษอาหาร ตามกองขยะ และชอบหากินเวลากลางวัน อาจใช้กาวดักแมลงวัน แต่แมลงวันไม่ได้ถือเป็นแมลงศัตรูพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://www.cheminpestcontrol.com/products/product-36'
    } else if (name === 'ant') {
        found = 'คือมด มดเป็นสัตว์สังคมในกลุ่มแมลง ซึ่งเป็นสัตว์เล็ก ๆ มดมีลักษณะก้านตัวแบ่งออกเป็นส่วนๆ ประกอบด้วยศอก ลำตัวและสะโพก มดมีเปลือกแข็งที่เรียกว่าเกราะ ซึ่งช่วยปกป้องส่วนของตัวมดและให้ความแข็งแรง แต่มดไม่ได้เป็นศัตรูพืช ซึ่งไม่ได้มีการทำลายต้นพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://www.cheminpestcontrol.com/blogs/ant/infoant'
    } else if (name === 'cockroach') {
        found = 'คือแมลงสาบ มีลักษณะลำตัวยาวรีเป็นรูปไข่ เป็นสีดำหรือสีน้ำตาลเข้ม มีส่วนหัวซ่อนอยู่ใต้อก มีหนวดยาวคล้ายเส้นด้าย ส่วนขายาวมีหนามคลุม ตัวเต็มวัยมีทั้ง มีปีกและไม่มีปีก เป็นแมลงที่หากินตามพื้นดินเป็นหลักตามที่มืด ๆ หรือในเวลากลางคืน ไม่ชอบที่จะบิน และวิ่งได้เร็วมาก ไม่เป็นศัตรูพืช หรือกล่าวได้ว่าแมลงสาบไม่ได้ทำอันตรายต่อพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://www.one-step.co.th/?p=29'
    } else if (name === 'LonghornedGrasshopper') {
        found = 'คือ ตั๊กแตนหนวดยาว  ลักษณะเด่นมีหนวดยาวกว่าลำตัว หัวและอกสีเขียว ฟีเมอร์ของขาคู่หลังขยายใหญ่มีสีเขียว ส่วนปลายที่ติดกับทิเบียจะเรียวเล็ก ทิเบียมีหนามสีดำ ปีกหน้าสีเขียวปนน้ำตาล เป็นตัวห้ำกินไข่ผีเสื้อหนอนกอ ตัวอ่อนของเพลี้ยกระโดดและเพลี้ยจักจั่น ช่วยกำจัดศัตรูพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://tinyurl.com/3fjc3r9v'
    } else if (name === 'ladybug') {
        found = 'คือเต่าทอง จัดเป็นแมลงขนาดเล็กเมื่อเทียบกับแมลงปีกแข็งทั่วไป  ลำตัวอ้วนกลม ส่วนใหญ่ที่พบในประเทศไทย มักมีปีกสีแดง ส้ม เหลือง และมักจะแต้มด้วยสีดำเป็นจุด ไม่ได้เป็นศัตรูพืชแต่กำจัด(กิน)ศัตรูพืชตามธรรมชาติ (เป็นตัวห้ำ) https://oer.learn.in.th/search_detail/result/261694'
    } else if (name === 'spider') {
        found = 'คือแมงมุม จัดเป็นสิ่งมีชีวิตพวกสัตว์ขาปล้อง มี 8 ขา แมงมุมมีลำตัวเพียงสองส่วนเท่านั้น  และส่วนที่เป็นลำตัวประกอบไปด้วยส่วนหัวและส่วนอกเชื่อมติดต่อกัน ส่วนหลังเรียกว่าส่วนท้อง แมงมุมจะไม่มีปีก ไม่ได้เป็นศัตรูพืชแต่มีส่วนในการกำจัดศัตรูพืชตามธรรมชาติ ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://tinyurl.com/4dwzaddx'
    } else if (name === 'dragonfly') {
        found = 'คือแมลงปอ มีจุดเด่น คือ มีส่วนหัวที่กลมโตใหญ่ มีดวงตาขนาดใหญ่ 2 ดวงอยู่ด้านข้าง แมลงปอ มีขากรรไกรล่างที่แข็งแรง แหลมคม มีขนาดใหญ่ โฉบจับแมลงต่าง ๆ กินเป็นอาหาร ไม่ใช่ศัตรูพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=86-1.htm'
    } else if (name === 'longhornedcicada') {
        found = 'คือ จักจั่นหนวดยาว เป็นแมลงที่มีตาขนาดใหญ่ อยู่ด้านข้างของหัว มีประสาทการรับรู้ที่ดีอยู่บนปีก ดูดกินน้ำเลี้ยงจากพืชเป็นอาหาร ซึ่งมีหนวดยาวและมีรูปร่างที่สวยงาม เป็นแมลงที่มีขนาดใหญ่มากถึง 2-6 เซนติเมตร และมีหนวดยาวอันหนาที่เรียกว่า "หนวดกราด" ซึ่งเป็นเอกลักษณ์ที่แตกต่างจากแมลงส่วนใหญ่ ส่วนใหญ่จักจั่นหนวดยาวมีเปลือกแข็งและเป็นเพลียวเรียว โดยมีสีและลวดลายที่หลากหลาย ข้อมูลเพิ่มเติม https://tinyurl.com/ah7kbbvy ใช้บิวเวอร์เรียกำจัด http://www.pmc08.doae.go.th/beauveria.htm'
    } else if (name === 'Bugs') {
        found = 'คือมวน มวนดูดไข่มีสีน้ำตาล ปีกหน้าสีน้ำตาลอ่อนตลอดทั้งปีก เป็นตัวห้ำทำลายไข่เพลี้ยกระโดดและเพลี้ยจักจั่น มีอีกชนิดคล้าย ๆ กันคือ มวนเขียวดูดไข่มีสีเขียวหนวด หัว และอกสีดำ เพศผู้โคนปีกหน้าสีเขียว ปลายปีกสีเทาหรือดำอ่อน เป็นตัวห้ำดูดกินไข่เพลี้ยกระโดดสีน้ำตาลและเพลี้ยจักจั่นทำให้ไข่แฟบ มวนตัวห้ำนี้เป็นศัตรูธรรมชาติของเพลี้ยกระโดดสีน้ำตาล ตรวจสอบข้อมูลมวนดูดไข่ได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=74-1.htm ตรวจสอบข้อมูลมวนเขียวดูดไข่ได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=73-1.htm'
    } else if (name === 'Colliurispensylvanica') {
        found = 'คือด้วงดิน  ตัวเต็มวัยยาวประมาณ 7-8 มิลลิเมตร หนวดยาว ปลายหนวดมีสีน้ำตาลดำเข้ม อกส่วนหน้ายาวกลมลักษณะคล้ายคอ มีสีน้ำตาลแดง  ด้วงดินเป็นตัวห้ำของตัวอ่อนและตัวเต็มวัยของเพลี้ยกระโดดและเพลี้ยจักจั่น หนอนและดักแด้ของผีเสื้อกินใบ  ไข่ผีเสื้อหนอน  หนอนและดักแด้แมลงบั่ว ดังนั้นจึงช่วยกำจัดแมลงศัตรูพืชได้ ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=78-1.htm'
    } else if (name === 'Habrobraconhebetor') {
        found = 'คือแตนเบียนหนอน ตัวเต็มวัยมีขนาดยาวประมาณ 8 มิลลิเมตร สีน้ำตาลดำ ส่วนปล้องท้องมีสีน้ำตาลแดง มีสีน้ำตาลดำแถบพาดขวางเป็นช่วงๆ  เป็นแตนเบียนของหนอนกอแถบลาย  หนอนกอสีครีม และหนอนห่อใบข้าว ช่วยลดปริมาณของศัตรูพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=65-1.htm'
    } else if (name === 'Paederusdermatitis') {
        found = 'คือด้วงก้นกระดก เป็นด้วงขนาดเล็ก โคนหนวดสีน้ำตาลแดง ส่วนปลายสีน้ำตาลดำ มีขนตามปล้องหนวด หัวแบนสีดำ อกหน้าแบนยาว สีน้ำตาลไหม้ ปีกมีสีดำ ปีกสีน้ำเงินเข้มเป็นแมลงที่มีอายุอยู่ได้ยาวนาน มีความว่องไว ไต่ไปตามต้นข้าว และบินได้ ช่วยควบคุมการระบาดของแมลงศัตรูพืช ตรวจสอบข้อมูลเพิ่มเติมได้ที่ http://www.ricethailand.go.th/rkb3/title-index.php-file=content.php&id=77-1.htm ส่วนโทษ ของด้วงก้นกระดกคือ หากเราสัมผัสถูกพิษของมันเข้าอาจจะทำให้เกิดแผลพุพองได้ ตรวจสอบข้อมูลเพิ่เติมได้ที่ https://tinyurl.com/2s4j7rf6'
    } else if (name === 'riceseedlingarmyworm') {
        found = 'คือ หนอนกระทู้กล้า แมลงที่ใช้ปากกัด และทำลายต้นข้าวในระยะที่เป็นตัวหนอนเท่านั้น ตัวแก่ของมันมีลักษณะคล้ายผีเสื้อ ตัวหนอนจะเข้าทำลายต้นกล้า โดยใช้ปากกัดกินใบตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://web.ku.ac.th/nk40/nk/data/03/lab1k62.htm วิธีการกำจัด เอาต้นหญ้า หรือฟางข้าวมากองไว้บนคันนา เพื่อล่อให้ตัวหนอนเข้าไปอาศัยในเวลากลางวัน ในเวลาบ่ายให้เก็บเอาตัวหนอนออกมาทำลาย หรืออาจใช้น้ำส้มควันไม้ https://www3.rdi.ku.ac.th/?p=34938'
    } else if (name === 'Mantis') {
        found = 'คือ ตั๊กแตนตำข้าว ตัวเมียมีขนาดที่ตัวใหญ่กว่าตัวผู้ มีลำตัวสีเขียว หรือสีน้ำตาล มีอกปล้องแรกยาว มีลักษณะท่าทีชอบยืนขยับตัวขึ้นลง ๆ เนื่องจากมีขาคู่หน้าที่พัฒนาให้กลายเป็นขาหนีบใช้สำหรับจับเหยื่อ เวลาเมื่อไม่ได้ใช้งาน มักจะยกขึ้นประกบกันอยู่ที่ด้านหน้า เป็นแมลงที่ควบคุมศัตรูพืช แมลงชนิดนี้มีรูปร่างค่อนข้างยาวและมีหนวดยาวสองอันที่ยื่นออกมาจากหัว ตรวจสอบข้อมูลเพิ่มเติมได้ที่ https://www.jardineriaon.com/mantis-religiosa.html'
    } else if (name === 'eastindianjewsmallow') {
        found = 'คือ ปอวัชพืช หรือ กระเจานา ลำต้นตั้งตรงแตกกิ่งก้านสาขามาก สูงประมาณ 1 เมตรมีลำต้นแข็ง มีใบกว้าง ชอบขึ้นในสภาพไร่ มีลำต้นสูง ใบใหญ่คล้ายปอกระเจาขึ้นในนาหว่านข้าวแห้ง ขยายพันธุ์ด้วยเมล็ด '
    } else if (name === 'bermudagrass') {
        found = 'คือ หญ้าแพรก ลำต้นทอดนาบกับพื้นและยกสูงขึ้นได้ประมาณ 30 ซ.ม. แผ่นใบแหลมเล็กแคบเรียว ผิวใบเกลี้ยง ลิ้นใบเป็นแผ่นบาง ช่อดอกมี 3-7 ช่อดอกย่อยซี่งอยู่ติดกันตรงปลายโคนก้านเรียงเป็นวงรอบข้อ ขยายพันธุ์ด้วยเมล็ด, ไหล และลำต้นเจริญเติบโตได้ดีในสภาพดินแห้งและชื้นในข้าวไร่และนาดอนนาน้ำฝนจะขึ้นพร้อมข้าว'
    } else if (name === 'waterclover') {
        found = 'คือ ผักแว่น ลำต้นทอดเลื้อยไปตามพื้น ใบมีสี่แฉกโดยมีก้านใบชูขึ้น ไม่มีดอกไม่มีเมล็ดขยายพันธุ์ด้วยไหล และสปอร์ โดยสปอร์เป็นจุดสีดำอยู่ด้านหลังใบ ขึ้นในที่ชื้น มีน้ำขัง และทางน้ำหากดินแฉะรากจะหยั่งดินตื้นๆ หากมีน้ำขังจะลอยน้ำ ระบาดรุนแรงจะทำให้ข้าวไม่แตกกอและให้ผลผลิตต่ำ'
    } else if (name === 'tallfringerush') {
        found = 'คือ หญ้าหนวดปลาดุก มีอีกชือคือ หนวดแมว, หญ้าน้ำร้อน    ใบแตกขึ้นเป็นกอ  แบนและบอบบางคล้ายพัด  ลำต้นอาจมีลักษณะกลมหรือเป็นสามเหลี่ยมไม่มีข้อปล้อง ใบไม่แยกเป็นก้านใบและแผ่นใบ  ใบแหลมแผ่นใบเล็กและยาว  ก้านชูดอกสูง 25-50 ซม.  ช่อดอกเป็นรูปคล้ายร่มซ้อนกันหลายชั้น  ประกอบด้วยดอกย่อย 50-100 ดอก  แต่ละดอกจะเป็นรูปกลมไม่มีก้าน ประกอบด้วยดอกจำนวนมาก  ออกดอกหลังงอกเพียง 1-2 เดือน  มีวงจรชีวิตประมาณ 3-4 เดือน  ชอบงอกในสภาพดินชื้น ไม่งอกใต้น้ำที่ลึกกว่า 2 ซม. เมื่องอกแล้วเจริญได้ในที่น้ำขัง  เติบโตได้ในที่แห้งและน้ำขัง  พบมากในที่ดินมีฟอสฟอรัสสูง  ขยายพันธุ์ด้วยเมล็ดแพร่ระบาดโดยลมและน้ำ'
    } else if (name === 'swollenfingergrass') {
        found = 'คือ หญ้ารักนก ลำต้นทอดไปกับพื้นและยกสูงขึ้นได้ประมาณ 30-100 ซ.ม. กาบใบเกลี้ยงลิ้นใบเป็นแผ่นบางด้านข้างมีขนยาว  ช่อดอกมี 9-12 แขนง ช่อดอกย่อยซี่งอยู่กระจายปลายโคน ก้านดอกลักษณะเหมือนพู่   ออกดอกตลอดปี  ขยายพันธุ์ด้วยเมล็ด  โดยทั่วไปแล้วจะงอกพร้อมข้าวและมักพบในที่รกร้างและริมถนน'
    } else if (name === 'indianheliotrope') {
        found = 'คือ ผักงวงช้าง ชอบขึ้นในสภาพไร่ มีดอกเป็นงวงยาว สีขาว ใบใหญ่ ไม่เรียบ มีขนตามลำต้นและใบ ต้นเตี้ย ขยายพันธุ์ด้วยเมล็ด มีขึ้นในนาหว่านข้าวแห้งและนาหยอด'
    } else if (name === 'junglerice.') {
        found = 'คือ หญ้านกสีชมพู ลำต้นตั้งตรงสูง 30-60 ซ.ม.  กอแผ่บนผิวดิน ใบมีความเรียวและเรียบ ออกดอกเมื่ออายุประมาณ 50 วันออกดอกได้ตลอดปีและมีวงจรชีวิตประมาณ 3 เดือน  ชอบงอกในสภาพดินแห้งและมีความชื้น  มักงอกพร้อมหรือหลังข้าว 1-2 สัปดาห์  ไม่สามารถยืดตัวหนีน้ำได้แต่ทนน้ำท่วมได้ 2 สัปดาห์'
    } else if (name === 'barnyardgrass') {
        found = 'คือ หญ้าข้าวนก หรือ หญ้าคอมมิวนิสต์ หรือ หญ้าพุ่มพวง ใบอ่อนจะเป็นคลื่นสีเขียวอ่อนถึงสีเขียว เส้นใบสีเขียวอ่อน ใบจะยาวกว่าใบข้าว ดอกเป็นช่อ ออกดอกได้ตลอดปีเมื่ออายุ 2-3 เดือน ชอบขึ้นในสภาพดินชื้นแฉะความชื้นตั้งแต่ 50 % สามารถงอกใต้น้ำได้ลึก 1-2 เซนติเมตร การขังน้ำไว้ประมาณ 3-7 วัน จะสามารถทำลายการพักตัวของเมล็ดได้ เจริญเติบโตได้ดีในสภาพน้ำขัง'
    } else if (name === 'redsprangletop') {
        found = 'คือ หญ้าดอกขาว หรือ หญ้าไม้กวาด หรือ หญ้าลิเก ลำต้นตรงหรือโน้ม ความสูง 12-120 ซ.ม.  ใบเรียบและปรกแหลมและเรียวยาว  กาบใบเรียบ มีเยื่อกันน้ำฝนเป็นแผ่นบาง ออกดอกได้ตลอดปี  ชอบขึ้นในสภาพดินแห้งถึงชื้น ไม่ชอบขึ้นในสภาพดินแฉะและไม่สามารถงอกใต้น้ำได้  หากงอกแล้วจะสามารถเจริญเติบโตได้ดีในสภาพน้ำขัง  แต่ไม่สามารถยืดตัวหนีน้ำได้'
    } else if (name === 'pickerelweed') {
        found = 'คือ ขาเขียด หรือ ผักอีฮีน พืชใบเลี้ยงเดี่ยว พืชน้ำที่รากหยั่งดินหรือในดินแฉะ ส่วนที่อยู่เหนือดินเป็นกอ ใบที่แตกจากลำต้นเรียงสลับสองแถว  สูงประมาณ 30 เซนติเมตร ช่อดอกออกที่กลางก้านใบ  ประกอบด้วยดอกย่อย 2-15 ดอก  สีม่วงน้ำเงินอ่อนหรือฟ้า  งอกได้ในที่ชื้นและน้ำขัง  ในสภาพที่ดินดี ขึ้นหนาแน่นน้อย น้ำตื้น  ใบจะป้อม  และเป็นปัญหารุนแรงในสภาพที่ดินมีความอุดมสมบูรณ์สูง แต่หากสภาพดินเลว หรือขึ้นหนาแน่นมาก หรือน้ำลึก  ใบจะแหลมเล็ก'
    } else if (name === 'smallflowerumbrellasedge') {
        found = 'คือ กกขนาก ลำต้นมีลักษณะเป็นสามเหลี่ยมไม่มีข้อปล้อง ใบไม่แยกเป็นก้านใบและแผ่นใบ ก้านชูดอกสูง 30-40 ซ.ม. ดอกเป็นดอกช่อ ลักษณะแน่นกลม คล้ายร่มที่ซ้อนกัน ออกดอกตลอดปี เมื่ออายุ 2-3 เดือน ขยายพันธุ์ด้วยเมล็ด ชอบขึ้นในที่ชื้นแต่ไม่งอกใต้น้ำ เมื่องอกแล้วเจริญเติบโตได้ในที่น้ำขัง'
    } else if (name === 'swampmorningglory') {
        found = 'คือ ผักบุ้ง ลำต้นกลมเป็นเถาเลื้อยยาวหลายเมตร ขยายพันธุ์ด้วยเมล็ดและลำต้น  ทั้งลำต้นและใบเมื่อตัดแล้วจะมียางสีขาว ลำต้นกลวงลอยน้ำได้ จึงสามารถอยู่ได้ในสภาพระดับน้ำลึกได้'
    } else if (name === 'wirebush') {
        found = 'คือ เซ่งใบมน ลำต้นสูง 50-170 ซม. เมล็ดพ้นระยะพักตัวได้ด้วยความร้อนจากการเผาฟางข้าว เมล็ดงอกได้ดีในสภาพดินแห้งถึงชื้น ไม่สามารถขึ้นน้ำได้ แต่เจริญเติบโตได้ในน้ำขัง ออกดอกราวกันยายน-ตุลาคม พบมากในนาหว่านข้าวแห้ง'
    } else if (name === 'spreadingdayflower') {
        found = 'คือ ผักปราบนา ลำต้นและใบอวบน้ำเลื้อยใบแหลมยาว ขึ้นได้ในสภาพไร่หรือในที่ชื้นเจริญเติบโตได้ดีในที่ชื้นหรือมีน้ำขัง งอกพร้อมข้าวหรือหลังฝนตกหนักแข่งขันกับข้าวได้รุนแรงเพราะมีลำต้นยาวเจริญเติบโตได้ดีในที่น้ำลึกจึงอยู่ได้ในสภาพน้ำลึกแต่จะตายเมื่อถูกน้ำท่วมยอด ออกดอกในเดือนกันยายนเป็นต้นไป เนื่องจากลำต้นยาวและลอยน้ำได้ประกอบกับเป็นวัชพืชอายุข้ามปีจึงแข่งขันกับข้าวได้ไปจนถึงระยะเก็บเกี่ยว'
    } else if (name === 'waterprimrose') {
        found = 'คือ เทียนนา ลำต้นตั้งตรงแตกกิ่งก้านสูง 25-70 ซ.ม. ขยายพันธุ์ด้วยเมล็ดชอบขึ้นในที่ชื้น ไม่สามารถงอกใต้น้ำ เมื่องอกแล้วเจริญเติบโตได้ในที่ชื้นหรือมีน้ำขังแต่ไม่สามารถยืดตัวหนีน้ำได้ ออกดอกเมื่ออายุประมาณ 2 เดือน เมล็ดสุกแก่และตายเมื่ออายุประมาณ 4 เดือน'
    } else if (name === 'crowfootgrass') {
        found = 'คือ หญ้าปากควาย หรือ หญ้าปากคอก  ลำต้นทอดนาบกับพื้นและยกสูงขึ้นได้ประมาณ 40-50 ซ.ม. กาบใบเป็นแผ่นหนาเนื้อหยาบ ลิ้นใบเป็นแผ่นบางมีขน ช่อดอกมี 4-5 ช่อดอกย่อยซี่งอยู่ติดกันตรงปลายโคนก้านดอก ออกดอกตลอดปี ขยายพันธุ์ด้วยเมล็ด เจริญเติบโตได้ดีในสภาพดินชื้นในข้าวไร่จะขึ้นพร้อมข้าว'
    } else if (name === 'fingergrass') {
        found = 'คือ หญ้าตีนนก ลำต้นทอดไปกับพื้นและยกสูงขึ้นได้ประมาณ 30-50 เซนติเมตร กาบใบเกลี้ยง ลิ้นใบเป็นแผ่นยาว ช่อดอกมี 4-7 แขนง ช่อดอกย่อยซึ่งกระจายจากปลายโคนก้านลักษณะเหมือนพู่ โดยทั่วไปแล้วจะงอกพร้อมข้าว มักพบในที่รกร้างและริมถนน'
    } else if (name === 'couchgrass') {
        found = 'คือ หญ้าตีนกา หรือสะกาดน้ำเค็ม ลำต้นตั้งตรงหรือแผ่ราบไปกับพื้นมีลำต้นใต้ดินและไหลอยู่ใต้ดินอย่างหนาแน่น แตกกิ่งก้านในแนวราบ ชูช่อดอกสูงถึง 60 เซนติเมตรขยายพันธุ์ด้วยเมล็ด, ไหลและลำต้นใต้ดิน ชอบขึ้นในดินชื้นแฉะหรือน้ำขังและที่แห้ง มีการเจริญเติบโตรวดเร็ว พบมากในนาดำและนาหว่านข้าวแห้ง'
    } else if (name === 'housepurslane') {
        found = 'คือ ผักเบี้ยหิน ลำต้นแผ่แนบไปตามพื้น ใบและลำต้นอวบน้ำ กิ่งก้านโปร่งมีขนละเอียดออกดอกได้ตลอดปี ผลมีลักษณะเป็นฝักอยู่ติดตามซอกใบขยายพันธุ์ด้วยเมล็ดงอกได้ในสภาพดินแห้งและชื้น เจริญเติบโตได้ในสภาพแห้งไม่ชอบสภาพน้ำขัง พบในข้าวไร่และนาดอนพื้นที่นาน้ำฝน'
    } else if (name === 'almorira') {
        found = 'คือ สะอึก ชอบขึ้นในสภาพดินชื้นแฉะ ทนแล้ง แต่ก็เจริญเติบโตได้ในน้ำขังและทนน้ำท่วม มีลักษณะเป็นเถาเลื้อยเหนียว ระบบรากเหนียวแน่นถอนยาก เมื่อตัดใบหรือเถาจะมียางเหนียวสีขาวไหลออกมาขยายพันธุ์ด้วยเมล็ด มีขึ้นในนาดำและนาหว่านข้าวแห้ง'
    } else if (name === 'slenderamaranth') {
        found = 'คือ ผักโขมไร้หนาม หรือ ผักโขม ลำต้นตั้งตรง บางส่วนอาจราบไปกับพื้น สูง 30 - 90 เซนติเมตรชอบขึ้นในสภาพไร่ ดินร่วน ใบรูปร่างอ่อนนุ่ม ลำต้นอวบอ่อนเจริญเติบโตเร็วแตกกิ่งก้านออกด้านข้างมาก ขยายพันธุ์ด้วยเมล็ด ชอบขึ้นในนาหว่านข้าวแห้ง และนาหยอด'
    } else if (name === 'falsedaisy') {
        found = 'คือ กะเม็ง ลำต้นกลมตั้งตรงสูง 30-60 ซ.ม. มีขนแข็งสากมือ แตกแขนงมาก ที่โคนต้นอาจมีสีแดงอมม่วง ใบเป็นใบเดี่ยวออกจากลำต้นตรงข้ามเป็นคู่ ใบค่อนข้างแคบเรียวยาว ไม่มีก้านใบ มีขนสั้นๆ สีขาวปกคลุมทั่วใบ ชอบขึ้นและเติบโตในสภาพดินมีความชื้นและแห้ง ขยายพันธุ์ด้วยเมล็ด ขึ้นได้ในสภาพไร่ ดินชื้น แฉะหรือน้ำขัง'
    } else if (name === 'alyceclover') {
        found = 'คือ ถั่วลิสงนา ชอบขึ้นในสภาพไร่ มีลำต้นแผ่คลุมดิน ใบกลมแตกออกในด้านตรงกันข้าม ขยายพันธุ์ด้วยเมล็ด มีในนาหว่านข้าวแห้ง'
    }
    //return client.pushMessage(event.source.userId, { type: 'text', text: found })
}

function senddata(found, name, event) {
    return client.pushMessage(event.source.userId, {
        type: "flex",
        altText: "This is a Flex message",
        contents: {
            "type": "bubble",
            "direction": "ltr",
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": found[0],
                        "weight": "bold",
                        "size": "lg",
                        "align": "center",
                        "contents": []
                    }
                ]
            },
            "hero": {
                "type": "image",
                "url": found[1],
                "size": "full",
                "aspectRatio": "1.51:1",
                "aspectMode": "fit"
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": found[2],
                        "align": "center",
                        "contents": []
                    },
                    {
                          "type": "separator",
                        "margin": "xxl",
                        "color": "#FFFFFFFF"
                    },
                    {
                        "type": "button",
                        "action": {
                            "type": "postback",
                            "label": "ขอรายละเอียด",
                            "data": name
                        },
                        "style": "primary"
                    },
                    {
                        "type": "separator",
                        "margin": "xxl"
                    },
                    {
                        "type": "button",
                        "action": {
                            "type": "message",
                            "label": "กลับสู่การเลือกโหมด",
                            "text": "mode"
                        },
                        "style": "secondary"
                    }
                ]
            }
        }
    })
}
