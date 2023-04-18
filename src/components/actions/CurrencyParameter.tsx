import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Select } from 'chakra-react-select';
import { CurrencyModal } from 'modals/CurrencyModal';
import { useState } from 'react';
import { useCurrencies } from 'store/currency';
import { ParameterComponentProps } from 'types/parameter';

type CurrencySelectValue = {
  label: string;
  value: number;
};

export function CurrencyParameter({
  setValue,
  value,
}: ParameterComponentProps) {
  const { isOpen, onClose } = useDisclosure();
  const currencies = useCurrencies();
  const currencySelectValues = currencies.map((currency, index) => ({
    label: currency.ticker,
    value: index,
  }));

  const [currency, setCurrency] = useState<CurrencySelectValue | null>(null);

  return (
    <>
      <Flex gap="1">
        <Select
          chakraStyles={{
            container: (provided) => ({
              ...provided,
              flex: 1,
            }),
          }}
          options={currencySelectValues}
          value={currency}
          onChange={(e) => {
            setCurrency(e);

            if (!e) {
              setValue('');
              return;
            }

            setValue(JSON.stringify(currencies[e.value]));
          }}
          data-empty={value.trim() === ''}
        />
        <Button>
          <FontAwesomeIcon icon={faGear} />
        </Button>
      </Flex>
      <CurrencyModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
