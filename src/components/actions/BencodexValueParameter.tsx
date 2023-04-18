import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { decode } from '@planetarium/bencodex';
import { useRef, useState } from 'react';
import { ParameterComponentProps } from 'types/parameter';
import { Uint8ArrayToBase64 } from 'utils/Uint8Array';

export function BencodexValueParameter({
  setInvalid,
  setValue,
  value,
}: ParameterComponentProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>('');

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

      const array = new Uint8Array(reader.result);
      const value = Uint8ArrayToBase64(array);

      try {
        decode(array);
      } catch (e) {
        setInvalid(true);
        setLoading(false);
        return;
      }

      setValue(value);
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
    setFilename(file.name);
    setLoading(true);
  };

  return (
    <>
      <InputGroup>
        <Input type="text" value={filename} isReadOnly />
        <InputRightElement>
          <Button onClick={() => fileRef.current?.click()} isDisabled={loading}>
            <FontAwesomeIcon icon={faFile} />
          </Button>
        </InputRightElement>
      </InputGroup>
      <Input
        type="file"
        ref={fileRef}
        display="none"
        onChange={onFileLoad}
        data-empty={value.trim() === ''}
      />
    </>
  );
}
