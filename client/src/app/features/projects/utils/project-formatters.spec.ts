import { OrderType } from '../models/order-type.enum';
import { ProjectStatus } from '../models/project-status.enum';
import { formatEstimateNumber, formatOrderType, formatProjectStatus } from './project-formatters';

describe('formatOrderType', () => {
  it('受注区分が元請の場合、「元請」と表示される', () => {
    expect(formatOrderType(OrderType.PrimeContract)).toBe('元請');
  });

  it('受注区分が下請の場合、「下請」と表示される', () => {
    expect(formatOrderType(OrderType.Subcontract)).toBe('下請');
  });
});

describe('formatProjectStatus', () => {
  it('承認状態が未承認の場合、「未承認」と表示される', () => {
    expect(formatProjectStatus(ProjectStatus.Pending)).toBe('未承認');
  });

  it('承認状態が承認済の場合、「承認済」と表示される', () => {
    expect(formatProjectStatus(ProjectStatus.Approved)).toBe('承認済');
  });
});

describe('formatEstimateNumber', () => {
  it('見積番号が未登録の場合、空文字を返す', () => {
    expect(formatEstimateNumber(null)).toBe('');
  });

  it('見積番号が登録されている場合、「親番号-枝番号」の形式で返す', () => {
    expect(formatEstimateNumber({ mainNumber: '123456', branchNumber: '01' })).toBe('123456-01');
  });
});
