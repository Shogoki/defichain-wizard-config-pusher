import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { MenuBarTitleProps } from '../interfaces';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';

export default function PageMenuBar({ title }: MenuBarTitleProps) {
  const router = useRouter();
  return (
    <Box>
      <AppBar
        sx={{
          backgroundColor: 'white',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          height: 100
        }}
        position="static"
        elevation={0}
      >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
      </AppBar>
    </Box>
  );
}
