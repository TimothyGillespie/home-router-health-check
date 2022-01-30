import { Test, TestingModule } from '@nestjs/testing';
import { LifeSignalCheckerService } from './life-signal-checker.service';

describe('LifeSignalCheckerService', () => {
    let service: LifeSignalCheckerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LifeSignalCheckerService],
        }).compile();

        service = module.get<LifeSignalCheckerService>(
            LifeSignalCheckerService
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
