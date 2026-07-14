import React, { lazy, Suspense, useState } from 'react'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Paper,
  Typography,
} from '@mui/material'
import { TEST_TYPESCRIPT_C } from './constants.ts'
import ButtonNonLazy from './button-non-lazy.jsx'

const Button = lazy(() => import('./src/button.jsx'))

const theme = createTheme({
  palette: { mode: 'light' },
})

export default function App() {
  const [count, setCount] = useState(0)
  const buttons = Array.from({ length: count }, (_, idx) => idx)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper
        elevation={0}
        sx={{
          py: 1,
          px: 1,
          gap: 2,
          display: 'flex',
          justifyContent: 'center',
          bgcolor: theme => theme.palette.primary.main,
          color: theme => theme.palette.primary.contrastText,
        }}
      >
        <Typography variant="h4" variantMapping={{ h4: 'h1' }}>Title</Typography>
      </Paper>

      <Container sx={{ mt: 2 }}>
        <Typography variant="body1">I am content {TEST_TYPESCRIPT_C}</Typography>

        <ButtonNonLazy
          sx={{ display: 'block', mb: t => t.spacing(2) }}
          onClick={() => setCount(c => c + 1)}
        >
          Add new Button
        </ButtonNonLazy>

        {buttons.map(i => (
          <Suspense key={i} fallback="Loading component ...">
            <Button
              sx={{ display: 'block', mb: t => t.spacing(2) }}
              onClick={() => setCount(c => Math.max(0, c - 1))}
            >
              Click to remove
            </Button>
          </Suspense>
        ))}
      </Container>
    </ThemeProvider>
  )
}
