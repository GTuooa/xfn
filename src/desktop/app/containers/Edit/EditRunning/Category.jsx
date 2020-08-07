import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import moment from 'moment'
import { connect }	from 'react-redux'

import { Input } from 'antd'
import * as Limit from 'app/constants/Limit.js'
import XfIcon from 'app/components/Icon'
import { formatNum, DateLib, formatMoney } from 'app/utils'
import { getCategorynameByType, numberTest, regNegative, reg } from './common/common'
import Project from './Project'
import HandlingList from './HandlingList'
import * as CategoryComp from './CategoryComp'

import * as editRunningActions from 'app/redux/Edit/EditRunning/editRunning.action'

@immutableRenderDecorator
export default
class Category extends React.Component {
    render() {
        const {
            oriTemp,
            accountList,
            projectList,
            contactsList,
            dispatch,
            flags,
            categoryTypeObj,
            taxRateTemp,
            showSingleModal,
            MemberList,
            selectThingsList,
            thingsList,
            stockList,
            warehouseList,
            insertOrModify,
            isCheckOut,
            enableWarehouse,
            openQuantity,
            accountPoundage,
            moduleInfo


        } = this.props
        const categoryType = oriTemp.get('categoryType')
        const obj = {
            oriTemp,
            accountList,
            projectList,
            contactsList,
            dispatch,
            flags,
            categoryTypeObj,
            taxRateTemp,
            showSingleModal,
            MemberList,
            selectThingsList,
            thingsList,
            insertOrModify,
            isCheckOut,
            enableWarehouse,
            openQuantity,
            accountPoundage,
            moduleInfo
        }
        const RunningComponent = {
            LB_ZSKX:'ZsZf',
            LB_ZFKX:'ZsZf',
            LB_CQZC:'Cqzc',
            LB_JK:'Jk',
            LB_TZ:'Tz',
            LB_ZB:'Zb',
            LB_YYWSR:'Yywsr',
            LB_YYWZC:'Yywzc',
            LB_XCZC:'Xczc',
            LB_FYZC:'Fyzc',
            LB_SFZC:'Sfzc',
            LB_YYSR:'Yysz',
            LB_YYZC:'Yysz',

        }[categoryType]
        const getComponent = (name) => {
            const Component = CategoryComp[name]
            return(
                Component?
                <Component
                    {...obj}
                    stockList={stockList}
                    warehouseList={warehouseList}
                />:''
            )
        }


        return(
            <div>
                {getComponent(RunningComponent)}
            </div>
        )
    }
}
