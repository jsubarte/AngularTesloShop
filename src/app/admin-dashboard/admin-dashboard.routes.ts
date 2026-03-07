import { Routes } from "@angular/router";
import { ProductAdminPage } from "./pages/product-admin-page/product-admin-page";
import { AdminDashboardLayout } from "./layout/admin-dashboard-layout/admin-dashboard-layout";
import { ProductsAdminPage } from "./pages/products-admin-page/products-admin-page";
import { IsAdminGuard } from "@auth/guards/is-admin-guards";


const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayout,
    canMatch: [
      IsAdminGuard
    ],
    children: [
      {
        path: 'products',
        component: ProductAdminPage
      },
      {
        path: 'product/:id',
        component: ProductsAdminPage
      },
      {
        path: '**',
        redirectTo: 'products'
      },
    ]
  },
]

export default adminDashboardRoutes
