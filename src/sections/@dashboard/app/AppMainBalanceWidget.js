// @mui
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fRupees } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledIcon = styled('div')(({ theme }) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

AppMainBalanceWidget.propTypes = {
    color: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    sx: PropTypes.object,
};

export default function AppMainBalanceWidget({ title, total, icon, color = 'primary', sx, size, border, ...other }) {
    console.log('called')
    return (
        <Card
            sx={{
                px: 2,
                py: 4,
                boxShadow: 0,
                // textAlign: 'center',
                color: 'white',
                bgcolor: '#383838',
                border: border ? border : 0,
                borderColor: (theme) => theme.palette[color].darker,
                ...sx,
            }}
            {...other}
        >
            {/* {icon && <StyledIcon
                sx={{
                    color: (theme) => theme.palette[color].dark,
                    backgroundImage: (theme) =>
                        `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
                            theme.palette[color].dark,
                            0.24
                        )} 100%)`,
                }}
            >
                <Iconify icon={icon} width={24} height={24} />
            </StyledIcon>} */}
            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>Total Balance</Typography>
            <Typography variant="h4">{total === 0 ? 0 : fRupees(total)}</Typography>

            {/* <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                {title}
            </Typography> */}
        </Card>
    );
}
