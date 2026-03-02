import { Routes } from "@angular/router";
import { ProductAdminPage } from "./pages/product-admin-page/product-admin-page";
import { AdminDashboardLayout } from "./layout/admin-dashboard-layout/admin-dashboard-layout";


const adminDashboardRoutes: Routes = [
  {
    path: 'products',
    component: AdminDashboardLayout,
    children: [
      {
        path: 'products',
        component: ProductAdminPage
      },
      {
        path: 'product/:id',
        component: ProductAdminPage
      },
      {
        path: '**',
        redirectTo: 'products'
      },
    ]
  },
]

export default adminDashboardRoutes
