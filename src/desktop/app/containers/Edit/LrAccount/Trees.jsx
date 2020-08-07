import React, { PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { fromJS, toJS, is } from 'immutable'

import * as lrAccountActions from 'app/redux/Edit/LrAccount/lrAccount.action.js'
import { Tree, Tooltip, Input } from 'antd'
import { Icon } from 'app/components'
const TreeNode = Tree.TreeNode
import * as Limit from 'app/constants/Limit.js'
import * as homeActions from 'app/redux/Home/home.action.js'
const Search = Input.Search
@immutableRenderDecorator
export default
class Trees extends React.Component {
    constructor() {
        super()
        this.state = {
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
        }


    }
    componentDidMount() {
          this.setState({
            expandedKeys:this.props.category.getIn([0, 'childList']).toJS().filter(v => v.categoryType === 'LB_YYSR' || v.categoryType === 'LB_YYZC' || v.categoryType === 'LB_FYZC').map(v => v.uuid)
        })
    }
    componentWillReceiveProps(nextprops) {
        if(!is(nextprops.category.getIn([0, 'childList']),this.props.category.getIn([0, 'childList'])) && nextprops.category.getIn([0, 'childList']) && nextprops.category.getIn([0, 'childList']).size) {
              this.setState({
                expandedKeys:nextprops.category.getIn([0, 'childList']).toJS().filter(v => v.categoryType === 'LB_YYSR' || v.categoryType === 'LB_YYZC' || v.categoryType === 'LB_FYZC').map(v => v.uuid)
            })
        }

    }
    onExpand = (expandedKeys) => {
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
    }
    onChange = (value,dataList,category) => {
        let chooseList = []
        dataList.map((item) => {
            if (item.key.indexOf(value) > -1) {
              chooseList.push(item.value)
            }
        })
        const expandedKeys = chooseList

        this.setState({
          expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        });
    }
	render() {
		const {
            category,
            onSelect,
            selectedKeys,
            flags,
            dispatch,
            hideCategoryList,
            disabledChangeCategory,
            cardTemp,
            className,
            homeState
        } = this.props
        const { searchValue, expandedKeys, autoExpandParent } = this.state
        const configPermission = homeState.getIn(['permissionInfo','Config','edit','permission'])

        const loop = (data, defaultExpandedKeys, runningInsertOrModify, specialStateforAssets, level, dataList) => data.map((item, i) => {

            let dataKey = `${item.remark}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.runningAbstract}`
            let title = dataKey.indexOf(searchValue) > -1 && searchValue!='' ? <span style={{color: '#f50'}}>{item.name}</span> : <span>{item.name}</span>
            if (item.childList.length) {
                dataList.push({
                    key:`${item.remark}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.runningAbstract}`,
                    value:`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}hasChild${Limit.TREE_JOIN_STR}'cantClick'`
                })
                // let dataKey = `${item.remark}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.runningAbstract}`
                // let title = dataKey.indexOf(searchValue) > -1 ? <span style={{color: '#f50'}}>{item.name}</span> : <span>{item.name}</span>
                return (
                    <TreeNode
                        key={item.uuid}
                        title={
                            <div className="tree-icon-title">
                                {
                                item.level ===1?
                                '':
                                <span >
                                    <Tooltip placement="left" title={item.remark}>
                                        <span className='icon-tips'>?</span></Tooltip>
                                </span>
                                }
                                {title}
                            </div>
                        }
                        disabled={level === 1 && !item.childList.length && !item.beSpecial}

                    >
        				{loop(item.childList,defaultExpandedKeys, runningInsertOrModify, specialStateforAssets,level+1,dataList)}

        			</TreeNode>
        		)
        	}
            dataList.push({
                key:`${item.remark}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}${item.runningAbstract}`,
                value:`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}hasnoChild${Limit.TREE_JOIN_STR}${level > 1 || item.beSpecial ? 'canClick' : 'cantClick'}`
            })
                return item.level !== 1 || item.beSpecial ? <TreeNode
                        key={`${item.uuid}${Limit.TREE_JOIN_STR}${item.name}${Limit.TREE_JOIN_STR}hasnoChild${Limit.TREE_JOIN_STR}${level > 1  || item.beSpecial ? 'canClick' : 'cantClick'}`}
                        title={
                            <div className="tree-icon-title">
                                {
                                item.level ===1 ?
                                '':
                                <span >
                                    <Tooltip placement="left" title={item.remark}>
                                        <span className='icon-tips'>?</span></Tooltip>
                                </span>
                                }
                                {title}
                            </div>
                        }
                        checkable
                        disabled={runningInsertOrModify === 'modify' || specialStateforAssets || item.level === 1 && !item.childList.length && !item.beSpecial}
                        className={!item.childList.length && item.disableList.length ? 'block-hidden':''}
                      >
                      </TreeNode>:''

        })

        const PageTab = flags.get('PageTab')
        const accountType = flags.get('accountType')
        const paymentType = flags.get('paymentType')
        const modify = flags.get('modify')
        const disabledManagement  = (modify || accountType === 'single') && (paymentType === 'LB_SFGL' || paymentType === 'LB_GGFYFT' || paymentType === 'LB_JZSY')
        let defaultExpandedKeys=['全部']
        const isQueryByBusiness = flags.get('isQueryByBusiness')
        const specialStateforAssets = flags.get('specialStateforAssets')
        const runningInsertOrModify = flags.get('runningInsertOrModify')
        const handleAmount = cardTemp.get('handleAmount')
        let dataList = []
        const treeList = loop(category.getIn([0, 'childList']).toJS(), defaultExpandedKeys, runningInsertOrModify, specialStateforAssets,1,dataList)
        return (
            <div>
            <div style={{display:PageTab === 'business'?'':'none'}}>
                <div className="tree-title-handle">
                    <Search className='lrls-search-tree' placeholder="搜索"  onSearch={(value) =>this.onChange(value,dataList,category.getIn([0, 'childList']).toJS())}/>
                    <Icon type="setting" className='lrls-setting-icon' title='流水设置' style={{color: configPermission ? '' : '#eee' }} onClick={()=>{
                        if(configPermission){
                            dispatch(homeActions.addPageTabPane('ConfigPanes', 'Running', 'Running', '流水设置'))
                            dispatch(homeActions.addHomeTabpane('Config', 'Running', '流水设置'))
                        }

                    }}/>
                </div>
                <Tree
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}

                    // defaultExpandAll={true}
                    defaultExpandParent={true}
                    // defaultExpandedKeys={defaultExpandedKeys}
                    onSelect={value => onSelect(value,this,expandedKeys)}
                    selectedKeys={selectedKeys}
                    >
                        {treeList}
                </Tree>
            </div>
            <div style={{display:PageTab === 'business'?'none':''}}>
                <Tree
                    // defaultExpandAll={true}
                    onSelect={value => {
                        if (value[0]) {
                            const valueList = value[0].split(Limit.TREE_JOIN_STR)
                            dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'paymentType'], valueList[0]))
                            dispatch(lrAccountActions.changeLrAccountCommonString('', ['flags', 'paymentUuid'], valueList[1]))
                        }
                    }}
                    selectedKeys={[paymentType]}
                    >
                        {
                            hideCategoryList && hideCategoryList.size ? hideCategoryList.map(item => {
                                return <TreeNode key={`${item.get('categoryType')}`} title={item.get('name')} disabled={ (paymentType !== item.get('categoryType') && disabledChangeCategory) || disabledManagement}></TreeNode>
                            })
                            :
                            null
                        }
    			</Tree>
            </div>
        </div>
		)
	}
}
