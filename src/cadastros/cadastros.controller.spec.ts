import { Test, TestingModule } from '@nestjs/testing';
import { CadastrosController } from './cadastros.controller';
import { CadastrosService } from './cadastros.service';

describe('CadastrosController', () => {
  let controller: CadastrosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CadastrosController],
      providers: [CadastrosService],
    }).compile();

    controller = module.get<CadastrosController>(CadastrosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
