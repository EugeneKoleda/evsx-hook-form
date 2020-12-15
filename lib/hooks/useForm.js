"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
;
let useForm = (props) => {
    let { initialValues, onSubmit } = props;
    let [values, setValues] = react_1.useState(initialValues);
    let form = {
        values,
        onSubmit: () => { },
        onChange: () => { },
        setFieldValue: () => { },
        useField: () => { },
    };
    form.onSubmit = (e) => {
        e.preventDefault();
        if (form.values) {
            onSubmit(form.values);
        }
    };
    form.setFieldValue = (name, value) => setValues({ ...values, [name]: value });
    form.onChange = (e) => {
        let name = e.target.name;
        let isCheckbox = e.target.type === 'checkbox';
        let value = isCheckbox ? e.target.checked : e.target.value;
        form.setFieldValue(name, value);
    };
    form.useField = (fieldProps) => {
        let { component, ...commonProps } = fieldProps;
        let internalProps = { ...commonProps, onChange: form.onChange };
        let fieldValue = values[internalProps.name];
        if (internalProps.type === 'checkbox') {
            internalProps.checked = fieldValue;
        }
        else {
            internalProps.value = fieldValue;
        }
        if (component) {
            let Component = component;
            return (props) => (react_1.default.createElement(Component, Object.assign({}, internalProps, props)));
        }
        return (props) => (react_1.default.createElement("input", Object.assign({}, internalProps, props)));
    };
    return form;
};
exports.default = useForm;
//# sourceMappingURL=useForm.js.map