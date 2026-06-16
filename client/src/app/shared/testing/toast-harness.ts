import { ComponentHarness } from '@angular/cdk/testing';

export class ToastHarness extends ComponentHarness {
  static hostSelector = 'app-toast';

  protected readonly messageElement = this.locatorFor('.toast-message');

  async getMessage(): Promise<string> {
    const message = await this.messageElement();
    return message.text();
  }

  async getVariant(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-variant');
  }
}
