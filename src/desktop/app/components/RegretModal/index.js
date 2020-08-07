import React from 'react'
import { connect }	from 'react-redux'
import { is ,fromJS } from 'immutable'
import { Button, Modal, Icon, Select, Checkbox, Input, Pagination, Progress, message, Tooltip } from 'antd'
import { XfnIcon, UpperClassSelect } from 'app/components'
import XfnSelect from 'app/components/XfnSelect'
const Option = Select.Option
import * as Limit from 'app/constants/Limit.js'
import './style.less'
import { ROOTPKT } from 'app/constants/fetch.account.js'


@connect(state => state)
export default
class RegretModal extends React.Component {
    state = {
        cardCategory:this.props.categoryList.get(0),
        cardCategorySon:fromJS({}),
        isBatch:false,
        isUnifyBefore:false,
        UnifyWords:'',
        oneCardItem:fromJS({}),
        checkList:[],
        currentPage:1,
        confirmModal:false
    }
    render() {
        const {
            visible,
            fromPage,
            categoryList,
            cardList,
            changeCategoryFunc,
            regretPages,
            onCancel,
            regretFunc,
            regretResultList,
            regretResultIndex,
            open,
            regretResultKey,
            downloadResult,
            downloadBefore,
            checkUsed,
            usedCardList,
            cardTypeList,
            homeState
        } = this.props
        const {
            cardCategory,
            isBatch,
            isUnifyBefore,
            UnifyWords,
            oneCardItem,
            currentPage,
            checkList,
            confirmModal,
            cardCategorySon
        } = this.state
        const name = {
            'relative':'往来卡片',
            'project':'项目卡片',
            'inventory':'存货卡片'
        }[fromPage]
        let newCheckList = []
        if (isUnifyBefore){
            checkList.forEach(v => {
                    const newCode = (UnifyWords || '') + (v.newCode || '')
                    newCheckList.push({...v,newCode})
            })
        } else {
            newCheckList = checkList
        }
        const RUNNING = homeState.getIn(['data','userInfo','moduleInfo','RUNNING'])
        newCheckList.sort((a,b) => a.code.toUpperCase() > b.code.toUpperCase() ? 1 : -1)
        return(
            <div>

            <Modal
                visible={visible}
                title='反悔模式'
                width={800}
                okText='信息确认'
                maskClosable={false}
                onCancel={() => onCancel()}
                onOk={() => {
                    if (!isBatch?!oneCardItem.get('uuid') : !checkList.length) {
                        message.info('请选择卡片')
                    } else if (isBatch?checkList.some(v=> !v.newCode):!oneCardItem.get('newCode')) {
                        message.info('新编码不允许为空')
                    } else if (isBatch?newCheckList.some(v=> v.newCode.length > Limit.CODE_LENGTH):(oneCardItem.get('newCode') + (isUnifyBefore?(UnifyWords || '') : '')).length > Limit.CODE_LENGTH) {
                        message.info(`新编码位数不能超过${Limit.CODE_LENGTH}位`)
                    } else if (isBatch && newCheckList.some((v,index) => newCheckList.some((w,i) => w.code === v.newCode && index<i))) {
                         message.info('新编码禁止向后重复')
                    } else if (isBatch && newCheckList.some((v,index) => newCheckList.some((w,i) => w.newCode === v.newCode && index !== i))) {
                         message.info('新编码不允许重复')
                    } else {
                        this.setState({confirmModal:true})
                    }
                }}
                >
                    <div className='regret-content'>
                        <div className='regret-content-item'>
                            <label>顶级类别：</label>
                            <Input value={name} className={'regret-input'} disabled />
                        </div>
                        <div className='regret-content-item'>
                            <label>卡片类别：</label>
                            <Select
                                value={(cardCategory || fromJS({})).get('name')}
                                onChange={(v,opt) => {
                                    const item = opt.props.item
                                    changeCategoryFunc(item,currentPage,() => this.setState({
                                        cardCategory:item,
                                        cardCategorySon:fromJS({}),
                                        oneCardItem:fromJS({}),
                                        checkList:[]
                                    }))
                                }}
                                >{
                                categoryList.map(v =>
                                    <Option value={v.get('uuid')} item={v}>{v.get('name')}</Option>
                                )
                            }</Select>
                        </div>
                        {
                            cardCategory.get('name') && cardCategory.get('uuid')?
                            <div className='regret-content-item'>
                                <label>{cardCategory.get('name')}类别：</label>
                                <UpperClassSelect
									className='jxc-config-modal-select'
									placeholder={''}
									treeData={cardTypeList}
									treeDefaultExpandAll={true}
									isLastSelect={true}
									value={[(cardCategorySon || fromJS({})).get('name') || '全部']}
									onSelect={(v,opt) => {
                                        const item = opt.props.item
                                        changeCategoryFunc(item.set('parentUuid',cardCategory.get('uuid')),currentPage,() => this.setState({cardCategorySon:item.set('parentUuid',cardCategory.get('uuid')),oneCardItem:fromJS({}),checkList:[]}))
                                    }}
								/>
                            </div>:''
                        }
                        {
                            !isBatch?
                            <div className='regret-content-item'>
                                <label>选择卡片：</label>
                                <XfnSelect
                                    combobox
                                    showSearch
                                    value={`${oneCardItem.get('code') || ''} ${oneCardItem.get('name') || ''}`}
                                    onChange={(value,options) => {
                                        this.setState({oneCardItem:options.props.item})
                                        checkUsed([options.props.item.toJS()])
                                    }}
                                    >
                                    {
                                    cardList.map(v =>
                                        <Option
                                            key={v.get('uuid')}
                                            value={v.get('uuid')}
                                            item={v}
                                        >{`${v.get('code')} ${v.get('name')}`}</Option>
                                    )
                                    }
                                </XfnSelect>
                            </div>:''
                        }

                        <div className='regret-check'>
                            <Checkbox checked={isBatch} onClick={() => this.setState({isBatch:!isBatch,isUnifyBefore:isBatch?false:isUnifyBefore})}>批量修改</Checkbox>
                            {
                                isBatch?
                                <Checkbox checked={isUnifyBefore} onClick={() => this.setState({isUnifyBefore:!isUnifyBefore})}>统一前缀</Checkbox>:''
                            }
                            {
                                isUnifyBefore?
                                <span className='regret-unify'>
                                    <Input
                                        placeholder='请输入1-5位数字或字母前缀'
                                        onChange={(e) => {
                                            if (/^[A-Za-z0-9]{0,5}$/.test(e.target.value)) {
                                                this.setState({words:e.target.value})
                                            } else {
                                                message.info('请输入1-5位数字或字母前缀')
                                            }
                                        }}
                                        PointDisabled
                                        value={this.state.words}
                                    />
                                    <Button type='primary' onClick={() => this.setState({UnifyWords:this.state.words})}>确认</Button>
                                </span>:''
                            }
                        </div>
                        {
                            isBatch?
                            <div style={{marginBottom:10,color:'#999999'}}>{!checkList.length?'请勾选需要修改编号的卡片':`已勾选卡片：${checkList.length}个`}</div>:''
                        }
                        <div style={{height:0}} className={`${isUnifyBefore?'regret-check-unify-content':'regret-check-no-unify-content'}`}>
                            <div className='regret-title'>
                                <span>
                                    {
                                        isBatch?
                                        <Checkbox
                                            checked={cardList.every(v => checkList.some(w => w.uuid === v.get('uuid')))}
                                            onClick={(e) => {
                                                if (e.target.checked) {
                                                    cardList.forEach(v => {!checkList.some(w => w.uuid === v.get('uuid')) && checkList.push(v.toJS())})
                                                } else {
                                                    cardList.forEach(v => checkList.splice(checkList.findIndex(w => w.uuid === v.get('uuid')),1))
                                                }
                                                this.setState({checkList})
                                                checkUsed(checkList)
                                        }}
                                        >
                                            卡片名称
                                        </Checkbox>
                                        :<span>卡片名称</span>
                                    }
                                </span>
                                <span>原编码</span>
                                <span>流水</span>
                                {
                                    isUnifyBefore?
                                    <span>前缀</span>:''
                                }
                                {
                                    isUnifyBefore?
                                    <span>编码</span>:''
                                }
                                <span>新编码</span>
                            </div>
                        </div>
                        <div className={`${isUnifyBefore?'regret-check-unify-content':'regret-check-no-unify-content'} regret-check-content`}>

                            {
                                !isBatch?
                                <div>
                                    <span>
                                        <span className='border-span'>{oneCardItem.get('name')}</span>
                                    </span>
                                    <span><span className='border-span'>{oneCardItem.get('code')}</span></span>
                                    <span><span className='border-span'>{
                                        oneCardItem.get('uuid')?
                                        usedCardList.some(w => w === oneCardItem.get('uuid')) ? '有': ''
                                        :'待验证'
                                    }</span></span>
                                    {
                                        isUnifyBefore?
                                        <span><span className='border-span'>{UnifyWords}{UnifyWords?<XfnIcon type='big-plus' />:''}</span></span>:''
                                    }
                                    {
                                        isUnifyBefore?
                                        <span><span className='border-span'></span></span>:''
                                    }
                                    <span>
                                        {
                                            !isUnifyBefore && oneCardItem.get('uuid')?
                                            <Input
                                                PointDisabled
                                                value={oneCardItem.get('newCode') || ''}
                                                placeholder='请输入编码'
                                                onFocus={(e) => {
                                                    e.target.select()
                                                }}
                                                onChange={(e) => {
                                                    if (/^[A-Za-z0-9]*$/.test(e.target.value)) {
                                                        this.setState({oneCardItem:oneCardItem.set('newCode',e.target.value)})
                                                    } else {
                                                        message.info('编码只支持输入数字和大小写英文')
                                                    }
                                                }}
                                            />:<span className='border-span'></span>
                                        }
                                    </span>
                                </div>
                                :
                                cardList.map((v,index) =>
                                    <div>
                                        <span>
                                            <Checkbox
                                                checked={checkList.some(w => w.uuid === v.get('uuid'))}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        checkList.push({...v.toJS()})
                                                    } else {
                                                        checkList.splice(checkList.findIndex(w => w.uuid === v.get('uuid')),1)
                                                    }
                                                    this.setState({checkList})
                                                    checkUsed(checkList)
                                                }}
                                            />
                                            <span className='border-span'>{v.get('name')}</span>
                                        </span>
                                        <span><span className='border-span'>{v.get('code')}</span></span>
                                        <span><span className='border-span'>{
                                            checkList.some(w => w.uuid === v.get('uuid'))?
                                            usedCardList.some(w => w === v.get('uuid')) ? '有': ''
                                            :'待验证'
                                        }</span></span>
                                        {
                                            isUnifyBefore?
                                            <span><span className='border-span'>{UnifyWords}{UnifyWords?<XfnIcon type='big-plus'/>:''}</span></span>:''
                                        }
                                        {
                                            isUnifyBefore && checkList.findIndex(w => w.uuid === v.get('uuid')) > -1?
                                            <span>
                                                <Input
                                                    PointDisable
                                                    value={(checkList[checkList.findIndex(w => w.uuid === v.get('uuid'))] || {}).newCode}
                                                    placeholder='请输入新编码'
                                                    onFocus={() => {
                                                        const LastIndex = checkList.findIndex(w => w.uuid === cardList.getIn([index-1,'uuid']))
                                                        const currentIndex = checkList.findIndex(w => w.uuid === v.get('uuid'))
                                                        const code = LastIndex >= 0 && checkList[LastIndex].newCode ? checkList[LastIndex].newCode : ''
                                                        if (code && code.slice(-1) >= 0 && currentIndex > 0) {
                                                            if (code.slice(-1) == 0) {
                                                                checkList[currentIndex].newCode = code.slice(0,-1) + '1'
                                                            } else {
                                                                let prePart = code.replace(/(?!0)\d+$/,'')
                                                                let lastPart = code.slice(prePart.length)
                                                                checkList[currentIndex].newCode = prePart + (Number(lastPart) + 1)
                                                            }
                                                        }
                                                        this.setState({checkList},() => {
                                                            this[`input${index}`].select()
                                                        })
                                                    }}
                                                    ref={(node) => this[`input${index}`] = node}
                                                    onChange={e => {
                                                        const index = checkList.findIndex(w => w.uuid === v.get('uuid'))
                                                        if (/^[A-Za-z0-9]*$/.test(e.target.value)) {
                                                            checkList[index].newCode = e.target.value
                                                            this.setState({checkList})
                                                        } else {
                                                            message.info('编码只支持输入数字和大小写英文')
                                                        }

                                                    }}
                                                />
                                            </span>:''
                                        }
                                        {
                                            checkList.findIndex(w => w.uuid === v.get('uuid')) > -1?
                                            isUnifyBefore || checkList.findIndex(w => w.uuid === v.get('uuid')) === -1?
                                            <span><span className='border-span'>{(UnifyWords || '') + (checkList[checkList.findIndex(w => w.uuid === v.get('uuid'))].newCode || '')}</span></span>
                                            :
                                            <span>
                                                <Input
                                                    PointDisabled
                                                    value={(checkList[checkList.findIndex(w => w.uuid === v.get('uuid'))] || {}).newCode}
                                                    placeholder='请输入编码'
                                                    onFocus={() => {
                                                        // const newCode = (checkList[checkList.findIndex(w => w.uuid === v.get('uuid'))] || {}).newCode
                                                        const LastIndex = checkList.findIndex(w => w.uuid === cardList.getIn([index-1,'uuid']))
                                                        const currentIndex = checkList.findIndex(w => w.uuid === v.get('uuid'))
                                                        const code = LastIndex >= 0 && checkList[LastIndex].newCode ? checkList[LastIndex].newCode : ''
                                                        if (code && code.slice(-1) >= 0 && currentIndex > 0) {
                                                            if (code.slice(-1) == 0) {
                                                                checkList[currentIndex].newCode = code.slice(0,-1) + '1'
                                                            } else {
                                                                let prePart = code.replace(/(?!0)\d+$/,'')
                                                                let lastPart = code.slice(prePart.length)
                                                                checkList[currentIndex].newCode = prePart + (Number(lastPart) + 1)
                                                            }
                                                        }
                                                        this.setState({checkList},() => {
                                                            this[`input${index}`].select()
                                                        })
                                                    }}
                                                    ref={(node) => this[`input${index}`] = node}
                                                    onChange={e => {
                                                        const index = checkList.findIndex(w => w.uuid === v.get('uuid'))
                                                        if (/^[A-Za-z0-9]*$/.test(e.target.value)) {
                                                            checkList[index].newCode = e.target.value
                                                            this.setState({checkList})
                                                        } else {
                                                            message.info('编码只支持输入数字和大小写英文')
                                                        }
                                                    }}
                                                />
                                            </span>:''
                                        }
                                    </div>
                                )
                            }
                        </div>
                        {
                            isBatch?
                            <Pagination size='small' current={currentPage} total={regretPages*10} onChange={(page) => changeCategoryFunc(cardCategory,page,() => {this.setState({currentPage:page})})}/>:''
                        }
                    </div>
            </Modal>
            {
                confirmModal?
                <ConfirmModal
                    visible={confirmModal}
                    typeName={cardCategorySon.get('uuid')?cardCategorySon.get('name'):cardCategory.get('name')}
                    typeCat={cardCategorySon.get('uuid')?`${cardCategory.get('name')}类别：`:'卡片类别：'}
                    regretResultList={regretResultList}
                    regretResultIndex={regretResultIndex}
                    cardList={
                        isBatch?
                            newCheckList
                            :[{...oneCardItem.toJS(),newCode:isUnifyBefore?(UnifyWords || '') + (oneCardItem.get('newCode') || ''):oneCardItem.get('newCode')}]}
                    onCancel={() => {
                        this.setState({confirmModal:false})
                    }}
                    openBefore={open}
                    closeBefore={close}
                    regretFunc={regretFunc}
                    regretResultKey={regretResultKey}
                    downloadResult={downloadResult}
                    downloadBefore={downloadBefore}
                    RUNNING={RUNNING}
                />:''
            }

            </div>
        )
    }
}
class ConfirmModal extends React.Component {
    state= {
        confirm:false,
        regretConfirm:false,
        currentPage:1,
    }
    render() {
        const {
            typeName,
            typeCat,
            visible,
            cardList,
            onCancel,
            regretFunc,
            regretResultList,
            regretResultIndex,
            openBefore,
            closeBefore,
            regretResultKey,
            downloadResult,
            downloadBefore,
            RUNNING
            } = this.props
        const { confirm, regretConfirm, currentPage } = this.state
        const total = cardList.length > Limit.CONFIG_PAGE_SIZE ? parseInt(cardList.length/Limit.CONFIG_PAGE_SIZE) + 1:1
        return(
            <Modal
                visible={visible}
                title={regretConfirm?'执行结果':'信息确认'}
                width={480}
                okText='执行'
                maskClosable={false}
                onCancel={() => {
                    onCancel()
                }}
                onOk={() => {
                    if (confirm) {
                        regretFunc(cardList)
                        this.setState({regretConfirm:true})
                    }
                }}
                footer={regretConfirm ? [
                    <a
                        className='ant-btn ant-btn-primary'
                        style={{lineHeight:'28px'}}
                        href={RUNNING?`${ROOTPKT}/data/download/card/regret/code?key=${regretResultKey}&needResult=true`:'javascript:void(0)'}
                        onClick={() => {
                            // downloadResult(regretResultKey)
                            if (!RUNNING) {
                                message.info('权益未开启或已过期，请开通或续费')
                            }
                        }}>
                    下载至本地
                </a>] : [
                    <Button onClick={() => {
                        onCancel()
                    }}>取消</Button>,
                    <Button type={'primary'} disabled={!confirm} onClick={() => {
                        if (confirm) {
                            regretFunc(cardList)
                            this.setState({regretConfirm:true})
                        }
                    }}>执行</Button>
                ]}
                >
            <div className='regret-content'>
                {
                    regretConfirm?
                    <Progress
                        className='regret-progress'
                        size="small"
                        percent={regretResultIndex/cardList.length*100}
                    />:''
                }
                <div className='regret-content-item'>
                    <label>{typeCat}</label>
                    <div className={'regret-input'}><Input value={typeName} disabled/></div>
                </div>
                <div style={{height:0}} className={`${regretConfirm?'regret-result':'regret-confirm'}`}>
                    <div className='regret-title'>
                        <span>卡片名称</span>
                        <span>原编码</span>
                        <span>新编码</span>
                        {
                            regretConfirm?
                            <span>执行结果</span>:''
                        }
                    </div>
                </div>
                <div className={`regret-check-content ${regretConfirm?'regret-result':'regret-confirm'}`}>

                    {
                        cardList.filter((v,i) => i < currentPage*Limit.CONFIG_PAGE_SIZE && i >= (currentPage -1)*Limit.CONFIG_PAGE_SIZE).map(v => {
                            const regretResultItem = regretResultList.find(w => w.get('cardUuid') === v.uuid) || fromJS({})
                            const result = regretResultItem.get('result')
                            let resultWords = ''
                            switch(result) {
                                case 'S' :
                                resultWords = '成功'
                                break
                                case 'F' :
                                resultWords = '失败'
                                break
                                default:
                                resultWords = ''
                            }

                            return(
                                <div>
                                    <span className='border-span'>{v.name}</span>
                                    <span className='border-span'>{v.code}</span>
                                    <span className='border-span'>{v.newCode}</span>
                                    {
                                        regretConfirm?
                                        <span className='border-span' style={result === 'F'?{color: '#ff0000'}:{}}>{resultWords}
                                            {
                                                resultWords === '失败'?
                                                <Tooltip placement="right" title={regretResultItem.get('errorInfo') || ' '}>
                                                    <XfnIcon type='editTip' style={{marginLeft:'5px',lineHeight:'28px',color:'#333'}} />
                                                </Tooltip>:''
                                            }

                                        </span>:''
                                    }
                                </div>
                            )
                        })
                    }
                </div>
                <div className={`regret-page ${regretConfirm?'regret-page-confirm':''}`}>
                    <Pagination
                        size='small'
                        current={currentPage}
                        total={total*10}
                        onChange={(page) => this.setState({currentPage:page})}
                        style={regretConfirm?{}:{float:'initial'}}
                    />
                    {
                        !regretConfirm?
                        <Button
                            type='primary'
                            disabled={!RUNNING}
                            onClick={() => {
                                downloadBefore(cardList)
                            }}>
                            下载至本地
                        </Button>:''
                    }
                    <a
                        className='regret-download-click'
                        style={{display:'none'}}
                        href={`${ROOTPKT}/data/download/card/regret/code?key=${regretResultKey}`}
                        >下载至本地
                    </a>
                </div>
                {
                    !regretConfirm?
                    <div className='tips'>
                         若单次修改数据量过大，可能耗时较长，在结束前请勿关闭本页面
                    </div>:''
                }
                {
                    !regretConfirm?
                    <div>
                        <Checkbox checked={confirm} onClick={() => this.setState({confirm:!confirm})}>确认批量修改上述核算对象编码</Checkbox>
                    </div>:''
                }
            </div>


        </Modal>
        )
    }
}
