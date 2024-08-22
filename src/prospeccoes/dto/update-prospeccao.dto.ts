import { PartialType } from '@nestjs/swagger';
import { CreateProspeccaoDto } from './create-prospeccao.dto';

export class UpdateProspeccaoDto extends PartialType(CreateProspeccaoDto) {}
