import React from 'react'
import { Icon, Tabs, Row, Checkbox, Container, ScrollView, ButtonGroup, Button }  from 'app/components'
import { fromJS } from 'immutable'
import { connect }	from 'react-redux'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'

@connect(state => state)
export default
class Search extends React.Component {
    state={
        chooseName:this.props.editApprovalState.getIn(['views','modelName']) || '全部',
        chooseCode:this.props.editApprovalState.getIn(['views','processCode']) || ''
    }
    componentDidMount() {
    }
    render() {
        const {
            dispatch,
            editApprovalState,
            history
        } = this.props
        const {
            chooseName,
            chooseCode
        } = this.state
        const processModelList = editApprovalState.get('processModelList')
        const views = editApprovalState.get('views')
        const modelName = editApprovalState.get('modelName')
        return(
            <Container className='spd' style={{background:'#fff'}} >
                <div className='search-title'>类型</div>
                <ScrollView  className='search-spd'>
                    <div className='search-type'>
                        {
                            processModelList.map(v =>
                                <span
                                    key={v.get('processCode')}
                                    className={chooseName === v.get('modelName')?'type-active':''}
                                    onClick={() => this.setState({chooseName:v.get('modelName'),chooseCode:v.get('processCode')})}

                                    >
                                    {v.get('modelName')}
                                </span>
                            )
                        }
                    </div>
                </ScrollView>
                <div className='bottom-btn'>
                    <ButtonGroup className>
                        <Button
                            onClick={() => {
                                dispatch(editApprovalActions.changeModelString(['views','modelName'],chooseName))
                                dispatch(editApprovalActions.changeModelString(['views','processCode'],chooseCode !== 'PROCESS_CODE_ALL'?chooseCode:''))
                                history.goBack()
                            }}
                            >
                            <span>确定</span>
                        </Button>
                    </ButtonGroup>
                </div>

            </Container>
        )
    }

}
