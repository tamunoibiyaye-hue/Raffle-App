import { Module } from '@nestjs/common';
import { MvpDocsController } from './mvp.controller';

@Module({
  controllers: [MvpDocsController],
})
export class DocsModule {}
