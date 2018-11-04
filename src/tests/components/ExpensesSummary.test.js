import React from 'react';
import { shallow } from 'enzyme';
import { ExpensesSummary } from '../../components/ExpensesSummary'

test('should render correctly ExpensesSummary with 1 expense', () => {
    const wrapper = shallow(<ExpensesSummary expenseCount = {1} expensesTotal = {250} />);
    expect(wrapper).toMatchSnapshot();   
})

test('should render correctly ExpensesSummary with multiple expenses', () => {
    const wrapper = shallow(<ExpensesSummary expenseCount={23} expensesTotal = {253210} />);
    expect(wrapper).toMatchSnapshot();       
})
