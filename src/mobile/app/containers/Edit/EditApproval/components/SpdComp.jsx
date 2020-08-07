import { fromJS } from 'immutable'
import React, { Fragment } from 'react'
import { Row, Icon, ChosenPicker, Single } from 'app/components'
import Star from './Star'
import CommonRow from './CommonRow'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'


export default
class SpdComp extends React.Component {
    state = {
        visible: false,
    }
    render() {
        const {
            label,
            placeHolder,
            type='single',
            disabled,
            item=fromJS({}),
            district,
            onChange,
            dispatch,
            className,
            history,
            index,
            placeArr

        } = this.props
        const { visible } = this.state
        const valueList = item.get('value') && item.get('value').size?
                item.get('value').map((v,index) => fromJS({
                    processInstanceId:v,
                    title:item.getIn(['titleList',index]),
                    isFinshed:item.getIn(['isFinshedList',index]),
                    result:item.getIn(['result',index])
                })):fromJS([])
        return (
            <Fragment>
                <CommonRow
                    className={item.get('value') && item.get('value').size?'mx-item':''}
                    multiple={type === 'multiple'}
                    label={label}
                    placeHolder={placeHolder}
                    onDelete={e => {
                        onChange('')
                    }}
                    onClick={() => {
                        history.push('/editApproval/choose/related')
                        dispatch(editApprovalActions.changeModelString(['views','componentIndex'],index))
                        dispatch(editApprovalActions.changeModelString(['views','selectList'],valueList))
                    }}
                    StarDisabled={!item.get('required')}
                />
                <Row className='spd-row' style={{display:item.get('value') && item.get('value').size?'':'none'}}>
                    {
                        valueList.map((v,index) => {
                            let color
                            if (v.get('isFinshed')) {
                                color = v.get('result') === 'agree' ? '#5e81d1' : '#ff3b30'
                            } else {
                                color = '#ffb549'
                            }
                            return(
                                <div className='spd-area' key={v.get('index')}>
                                    <Icon type='related'/>
                                    <span>{v.get('title')}</span>
                                    <span style={{color}}>{v.get('isFinshed')?v.get('result') === 'agree'?'审批通过':'审批拒绝':'审批中'}</span>
                                    <Icon type='close'
                                        onClick={() => {
                                            dispatch(editApprovalActions.changeModelString([...placeArr,'value'],item.get('value').splice(index,1)))
                                            dispatch(editApprovalActions.changeModelString([...placeArr,'isFinshedList'],item.get('isFinshedList').splice(index,1)))
                                            dispatch(editApprovalActions.changeModelString([...placeArr,'titleList'],item.get('titleList').splice(index,1)))
                                            dispatch(editApprovalActions.changeModelString([...placeArr,'result'],item.get('result').splice(index,1)))
                                        }}
                                    />
                                </div>
                            )
                        })
                    }
                </Row>
            </Fragment>


        )
    }
}
