import { Input } from '@chakra-ui/react';
import { ParameterComponentProps } from 'types/parameter';

export function StringParameter({ setValue, value }: ParameterComponentProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <Input
      type="text"
      value={value}
      onChange={onChange}
      data-empty={value.trim() === ''}
    />
  );
}
