import { Input } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { ParameterComponentProps } from 'types/parameter';

export function AddressParameter({
  setInvalid,
  setValue,
  value,
}: ParameterComponentProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    setInvalid(
      !!e.currentTarget.value && !ethers.utils.isAddress(e.currentTarget.value)
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
