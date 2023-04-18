import Actions from '@/actions.json';
import Flat from 'flattype';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type ActionType = Record<
  string,
  | string
  | Record<string, string>
  | Record<string, Record<string, string>>
  | Record<string, Record<string, Record<string, string>>>
>;

type ActionState = {
  data: Flat;
  key: number;
  action?: keyof typeof Actions;
  mutations: {
    setAction: (action: keyof typeof Actions) => void;
    setValue: (key: string, value: string | object) => void;
    appendValue: (key: string) => void;
    deleteValue: (key: string) => void;
    clear: () => void;
  };
};

const actionToObject = (action: ActionType) => {
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  const data: any = {};

  for (const [key, value] of Object.entries(action)) {
    if (typeof value === 'string' && value.endsWith('[]')) {
      data[key] = [];
    } else if (typeof value === 'string') {
      data[key] = '';
    } else if (value.__array) {
      data[key] = [];
    } else {
      data[key] = actionToObject(value as unknown as ActionType);
    }
  }

  return data;
};

const getSubObject = (action: ActionType, flatKey: string) => {
  const keyArray = flatKey.split('__');
  let type: ActionType = action;

  for (const key of keyArray) {
    type = type[key] as unknown as ActionType;
  }

  if (typeof type === 'object' && '__array' in type) {
    // rome-ignore lint/performance/noDelete: <explanation>
    delete type.__array;
  }

  return type;
};

const store = devtools<ActionState>((set) => ({
  key: 0,
  data: Flat.from({}),
  mutations: {
    setAction: (action: keyof typeof Actions) => {
      set({
        action,
        data: Flat.from(
          actionToObject(Actions[action] as unknown as ActionType)
        ),
      });
    },
    setValue: (key, value) =>
      set((state) => ({
        ...state,
        data: state.data.set(key, value),
        key: state.key + 1,
      })),
    appendValue: (flatKey) =>
      set((state) => {
        if (!state.action) {
          return state;
        }

        const subObject = getSubObject(
          Actions[state.action] as unknown as ActionType,
          flatKey
        );

        const data = state.data;

        data.append(
          flatKey,
          typeof subObject === 'object' ? actionToObject(subObject) : ''
        );

        return { ...state, data, key: state.key + 1 };
      }),
    deleteValue: (flatKey) =>
      set((state) => {
        const data = state.data;
        data.delete(flatKey);

        return { ...state, data, key: state.key + 1 };
      }),
    clear: () => set(() => ({ data: Flat.from({}), key: 0 })),
  },
}));

const useActionStore = create<ActionState>()(store);
export const useActionMutations = () =>
  useActionStore((state) => state.mutations);
export const useAction = () => useActionStore((state) => state.action);
export const useActionState = (key: string) => {
  const { setValue } = useActionMutations();
  const { data } = useActionStore((state) => ({
    data: state.data,
    key: state.key,
  }));

  return [data.get(key) as string, (value: string) => setValue(key, value)] as [
    string,
    (value: string) => void
  ];
};
export const useActionFull = <T>() => {
  const state = useActionStore((state) => state.data);
  return state.getData() as T;
};
export const useActionFlat = () => useActionStore((state) => state.data);
export const useActionType = (key: string) => {
  const action = useAction();
  const flat = useActionFlat();

  if (!action) {
    return undefined;
  }

  const actionType = Actions[action];

  const actionKeyArray = key.split('__');

  const isArray = Array.isArray(flat.get(key));
  const isObject =
    actionKeyArray[actionKeyArray.length - 1].trim() === '' && !isArray;

  if (isObject) {
    return '__object';
  }

  if (isArray) {
    return '__array';
  }

  if (!isNaN(Number(actionKeyArray[actionKeyArray.length - 1]))) {
    actionKeyArray.pop();
  }

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  let type: any = actionType;
  for (const actionKey of actionKeyArray) {
    type = type[actionKey];
  }

  if (typeof type === 'string') {
    return type.replace('[]', '');
  }

  return type;
};
export const useSubFlatKeys = (key: string) => {
  const { flat } = useActionStore((store) => ({
    flat: store.data,
    key: store.key,
  }));

  if (!flat.exist(key) || !Array.isArray(flat.get(key))) {
    return [];
  }

  return flat.getKeys().filter((k) => k.startsWith(`${key}`) && key !== k);
};

export const useActionKey = () => useActionStore((state) => state.key);
