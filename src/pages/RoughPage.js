import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// import { filter } from 'lodash';
import { useState } from 'react';
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Collapse,
    Box,
    TablePagination,
    InputAdornment,
    OutlinedInput,
    FormControl,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import store from 'src/store/store';

// Date initialize
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// Database
import { DATABASE } from 'src/database';
import { ROUGH } from 'src/database/references';
import converter from 'currency-exchanger-js'
// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'arrow', label: '' },
    { id: 'roughName', label: 'Rough Name', alignRight: false },
    { id: 'weight', label: 'Weight', alignRight: false },
    { id: 'amount', label: 'Amount', alignRight: false },
    { id: 'polishWeight', label: 'Polish Weight', alignRight: false },
    { id: 'date', label: 'Buying Date', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '' },
];

// const dialogInputs = [
//     { id: "kapanName", name: "kapanName", label: "Kapan Name", type: "text" },
//     { id: "lotNumber", name: "lotNumber", label: "Lot Number", type: "text" },
//     { id: "totalCarat", name: "totalCarat", label: "Total Weight(carat)", type: "number" },
//     { id: "buyingDate", name: "buyingDate", label: "Buying Date", type: "date" },
//     { id: "amount", name: "amount", label: "Amount($)", type: "number" },
// ]

const initialRoughData = {
    id: '',
    roughName: '',
    weight: 0,
    amount: 0,
    date: dayjs(new Date()),
    polishWeight: 0,
    status: 0,
    kapan: []
    //     {
    //         id: 1,
    //         kapanNumber: 11,
    //         weight: 250,
    //         createdDate: '2020-01-05',
    //         amount: 3,
    //         polishWeight: 89
    //     },
    //     {
    //         id: 2,
    //         kapanNumber: 12,
    //         createdDate: '2020-01-02',
    //         weight: 250,
    //         amount: 1,
    //         polishWeight: 98
    //     },
    // ],
}

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

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {

        query = query.toLowerCase();

        return array.filter(item => {
            return Object.values(item).some(value =>
                value.toString().toLowerCase().includes(query)
            );
        });
        // return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}



export default function RoughPage() {
    const [KAPANLIST, setKAPANLIST] = useState([])
    // const [open, setOpen] = useState(null);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDialog, setOpenDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [editDataFlag, setEditDataFlag] = useState(false)
    const [addRoughData, setAddRoughData] = useState(initialRoughData)
    const reduxData = store.getState()

    // const handleOpenMenu = (event, id) => {
    //     setOpen(event.currentTarget);
    //     console.log(id)
    // };

    // const handleCloseMenu = () => {
    //     setOpen(null);
    // };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = KAPANLIST.map((n) => n.kapanName);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    console.log(order, orderBy)
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    // const applyFilter = (array, query) => {
    //     if (query) {
    //         return array.filter(item =>
    //             item.kapanName?.toLowerCase().includes(query?.toLowerCase())
    //         )
    //     }
    //     return array
    // }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - KAPANLIST.length) : 0;

    const filteredList = applySortFilter(KAPANLIST, getComparator(order, orderBy), filterName);

    // const filteredList = applyFilter(KAPANLIST, filterName)

    const isNotFound = !filteredList.length && !!filterName;

    const handleMenu = (type, selected) => {
        const { roughName, weight, amount, date, polishWeight, id } = selected

        if (type === 'edit') {
            console.log('edit')

            setEditDataFlag(true)
            console.log(editDataFlag);
            setAddRoughData({
                ...addRoughData,
                roughName, weight, amount, date: dayjs(new Date(date)), polishWeight
            })
            setOpenDialog(true)

        } else if (type === 'delete') {
            console.log('delete')

            DATABASE.deleteData(ROUGH, id).then(ref => {
                // setSnackbar({ message: ref.message, type: ref.success })
            }).catch(err => {
                // setSnackbar({ message: err.message, type: false })
            })
        }
    }

    const handleDialogForm = (e) => {
        setAddRoughData({
            ...addRoughData,
            [e.target.name]: e.target.value
        })
    }

    const handleClickModal = () => {
        setOpenDialog(!openDialog)
    }

    const handleClickSubmit = async (e) => {
        const { roughName, weight, amount, date, polishWeight } = addRoughData
        if (roughName === '' || weight === '' || amount === '' || date === '' || polishWeight === '') return

        const time = new Date(addRoughData.date.$d).getTime()
        if (editDataFlag) {
            await DATABASE.updateData(ROUGH, addRoughData).then(res => {
                // console.log('data edited', res);
            })
        } else {
            await DATABASE.pushData(ROUGH, { ...addRoughData, date: time }).then(res => {
                // console.log('data added', res);
            })
        }
        setEditDataFlag(false)
        setAddRoughData(initialRoughData)
        setOpenDialog(false);
        initView()
    }

    const initView = async () => {
        setIsLoading(true)
        // const getKapanData = [
        //     {
        //         id: '123',
        //         roughName: 'Zimba',
        //         weight: 500,
        //         amount: 10000,
        //         date: '2020-01-02',
        //         polishWeight: 180,
        //         status: 2,
        //         kapan: [
        //             {
        //                 id: 1,
        //                 kapanNumber: 11,
        //                 weight: 250,
        //                 createdDate: '2020-01-05',
        //                 amount: 3,
        //                 polishWeight: 89
        //             },
        //             {
        //                 id: 2,
        //                 kapanNumber: 12,
        //                 createdDate: '2020-01-02',
        //                 weight: 250,
        //                 amount: 1,
        //                 polishWeight: 98
        //             },
        //         ],
        //     },
        //     {
        //         id: '234',
        //         roughName: 'Lal',
        //         weight: 500,
        //         amount: 15000,
        //         date: '2020-01-03',
        //         status: 1,
        //         polishWeight: 180,
        //         kapan: [
        //             {
        //                 id: 1,
        //                 kapanNumber: 13,
        //                 weight: 150,
        //                 createdDate: '2020-01-05',
        //                 polishWeight: 89
        //             },
        //             {
        //                 id: 2,
        //                 kapanNumber: 14,
        //                 createdDate: '2020-01-02',
        //                 weight: 100,
        //                 polishWeight: 98
        //             }, {

        //                 id: 3,
        //                 kapanNumber: 15,
        //                 weight: 120,
        //                 createdDate: '2020-01-05',
        //                 polishWeight: 89
        //             },
        //             {
        //                 id: 4,
        //                 kapanNumber: 16,
        //                 createdDate: '2020-01-02',
        //                 weight: 130,
        //                 polishWeight: 98
        //             },
        //         ],
        //     }];
        await DATABASE.getData(ROUGH).then((ref) => {

            if (ref.success) {

                setKAPANLIST(ref.data)
                // setKAPANLIST([...ref.data, ...getKapanData])
                setIsLoading(false)
                // setSnackbar({ message: 'ref.message', type: 'success' })
            }
        })
        setIsLoading(false)
    }

    const convertRate = async () => {

        return await converter.convertOnDate(1, "usd", "inr", new Date()).then((res) => {
            console.log(res);
            return res
        });

    };


    useEffect(() => {
        initView()
        const rate = convertRate()
        console.log('rate', rate);
    }, [])

    const Row = (props) => {

        console.log(props)
        const { row } = props;
        const [open, setOpen] = React.useState(false);


        const polishWeight = row.kapan ? row.kapan.reduce((sum, item) => sum + Number(item.polishWeight), 0) : 0;

        const [kapanValue, setKapanValue] = useState({
            kapanNumber: '',
            weight: '',
            pieces: '',
            createdDate: ''
        })

        console.log(kapanValue)
        const onChangeKapanVal = (e) => {
            setKapanValue({
                ...kapanValue,
                [e.target.name]: e.target.value
            })
        }

        const addKapan = async (row) => {

            await DATABASE.updateData(ROUGH, kapanValue).then(res => {
                console.log(res)
            })

        }



        return (
            <React.Fragment>
                <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => setOpen(!open)}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"

                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row"  >
                        <Typography variant="button" noWrap>
                            {row.roughName}
                        </Typography>
                    </TableCell>
                    <TableCell align="left">{row.weight} ct</TableCell>
                    <TableCell align="left">Rs. {row.amount}</TableCell>
                    <TableCell align="left">{polishWeight} ct</TableCell>
                    <TableCell align="left">{row.date}</TableCell>
                    <TableCell align="left">
                        <Label color={row.status !== 2 ? row.status === 1 ? 'warning' : 'error' : 'success'}>
                            {row.status !== 2 ? row.status === 1 ? 'Running' : 'Pending' : 'Ready To Sell'}
                        </Label>
                    </TableCell>
                    <TableCell align="right" sx={{ position: 'sticky', right: 0, zIndex: 1, display: 'flex', flexDirection: 'row', backgroundColor: '#fff', height: '100%' }}>

                        <IconButton align="center" onClick={() => handleMenu('edit', row)}>
                            <Iconify icon={'eva:edit-fill'} />

                        </IconButton>

                        <IconButton sx={{ color: 'error.main' }} onClick={() => handleMenu('delete', row)}>
                            <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>

                    </TableCell>

                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                {/* <Typography variant="h6" gutterBottom component="div">
                                Kapan
                            </Typography> */}
                                <Table size="small" aria-label="purchases">
                                    <thead>
                                        <TableRow>
                                            <th align="center">Kapan Number</th>
                                            <th align="center">Weight</th>
                                            <th align="center">Polish Weight</th>
                                            <th align="center">Created Date</th>
                                        </TableRow>
                                    </thead>
                                    <TableBody>

                                        {row.kapan && row.kapan.map((kapan, i) => (
                                            <TableRow key={i}>
                                                <TableCell align="center" component="th" scope="row" >
                                                    {kapan.kapanNumber}
                                                </TableCell>
                                                <TableCell align="center">{kapan.weight}</TableCell>
                                                <TableCell align="center"> {kapan.pieces}</TableCell>
                                                <TableCell align="center">{kapan.createdDate}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow >
                                            <td>
                                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                                    <OutlinedInput
                                                        id="outlined-adornment-weight"
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'weight',
                                                        }}
                                                        name='kapanNumber'
                                                        type='number'
                                                        value={kapanValue.kapanNumber}
                                                        onChange={(e) => onChangeKapanVal(e)}
                                                    />
                                                </FormControl>
                                            </td>
                                            <td>
                                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                                    <OutlinedInput
                                                        id="outlined-adornment-weight"
                                                        endAdornment={<InputAdornment position="end">ct</InputAdornment>}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'weight',
                                                        }}
                                                        name='weight'
                                                        type='number'
                                                        value={kapanValue.weight}
                                                        onChange={(e) => onChangeKapanVal(e)}
                                                    />
                                                </FormControl>

                                            </td>
                                            <td>
                                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                                    <OutlinedInput
                                                        id="outlined-adornment-weight"
                                                        endAdornment={<InputAdornment position="end">ct</InputAdornment>}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'weight',
                                                        }}
                                                        name='pieces'
                                                        type='number'
                                                        value={kapanValue.pieces}
                                                        onChange={(e) => onChangeKapanVal(e)}
                                                    />
                                                </FormControl>
                                            </td>
                                            <td>
                                                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" disabled>
                                                    <OutlinedInput
                                                        id="outlined-adornment-weight"
                                                        aria-describedby="outlined-weight-helper-text"
                                                        name='createdDate'
                                                        type='text'
                                                        value={kapanValue.createdDate === '' ? new Date() : kapanValue.createdDate}
                                                    />
                                                </FormControl>

                                            </td>

                                            <td>
                                                <IconButton sx={{ color: 'info' }} onClick={() => addKapan(row)}>
                                                    <Iconify icon={'eva:plus-outline'} />
                                                </IconButton>
                                            </td>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment >
        );
    }


    return (
        <>
            <Helmet>
                <title> Rough | {reduxData?.appData?.companyName} </title>
            </Helmet>
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Rough
                    </Typography>
                    {reduxData?.appData?.appMode.toLowerCase() === 'admin' ? (
                        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setOpenDialog(true)}>
                            New Rough
                        </Button>
                    ) : (
                        <></>
                    )}

                </Stack>

                <Card>
                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        {!isLoading && <div style={{ padding: '20px' }}>
                            <TableContainer sx={{ minWidth: 800 }}>
                                <Table>
                                    <UserListHead
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={KAPANLIST.length}
                                        numSelected={selected.length}
                                        onRequestSort={handleRequestSort}
                                        onSelectAllClick={handleSelectAllClick}
                                    />
                                    <TableBody>
                                        {filteredList.map((row, i) => (
                                            <Row key={i} row={row} />
                                        ))}
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
                        </div>}
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
                </Card>
            </Container>

            <Dialog open={openDialog} onClose={handleClickModal}>
                <DialogTitle>{editDataFlag ? 'Edit' : 'New'} Rough</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ marginBottom: 2 }}>
                        Rough Detail
                    </DialogContentText>

                    <TextField
                        margin="dense"
                        id="roughName"
                        name='roughName'
                        label="Rough Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={addRoughData.roughName}
                        onChange={(e) => handleDialogForm(e)}
                    />

                    <TextField
                        margin="dense"
                        id="weight"
                        name='weight'
                        label="Total Weight (ct)"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={addRoughData.weight}
                        onChange={(e) => handleDialogForm(e)}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
                            <DateTimePicker
                                label="Purchase Date"
                                defaultValue={dayjs(new Date())}
                                value={addRoughData.expenseDate}
                                onChange={(date) => setAddRoughData({ ...addRoughData, date: date })} />
                        </DemoContainer>
                    </LocalizationProvider>

                    <DialogContentText sx={{ marginBottom: 2, marginTop: 2 }}>
                        Finance Detail
                    </DialogContentText>


                    <TextField
                        margin="dense"
                        id="Amount"
                        name='amount'
                        label="Amount ( $-USD )"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={addRoughData.amount}
                        onChange={(e) => handleDialogForm(e)}
                    />



                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickModal}>Cancel</Button>
                    <Button onClick={handleClickSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
