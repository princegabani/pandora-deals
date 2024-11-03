import { alpha, Button, Card, Divider, Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { handleStatus, handleTrasactionType } from './Utils'
import { fRupees } from 'src/utils/formatNumber'
import { dateFormat, formatDistanceDay, fToNow } from 'src/utils/formatTime'
import KeyboardDoubleArrowRightTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowRightTwoTone';
import { AppWidgetSummary } from '../app'
import Iconify from 'src/components/iconify'
import styled from '@emotion/styled'


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

const TransactionDetail = ({ data, handleEntry }) => {
    const titles = ["Expense Name", "Paid By", "Paid To", "Type", "Status", "Description"]
    const values = [
        data.expenseName,
        data.paidBy,
        data.paidTo,
        handleTrasactionType(data.transactionType).name,
        handleStatus(data.status),
        data.transactionDescription === "" ? 'none' : data.transactionDescription,
    ]
    console.log('daataa', data)

    return (
        <Grid container rowSpacing={0.1} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', minWidth: '100%', p: 2, alignItems: 'center' }}>

            <Grid item xs={4}>
                {/* <AppWidgetSummary
                    title={handleTrasactionType(data.transactionType).name}
                    total={fRupees(data.transactionAmount)}
                    icon="line-md:emoji-smile-twotone" /> */}

                <Card sx={{ p: 2, my: 'auto' }}>
                    <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <StyledIcon
                            sx={{
                                color: handleTrasactionType(data.transactionType).color,
                                backgroundImage: (theme) =>
                                    `linear-gradient(135deg, ${alpha(theme.palette['info'].dark, 0)} 0%, ${alpha(
                                        theme.palette['info'].dark,
                                        0.24
                                    )} 100%)`,
                            }}
                        >
                            <Iconify icon='line-md:emoji-smile-twotone' width={64} height={64} color='green' />
                        </StyledIcon>
                        <Typography variant='button' color='gray'>
                            {handleTrasactionType(data.transactionType).name}
                        </Typography>
                        <Typography variant='h4' color={handleTrasactionType(data.transactionType).color} >
                            {fRupees(data.transactionAmount)}
                        </Typography>
                    </Stack>
                </Card>
            </Grid>
            <Grid item xs={7} >
                <Card sx={{ p: 2, m: 1 }}>
                    <Stack>
                        <Typography variant='button' color='gray'>
                            Paid By
                        </Typography>
                        <Typography variant='h4'  >
                            {data.paidBy}
                        </Typography>
                    </Stack>
                </Card>
                <Card sx={{ p: 2, m: 1, }}>
                    <Stack>
                        <Typography variant='button' color='gray'>
                            Paid To
                        </Typography>
                        <Typography variant='h4'>
                            {data.paidTo}
                        </Typography>
                    </Stack>
                </Card>
            </Grid>

            <Grid item xs={3}>
                <Card sx={{ p: 2, m: 1 }}>
                    <Stack>
                        <Typography variant='button' color='gray'>
                            Expense Name
                        </Typography>
                        <Typography>
                            {data.expenseName}
                        </Typography>
                    </Stack>
                </Card>
            </Grid>

            <Grid item xs={3}>
                <Card sx={{ p: 2, m: 1 }}>
                    <Stack>
                        <Typography variant='button' color='gray'>
                            Transaction Date
                        </Typography>
                        <Typography>
                            {dateFormat(data.timestamp)}
                        </Typography>
                    </Stack>
                </Card>
            </Grid>
            <Grid item xs={2}>
                <Card sx={{ p: 2, m: 1 }}>
                    <Stack>
                        <Typography variant='button' color='gray'>
                            Status
                        </Typography>
                        <Typography>
                            {handleStatus(data.status)}
                        </Typography>
                    </Stack>
                </Card>
            </Grid>
            <Grid item xs={3}>
                <Card sx={{ p: 2, m: 1 }}>
                    <Stack>
                        <Typography variant='button' color='gray'>
                            Note
                        </Typography>
                        <Typography>
                            {data.transactionDescription === "" ? 'none' : data.transactionDescription}
                        </Typography>
                    </Stack>
                </Card>
            </Grid>

            <Grid item xs={12} >
                <Card sx={{ p: 2, m: 1, }}>
                    <Typography variant='h6' >Loan Details</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Stack>
                            <Typography variant='button' color='gray'>
                                Interest
                            </Typography>
                            <Typography>
                                {fRupees(data.interest) ?? 0}
                            </Typography>
                        </Stack>
                        <Stack>
                            <Typography variant='button' color='gray'>
                                Percentage
                            </Typography>
                            <Typography>
                                {data.loanPercentage + '%' ?? 0}
                            </Typography>
                        </Stack>
                        <Stack>
                            <Typography variant='button' color='gray'>
                                Expire Date
                            </Typography>
                            <Typography>
                                {dateFormat(data.loanDate) ?? '-'}
                            </Typography>
                        </Stack>
                        <Stack>
                            <Typography variant='button' color='gray'>
                                Days Left
                            </Typography>
                            <Typography>
                                {formatDistanceDay(data.loanDate) ?? '-'}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid sx={{ display: 'flex', justifyContent: 'end', mt: 2 }}>
                        <Button onClick={() => handleEntry('end', data)} sx={{ mx: 1 }} variant='outlined'>Loan finish</Button>

                    </Grid>
                </Card>
            </Grid >
            {/* <Grid item xs={12}>
                <Card sx={{ p: 2 }}>
                    <Typography variant='h6' sx={{ mt: 2 }}>Transaction Details:</Typography>
                    <Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>

                        <Grid sx={{ my: 2 }}>
                            {titles.map((title, i) => {
                                return (<Typography variant='subtitle2' color='darkgray' sx={{ mt: 1 }} key={i}>{title}:</Typography>)
                            })}
                        </Grid>
                        <Grid sx={{ m: 2 }}>
                            {values.map((value, i) => {
                                return (<Typography variant='subtitle2' sx={{ mt: 1 }} key={i}>{value}</Typography>)
                            })}
                        </Grid>
                    </Grid>
                </Card>
            </Grid> */}


            < Stack sx={{ display: 'flex', alignItems: 'end', flexDirection: 'row' }}>
                <Button onClick={() => handleEntry('edit', data)}>Edit</Button>
                {/* <Button onClick={() => handleEntry('end', data)} sx={{ mx: 1 }} variant='outlined'>Loan finish</Button> */}
                <Button onClick={() => handleEntry('delete', data)} variant='contained' color='error'>Delete</Button>
            </Stack >
        </Grid >
    )
}

export default TransactionDetail