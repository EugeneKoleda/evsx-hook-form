import * as Yup from 'yup';
import { ValuesType, IForm } from '../types';
interface IProps {
    onSubmit: (values: ValuesType) => void;
    initialValues: ValuesType;
    validationSchema?: Yup.SchemaOf<ValuesType>;
}
declare let useForm: (props: IProps) => IForm;
export default useForm;
//# sourceMappingURL=useForm.d.ts.map