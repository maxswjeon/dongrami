import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Currency = {
  ticker: string;
  decimalPlaces: number;
  minters?: string[];
};

type CurrencyState = {
  currencies: Currency[];
  addCurrency: (currency: Currency) => void;
  removeCurrency: (currency: Currency) => void;
  clear: () => void;
};

const DEFAULT_CURRENCIES: Currency[] = [
  {
    ticker: 'NCG',
    decimalPlaces: 2,
    minters: ['47d082a115c63e7b58b1532d20e631538eafadde'],
  },
];

const store = create<CurrencyState>()(
  persist(
    devtools<CurrencyState>((set) => ({
      currencies: DEFAULT_CURRENCIES,
      addCurrency: (currency) =>
        set((state) => ({
          ...state,
          currencies: [...state.currencies, currency],
        })),
      removeCurrency: (currency) =>
        set((state) => ({
          ...state,
          currencies: state.currencies.filter(
            (c) =>
              c.ticker !== currency.ticker &&
              c.decimalPlaces !== currency.decimalPlaces &&
              c.minters !== currency.minters
          ),
        })),
      clear: () => set({ currencies: DEFAULT_CURRENCIES }),
    })),
    { name: 'currency' }
  )
);

export const useCurrencies = () => store((state) => state.currencies);
export const useCurrencyMutations = () =>
  store((state) => ({
    addCurrency: state.addCurrency,
    removeCurrency: state.removeCurrency,
    clear: state.clear,
  }));
