import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { Pet } from './pet';
import { PetService } from '../../services/pet.service';
import { AutenticacaoService } from '../../core/services/autenticacao.service';

import { IFoto, IPet, IPetContent, IPetListInterface } from '../../interfaces/pet.interfaces';
import { UpdatePetDTO } from '../../interfaces/update-pet.dto';

describe('Pet Component', () => {
  let component: Pet;
  let fixture: ComponentFixture<Pet>;

  let petService: jasmine.SpyObj<PetService>;
  let authService: jasmine.SpyObj<AutenticacaoService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    petService = jasmine.createSpyObj('PetService', [
      'getPets',
      'getPetById',
      'updatePet'
    ]);

    authService = jasmine.createSpyObj('AutenticacaoService', [
      'isAuthenticated'
    ]);

    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Pet],
      providers: [
        { provide: PetService, useValue: petService },
        { provide: AutenticacaoService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Pet);
    component = fixture.componentInstance;
  });

  // ------------------------------------------------------------------

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  // ------------------------------------------------------------------

  it('ngOnInit deve carregar pets quando autenticado', () => {
    authService.isAuthenticated.and.returnValue(true);

    const mockResponse: IPetListInterface = {
      content: [],
      page: 0,
      size: 10,
      total: 0,
      pageCount: 0,
    };

    petService.getPets.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(petService.getPets).toHaveBeenCalled();
    expect(component.petsList()).toEqual([]);
  });

  it('ngOnInit deve redirecionar para login se não autenticado', () => {
    authService.isAuthenticated.and.returnValue(false);

    petService.getPets.and.returnValue(of({
      content: [],
      page: 0,
      size: 10,
      total: 0,
      pageCount: 0,
    }));

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  // ------------------------------------------------------------------

  it('loadPets deve preencher lista de pets', () => {
    const pets: IPetContent[] = [
      { id: 1, nome: 'Rex' } as IPetContent,
      { id: 2, nome: 'Luna' } as IPetContent,
    ];

    const response: IPetListInterface = {
      content: pets,
      page: 0,
      size: 10,
      total: 2,
      pageCount: 1,
    };

    petService.getPets.and.returnValue(of(response));

    component.loadPets();

    expect(component.petsList()).toEqual(pets);
    expect(component.total()).toBe(2);
    expect(component.pageCount()).toBe(1);
  });

  it('loadPets deve limpar lista em caso de erro', () => {
    petService.getPets.and.returnValue(throwError(() => new Error('erro')));

    component.loadPets();

    expect(component.petsList()).toEqual([]);
  });

  // ------------------------------------------------------------------

  it('onPageChange deve atualizar página e recarregar pets', () => {
    spyOn(component, 'loadPets');

    component.onPageChange(2);

    expect(component.page()).toBe(2);
    expect(component.loadPets).toHaveBeenCalled();
  });

  it('onSizeChange deve atualizar size, resetar página e recarregar', () => {
    spyOn(component, 'loadPets');

    component.onSizeChange(50);

    expect(component.size()).toBe(50);
    expect(component.page()).toBe(0);
    expect(component.loadPets).toHaveBeenCalled();
  });

  // ------------------------------------------------------------------

  it('openPetDetail deve carregar detalhe do pet', () => {
    const mockFoto: IFoto = {
      id: 1,
      nome: 'foto-rex.jpg',
      url: 'https://cdn.app/pets/foto-rex.jpg',
      contentType: 'image/jpeg',
    };

const pet: IPetContent = {
  id: 10,
  nome: 'Rex',
  raca: 'Labrador',
  idade: 5,
  foto: {
    id: 1,
    nome: 'rex.jpg',
    url: 'http://mock/rex.jpg',
    contentType: 'image/jpeg',
  },
};

    petService.getPetById.and.returnValue(of(pet));

    component.openPetDetail(10);

    expect(component.selectedPetId()).toBe(10);
    expect(component.petDetail()).toEqual(pet);
    expect(component.loadingDetail()).toBeFalse();
  });

  it('openPetDetail deve parar loading em caso de erro', () => {
    petService.getPetById.and.returnValue(
      throwError(() => new Error('erro'))
    );

    component.openPetDetail(10);

    expect(component.loadingDetail()).toBeFalse();
  });

  // ------------------------------------------------------------------

  it('onSavePet deve atualizar pet', () => {
    const pet: IPet = { id: 5, nome: 'Luna' } as IPet;
    component.petDetail.set(pet);

    const payload: UpdatePetDTO = {
      nome: 'Luna Atualizada',
    } as UpdatePetDTO;

    const updatedPet: IPet = { id: 5, nome: 'Luna Atualizada' } as IPet;

    petService.updatePet.and.returnValue(of(updatedPet));

    component.onSavePet(payload);

    expect(component.petDetail()).toEqual(updatedPet);
    expect(component.loadingDetail()).toBeFalse();
  });

  it('onSavePet não deve fazer nada se petDetail for null', () => {
    component.petDetail.set(null);

    component.onSavePet({} as UpdatePetDTO);

    expect(petService.updatePet).not.toHaveBeenCalled();
  });

  // ------------------------------------------------------------------

  it('closePetDetail deve limpar estado', () => {
    component.selectedPetId.set(10);
    component.petDetail.set({ id: 10 } as IPet);

    component.closePetDetail();

    expect(component.selectedPetId()).toBeNull();
    expect(component.petDetail()).toBeNull();
  });

  // ------------------------------------------------------------------

  it('trackByPetId deve retornar id do pet', () => {
    const pet = { id: 99 } as IPetContent;

    const result = component.trackByPetId(0, pet);

    expect(result).toBe(99);
  });
});
