<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Real-time Chat App Using NestJS and Websockets

I often find that communication between the client and server occurs using real-time or traditional REST APIs. However, in this article I would like to focus on the real time API — what it is and how it works. To understand this better, we will create a real-time chat app using NestJS and WebSockets.

## Getting Started

1. Clone this repository
```
git clone git@github.com:Gapur/nest-chat-app.git
```
2. Install dependencies
```
npm install
```
3. Launch app
```
npm run start # for npm
```

## What is the Real-time API?

The real-time API is a communication between a client and a server that exchanges data in real time. They are usually based on WebSockets. If you are not familiar with WebSockets, it is a protocol that allows real-time communication between a client and server over a single connection. In NestJS, we can implement it using two WebSockets frameworks such as socket.io and ws. In this project we will use socket.io because it is easier to use.

## Setting Up the Project

Before we start, I would like to talk about the project structure. Since we will be implementing a chat between the client and the server, we need to create two subprojects:
- client — web app in React
- server — real-time app in NestJS

## Creating Our Server

To manage with WebSockets in NestJS, we should use Gateways. This is a simple class annotated with the @WebSocketGateway() decorator which is used to pass data from client to server and server to client.

We will generate a ChatGateway in our server subproject using the following command:

```
nest generate gateway chat
```

It will create a chat folder with chat.gateway.ts and chat.gateway.spec.ts files.

The ChatGateway class is annotated with the WebSocketGateway decorator and has a handleMessage method with a message event subscription decorator. So it will process the incoming message while passing data from the client.

```ts
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

 @WebSocketGateway()
 export class ChatGateway {
   @SubscribeMessage('message') // subscribe to message events
   handleMessage(client: any, payload: any): string {
     return 'Hello world!'; // return the text
   }
 }
 ```

The handleMessage method requires two parameters:
client — a platform-specific socket instance
payload — the data received from the client

How can we send or emit a message from the client side? We can do it using the socket.io-client package:
```
socket.emit('events', { name: 'Nest' });
```

We can also process response data from the server:
```
socket.emit('events', { name: 'Nest' }, (data) => console.log(data));
```

We’ll talk more about it in the next chapter.

In the previous example, we simply returned data from the server to a specific client. Now let’s broadcast a message to all customers who have subscribed up for chat messages.

```ts
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { AddMessageDto } from './dto/add-message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  @SubscribeMessage('chat') // subscribe to chat event messages
  handleMessage(@MessageBody() payload: AddMessageDto): AddMessageDto {
    this.logger.log(`Message received: ${payload.author} - ${payload.body}`);
    this.server.emit('chat', payload); // broadbast a message to all clients
    return payload; // return the same payload data
  }
}
```

Above, to access the socket.io server, we used the WebSocketServer decorator to inject the socket.io server type into the server.

Last, we’ll use two handy lifecycle hooks provided by Nest to show when a socket is connected or disconnected.

```ts
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  ...
  ...
 
  // it will be handled when a client connects to the server
  handleConnection(socket: Socket) {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  // it will be handled when a client disconnects from the server
  handleDisconnect(socket: Socket) {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
```

The ChatGateway class has implemented two interfaces, OnGatewayConnection and OnGatewayDisconnect, provided from the `@nestjs/websockets` package.

Also we defined WebSocketGateway with { cors: { origin: ‘*’ } } configuration option to be available to all origins. We did for a purpose, but in practice it is not secure and should only be opened to trusted sources.

## Creating Our Web Client

Now we are going to implement on the client side sending and receiving messages from the server in real time. We’ll create chat.tsx component with the following code:

```tsx
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SystemMessage = {
  id: 1,
  body: "Welcome to the Nest Chat app",
  author: "Bot",
};

// create a new socket instance with localhost URL
const socket = io('http://localhost:4000', { autoConnect: false });

export function Chat({ currentUser, onLogout }) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([SystemMessage]);

  useEffect(() => {
    socket.connect(); // connect to socket

    socket.on("connect", () => { // fire when we have connection
      console.log("Socket connected");
    });

    socket.on("disconnect", () => { // fire when socked is disconnected
      console.log("Socket disconnected");
    });

    // listen chat event messages
    socket.on("chat", (newMessage) => {
      console.log("New message added", newMessage);
      setMessages((previousMessages) => [...previousMessages, newMessage]);
    });

    // remove all event listeners
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat");
    };
  }, []);

  const handleSendMessage = (e) => {
    if (e.key !== "Enter" || inputValue.trim().length === 0) return;

    // send a message to the server
    socket.emit("chat", { author: currentUser, body: inputValue.trim() });
    setInputValue("");
  };

  const handleLogout = () => {
    socket.disconnect(); // disconnect when we do logout
    onLogout();
  };

  return (
    <div className="chat">
      <div className="chat-header">
        <span>Nest Chat App</span>
        <button className="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="chat-message-list">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`chat-message ${
              currentUser === message.author ? "outgoing" : ""
            }`}
          >
            <div className="chat-message-wrapper">
              <span className="chat-message-author">{message.author}</span>
              <div className="chat-message-bubble">
                <span className="chat-message-body">{message.body}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-composer">
        <input
          className="chat-composer-input"
          placeholder="Type message here"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSendMessage}
        />
      </div>
    </div>
  );
}
```

We created a new socket instance with the localhost URL and connected to the socket when rendering the component. And we removed all listeners when the component is unmounted.

# Conclusion

Thanks for reading — I hope you found this piece useful. Happy coding!

## Article on Medium

[Build a Real-time Chat App Using NestJS](https://levelup.gitconnected.com/build-a-real-time-chat-app-using-nestjs-d57da4d35793)

## How to contribute?

1. Fork this repo
2. Clone your fork
3. Code 🤓
4. Test your changes
5. Submit a PR!
