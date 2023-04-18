import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
} from '@chakra-ui/react';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormEvent, useRef, useState } from 'react';
import { getAccountFromV3 } from 'utils/account';
import { useKeystore, useMainMutations } from '../store/main';

export function AuthenticatePage() {
  const keystore = useKeystore();

  const { setKeystore, setAccount } = useMainMutations();

  const [fileName, setFileName] = useState<string>('');
  const [passphrase, setPassphrase] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);

  const inputFileRef = useRef<HTMLInputElement>(null);

  const toast = useToast();

  const authenticate = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (!keystore) {
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to read key file. Please try again.',
        status: 'error',
      });
      return;
    }

    if (!passphrase) {
      setLoading(false);
      toast({
        title: 'Error',
        description: 'Please enter your passphrase.',
        status: 'error',
      });
      return;
    }

    try {
      const account = getAccountFromV3(keystore, passphrase);
      setAccount(account, await account.getPublicKey(false));
    } catch (e: unknown) {
      setLoading(false);

      if (!(e instanceof Error)) {
        toast({
          title: 'Error',
          description:
            'Unknown error occured while getting account from key file. Please try again.',
          status: 'error',
        });
        return;
      }

      toast({
        title: 'Error',
        description: e.message,
        status: 'error',
      });
    }

    setLoading(false);
  };

  const onFileLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return;
      }

      setFileName(file.name);
      setKeystore(reader.result);
      setLoading(false);
    };

    reader.readAsText(file);
    setLoading(true);
  };

  return (
    <Flex as="form" gap="3" flexDir="column" onSubmit={authenticate}>
      <FormControl isRequired>
        <FormLabel>Web3 Secret Storage File</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FontAwesomeIcon} icon={faFile} textColor="gray.500" />
          </InputLeftElement>
          <Input
            type="text"
            readOnly
            value={fileName}
            placeholder="Select a key file..."
            onClick={() => inputFileRef.current?.click()}
          />
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Passphrase</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FontAwesomeIcon} icon={faKey} textColor="gray.500" />
          </InputLeftElement>
          <Input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Passphrase"
            disabled={!keystore}
          />
        </InputGroup>
      </FormControl>
      <Input
        type="file"
        display="none"
        ref={inputFileRef}
        onChange={onFileLoad}
      />
      <Button
        w="full"
        type="submit"
        isDisabled={!keystore || !passphrase}
        isLoading={isLoading}
      >
        Authenticate
      </Button>
    </Flex>
  );
}
