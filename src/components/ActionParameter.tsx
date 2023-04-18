import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import {
  useActionMutations,
  useActionState,
  useActionType,
  useSubFlatKeys,
} from 'store/action';
import { ParameterComponent } from 'types/parameter';
import {
  AddressParameter,
  BencodexValueParameter,
  BooleanParameter,
  GuidParameter,
  NullParameter,
  NumberParameter,
  StringParameter,
  Uint8ArrayParameter,
} from './actions';
import { CurrencyParameter } from './actions/CurrencyParameter';

type Props = {
  flatKey: string;
  isArray?: boolean;
};

const getKeyName = (key: string) => {
  const split = key.split('__');
  if (split[split.length - 1].trim() === '') {
    return split[split.length - 2];
  }
  return split[split.length - 1];
};

const camelCaseToWords = (str: string) => {
  const words = str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1 $2');
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const handleTypeName = (type?: string | object) => {
  if (!!type && typeof type === 'object') return 'Object';
  if (type === '__array') return 'Array';
  if (type === '__object') return 'Object';
  return type;
};

const ComponentMap = {
  address: AddressParameter,
  boolean: BooleanParameter,
  guid: GuidParameter,
  number: NumberParameter,
  string: StringParameter,
  uint8array: Uint8ArrayParameter,
  '"bencodexvalue"': BencodexValueParameter,
  currency: CurrencyParameter,
};

export function ActionParameter({ flatKey, isArray }: Props) {
  const name = useMemo(() => camelCaseToWords(getKeyName(flatKey)), [flatKey]);
  const indent = useMemo(() => flatKey.split('__').length * 3, [flatKey]);

  const type = useActionType(flatKey);
  const [value, setValue] = useActionState(flatKey);
  const { appendValue, deleteValue } = useActionMutations();

  const [invalid, setInvalid] = useState(false);

  const isArrayParent = type === '__array';
  const addItem = () => appendValue(flatKey);
  const deleteItem = () => deleteValue(flatKey);

  let Component: ParameterComponent = NullParameter;
  if (type && typeof type === 'string' && type.toLowerCase() in ComponentMap) {
    Component = ComponentMap[type.toLowerCase() as keyof typeof ComponentMap];
  }

  const subFlatKeys = useSubFlatKeys(flatKey);

  return (
    <FormControl pl={indent} mt="3" isInvalid={invalid}>
      <Flex alignItems="center">
        <FormLabel my="0">{name}</FormLabel>
        <Text as="span" color="gray.500" fontSize="sm" mr="3">
          {handleTypeName(type)}
        </Text>
        {type === 'boolean' && (
          <Component
            setValue={setValue}
            setInvalid={setInvalid}
            value={value}
          />
        )}
        <Spacer />
        {isArrayParent && (
          <Button size="sm" onClick={addItem}>
            Add Item
          </Button>
        )}
        {isArray && (
          <Button size="sm" onClick={deleteItem}>
            Remove Item
          </Button>
        )}
      </Flex>
      <Box display={isArray ? 'block' : 'none'} mt="1" />
      {type !== 'boolean' && (
        <Component setValue={setValue} setInvalid={setInvalid} value={value} />
      )}
      {subFlatKeys.map((subFlatKey) => (
        <ActionParameter key={subFlatKey} flatKey={subFlatKey} isArray />
      ))}
    </FormControl>
  );
}
