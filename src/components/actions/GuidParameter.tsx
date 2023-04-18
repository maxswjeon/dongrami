import { Input } from '@chakra-ui/react';
import { ParameterComponentProps } from 'types/parameter';
import * as uuid from 'uuid';

export function GuidParameter({
  setInvalid,
  setValue,
  value,
}: ParameterComponentProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    setInvalid(
      !!e.currentTarget.value && !uuid.validate(e.currentTarget.value)
    );
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
