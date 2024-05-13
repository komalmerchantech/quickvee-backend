import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";

export default function BasicTextFields({value,maxLength,onChangeFun,type,placeholder,readOnly,required}) {
  return (
    <FormControl fullWidth>
      <TextField 
      id="outlined-basic" 
      name= {value}
      value={value}
      inputProps={{ maxLength: maxLength,type: type, readOnly:readOnly }}
      onChange={onChangeFun}
      placeholder={placeholder}
      required={required}
       variant="outlined" size="small" />
    </FormControl>
  );
}