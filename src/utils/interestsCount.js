// Calculate Days
// export function calculateDueDays(startDate, dueDate) {
//     if (!startDate || !dueDate) return 0;
//     const diffInTime = dueDate.getTime() - startDate.getTime();
//     const diffInDays = diffInTime / (1000 * 3600 * 24);
//     return diffInDays;
// };

import { fRupees } from "./formatNumber";

// Calculate total loan amount with interest per month
export function calcuLateInterest(loanAmount, monthlyInterestRate, startDate, dueDate) {
    console.log('called', loanAmount, monthlyInterestRate, startDate, dueDate);

    if (!loanAmount || !monthlyInterestRate || !startDate || !dueDate) return 0;
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(monthlyInterestRate) / 100;
    // const monthlyRate = annualRate / 12;

    const totalTime = dueDate - startDate;
    const totalDays = totalTime / (3600 * 24)
    // const totalDays = calculateDueDays(startDate, dueDate);
    const totalMonths = totalDays / 30; // approximate number of months
    // const term = parseInt(totalMonths, 10);
    // const totalAmount = principal * Math.pow(1 + monthlyRate, totalMonths);


    const monthlyInterest = principal * monthlyRate; // Calculate interest for one month
    const totalInterest = monthlyInterest * totalMonths; // Multiply by the number of months to get the total interest
    console.log(totalInterest.toFixed(2));
    return totalInterest.toFixed(2); // Return the total interest formatted to two decimal places
};