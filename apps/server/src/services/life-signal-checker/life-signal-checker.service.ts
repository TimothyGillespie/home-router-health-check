import { Injectable } from '@nestjs/common';
import {Cron, CronExpression} from "@nestjs/schedule";
import {LifeSignalStorageService} from "../life-signal-storage/life-signal-storage.service";
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class LifeSignalCheckerService {

    constructor(
        private lifeSignalStorageService: LifeSignalStorageService,
        private emailService: MailerService,
    ) {}

    // 2.5 minutes
    private timeUntilRuledDead = 2.5 * 60 * 1000;

    @Cron(CronExpression.EVERY_MINUTE)
    checkIfAnyDead() {
        console.log(`Checking ${this.lifeSignalStorageService.data.size} life signal(s)`)
        this.lifeSignalStorageService.data.forEach((value, key) => {
            if(value.lastSignal !== null) {
                if (value.status === 'UNSTARTED') {
                    value.status = 'ALIVE';
                    console.log(`Started life signal tracking for ${value.notificationEmail}.`)
                }

                const secondsSinceLastSignal = new Date().valueOf() - value.lastSignal.valueOf();
                if (value.status === 'ALIVE' && secondsSinceLastSignal > this.timeUntilRuledDead) {
                    console.log(`Lost ${value.notificationEmail}.`);
                    if (value.verified) {
                        console.log(`Sending lost email to ${value.notificationEmail}.`);
                        this.emailService.sendMail({
                            to: value.notificationEmail,
                            subject: 'Life Signal Lost',
                            template: 'life-signal-lost',
                        });
                    }

                    value.status = 'LOST';
                } else if (value.status === 'LOST' && secondsSinceLastSignal <= this.timeUntilRuledDead) {
                    console.log(`Regained ${value.notificationEmail}.`);
                    if (value.verified) {
                        console.log(`Sending regained email to ${value.notificationEmail}.`)
                        this.emailService.sendMail({
                            to: value.notificationEmail,
                            subject: 'Life Signal Regained',
                            template: 'life-signal-regained',
                        });
                    }

                    value.status = 'ALIVE';
                }
            }
        });
    }

}
