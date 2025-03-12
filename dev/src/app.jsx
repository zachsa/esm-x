import React, { lazy, Suspense, useState } from 'react'
import { CssVarsProvider } from '@mui/joy/styles'
import { Container, Sheet, Typography } from '@mui/joy'
import { TEST_TYPESCRIPT_C } from './constants.ts'
import ButtonNonLazy from './button-non-lazy.jsx'

const Button = lazy(() => import('./src/button.jsx'))

export default function App() {
  const [count, setCount] = useState(0)

  const buttons = new Array(count).fill(null)

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
        <ButtonNonLazy
          sx={{ display: 'block', mb: t => t.spacing(2) }}
          onClick={() => setCount(c => ++c)}
        >
          Add new Button
        </ButtonNonLazy>
        {buttons.map(i => (
          <Suspense key={i} fallback="Loading component ...">
            <Button
              sx={{ display: 'block', mb: t => t.spacing(2) }}
              onClick={() => setCount(c => --c)}
            >
              Click to remove
            </Button>
          </Suspense>
        ))}
      </Container>
    </CssVarsProvider>
  )
}
