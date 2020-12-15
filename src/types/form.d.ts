export interface IForm {
    values: null | ValuesType;
    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFieldValue: (name: string, value: ValueType) => void;
    useField: (fieldProps: IFieldProps) => ((props: any) => JSX.Element) | void;
};

export type ValueType = string | number | boolean | [] | null; 

export type ValuesType = {
    [key: string]: ValueType;
};
