import { mount } from 'enzyme';
import React from 'react';

import useForm from '../lib/hooks/useForm';

let TestComponent = (props) => {
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

let hookProps = {
    initialValues: { name: 'Test', age: 20, isAgree: true },
    onSubmit: (values) => console.log(`Values: ${values.name}, ${values.age}, ${values.isAgree}`),
};

let TestVars = (props) => {
    let form = useForm(props.hookProps);

    return <div {...form} />;
};

describe('Test useForm props', () => {
    it('Test useForm props correct', () => {
        let testWrapper = mount(<TestComponent hookProps={hookProps} />);

        expect(testWrapper.props().hookProps.initialValues).toBeDefined();
        expect(testWrapper.props().hookProps.initialValues).toHaveProperty('name', 'Test');
        expect(testWrapper.props().hookProps.initialValues).toHaveProperty('age', 20);
        expect(testWrapper.props().hookProps.initialValues).toHaveProperty('isAgree', true);

        expect(testWrapper.props().hookProps.onSubmit).toBeDefined();
        expect(typeof testWrapper.props().hookProps.onSubmit).toBe("function");
    });

    it('Test useForm props empty', () => {
        let props = {};

        let testWrapper = mount(<TestComponent hookProps={props} />);

        expect(testWrapper.props().hookProps.initialValues).toBeUndefined();
        expect(testWrapper.props().hookProps.onSubmit).toBeUndefined();
    });
});

describe('Test useForm', () => {
    it('Check useForm result', () => {        
        let container = shallow(<TestVars hookProps={hookProps} />);

        expect(container.prop('values')).toBeDefined();
        expect(container.prop('values')).toHaveProperty('name', 'Test');
        expect(container.prop('values')).toHaveProperty('age', 20);
        expect(container.prop('values')).toHaveProperty('isAgree', true);

        expect(container.prop('onSubmit')).toBeDefined();
        expect(container.prop('onSubmit')).toEqual(expect.any(Function));

        expect(container.prop('onChange')).toBeDefined();
        expect(container.prop('onChange')).toEqual(expect.any(Function));

        expect(container.prop('useField')).toBeDefined();
        expect(container.prop('useField')).toEqual(expect.any(Function));

        expect(container.prop('setFieldValue')).toBeDefined();
        expect(container.prop('setFieldValue')).toEqual(expect.any(Function));
    });

    it('Check useForm methods', () => {
        let container = shallow(<TestVars hookProps={hookProps} />);

        container.prop('setFieldValue')('name', 'TestName');
        expect(container.prop('values')).toHaveProperty('name', 'TestName');
    });

    it('Check events', () => {
        let container = mount(<TestComponent hookProps={hookProps} />);

        let form = container.find('form');
        form.simulate('submit');

        container.find('input[type="text"]').simulate('change', {
            target: {
                value: 'TestName',
                name: 'name',
            }
        });
        container.find('input[type="number"]').simulate('change', {
            target: {
                value: 100,
                name: 'age',
            }
        });
        container.find('input[type="checkbox"]').simulate('change', {
            target: {
                value: false,
                name: 'isAgree',
            }
        });

        expect(container.find('input[type="text"]').prop('value')).toEqual('TestName');
        expect(container.find('input[type="number"]').prop('value')).toEqual(100);
        expect(container.find('input[type="checkbox"]').prop('checked')).toEqual(false);
    });
});

describe('Check useField', () => {
    let initialValues = { 
        ...hookProps.initialValues,
        lastName: 'TestLast',
        isSubscribed: true,
        city: 'TestCity',
    };

    let container = shallow(<TestVars hookProps={{ ...hookProps, initialValues }} />);

    expect(container.prop('values')).toBeDefined();

    it('Check correct useField with text input', () => {
        let TextField = container.prop('useField')({ type: 'text', name: 'lastName' });
        let containerField = mount(<TextField />);
        containerField.find('input[name="lastName"]').simulate('change', {
            target: {
                value: 'TestLastName',
                name: 'lastName',
            }
        });

        expect(container.prop('values')).toHaveProperty('lastName', 'TestLastName');
    });

    it('Check correct useField with checkbox input', () => {
        let CheckboxField = container.prop('useField')({ type: 'checkbox', name: 'isSubscribed' });
        let containerField = mount(<CheckboxField />);
        containerField.find('input[name="isSubscribed"]').simulate('change', {
            target: {
                value: false,
                name: 'isSubscribed',
            }
        });

        expect(container.prop('values')).toHaveProperty('isSubscribed', false);
    });

    it('Check correct useField with custom component', () => {
        let CustomInput = (props) => <input {...props} />;

        let CustomInputField = container.prop('useField')({ type: 'text', name: 'city', component: CustomInput });
        let containerField = mount(<CustomInputField />);
        containerField.find('input[name="city"]').simulate('change', {
            target: {
                value: 'TestCityName',
                name: 'city',
            }
        });

        expect(container.prop('values')).toHaveProperty('city', 'TestCityName');
    });
}); 