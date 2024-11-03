import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// @mui
import {
    Card,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    // DialogContentText,
    TextField,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    // Popover,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    InputLabel,
    Select,
    TablePagination,
    FormControl,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
// import employeeList from '../_mock/user';
import { ACCESS_EMPLOYEE } from 'src/database/component/dashboard/Employee';
import store from 'src/store/store';
import { AUTH, DATABASE } from 'src/database';
import { EMPLOYEE } from 'src/database/references';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'phone', label: 'Phone', alignRight: false },
    { id: 'department', label: 'Department', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'aadhar', label: 'Aadhar', alignRight: false },
    { id: 'isAccess', label: 'Access Portal', alignRight: false },
    { id: '' },
];

const DEPARTMENT = [
    { value: 'Other' },
    { value: '4P' },
    { value: 'Manager' },
    { value: 'Sharin' },
    { value: 'Planning' },
    { value: 'Ghanti' },
    { value: 'Galaxy' },
    { value: 'Office' },
    { value: 'Soying' },
]

const initialEmployeeData = {
    emName: '',
    emEmail: '',
    emPhone: '',
    emAadhar: '',
    emDepartment: '',
}


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

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_employee) =>
            Object.keys(_employee).some((key) =>
                _employee[key]?.toString().toLowerCase().includes(query.toLowerCase())
            )
        );
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function EmployeePage() {


    // const EmployeeField = [
    //     { id: "emName", name: "emName", value: "", label: "Employee Name", type: "text", isRequired: true },
    //     { id: "emEmail", name: "emEmail", value: "", label: "Employee Email", type: "email", isRequired: true },
    //     { id: "emPhone", name: "emPhone", value: "", label: "Phone Number", type: "number", isRequired: true },
    //     { id: "emAadhar", name: "emAadhar", value: "", label: "Aadhar Number", type: "number", isRequired: false },
    // ]


    const [employeeList, setEmployeeList] = useState([])
    // const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    // const [department, setDepartment] = useState('');
    // const [selectIdData, setSelectedIdData] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [data, setData] = useState(initialEmployeeData)
    const [editDataFlag, setEditDataFlag] = useState(false)

    const reduxData = store.getState()

    // const handleOpenMenu = (event, id, email) => {
    //     setOpen(event.currentTarget);
    //     setSelectedIdData({ id: id, email: email })
    // };

    // const handleCloseMenu = () => {
    //     setOpen(null);
    //     setSelectedIdData({})
    // };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = employeeList.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employeeList.length) : 0;

    const filteredUsers = applySortFilter(employeeList, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredUsers.length && !!filterName;

    const handleClickModal = () => {
        setOpenModal(!openModal);
    };

    const handleEmployeeForm = async (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleOnSubmitEmployeeForm = async () => {
        if (data.emAadhar === '' ||
            data.emDepartment === '' ||
            data.emEmail === '' ||
            data.emName === '') {
            return
        }

        if (editDataFlag) {
            await DATABASE.updateData(EMPLOYEE, data).then(ref => {
                console.log(ref)

            }).catch((err) => {
                console.log(err)
            })
        } else {
            await DATABASE.pushData(EMPLOYEE, data).then(ref => {
                console.log(ref)

            }).catch((err) => {
                console.log(err)
            })
        }
        handleClickModal();
        InitView()
    }

    const handleMenuItem = async (event, row) => {
        const { emName,
            emEmail,
            emPhone,
            emAadhar,
            emDepartment, id, emUID, isAccess
        } = row

        if (event === 'access') {
            await ACCESS_EMPLOYEE({ id: id, email: emEmail })

        } else if (event === 'edit') {
            setOpenModal(true)
            setData({
                ...data,
                emName: emName,
                emEmail: emEmail,
                emPhone: emPhone,
                emAadhar: emAadhar,
                emDepartment: emDepartment,
                id: id
            })
            setEditDataFlag(true)

        } else if (event === 'delete') {
            if (isAccess) { await AUTH.deleteUser(emUID) }
            await DATABASE.deleteData(EMPLOYEE, id)
        }
        setRefresh(!refresh)
        // handleCloseMenu()
        InitView()
    }


    const InitView = async () => {
        await DATABASE.getData(EMPLOYEE).then((ref) => {
            if (ref.success) {
                setEmployeeList(ref.data)
            }
        })
    }

    useEffect(() => {
        InitView()
    }, [refresh])

    return (
        <>
            <Helmet>
                <title> Employee | {reduxData?.appData?.companyName} </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Employee
                    </Typography>
                    {reduxData?.appData?.appMode.toLowerCase() === 'admin' ? (
                        <Button onClick={() => handleClickModal()} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
                            New Employee
                        </Button>
                    ) : (
                        <></>
                    )}

                </Stack>

                <Card>
                    <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={employeeList.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, key) => {

                                        const { emName, emEmail, emAadhar, emDepartment, emPhone, isAccess, id } = row;
                                        // const { id, name, role, status, company, avatarUrl, isVerified } = row;
                                        const selectedUser = selected.indexOf(emName) !== -1;

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                                {/* <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, id)} />
                                                </TableCell> */}

                                                <TableCell component="th" scope="row">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar alt={emName} src={`/assets/images/avatars/avatar_${key + 1}.jpg`} />
                                                        <Typography variant="button" noWrap>
                                                            {emName}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{emPhone}</TableCell>
                                                <TableCell align="left"><Typography variant="button" noWrap>
                                                    {emDepartment}
                                                </Typography></TableCell>
                                                <TableCell align="left">{emEmail}</TableCell>
                                                <TableCell align="left">{emAadhar}</TableCell>
                                                {/* <TableCell align="left">{isAccess ? 'Yes' : 'No'}</TableCell> */}

                                                <TableCell align="left">
                                                    <Label color={isAccess ? 'success' : 'error'}>{isAccess ? 'YES' : 'NO'}</Label>
                                                </TableCell>

                                                <TableCell align="right" sx={{ position: 'sticky', right: 0, top: 0, bottom: 0, zIndex: 1, display: 'flex', flexDirection: 'row', backgroundColor: '#fff' }}>

                                                    <IconButton sx={{ color: `${isAccess ? 'success.main' : ''}` }} onClick={() => handleMenuItem('access', row)}>
                                                        <Iconify icon={'mdi:cloud-access-outline'} />
                                                    </IconButton>

                                                    <IconButton onClick={() => handleMenuItem('edit', row)}>
                                                        <Iconify icon={'eva:edit-fill'} />

                                                    </IconButton>

                                                    <IconButton sx={{ color: 'error.main' }} onClick={() => handleMenuItem('delete', row)}>
                                                        <Iconify icon={'eva:trash-2-outline'} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
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
                        count={filteredUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                </Card>
            </Container>

            {/* <Popover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem sx={{ color: 'success.main' }} onClick={() => handleMenuItem('access', selectIdData)}>
                    <Iconify icon={'mdi:cloud-access-outline'} sx={{ mr: 2 }} />
                    Give Access
                </MenuItem>

                <MenuItem onClick={() => handleMenuItem('edit', selectIdData)}>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Edit
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }} onClick={() => handleMenuItem('delete', selectIdData)}>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Delete
                </MenuItem>

            </Popover> */}


            <Dialog
                open={openModal}
                onClose={handleClickModal}
            >
                <DialogTitle>{editDataFlag ? 'Edit' : 'New'} Employee</DialogTitle>
                <DialogContent>
                    {/* {EmployeeField.map((input, i) => {
                        return (
                            <TextField
                                key={i}
                                autoFocus
                                required
                                margin="dense"
                                id={input.id}
                                name={input.name}
                                label={input.label}
                                type={input.type}
                                fullWidth
                                variant="standard"
                                value={input.value}
                            />
                        )
                    })} */}

                    <TextField
                        required
                        margin="dense"
                        id="emName"
                        name='emName'
                        label="Employee Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={data.emName}
                        onChange={(e) => handleEmployeeForm(e)}
                    />

                    <TextField
                        required
                        margin="dense"
                        id="emEmail"
                        name='emEmail'
                        label="Employee Email"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={data.emEmail}
                        onChange={(e) => handleEmployeeForm(e)}
                    />

                    <TextField
                        required
                        margin="dense"
                        id="emPhone"
                        name='emPhone'
                        label="Phone Number"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={data.emPhone}
                        onChange={(e) => handleEmployeeForm(e)}
                    />

                    <TextField
                        required
                        margin="dense"
                        id="emAadhar"
                        name='emAadhar'
                        label="Aadhar"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={data.emAadhar}
                        onChange={(e) => handleEmployeeForm(e)}
                    />
                    {/* <InputLabel id="demo-simple-select-filled-label">Category Name</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        name="emDepartment"
                        variant="outlined"
                        value={data.emDepartment}
                        onChange={((e) => handleEmployeeForm(e))}
                    >
                        {DEPARTMENT.map((data, i) => {
                            return (<MenuItem key={i} value={data?.name}>{data?.name}</MenuItem>)
                        })}
                    </Select> */}

                    <FormControl sx={{ minWidth: 120, width: '100%', marginTop: 1 }}>
                        <InputLabel id="demo-simple-select-label">Department</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label='Department'
                            name='emDepartment'
                            value={data.emDepartment}
                            onChange={(e) => handleEmployeeForm(e)}

                            inputProps={{ 'aria-label': 'Without label', 'variant': 'outlined' }}
                            variant='outlined'
                        >
                            {DEPARTMENT.map((data, i) => {
                                return (<MenuItem key={i} value={data.value}>{data.value} </MenuItem>)
                            })}
                        </Select>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClickModal()}>Cancel</Button>
                    <Button type="submit" onClick={() => handleOnSubmitEmployeeForm()}>Save</Button>
                </DialogActions>

                {/* <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}> */}
                {/* <InputLabel id="demo-simple-select-filled-label">Company Name</InputLabel>
                    <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={department}
                        onChange={(event) => setDepartment(event.target.value)}
                    >
                        {DEPARTMENT.map((data, i) => {
                            return (<MenuItem key={i} value={data?.name}>{data?.name}</MenuItem>)
                        })}
                    </Select> */}
                {/* </FormControl> */}
                {/* </DialogContent>
                <DialogActions>
                    <Button onClick={handleClickModal}>Cancel</Button>
                    <Button type='submit'>Save</Button>
                </DialogActions> */}
            </Dialog>
        </>
    );
}