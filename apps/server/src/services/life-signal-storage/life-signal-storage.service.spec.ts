import { Test, TestingModule } from '@nestjs/testing';
import { LifeSignalStorageService } from './life-signal-storage.service';

describe('LifeSignalStorageService', () => {
    let service: LifeSignalStorageService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LifeSignalStorageService],
        }).compile();

        service = module.get<LifeSignalStorageService>(
            LifeSignalStorageService
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
