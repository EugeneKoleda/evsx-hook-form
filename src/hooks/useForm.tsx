import React, { useState, useMemo } from 'react';
import * as Yup from 'yup';

import { ValueType, ValuesType, IUseFieldProps, IForm } from '../types';

interface IInternalProps extends IUseFieldProps {
    checked?: ValueType;
    value?: ValueType;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IProps {
    onSubmit: (values: ValuesType) => void;
    initialValues: ValuesType;
    validationSchema?: Yup.SchemaOf<ValuesType>
};

let useForm = (props: IProps) => {
    let { initialValues, onSubmit, validationSchema } = props;

    let initialErrors = useMemo(() => 
        Object.keys(initialValues)
            .reduce((errors: { [key: string]: string }, key: string) => {
                errors[key] =  '';

                return errors;
            }, {}), 
        [initialValues]
    );

    let [values, setValues] = useState(initialValues);
    let [errors, setErrors] = useState(initialErrors);

    let form: IForm = {
        values,
        errors,
        onSubmit: () => {},
        onChange: () => {},
        setFieldValue: () => {},
        useField: () => {},
        setError: () => {},
    };

    form.onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        let isValidationSchemaExist = Boolean(validationSchema);

        try {
            if(isValidationSchemaExist) {
                validationSchema?.validateSync(form.values, { abortEarly: false });
            }

            onSubmit(form.values);
        } catch(err) {
            let currentErrors = err.inner.reduce((errorsMap: { [key: string]: string }, { path: key, errors }: { path: string, errors: Array<string> }) => {
                let [errorMessage] = errors;

                if(!errorsMap[key]) {
                    errorsMap[key] = errorMessage;
                }

                return errorsMap;
            }, {});
            
            setErrors(currentErrors);
        }
    };

    form.setFieldValue = (name: string, value: ValueType) => setValues((prevState) => ({ ...prevState, [name]: value }));

    form.setError = (name: string, error: string) => setErrors((prevState) => ({ ...prevState, [name]: error }));


    form.onChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        let name = e?.target?.name;
        let isCheckbox = e?.target?.type === 'checkbox';
        let value = isCheckbox ? 
            e?.target?.checked : 
            e?.target?.value;

        form.setFieldValue(name, value);

        let errorMessage = '';

        try {
            validationSchema?.validateSync({ ...form.values, [name]: value }, { abortEarly: false });
        } catch(err) {
            let error = err.inner.find((errorObject: { path: string, errors: Array<string> }) => errorObject.path === name);
            
            if(error) {
                [errorMessage] = error.errors;
            }
        } finally {
            setErrors((prevState) => ({ ...prevState, name: errorMessage }));
        }
    };

    form.useField = (fieldProps: IUseFieldProps) => {
        let  { component, ...commonProps } = fieldProps;

        let internalProps: IInternalProps = { ...commonProps, onChange: form?.onChange };
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
