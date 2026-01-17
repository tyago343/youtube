import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateChannelDto {
  @ApiProperty({
    description:
      'The name of the channel. Must be between 3 and 100 characters.',
    example: 'My Awesome Channel',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'The description of the channel. Maximum 5000 characters.',
    example: 'This is my channel description where I share amazing content.',
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({
    description: 'The avatar URL of the channel. Must be a valid URL.',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  avatarUrl?: string;

  @ApiPropertyOptional({
    description: 'The banner URL of the channel. Must be a valid URL.',
    example: 'https://example.com/banner.jpg',
  })
  @IsOptional()
  @IsString()
  @IsUrl({ require_tld: false })
  bannerUrl?: string;

  @ApiPropertyOptional({
    description: 'Whether monetization is enabled for the channel.',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isMonetizationEnabled?: boolean;
}
