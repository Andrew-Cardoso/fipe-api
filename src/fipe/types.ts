export enum Vehicle_Types {
  CARROS = 'carros',
  CAMINHOES = 'caminhoes',
  MOTOS = 'motos',
}

export interface Brand {
  nome: string;
  codigo: string;
}

export interface FipePricing {
  valor: string;
  marca: string;
  modelo: string;
  anoModelo: number;
  combustivel: string;
  codigoFipe: string;
  mesReferencia: string;
  tipoVeiculo: number;
  siglaCombustivel: string;
  dataConsulta: string;
}

export interface Car {
  nome: string;
  codigo: string;
}
