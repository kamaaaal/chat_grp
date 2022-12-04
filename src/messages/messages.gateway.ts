import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayInit, OnGatewayConnection } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors : { origin : '*'},
  namespace : 'chat'
})
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  
  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client:Socket) {
      // console.log('data from client',client.handshake.query);
      client.emit('connection','hey client you\'are connected to the Socket')
      const messages = this.messagesService.findAll();
      console.log('connected to msg')
      client.emit('findAllMessages',JSON.stringify(messages));
  }
  @SubscribeMessage('createMessage')
  create(@MessageBody() createMessageDto: CreateMessageDto) {
    // when a new message is created it needs to be sent to all users
    const msgJson = createMessageDto;
    const message =  this.messagesService.create(msgJson);
    console.log(createMessageDto)
    this.server.emit('message',JSON.stringify(message));

    // returning the message to the user who created
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll(@ConnectedSocket() socket:Socket) {
    console.log('subscribed to findAllMessages');
    const messages = this.messagesService.findAll();
    this.server.emit('findAllMessages',JSON.stringify(messages));
  }

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
