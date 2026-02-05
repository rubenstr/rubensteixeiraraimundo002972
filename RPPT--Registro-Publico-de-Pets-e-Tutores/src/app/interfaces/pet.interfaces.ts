export interface IPetListInterface {
  content: IPetContent[];
  page: number;
  size: number;
  total: number;
  pageCount: number;
}

export interface IPetContent {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto:  IFoto;
}

export interface IFoto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface IPet {
  id?: number;
  nome: string;
  raca: string;
  idade: number;
  especie?: string;
}
