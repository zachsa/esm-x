import React, { lazy, Suspense } from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import { Container, Sheet, Typography } from '@mui/joy'
import { TEST_TYPESCRIPT_C } from './constants.ts'
import ButtonNonLazy from './button-non-lazy.jsx'

const Button = lazy(() => import('./button.jsx'))

export default function App() {
  return (
    <CssVarsProvider defaultMode="dark">
      <Sheet
        variant="soft"
        color="primary"
        sx={{ py: 1, px: 1, gap: 2, display: 'flex', justifyContent: 'center' }}
      >
        <Typography variant="h1">Title</Typography>
      </Sheet>
      <Container
        sx={{
          mt: 2,
        }}
      >
        <Typography variant="body1">I am content {TEST_TYPESCRIPT_C}</Typography>
        <ButtonNonLazy />
        {/* <Suspense fallback="Loading component ...">
          <Button />
        </Suspense> */}
      </Container>
    </CssVarsProvider>
  )
}
