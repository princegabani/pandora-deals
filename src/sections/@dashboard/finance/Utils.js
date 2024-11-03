export function handleStatus(type) {
    if (type === 0) return 'CLEAR'
    if (type === 1) return 'PENDING'
    if (type === 2) return 'ERROR'
}

export function handleTrasactionType(type) {
    if (type === "Loan_Debit") return { color: 'blue', name: 'Loan Debit' }
    else if (type === "Loan_Credit") return { color: 'orange', name: 'Loan Credit' }
    else if (type === "Fund_Debit") return { color: 'red', name: 'Fund Debit' }
    else if (type === "Fund_Credit") return { color: 'green', name: 'Fund Credit' }
}