import React from 'react'
import { connect }	from 'react-redux'

// import { feeActions } from 'app/redux/Fee'
import * as tcxqActions from 'app/redux/Fee/Tcxq/tcxq.action.js'
// import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'

// import Tcgm from './Tcgm'
import Tcxq from './Tcxq'

@connect(state => state)
export default
class Fee extends React.Component {

    componentDidMount() {
        console.log('Fee');
        this.props.dispatch(tcxqActions.getPackageAmountListAndgetAdminCorpinfoFetch())
        // this.props.dispatch(tcgmActions.getPayProductFetch())
	}
    //
    shouldComponentUpdate(nextprops, nextstate) {
		return this.props.feeState !== nextprops.feeState || this.props.tcgmState !== nextprops.tcgmState || this.props.tcxqState !== nextprops.tcxqState || this.state !== nextstate
	}
    //
    // componentWillUnmount () {
    //     console.log('Fee 未清理');
    // }

    render() {

        const { feeState, dispatch } = this.props

        const currentPage = feeState.getIn(['views', 'currentPage'])

        const conponent = ({
            'Tcxq': () => <Tcxq />,
            // 'Tcgm': () => <Tcgm />
        }[currentPage] || (() => <div></div>))()

        return conponent

    }
}
