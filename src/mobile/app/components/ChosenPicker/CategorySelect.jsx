import React, { Component } from 'react'
import { fromJS, toJS } from 'immutable'
import { Icon, Checkbox } from 'app/components'

import './style.less'

const nameList = [
    {label: 'itemOneName', key: 'itemOneUuid', data: 'district'},
    {label: 'itemTwoName', key: 'itemTwoUuid', data: 'itemTwoList'},
    {label: 'itemThreeName', key: 'itemThreeUuid', data: 'itemThreeList'},
    {label: 'itemFourName', key: 'itemFourUuid', data: 'itemFourList'},
    {label: 'itemFiveName', key: 'itemFiveUuid', data: 'itemFiveList'},
]

const defaultState = {
    show: false,
    selectIdx: -1,//当前被选中的下标
    itemTwoList: [],
    itemThreeList: [],
    itemFourList: [],
    itemFiveList: [],
    itemOneName: '请选择',
    itemTwoName: '',
    itemThreeName: '',
    itemFourName: '',
    itemFiveName: '',
    itemOneUuid: '',
    itemTwoUuid: '',
    itemThreeUuid: '',
    itemFourUuid: '',
    itemFiveUuid: '',
    checkedValueList: [],
    checkedKeyList: [],
}

export default class CategorySelect extends Component {
    scrollView = ''
    state = defaultState
    componentDidMount () {
        this.scrollView = document.getElementsByClassName('scroll-view')[0] ? document.getElementsByClassName('scroll-view')[0] : {style: {'overflow-y' : ''}}
    }

    setDefault (value, district, multiSelect) {
        let itemArr = []
        let selectIdx = '0'
        let isFind = false
        this.scrollView.style['overflow-y']='hidden'//解决ios Fixed定位不准确

        const loop = (data, level) => {
            data.map((item, idx) => {
                if (isFind) {
                    return
                }
                if (item['key'] == value) {
                    isFind = true
                    selectIdx = level
                    itemArr.push({key: item['key'], label: item['label'], idx: idx})
                    return
                }
                if (item['childList'].length) {
                    itemArr.push({key: item['key'], label: item['label'], idx: idx})
                    loop(item['childList'], level+1)
                }
            })

            if (!isFind) {
                itemArr.pop()
            }

        }

        if (!multiSelect && (value || value == '')) {
            loop(district, 0)
            this.setState({ selectIdx: selectIdx-1 })

            let itemTwoList = []
            let itemThreeList = []
            let itemFourList = []
            let itemFiveList = []
            let dataList = [district, itemTwoList, itemThreeList, itemFourList, itemFiveList]

            nameList.forEach((v, i) => {
                if (i < itemArr.length) {
                    this.setState({
                        [nameList[i]['key']]: itemArr[i]['key'],
                        [nameList[i]['label']]: itemArr[i]['label']
                    })
                    if ( i > 0 ) {
                        dataList[i] = dataList[i-1][itemArr[i-1]['idx']]['childList']
                        this.setState({
                            [nameList[i]['data']]: dataList[i]
                        })
                    }
                } else {
                    this.setState({
                        [nameList[i]['key']]: '',
                        [nameList[i]['label']]: '',
                        [nameList[i]['data']]: []
                    })
                }
            })
        }

        //类别多选时
        if (multiSelect) {
            let checkedkeyListOrigin = []
            let checkedValueListOrigin = []

            value.forEach(v => {
                checkedValueListOrigin.push(v['key'])
                checkedkeyListOrigin.push(v['label'])
            })


            this.setState({
                'checkedValueList': checkedValueListOrigin,
                'checkedKeyList': checkedkeyListOrigin,
            })
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.visible) {
            this.setState({show: true})
            this.setDefault(nextProps.value, nextProps.district, nextProps.multiSelect)
        } else if (nextProps.visible == false) {
            this.setState(defaultState)
        }
    }



    render() {
        const { district, value, title, onChange, disabled, className, parentDisabled, multiSelect, visible, onCancel, onOk } = this.props

        //parentDisabled 如果为true 只能选中末级类别
        const {
            show,
            itemTwoList,
            itemThreeList,
            itemFourList,
            itemFiveList,
            itemOneName,
            itemTwoName,
            itemThreeName,
            itemFourName,
            itemFiveName,
            selectIdx,
            itemOneUuid,
            itemTwoUuid,
            itemThreeUuid,
            itemFourUuid,
            itemFiveUuid,
            checkedValueList,
            checkedKeyList,
        } = this.state
        //district [{key: '', label: '', disabled: '', childList}] //value； string
        //value str key
        const translateName = ['chosenpicker-pre', 'chosenpicker-next', 'chosenpicker-next-next', 'chosenpicker-last', 'chosenpicker-last'][selectIdx+1==0 ? 0 : selectIdx]
        const itemNameList = [itemOneName, itemTwoName, itemThreeName, itemFourName, itemFiveName]
        const itemUuidList = [itemOneUuid, itemTwoUuid, itemThreeUuid, itemFourUuid, itemFiveUuid]

        return (
            <div className={['chosenpicker', className].join(' ')}
                onClick={() => {
                    if (disabled) { return }
                    this.setState({show: true})
                    this.setDefault(value, district, multiSelect)
                }}
            >
                { this.props.children ? this.props.children : <div className='chosenpicker-caption'>请选择</div> }
                {/* 蒙层内容 */}
                <div
                    className={`chosenpicker-mask ${show ? 'chosenpicker-animate' : 'chosenpicker-none-animate'}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        this.scrollView.style['overflow-y']='auto'
                        this.setState({ show: false })
                        if (onCancel) {
                            onCancel()
                        }
                        if (multiSelect) {
                            this.setState(defaultState)
                            this.setState({
                                checkedValueList: [],
                                checkedKeyList: [],
                            })
                        }
                    }}
                >
                    <div className={`chosenpicker-popup ${show ? 'chosenpicker-popup-animate' : 'chosenpicker-popup-none-animate'}`}>
                        <div className='chosenpicker-title' onClick={(e) => e.stopPropagation()}>
                            {title ? title : '请选择'}
                        </div>
                        <ul className='chosenpicker-select-title'
                            style={{display: !itemOneName ? 'none' : ''}}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {itemNameList.map((v, i)=> {
                                return (
                                    <li
                                        key={i}
                                        style={{display: v=='' ? 'none' : ''}}
                                        className={ i == selectIdx+1 ? 'overElli chosenpicker-select-title-active' : 'overElli' }
                                        onClick={(e)=>{
                                            e.stopPropagation()
                                            this.setState({ selectIdx: i-1 })
                                        }}
                                    >
                                        <span>{v && v.length > 10 ? `${v.slice(0,10)}...` : v} </span>
                                        <span>{itemNameList[i+1] ? <Icon type="arrow-right" /> : ''}</span>
                                    </li>
                                )
                            })}
                        </ul>

                        <ul className={`chosenpicker-content ${translateName} chosenpicker-move-animate`} onClick={(e) => e.stopPropagation()}>
                            {
                                [district, itemTwoList, itemThreeList, itemFourList, itemFiveList].map((item, idx) => {
                                    return (
                                        <li key={idx} className='chosenpicker-item'>
                                            {item.map((v, i) => {
                                                const hasChild = v['childList'].length ? true : false
                                                const key = v['key']
                                                const hasSelected = checkedValueList.includes(key)

                                                let classNameStr = ''
                                                if (!multiSelect && v['key'] == itemUuidList[idx]) {
                                                    classNameStr = 'chosenpicker-item-active'
                                                }
                                                if (multiSelect) {
                                                    if (hasChild && v['key'] == itemUuidList[idx]) {
                                                        classNameStr = 'chosenpicker-item-active'
                                                    }
                                                    if (!hasChild && hasSelected) {
                                                        classNameStr = 'chosenpicker-item-active'
                                                    }
                                                }
                                                if (v['disabled']) {
                                                    classNameStr = 'chosenpicker-item-disabled'
                                                }

                                                return (
                                                    <div key={key}
                                                        className={classNameStr}
                                                        onClick={() => {
                                                            if (v['disabled']) {
                                                                return
                                                            }
                                                            if (!parentDisabled) {
                                                                onChange(v)
                                                                this.setState({ show: false })
                                                                this.scrollView.style['overflow-y']='auto'
                                                                if (onCancel) { onCancel() }
                                                                return
                                                            }
                                                            if (hasChild) {//有子集
                                                                this.setState({ selectIdx: idx })
                                                                nameList.forEach((nameItem, i) => {
                                                                    if (i == idx) {
                                                                        this.setState({
                                                                            [nameList[i]['key']]: key,
                                                                            [nameList[i]['label']]: v['label']
                                                                        })
                                                                    }
                                                                    if (i == idx+1) {
                                                                        this.setState({
                                                                            [nameList[i]['key']]: '',
                                                                            [nameList[i]['label']]: '请选择',
                                                                            [nameList[i]['data']]: v['childList']
                                                                        })
                                                                    }
                                                                    if (i > idx+1) {
                                                                        this.setState({
                                                                            [nameList[i]['key']]: '',
                                                                            [nameList[i]['label']]: '',
                                                                            [nameList[i]['data']]: []
                                                                        })
                                                                    }

                                                                })
                                                            } else {
                                                                if (multiSelect) {
                                                                    if (hasSelected) {//从选中到未选中
                                                                        let idx = checkedValueList.findIndex(item => item == key)
                                                                        checkedValueList.splice(idx, 1)
                                                                        checkedKeyList.splice(idx, 1)
                                                                    } else {
                                                                        checkedValueList.push(key)
                                                                        checkedKeyList.push(v['label'])
                                                                    }
                                                                    this.setState({
                                                                        checkedValueList: checkedValueList,
                                                                        checkedKeyList: checkedKeyList,
                                                                        selectIdx: idx > 1 ? idx-1 : 0
                                                                    })
                                                                    nameList.forEach((nameItem, i) => {
                                                                        if (i == idx) {
                                                                            this.setState({
                                                                                [nameList[i]['key']]: key,
                                                                                [nameList[i]['label']]: v['label']
                                                                            })
                                                                        }
                                                                        if (i >= idx+1) {
                                                                            this.setState({
                                                                                [nameList[i]['key']]: '',
                                                                                [nameList[i]['label']]: '',
                                                                                [nameList[i]['data']]: []
                                                                            })
                                                                        }
                                                                    })
                                                                } else {
                                                                    onChange(v)
                                                                    this.setState({ show: false })
                                                                    this.scrollView.style['overflow-y']='auto'
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <span className="muti-line-ellipsis"
                                                            style={{"WebkitBoxOrient": "vertical", flex: '1'}}
                                                        >
                                                            {v['label']}
                                                        </span>
                                                        { hasChild ? <span className='icon-wrap'
                                                            onClick={(e) => {
                                                                if (!parentDisabled) {
                                                                    e.stopPropagation()
                                                                    this.setState({ selectIdx: idx })
                                                                    nameList.forEach((nameItem, i) => {
                                                                        if (i == idx) {
                                                                            this.setState({
                                                                                [nameList[i]['key']]: key,
                                                                                [nameList[i]['label']]: v['label']
                                                                            })
                                                                        }
                                                                        if (i == idx+1) {
                                                                            this.setState({
                                                                                [nameList[i]['key']]: '',
                                                                                [nameList[i]['label']]: '请选择',
                                                                                [nameList[i]['data']]: v['childList']
                                                                            })
                                                                        }
                                                                        if (i > idx+1) {
                                                                            this.setState({
                                                                                [nameList[i]['key']]: '',
                                                                                [nameList[i]['label']]: '',
                                                                                [nameList[i]['data']]: []
                                                                            })
                                                                        }

                                                                    })
                                                                }
                                                            }}
                                                            ><Icon type="arrow-right"/></span> : null }
                                                        {!hasChild && multiSelect ? <span className='icon-wrap'>
                                                            <Checkbox checked={hasSelected}/></span> : null}
                                                    </div>
                                                )
                                            })}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        {
                            multiSelect ?
                            <div className="chosenpicker-select-value-wrap" onClick={(e) => e.stopPropagation()}>
                                <span className="chosenpicker-select-value-tip">
                                    已选择：
                                </span>
                                <span className="chosenpicker-select-value">
                                    {checkedKeyList.join('、')}
                                </span>
                                <span className="chosenpicker-select-value-btn"
                                    onClick={()=>{
                                        let arr = []
                                        const loop = (data) => {
                                            data.map((item, idx) => {
                                                if (item['childList'].length) {
                                                    loop(item['childList'])
                                                } else {
                                                    if (checkedValueList.includes(item['key'])) {
                                                        arr.push(item)
                                                    }
                                                }
                                            })
                                        }
                                        loop(district)
                                        onOk(arr)
                                        if (onCancel) { onCancel() }
                                        this.setState(defaultState)
                                        this.setState({
                                            checkedValueList: [],
                                            checkedKeyList: [],
                                        })
                                        this.scrollView.style['overflow-y']='auto'
                                    }}
                                >
                                    确定
                                </span>
                            </div> : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}
