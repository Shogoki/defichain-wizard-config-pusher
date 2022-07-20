import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../utils/translation';

export default function MenuBar() {
  const t = useTranslation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box
            width={32}
            height={32}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src="/icon-192x192.png"
              alt="DFIChain logo"
              width={30}
              height={30}
            />
          </Box>
          <Typography variant="h5" component="div" sx={{ ml: 1, flexGrow: 1 }}>
            {t.general.name}
          </Typography>
          <Link href="/settings" passHref>
            <IconButton color="primary" aria-label="Settings">
              <SettingsIcon />
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
