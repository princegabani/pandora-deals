import React from 'react'
import { DATABASE } from 'src/database'
import { FINANCE } from 'src/database/references'

function handleWidgetData(list) {

    let admin = []
    const initialWidgets = [
        { id: 'Sell', title: "Sell", total: 0, color: "success" },
        { id: 'Labor', title: "Labor", total: 0, color: "success" },
        { id: 'Salary', title: "Salary", total: 0, color: "warning" },
        { id: 'Labor_Client', title: "Labor_Client", total: 0, color: "warning" },
        { id: 'Machinery', title: "Machinery", total: 0, color: "error" },
        { id: 'Rough', title: "Rough", total: 0, color: "primary" },
    ]
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
    // employee: data,
    return admin
}

export const AppDatabase = {
    // for dashboard main widget
    appMainWidget: async () => {
        return await DATABASE.getData(FINANCE).then((ref) => {
            if (ref.success) {
                const data = ref.data
                console.log('dashboard database', data)

                return handleWidgetData(data)
            }
        })
    }
}
