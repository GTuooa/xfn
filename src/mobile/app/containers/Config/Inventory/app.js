import React from 'react'
import PropTypes from 'prop-types'
import { connect }	from 'react-redux'
import { toJS, fromJS, Map } from 'immutable'
import './style.less'

import { Button, ButtonGroup, Icon, Container, ScrollView, Checkbox } from 'app/components'
import thirdParty from 'app/thirdParty'
import findValue from 'app/containers/Config/common/func/findValue.js'
import { throttle } from 'app/utils'

import * as inventoryConfAction from 'app/redux/Config/Inventory/inventoryConf.action.js'
import * as allActions from 'app/redux/Home/All/other.action'

@connect(state => state)
export default
class InventoryConf extends React.Component {

    static displayName = 'InventoryConf'
    scrollerHeight = 0//滚动容器的高度
    listHeight = 50//一条卡片的高度
    listHtml = ''//一条卡片的html
    pageSize = 50//滑动一次加载50个

    throttleFn = throttle((e, currentPage,  pageCount) => {
		const scrollY = e.target.scrollTop
        if (scrollY + 100 + this.scrollerHeight >= currentPage*this.listHeight*this.pageSize && currentPage < pageCount) {
            this.setState({currentPage: currentPage+1})
        }
	})

    constructor(props) {
		super(props)
		this.state = {
            showTree:false,//显示类别选择列表
            showCheckBox:false,
            currentPage: 1,
            searchValue: '',
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '存货设置'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})

        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
            this.props.dispatch(inventoryConfAction.inventorySettingInit())
            this.props.dispatch(inventoryConfAction.inventoryAssistList())
        }

        const scrollViewHtml = document.getElementsByClassName('right-content')[0]
        this.scrollViewHtml = scrollViewHtml
        this.scrollerHeight = Number(window.getComputedStyle(scrollViewHtml).height.replace('px',''))        
    }
    componentDidUpdate () {
        if (!this.listHtml) {
            const listHtml = document.getElementsByClassName('list-html')[0]
            if (listHtml) {
                this.listHtml = listHtml
                this.listHeight = listHtml ? Number(window.getComputedStyle(listHtml).height.replace('px','')) : 50
            }
        }
    }

    render() {
        const {
			dispatch,
			history,
			homeState,
            inventoryConfState
		} = this.props

        const { showTree, showCheckBox, currentPage, searchValue, } = this.state

        const activeTabKey = inventoryConfState.getIn(['views','activeTabKey'])
        const activeTabKeyUuid = inventoryConfState.getIn(['views','activeTabKeyUuid'])//当前选中的主类别
        const typeList = inventoryConfState.get('typeList')
        const cardList = inventoryConfState.get('cardList')
        const highTypeList = inventoryConfState.get('highTypeList')

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        const stockCard = () => allActions.allExportDo('sendInventoryExcel', {})//卡片导出
        const stockOpen = () => allActions.allExportDo('exportInventoryExcel', {})//卡片期初导出
        dispatch(allActions.navigationSetMenu('config-inventory', stockCard, stockOpen))

        const pageCount = Math.ceil(cardList.size/this.pageSize)//总共多少页

        const treeSelect = inventoryConfState.getIn(['views','treeSelect'])//通过类别筛选卡片的信息

        let treeOneList = []
        if (typeList.size) {
            const firstChild = typeList.get(0)
            treeOneList.push({uuid: firstChild.get('uuid'), name: firstChild.get('name'), childList: [], cardNumber: firstChild.get('cardNumber')})
            treeOneList = treeOneList.concat(typeList.getIn([0, 'childList']).toJS())
        }
        const treeTwoList = treeSelect.get('treeTwoList')
        const treeThreeList = treeSelect.get('treeThreeList')
        const selectUuid = treeSelect.get('selectUuid').toJS()
        const selectName = treeSelect.get('selectName')
        const selectEndUuid = treeSelect.get('selectEndUuid')

        return(
            <Container className="inventory-config">

                <ScrollView flex='1' className="border-top">{/*style={{marginTop: '.1rem'}}*/}
                    <div className='setting-wrap'>
                        {/* <div className='setting-wrap-serach'>
                            <Icon type='search'/>
                            <XfInput
                                className='setting-wrap-serach-input'
                                placeholder='搜索卡片'
                                value={searchValue}
                                onChange={(value) => this.setState({searchValue: value})}
                            />
                        </div> */}
                        <div className='setting-wrap-content'>
                            <div className='setting-wrap-content-left'>
                                {
                                    highTypeList.map((item,index) => {
                                        return (
                                            <div
                                                className={activeTabKey === item.get('name') ? 'left-item active' : 'left-item'}
                                                key={item.get('uuid')}
                                                onClick = {() => {
                                                    dispatch(inventoryConfAction.changeActiveHighType(item))
                                                    this.setState({ currentPage: 1, showTree: false })
                                                    this.scrollViewHtml.scrollTop = 0
                                                }}
                                            >
                                                <span className='text' style={{"WebkitBoxOrient": "vertical"}}>{item.get('name')}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='setting-wrap-content-right'>
                                <div className="right-item list-html" style={{display: activeTabKeyUuid ? '' : 'none'}} 
                                    onClick={() => {
                                        this.setState({showTree: !showTree})
                                        if (!showTree && selectEndUuid) {//变为展示时
                                            const valueList = findValue(selectEndUuid, treeOneList)
                                            let twoItem = valueList[0]
                                            let treeTwoList = twoItem['childList']
                                            if (treeTwoList.length) {
                                                treeTwoList.unshift({uuid: twoItem['uuid'], name: '全部', oriName: twoItem['name'], childList:[]})
                                            }

                                            let threeItem = valueList[1] ? valueList[1] : {uuid: '', childList: []}
                                            let treeThreeList = threeItem['childList']
                                            if (treeThreeList.length) {
                                                treeThreeList.unshift({uuid: threeItem['uuid'], name: '全部', oriName: threeItem['name'], childList:[]})
                                            }

                                            dispatch(inventoryConfAction.changeData(['views', 'treeSelect'], treeSelect.merge(fromJS({
                                                treeTwoList: treeTwoList,
                                                treeThreeList: treeThreeList,
                                                selectUuid: [twoItem['uuid'], threeItem['uuid'], selectEndUuid],
                                            }))))

                                        } 
                                    }}
                                >
                                    <span>{selectName ? selectName : activeTabKey}</span>
                                    <Icon type="triangle" style={showTree ? {transform: 'rotate(180deg)'} : ''}/>
                                </div>
                                <div className={`tree-content-hidden ${showTree ? 'tree-content' : ''}`} onClick={() => this.setState({showTree: false})}>
                                    {fromJS([treeOneList, treeTwoList, treeThreeList]).map((list, i) => {
                                        return (
                                            <div className={`tree-list ${list.size ? `bg-f${i}`: ''}`} key={`level_${i}`}>
                                                {list.map(v => {
                                                    const uuid = v.get('uuid')
                                                    const name = v.get('name')
                                                    const oriName = v.get('oriName')
                                                    const hasChild = v.get('childList').size
                                                    const cardNumber = v.get('cardNumber')
                                                    return (
                                                        <div
                                                            className={uuid == selectUuid[i] ? 'tree-item active' : 'tree-item'}
                                                            key={uuid}
                                                            onClick = {(e) => {
                                                                let newList = []
                                                                if (hasChild) {
                                                                    newList = v.get('childList')
                                                                    newList = newList.unshift(fromJS({uuid, name: '全部', oriName: name, cardNumber, childList:[]}))
                                                                } else {
                                                                    dispatch(inventoryConfAction.getCardListByType(activeTabKeyUuid,uuid, name))                                                                    
                                                                    this.setState({currentPage: 1, showTree: false})
                                                                    this.scrollViewHtml.scrollTop = 0
                                                                }
                                                                if (i==0) {//第一级
                                                                    dispatch(inventoryConfAction.changeData(['views', 'treeSelect'], treeSelect.merge(fromJS({
                                                                        treeTwoList: newList,
                                                                        treeThreeList: [],
                                                                        selectUuid: [uuid, selectUuid[1], selectUuid[2]],
                                                                    }))))
                                                                }
                                                                if (i==1) {//第二级
                                                                    dispatch(inventoryConfAction.changeData(['views', 'treeSelect'], treeSelect.merge(fromJS({
                                                                        treeThreeList: newList,
                                                                        selectUuid: [selectUuid[0], uuid, selectUuid[2]],
                                                                    }))))
                                                                }
                                                                if (i==2) {//第三级
                                                                    dispatch(inventoryConfAction.changeData(['views', 'treeSelect'], treeSelect.merge(fromJS({
                                                                        selectUuid: [selectUuid[0], selectUuid[1], uuid],
                                                                    }))))
                                                                }
                                                                if (!hasChild) {
                                                                    dispatch(inventoryConfAction.changeData(['views', 'treeSelect', 'selectName'], oriName ? oriName : name))
                                                                    dispatch(inventoryConfAction.changeData(['views', 'treeSelect', 'selectEndUuid'], uuid))
                                                                }
                                                                e.stopPropagation()
                                                            }}
                                                        >
                                                            <div className='overElli'>{name}{cardNumber ? `(${cardNumber})` : null}</div>
                                                            { hasChild ? <Icon type="arrow-right"/> : null }
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="right-content"
                                    onScroll={(e) => { this.throttleFn(e, currentPage, pageCount) }}
                                    >
                                    {
                                        cardList.slice(0,currentPage*this.pageSize).map((item,index) =>{
                                            return (
                                                <div
                                                    key={item.get('uuid')} className='right-item'
                                                    onClick={() => {
                                                        if (!showCheckBox) {
                                                            const showCardModal = () => history.push('/config/inventory/inventoryInsert')
                                                            dispatch(inventoryConfAction.beforeEditCard(item,showCardModal))
                                                        } else {
                                                            dispatch(inventoryConfAction.changeCardBoxStatus(!item.get('checked'),item.get('uuid')))
                                                        }
                                                    }}
                                                >
                                                    <span className='item-checkbox' style={{display: showCheckBox ? '' : 'none'}}>
                                                        <Checkbox checked={item.get('checked')}/>
                                                    </span>
                                                    <span className="right-item-left text" style={{"WebkitBoxOrient": "vertical"}}>
                                                        {item.get('code')}_{item.get('name')}
                                                    </span>
                                                    <Icon type="arrow-right"/>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollView>

                <ButtonGroup className="border-top" style={{display:showCheckBox ? 'none' : 'flex'}}>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                            const showCardModal = () => {
                                history.push('/config/inventory/inventoryInsert')
                            }
                            dispatch(inventoryConfAction.beforeAddCard(showCardModal))
                        }}
                    >
                        <Icon type="add-plus"/>
                        <span>新增</span>
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => this.setState({showCheckBox:true})}
                        >
                        <Icon type="select" />
                        <span>选择</span>
                    </Button>
                    <Button onClick={() => {history.push('/config/inventory/inventoryHighType')}}>
                        <Icon type="home" />
                        <span>类别管理</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup className="border-top" style={{display:showCheckBox ? 'flex' : 'none'}}>
                    <Button
                        onClick={() => {
                            dispatch(inventoryConfAction.clearCardSelectList('cardList'))
                            this.setState({showCheckBox:false})
                        }}
                    >
                        <Icon type="cancel"/>
                        <span>取消</span>
                    </Button>
                    <Button onClick={() => {
                        const closeModal = () => this.setState({showCheckBox:false})
                        dispatch(inventoryConfAction.deleteCardList(closeModal))
                    }}>
                        <Icon type="delete" />
                        <span>删除</span>
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
