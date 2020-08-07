import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { Icon } from 'app/components'
import ChosenPicker from 'app/components/ChosenPicker'
import './style.less'

@immutableRenderDecorator
export default
class ExperienceModal extends React.Component {

    render() {
        const {
            experientialModal,
            moduleList,
            closeModal,
            // chooseSmart,
            // chooseAccount,
            chooseSomeModal,
        } = this.props

        let sourceList = [
            {
                key: 'account',
                label: '会计版',
                childList: []
            },
            {
                key: 'jr',
                label: '智能版',
                childList: []
            }
        ]
        const accountModelList = moduleList.get('accountModelList')
        const jrModelList = moduleList.get('jrModelList')

        accountModelList.forEach(v => {
            sourceList[0].childList.push({
                key: v.get('modelNumber'),
                label: v.get('modelName'),
                childList: []
            })
        })
        jrModelList.forEach(v => {
            sourceList[1].childList.push({
                key: v.get('modelNumber'),
                label: v.get('modelName'),
                childList: []
            })
        })

        return (
            <div >
                <div className="home-experiential-modal" style={{display:experientialModal ? 'block' : 'none'}} onClick={() => closeModal()}></div>
                <div className="home-experiential-wrap" style={{display:experientialModal ? 'block' : 'none'}}>
                    <p>即将进入小番财务体验模式，请注意：</p>
                    <p>
                        {
                            global.isplayground ?
                            `1、同一个wifi下的用户共用一个体验环境，环境中已经预置了一些模拟的业务数据；` : `1、每个公司共用一个体验环境，环境中已经预置了一些模拟的业务数据；`
                        }<br />
                        2、数据每晚定时清空，切勿录入正式数据；<br />
                        3、有部分功能在体验环境中不能操作。
                    </p>
                    {/* <div className="help-btn-wrap">
                        <div
                            onClick= {() => chooseSmart()}
                        >
                            <p>智能版</p>
                            <p>无需会计基础，财务小白也能零门槛输出专业报表</p>
                        </div>
                        <div
                            onClick= {() => chooseAccount()}
                        >
                            <p>会计版</p>
                            <p>传统总账系统</p>
                        </div>
                    </div> */}
                    <div className="help-chosen-btn-wrap">
                        <ChosenPicker
                            district={sourceList}
                            className="help-chosen-btn"
                            parentDisabled={true}
                            onChange={result => {
                                if (result.key === 'account' || result.key === 'jr') {
                                    return
                                }

                                const key = result.key
                                const accountItem = accountModelList.find(v => v.get('modelNumber') === key)
                                if (accountItem) {
                                    chooseSomeModal('ACCOUNTING_DEMO', accountItem)
                                } else {
                                    const jrItem = jrModelList.find(v => v.get('modelNumber') === key)
                                    if (jrItem) {
                                        chooseSomeModal('SMART_DEMO', jrItem)
                                    } else {
                                        console.log('异常');
                                    }
                                }
                            }}
                        >
                            <span className="home-experiential-btn-wrap">
                                选择体验模板
                            </span>
                        </ChosenPicker>
                    </div>
                </div>
            </div>

        )
    }
}
