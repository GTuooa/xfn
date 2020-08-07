import view from '../app.js'

import incomeExpendYebState from 'app/redux/Yeb/IncomeExpendYeb'
import incomeExpendMxbState from 'app/redux/Mxb/IncomeExpendMxb'

const reducer = {
    incomeExpendYebState,
    incomeExpendMxbState
}

export { reducer, view }
