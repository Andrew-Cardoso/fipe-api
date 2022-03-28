import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Vehicle_Types } from '../types';

export class GetBrandsDto {
  @Transform(({ value }) => value?.toLowerCase())
  @IsEnum(Vehicle_Types, {
    message: 'O tipo do veiculo deve ser "carros", "motos" ou "caminhoes"',
  })
  vehicleType: Vehicle_Types;
}
