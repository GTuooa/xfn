import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import 'app/containers/Config/common/style/listStyle.less'
import 'app/containers/Config/common/style/configStyle.less'

import { Button, ButtonGroup, Icon, Container, ScrollView, Checkbox } from 'app/components'
import thirdParty from 'app/thirdParty'
import findValue from 'app/containers/Config/common/func/findValue.js'
import { throttle } from 'app/utils'

import * as relativeConfAction from 'app/redux/Config/Relative/relativeConf.action.js'

@connect(state => state)
export default
class RelativeConfApp extends React.Component {

    static displayName = 'RelativeConfApp'

    scrollView = ''
    scrollerHeight = 0
    listHeight = 0//一条卡片的高度
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
            showCheckBox: false,
            currentPage: 1,
        }
    }

    componentDidMount() {
        thirdParty.setTitle({title: '往来设置'})
        thirdParty.setRight({show: false})
        thirdParty.setIcon({showIcon: false})

        if (sessionStorage.getItem('prevPage') === 'home') {
			sessionStorage.removeItem('prevPage')
            this.props.dispatch(relativeConfAction.getRelativeListTitle())
            this.props.dispatch(relativeConfAction.getRelativeListAndTree(fromJS({'uuid':'','name':'全部'})))
        }

        this.scrollViewHtml = document.getElementsByClassName('right-content')[0]
        this.scrollerHeight = Number(window.getComputedStyle(this.scrollViewHtml).height.replace('px',''))
        this.listHtml = document.getElementsByClassName('list-html')[0]
        this.listHeight = this.listHtml ? Number(window.getComputedStyle(this.listHtml).height.replace('px','')) : 50
    }

    render() {
        const {
			dispatch,
			history,
			homeState,
            relativeConfState
		} = this.props

        const { showTree, showCheckBox, currentPage } = this.state

        const configPermissionInfo = homeState.getIn(['permissionInfo', 'Config'])
		const editPermission = configPermissionInfo.getIn(['edit', 'permission'])

        const tags = relativeConfState.get('tags')
        const activeTabKey = relativeConfState.getIn(['views','activeTapKey'])
        const activeTabKeyUuid = relativeConfState.getIn(['views','activeTapKeyUuid'])//选中的顶级类别uuid
        const relativeCardList = relativeConfState.get('relativeCardList')
        const treeList = relativeConfState.get('treeList')
        const pageCount = Math.ceil(relativeCardList.size/this.pageSize)

        const treeSelect = relativeConfState.getIn(['views','treeSelect'])//通过类别筛选卡片的信息
        let treeOneList = []
        if (treeList.size) {
            const cardNumber = treeList.getIn([0, 'cardNumber'])
            treeOneList.push({uuid: treeList.getIn([0, 'uuid']), name: treeList.getIn([0, 'name']), childList: [], cardNumber})
            treeOneList = treeOneList.concat(treeList.getIn([0, 'childList']).toJS())
        }
        const treeTwoList = treeSelect.get('treeTwoList')
        const treeThreeList = treeSelect.get('treeThreeList')
        const selectUuid = treeSelect.get('selectUuid').toJS()
        const selectName = treeSelect.get('selectName')
        const selectEndUuid = treeSelect.get('selectEndUuid')

        return(
            <Container className="relative-config">
                {/* 新布局 */}
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
                                    tags.map((item,index) => {
                                        return (
                                            <div
                                                className={activeTabKey === item.get('name') ? 'left-item active' : 'left-item'}
                                                key={item.get('uuid')}
                                                onClick = {() => {
                                                    dispatch(relativeConfAction.getRelativeListAndTree(item))
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

                                            dispatch(relativeConfAction.changeRelativeData(['views', 'treeSelect'], treeSelect.merge(fromJS({
                                                treeTwoList: treeTwoList,
                                                treeThreeList: treeThreeList,
                                                selectUuid: [twoItem['uuid'], threeItem['uuid'], selectEndUuid],
                                            }))))

                                        } 
                                    }}>
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
                                                                    newList = newList.unshift(fromJS({uuid, name: '全部', oriName: name, childList:[], cardNumber}))
                                                                } else {
                                                                    dispatch(relativeConfAction.getRelativeListBySontype(activeTabKeyUuid, uuid, name))
                                                                    this.setState({currentPage: 1, showTree: false})
                                                                    this.scrollViewHtml.scrollTop = 0
                                                                }
                                                                if (i==0) {//第一级
                                                                    dispatch(relativeConfAction.changeRelativeData(['views', 'treeSelect'], treeSelect.merge(fromJS({
                                                                        treeTwoList: newList,
                                                                        treeThreeList: [],
                                                                        selectUuid: [uuid, selectUuid[1], selectUuid[2]],
                                                                    }))))
                                                                }
                                                                if (i==1) {//第二级
                                                                    dispatch(relativeConfAction.changeRelativeData(['views', 'treeSelect'], treeSelect.merge(fromJS({
                                                                        treeThreeList: newList,
                                                                        selectUuid: [selectUuid[0], uuid, selectUuid[2]],
                                                                    }))))
                                                                }
                                                                if (i==2) {//第三级
                                                                    dispatch(relativeConfAction.changeRelativeData(['views', 'treeSelect'], treeSelect.merge(fromJS({
                                                                        selectUuid: [selectUuid[0], selectUuid[1], uuid],
                                                                    }))))
                                                                }
                                                                if (!hasChild) {
                                                                    dispatch(relativeConfAction.changeRelativeData(['views', 'treeSelect', 'selectName'], oriName ? oriName : name))
                                                                    dispatch(relativeConfAction.changeRelativeData(['views', 'treeSelect', 'selectEndUuid'], uuid))
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
                                <div className="right-content" onScroll={(e) => { this.throttleFn(e, currentPage, pageCount) }}>
                                    {
                                        relativeCardList.slice(0,currentPage*this.pageSize).map((item,index) =>{
                                            return (
                                                <div
                                                    key={item.get('uuid')} className='right-item'
                                                    onClick={() => {
                                                        if (!showCheckBox) {
                                                            const showCardModal = () => history.push('/config/relative/relativeCardInsert')
                                                            dispatch(relativeConfAction.getOneCardEdit(item.get('uuid'),showCardModal))
                                                        } else {
                                                            dispatch(relativeConfAction.checkRelativeListCardBox(!item.get('checked'),item.get('uuid')))
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

                <ButtonGroup className="border-top" disabled={!editPermission} style={{display:showCheckBox ? 'none' : ''}}>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                            const showCardModal = () => {
                                history.push('/config/relative/relativeCardInsert')
                            }
                            dispatch(relativeConfAction.beforeAddManageTypeCard(showCardModal,'insert'))
                        }}
                    >
                        <Icon type="add-plus"/>新增
                    </Button>
                    <Button disabled={!editPermission} onClick={() => this.setState({showCheckBox: true})}>
                        <Icon type="select" />选择
                    </Button>
                    <Button onClick={() => {history.push('/config/relative/relativeHighType')}}>
                        <Icon type="home" />
                        <span>类别管理</span>
                    </Button>
                </ButtonGroup>

                <ButtonGroup className="border-top" style={{display:showCheckBox ? '' : 'none'}}>
                    <Button
                        onClick={() => {
                            this.setState({showCheckBox:false})
                            dispatch(relativeConfAction.clearCardSelectList('relativeCard'))
                        }}
                    >
                        <Icon type="cancel"/>取消
                    </Button>
                    <Button
                        disabled={!editPermission}
                        onClick={() => {
                            const closeModal = () => this.setState({showCheckBox:false})
                            dispatch(relativeConfAction.deleteRelativeListCard(closeModal))
                        }}>
                        <Icon type="select" />删除
                    </Button>
                </ButtonGroup>
            </Container>
        )
    }
}
