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

module.exports.confirmationQR =[ {
    "content_type": "text",
    "title": 'Proceed',
    "payload": 'Proceed'
},
{
    "content_type": "text",
    "title": 'Decline',
    "payload": 'Thank you'
}
];

module.exports.approveButtons =[ 
  {
  "text": 'Approve',
  "postback": 'Approve'
},
{
  "text": 'Decline',
  "postback": 'Decline'
}
];

module.exports.carouselObject = function()  {
  var carouselObject = {
  "type": 1,
  "platform": "facebook",
  "title": null,
  "subtitle": null,
  //"imageUrl": null,
  "buttons": []
};
return carouselObject;
};