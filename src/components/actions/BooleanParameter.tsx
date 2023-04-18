import { Checkbox } from '@chakra-ui/react';
import { ParameterComponentProps } from 'types/parameter';

export function BooleanParameter({ setValue, value }: ParameterComponentProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.checked ? 'true' : 'false');
  };

  return (
    <Checkbox
      isChecked={value === 'true'}
      onChange={onChange}
      data-empty={false}
    />
  );
}
