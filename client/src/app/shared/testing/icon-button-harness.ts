import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

export interface IconButtonHarnessFilters extends BaseHarnessFilters {
  ariaLabel?: string | RegExp;
  disabled?: boolean;
}

export class IconButtonHarness extends ComponentHarness {
  static hostSelector = '[app-icon-button]';

  static with(options: IconButtonHarnessFilters = {}): HarnessPredicate<IconButtonHarness> {
    return new HarnessPredicate(IconButtonHarness, options)
      .addOption('ariaLabel', options.ariaLabel, (harness, ariaLabel) =>
        HarnessPredicate.stringMatches(harness.getAriaLabel(), ariaLabel),
      )
      .addOption('disabled', options.disabled, async (harness, disabled) => {
        return (await harness.isDisabled()) === disabled;
      });
  }

  async click(): Promise<void> {
    const host = await this.host();
    return host.click();
  }

  async getAriaLabel(): Promise<string | null> {
    const host = await this.host();
    return host.getAttribute('aria-label');
  }

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return host.getProperty<boolean>('disabled');
  }
}
