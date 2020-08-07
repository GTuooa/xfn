import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { DatePicker, Input, Select, Checkbox, Button, message, Radio, Icon } from 'antd'
import { RunCategorySelect, AcouontAcSelect, TableBody, TableTitle, TableItem, TableAll, Amount, TableOver } from 'app/components'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg } from './common/common'
import Project from './Project'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'
import * as previewRunningActions from 'app/redux/Edit/RunningPreview/previewRunning.action.js'

@immutableRenderDecorator
export default
class CarrayoverRunning extends React.Component {
    render() {
        const {
            title,
            strongList,
            dispatch
        } = this.props
        let splitStronglist = []
        strongList.toJS().reduce((pre,cur) => {
            if (pre.indexOf(cur.oriUuid) === -1) {
                splitStronglist.push(cur)
                pre.push(cur.oriUuid)
            }
            return pre
        },[])
    return(
        <div >
            <div className="accountConf-separator"></div>
            <div className="edit-running-modal-list-item" style={{flexWrap:'wrap'}}>
                <span>{title}</span>
                {
                    fromJS(splitStronglist).map(item =>
                        <span
                            className='flowNumber-area'
                            onClick={(e)=>{
                                e.stopPropagation()
                                dispatch(previewRunningActions.getPreviewRunningBusinessFetch(item, 'lrls'))
                            }}
                        >{`${item.get('oriDate')} ${item.get('jrIndex')}号`}</span>
                    )
                }
            </div>
        </div>
    )
    }

}
