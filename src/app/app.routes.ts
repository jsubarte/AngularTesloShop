import { Routes } from '@angular/router'
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated-guards'

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      //? Todos los guards deben devolver true para que se muestre el componente
      /* () => {
        console.log('Hola mundo desde app.routes')
        return true
      }, */
      NotAuthenticatedGuard,
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes')
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes')
  }
]
