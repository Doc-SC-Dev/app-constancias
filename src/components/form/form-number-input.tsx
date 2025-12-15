import { Input } from "../ui/input";
import { FormBase, type FormControlFunc } from "./base";
export const FormNumberInput: FormControlFunc = (props) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <Input
          {...field}
          onChange={(e) => field.onChange(Number(e.target.value))}
          autoComplete=""
          type="number"
          className="min-w-16 max-w-20"
        />
      )}
    </FormBase>
  );
};
