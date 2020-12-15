import React from 'react';
declare type ValueType = string | number | boolean | [] | null;
declare type ValuesType = {
    [key: string]: ValueType;
};
interface IFieldProps {
    name: string;
    type: string;
    id?: string;
    className?: string;
}
interface IProps {
    onSubmit: (values: ValuesType) => void;
    initialValues: ValuesType;
}
interface IForm {
    values: null | ValuesType;
    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFieldValue: (name: string, value: ValueType) => void;
    useField: (fieldProps: IFieldProps) => ((props: any) => JSX.Element) | void;
}
declare let useForm: (props: IProps) => IForm;
export default useForm;
//# sourceMappingURL=useForm.d.ts.map