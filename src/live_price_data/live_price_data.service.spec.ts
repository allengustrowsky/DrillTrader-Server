import { Test, TestingModule } from '@nestjs/testing';
import { LivePriceDataService } from './live_price_data.service';

describe('LivePriceDataService', () => {
    let service: LivePriceDataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [LivePriceDataService],
        }).compile();

        service = module.get<LivePriceDataService>(LivePriceDataService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
