export default (expenses) => {
    return expenses.map((expense) => (expense.amount)).reduce((accumulator,currentValue) => currentValue + accumulator,0)
}