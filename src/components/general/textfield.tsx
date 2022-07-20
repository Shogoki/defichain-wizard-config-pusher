import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import { TextFieldProps } from '../../interfaces';
import { useState, useEffect, ChangeEvent } from 'react';
import TextField from '@mui/material/TextField';
import { getSeed, isStringNullOrEmpty } from '../../utils/helpers';
import { logInfo, logInfoPlus } from '../../utils/logger';

export default function TextFieldComponent({
  label,
  text,
  inputProps = {},
  onChanged
}: TextFieldProps) {
  const [textValue, setTextValue] = useState<string>('');
  useEffect(() => {
    setTextValue(text);
  }, [text, setTextValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChanged) onChanged(event.target.value);
  };

  return (
    <Box sx={{ pb: 2 }}>
      <InputLabel htmlFor="input-wallet-address">{label}</InputLabel>
      <TextField
        hiddenLabel
        id="input-wallet-address"
        margin="normal"
        fullWidth
        value={textValue}
        variant="outlined"
        onChange={handleChange}
        InputProps={inputProps}
      />
    </Box>
  );
}
