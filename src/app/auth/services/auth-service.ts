import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { IAuthResponse } from '@auth/interfaces/auth-response';
import { IUser } from '@auth/interfaces/iuser';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'
const BASEURL = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authStatus = signal< AuthStatus >('checking')
  private _user = signal< IUser | null >(null)
  private _token = signal< string | null >(localStorage.getItem('token'))

  private http = inject(HttpClient)

  checkStatusResource = rxResource({
    stream: () => this.checkStatus()
  })

  //? Los computed signal son de solo lectura
  authStatus = computed<AuthStatus>(
    () => {
      if( this._authStatus() === 'checking' ) return 'checking'
      if( this._user() ) return 'authenticated'
      return 'not-authenticated'
    }
  )

  user = computed< IUser | null >( () => this._user() )

  token = computed< string | null >( () => this._token() )

  login( email: string, password: string ): Observable<boolean>{
    return this.http.post<IAuthResponse>(`${ BASEURL }/auth/login`, { email, password })
      .pipe(
        map( resp => this.handleAuthSuccess(resp) ),
        catchError(
          (error: any) => this.handleAuthError(error)
        )
      )
  }

  checkStatus(): Observable<boolean>{
    const token = localStorage.getItem('token')

    if( !token ){
      this.logout()
      return of(false)
    }

    return this.http.get<IAuthResponse>(`${ BASEURL }/auth/check-status`)
    .pipe(
        map( resp => this.handleAuthSuccess(resp) ),
        catchError(
          (error: any) => this.handleAuthError(error)
        )
      )
  }

  logout(){
    this._user.set(null)
    this._token.set(null)
    this._authStatus.set('not-authenticated')
    localStorage.clear()
  }

  private handleAuthSuccess( { token, user }: IAuthResponse ){
    this._user.set(user)
    this._authStatus.set('authenticated')
    this._token.set(token)
    localStorage.setItem( 'token', token )
    return true
  }

  private handleAuthError( error: any ){
    this.logout()
    return of(false)
  }

}
