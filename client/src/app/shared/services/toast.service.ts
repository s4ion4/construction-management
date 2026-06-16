import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  Injectable,
  inject,
  inputBinding,
} from '@angular/core';
import { Toast, ToastVariant } from '../components/toast/toast';

const TOAST_DURATION = 4000;
const LEAVE_ANIMATION = 200;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);

  private current: ComponentRef<Toast> | null = null;
  private durationTimer: ReturnType<typeof setTimeout> | undefined;
  private leaveTimer: ReturnType<typeof setTimeout> | undefined;

  showSuccess(message: string): void {
    this.show('success', message);
  }

  showError(message: string): void {
    this.show('error', message);
  }

  private show(variant: ToastVariant, message: string) {
    this.destroy();

    const host = document.createElement('app-toast');
    const toastRef = createComponent(Toast, {
      environmentInjector: this.injector,
      hostElement: host,
      bindings: [inputBinding('variant', () => variant), inputBinding('message', () => message)],
    });
    this.appRef.attachView(toastRef.hostView);
    document.body.appendChild(host);
    this.current = toastRef;

    this.durationTimer = setTimeout(() => this.leave(), TOAST_DURATION);
  }

  private leave() {
    this.current?.instance.leaving.set(true);
    this.leaveTimer = setTimeout(() => this.destroy(), LEAVE_ANIMATION);
  }

  private destroy() {
    clearTimeout(this.durationTimer);
    clearTimeout(this.leaveTimer);
    if (this.current) {
      document.body.removeChild(this.current.location.nativeElement);
      this.appRef.detachView(this.current.hostView);
      this.current.destroy();
      this.current = null;
    }
  }
}
