import { Grid, Button, Container, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography, DialogContentText, FormControl, InputLabel, Select, MenuItem, Divider, Chip, DialogActions, Card, Tabs, ListItemButton, ListItem, Tab, Box, ListItemAvatar, Avatar, ListItemText } from '@mui/material';

// ✅ 
import moment from 'moment-timezone';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// 
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async';
import { FormControls } from 'src/components/formControl';
import Iconify from 'src/components/iconify';
import { initialTransactionDetail } from 'src/global';
import { calcuLateInterest } from 'src/utils/interestsCount';
import { DatePicker } from '@mui/x-date-pickers';
import Logo from 'src/components/logo';
import TransactionDetail from 'src/sections/@dashboard/finance/TransactionDetail';
import { handleTrasactionType } from 'src/sections/@dashboard/finance/Utils';
import { fRupees } from 'src/utils/formatNumber';
import { dateFormat } from 'src/utils/formatTime';


const TYPES = [
    { value: 'Fund_Debit', label: 'Debit' },
    { value: 'Fund_Credit', label: 'Credit' },
    { value: 'Loan_Credit', label: 'Take Loan' },
    { value: 'Loan_Debit', label: ' Give Loan' }
]

const MENU1 = [
    { value: 'Machinery' },
    { value: 'Salary' },
    { value: 'Labor_Client' },
    { value: 'Rough' },
    { value: 'Other' },
]

// MENU2 for fund_credit
const MENU2 = [
    { value: 'Sell' },
    { value: 'Labor' },
    { value: 'Other' },
]

function TransactionPage() {


    // Define all useStates
    const [AddTransaction, setAddTransaction] = useState(initialTransactionDetail)
    const [OpenDialog, setOpenDialog] = useState(false)

    // Dialog Function
    const onClickNewTransaction = () => {
        setOpenDialog(true)
    }

    // Set data to add transaction object from form when open dialog and edit
    const handleTransactionFormEntry = (e) => {
        const { name, value } = e?.target

        // Update paidBy and paidTo based on the selected value
        let updatedAddTransaction = { ...AddTransaction };
        if (name === 'transactionType') {
            if (value === 'Fund_Debit' || value === 'Loan_Debit') {
                updatedAddTransaction = { ...updatedAddTransaction, paidBy: 'Company', paidTo: '' };
            } else if (value === 'Fund_Credit' || value === 'Loan_Credit') {
                updatedAddTransaction = { ...updatedAddTransaction, paidTo: 'Company', paidBy: '' };
            }

            if (value === 'Loan_Debit' || value === 'Loan_Credit') {
                updatedAddTransaction = { ...updatedAddTransaction, expenseName: 'Loan' }
            }
        }

        // Update Interest
        if (AddTransaction.transactionAmount &&
            AddTransaction.loanPercentage &&
            AddTransaction.transactionDate) {
            updatedAddTransaction = {
                ...updatedAddTransaction, interest: calcuLateInterest(
                    AddTransaction.transactionAmount,
                    AddTransaction.loanPercentage,
                    AddTransaction.transactionDate,
                    AddTransaction.loanDate)
            }
        }

        // Update the main state object
        updatedAddTransaction = { ...updatedAddTransaction, [name]: value };
        setAddTransaction(updatedAddTransaction);
    }


    const handleDatePickerDateChange = (newValue) => {
        // (date) => setAddFinance({ ...addFinance, transactionDate: date ? moment(date).unix() : null })

        const unixTimestamp = newValue ? moment(newValue).unix() : null;
        setAddTransaction({
            ...AddTransaction,
            transactionDate: unixTimestamp,
            interest: calcuLateInterest(AddTransaction.transactionAmount,
                AddTransaction.loanPercentage,
                unixTimestamp,
                AddTransaction.loanDate)
        });
    }

    const handleDialog = () => {
        setOpenDialog(!OpenDialog);
        // setEditDataFlag(false)
        setAddTransaction(initialTransactionDetail)
    }

    const onSubmit = () => { }

    console.log(AddTransaction, 'AddTransaction');

    // Tabs


    const [value, setValue] = useState(0);
    const [data, setData] = useState({})
    const [dateValue, setDateValue] = useState(null)
    console.log(dateValue)

    const handleChanges = (newValue, data) => {
        setValue(newValue);
        setData(data)
    };

    const filteredList = []
    const TabPanel = (props) => {
        const { children, value, index, data, ...other } = props;
        return (Object.keys(data).length === 0 ?
            <Box
                sx={{ display: 'flex', height: '100%', width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
            >
                <Logo />
            </Box>
            :
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
                style={{ width: '-webkit-fill-available' }}
            >
                {value === index && (
                    <Card sx={{ p: 3, m: 1 }}>
                        <TransactionDetail data={data} />
                    </Card>
                )}
            </div>
        );
    }
    return (
        <>
            <Helmet>
                <title> Transaction |  </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Stack>
                        <Typography variant="h4" gutterBottom>
                            Transactions
                        </Typography>

                    </Stack>
                    <Button onClick={() => onClickNewTransaction()} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                        New Transaction
                    </Button>
                </Stack>
                {/* <div>
                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} onClickFilter={handleOpenFilter} />

                    <Box
                        sx={{ flexGrow: 1, display: 'flex', height: '100%', width: '100%', flexDirection: 'row' }}
                    >

                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={handleChanges}
                            sx={{ width: '100%', maxWidth: 350, borderRight: 1, borderColor: 'divider', height: 400 }}
                        >
                            {filteredList.map((row, i) => {

                                const { id, expenseName, transactionAmount, loanDate, transactionDate, loanPercentage, paidTo, paidBy, transactionType } = row;
                                // const selectedUser = selected.indexOf(paidTo) !== -1;

                                return (

                                    <Tab
                                        onClick={() => handleChanges(i, row)}
                                        key={i}
                                        sx={{ width: '100%' }}
                                        label={
                                            <Card sx={{ m: 0 }}>
                                                <ListItemButton>
                                                    <ListItem sx={{}}>
                                                        <ListItemAvatar>
                                                            <Avatar alt={''} src={`/assets/images/avatars/avatar_${i + 1}.jpg`} />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={paidTo === 'Company' ? paidBy : paidTo}
                                                            secondary={dateFormat(transactionDate)} />
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="button" color={handleTrasactionType(transactionType).color} noWrap >
                                                                    {fRupees(transactionAmount)}
                                                                </Typography>}
                                                            secondary={transactionType}
                                                            sx={{ ml: 3 }} />
                                                    </ListItem>
                                                </ListItemButton>
                                            </Card>

                                        } />
                                )
                            })}
                        </Tabs>

                        <TabPanel value={value} index={value} data={data} sx={{ display: 'flex', width: '100%' }} />

                    </Box>
                </div> */}

                <Card>
                    {filteredList.map((row, i) => {

                        const { id, expenseName, transactionAmount, loanDate, transactionDate, loanPercentage, paidTo, paidBy, transactionType } = row;
                        // const selectedUser = selected.indexOf(paidTo) !== -1;

                        return (

                            <Tab
                                onClick={() => handleChanges(i, row)}
                                key={i}
                                sx={{ width: '100%' }}
                                label={
                                    <Card sx={{ m: 0 }}>
                                        <ListItemButton>
                                            <ListItem sx={{}}>
                                                <ListItemAvatar>
                                                    <Avatar alt={''} src={`/assets/images/avatars/avatar_${i + 1}.jpg`} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={paidTo === 'Company' ? paidBy : paidTo}
                                                    secondary={dateFormat(transactionDate)} />
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="button" color={handleTrasactionType(transactionType).color} noWrap >
                                                            {fRupees(transactionAmount)}
                                                        </Typography>}
                                                    secondary={transactionType}
                                                    sx={{ ml: 3 }} />
                                            </ListItem>
                                        </ListItemButton>
                                    </Card>

                                } />
                        )
                    })}
                </Card>
            </Container>

            <Dialog fullWidth open={OpenDialog} onClose={handleDialog}>
                <DialogTitle sx={{ p: 5, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>Add Transaction</DialogTitle>
                <DialogContent sx={{ p: 9 }}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={6}>
                            <FormControls.Select
                                menuList={TYPES}
                                name='transactionType'
                                label='Transaction Type'
                                value={AddTransaction.transactionType ?? ''}
                                onChange={(e) => handleTransactionFormEntry(e)} />
                        </Grid>
                        <Grid item xs={6}>
                            {!AddTransaction.transactionType.includes('Loan') &&
                                <FormControls.Select
                                    menuList={AddTransaction.transactionType === 'Fund_Debit' ? MENU1 : MENU2}
                                    name='expenseName'
                                    label="Expense Name"
                                    value={AddTransaction.expenseName}
                                    onChange={(e) => handleTransactionFormEntry(e)}
                                />}
                        </Grid>
                        <Grid item xs={4}>
                            <FormControls.Input
                                name='transactionAmount'
                                label='Amount ( ₹ )'
                                value={AddTransaction.transactionAmount ?? ''}
                                onChange={(e) => handleTransactionFormEntry(e)} />
                        </Grid>
                        <Grid item xs={4}>
                            <FormControls.Input
                                name='paidBy'
                                label="Paid By"
                                value={AddTransaction.paidBy}
                                onChange={(e) => handleTransactionFormEntry(e)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <FormControls.Input
                                name='paidTo'
                                label="Paid To"
                                value={AddTransaction.paidTo}
                                onChange={(e) => handleTransactionFormEntry(e)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterMoment} >
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker
                                        label="Transaction Date"
                                        value={AddTransaction.transactionDate !== null ? moment.unix(AddTransaction.transactionDate) : null}
                                        onChange={handleDatePickerDateChange} />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControls.Input
                                name='transactionDescription'
                                label="Description"
                                value={AddTransaction.transactionDescription}
                                onChange={(e) => handleTransactionFormEntry(e)}
                            />
                        </Grid>

                        {/* Visible if Loan transaction */}
                        {AddTransaction.transactionType !== '' && AddTransaction.transactionType.includes('Loan') &&
                            <>
                                <Grid item xs={12}>
                                    <Divider sx={{ m: 2 }}><Chip label='Loan Details'></Chip></Divider>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControls.Input
                                        name='loanPercentage'
                                        label="Loan Percentage"
                                        type="number"
                                        value={AddTransaction.loanPercentage}
                                        onChange={(e) => handleTransactionFormEntry(e)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControls.Input
                                        disabled
                                        name='interest'
                                        label="Interest"
                                        value={AddTransaction.interest}
                                        onChange={(e) => handleTransactionFormEntry(e)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterMoment} >
                                        <DemoContainer components={['DatePicker']}>
                                            <DatePicker
                                                label="Loan Due Date"
                                                defaultValue={moment(new Date())}
                                                value={AddTransaction.loanDate !== null ? moment.unix(AddTransaction.loanDate).utc() : null}
                                                onChange={
                                                    (date) => setAddTransaction(
                                                        {
                                                            ...AddTransaction,
                                                            loanDate: date ? moment(date).unix() : null,
                                                            interest: calcuLateInterest(AddTransaction.transactionAmount,
                                                                AddTransaction.loanPercentage, AddTransaction.transactionDate,
                                                                date ? moment(date).unix() : null)
                                                        })}
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant='button' color='error'>
                                        Term: {AddTransaction.loanDate ? moment.unix(AddTransaction.loanDate).diff(new Date(), 'days') : 0} Days
                                    </Typography>
                                </Grid>

                            </>
                        }
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ pb: 5, justifyContent: 'center', display: 'flex' }}>
                    <Button onClick={handleDialog}>Cancel</Button>
                    <Button variant='contained' onClick={onSubmit}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default TransactionPage