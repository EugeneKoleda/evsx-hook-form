import React from 'react';
import _ from 'lodash';
import { mount } from 'enzyme';

import { TestComponent, TestVars } from './seeds/useForm.seed';

const DEFAULT_PROPS = {
    initialValues: { name: 'Test', age: 20, isAgree: true },
    onSubmit: (values) => console.log(`Values: ${values.name}, ${values.age}, ${values.isAgree}`),
};


describe('Test useForm props', () => {
    it('Test useForm props correct', () => {
        let testWrapper = mount(<TestComponent hookProps={DEFAULT_PROPS} />);

        expect(testWrapper.props().hookProps.initialValues).toBeDefined();
        expect(testWrapper.props().hookProps.initialValues).toHaveProperty('name', 'Test');
        expect(testWrapper.props().hookProps.initialValues).toHaveProperty('age', 20);
        expect(testWrapper.props().hookProps.initialValues).toHaveProperty('isAgree', true);

        expect(testWrapper.props().hookProps.onSubmit).toBeDefined();
        expect(typeof testWrapper.props().hookProps.onSubmit).toBe("function");
    });

    it('Test useForm props empty', () => {
        let props = {
            ...DEFAULT_PROPS,
            initialValues: undefined
        };

        let testWrapper = mount(<TestComponent hookProps={props} />);

        expect(testWrapper.props().hookProps.initialValues).toBeUndefined();
    });
});

describe('Test useForm', () => {
    it('Check useForm result', () => {        
        let container = shallow(<TestVars  hookProps={DEFAULT_PROPS}/>);

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
        let container = shallow(<TestVars hookProps={DEFAULT_PROPS} />);

        container.prop('setFieldValue')('name', 'TestName');
        expect(container.prop('values')).toHaveProperty('name', 'TestName');
    });

    it('Check events', () => {
        let container = mount(<TestComponent hookProps={DEFAULT_PROPS} />);

        let form = container.find('form');
        form.simulate('submit');

        container.find('input[name="name"]').simulate('change', {
            target: {
                value: 'TestName',
                name: 'name',
            }
        });
        container.find('input[name="age"]').simulate('change', {
            target: {
                value: 100,
                name: 'age',
            }
        });
        container.find('input[name="isAgree"]').simulate('change', {
            target: {
                value: false,
                name: 'isAgree',
            }
        });

        expect(container.find('input[name="name"]').prop('value')).toEqual('TestName');
        expect(container.find('input[name="age"]').prop('value')).toEqual(100);
        expect(container.find('input[name="isAgree"]').prop('checked')).toEqual(false);
    });
});

describe('Check useField', () => {
    let initialValues = { 
        ...DEFAULT_PROPS.initialValues,
        lastName: 'TestLast',
        isSubscribed: true,
        city: 'TestCity',
    };

    let container = shallow(<TestVars hookProps={_.merge(DEFAULT_PROPS, { initialValues })} />);

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