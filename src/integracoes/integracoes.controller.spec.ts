import { Test, TestingModule } from '@nestjs/testing';
import { IntegracoesController } from './integracoes.controller';
import { IntegracoesService } from './integracoes-geosampa.service';

describe('IntegracoesController', () => {
  let controller: IntegracoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegracoesController],
      providers: [IntegracoesService],
    }).compile();

    controller = module.get<IntegracoesController>(IntegracoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
