import { BottomNavigationAction, BottomNavigation, Paper } from '@mui/material';
import SettingsIcon from '@mui/icons-material/SmartToy';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import InfoIcon from '@mui/icons-material/Info';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import React from 'react';
import { useTranslation } from '../utils/translation';

export default function FooterNavigation() {
  const [value, setValue] = React.useState(0);
  const t = useTranslation();

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, opacity: 1 }}
      elevation={3}
    >
      {/**<BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          component={Link}
          href="/"
          label={t.overview.title}
          icon={<AccountBalanceWalletIcon />}
        />
        <BottomNavigationAction
          component={Link}
          href="/botsettings"
          label={t.botsettings.title}
          icon={<SettingsIcon />}
        />
        <BottomNavigationAction
          component={Link}
          href="/botstrategies"
          label={t.botstrategies.title}
          icon={<AutoModeIcon />}
        />
        <BottomNavigationAction
          component={Link}
          href="/about"
          color="primary"
          label={t.about.title}
          icon={<InfoIcon />}
        />
      </BottomNavigation>*/}
    </Paper>
  );
}
