import React, { Component } from 'react'
import { fromJS, toJS } from 'immutable'
import { Icon, Checkbox, TextListInput } from 'app/components'
import { throttle } from 'app/utils'
import './style.less'

const nameList = [
    {label: 'itemOneName', key: 'itemOneUuid', data: 'district'},
    {label: 'itemTwoName', key: 'itemTwoUuid', data: 'itemTwoList'},
    {label: 'itemThreeName', key: 'itemThreeUuid', data: 'itemThreeList'},
    {label: 'itemFourName', key: 'itemFourUuid', data: 'itemFourList'},
]
const defaultState = {
    show: false,
    selectIdx: 0,//当前被选中的下标
    currentPage: 1,//卡片当前的页数
    itemTwoList: [],
    itemThreeList: [],
    itemFourList: [],
    itemOneName: '请选择',
    itemTwoName: '',
    itemThreeName: '',
    itemFourName: '',
    itemOneUuid: '',
    itemTwoUuid: '',
    itemThreeUuid: '',
    itemFourUuid: '',
    checkedValueList: [],
    checkedKeyList: [],
    clickIcon: false,
    categoryList: [],
    isSearch: false,
    searchValue: '',
}

function scrollFn (e, currentPage, pageCount) {
    const scrollY = e.target.scrollTop
    if (scrollY + 100 + this.scrollerHeight >= currentPage*this.pageSize*this.listHeight && currentPage < pageCount) {
        this.setState({currentPage:currentPage+1})
    }
}


export default class CardSelect extends Component {
    scrollView = ''
    scrollerHeight = 0
    listHeight = 0//一条卡片的高度
    pageSize = 50//滑动一次加载50个
    state = defaultState
    throttleFn = throttle(scrollFn.bind(this))

    componentDidMount () {
        const scrollViewHtml = document.getElementsByClassName('scroll-view')[0]
        this.scrollView = scrollViewHtml ? scrollViewHtml : {style: {'overflow-y' : ''}}
    }

    setDefault (props, fromItem, itemKey) {
        const value = fromItem ? itemKey : props.value
        const district = props.district

        let itemArr = []
        let selectIdx = 0
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

        if (value || value == '') {
            loop(district, 0)
            this.setState({ selectIdx: selectIdx, currentPage: 1 })

            let itemTwoList = []
            let itemThreeList = []
            let itemFourList = []
            let dataList = [district, itemTwoList, itemThreeList, itemFourList]

            if (isFind) {
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

        }

        if (fromItem) {
            return
        }

        //卡片多选时
        if (props.multiSelect) {
            let checkedkeyListOrigin = []
            let checkedValueListOrigin = []

            if (props.cardValue.length) {
                props.cardValue.forEach(v => {
                    checkedValueListOrigin.push(v)
                    for (const item of props.cardList) {
                        if (item['uuid']==v) {
                            checkedkeyListOrigin.push(item['name'])
                            break
                        }
                    }
                })
            }

            this.setState({
                'checkedValueList': checkedValueListOrigin,
                'checkedKeyList': checkedkeyListOrigin,
            })
        }

    }

    componentWillReceiveProps (nextProps) {
        if (this.props.visible != nextProps.visible && nextProps.visible) {
            this.setState({show: true})
            this.setDefault(nextProps)
        } else if (this.props.visible != nextProps.visible) {
            this.setState(defaultState)
        }
    }


    render() {
        const { district, cardList, value, title, onChange, disabled, className, multiSelect, visible, onCancel, onOk, cardValue, icon } = this.props

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
            itemFourUuid,
            currentPage,
            checkedValueList,
            checkedKeyList,
            clickIcon,
            categoryList,
            isSearch,
            searchValue
        } = this.state

        let currentCategoryList = [district, itemTwoList, itemThreeList, itemFourList][selectIdx]
        if (clickIcon) {
            currentCategoryList = categoryList
        }
        let filterCardList = cardList
        if (isSearch && searchValue) {
            filterCardList = filterCardList.filter(v => v['name'].includes(searchValue))
        }
        const pageCount = Math.ceil(filterCardList.length/this.pageSize)

        return (
            <div className={['chosenpicker', className].join(' ')}
                onClick={() => {
                    if (disabled) { return }
                    this.setState({show: true})
                    this.setDefault(this.props)
                }}
            >
                { this.props.children ? this.props.children : <div className='chosenpicker-caption'>请选择</div> }
                {/* 蒙层内容 */}
                <div
                    className={`chosenpicker-mask ${show ? 'chosenpicker-animate' : 'chosenpicker-none-animate'}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        this.scrollView.style['overflow-y']='auto'
                        this.setState({ show: false, isSearch: false, searchValue: '' })
                        if (onCancel) {
                            onCancel()
                        }
                    }}
                >
                    <div className={`chosenpicker-popup ${show ? 'chosenpicker-popup-animate' : 'chosenpicker-popup-none-animate'}`}>
                        <div className='chosenpicker-title-card' onClick={(e) => e.stopPropagation()}>

                            <div className='chosenpicker-title-warp' style={{display: isSearch ? 'none' : ''}}>
                                {
                                    icon ? <span className="title-left-icon" onClick={() => { icon.onClick() }}>
                                            <Icon type={icon['type']} />
                                        </span>
                                    : <span className="title-left-icon"></span>
                                }
                                <span>{title ? title : '请选择'}</span>
                                <Icon type='search' className='no-search' onClick={() => this.setState({isSearch: true})}/>
                            </div>
                            
                            <div className='chosenpicker-search' style={{display: isSearch ? '' : 'none'}}>
                                <Icon type='search'/>
                                <TextListInput
                                    className='chosenpicker-input'
                                    placeholder='请输入搜索的内容'
                                    value={searchValue}
                                    onChange={(value) => this.setState({searchValue: value})}
                                />
                                <span className='chosenpicker-cancel' onClick={() => this.setState({searchValue: '', isSearch: false})}>
                                    取消
                                </span>
                            </div>
                        </div>

                        <ul className='chosenpicker-select-title'
                            style={{display: !isSearch && itemOneName ? '' : 'none'}}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {[itemOneName, itemTwoName, itemThreeName, itemFourName].map((v, i)=> {
                                return (
                                    <li
                                        key={i}
                                        style={{display: v=='' ? 'none' : ''}}
                                        className={ i == selectIdx ? 'overElli chosenpicker-select-title-active' : 'overElli' }
                                        onClick={(e)=>{
                                            e.stopPropagation()
                                            this.setState({ selectIdx: i, clickIcon: false })
                                        }}
                                    >
                                        <span>{v.length >10 ? `${v.slice(0,10)}...` : v} </span>
                                        <span>{[itemOneName, itemTwoName, itemThreeName, itemFourName][i+1] ? <Icon type="arrow-right" /> : ''}</span>
                                    </li>
                                )
                            })}
                        </ul>

                        <ul className={`chosenpicker-content`} onClick={(e) => e.stopPropagation()}>
                            {/* 类别 */}
                            <li className='chosenpicker-item' style={{display: isSearch ? 'none' : ''}}>
                                {currentCategoryList.map((v, i) => {
                                    const hasChild = v['childList'].length ? true : false
                                    const key = v['key']
                                    const disabled = v['disabled']
                                    let classNameStr = ''
                                    if (v['key'] == [itemOneUuid, itemTwoUuid, itemThreeUuid, itemFourUuid][selectIdx]) {
                                        classNameStr = 'chosenpicker-item-active'
                                    }
                                    if (v['disabled']) {
                                        classNameStr = 'chosenpicker-item-disabled'
                                    }
                                    return (
                                        <div key={key}
                                            className={classNameStr}
                                            onClick={() => {
                                                if (disabled) {
                                                    return
                                                }
                                                if (hasChild) {
                                                    this.setState({
                                                        clickIcon: true,
                                                        categoryList: v['childList']
                                                    })
                                                } else {
                                                    this.setDefault(this.props, true, key)
                                                    onChange(v);
                                                }
                                            }}
                                        >
                                            <span className="muti-line-ellipsis"  style={{WebkitBoxOrient: "vertical", flex: '1'}}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (disabled) {
                                                        return
                                                    }
                                                    this.setDefault(this.props, true, key)
                                                    onChange(v);
                                                }}
                                            >
                                                {v['label']}
                                            </span>
                                            { hasChild ? <span className='icon-wrap'><Icon type="next-level"/></span> : null }
                                        </div>
                                    )
                                })}
                            </li>
                            {/* 卡片 */}
                            <li className={isSearch ? 'chosenpicker-item chosenpicker-item-search' : 'chosenpicker-item'}
                                ref={(scrollerCard)=>{
                                    if (!this.scrollerHeight && scrollerCard) {
                                        this.scrollerHeight = Number(window.getComputedStyle(scrollerCard).height.replace('px',''))
                                    }
                                }}
                                onScroll={(e)=>{
                                    this.throttleFn(e, currentPage, pageCount)
                                }}
                            >
                                {filterCardList.slice(0,currentPage*this.pageSize).map((v, i) => {
                                    const key = v['uuid']
                                    let hasSelected = cardValue.includes(key)
                                    if (multiSelect) {
                                        hasSelected = checkedValueList.includes(key)
                                    }

                                    let classNameStr = ''
                                    if (hasSelected) {
                                        classNameStr = 'chosenpicker-item-active'
                                    }
                                    if (v['disabled']) {
                                        classNameStr = 'chosenpicker-item-disabled'
                                    }
                                    return (
                                        <div key={key}
                                            ref={i==0 ? (scrollerCardItem) => {
                                                if (!this.listHeight && scrollerCardItem) {
                                                    this.listHeight = Number(window.getComputedStyle(scrollerCardItem).height.replace('px',''))
                                                }
                                            } : null}
                                            className={classNameStr}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (v['disabled']) { return }
                                                if (multiSelect) {//多选
                                                    if (hasSelected) {//从选中到未选中
                                                        let idx = checkedValueList.findIndex(item => item == key)
                                                        checkedValueList.splice(idx, 1)
                                                        checkedKeyList.splice(idx, 1)
                                                    } else {
                                                        checkedValueList.push(key)
                                                        checkedKeyList.push(v['name'])
                                                    }
                                                    this.setState({checkedValueList: checkedValueList, checkedKeyList: checkedKeyList})
                                                    this.scrollView.style['overflow-y']='hidden'
                                                } else {
                                                    this.setState({ show: false, isSearch: false, searchValue: '' })
                                                    this.scrollView.style['overflow-y']='auto'
                                                    onOk([v])
                                                    if (onCancel) { onCancel() }
                                                }
                                            }}
                                        >
                                            <span className="muti-line-ellipsis" style={{WebkitBoxOrient: "vertical"}}>{v['name']}</span>
                                            { !multiSelect && hasSelected ? <Icon type="tick"/> : null }
                                            { multiSelect ? <Checkbox checked={hasSelected}/> : null}
                                        </div>
                                    )
                                })}
                            </li>
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
                                        checkedValueList.forEach(v => {
                                            cardList.forEach(w => {
                                                if (w['uuid']==v) {
                                                    arr.push(w)
                                                }
                                            })
                                        })
                                        onOk(arr)
                                        this.setState({ show: false, isSearch: false, searchValue: '' })
                                        this.scrollView.style['overflow-y']='auto'
                                        if (onCancel) { onCancel() }
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
