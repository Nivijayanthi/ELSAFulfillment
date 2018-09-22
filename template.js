module.exports.eventCall ={
followupEvent: {
name: null,
data: {
}
}
//contextOut: req.body.result.contexts
};

module,exports.cardresponse ={
    "speech": "",
    "displayText": "",
    "messages": [
      {
        "type": 1,
        "platform": "facebook",
        "title": "Confirmation",
        "subtitle": null,
        "imageUrl": null,
        "buttons": [
          {
            "text": null,
            "postback": null
          }
        ]
      }     
    ]
   
  };

  module.exports.objectArr =[ {
        "content_type": "text",
        "title": 'Edit quantity',
        "payload": null
    },
    {
        "content_type": "text",
        "title": 'No thanks',
        "payload": 'Thank you'
    }
];