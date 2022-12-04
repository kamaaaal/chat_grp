import { Module } from '@nestjs/common';
import { ChatAppGateway } from './chat-app.gateway';

@Module({
    providers : [ChatAppGateway],
    exports : [ChatAppGateway],
})
export class ChatAppModule {}
