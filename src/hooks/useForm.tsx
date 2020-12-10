import React, { SyntheticEvent, useMemo, useState } from 'react';

type ValueType = string | number | boolean | [] | null; 

type ValuesType = {
    [key: string]: ValueType;
};

type StateMapType = {
    [key: string]: [ValueType, React.Dispatch<React.SetStateAction<ValueType>>]
};

interface IFieldProps {
    name: string;
    type: string;
    Component?: () => JSX.Element;
    id?: string;
    className?: string;
};

interface IInternalProps extends IFieldProps {
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
    onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFieldValue: (name: string, value: ValueType) => void;
    useField: (fieldProps: IFieldProps) => JSX.Element | ((props: any) => JSX.Element) | void;
};



let useForm = (props: IProps) => {
    let { initialValues, onSubmit } = props;
    let form: IForm = {
        values: null,
        onSubmit: () => {},
        onChange: () => {},
        setFieldValue: () => {},
        useField: () => {},
    };

    let stateMap = useMemo(() => 
        Object.keys(initialValues).reduce((result: StateMapType, key: string): StateMapType => {
            let initialValue = initialValues[key];

            result[key] = useState(initialValue);

            return result;
        }, {}), 
        [initialValues]
    ); 

    form.values = useMemo(() => 
        Object.keys(stateMap).reduce((result: ValuesType, key: string): ValuesType => {
            let [value] = stateMap[key];

            result[key] = value;

            return result;
        }, {}), 
        [stateMap]
    );

    form.onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(form.values) {
            onSubmit(form.values);
        }
    };

    form.setFieldValue = (name: string, value: ValueType) => {
        let [, setValue] = stateMap[name];

        setValue(value);
    };

    form.onChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        let name = e.target.name;
        let isCheckbox = e.target.type === 'checkbox';
        let value = isCheckbox ? e.target.checked : e.target.value;

        form.setFieldValue(name, value);
    };

    form.useField = (fieldProps: IFieldProps) => {
        let  { Component, ...commonProps } = fieldProps;

        let internalProps: IInternalProps = { ...commonProps, onChange: form.onChange };
        let [fieldValue] = stateMap[internalProps.name];

        if (internalProps.type === 'checkbox') {
            internalProps.checked = fieldValue;
        } else {
            internalProps.value = fieldValue;
        }

        if (Component) {
            return <Component />;
        }

        return (props: any): JSX.Element => (<input {...internalProps} {...props} />);
    };

    return form;
}

export default useForm;
