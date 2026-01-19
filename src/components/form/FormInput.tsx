import { Input } from "../ui/input";
import { FormBase, type FormControlFunc } from "./base";
export const FormInput: FormControlFunc<{ placeholder?: string }> = (props) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <Input
          {...field}
          placeholder={props.placeholder}
          autoComplete=""
          type={props.password ? "password" : "text"}
        />
      )}
    </FormBase>
  );
};
