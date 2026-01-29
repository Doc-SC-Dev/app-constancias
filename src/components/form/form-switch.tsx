import { Switch } from "../ui/switch";
import { FormBase, type FormControlFunc } from "./base";

export const FormSwitch: FormControlFunc = (props) => {
  return (
    <FormBase {...props} horizontal controlFirst>
      {(field) => (
        <Switch
          {...field}
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      )}
    </FormBase>
  );
};
