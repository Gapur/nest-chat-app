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
