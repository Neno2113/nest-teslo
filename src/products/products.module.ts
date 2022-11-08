import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ ProductsService, TypeOrmModule ],
  imports: [
    TypeOrmModule.forFeature([ Product, ProductImage ]),
    AuthModule
  ]
})
export class ProductsModule {}
