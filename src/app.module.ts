import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { ChatAppModule } from './chat-app/chat-app.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
console.log('');

@Module({
  imports: [
    MessagesModule,
    ChatAppModule,
    ServeStaticModule.forRoot({
      rootPath: join('src', 'static-html'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
