import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetBrandsDto } from './dtos/get-brands.dto';
import { GetCarYearsDto } from './dtos/get-car-years.dto';
import { GetCarsDto } from './dtos/get-cars.dto';
import { GetPricingDto } from './dtos/get-pricing.dto';
import { FipeService } from './fipe.service';

@UseGuards(AuthGuard('jwt'))
@Controller('fipe')
export class FipeController {
  constructor(private fipeService: FipeService) {}

  @Get('/brands')
  async getBrands(@Query() { vehicleType }: GetBrandsDto) {
    return await this.fipeService.getBrands(vehicleType);
  }

  @Get('/cars')
  async getCars(@Query() { vehicleType, brand }: GetCarsDto) {
    return await this.fipeService.getCars(vehicleType, brand);
  }

  @Get('/models')
  async getCarModels(@Query() { vehicleType, brand, car }: GetCarYearsDto) {
    return await this.fipeService.getYears(vehicleType, brand, car);
  }

  @Get('/pricing')
  async getFipePricing(
    @Query() { vehicleType, brand, car, year }: GetPricingDto,
  ) {
    return await this.fipeService.getFipePricing(vehicleType, brand, car, year);
  }
}
