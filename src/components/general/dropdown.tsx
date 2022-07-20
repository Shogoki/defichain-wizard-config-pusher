import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DropDownProps } from '../../interfaces';
import { SelectChangeEvent } from '@mui/material';
import { useState, useEffect } from 'react';
import { isStringNullOrEmpty } from '../../utils/helpers';

export default function Dropdown({
  label,
  values,
  labels,
  context,
  onChanged
}: DropDownProps) {
  const [value, setValue] = useState(values[0]);

  useEffect(() => {
    if (isStringNullOrEmpty(context)) {
      setValue(values[0]);
      onChanged(values[0]);
    }
  }, [values, context, onChanged]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setValue(event.target.value);
    onChanged(event.target.value);
  };

  return (
    <Box sx={{ pb: 2 }}>
      <InputLabel sx={{ pb: 2 }}>{label}</InputLabel>
      <Select value={value} onChange={handleChange}>
        {values.map((value, key) => (
          <MenuItem key={key} value={value}>
            {labels[key]}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
