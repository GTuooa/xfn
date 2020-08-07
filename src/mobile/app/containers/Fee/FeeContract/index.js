import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import * as thirdParty from 'app/thirdParty'
import { fromJS, toJS }	from 'immutable'
import { Container, Row, ScrollView, ButtonGroup, Button, Icon } from 'app/components'
import ContractDetail from 'app/containers/components/ContractDetail'

import * as tcgmActions from 'app/redux/Fee/Tcgm/tcgm.action.js'
import './style.less'

@connect(state => state)
export default
class FeeContract extends React.Component {

    render() {
        const {
            dispatch,
            history
        } = this.props

        return (
            <Container>
                <ContractDetail/>
                <Row>
                    <ButtonGroup>
                        <Button onClick={() => history.goBack()}>
                            <Icon type="cancel"/>
                            <span>取消</span>
                        </Button>
                        <Button
                            onClick={() => {
                                if (sessionStorage.getItem('enterContract') === 'tcgm') {
                                    dispatch(tcgmActions.agreeReadContractTcgm(true))
                                    history.goBack()
                                } else {
                                    dispatch(tcgmActions.agreeReadContractTcsj(true))
                                    history.goBack()
                                }
                            }}
                            >
                            <Icon type="sure"/>
                            <span>同意</span>
                        </Button>
                    </ButtonGroup>
                </Row>
            </Container>
        )
    }
}
