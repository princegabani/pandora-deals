import { React, useState } from 'react';
import { FormControl, Stack, InputLabel, OutlinedInput, InputAdornment, Typography, Link } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { setAuth, setCompanyData, setEmployeeData } from '../../store';
import { InitAuth, INITSIGNIN } from 'src/database/component/auth/auth';
import { setAppData } from 'src/store/actions/userActions';


export function LoginForm() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showMessage, setShowMessage] = useState("")
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const onClickLogin = async () => {
        setShowMessage('')
        setLoading(true)
        if (email !== '' && password !== '') {

            const userData = await InitAuth.sign_in(email, password);
            if (userData?.success) {
                const ref = await INITSIGNIN(userData.data)
                if (ref.success) {
                    let emp = ref?.data?.employee
                    let com = ref?.data?.company
                    dispatch(setAuth(ref?.data?.auth))
                    dispatch(setCompanyData(ref?.data?.company))
                    dispatch(setEmployeeData(emp ?? {}))
                    dispatch(setAppData({
                        appMode: Object.keys(emp).length !== 0 ? 'emp' : 'admin',
                        username: Object.keys(emp).length === 0 ? 'Admin ' + com.ownerName : emp.emName,
                        companyName: com?.cmName ?? 'Not Found',
                        email: emp ? emp?.emEmail : com?.cmEmail,
                        photoURL: '/assets/images/avatars/avatar_default.jpg',
                    }))
                    navigate('/dashboard');
                } else {

                    setShowMessage("Something went wrong")
                }

            } else setShowMessage(userData?.message)
        } else setShowMessage("Something went wrong")
        setLoading(false)
    }

    const handleForgetPassword = () => {
        if (email.length === 0) {
            setShowMessage("Please enter email")
            return
        }
        const ref = InitAuth.send_forget_password_link(email)
        if (ref.success) {
            setShowMessage("Password reset link sent to your email")
        }

    }

    return (
        <>
            <Stack spacing={2}>
                {showMessage &&
                    <Typography style={{ color: 'red' }}>{showMessage}</Typography>
                }
                <FormControl required sx={{ width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                    <OutlinedInput
                        required
                        id="outlined-adornment-email filled-basic color-transparent"
                        type='email'
                        label='Email'
                        value={email}
                        variant="filled"
                        onChange={(event) => setEmail(event.target.value)} />
                </FormControl>
                <FormControl required sx={{ width: '100%' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password filled-password-input"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    // onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        variant="filled"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </FormControl>

                {/* <Typography variant="body2" sx={{ mb: 5 }}> */}
                <Link component="button" underline="none" onClick={() => handleForgetPassword()} variant="subtitle2">Forget Password?</Link>
                {/* </Typography> */}

                <LoadingButton onClick={onClickLogin} loading={loading} fullWidth size="large"
                    color="inherit"
                    variant="contained">
                    <span>Submit</span>
                </LoadingButton>
            </Stack>
        </>
    )
}