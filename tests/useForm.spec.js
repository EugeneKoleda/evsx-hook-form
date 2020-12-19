import React from 'react';
import _, { before } from 'lodash';
import { mount } from 'enzyme';
import * as Yup from 'yup';

import { TestComponent, TestProps } from './seeds/useForm.seed';

const DEFAULT_PROPS = {
    initialValues: { name: 'Test', age: 20, isAgree: true },
    onSubmit: (values) => console.log(`Values: ${values.name}, ${values.age}, ${values.isAgree}`),
};


describe('Test useForm props', () => {
    it('Test useForm props correct', () => {
        let testWrapper = mount(<TestProps hookProps={DEFAULT_PROPS} />);

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
            initialValues: {}
        };

        let testWrapper = mount(<TestProps hookProps={props} />);

        expect(testWrapper.props().hookProps.initialValues).toBeDefined();
        expect(testWrapper.props().hookProps.initialValues).not.toHaveProperty('name', 'Test');
    });
});

describe('Test useForm', () => {
    let container = shallow(<TestComponent  hookProps={DEFAULT_PROPS}/>);
    let hookResContainer = container.props().children[0].props;

    it('Check useForm result', () => {        
        expect(hookResContainer.values).toBeDefined();
        expect(hookResContainer.values).toHaveProperty('name', 'Test');
        expect(hookResContainer.values).toHaveProperty('age', 20);
        expect(hookResContainer.values).toHaveProperty('isAgree', true);

        expect(hookResContainer.onSubmit).toBeDefined();
        expect(hookResContainer.onSubmit).toEqual(expect.any(Function));

        expect(hookResContainer.onChange).toBeDefined();
        expect(hookResContainer.onChange).toEqual(expect.any(Function));

        expect(hookResContainer.useField).toBeDefined();
        expect(hookResContainer.useField).toEqual(expect.any(Function));

        expect(hookResContainer.setFieldValue).toBeDefined();
        expect(hookResContainer.setFieldValue).toEqual(expect.any(Function));
    });

    it('Check useForm methods', () => {
        hookResContainer.setFieldValue('name', 'TestName');

        hookResContainer = container.props().children[0].props; // should update for getting fresh values

        expect(hookResContainer.values).toHaveProperty('name', 'TestName');
    });

    it('Check events', () => {
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

    let container = shallow(<TestComponent hookProps={_.merge(DEFAULT_PROPS, { initialValues })} />);
    let hookResContainer = container.props().children[0].props;

    expect(hookResContainer.values).toBeDefined();

    it('Check correct useField with text input', () => {
        let TextField = hookResContainer.useField({ type: 'text', name: 'lastName' });
        let containerField = mount(<TextField />);

        containerField.find('input[name="lastName"]').simulate('change', {
            target: {
                value: 'TestLastName',
                name: 'lastName',
            }
        });

        hookResContainer = container.props().children[0].props; // should update for getting fresh values

        expect(hookResContainer.values).toHaveProperty('lastName', 'TestLastName');
    });

    it('Check correct useField with checkbox input', () => {
        let CheckboxField = hookResContainer.useField({ type: 'checkbox', name: 'isSubscribed' });
        let containerField = mount(<CheckboxField />);

        containerField.find('input[name="isSubscribed"]').simulate('change', {
            target: {
                value: false,
                name: 'isSubscribed',
            }
        });

        hookResContainer = container.props().children[0].props; // should update for getting fresh values

        expect(hookResContainer.values).toHaveProperty('isSubscribed', false);
    });

    it('Check correct useField with custom component', () => {
        let CustomInput = (props) => <input {...props} />;

        let CustomInputField = hookResContainer.useField({ type: 'text', name: 'city', component: CustomInput });
        let containerField = mount(<CustomInputField />);

        containerField.find('input[name="city"]').simulate('change', {
            target: {
                value: 'TestCityName',
                name: 'city',
            }
        });

        hookResContainer = container.props().children[0].props; // should update for getting fresh values

        expect(hookResContainer.values).toHaveProperty('city', 'TestCityName');
    });
}); 

describe('Check validation', () => {
    const SCHEMA = Yup.object().shape({
        name: Yup.string().required('Required!').min(4, 'Length is too slow').max(20, 'Length is too match'),
    });

    let container = shallow(<TestComponent hookProps={{ ...DEFAULT_PROPS, validationSchema: SCHEMA }} />);
    let hookResContainer = container.props().children[0].props;

    let NameField = hookResContainer.useField({ type: 'text', name: 'name' });
    let nameContainer = mount(<NameField />);

    beforeEach(() => nameContainer.find('input[name="name"]').simulate('change', {
        target: {
            value: '',
            name: 'name',
        }
    }));

    it('check correct name', () => {
        nameContainer.find('input[name="name"]').simulate('change', {
            target: {
                value: 'TestName',
                name: 'name',
            }
        });

        hookResContainer = container.props().children[0].props; // should update for getting fresh values

        expect(hookResContainer.values).toHaveProperty('name', 'TestName');
        expect(hookResContainer.errors.name).toEqual('');
    });

    it('check invalid name', () => {
        nameContainer.find('input[name="name"]').simulate('change', {
            target: {
                value: 'Te',
                name: 'name',
            }
        });

        hookResContainer = container.props().children[0].props; // should update for getting fresh values

        expect(hookResContainer.values).toHaveProperty('name', 'Te');
        expect(hookResContainer.errors.name).toEqual('Length is too slow');
    });

    it('check onSubmit with empty values', () => {
        container.find('form').simulate('submit');

        hookResContainer = container.props().children[0].props; // should update for getting fresh errors

        expect(hookResContainer.errors.name).toEqual('Required!');
    });
});
