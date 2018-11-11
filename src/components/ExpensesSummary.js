import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import selectExpenses from '../selectors/expenses';
import selectExpensesTotal from '../selectors/expenses-total'
import numeral from 'numeral'

export class ExpensesSummary extends React.Component {
    render() {
        return (
            <div className="page-header">
            <div className="content-container">
                <h1 className="page-header__title">Viewing <span>{this.props.expensesCount} </span>expense{this.props.expensesCount !== 1 ? 's' : ''} totalling <span>{numeral(this.props.expensesTotal/100).format('$0,0.00')}</span></h1>
                <div className="page-header__actions">
                    <Link className="button"to="/create">Create Expense</Link>
                </div>
                </div>
            </div>
            )
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