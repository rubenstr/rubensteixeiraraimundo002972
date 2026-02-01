export interface PetListInterface {
  content: PetContent[];
  page: number;
  size: number;
  total: number;
  pageCount: number;
}

export interface PetContent {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto: Foto;
}

export interface Foto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface Pet {
  id?: number;
  nome: string;
  raca: string;
  idade: number;
}
