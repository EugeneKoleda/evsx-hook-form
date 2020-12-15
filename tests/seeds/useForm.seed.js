import React from 'react';

import useForm from '../../lib/hooks/useForm';


export let TestComponent = (props) => {
    let { hookProps } = props;

    if(!hookProps.initialValues || !hookProps.onSubmit) {
        return null;
    }

    let form = useForm(hookProps);

    return (
        <form onSubmit={form.onSubmit}>
            <input type="text" name="name" value={form.values.name} onChange={form.onChange} />
            <input type="number" name="age" value={form.values.age} onChange={form.onChange} />
            <input type="checkbox" name="isAgree" checked={form.values.isAgree} onChange={form.onChange} />
        </form>
    );
};

export let TestVars = (props) => {
    let { hookProps } = props;

    let form = useForm(hookProps);

    return <div {...form} />;
};