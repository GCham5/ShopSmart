import * as React from 'react';
import Stack from '@mui/material/Stack';
import { DomainDropdown } from './DomainDropdown';


export function SessionList(props) {
  return (
    <Stack spacing={0}>
      <DomainDropdown/>
    </Stack>
  )
}