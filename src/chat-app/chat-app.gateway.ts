import { SubscribeMessage, WebSocketGateway,OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { UpdateMessageDto } from 'src/messages/dto/update-message.dto';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({
  cors : {origin : '*'},
  namespace : 'chat2'

})
export class ChatAppGateway implements OnGatewayConnection,OnGatewayDisconnect{
  @WebSocketServer()
  socket : Server
  private messagesService = new MessagesService()
  /// storing users and their name in a dict
  /// so that we can display the user disconnected
  idToUser : Map<string,string> = new Map();
  userToRoom : Map<string,string> = new Map();

  @WebSocketServer()
  server: Server;
  
  constructor() {}
  handleDisconnect(client: Socket) {
    const username = this.idToUser.get(client.id);
    /// removiing fields
    this.idToUser.delete(client.id);
    console.log(client.leave(username))
    this.userToRoom.delete(username)
  }

  private getClientRoom(client : Socket){
    const username = this.idToUser.get(client.id);
    return this.userToRoom.get(username);
  }
  handleConnection(client:Socket) {
      // console.log('data from client',client.handshake.query);
      client.emit('connection','hey client you\'are connected to the Socket')
      /// getting values and setting to romm
      const username : any = client.handshake.query.username;
      const room : any = client.handshake.query.room;
      console.log(username,' joined ',room);
      /// need to create a dto for the above code 
      this.idToUser.set(client.id,username);
      this.userToRoom.set(username,room);
      client.join(room);
      //  
      const messages = this.messagesService.findAll();
      // console.log('connected to msg')
      // client.emit('findAllMessages',JSON.stringify(messages));
  }
  @SubscribeMessage('createMessage')
  create(@ConnectedSocket() client:Socket,@MessageBody() createMessageDto: CreateMessageDto) {
    // when a new message is created it needs to be sent to all users
    const msgJson = createMessageDto;
    const message =  this.messagesService.create(msgJson);
    console.log(createMessageDto)
    const room: string = this.getClientRoom(client);
    console.log('clients rooom', room);
    this.socket.in(room).emit('message',JSON.stringify(message));
    // returning the message to the user who created
    return message;
  }

  // @SubscribeMessage('findAllMessages')
  // findAll(@ConnectedSocket() client:Socket) {
  //   console.log('subscribed to findAllMessages');
  //   const messages = this.messagesService.findAll();
  //   const room: string = this.getClientRoom(client);
  //   this.server.in(room).emit('findAllMessages',JSON.stringify(messages));
  // }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }

  @SubscribeMessage('join')
  /// @MessageBody() to get the payload
  async joinRoom(
    @MessageBody() payload:string,
    @ConnectedSocket() client : Socket
  ) {
    const body = JSON.parse(payload);
    this.messagesService.getClientName(body.name);
  }

  @SubscribeMessage('typing')
  async typing(
      @MessageBody() payload:string,
      @ConnectedSocket() client : Socket
  ) {
    const body = JSON.parse(payload);
    const name = await this.messagesService.getClientName(body.name)
    client.broadcast.emit('typing',name);
  }
}
