import * as React from 'react';
import Stack from '@mui/material/Stack';
import { DomainDropdown } from './DomainDropdown';
import Test from '../../../testData.json';

export function SessionList(props) {
  return (
    <Stack spacing={0}>
      Test.map()
      <DomainDropdown/>
    </Stack>
  )
}