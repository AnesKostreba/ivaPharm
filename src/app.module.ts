import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { AppController } from './controllers/app.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfiguration } from 'config/database.configuration';
import { Administrator } from 'entities/administrator.entity';
import { Article } from 'entities/article.entity';
import { ArticleFeature } from 'entities/article.feature.entity';
import { ArticlePrice } from 'entities/article.price.entity';
import { CartArticle } from 'entities/cart.article.entity';
import { Cart } from 'entities/cart.entity';
import { Category } from 'entities/category.entity';
import { Feature } from 'entities/feature.entity';
import { Order } from 'entities/order.entity';
import { Photo } from 'entities/photo.entity';
import { User } from 'entities/user.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { AdministratorController } from './controllers/api/administrator.controller';
import { CategoryController } from './controllers/api/category.controller';
import { CategoryService } from './services/category/category.service';
import { ErrorInterceptor } from 'interceptors/error.interceptors';
import { ArticleService } from './services/article/article.service';
import { ArticleController } from './controllers/api/article.controller';
import { AuthController } from './controllers/api/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      host: databaseConfiguration.host,
      username: databaseConfiguration.user,
      password: databaseConfiguration.password,
      database: databaseConfiguration.database,
      entities: [
        Administrator,
        Article,
        ArticleFeature,
        ArticlePrice,
        CartArticle,
        Cart,
        Category,
        Feature,
        Order,
        Photo,
        User
      ]
    }),
    TypeOrmModule.forFeature([
      Administrator,
      Category,
      Article,
      ArticlePrice,
      ArticleFeature
    ])
  ],
  controllers: [
    AppController,
    AdministratorController,
    CategoryController,
    ArticleController,
    AuthController
  ],
  providers: [
    AdministratorService,
    CategoryService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    ArticleService
  ],
})


export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}