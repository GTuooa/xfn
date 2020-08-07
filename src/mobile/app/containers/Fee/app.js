import React from 'react'
import { connect }	from 'react-redux'

import Tcgm from './Tcgm'
import Tcxq from './Tcxq'
import * as thirdParty from 'app/thirdParty'

import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
import { homeActions } from 'app/redux/Home/home.js'

@connect(state => state)
export default
class Fee extends React.Component {

    componentDidMount() {
        // this.props.dispatch(tcgmActions.getPayProductFetch())

        thirdParty.setTitle({title: '套餐购买'})
        thirdParty.setIcon({showIcon: false })
        thirdParty.setRight({show: false })

        // this.props.dispatch(homeActions.setDdConfig())
    }

    render() {

        const { feeState, dispatch, history } = this.props

        const currentPage = feeState.getIn(['views', 'currentPage'])

        const conponent = ({
            'Tcxq': () => <Tcxq history={history}/>,
            'Tcgm': () => <Tcgm history={history}/>
        }[currentPage] || (() => <div></div>))()

        return conponent
    }
}
