import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  Alert,
  Grid
} from '@mui/material';
import PageMenuBar from '../src/components/pagemenubar';
import {
  Transaction,
  CustomMessage
} from '@defichainwizard/custom-transactions';
import { useTranslation } from '../src/utils/translation';
import { DFIWallet } from '../src/blockchain/DFIwallet';
import { MainNet } from '@defichain/jellyfish-network';

const SEED_LENGTH = 24;

const Test: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState('');
  const [configError, setConfigError] = useState('');

  const customMessage: CustomMessage = {
    version: '1.0',
    vaultId: '______TBD_____',
    pause: 0,
    compounding: {
      threshold: 3,
      mode: 1,
      token: 'DFI'
    },
    poolpairs: { EEM: 70, TSLA: 30 },
    rules: {
      keepMaxRatio: 155,
      keepMinRatio: 152
    }
  };
  const [configMessage, setConfigMessage] = useState(
    JSON.stringify(customMessage, null, 2)
  );

  const handleConfigChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfigError('');
    try {
      const message = JSON.parse(event.target.value);
    } catch (e) {
      setConfigError(`${e}`);
    }

    setConfigMessage(event.target.value);
  };
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const sendTransaction = async () => {
    console.log('Sending transaction in client');
    try {
      const myAddress = address;
      const dfiWallet = new DFIWallet(getSeed(), MainNet);
      const account = await dfiWallet.getAccount(myAddress);
      if (!account) throw 'Could not get account';
      const wzTx = new Transaction({
        client: dfiWallet.getClient(),
        account: account,
        network: MainNet,
        passphrase: getSeed()
      });
      const message: CustomMessage = JSON.parse(configMessage);
      const txId = await wzTx.send(message);
      console.log('Transaction sent, ', txId);
      setSuccess(`Transaction sent, ${txId}`);
    } catch (e) {
      console.error('error sending transaction:', e);
      setErrorMessage(`${e}`);
      setError(true);
    }
  };

  //FROM SEED STUFF
  const [error, setError] = useState(false);
  const [seedState, setSeedState] = useState(['']);
  const [wordMap, setWordMap] = useState(new Map<number, string>());

  const updateWordMap = (id: number, word: string) => {
    setWordMap(new Map(wordMap.set(id, word)));
  };

  const t = useTranslation();
  const seedWordFields = [];

  // checks if a seed is correct and continues if possible
  const checkSeed = (e: React.MouseEvent) => {
    setError(false);
    setSuccess('');
    console.log('Checking seed');
    const valid = DFIWallet.checkSeed(seedState, MainNet);
    // are they valid?
    setErrorMessage(t.setup.seederror);
    setError(!valid);
    if (valid) {
      // store it in the state
      //   handleClickOpen();
      sendTransaction().then(() => console.log('TX SENT :-)'));
    }
  };

  // stores the address in the context
  const changeWords = (e: React.ChangeEvent<HTMLInputElement>) => {
    // store word
    e.target.value = e.target.value.trim().toLocaleLowerCase();
    updateWordMap(parseInt(e.target.id), e.target.value);
    if (wordMap.size === SEED_LENGTH) {
      // ok, words are fine
      setSeedState(getSeed());
    }
  };

  const getSeed = (): string[] => {
    return Array.from(
      new Map([...wordMap].sort((a, b) => a[0] - b[0])).values()
    );
  };

  for (let i = 1; i <= SEED_LENGTH; i++) {
    seedWordFields.push(
      <Grid key={i} item xs={6}>
        <TextField
          id={`${i}`}
          label={`${i}. word`}
          variant="outlined"
          color="primary"
          size="small"
          sx={{ width: '97%' }}
          onChange={changeWords}
        />
      </Grid>
    );
  }
  //END SEED STUFF

  return (
    <Box>
      <Head>
        <title>WiZARD NPM Test Page</title>
      </Head>
      <Box>
        <PageMenuBar title="Overview" />
        <Box sx={{ m: 2 }}>
          <Typography variant="h1" align="center">
            WiZARD Config Pusher
          </Typography>
          <TextField
            fullWidth
            error={configError.length > 0}
            helperText={configError}
            id="config"
            label="Config"
            multiline
            minRows={8}
            value={configMessage}
            onChange={handleConfigChange}
            variant="standard"
          />
          <Box>
            <TextField
              fullWidth
              id="wallet-address"
              label="Wallet Address"
              value={address}
              onChange={handleAddressChange}
              variant="standard"
            />
            <Box height={'100%'}>
              <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                spacing={3}
                sx={{ mt: 2 }}
              >
                <Stack
                  direction="column"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <Alert severity="info">
                    "Your seed will only be used once to sign the Transaction.
                    It will NOT be stored"
                  </Alert>
                  <Typography variant="body2">{t.setup.seedtext}:</Typography>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    sx={{ pl: 1, pr: 1 }}
                  >
                    {seedWordFields.map((obj) => obj)}
                  </Grid>
                </Stack>
                {error && <Alert severity="error">{errorMessage}</Alert>}
                {success.length > 0 && (
                  <Alert severity="success">{success}</Alert>
                )}
                <Button
                  disabled={wordMap.size !== 24}
                  variant="contained"
                  color="primary"
                  onClick={checkSeed}
                >
                  Check Seed & Send Transaction
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Test;
