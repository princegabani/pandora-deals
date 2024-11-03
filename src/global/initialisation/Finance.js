import moment from "moment-timezone";

export const initialTransactionDetail = {
    transactionType: '', // credit, debit
    expenseName: '',
    transactionAmount: '',
    transactionDate: null,
    // transactionDate: moment(new Date()).unix(),
    transactionDescription: '',
    paidTo: '',
    paidBy: '',
    loanDate: null,
    loanPercentage: 0,
    interest: 0,
    interestPaid: 0,
    interestPaidDate: null,
    status: 0,
    balanceBefore: 0,
    balanceAfter: 0,
    isUpdated: false,
    addedByUID: '',
}