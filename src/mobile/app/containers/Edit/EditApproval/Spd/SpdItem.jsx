import React, { Fragment } from 'react'
import { fromJS } from 'immutable'
import { tabs, containType } from '../common'
import { Row, Checkbox } from 'app/components'
import * as editApprovalActions from 'app/redux/Edit/EditApproval/editApproval.action.js'

export default
class SpdItem extends React.Component {
    highlightWords = (value,words) => {
        if (!words) {
            return value
        }
        const values = value.split(words)
        return (
            <span className='highlight-words'>
                {
                    values.map((v,index) => <Fragment>  <span>{v}</span> {values.length -1 > index?<span style={{color:'#FF8348'}}>{words}</span> :''} </Fragment>)
                }
            </span>
        )
    }
    render() {
        const {
            i,
            v,
            selectList=fromJS([]),
            dispatch,
            searchContent
        } = this.props
        const date = v.get('finishTime') || v.get('createTime')
        const checked = selectList.some(w => w.get('processInstanceId') === v.get('processInstanceId'))
        let color
        if (v.get('finishTime')) {
            color = v.get('result') === 'agree' ? '#5e81d1' : '#ff3b30'
        } else {
            color = '#ffb549'
        }
        return(
            <Row key={i} className='approval-spd-item'>
                <div
                    className='spd-content'
                    onClick={() => {
                        if (!checked) {
                            dispatch(editApprovalActions.changeModelString(['views','selectList'],selectList.push(fromJS({
                                processInstanceId:v.get('processInstanceId'),
                                isFinshed:!!v.get('finishTime'),
                                title:v.get('processTitle'),
                                result:v.get('result')
                            }))))
                        } else {
                            const index = selectList.findIndex(w => w.get('processInstanceId') === v.get('processInstanceId'))
                            dispatch(editApprovalActions.changeModelString(['views','selectList'],selectList.splice(index,1)))
                        }
                    }}
                    >
                    <span>
                        {
                            v.get('originateAvatar') ?
                            <img className="approval-avatar-img" src={v.get('originateAvatar')} />
                            :<span className="approval-all-item-main-avatar-skeleton"></span>
                        }
                    </span>
                    <span>

                        <span>{this.highlightWords(v.get('processTitle'),searchContent)}</span>
                        {
                            Object.keys(v.get('displayMap').toJS()).map(key =>
                                <span key={key}>{`${containType[key]}：`}{this.highlightWords(v.getIn(['displayMap',key]),searchContent)}</span>
                            )
                        }
                        <span>{date.substr(0,10)}</span>
                        <span style={{color}}>{v.get('finishTime')?v.get('result') === 'agree'?'审批通过':'审批拒绝':'审批中'}</span>
                    </span>
                    <span>
                        <Checkbox
                            checked={checked}

                        />
                    </span>
                </div>
            </Row>
        )
    }
}
