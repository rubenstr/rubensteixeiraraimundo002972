export interface PetListInterface {
  content: PetContent
  page: number;
  total: number;
  size: number;
  pageCount: number;
}

export interface PetContent {
    id: number;
    nome: "string",
    raca: "string",
    idade: 0,
    foto: {}, 
}