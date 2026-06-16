export const OrderType = Object.freeze({
  PrimeContract: 1,
  Subcontract: 2,
} as const);

export type OrderType = (typeof OrderType)[keyof typeof OrderType];

export const orderTypeLabels: readonly { readonly value: OrderType; readonly label: string }[] = [
  { value: OrderType.PrimeContract, label: '元請' },
  { value: OrderType.Subcontract, label: '下請' },
];
