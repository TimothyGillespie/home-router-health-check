import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import {LifeSignalStorageService} from "../services/life-signal-storage/life-signal-storage.service";
import {LifeSignalCheckerService} from "../services/life-signal-checker/life-signal-checker.service";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [
        ConfigModule.forRoot({}),
        ScheduleModule.forRoot(),
        MailerModule.forRoot({
            transport: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                ignoreTLS: false,
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_USER_PW,
                },
            },
            defaults: {
                from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
            },
            preview: true,
            template: {
                dir: __dirname + '/assets/templates',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    controllers: [AppController],
    providers: [
        LifeSignalStorageService,
        LifeSignalCheckerService,
    ],
})
export class AppModule {}
