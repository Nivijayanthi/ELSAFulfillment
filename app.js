var apiai = require('apiai');
require('dotenv').config();
var appai = apiai("072373aef15e4eeba755d991e20ab919");
const util = require('util');
var moment = require('moment');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
//imports
const template = require('./template');
var http = require("http");
var datetime = new Date();
console.log("datetime", datetime);
//moment(incidentstatusArr[count].sys_updated_on).format('LLL');

app.get("/test", function (req, res) {
    res.send("Hello I am ELSA!");
});

app.post('/fulfillment', async function (req, res) {
    console.log("I am inisde fulfillment", JSON.stringify(req.body));

    var reqMaterialCode;
    var orderNumber;
    var requestQuantity;
    var DBdata = {
        name: 'ELSA',
        version: '1.0',
        storeValues: [
            {
                materialCode: '1H3456786',
                orderNumber: '234567',
                storeQuantity: '216.0',
                unitCost: '6.72',
                approval: 'Pending'
            },
            {
                materialCode: '1H3456978',
                orderNumber: '345672',
                storeQuantity: '34.0',
                unitCost: '1.72',
                approval: null
            },
            {
                materialCode: '1H3456423',
                orderNumber: '456723',
                storeQuantity: '2.78',
                unitCost: '2.72',
                approval: 'Approved'
            }
        ]
    };
    // var carouselResponse = {
    //     "speech": "",
    //     "displayText": "",
    //     "messages": []       
    //     };
    var carouselObject =   {
        "type": 1,
        "platform": "facebook",
        "title": null,
        "subtitle": null,
        "imageUrl": null,
        "buttons": []
      };
    var dialogFlowResponse = {
        speech: "hello",
        messages: []
    }

    var msg = {
        type: 4,
        platform: "facebook",
        payload: {
            facebook: {
                text: null,
                quick_replies: []
            }
        }
    };
    var response;
    let msgList = [];
    let listOfFunds = [];

    if (req.body.result.metadata.intentName == 'CREATE-AMRN') {
        var processData;
        console.log("I am inisde ceate", JSON.stringify(req.body.result));
        reqMaterialCode = req.body.result.parameters.materialCode;
        orderNumber = req.body.result.parameters.orderNumber;
        requestQuantity = req.body.result.parameters.quantity;

        console.log("meterialCode", reqMaterialCode);
        console.log("orderNumber", orderNumber);
        console.log("requestQuantity", requestQuantity);

        DBdata.storeValues.forEach(function (storeValue) {
            console.log("Store value...........", storeValue);
            if (storeValue.materialCode == reqMaterialCode) {
                processData = storeValue;
            }
            console.log("processData", processData);
        });
        if (requestQuantity > processData.storeQuantity) {
            response = "Your request quantity is greater the store availabily.";
            response += "<br/> Requested quantity: " + requestQuantity + "<br/>";
            response += "Store Availability: " + processData.storeQuantity + "<br/>";
            response += "Please try again with correct quantity";
            template.objectArr[0].payload = `Create AMRN for ${reqMaterialCode} in order ${orderNumber}`;
            msg.payload.facebook.text = response;
            msg.payload.facebook.quick_replies = template.objectArr;
            dialogFlowResponse.messages.push(msg);
            return res.json(dialogFlowResponse);
        } else {
            response = "Please review the details given by you";
            response += "<br/> Requested Material Code : " + reqMaterialCode;
            response += "<br/> Requested Order Number : " + orderNumber;
            response += "<br/> Requested Quantity : " + requestQuantity;
            response += "<br/> Store Quantity : " + processData.storeQuantity;
            response += "<br/> Unit Cost : " + processData.unitCost;
            msg.payload.facebook.text = response;
            msg.payload.facebook.quick_replies = template.confirmationQR;
            dialogFlowResponse.messages.push(msg);
            return res.json(dialogFlowResponse);
        }
    }

    if (req.body.result.metadata.intentName == 'GET-AMRN') {
        DBdata.storeValues.forEach(function (storeValue) {
            console.log("")
            if (storeValue.approval == 'Pending') {
                response1 = "Please review the details and do action";
                response = " Requested Material Code : " + reqMaterialCode ;
                response += "Requested Order Number : " + orderNumber 
                response += "Requested Quantity : " + requestQuantity;
                response += " Store Quantity : " + storeValue.storeQuantity;
                response += " Unit Cost : " + storeValue.unitCost;
                response += " Total Cost : " + storeValue.unitCost * requestQuantity
                carouselObject.title = response1;
                carouselObject.subtitle = response;
                carouselObject.buttons = template.approveButtons;
                dialogFlowResponse.messages.push(carouselObject);
            }
        });
        return res.json(dialogFlowResponse);
    }
    //     if (req.body.result.metadata.intentName == 'CHANGE-RISK-PROFILE-TARGET') {
    //         console.log("I am inside target opt", JSON.stringify(req.body.result));
    //         console.log("Current Profile", req.body.result.contexts[0].parameters.CurrentProfile);
    //         var TargetResponse = await buildTargetProfileSelectResponse(req.body.result.contexts[0].parameters.CurrentProfile);
    //         console.log("TargetResponse", TargetResponse);
    //         return res.json(TargetResponse);
    //     }
    //     if (req.body.result.metadata.intentName == 'CRP-TARGET-SELECT-YES') {
    //         var contextLength = req.body.result.contexts.length;
    //         // var updateObject = {
    //         //     RiskCategory: null,
    //         //     From: null,
    //         //     To: null,
    //         //     Active: "Y"
    //         // };
    //         console.log('I am inside Target select', JSON.stringify(req.body.result));
    //         var clientId = req.body.result.contexts[contextLength - 1].parameters.ClientId ? req.body.result.contexts[contextLength - 1].parameters.ClientId : req.body.sessionId.slice(-6);
    //         var targetProfile = req.body.result.contexts[contextLength - 2].parameters.TargetProfile;
    //         listOfFunds = await showListOfFunds(clientId, targetProfile, null);
    //         var objList = new template.QuickReplyTemplate;
    //         var showMore = new template.showMore;
    //         //updateObject.RiskCategory = targetProfile;
    //         //updateObject.From = moment(datetime).format("DD-MMM-YY");
    //        // console.log("timevvvvvvvvvvvvvvvv", moment(datetime).format("DD-MMM-YY"));
    //         if (listOfFunds.length > 0) {
    //             listOfFunds.forEach(async function (value) {
    //                 objList.title = value;
    //                 objList.payload = value;
    //                 await msgList.push(JSON.parse(JSON.stringify(objList)));
    //             });
    //             await msgList.push(showMore);
    //             //query.clientRiskProfileUpdate(clientId, updateObject);
    //             msg.payload.facebook.text = `The risk category has been updated to ${req.body.result.contexts[contextLength - 1].parameters.TargetProfile}. Please find the list of products available for the risk category`;
    //             msg.payload.facebook.quick_replies = msgList;
    //             await dialogFlowResponse.messages.push(msg);
    //             return res.json(dialogFlowResponse);
    //         } else {
    //             response = "Sorry!!There are no products available under the new risk category";
    //             return res.json({
    //                 speech: response,
    //                 displayText: response,
    //                 source: 'portal',
    //             });
    //         }
    //     }
    //     if (req.body.result.metadata.intentName == 'CRP-TARGET-SELECT-NO') {
    //         template.CommonEventCall.followupEvent.name = "thankYou ";
    //         console.log("I am inside no intent", template.CommonEventCall);
    //         return res.json(template.CommonEventCall);
    //     }

    //     if (req.body.result.metadata.intentName == 'CRP-TARGET-SELECT-YES-BUY') {
    //         console.log("resp from dialog flow", JSON.stringify(req.body.result.contexts[0].parameters.ProductName));
    //         var yesOrNo = {
    //             "speech": "",
    //             "displayText": "",
    //             "messages": [{
    //                 "type": 4,
    //                 "platform": "facebook",
    //                 "payload": {
    //                     "facebook": {
    //                         "text": `Do you want to buy ` + req.body.result.contexts[0].parameters.ProductName,
    //                         "quick_replies": [{
    //                             "content_type": "text",
    //                             "title": "Yes",
    //                             "payload": "Yes"
    //                         }, {
    //                             "content_type": "text",
    //                             "title": "No",
    //                             "payload": "No"
    //                         },
    //                         {
    //                             "content_type": "link",
    //                             "title": "Show fund Details",
    //                             "payload": "www.google.com"
    //                         }]
    //                     }
    //                 }
    //             }]
    //         };
    //         return res.json(yesOrNo);
    //     }
    //     if (req.body.result.metadata.intentName == 'CRP-TARGET-SELECT-YES-BUY-YES') {
    //         console.log("I am inside add fund send ", JSON.stringify(req.body.result));
    //         response = `The request to buy  ${req.body.result.contexts[0].parameters.ProductName} has been sent to the Trading desk. You will be receiving a detailed  email shortly.`;
    //         return res.json({
    //             speech: response,
    //             displayText: response,
    //             source: 'portal',
    //         });
    //     }
    //     if (req.body.result.metadata.intentName == 'NEW-TRANSACTION-TYPE-ADD') {
    //         console.log("Inside new transac", req);
    //         var transactType = req.body.result.resolvedQuery;
    //         var clientId = req.body.result.parameters.clientId ? req.body.result.parameters.clientId : req.body.sessionId.slice(-6);
    //         var val;
    //         await query.ClientRiskProfileGet({ ClientID: clientId, Active: 'Y' }).then(function (data) {
    //             console.log("The response from DB risk profile..............", JSON.stringify(data));
    //             val = data.RiskCategory;
    //         });
    //         if (val) {
    //             listOfFunds = await showListOfFunds(clientId, val, transactType);
    //         } else {
    //             listOfFunds = await showListOfFunds(clientId, 'Growth', transactType);
    //         }

    //         var objList = new template.QuickReplyTemplate;
    //         if (listOfFunds.length > 0) {
    //             listOfFunds.forEach(async function (value) {
    //                 objList.title = value;
    //                 objList.payload = value;
    //                 await msgList.push(JSON.parse(JSON.stringify(objList)));
    //             });
    //             msg.payload.facebook.text = "Please find the list of products available for the risk category";
    //             msg.payload.facebook.quick_replies = msgList;
    //             await dialogFlowResponse.messages.push(msg);
    //             return res.json(dialogFlowResponse);
    //         } else {
    //             response = "Sorry!!There are no products available under the new risk category";
    //             return res.json({
    //                 speech: response,
    //                 displayText: response,
    //                 source: 'portal',
    //             });
    //         }
    //     }
    //     if (req.body.result.metadata.intentName == 'ADD-FUND') {
    //         var transactType = "req.body.result.resolvedQuery";
    //         var clientId = req.body.result.parameters.clientId ? req.body.result.parameters.clientId : req.body.sessionId.slice(-6);
    //         var val;
    //         await query.ClientRiskProfileGet({ ClientID: clientId, Active: 'Y' }).then(function (data) {
    //             val = data.RiskCategory;
    //         });
    //         if (val) {
    //             listOfFunds = await showListOfFunds(clientId, val, null);
    //         } else {
    //             listOfFunds = await showListOfFunds(clientId, 'Growth', null);
    //         }

    //         var objList = new template.QuickReplyTemplate;
    //         if (listOfFunds.length > 0) {
    //             listOfFunds.forEach(async function (value) {
    //                 objList.title = value;
    //                 objList.payload = value;
    //                 await msgList.push(JSON.parse(JSON.stringify(objList)));
    //             });
    //             msg.payload.facebook.text = "Please find the list of funds available for the risk category";
    //             msg.payload.facebook.quick_replies = msgList;
    //             await dialogFlowResponse.messages.push(msg);
    //             return res.json(dialogFlowResponse);
    //         } else {
    //             response = "Sorry!!There are no funds available under the new risk category";
    //             return res.json({
    //                 speech: response,
    //                 displayText: response,
    //                 source: 'portal',
    //             });
    //         }


    //     }

    //     if (req.body.result.metadata.intentName == 'ADD-FUND-SEND') {
    //         console.log("I am inside add fund send ", JSON.stringify(req.body.result));
    //         response = `The request to add ${req.body.result.parameters.ProductName} has been sent to the Trading desk. You will be receiving a detailed  email shortly.`;
    //         return res.json({
    //             speech: response,
    //             displayText: response,
    //             source: 'portal',
    //         });
    //     }
    //     if (req.body.result.metadata.intentName == 'NEW-TRANSACTION-TYPE-ADD-SEND') {
    //         console.log("resp frm dialgflw", req.body.result);
    //         var productName = req.body.result.parameters.ProductName;
    //         response = `The request to add ${productName} has been sent to the Trading desk. You will be receiving a detailed  email shortly.`;
    //         return res.json({
    //             speech: response,
    //             displayText: response,
    //             source: 'portal',
    //         });
    //     }
    //     if (req.body.result.metadata.intentName == 'SEND-EMAIL') {
    //         console.log("i am inside exit fund", JSON.stringify(req.body.result));
    //         var clientId = req.body.sessionId.slice(-6);
    //         var resType = req.body.result.contexts[0].name;
    //         console.log("Hellllllllllllllllllo", resType);
    //         if (resType == 'change-risk-profile-followup') {
    //             console.log("Inside change");
    //             var currentProfile = req.body.result.contexts[0].parameters.CurrentProfile;
    //             var targetProfile = req.body.result.contexts[0].parameters.TargetProfile;
    //             response = `The change request for risk category from ${currentProfile} to ${targetProfile} has been sent to the Trading desk. You will be receiving a detailed  email shortly.`;
    //         } if (resType == 'add-fund-folowup') {
    //             console.log("Inside add");
    //             response = `The request to add new fund has been sent to the Trading desk. You will be receiving a detailed  email shortly.`;

    //         }
    //         return res.json({
    //             speech: response,
    //             displayText: response,
    //             source: 'portal',
    //         });

    //     }
    //     if (req.body.result.metadata.intentName == 'CURRENT-RISK-PROFILE') {

    //         var clientId = req.body.sessionId.slice(-6);
    //         //var clientId = 'C10112';
    //         var val;
    //          var updateObject = {
    //             RiskCategory: "Growth",
    //             From: moment(datetime).format("DD-MMM-YY"),
    //             To: null,
    //             Active: "Y"
    //         };
    //         query.clientRiskProfileUpdate(clientId,updateObject);
    //         await query.ClientRiskProfileGet({ ClientID: clientId, Active: 'Y' }).then(function (data) {
    //             console.log("The response from DB risk profile..............", JSON.stringify(data));
    //             val = data[0].RiskCategory;
    //         });
    //         response = `Your current risk profile is ${val}.`;
    //         sendMail(mailContent);
    //         return res.json({
    //             speech: response,
    //             displayText: response,
    //             source: 'portal',
    //         });
    //     }
    //     if (req.body.result.metadata.intentName == 'EXIT-FUND-OPTION-YES') {
    //         console.log("Nivi........",JSON.stringify(req.body.result));
    //         var fundname = req.body.result.contexts[1].parameters.fund_name ? req.body.result.contexts[1].parameters.fund_name : req.body.result.parameters.fund_name;
    //         var clientId = req.body.result.contexts[1].parameters.clientId ? req.body.result.contexts[1].parameters.clientId : req.body.sessionId.slice(-6);
    //         await query.ProductGet({ Name: fundname, Type: 'ETF' }).then(async function (funddetails) {
    //             let productID = funddetails[0].ProductID;
    //             let productName = funddetails[0].Name;
    //             await query.productperformanceGet({ ProductID: productID }).then(async function (product) {
    //                 console.log(productID + "=>" + clientId)
    //                 await query.holdingsProfileGet({ ProductID: productID, CustomerID: clientId }).then(async function (holdingsd) {
    //                     if (product.length > 0 && holdingsd.length > 0) {
    //                         let currentPrice = product[0].Currentprice;
    //                         let quantity = holdingsd[0].Quantity;
    //                         let marketvalue = parseInt(quantity.split(',').join('')) * parseInt(currentPrice);
    //                         response = `The ${fundname} is exited. Details of the funds will be emailed to you shortly.`;
    //                         response += "<br/>Current Price: " + currentPrice + "<br/>";
    //                         response += "Quantity: " + quantity + "<br/>";
    //                         response += "Market Value: " + marketvalue + "<br/>";
    //                         responses = response.replace("<br/>", "\n");
    //                         await query.saveTransactionDetails({ CustomerID: clientId, ProductID: productID, Quantity: quantity, Price: currentPrice, Action: "Sell", Date: moment().format("DD-MMM-YY") });
    //                         return res.json({
    //                             speech: response,
    //                             displayText: response,
    //                             source: 'portal',
    //                         });
    //                     }
    //                 })
    //             })
    //         });
    //     }
    //     if (req.body.result.metadata.intentName == 'EXIT-FUND-OPTION') {
    //         console.log("Dialog flow", req.body.result);
    //         var fundname = req.body.result.parameters.fund_name;
    //         await query.ProductGet({ Name: fundname, Type: 'ETF' }).then(function (funddetails) {

    //             if (funddetails.length > 0) {
    //                 msg = {
    //                     "speech": "",
    //                     "displayText": "",
    //                     "messages": [{
    //                         "type": 4,
    //                         "platform": "facebook",
    //                         "payload": {
    //                             "facebook": {
    //                                 "text": `Do you want to exit the fund ` + fundname,
    //                                 "quick_replies": [{
    //                                     "content_type": "text",
    //                                     "title": "Yes",
    //                                     "payload": "Yes"
    //                                 }, {
    //                                     "content_type": "text",
    //                                     "title": "No",
    //                                     "payload": "No"
    //                                 }]
    //                             }
    //                         }
    //                     }]
    //                 };
    //                 return res.json(msg);
    //             }
    //             else {
    //                 return res.json({
    //                     speech: "Sorry! The selected fund is Not Available",
    //                     displayText: response,
    //                     source: 'portal',
    //                 });
    //             }
    //         })
    //     }
    //     if (req.body.result.metadata.intentName == 'EXIT-FUND') {
    //         //var fundName = req.body.result.parameters.FundName;
    //         var clientId = req.body.result.parameters.clientId ? req.body.result.parameters.clientId : req.body.sessionId.slice(-6);
    //         console.log("Nivetha............",clientId , sessionClientId);

    //         await query.getLowPerformingFund(clientId).then(async function (data) {
    //             quickreplies = [];
    //             await data.forEach(function (value) {
    //                 quickreplies.push({
    //                     "content_type": "text",
    //                     "title": value.product.Name,
    //                     "payload": value.product.Name
    //                 })
    //             })
    //             console.log(quickreplies)
    //             if (data.length > 0) {
    //                 msg = {
    //                     "speech": "",
    //                     "displayText": "",
    //                     "messages": [{
    //                         "type": 4,
    //                         "platform": "facebook",
    //                         "payload": {
    //                             "facebook": {
    //                                 "text": `Please Select the low peforming fund to exit`,
    //                                 "quick_replies": quickreplies
    //                             }
    //                         }
    //                     }]
    //                 };
    //                 return res.json(msg);
    //             } else {
    //                 return res.json({
    //                     speech: "Sorry! No Fund Details Available currently for the profile",
    //                     displayText: response,
    //                     source: 'portal',
    //                 });
    //             }
    //         })
    //         }
})
console.log("Server Running at Port : " + port);

app.listen(port, function () {
    console.log('Listening my app on  PORT: ' + port);
});