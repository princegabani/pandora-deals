import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
// @mui
import {
    Card,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    TextField,
    Stack,
    Avatar,
    Button,
    MenuItem,
    Container,
    Typography,
    IconButton,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Box,
    Divider,
    Chip,
    Checkbox,
    Drawer,
    FormGroup,
    FormControlLabel,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    Tabs,
    Tab,
} from '@mui/material';

// ✅ 
import moment from 'moment-timezone';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// import PaidTwoToneIcon from '@mui/icons-material/PaidTwoTone';
// import DiamondIcon from '@mui/icons-material/Diamond';
// sections
import { UserListToolbar } from '../sections/@dashboard/user';
// mock
import LIST from '../_mock/user';
import { AppWidgetSummary } from 'src/sections/@dashboard/app';
// import store from 'src/store/store';
import { fRupees } from 'src/utils/formatNumber';
import { DATABASE } from 'src/database';
import { FINANCE } from 'src/database/references';
import store from 'src/store/store';
import { initialTransactionDetail } from 'src/global';
// import Label from '../components/label';
import { calcuLateInterest } from 'src/utils/interestsCount';
// import { Accordion, AccordionDetails, AccordionGroup, AccordionSummary } from '@mui/joy';
// import { SnackbarMessage } from 'src/utils';
import { MaterialUISwitch } from 'src/sections/@dashboard/finance/MaterialUISwitch'
// import { GradientCircularProgress } from 'src/utils/loadingList';
// import { PopularCard } from 'src/sections/@dashboard/finance';
import { dateFormat } from 'src/utils/formatTime';
import TransactionDetail from 'src/sections/@dashboard/finance/TransactionDetail';
import { DatePicker } from '@mui/x-date-pickers';
import { handleTrasactionType } from 'src/sections/@dashboard/finance/Utils';
import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

// const TABLE_HEAD = [
//     { id: 'paidTo', label: 'Paid To', alignRight: false },
//     { id: 'transactionAmount', label: 'Amount', alignRight: false },
//     { id: 'paidBy', label: 'Paid By', alignRight: false },
//     { id: 'transactionDate', label: 'Date', alignRight: false },
//     { id: 'transactionType', label: 'Type', alignRight: false },
//     { id: '' },
// ];

// expense name 
// There are two menus
// MENU1 for fund_debit
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

// expense types
const TYPES = [
    { value: 'Fund_Debit', label: 'Give Fund (Debited from Company)' },
    { value: 'Fund_Credit', label: 'Receive Fund (Credited to Company)' },
    { value: 'Loan_Credit', label: 'Take Loan (Vyaje Lidha)' },
    { value: 'Loan_Debit', label: ' Give Loan (Vyaje Didha)' }
]

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;

}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query, typeFilter) {

    // Step 1: Filter based on typeFilter
    let filteredList = array;
    if (typeFilter && typeFilter.length > 0) {
        filteredList = filteredList.filter((item) => typeFilter.includes(item.transactionDate));
    }

    // Step 2: Filter based on query
    if (query) {
        filteredList = filteredList.filter((_transaction) =>
            Object.keys(_transaction).some((key) =>
                _transaction[key]?.toString().toLowerCase().includes(query.toLowerCase())
            )
        );
    }

    // Step 3: Stabilize and sort the filtered list
    const stabilizedThis = filteredList.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    // Return the sorted list without indices
    return stabilizedThis.map((el) => el[0]);

    // const stabilizedThis = array.map((el, index) => [el, index]);
    // stabilizedThis.sort((a, b) => {
    //     const order = comparator(a[0], b[0]);
    //     if (order !== 0) return order;
    //     return a[1] - b[1];
    // });
    // if (query) {
    //     return filter(filteredList, (_transaction) =>
    //         Object.keys(_transaction).some((key) =>
    //             _transaction[key]?.toString().toLowerCase().includes(query.toLowerCase())
    //         )
    //     );
    // }
    // return stabilizedThis.map((el) => el[0]);


}

const initialWidgets = [
    { id: 'Sell', title: "Sell", total: 0, color: "success" },
    { id: 'Labor', title: "Labor", total: 0, color: "success" },
    { id: 'Salary', title: "Salary", total: 0, color: "warning" },
    { id: 'Labor_Client', title: "Labor_Client", total: 0, color: "warning" },
    { id: 'Machinery', title: "Machinery", total: 0, color: "error" },
    { id: 'Rough', title: "Rough", total: 0, color: "primary" },
]

const handleWidgets = (list) => {
    let admin = []
    const data = initialWidgets.map(widget => {
        const matchingItems = list.filter(item => item.expenseName === widget.id);

        const totalExpense = matchingItems.reduce((sum, item) => sum + Number(item.transactionAmount), 0);
        return { ...widget, total: totalExpense };
    });

    const debitData = list.filter(item => item.transactionType === 'Fund_Debit')
    const creditData = list.filter(item => item.transactionType === 'Fund_Credit')
    const creditLoan = list.filter(item => item.transactionType === 'Loan_Credit')
    const debitLoan = list.filter(item => item.transactionType === 'Loan_Debit')

    const debit = debitData.reduce((sum, item) => sum + Number(item.transactionAmount), 0);
    const credit = creditData.reduce((sum, item) => sum + Number(item.transactionAmount), 0);
    const cLoan = creditLoan.reduce((sum, item) => sum + Number(item.transactionAmount), 0);
    const dLoan = debitLoan.reduce((sum, item) => sum + Number(item.transactionAmount), 0);

    admin.push({ id: 'Total', title: "Company Fund", total: credit - debit, color: "secondary", icon: 'material-symbols:currency-rupee' })
    admin.push({ id: 'Fund_Credit', title: "Fund Credit", total: credit, color: "success" })
    admin.push({ id: 'Fund_Debit', title: "Fund Debit", total: debit, color: "error" })
    admin.push({ id: 'Loan_Credit', title: "Loan Take", total: cLoan, color: "success" })
    admin.push({ id: 'Loan_Debit', title: "Loan Give", total: dLoan, color: "error" })

    return { employee: data, admin }
}

export default function FinancePage() {

    // const reduxData = store.getState()
    const [financeList, setFinanceList] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('transactionDate');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [editDataFlag, setEditDataFlag] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [addFinance, setAddFinance] = useState(initialTransactionDetail)
    console.log('===========', addFinance)
    const [loading, setLoading] = useState(false)
    const redux = store.getState()
    const [selectedType, setSelectedType] = useState([]);
    const [showWidget1, setShowWidget1] = useState(false)
    const [showWidget2, setShowWidget2] = useState(false)
    const [openFilter, setOpenFilter] = useState(false);


    console.log(redux)

    const handleOpenFilter = () => {
        setOpenFilter(true);
    };

    const handleCloseFilter = () => {
        setOpenFilter(false);
    };

    const handleFinanceForm = (e) => {
        const { name, value } = e.target

        // Update paidBy and paidTo based on the selected value
        let updatedAddFinance = { ...addFinance };
        if (name === 'transactionType') {
            if (value === 'Fund_Debit' || value === 'Loan_Debit') {
                updatedAddFinance = { ...updatedAddFinance, paidBy: 'Company', paidTo: '' };
            } else if (value === 'Fund_Credit' || value === 'Loan_Credit') {
                updatedAddFinance = { ...updatedAddFinance, paidTo: 'Company', paidBy: '' };
            }

            if (value === 'Loan_Debit' || value === 'Loan_Credit') {
                updatedAddFinance = { ...updatedAddFinance, expenseName: 'Loan' }
            }
        }

        // Update the main state object
        updatedAddFinance = { ...updatedAddFinance, [name]: value };
        setAddFinance(updatedAddFinance);

    }

    const handleDateChange = (date) => {
        // Convert the selected date to a Unix timestamp
        const timestamp = date ? moment(date).unix() : null;
        return timestamp
    };

    const handleDatePickerDateChange = (newValue) => {
        // (date) => setAddFinance({ ...addFinance, transactionDate: date ? moment(date).unix() : null })

        console.log('Selected date:', newValue);
        const unixTimestamp = newValue ? moment(newValue).unix() : null;
        console.log('Unix timestamp:', unixTimestamp);

        setAddFinance({ ...addFinance, transactionDate: unixTimestamp });
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // const handleClick = (event, name) => {
    //     const selectedIndex = selected.indexOf(name);
    //     let newSelected = [];
    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, name);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    //     }
    //     setSelected(newSelected);
    // };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleTrasactionTypeColor = (type) => {
        if (type === "Loan_Debit") return 'blue'

        else if (type === "Loan_Credit") return 'orange'

        else if (type === "Fund_Debit") return 'red'

        else if (type === "Fund_Credit") return 'green'

    }
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - LIST.length) : 0;

    const filteredList = applySortFilter(financeList, getComparator(order, orderBy), filterName, selectedType);

    const isNotFound = !filteredList.length && !!filterName;

    const widgets = handleWidgets(financeList)

    const handleClickModal = () => {
        setOpenModal(!openModal);
        setEditDataFlag(false)
        setAddFinance(initialTransactionDetail)

    };

    const handleClickSubmit = async () => {
        if (addFinance.transactionAmount === '' ||
            addFinance.payBy === '' ||
            addFinance.transactionType === '') return

        if (editDataFlag) {
            await DATABASE.updateData(FINANCE, addFinance).then(res => {
                // console.log('data edited', res);
            })
        } else {
            await DATABASE.pushData(FINANCE, { ...addFinance, addedByUID: redux.auth.uid }).then(res => {
                // console.log('data added', res);
            })
        }
        setEditDataFlag(!editDataFlag)
        setOpenModal(!openModal);
        setAddFinance(initialTransactionDetail)
        InitView()
    }

    // Calculate 
    // calculateTotalLoanAmount()

    const handleEntry = (type, selectedData) => {
        console.log('handle Entry Called')
        const {
            transactionType,
            expenseName,
            transactionAmount,
            transactionDate,
            transactionDescription,
            paidTo,
            paidBy,
            id,
            loanDate,
            loanPercentage,
            status,
            interest

        } = selectedData

        if (type === 'submit') {

        } else if (type === 'edit') {
            setAddFinance({
                ...addFinance,
                isUpdated: true,
                transactionType: transactionType,
                expenseName: expenseName,
                transactionAmount: transactionAmount,
                transactionDate: transactionDate ?? null,
                transactionDescription: transactionDescription,
                paidTo: paidTo,
                paidBy: paidBy,
                id: id,
                loanDate: loanDate ?? null,
                loanPercentage: loanPercentage,
                status: status,
                interest: interest,
            })
            setEditDataFlag(true)
            setOpenModal(true)

        } else if (type === 'delete') {
            console.log(id)
            DATABASE.deleteData(FINANCE, id).then(ref => {
                // setSnackbar({ message: ref.message, type: ref.success })
            }).catch(err => {
                // setSnackbar({ message: err.message, type: false })
            })
        }

        setRefresh(!refresh)
    }

    const InitView = () => {
        setLoading(true)
        DATABASE.getData(FINANCE).then((ref) => {

            if (ref.success) {
                setFinanceList(ref.data)
                setLoading(false)
                // setSnackbar({ message: 'ref.message', type: 'success' })
            }
        }
        )
    }

    useEffect(() => {
        InitView()
    }, [refresh])



    const handleChange = (event) => {
        const { target: { value, checked }, } = event;

        setSelectedType((prev) =>
            checked ? [...prev, value] : prev.filter((type) => type !== value)
        );
    };

    const handleClearAll = () => {
        setSelectedType([])
        setShowWidget1(false)
        setShowWidget2(false)
    }

    console.log('widgets', showWidget1, widgets)


    const [value, setValue] = useState(0);
    const [data, setData] = useState({})
    const [dateValue, setDateValue] = useState(null)
    console.log(dateValue)

    const handleChanges = (newValue, data) => {
        setValue(newValue);
        setData(data)
    };

    console.log(value)

    function TabPanel(props) {
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
                    // <Card sx={{ p: 3, m: 1 }}>
                    <TransactionDetail data={data} />
                    // </Card>
                )}
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title> Finance | {redux.appData.companyName} </title>
            </Helmet>

            <Container>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                    <Stack >
                        <Typography variant="h4" gutterBottom>
                            Finance
                        </Typography>

                    </Stack>
                    <Button onClick={() => handleClickModal()} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                        New Entry
                    </Button>
                </Stack>

                {/* <FinanceFieldFilter /> */}
                {redux?.appData.appMode.toLowerCase() === 'admin' && <Grid container spacing={1} mb={5} alignItems='end'>
                    {widgets && showWidget1 && widgets.admin.map((data, i) => {
                        return (
                            <Grid key={i} index={i} item xs={12} sm={6} md={2} >
                                <AppWidgetSummary title={data.title} total={data.total} color={data.color} border={data.border} icon={data.icon} />
                            </Grid>
                        )
                    })}
                </Grid>}

                {showWidget2 && <Grid container spacing={1} mb={5}>
                    {widgets && widgets.employee.map((data, i) => {
                        return (
                            <Grid key={i} index={i} item xs={12} sm={6} md={2}>
                                <AppWidgetSummary title={data.title} total={data.total} color={data.color} size='small' />
                            </Grid>
                        )
                    })}
                </Grid>}

                <div>
                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} onClickFilter={handleOpenFilter} />
                    <Box
                        sx={{ flexGrow: 1, display: 'flex', height: '100%', width: '100%', flexDirection: 'row' }}
                    >

                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            // onChange={handleChanges}
                            sx={{ width: '100%', maxWidth: 350, borderRight: 1, borderColor: 'divider', height: 400 }}
                        >
                            {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {

                                const { id, expenseName, transactionAmount, loanDate, transactionDate, loanPercentage, paidTo, paidBy, transactionType } = row;
                                const selectedUser = selected.indexOf(paidTo) !== -1;

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

                        <TabPanel
                            value={value}
                            index={value}
                            data={data}
                            sx={{ display: 'flex', width: '100%' }} />

                    </Box>
                </div>


                {/* <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>

                    {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
                        console.log(row)
                        const { id, expenseName, transactionAmount, loanDate, transactionDate, loanPercentage, paidTo, paidBy, transactionType } = row;
                        const selectedUser = selected.indexOf(paidTo) !== -1;

                        return (
                            <ListItem>
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar alt={''} src={`/assets/images/avatars/avatar_1.jpg`} />
                                    </ListItemAvatar>
                                    <ListItemText primary={paidTo === 'Company' ? paidBy : paidTo} secondary={transactionDate} />
                                    {/* <ListItemText primary={transactionAmount} secondary={transactionDate} /> 
                                        <Typography variant="button" color={handleTrasactionTypeColor(transactionType)} noWrap >
                                            {fRupees(transactionAmount)}</Typography>
                                    </ListItemButton>
                                </ListItem >
                                                )
                        })}

                </List > */}

                {/* Table start from here */}
                {/* <Card>
                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} onClickFilter={handleOpenFilter} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={LIST.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>

                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={TABLE_HEAD.length} align="center">
                                                <GradientCircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredList.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={TABLE_HEAD.length} align="center">
                                                <Typography variant="body2">No data found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
                                            console.log(row)
                                            const { id, expenseName, transactionAmount, loanDate, transactionDate, loanPercentage, paidTo, paidBy, transactionType } = row;
                                            const selectedUser = selected.indexOf(paidTo) !== -1;

                                            return (
                                                <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>


                                                    <TableCell component="th" scope="row" >
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Avatar alt={paidTo} src={`/assets/images/avatars/avatar_${i + 1}.jpg`} />
                                                            <Typography variant="button" noWrap>
                                                                {paidTo}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Typography variant="button" color={transactionType.includes('Credit') ? 'green' : 'red'} noWrap >
                                                            {fRupees(transactionAmount)}</Typography>
                                                        {!transactionType.includes('Loan') && <Typography color='grey'>{expenseName}</Typography>}
                                                        {transactionType.includes('Loan') &&
                                                            <div>
                                                                <Label>Int: {calcuLateInterest(transactionAmount, loanPercentage, transactionDate, loanDate)} || {loanPercentage}%</Label>
                                                            </div>}
                                                    </TableCell>
                                                    <TableCell align="left">{paidBy}</TableCell>
                                                    <TableCell align="left">
                                                        <Typography> {moment.unix(transactionDate).format('DD-MM-YYYY')}</Typography>
                                                        {transactionType.includes('Loan') &&
                                                            <div>
                                                                <Label variant='filled'>
                                                                    {moment.unix(loanDate).diff(new Date(), 'days')} Days Left
                                                                </Label>
                                                                <Typography>
                                                                    {moment.unix(loanDate).format('DD-MM-YYYY')}
                                                                </Typography>
                                                            </div>
                                                        }
                                                    </TableCell>
                                                    <TableCell align="left" >
                                                        <Typography variant="button" color={handleTrasactionTypeColor(transactionType)} noWrap >
                                                            {transactionType}
                                                        </Typography>
                                                    </TableCell>


                                                    <TableCell align="left" >
                                                        <IconButton align="center" onClick={() => handleEntry('edit', row)}>
                                                            <Iconify icon={'eva:edit-fill'} />
                                                        </IconButton>

                                                        <IconButton sx={{ color: 'error.main' }} onClick={() => handleEntry('delete', row)}>
                                                            <Iconify icon={'eva:trash-2-outline'} />
                                                        </IconButton>

                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}

                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        Not found
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        No results found for &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br /> Try checking for typos or using complete words.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>


                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card> */}

            </Container >

            {/* Dialog box start from here */}
            < Dialog open={openModal} onClose={handleClickModal} >
                <DialogTitle>{editDataFlag ? 'Edit' : 'New'} Finance</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ marginBottom: 2 }}>
                        Add finance of the company
                    </DialogContentText>

                    <TextField
                        margin="dense"
                        id="Amount"
                        name='transactionAmount'
                        label="Amount ( ₹ )"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={addFinance.transactionAmount}
                        onChange={(e) => handleFinanceForm(e)}
                    />
                    {/* 
                    <Box sx={{
                        bgcolor: (theme) => theme.palette['primary'].lighter,
                        boxShadow: 1,
                        borderRadius: 2,
                        p: 2
                    }}> */}


                    <FormControl sx={{ minWidth: 120, width: '100%', marginTop: 1 }}>
                        <InputLabel id="demo-simple-select-label">Transaction Type</InputLabel>
                        <Select
                            // labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label='Transaction Type'
                            name='transactionType'
                            value={addFinance.transactionType ?? ''}
                            onChange={(e) => handleFinanceForm(e)}
                            inputProps={{ 'aria-label': 'Without label', 'variant': 'outlined' }}
                            variant='outlined'
                        >
                            {TYPES.map((data, i) => {
                                return (<MenuItem key={i} value={data.value}>{data.label} </MenuItem>)
                            })}
                        </Select>
                    </FormControl>

                    {addFinance.transactionType !== '' && !addFinance.transactionType.includes('Loan') &&
                        <FormControl sx={{ minWidth: 120, width: '100%', marginTop: 1 }}>
                            <InputLabel id="demo-simple-select-label">Expense Name</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label='Expense Name'
                                style={{ color: 'black' }}
                                name='expenseName'
                                value={addFinance.expenseName ?? ''}
                                onChange={(e) => handleFinanceForm(e)}
                                inputProps={{ 'aria-label': 'Without label', 'variant': 'outlined' }}
                                variant='outlined'
                            >

                                {addFinance.transactionType === 'Fund_Debit' ?
                                    MENU1.map((data, i) => {
                                        return (<MenuItem key={i} value={data.value}>{data.value} </MenuItem>)
                                    })
                                    : MENU2.map((data, i) => {
                                        return (<MenuItem key={i} value={data.value}>{data.value} </MenuItem>)
                                    })}
                            </Select>
                        </FormControl>
                    }

                    {addFinance.transactionType !== '' && addFinance.transactionType.includes('Loan') &&
                        <Box
                        // component="form"
                        // sx={{
                        //     '& > :not(style)': {
                        //         marginY: 1, width: '25ch', display: 'inline-list-item'
                        //     },
                        // }}
                        >
                            <Divider sx={{ m: 2 }}><Chip label='Loan Details'></Chip></Divider>
                            <TextField
                                margin="dense"
                                id="name"
                                name='loanPercentage'
                                label="Loan Percentage"
                                type="number"
                                fullWidth
                                variant="outlined"
                                value={addFinance.loanPercentage}
                                onChange={(e) => handleFinanceForm(e)}
                            />

                            <Typography variant='button' color='error'>Term: {addFinance.loanDate ? moment.unix(addFinance.loanDate).diff(new Date(), 'days') : 0} Days</Typography>

                            <LocalizationProvider dateAdapter={AdapterMoment} >

                                {/* 
                                moment(addFinance.loanDate).unix()
                                moment.unix(addFinance.loanDate).utc() */}

                                <DemoContainer components={['DateTimePicker', 'DateRangePicker']}>
                                    <DateTimePicker
                                        label="Loan Due Date"
                                        defaultValue={moment(new Date())}
                                        value={addFinance.loanDate !== null ? moment.unix(addFinance.loanDate).utc() : null}
                                        onChange={(date) => setAddFinance({ ...addFinance, loanDate: handleDateChange(date), interest: calcuLateInterest(addFinance.transactionAmount, addFinance.loanPercentage, addFinance.transactionDate, handleDateChange(date)) })}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            {console.log('addFinance', addFinance)}
                            <TextField
                                disabled
                                margin="dense"
                                id="name"
                                name='interest'
                                label="Interest"
                                fullWidth
                                variant="outlined"
                                value={addFinance.interest}
                                onChange={(e) => handleFinanceForm(e)}
                            />

                        </Box>
                    }

                    <Divider sx={{ m: 2 }}><Chip label='Who Owes?'></Chip></Divider>

                    <TextField
                        margin="dense"
                        id="name"
                        name='paidBy'
                        label="Paid By"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={addFinance.paidBy}
                        onChange={(e) => handleFinanceForm(e)}
                    />

                    <TextField
                        margin="dense"
                        id="name"
                        name='paidTo'
                        label="Paid To"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={addFinance.paidTo}
                        onChange={(e) => handleFinanceForm(e)}
                    />

                    <LocalizationProvider dateAdapter={AdapterMoment} >
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                label="Transaction Date"
                                value={addFinance.transactionDate !== null ? moment.unix(addFinance.transactionDate) : null}
                                onChange={handleDatePickerDateChange} />
                        </DemoContainer>
                    </LocalizationProvider>

                    {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                value={addFinance.transactionDate}
                                onChange={(newValue) => setAddFinance({ ...addFinance, transactionDate: newValue })} />
                        </DemoContainer>
                    </LocalizationProvider> */}

                    <TextField
                        margin="dense"
                        id="Description"
                        name='transactionDescription'
                        label="Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={addFinance.transactionDescription}
                        onChange={(e) => handleFinanceForm(e)}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickModal}>Cancel</Button>
                    <Button onClick={handleClickSubmit}>Save</Button>
                </DialogActions>
            </Dialog >

            {/* Drawer start from here   */}
            < Drawer
                anchor="right"
                open={openFilter}
                onClose={handleCloseFilter}
                PaperProps={{
                    sx: { width: 280, border: 'none', overflow: 'hidden' },
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        Filters
                    </Typography>
                    <IconButton onClick={handleCloseFilter}>
                        <Iconify icon="eva:close-fill" />
                    </IconButton>
                </Stack>

                <Divider />

                <Scrollbar>
                    <Stack spacing={3} sx={{ p: 3 }}>
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Select Types
                            </Typography>
                            <FormGroup >
                                {TYPES.map(({ value, label }) => (
                                    <FormControlLabel
                                        key={value}
                                        control={
                                            <Checkbox
                                                checked={selectedType.indexOf(value) > -1}
                                                onChange={handleChange}
                                                value={value}
                                                name={label} />}
                                        label={value} />
                                ))}
                            </FormGroup>
                        </div>
                        <Divider />
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Select Widgets
                            </Typography>
                            <FormGroup >
                                <FormControlLabel
                                    sx={{ mt: 2 }}
                                    control={
                                        <MaterialUISwitch
                                            checked={showWidget1}
                                            onChange={() => setShowWidget1(!showWidget1)} />}
                                    label='Finance Widget 1'
                                />
                                <FormControlLabel
                                    sx={{ mt: 2 }}
                                    control={
                                        <MaterialUISwitch
                                            checked={showWidget2}
                                            onChange={() => setShowWidget2(!showWidget2)} />}
                                    label='Finance Widget 2'
                                />
                            </FormGroup>

                            {/* <FormGroup >
                                {showWidget.map((data, i) => {
                                    return <FormControlLabel
                                        key={i}
                                        control={
                                            <MaterialUISwitch
                                                checked={data.checked}
                                                onChange={(e) => handleCheckFilter(e, i)}
                                                name={data.name}
                                                value={data.value} />}
                                        label={data.value}
                                    />
                                })}
                            </FormGroup> */}
                        </div>

                        <Divider />
                    </Stack>
                </Scrollbar>

                <Box sx={{ p: 3 }}>
                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        color="inherit"
                        variant="outlined"
                        startIcon={<Iconify icon="ic:round-clear-all" />}
                        onClick={handleClearAll}
                    >
                        Clear All
                    </Button>
                </Box>
            </Drawer >
        </>
    );
}