import React, { useState } from 'react';

type ValueType = string | number | boolean | [] | null; 

type ValuesType = {
    [key: string]: ValueType;
};

interface IFieldProps {
    name: string;
    type: string;
    id?: string;
    className?: string;
};

interface IUseFieldProps extends IFieldProps {
    component?: React.ElementType;
}

interface IInternalProps extends IUseFieldProps {
    checked?: ValueType;
    value?: ValueType;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IProps {
    onSubmit: (values: ValuesType) => void;
    initialValues: ValuesType;
};

interface IForm {
    values: null | ValuesType;
    onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFieldValue: (name: string, value: ValueType) => void;
    useField: (fieldProps: IFieldProps) => ((props: any) => JSX.Element) | void;
};

let useForm = (props: IProps) => {
    let { initialValues, onSubmit } = props;

    let [values, setValues] = useState(initialValues);

    let form: IForm = {
        values,
        onSubmit: () => {},
        onChange: () => {},
        setFieldValue: () => {},
        useField: () => {},
    };

    form.onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(form.values) {
            onSubmit(form.values);
        }
    };

    form.setFieldValue = (name: string, value: ValueType) => setValues({ ...values, [name]: value })

    form.onChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        let name = e.target.name;
        let isCheckbox = e.target.type === 'checkbox';
        let value = isCheckbox ? e.target.checked : e.target.value;

        form.setFieldValue(name, value);
    };

    form.useField = (fieldProps: IUseFieldProps) => {
        let  { component, ...commonProps } = fieldProps;

        let internalProps: IInternalProps = { ...commonProps, onChange: form.onChange };
        let fieldValue = values[internalProps.name];

        if (internalProps.type === 'checkbox') {
            internalProps.checked = fieldValue;
        } else {
            internalProps.value = fieldValue;
        }

        if (component) {
            let Component: React.ElementType = component;

            return (props: any): JSX.Element => (<Component {...internalProps} {...props} />);
        }

        return (props: any): JSX.Element => (<input {...internalProps} {...props} />);
    };

    return form;
}

export default useForm;
