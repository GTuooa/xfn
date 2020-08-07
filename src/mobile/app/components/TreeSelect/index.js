import React, { Component } from 'react'
import { fromJS, toJS } from 'immutable'
import { Icon } from 'app/components'

import './style.less'

const nameList = [
    {name: 'itemOneName', uuid: 'itemOneUuid', data: 'district'},
    {name: 'itemTwoName', uuid: 'itemTwoUuid', data: 'itemTwoList'},
    {name: 'itemThreeName', uuid: 'itemThreeUuid', data: 'itemThreeList'},
    {name: 'itemFourName', uuid: 'itemFourUuid', data: 'itemFourList'},
]

export default class TreeSelect extends Component {
    scrollView = ''
    state = {
        show: false,
        itemTwoList: [],
        itemThreeList: [],
        itemFourList: [],
        itemOneName: '请选择',
        itemTwoName: '',
        itemThreeName: '',
        itemFourName: '',
        selectIdx: -1,//当前被选中的下标
        itemOneUuid: '',
        itemTwoUuid: '',
        itemThreeUuid: '',
        itemFourUuid: ''
    }
    componentDidMount () {
        this.scrollView = document.getElementsByClassName('scroll-view')[0] ? document.getElementsByClassName('scroll-view')[0] : {style: {'overflow-y' : ''}}
    }

    setDefault (value, district) {
        let itemArr = []
        let selectIdx = '0'
        let isFind = false
        this.scrollView.style['overflow-y']='hidden'//解决ios Fixed定位不准确

        const loop = (data, level) => {
            data.map((item, idx) => {
                if (isFind) {
                    return
                }
                if (item['uuid'] == value) {
                    isFind = true
                    selectIdx = level
                    itemArr.push({uuid: item['uuid'], name: item['name'], idx: idx})
                    return
                }
                if (item['childList'].length) {
                    itemArr.push({uuid: item['uuid'], name: item['name'], idx: idx})
                    loop(item['childList'], level+1)
                }
            })

            if (!isFind) {
                itemArr.pop()
            }

        }

        if (value || value == '') {
            loop(district, 0)
            this.setState({ selectIdx: selectIdx-1 })

            let itemTwoList = []
            let itemThreeList = []
            let itemFourList = []
            let dataList = [district, itemTwoList, itemThreeList, itemFourList]

            nameList.forEach((v, i) => {
                if (i < itemArr.length) {
                    this.setState({
                        [nameList[i]['uuid']]: itemArr[i]['uuid'],
                        [nameList[i]['name']]: itemArr[i]['name']
                    })
                    if ( i > 0 ) {
                        dataList[i] = dataList[i-1][itemArr[i-1]['idx']]['childList']
                        this.setState({
                            [nameList[i]['data']]: dataList[i]
                        })
                    }
                } else {
                    this.setState({
                        [nameList[i]['uuid']]: '',
                        [nameList[i]['name']]: '',
                        [nameList[i]['data']]: []
                    })
                }
            })
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.visible) {
            this.setState({show: true})
        } else if (nextProps.visible == false) {
            this.setState({
                itemTwoList: [],
                itemThreeList: [],
                itemFourList: [],
                itemOneName: '请选择',
                itemTwoName: '',
                itemThreeName: '',
                itemFourName: '',
                selectIdx: -1,//当前被选中的下标
                itemOneUuid: '',
                itemTwoUuid: '',
                itemThreeUuid: '',
                itemFourUuid: ''
            })
        }
    }



    render() {
        const { district, value, title, onChange, disabled, className, notLast, visible, onCancel } = this.props
        //notLast 如果为true 则所有类别都可以点击 否则只能选中末级类别
        const {
            show,
            itemTwoList,
            itemThreeList,
            itemFourList,
            itemOneName,
            itemTwoName,
            itemThreeName,
            itemFourName,
            selectIdx,
            itemOneUuid,
            itemTwoUuid,
            itemThreeUuid,
            itemFourUuid
        } = this.state
        //district [{uuid: '', name: '', disabled: '', childList}] //value； string
        //value str 末级类别的uuid
        const translateName = ['xfn-tree-pre', 'xfn-tree-next', 'xfn-tree-next-next', 'xfn-tree-next-next'][selectIdx+1==0 ? 0 : selectIdx]

        return (
            <div className={className}
                onClick={() => {
                    if (disabled) { return }
                    this.setState({show: true})
                    this.setDefault(value, district)
                }}
            >
                { this.props.children ? this.props.children : <div className='xfn-tree-caption'>请选择</div> }
                {/* 蒙层内容 */}
                <div
                    className={`xfn-tree ${show ? 'xfn-tree-animate' : 'xfn-tree-none-animate'}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        this.scrollView.style['overflow-y']='auto'
                        this.setState({ show: false })
                        if (onCancel) {
                            onCancel()
                        }
                    }}
                >
                    <div className={`xfn-tree-popup ${show ? 'xfn-tree-popup-animate' : 'xfn-tree-popup-none-animate'}`}>
                        <div className='xfn-tree-title' onClick={(e) => e.stopPropagation()}>
                            {title ? title : '请选择'}
                        </div>

                        <ul className='xfn-tree-select-title'>
                            {[itemOneName, itemTwoName, itemThreeName, itemFourName].map((v, i)=> {
                                return (
                                    <li key={i}
                                        style={{display: v=='' ? 'none' : ''}}
                                        className={ i == selectIdx+1 ? 'overElli xfn-tree-select-title-active' : 'overElli' }
                                        onClick={(e)=>{
                                            e.stopPropagation()
                                            this.setState({ selectIdx: i-1 })
                                        }}
                                    >
                                        {v}
                                    </li>
                                )
                            })}
                        </ul>

                        <ul className={`xfn-tree-content ${translateName} xfn-tree-move-animate`} onClick={(e) => e.stopPropagation()}>
                            {
                                [district, itemTwoList, itemThreeList, itemFourList].map((item, idx) => {
                                    return (
                                        <li key={idx} className='xfn-tree-item'>
                                            {item.map((v, i) => {
                                                const hasChild = v['childList'].length ? true : false
                                                const uuid = v['uuid']
                                                let classNameStr = ''
                                                if (v['uuid'] == [itemOneUuid, itemTwoUuid, itemThreeUuid, itemFourUuid][idx]) {
                                                    classNameStr = 'xfn-tree-item-active'
                                                }
                                                if (v['disabled']) {
                                                    classNameStr = 'xfn-tree-item-disabled'
                                                }
                                                return (
                                                    <div key={uuid}
                                                        className={classNameStr}
                                                        onClick={() => {
                                                            if (v['disabled']) {
                                                                return
                                                            }
                                                            if (notLast) {
                                                                onChange(v)
                                                                this.setState({ show: false })
                                                                this.scrollView.style['overflow-y']='auto'
                                                                return
                                                            }
                                                            if (hasChild) {//有子集
                                                                this.setState({ selectIdx: idx })
                                                                nameList.forEach((nameItem, i) => {
                                                                    if (i == idx) {
                                                                        this.setState({
                                                                            [nameList[i]['uuid']]: uuid,
                                                                            [nameList[i]['name']]: v['name']
                                                                        })
                                                                    }
                                                                    if (i == idx+1) {
                                                                        this.setState({
                                                                            [nameList[i]['uuid']]: '',
                                                                            [nameList[i]['name']]: '请选择',
                                                                            [nameList[i]['data']]: v['childList']
                                                                        })
                                                                    }
                                                                    if (i > idx+1) {
                                                                        this.setState({
                                                                            [nameList[i]['uuid']]: '',
                                                                            [nameList[i]['name']]: '',
                                                                            [nameList[i]['data']]: []
                                                                        })
                                                                    }

                                                                })
                                                            } else {
                                                                onChange(v)
                                                                this.setState({ show: false })
                                                                this.scrollView.style['overflow-y']='auto'
                                                            }
                                                        }}
                                                    >
                                                        <span className='overElli'>{v['name']}</span>
                                                        { hasChild ? <Icon type="arrow-right"
                                                            onClick={(e) => {
                                                                if (notLast) {
                                                                    e.stopPropagation()
                                                                    this.setState({ selectIdx: idx })
                                                                    nameList.forEach((nameItem, i) => {
                                                                        if (i == idx) {
                                                                            this.setState({
                                                                                [nameList[i]['uuid']]: uuid,
                                                                                [nameList[i]['name']]: v['name']
                                                                            })
                                                                        }
                                                                        if (i == idx+1) {
                                                                            this.setState({
                                                                                [nameList[i]['uuid']]: '',
                                                                                [nameList[i]['name']]: '请选择',
                                                                                [nameList[i]['data']]: v['childList']
                                                                            })
                                                                        }
                                                                        if (i > idx+1) {
                                                                            this.setState({
                                                                                [nameList[i]['uuid']]: '',
                                                                                [nameList[i]['name']]: '',
                                                                                [nameList[i]['data']]: []
                                                                            })
                                                                        }

                                                                    })
                                                                }
                                                            }}
                                                        /> : null }
                                                    </div>
                                                )
                                            })}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
