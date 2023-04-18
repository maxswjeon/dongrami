import Actions from '@/actions.json';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Text,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { ActionParameter } from 'components/ActionParameter';
import { useLib9c } from 'hooks/useLib9c';
import { useEffect, useRef, useState } from 'react';
import { useActionFlat, useActionMutations } from 'store/action';

type SelectValueType = {
  label: keyof typeof Actions;
  value: keyof typeof Actions;
};

export function ActionSection() {
  const lib9c = useLib9c();

  const [action, setAction] = useState<SelectValueType | null>(null);

  const flat = useActionFlat();
  const { clear, setAction: setStoreAction } = useActionMutations();

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!action) {
      clear();
      return;
    }
    setStoreAction(action.value);
  }, [action]);

  if (!lib9c) {
    return (
      <Box>
        <Heading as="h2" size="lg">
          Create Action
        </Heading>
        <Text my="6" textAlign="center">
          Loading lib9c-wasm...
        </Text>
      </Box>
    );
  }

  const invalid =
    sectionRef.current &&
    sectionRef.current.querySelectorAll(
      "[data-empty='true'], [aria-invalid='true']"
    ).length > 0;

  const actionTypes = Object.keys(Actions)
    .sort((a, b) => {
      const actionNameA = (a.match(/([A-Z|a-z|_-]+)/g) || [''])[0];
      const actionNameB = (b.match(/([A-Z|a-z|_-]+)/g) || [''])[0];

      if (actionNameA !== actionNameB) {
        return actionNameA > actionNameB ? 1 : -1;
      }

      const actionIndexA = parseInt((a.match(/([\d]+)/g) || ['0'])[0]);
      const actionIndexB = parseInt((b.match(/([\d]+)/g) || ['0'])[0]);

      return actionIndexA > actionIndexB ? 1 : -1;
    })
    .map((a) => ({
      label: a,
      value: a,
    })) as SelectValueType[];

  return (
    <Box>
      <Heading as="h2" size="lg">
        Create Action
      </Heading>
      <Box as="form">
        <FormControl mt="3" isRequired>
          <FormLabel>Action Type</FormLabel>
          <Select
            options={actionTypes}
            value={action}
            onChange={(e) => setAction(e)}
          />
        </FormControl>
        <Text
          mt="3"
          fontSize="md"
          fontWeight="medium"
          display={action ? 'block' : 'none'}
        >
          Action Parameters
        </Text>
        <Box maxH="500px" overflowY="auto" id="actionParams" ref={sectionRef}>
          {flat.getKeys().map((key) => (
            <ActionParameter key={key} flatKey={key} />
          ))}
        </Box>
        <Button mt="3" type="submit" w="full" isDisabled={!!invalid}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}
