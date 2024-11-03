import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"

export const FormControls = {
    Select: (props) => {
        return (
            <FormControl fullWidth margin="dense">
                <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    name={props.name}
                    label={props.label}
                    id="demo-simple-select"
                    value={props.value ?? ''}
                    onChange={props.onChange}
                >
                    {props.menuList.map((data, i) => {
                        return (<MenuItem key={i} value={data.value}>{data.label ?? data.value} </MenuItem>)
                    })}
                </Select>
            </FormControl>
        )
    },
    Input: (props) => {
        return (
            <TextField
                disabled={props.disabled}
                fullWidth
                margin="dense"
                name={props.name ?? ''}
                label={props.label ?? ''}
                type={props.type ?? ''}
                variant="outlined"
                value={props.value}
                onChange={props.onChange}
            />)
    }
}