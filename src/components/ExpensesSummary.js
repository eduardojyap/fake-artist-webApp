import React from 'react';
import {connect} from 'react-redux';
import selectExpenses from '../selectors/expenses';
import selectExpensesTotal from '../selectors/expenses-total'
import numeral from 'numeral'

export class ExpensesSummary extends React.Component {
    render() {
        return <p>Viewing {this.props.expensesCount} expenses totalling {numeral(this.props.expensesTotal/100).format('$0,0.00')}</p>
    }
}

const mapStateToProps = (state) =>  {
    const visibleExpenses = selectExpenses(state.expenses, state.filters);
    return {
        expensesCount: visibleExpenses.length,
        expensesTotal: selectExpensesTotal(visibleExpenses)
    };
};

export default connect(mapStateToProps)(ExpensesSummary);