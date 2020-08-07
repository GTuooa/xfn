import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import thirdParty from 'app/thirdParty'
import { fromJS, toJS }	from 'immutable'
import { Container, Row, ScrollView, ButtonGroup, Button, Icon } from 'app/components'
// import * as tcsjActions from 'app/actions/tcsj.action.js'
// import * as tcgmActions from 'app/actions/tcgm.action.js'
// import createHistory from 'history/createHashHistory'
// const history = createHistory()
import ContractDetail from 'app/containers/components/ContractDetail'
import './style.less'

@connect(state => state)
export default
class Contract extends React.Component {

    render() {
        const {
            dispatch,
            history
        } = this.props

        thirdParty.setTitle({title: '用户协议'})
		thirdParty.setIcon({
            showIcon: false
        })
		thirdParty.setRight({show: false})

        return (
            <Container>
                <ContractDetail />
                <Row>
                    <ButtonGroup>
                        {/* <Button
                            onClick={() => {
                                if (sessionStorage.getItem('enterContract') === 'tcgm') {
                                    dispatch(tcgmActions.agreeReadContract())
                                } else {
                                    dispatch(tcsjActions.agreeReadContractTcsj())

                                }
                            }}
                            >
                            <Icon type="sure"/>
                            <span>同意</span>
                        </Button> */}
                        {/* <Button onClick={() => history.goBack()}>
                            <Icon type="cancel"/>
                            <span>取消</span>
                        </Button> */}
                        <Button onClick={() => history.goBack()}>
                            <Icon type="cancel"/>
                            <span>返回</span>
                        </Button>
                    </ButtonGroup>
                </Row>
            </Container>
        )
    }
}
