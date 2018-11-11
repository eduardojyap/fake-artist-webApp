import { startAddExpense, addExpense, editExpense, removeExpense, setExpenses, startSetExpenses, startRemoveExpense, startEditExpense} from '../../actions/expenses';
import expenses from '../fixtures/expenses';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import database from '../../firebase/firebase';

const uid = 'thisismytestuid';
const createMockStore = configureMockStore([thunk]);
const defaultAuthState = { auth: {uid}}

beforeEach((done)=> {
    const expensesData = {};
    expenses.forEach(({id,description,note,amount,createdAt})=> {
        expensesData[id] = {description,note,amount,createdAt};
    });
    database.ref(`users/${uid}/expenses`).set(expensesData).then(()=>done());
})

test('Should setup remove expense action object', ()=> {
    const action = removeExpense({id: '123abc'});
    expect(action).toEqual(
        {
            type: 'REMOVE_EXPENSE',
            id: '123abc'
        }
    );
})

test('Should setup edit expense action object', () => {
    const action = editExpense('123abc',{note: 'New note value'});
    expect(action).toEqual(
        {
            type: 'EDIT_EXPENSE',
            id: '123abc',
            updates: {
                note: 'New note value'
            }
        }
    );
});

test('should setup add expense action object with provided values', () => {
    const action = addExpense(expenses[2]);
    expect(action).toEqual({
        type: 'ADD_EXPENSE',
        expense: expenses[2]
    });
});

/*
test('should setup add expense action object with default values', () => {
    const expense = {};
    const action = addExpense(expense);
    expect(action).toEqual({
        type: 'ADD_EXPENSE',
        expense: {
            id: expect.any(String),
            description: '',
            note: '', 
            amount: 0, 
            createdAt: 0,
        }
    });
});*/

test('should edit expenses from firebase', (done) => {
    const store = createMockStore(defaultAuthState);
    store.dispatch(startEditExpense(expenses[0].id,{amount: 21045})).then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual({
            type: 'EDIT_EXPENSE',
            id: expenses[0].id,
            updates: {
                amount: 21045
            }
        });
        return database.ref(`users/${uid}/expenses/${expenses[0].id}`).once('value');
    }).then((snapshot) => {
        expect(snapshot.val().amount).toBe(21045);
        done();
    });
});

test('should remove expense from firebase', (done) => {
    const store = createMockStore(defaultAuthState);
    store.dispatch(startRemoveExpense({id:expenses[1].id})).then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual({
            type: 'REMOVE_EXPENSE',
            id: expenses[1].id
        });
        return database.ref(`users/${uid}/expenses/${expenses[1].id}`).once('value');
    }).then((snapshot) => {
        expect(snapshot.val()).toBeFalsy();
        done();
    })
})

test('should add expense to database and store', (done) => {
    const store = createMockStore(defaultAuthState)
    const expenseData = {
        description: 'Mouse',
        amount: 3000,
        note: 'This one is better',
        createdAt: 1000
    };
    store.dispatch(startAddExpense(expenseData)).then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual({
            type: 'ADD_EXPENSE',
            expense: {
                id: expect.any(String),
                ...expenseData
            }
        })
        return database.ref(`users/${uid}/expenses/${actions[0].expense.id}`).once('value')
    }).then((snapshot) => {
        expect(snapshot.val()).toEqual(expenseData);
        done();
    });
});

test('should add expense with defaults to database and store', (done) => {
    const store = createMockStore(defaultAuthState)
    const expenseData = {
        description: '',
        amount: 0,
        note: '',
        createdAt: 0
    };
    store.dispatch(startAddExpense({})).then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual({
            type: 'ADD_EXPENSE',
            expense: {
                id: expect.any(String),
                ...expenseData
            }
        })
        return database.ref(`users/${uid}/expenses/${actions[0].expense.id}`).once('value')
    }).then((snapshot) => {
        expect(snapshot.val()).toEqual(expenseData);
        done();
    });
});

test('should setup set expense action object with data', () => {
    const action = setExpenses(expenses);
    expect(action).toEqual({
        type: 'SET_EXPENSES',
        expenses
    });
});

test('should fetch the expenses from firebase', (done) => {
    const store = createMockStore(defaultAuthState);
    store.dispatch(startSetExpenses()).then(() => {
        const actions = store.getActions();
        expect(actions[0]).toEqual({
            type: 'SET_EXPENSES',
            expenses
        });
        done();
    });
});