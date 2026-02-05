// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { Tutor } from './tutor';

// describe('Tutor', () => {
//   let component: Tutor;
//   let fixture: ComponentFixture<Tutor>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [Tutor]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(Tutor);
//     component = fixture.componentInstance;
//     await fixture.whenStable();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tutor } from './tutor';
import { TutorService } from '../../services/tutor.service';
import { PetService } from '../../services/pet.service';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { Router } from '@angular/router';
import { Dashboard } from '../dashboard/dashboard';
import { of, throwError } from 'rxjs';
import { ITutorContent, ITutorListInterface } from '../../interfaces/tutor.interfaces';
import { IPet } from '../../interfaces/pet.interfaces';

describe('Tutor Component', () => {
  let component: Tutor;
  let fixture: ComponentFixture<Tutor>;

  let tutorService: jasmine.SpyObj<TutorService>;
  let petService: jasmine.SpyObj<PetService>;
  let authService: jasmine.SpyObj<AutenticacaoService>;
  let router: jasmine.SpyObj<Router>;
  let dashboard: jasmine.SpyObj<Dashboard>;

  beforeEach(async () => {
    tutorService = jasmine.createSpyObj('TutorService', [
      'getTutores',
      'getTutorById',
    ]);

    petService = jasmine.createSpyObj('PetService', ['getPets']);
    authService = jasmine.createSpyObj('AutenticacaoService', ['isAuthenticated']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    dashboard = jasmine.createSpyObj('Dashboard', ['openTutorDetail']);

    await TestBed.configureTestingModule({
      imports: [Tutor],
      providers: [
        { provide: TutorService, useValue: tutorService },
        { provide: PetService, useValue: petService },
        { provide: AutenticacaoService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: Dashboard, useValue: dashboard },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Tutor);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('deve carregar tutores quando autenticado', () => {
      authService.isAuthenticated.and.returnValue(true);
      tutorService.getTutores.and.returnValue(
      of({
        content: [] as ITutorContent[],
        total: 0,
        pageCount: 0,
        page: 0,
        size: 100,
      })
      );

      component.ngOnInit();

      expect(tutorService.getTutores).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('deve redirecionar para login se não autenticado', () => {
      authService.isAuthenticated.and.returnValue(false);

      component.ngOnInit();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('loadTutores', () => {
    it('deve popular a lista de tutores com sucesso', () => {
    const mockResponse: ITutorListInterface = {
      content: [] as ITutorContent[],
      total: 0,
      pageCount: 0,
      page: 0,
      size: 100,
    };

      tutorService.getTutores.and.returnValue(of(mockResponse));

      component.loadTutores();

      expect(component.tutoresList()).toEqual(mockResponse.content);
      expect(component.total()).toBe(1);
      expect(component.pageCount()).toBe(1);
    });

    it('deve limpar a lista em caso de erro', () => {
      tutorService.getTutores.and.returnValue(throwError(() => new Error()));

      component.loadTutores();

      expect(component.tutoresList()).toEqual([]);
    });
  });

  // describe('onSelectTutor', () => {
  //   it('deve abrir o detalhe do tutor e carregar pets disponíveis', () => {
  //     const tutorCompleto = {
  //       ...Tutor,
  //       pets: [{ id: 10 }],
  //     } as any;

  //     tutorService.getTutorById.and.returnValue(of(tutorCompleto));

  //     petService.getPets.and.returnValue(
  //       of({
  //         content: [
  //           { id: 10, nome: 'Pet Vinculado' },
  //           { id: 20, nome: 'Pet Disponível' },
  //         ],
  //       })
  //     );

  //     component.onSelectTutor(tutor);

  //     expect(tutorService.getTutorById).toHaveBeenCalledWith(1);
  //     expect(dashboard.openTutorDetail).toHaveBeenCalledWith(tutor);
  //     expect(component.petsDisponiveis().length).toBe(1);
  //     expect(component.petsDisponiveis()[0].id).toBe(20);
  //   });

  //   it('deve tratar erro ao carregar tutor completo', () => {
  //     spyOn(console, 'error');
  //     tutorService.getTutorById.and.returnValue(
  //       throwError(() => new Error())
  //     );

  //     component.onSelectTutor({ id: 1 } as ITutorContent);

  //     expect(console.error).toHaveBeenCalled();
  //   });
  // });
});
