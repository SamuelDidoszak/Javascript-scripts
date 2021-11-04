// ==UserScript==
// @name         Messenger message preview
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://www.messenger.com/*
// @grant        none
// ==/UserScript==

var newDiv = new MutationObserver(waitForDiv);
var observer = new MutationObserver(displayMessage);
newDiv.observe(document.body, {childList: true});

function waitForDiv(mutation)
{
    if(mutation[0].addedNodes[0] != undefined && mutation[0].addedNodes[0].className.substring(0, 27) == "uiContextualLayerPositioner")
    {
        displayMessage(document.body.children[document.body.children.length-2]);
        observer.observe(document.body.children[document.body.children.length-2], {attributes: true});
        newDiv.disconnect();
    }
}

function displayMessage(mutation)
{
    if(mutation.className == "uiContextualLayerPositioner uiLayer _7vuq" || mutation[0].target.className == "uiContextualLayerPositioner uiLayer _7vuq")
    {
        var popup;
        if(mutation.className == "uiContextualLayerPositioner uiLayer _7vuq")
            popup = mutation;
        else
            popup = mutation[0].target;
        var seen = document.getElementById(popup.attributes["data-ownerid"].value).parentNode.parentNode.parentNode.nextSibling.innerHTML;
        var observedValue = document.getElementById(popup.attributes["data-ownerid"].value).nextSibling.children[1].children[0];
        var name;
        popup = popup.children[0].children[0].children[0].children[0];
        if(seen.substring(152, 155) == "img" || seen.substring(153, 156) == "img") // checks if the message was previously seen
            seen = true;
        else
            seen = false;
        if(observedValue.children.length == 1) //for messages without images
        {
            name = observedValue.innerHTML.substring(0, observedValue.innerHTML.indexOf(":"));

            if(name != "" && name != "Ty" && name != "You")
                popup.innerHTML += "<br/> <span>" + name + ":</span>";
            popup.innerHTML += "<br/> <span>" + observedValue.children.item(0).innerHTML + "</span>";
            if(seen)
                popup.innerHTML += "<br/> <p style ='text-align: right; margin: 0'> seen " + observedValue.parentNode.children[2].innerHTML + "</p>";
            else if(name == "Ty" || name == "You")
                popup.innerHTML += "<br/> <p style ='text-align: right; margin: 0'> sent " + observedValue.parentNode.children[2].innerHTML + "</p>";
            else
                popup.innerHTML += "<br/> <p style ='text-align: right; margin: 0'>" + observedValue.parentNode.children[2].innerHTML + "</p>";
        }
        else if(observedValue.children.length == 2) //for messages with images
        {
            name = observedValue.children[1].innerHTML;
            if(name.charAt(99) == '>')
            {
                name = "<span>" + name.substring(100, observedValue.children[1].innerHTML.indexOf("<", 100))+ "</span>";
                if(name != popup.innerHTML) //checks if it's a group or not
                    popup.innerHTML += "<br/>" + name;
            }
            else
                popup.innerHTML += "<br/> <span> you have </span>";
            popup.innerHTML += "<span> sent a photo </span>";
            if(seen)
                popup.innerHTML += "<br/> <p style ='text-align: right; margin: 0'> seen " + observedValue.parentNode.children[2].innerHTML + "</p>";
            else if(name == "Ty" || name == "You")
                popup.innerHTML += "<br/> <p style ='text-align: right; margin: 0'> sent " + observedValue.parentNode.children[2].innerHTML + "</p>";
            else
                popup.innerHTML += "<br/> <p style ='text-align: right; margin: 0'>" + observedValue.parentNode.children[2].innerHTML + "</p>";
        }
    }
}