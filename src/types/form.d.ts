export interface IForm {
    values: ValuesType;
    errors: {
        [key: string]: string;
    };
    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFieldValue: (name: string, value: ValueType) => void;
    useField: (fieldProps: IFieldProps) => ((props: any) => JSX.Element) | void;
    setError: (name: string, error: string) => void;
};

export type ValueType = string | number | boolean | [] | null; 

export type ValuesType = {
    [key: string]: ValueType;
};
