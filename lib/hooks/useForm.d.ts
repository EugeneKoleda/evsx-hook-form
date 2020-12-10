import React, { SyntheticEvent } from 'react';
declare type ValueType = string | number | boolean | [] | null;
declare type ValuesType = {
    [key: string]: ValueType;
};
interface IProps {
    onSubmit: (values: ValuesType) => void;
    initialValues: ValuesType;
}
interface IForm {
    values: null | ValuesType;
    onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
declare let useForm: (props: IProps) => IForm;
export default useForm;
//# sourceMappingURL=useForm.d.ts.map