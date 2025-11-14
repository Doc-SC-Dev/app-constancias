import { Input } from "../ui/input";
import { FormBase, type FormControlFunc } from "./base";
export const FormInput: FormControlFunc = (props) => {
  return <FormBase {...props}>{(field) => <Input {...field} />}</FormBase>;
};
