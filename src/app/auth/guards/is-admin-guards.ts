import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";
import { AuthService } from "@auth/services/auth-service";
import { firstValueFrom } from "rxjs";



export const IsAdminGuard: CanMatchFn = async () => {
  const authServ = inject(AuthService)
  const router = inject(Router)

  await firstValueFrom( authServ.checkStatus() )

  if( !authServ.isAdmin() ){
    router.navigateByUrl('/')
    return false
  }

  return true
}
