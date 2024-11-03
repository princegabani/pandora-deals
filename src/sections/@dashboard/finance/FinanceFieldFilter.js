import PropTypes from 'prop-types';
// @mui
import { Card, CardHeader } from '@mui/material';


// ----------------------------------------------------------------------

FinanceFieldFilter.propTypes = {
    title: PropTypes.string,
    subheader: PropTypes.string,
    chartColors: PropTypes.arrayOf(PropTypes.string),
    chartData: PropTypes.array,
};

export default function FinanceFieldFilter({ title, subheader, chartColors, chartData, ...other }) {



    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />
        </Card>
    );
}
