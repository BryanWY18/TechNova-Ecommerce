import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import {provideMockStore, MockStore} from '@ngrx/store/testing'

describe('authGuard', () => {

  let guard: CanActivateFn;
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;

  beforeEach(()=>{
    const routerSpy=jasmine.createSpyObj('Router',['navigateByUrl']);

    TestBed.configureTestingModule({
      providers:[
        provideMockStore({
          selectors:[
            {selector:selectIsAuthenticated, value:false}
          ]
        }),
        {provide:Router, useValue: routerSpy}
      ]
    });
    store=TestBed.inject(MockStore);
    router=TestBed.inject(Router) as jasmine.SpyObj<Router>;

    guard=(...guardParametres)=>TestBed.runInInjectionContext(()=>authGuard(...guardParametres));
  })
  
  it('debería ser creado',()=>{
    expect(guard).toBeTruthy()
  });
  
  it('debería permitir el acceso cuando el usuario esté autenticado',()=>{
    store.overrideSelector(selectIsAuthenticated, true);
    store.refreshState();

    const result = guard(null as any, null as any);

    expect(result).toBeTrue();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('No debería permitir el acceso si el usuario no está autenticado',()=>{
    store.overrideSelector(selectIsAuthenticated, false);
    store.refreshState();

    const result = guard(null as any, null as any);

    expect(result).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalled();
  })
  

});
