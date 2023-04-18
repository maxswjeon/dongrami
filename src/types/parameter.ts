export type ParameterComponentProps = {
  setInvalid: (invalid: boolean) => void;
  setValue: (value: string) => void;
  value: string;
};

export type ParameterComponent = (
  props: ParameterComponentProps
) => JSX.Element;
