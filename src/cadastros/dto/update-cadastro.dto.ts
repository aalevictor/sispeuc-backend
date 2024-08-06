import { CreateCadastroDto } from './create-cadastro.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCadastroDto extends PartialType(CreateCadastroDto) {}
