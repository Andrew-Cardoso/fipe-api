import { IsNotEmpty } from 'class-validator';
import { GetCarYearsDto } from './get-car-years.dto';

export class GetPricingDto extends GetCarYearsDto {
  @IsNotEmpty()
  year: string;
}
