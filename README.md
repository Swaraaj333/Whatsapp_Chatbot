# Whatsapp_Chatbot

1)make index.js file,package.json,record.json in your own github repository


2)Name the repository as Whatsapp_chatbot.


3)Now open render.com (this is where the deployment process will start).


4)Go to new and create a web service under Chatbot Project(just name it , you will have one free project)


5)Now it will get tricky.So do this with patience.


6)You will have to login to Meta for developers,search on google and login.


7)How to use Meta API 


a)Go to https://developers.facebook.com/apps/ and create new app name it Demo_Whatsapp_Chatbot

b)you will get options of everywhere meta can be used select whatsapp

c)click on whatsapp in the left side,then click on api setup

d)Three important things you need 

d1)Access Token -> Generate it this will be temporary,[ADD THIS BY CREATING YOUT OWN ACCESS TOKEN AND REPLACE IN CODE]

d2)Phone Number ID -> This will be below the Test number(this is a temporary number you will get messages from this)[ADD THIS WHICH SHOWS WHEN YOU GO TO THE API PAGE OF META WHATSAPP]

IMPORTANT --> Add receipients phone number as your number to test.

d3)You will find this in the begining of index.js let it remain same as --> const VERIFY_TOKEN = "snsverify";[LET OT REMAIN THIS ,THIS WORKS JUST LIKE PASSWORD].


8)click on send message at step two you will receive hello world from whatsapp.


9)NOW IT IS IMPORTANT .[YOU HAVE PASTED ACCESS TOKEN,PHONE NUMBER ID AND VERIFY TOKEN] and this will be pasted in the original code where i will mention it to change.


10)GO TO RENDER AGAIN, Connect render with your github.


11)Select New -->New Webservices-->Select the repository named Whatsapp_Chatbot that you made before,now -->select project


12)Environment --> production,Then select -->Node,then select --> main,leave eg src(root directory) as it is.


13)in build command paste this ---> npm install


14)in start command paste this ---> index.js   [This is the name of js file/Code file]


15)Then select 0 dollars free option


16)In Environment variable create three variable and paste the values from code


a)VERIFY_TOKEN
b)ACCESS_TOKEN
c)PHONE_NUMBER_ID
In the right box of value paste their values from index.js code


17)Then shazam click on deploy services [The magic starts]


18)This can take upto 1 min to build and deploy as it will go through all the files index.js , package.json and record,json


19)It will redirect to new page you can see the activity after 1 minute you will get a url[Wait until it is fully deployed].


20)The a url will be visible to you.


21) Supoose the url is : https://sns-ngo-chatbot.onrender.com
[THIS IS NOT THE ACTUAL URL]
IMPORTANT :  edit this and add / webhook at the end


22)The url will look like https://sns-ngo-chatbot.onrender.com/webhook


23)Now go to the meta page and scroll you will find webhook , click on it.


24)New page will pop up


25)In callback url add this url https://sns-ngo-chatbot.onrender.com/webhook [DONT FORGET THE /webhook or it will show error]


26)In Verify Token fill : snsverify [OR WHATEVER YOU WANT THIS ACTS JUST LIKE PASSWORD BUT IT WHOULD BE SAME AS IN CODE]


27)Select Whatsapp business if it apeears then click on verify and save ,the in webhook fields subscribe to messages.


28)FINALLY IT IS DONE text hi to the number in small letters and let the chatbot speak to you.



NOW TO SCALE THIS 


1) Go to Step 5: Add a phone number
Add and verify your business phone number to start sending messages at scale. You can manage your numbers at any time from WhatsApp Manager.
Simply add and verify your number.


2)Step 6: Add payment method
Add a payment method to start sending business-initiated messages to your customers. Remember, your first 1000 user-initiated conversations each month are free.
NOW IT IS IMPORTANT TO PAY ATTENTION META WILL CHARGE YOU IF WE EXCEED OVER 1000 CONVERSATIONS SO PAY ATTENTION.
THE 1000 CONVERSATIONS MUST B USER INITIATED AND NOT YOU.
PLEASE READ METAS POLICIES FOR USING THIS IT CAN COST YOU RS 0.35-0.55 AFTER FREE CONVERSATION LIMIT ENDS.










