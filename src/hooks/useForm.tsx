import React, { SyntheticEvent, useMemo, useState } from 'react';

type ValueType = string | number | boolean | [] | null; 

type ValuesType = {
    [key: string]: ValueType;
};

type StateMapType = {
    [key: string]: [ValueType, React.Dispatch<React.SetStateAction<ValueType>>]
};

interface IProps {
    onSubmit: (values: ValuesType) => void;
    initialValues: ValuesType;
};

interface IForm {
    values: null | ValuesType;
    onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

let useForm = (props: IProps) => {
    let { initialValues, onSubmit } = props;
    let form: IForm = {
        values: null,
        onSubmit: () => {},
        onChange: () => {},
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

    form.onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        let name = e.target.name;

        let [, setValue] = stateMap[name];

        setValue(value);
    };

    return form;
}

export default useForm;
