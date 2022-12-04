import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  messages : Message[] = [{username : 'Bot!', message: 'A test message for working app'},]

  // user to clientId to sotre users map to the id
  clientToUser = {}

  // to identify the users connected or connecting 
  async identify(name : string , clientID: string) {
    this.clientToUser[clientID] = name;
    console.log(this.clientToUser);
  }

  async getClientName (id : string){
    return this.clientToUser[id];
  }
  create(createMessageDto: CreateMessageDto) {
    this.messages.push(createMessageDto);
  
    return createMessageDto
  }

  findAll() {
    return this.messages
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
