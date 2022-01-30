import {Body, Controller, Get, HttpStatus, Post, Query, Res} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import {MailerService} from "@nestjs-modules/mailer";
import {LifeSignalStorageService} from "../services/life-signal-storage/life-signal-storage.service";

interface EnvironmentVariables {
    CLIENT_SECRET: string;
}


@Controller()
export class AppController {
    constructor(
        private configService: ConfigService<EnvironmentVariables>,
        private emailService: MailerService,
        private lifeSignalStorageService: LifeSignalStorageService,
    ) {}

    @Get('lifeSignal')
    getData(@Query('clientSecret') clientSecret, @Res() res: Response) {
        const success = this.lifeSignalStorageService.registerLifeSignal(clientSecret);
        console.log('Received life signal for ' + clientSecret);
        res.status(HttpStatus.OK).send();
    }

    @Post('register')
    async register(@Body() registrationData: LifeSignalRegistration) {
        const lifeSignalData = this.lifeSignalStorageService.createLifeSignalRequest(registrationData.email);
        await this.emailService.sendMail({
            to: registrationData.email,
            subject: 'Verify Life Signal Registration',
            template: 'verify',
            context: {
                verificationLink: process.env.HOST + '/verify?verificationSecret=' + lifeSignalData.verificationSecret,
            }
        });

        console.log(`Registered ${registrationData.email}.`);

        return {
            clientSecret: lifeSignalData.clientSecret
        };
    }

    @Get('verify')
    verify(@Query('verificationSecret') verificationSecret: string) {
        const success = this.lifeSignalStorageService.markEmailVerified(verificationSecret);

        console.log(success ? 'Successfully verified email with ' + verificationSecret : 'Could not verify email with ' + verificationSecret);

        // Not giving real feedback on any success
        return 'Successfully verified email!';
    }
}

interface LifeSignalRegistration {
    email: string,
}
