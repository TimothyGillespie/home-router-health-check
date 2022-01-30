import { Injectable } from '@nestjs/common';
import {randomUUID} from "crypto";

@Injectable()
export class LifeSignalStorageService {

    data: Map<string, LifeSignalInfo> = new Map();

    createLifeSignalRequest(email: string): LifeSignalInfo {
        const clientSecret = randomUUID();
        const verificationSecret = randomUUID();
        const lifeSignal: LifeSignalInfo = {
            notificationEmail: email,
            verified: false,
            clientSecret,
            verificationSecret,
            lastSignal: null,
            status: 'UNSTARTED',
        }

        const toDelete = this.findClientSecretByEmail(email);
        this.data.delete(toDelete);

        this.data.set(clientSecret, lifeSignal);

        return lifeSignal;
    }

    markEmailVerified(verificationSecret: string): boolean {
        let clientSecret = undefined;
        this.data.forEach((value, key) => {
            if(value.verificationSecret === verificationSecret) {
                clientSecret = key;
            }
        });
        const lifeSignalData = this.data.get(clientSecret);
        if(verificationSecret === lifeSignalData.verificationSecret) {
            lifeSignalData.verified = true;
            return true;
        }

        return false;
    }


    findClientSecretByEmail(email: string): string | undefined {
        let clientSecret = undefined;
        this.data.forEach((value, key) => {
            if(value.notificationEmail === email) {
                clientSecret = key;
            }
        });

        return clientSecret;
    }

    registerLifeSignal(clientSecret: string) {
        this.data.get(clientSecret).lastSignal = new Date();
    }
}


export interface LifeSignalInfo {
    notificationEmail: string;
    verified: boolean;
    verificationSecret: string;
    clientSecret: string;
    lastSignal: Date | null;
    status: 'UNSTARTED' | 'ALIVE' | 'LOST',
}
