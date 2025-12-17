import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDto } from './create-video.request.dto';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {}
