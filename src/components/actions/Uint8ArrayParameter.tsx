import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { ParameterComponentProps } from 'types/parameter';
import { Uint8ArrayToHex } from 'utils/Uint8Array';

const isHex = (str: string) => {
  const re = /^0x?[0-9a-fA-F]+$/;
  return re.test(str);
};

const isBase64 = (str: string) => {
  const re = /^[0-9a-zA-Z]+[=]{0,2}$/;
  return re.test(str);
};

export function Uint8ArrayParameter({
  setInvalid,
  setValue,
  value,
}: ParameterComponentProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    setInvalid(
      !!e.currentTarget.value &&
        !isHex(e.currentTarget.value) &&
        !isBase64(e.currentTarget.value)
    );
  };

  const onFileLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (!(reader.result instanceof ArrayBuffer)) {
        return;
      }

      setValue(`0x${Uint8ArrayToHex(new Uint8Array(reader.result))}`);
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
    setLoading(true);
  };

  return (
    <>
      <InputGroup>
        <Input
          type="text"
          value={value}
          onChange={onChange}
          isDisabled={loading}
          data-empty={value.trim() === ''}
        />
        <InputRightElement>
          <Button onClick={() => fileRef.current?.click()} isDisabled={loading}>
            <FontAwesomeIcon icon={faFile} />
          </Button>
        </InputRightElement>
      </InputGroup>
      <Text
        ml="1"
        fontSize="12"
        color="gray.500"
        display={!isHex(value) && !isBase64(value) ? 'none' : 'block'}
      >
        Will be interpreted as {isHex(value) ? 'Hex' : 'Base64'} Value
      </Text>
      <Input type="file" ref={fileRef} display="none" onChange={onFileLoad} />
    </>
  );
}
