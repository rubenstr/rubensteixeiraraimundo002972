export interface ITutorListInterface {
  content: ITutorContent[];
  page: number;
  size: number;
  total: number;
  pageCount: number;
}

export interface ITutorContent {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
  foto?: IFotoTutor;
}

export interface ITutor extends ITutorContent {
  fotoUrl?: string;
  pets?: IPetResumo[];
}

export interface IPetResumo {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: IFotoPet;
}

export interface IFotoTutor {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface IFotoPet {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}
