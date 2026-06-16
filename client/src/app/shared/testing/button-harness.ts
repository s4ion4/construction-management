import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

export interface ButtonHarnessFilters extends BaseHarnessFilters {
  text?: string | RegExp;
  disabled?: boolean;
}

export class ButtonHarness extends ComponentHarness {
  static hostSelector = '[app-button]';

  static with(options: ButtonHarnessFilters = {}): HarnessPredicate<ButtonHarness> {
    return new HarnessPredicate(ButtonHarness, options)
      .addOption('text', options.text, (harness, text) =>
        HarnessPredicate.stringMatches(harness.getText(), text),
      )
      .addOption('disabled', options.disabled, async (harness, disabled) => {
        return (await harness.isDisabled()) === disabled;
      });
  }

  protected readonly labelElement = this.locatorFor('.button-label');

  async click(): Promise<void> {
    const host = await this.host();
    return host.click();
  }

  async getText(): Promise<string> {
    const label = await this.labelElement();
    return label.text();
  }

  async getVariant(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('data-variant');
  }

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    if (await host.getProperty<boolean>('disabled')) {
      return true;
    }
    return (await host.getAttribute('aria-disabled')) === 'true';
  }
}
