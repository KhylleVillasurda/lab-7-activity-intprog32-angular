import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Alert, AlertOptions, AlertType } from '@app/_models/alert';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = 'default-alert';

  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(filter(a => a && a.id === id));
  }

  success(message: string, options?: AlertOptions) { this.alert(AlertType.Success, message, options); }
  error(message: string, options?: AlertOptions)   { this.alert(AlertType.Error,   message, options); }
  info(message: string, options?: AlertOptions)    { this.alert(AlertType.Info,    message, options); }
  warn(message: string, options?: AlertOptions)    { this.alert(AlertType.Warning, message, options); }

  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }

  private alert(type: AlertType, message: string, options?: AlertOptions) {
    const id = options?.id ?? this.defaultId;
    this.subject.next(new Alert({ ...options, type, message, id }));
  }
}
