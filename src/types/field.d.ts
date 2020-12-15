interface IFieldProps {
    name: string;
    type: string;
    id?: string;
    className?: string;
};

export interface IUseFieldProps extends IFieldProps {
    component?: React.ElementType;
}
