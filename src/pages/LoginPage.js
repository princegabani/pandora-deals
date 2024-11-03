import { useState } from 'react'
import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
// sections
import { LoginForm } from '../sections/auth/Signin';
// import { SignUpForm } from 'src/sections/auth/Signup';
import { RegisterCompanyForm } from 'src/sections/auth/RegisterCompanyForm';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  // const [showSignupForm, setShowSignupForm] = useState(false);
  const [showRegisterCompanyForm, setShowRegisterCompanyForm] = useState(false);

  return (
    <>
      <Helmet>
        <title> Login | DManager </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm" >
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign in to Diamond Manager
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              {showRegisterCompanyForm ? 'Already' : 'Don’t'} have an account? {''}
              <Link onClick={() => setShowRegisterCompanyForm(!showRegisterCompanyForm)}
                variant="subtitle2">
                {showRegisterCompanyForm ? 'Sign In' : 'Register your company'}
              </Link>
            </Typography>

            {/* <Stack direction="row" spacing={2}>
              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
              </Button>

              <Button fullWidth size="large" color="inherit" variant="outlined">
                <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
              </Button>
            </Stack> */}
            <><Stack direction="row" spacing={2}>
              <Button size="large" color="inherit" variant="outlined" onClick={() => setShowRegisterCompanyForm(!showRegisterCompanyForm)}>
                {!showRegisterCompanyForm ? "Register Company?" : "Login?"}
              </Button>
            </Stack>
              <Divider sx={{ my: 3 }}>
                {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography> */}
              </Divider> </>

            {showRegisterCompanyForm ? <RegisterCompanyForm show={showRegisterCompanyForm} /> : <LoginForm show={showRegisterCompanyForm} />}
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
