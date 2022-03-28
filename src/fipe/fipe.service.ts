import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { map, take, tap } from 'rxjs';
import { Vehicle_Types, Brand, Car, FipePricing } from './types';

const getUrl = (...paths: string[]) => {
  const [vehicleType, brand, car, year] = paths;

  let baseUrl = `https://parallelum.com.br/fipe/api/v1/${vehicleType}/marcas`;
  if (!brand) return baseUrl;

  baseUrl += `/${brand}/modelos`;
  if (!car) return baseUrl;

  baseUrl += `/${car}/anos`;
  if (!year) return baseUrl;

  return `${baseUrl}/${year}`;
};

@Injectable()
export class FipeService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private http: HttpService,
  ) {}

  async getBrands(vehicleType: Vehicle_Types) {
    const url = getUrl(vehicleType);
    return await this.cacheOrFetch<Brand[]>(url);
  }

  async getCars(vehicleType: Vehicle_Types, brand: string) {
    type CarsResponse = { modelos: Car[] };
    const url = getUrl(vehicleType, brand);
    const carsResponse = await this.cacheOrFetch<CarsResponse>(url);
    return carsResponse.modelos;
  }

  async getYears(vehicleType: Vehicle_Types, brand: string, car: string) {
    const url = getUrl(vehicleType, brand, car);
    return await this.cacheOrFetch<Car[]>(url);
  }

  async getFipePricing(
    vehicleType: Vehicle_Types,
    brand: string,
    car: string,
    year: string,
  ) {
    const url = getUrl(vehicleType, brand, car, year);
    return await this.cacheOrFetch<FipePricing[]>(url);
  }

  private async cacheOrFetch<T>(url: string): Promise<T> {
    return (
      (await this.cacheManager.get<T>(url)) ??
      (await this.promisifyFetch<T>(url))
    );
  }

  private promisifyFetch<T>(url: string): Promise<T> {
    const ttl = 604800;
    return new Promise((resolve, reject) => {
      this.http
        .get(url)
        .pipe(
          take(1),
          map(({ data }) => data),
          tap((data) => this.cacheManager.set(url, data, { ttl })),
        )
        .subscribe({ next: resolve, error: reject });
    });
  }
}
