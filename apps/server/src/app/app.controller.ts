import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

interface EnvironmentVariables {
    CLIENT_SECRET: string;
}

@Controller()
export class AppController {
    constructor(private configService: ConfigService<EnvironmentVariables>) {}

    @Get('lifeSignal')
    getData(@Query('clientSecret') clientSecret, @Res() res: Response) {
        if (clientSecret === this.configService.get('CLIENT_SECRET')) {
            res.status(HttpStatus.OK).send();
        } else {
            res.status(HttpStatus.UNAUTHORIZED).send();
        }
    }
}
