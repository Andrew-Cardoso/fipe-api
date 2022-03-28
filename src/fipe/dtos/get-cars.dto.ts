import { IsNotEmpty } from 'class-validator';
import { GetBrandsDto } from './get-brands.dto';

export class GetCarsDto extends GetBrandsDto {
  @IsNotEmpty()
  brand: string;
}
