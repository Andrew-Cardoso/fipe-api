import { IsNotEmpty } from 'class-validator';
import { GetCarsDto } from './get-cars.dto';

export class GetCarYearsDto extends GetCarsDto {
  @IsNotEmpty()
  car: string;
}
