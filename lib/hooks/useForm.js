"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
;
;
let useForm = (props) => {
    let { initialValues, onSubmit } = props;
    let form = {
        values: null,
        onSubmit: () => { },
        onChange: () => { },
    };
    let stateMap = react_1.useMemo(() => Object.keys(initialValues).reduce((result, key) => {
        let initialValue = initialValues[key];
        result[key] = react_1.useState(initialValue);
        return result;
    }, {}), [initialValues]);
    form.values = react_1.useMemo(() => Object.keys(stateMap).reduce((result, key) => {
        let [value] = stateMap[key];
        result[key] = value;
        return result;
    }, {}), [stateMap]);
    form.onSubmit = (e) => {
        e.preventDefault();
        if (form.values) {
            onSubmit(form.values);
        }
    };
    form.onChange = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        let [, setValue] = stateMap[name];
        setValue(value);
    };
    return form;
};
exports.default = useForm;
//# sourceMappingURL=useForm.js.map