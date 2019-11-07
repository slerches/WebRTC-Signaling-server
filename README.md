# WebRTC signaling service with NodeJS

Backend service for video and voice communication.

I used socket.io with nodeJS for the backend. And I have already made it HTTPS ready.
You will need to ensure you have the service registered on a valid SSL. Mobile apps with websockets are prevented from connecting over non SSL sockets. The client implementation of websocket should be done with socket.io.
The default SSL port number is on `8443`. You can also connect to a non SSL port on `8099` just in case you want to test it on your local machine.


# Usage
First, type in your presumed phone number and your name. Then hit register once to register your numbner on the system.
With this done. You can give the number to a friend who can now call you on the systme if they are also registered on the sytem.
You can also call friends who also register by dialing their registered number in the 'Remote User Number' text box.

# Connection
- As an example. If the server IP is `8.8.8.8`. The client socket request should look like below.
  ```sh
   const socket = io.connect('https://8.8.8.8:8443');
  ```
You can listen for ```on connect``` event for successful connection status.

# Function Calls

  - login
    - Before you can perfom any other activity. You will have to register to the system  by providing your unique number and name
    ```sh
        socket.emit('login',{id:'024334455',name:'James Asafuah'});
    ```
       Upon successfull login, you will get a response/event ```registered```
  - call
    - To make a call. You will emit this event with a number of the party you wish to call
     ```sh
      socket.emit('call','024055055');
     ```
     after which if user is available, you will get an on ringing event which you can listen to and perform an activity with that.
  - call
  - desc
  - onice

# Events
 - connect
 - registered
 - calling
 - ringing
 - busy
 - oncall
 - desc
 - candidate
