import React, { PropTypes, Fragment } from 'react'
import { Map, List ,fromJS} from 'immutable'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Radio } from 'antd'
import { Icon } from 'app/components'
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
import './style.less'

@immutableRenderDecorator

class Tab extends React.Component {
    render() {
        const { tabList, addButton, addFunc, tabFunc, radius, activeKey, addKey } = this.props
        return(
            <Fragment>
                {/* <RadioGroup onChange={(e) => {
                    const value = e.target.value
                    value === 'ADD_BUTTON' ? addFunc() : tabFunc({key:e.target.value})

                }}
                value={activeKey}
                > */}
                    {
                        tabList.map(v =>
                            <span
                                key={v.key}
                                value={v.key}
                                className={`${radius?'basic-tab-radius-item':'basic-tab-item'} ${activeKey === v.key ? 'basic-tab-item-active' : ''}`}
                                onClick={() => {
                                    tabFunc(v,v.item)
                                }}
                                >
                                {v.value}
                            </span>
                        )
                    }
                    {
                        addButton?
                        <span
                            key={'add-:-new-:-tap'}
                            value={addKey}
                            className={`${radius?'basic-tab-radius-item':'basic-tab-item'} ${activeKey === addKey ? 'basic-tab-item-active' : ''}`}
                            onClick={() => {
                                addFunc()
                            }}
                        >
                            <Icon type="plus" />
                        </span>:''
                    }
                {/* </RadioGroup> */}

            </Fragment>
        )
    }
}

export default Tab