// ==UserScript==
// @name         Surviv.io2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Count games played and overall statistics
// @author       You
// @match        https://surviv.io/
// @grant        none
// ==/UserScript==

document.getElementById("btn-start-mode-0").addEventListener("click", nextGame);
document.getElementById("btn-start-mode-1").addEventListener("click", nextGame);
document.getElementById("btn-start-mode-2").addEventListener("click", nextGame);

document.getElementsByClassName("btn-social-wrapper")[0].addEventListener("click", function(e)
{
    if(e.target.id=="fillBTN")
        fillTable();
    else if(e.target.id=="prevDate")
        prevDate();
});


var observerId=0;
var placementSum;
var observer = new MutationObserver(function(callback)
{
    placementSum=0;
    if(parseInt(observerId%2)==0)
    {
        placementSum+=parseInt(localStorage.getItem(document.getElementById("data").innerHTML).substring(2, 5));
        if(callback[0].target.innerHTML.substring(40, 48)=="You died")
        {
            if(isNaN(parseInt(callback[0].target.innerHTML.substring(188, 189))))
                placementSum+=parseInt(callback[0].target.innerHTML.substring(187, 188));
            else
                placementSum+=parseInt(callback[0].target.innerHTML.substring(187, 189));
        }
        else
            placementSum++;
        localStorage.setItem(document.getElementById("data").innerHTML, localStorage.getItem(document.getElementById("data").innerHTML).substring(0, 2)+placementSum);
        redrawTable(0);
    }
    observerId++;
});
observer.observe(document.getElementById("ui-stats-header"), {childList: true});


function fillTable()
{
    var lengthOfLocalStorage=localStorage.length;
    var arrayOfDates=new Array(lengthOfLocalStorage);

    for(var i=0; i<lengthOfLocalStorage; i++)
    {
        if(localStorage.key(i)!="surviv_config")
        {
            arrayOfDates[i]=localStorage.key(i).substring(6, 10)+localStorage.key(i).substring(3, 5)+localStorage.key(i).substring(0, 2);
        }
    }
    arrayOfDates.sort();
    arrayOfDates.reverse();

    var difference;
    var differenceMonths;
    var month;
    var dateString;
    var dateTemp;

    for(i=2; i<lengthOfLocalStorage-1; i++)
    {
        differenceMonths=parseInt(arrayOfDates[i-1]/100)-parseInt(arrayOfDates[i]/100);
        if(arrayOfDates[i-1]-arrayOfDates[i]!=1)
        {
            if(differenceMonths==0)
            {
                difference=arrayOfDates[i-1]-arrayOfDates[i];
                for(var dif=1; dif<difference; dif++)
                {
                    dateString=(arrayOfDates[i-1]-dif).toString();
                    dateTemp=dateString.substring(6, 8)+"."+dateString.substring(4, 6)+"."+dateString.substring(0, 4);
                    localStorage.setItem(dateTemp, 0);
                }
            }
            else if(differenceMonths!=0)
            {
                for(dif=1; dif<parseInt(arrayOfDates[i-1]%100); dif++)
                {
                    dateString=(arrayOfDates[i-1]-dif).toString();
                    dateTemp=dateString.substring(6, 8)+"."+dateString.substring(4, 6)+"."+dateString.substring(0, 4);
                    localStorage.setItem(dateTemp, 0);
                }
                for(; differenceMonths!=0; differenceMonths--)
                {
                    month=parseInt(parseInt((arrayOfDates[i])/100)%100)+differenceMonths-1;

                    if(month<8)
                    {
                        if(parseInt(month%2)==1)
                            difference=31;
                        else if(parseInt(month%2)==0&&month!=2)
                            difference=30;
                        else
                        {
                            if(parseInt((parseInt(arrayOfDates[i-1]/10000)-2016)%4)==0)
                                difference=29;
                            else
                                difference=28;
                        }
                    }
                    else if(month<8)
                    {
                        if(parseInt(month%2)==1)
                            difference=30;
                        else if(parseInt(month%2)==0&&month!=2)
                            difference=31;
                    }

                    if(differenceMonths==1)
                    {
                        for(; difference>parseInt(arrayOfDates[i]%100); difference--)
                        {
                            if(difference>9)
                            {
                                dateTemp=difference.toString()+"."+month.toString()+"."+parseInt(arrayOfDates[i]/10000).toString();
                                localStorage.setItem(dateTemp, 0);
                            }

                            else
                            {
                                dateTemp="0"+difference.toString()+"."+month.toString()+"."+parseInt(arrayOfDates[i]/10000).toString();
                                localStorage.setItem(dateTemp, 0);
                            }
                        }
                    }
                    else
                    {
                        for(; difference>0; difference--)
                        {
                            if(difference>9)
                            {
                                dateTemp=difference.toString()+"."+month.toString()+"."+parseInt(arrayOfDates[i]/10000).toString();
                                localStorage.setItem(dateTemp, 0);
                            }
                            else
                            {
                                dateTemp="0"+difference.toString()+"."+month.toString()+"."+parseInt(arrayOfDates[i]/10000).toString();
                                localStorage.setItem(dateTemp, 0);
                            }
                        }
                    }
                }
            }
        }
    }
    redrawTable(0);
}

function prevDate()
{
    var prevDay=parseInt(document.getElementById("data").innerHTML.toString().substring(0, 3))-1;
    if(prevDay>9)
        document.getElementById("data").innerHTML=prevDay.toString()+document.getElementById("data").innerHTML.toString().substring(2, 10);
    else
        document.getElementById("data").innerHTML="0"+prevDay.toString()+document.getElementById("data").innerHTML.toString().substring(2, 10);

    var gameNum=localStorage.getItem(document.getElementById("data").innerHTML).substring(0, 2);

    document.getElementById("btn-help").innerHTML=gameNum;
    document.getElementById("btn-start-mode-0").innerHTML=gameNum;
    if(gameNum>=15)
    {
        document.getElementById("btn-help").style.backgroundColor="red";
        document.getElementById("btn-start-mode-0").style.backgroundColor="red";
        document.getElementById("player-name-input-solo").style.backgroundColor="red";
    }
}

function redrawTable(callType)
{
    var arrayOfDates=new Array(localStorage.length);
    for(var n=0; n<localStorage.length; n++)
    {
        arrayOfDates[n]=new Array(4);
    }

    for(var i=0; i<localStorage.length; i++)
    {
        if(localStorage.key(i)!="surviv_config")
        {
            arrayOfDates[i][0]=localStorage.key(i).substring(6, 10)+localStorage.key(i).substring(3, 5)+localStorage.key(i).substring(0, 2);
            arrayOfDates[i][1]=localStorage.key(i);
            arrayOfDates[i][2]=localStorage.getItem(localStorage.key(i)).substring(0, 2);
            if(arrayOfDates[i][2]!=0)
                arrayOfDates[i][3]=parseInt(localStorage.getItem(localStorage.key(i)).substring(2, 5));
        }
    }
    arrayOfDates.sort();
    arrayOfDates.reverse();

    var fullStorage=document.getElementById("ad-block-left");
    fullStorage.style.overflowY="scroll";
    fullStorage.style.overflowX="hidden";
    fullStorage.innerHTML="";

    for(i=0; i<localStorage.length-1; i++)
    {
        fullStorage.innerHTML+="<b id="+arrayOfDates[i][1]+">"+arrayOfDates[i][1]+"\t"+arrayOfDates[i][2]+"</b><br/>";
        if(arrayOfDates[i][2]==0)
        {
            document.getElementById(arrayOfDates[i][1]).innerHTML+="\t\tnice";
            document.getElementById(arrayOfDates[i][1]).style.whiteSpace="pre";
            document.getElementById(arrayOfDates[i][1]).style.color="#1e90ff";
        }
        else if(arrayOfDates[i][2]<=15)
        {
            document.getElementById(arrayOfDates[i][1]).innerHTML+="\t\tnice";
            document.getElementById(arrayOfDates[i][1]).style.whiteSpace="pre";
            document.getElementById(arrayOfDates[i][1]).style.color="green";
            if(parseInt(arrayOfDates[i][2])-callType!=0)
                document.getElementById(arrayOfDates[i][1]).innerHTML+="\t\t"+parseInt(arrayOfDates[i][3]/(parseInt(arrayOfDates[i][2])-callType));
        }
        else
        {
            document.getElementById(arrayOfDates[i][1]).innerHTML+="\t\tThat's too much";
            document.getElementById(arrayOfDates[i][1]).style.whiteSpace="pre";
            document.getElementById(arrayOfDates[i][1]).style.color="red";
            document.getElementById(arrayOfDates[i][1]).innerHTML+="\t\t"+parseInt(arrayOfDates[i][3]/(parseInt(arrayOfDates[i][2])-callType));
        }
    }
}

function nextGame()
{
    var gameCount=parseInt(document.getElementById("btn-help").innerHTML);
    gameCount++;
    var itemContent=localStorage.getItem(document.getElementById("data").innerHTML);
    if(gameCount>=10)
        localStorage.setItem(document.getElementById("data").innerHTML, gameCount+itemContent.substring(2, 5));
    else
        localStorage.setItem(document.getElementById("data").innerHTML, "0"+gameCount+itemContent.substring(2, 5));

    document.getElementById("btn-help").innerHTML=localStorage.getItem(document.getElementById("data").innerHTML).substring(0, 2);
    document.getElementById("btn-start-mode-0").innerHTML=localStorage.getItem(document.getElementById("data").innerHTML).substring(0, 2);
    if(gameCount>=15)
    {
        document.getElementById("btn-help").style.backgroundColor="red";
        document.getElementById("btn-start-mode-0").style.backgroundColor="red";
        document.getElementById("player-name-input-solo").style.backgroundColor="red";
    }
    redrawTable(1);
}


(function() {
'use strict';
var now = new Date();
var data="";

if(now.getDate()<10)
    data+="0"+now.getDate().toString()+".";
else
    data+=now.getDate().toString()+".";
if(now.getMonth()<10)
    data+="0"+(parseInt(now.getMonth())+1).toString()+".";
else
    data+=(parseInt(now.getMonth())+1).toString()+".";
data+=now.getFullYear();

var date=document.createElement("P");
document.body.appendChild(date);
date.style.display="none";
date.id="data";
date.innerText=data;

if(localStorage.getItem(data)==null)
    localStorage.setItem(data, "0000");

document.getElementById("btn-help").innerHTML=parseInt(localStorage.getItem(data).substring(0, 2));
document.getElementById("btn-start-mode-0").innerHTML=parseInt(localStorage.getItem(data).substring(0, 2));
if(parseInt(localStorage.getItem(data).substring(0, 2))>=15)
{
    document.getElementById("btn-help").style.backgroundColor="red";
    document.getElementById("btn-start-mode-0").style.backgroundColor="red";
    document.getElementById("player-name-input-solo").style.backgroundColor="red";
}

redrawTable(0);

var fillBTN=document.getElementsByClassName("btn-social-wrapper")[0];
fillBTN.innerHTML="";
fillBTN.innerHTML+="<div id='prevDate' class='btn-darken menu-option btn-team-option' style='width: 48%; margin-right: 4px; display: inline-block;'>"+"it's the same day"+"</tab>";
fillBTN.innerHTML+="<div id='fillBTN' class='btn-darken menu-option btn-team-option' style='width: 48%; margin-right: 4px; display: inline-block;'>fill the table</tab>";


})();