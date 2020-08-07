import React from 'react'
import { connect }	from 'react-redux'
import { toJS, fromJS } from 'immutable'
import { Button, ButtonGroup, Container, Row, ScrollView, Icon, TextListInput, AmountInput, TextareaItem, TreeSelect } from 'app/components'
import { Account, CategoryCom, Menu } from './components'
import { homeAccountActions } from 'app/redux/Edit/Lrls/homeAccount'
import { homeActions } from 'app/redux/Home/home.js'
import { TopDatePicker } from 'app/containers/components'
import { DateLib, showImg } from 'app/utils'
import thirdParty from 'app/thirdParty'
import * as Limit from 'app/constants/Limit.js'
import './index.less'

import Yysr from './Yysr'
import Yyzc from './Yyzc'
import Fyzc from './Fyzc'
import Xczc from './Xczc'
import XczcLs from './Xczc/selectLs'
import Sfzc from './Sfzc'
import SfzcLs from './Sfzc/selectLs'
import Nbzz from './Hsgl/Nbzz'
import Sfgl from './Hsgl/Sfgl'
import SfglLs from './Hsgl/Sfgl/selectLs'
import Jzcb from './Hsgl/Jzcb'
import JzcbLs from './Hsgl/Jzcb/selectLs'
import Kjfp from './Hsgl/Kjfp'
import KjfpLs from './Hsgl/Kjfp/selectLs'
import Fprz from './Hsgl/Fprz'
import FprzLs from './Hsgl/Fprz/selectLs'
import Zcwjzzs from './Hsgl/Zcwjzzs'
import ZcwjzzsLs from './Hsgl/Zcwjzzs/selectLs'
import Yywsr from './Qtls/Yywsr'
import Yywzc from './Qtls/Yywzc'
import Zskx from './Qtls/Zskx'
import ZskxLs from './Qtls/Zskx/selectLs'
import Zfkx from './Qtls/Zfkx'
import ZfkxLs from './Qtls/Zfkx/selectLs'
import Cqzc from './Cqzc'
import Jk from './Qtls/Jk'
import JkLs from './Qtls/Jk/selectLs'
import Tz from './Qtls/Tz'
import TzLs from './Qtls/Tz/selectLs'
import Zb from './Qtls/Zb'
import ZbLs from './Qtls/Zb/selectLs'
import Ggfyft from './Hsgl/Ggfyft'
import GgfyftLs from './Hsgl/Ggfyft/selectLs'
import Jzsy from './Hsgl/Jzsy'
import JzsyLs from './Hsgl/Jzsy/selectLs'
import Zjtx from './Hsgl/Zjtx'


@connect(state => state)
export default
class HomeAccount extends React.Component {
	constructor(props) {
      super(props);
    }
	componentDidMount() {
		thirdParty.setTitle({title: '录入流水'})
		thirdParty.setIcon({showIcon: false})
		thirdParty.setRight({ show: false })

		if (sessionStorage.getItem('ylFj')) {
			sessionStorage.removeItem('ylFj')
			return
		}

		let ylToLr = false
		if (sessionStorage.getItem('ylToLr')) {
			sessionStorage.removeItem('ylToLr')
			ylToLr = true
		}else{
			this.props.dispatch(homeAccountActions.changeLrlsEnclosureList())
		}

		const moduleInfo = this.props.homeState.getIn(['data', 'userInfo', 'sobInfo', 'moduleInfo'])
		const enCanUse = moduleInfo ? (moduleInfo.indexOf('ENCLOSURE_RUN') > -1 ? true : false) : true
		const checkMoreFj = this.props.homeState.getIn(['data', 'userInfo', 'checkMoreFj']) === 'TRUE' ? true : false
		if(enCanUse && checkMoreFj){
			this.props.dispatch(homeAccountActions.getLabelFetch())
		}

		const lrlsInsertCard = sessionStorage.getItem('lrlsInsertCard')
		//流水新增往来卡片 账户 存货卡片跳回来时不需要重新获取数据
		if (lrlsInsertCard == 'lrlsIUManage' || lrlsInsertCard == 'lrlsAccount' || lrlsInsertCard == 'lrlsInventory') {
			sessionStorage.setItem('lrlsInsertCard', '')
			return
		}

		this.props.dispatch(homeAccountActions.accountSaveAndNew())
		this.props.dispatch(homeAccountActions.getRunningCategory(ylToLr))
		
		this.props.dispatch(homeActions.setDdConfig()) // 鉴权
	}

	render() {
		const { dispatch, homeAccountState, homeState, history } = this.props

		const LrAccountPermissionInfo = homeState.getIn(['permissionInfo', 'LrAccount'])
		const editPermission = LrAccountPermissionInfo.getIn(['edit', 'permission'])

		const lastCategory = homeAccountState.get('lastCategory')
		const accountList = homeAccountState.get('accountList')
		const data = homeAccountState.get('data')

		const categoryType = data.get('categoryType')
		const categoryUuid = data.get('categoryUuid')
		const categoryName = data.get('categoryName')
		const runningDate = data.get('runningDate')
		const runningAbstract = data.get('runningAbstract')
        const accountName = data.get('accountName')
		const accountUuid = data.get('accountUuid')
		const amount = data.get('amount')
		const menuLeftIdx = data.get('menuLeftIdx')





		let component = null
		;({
			'LB_CATEGORY': () => {//选择类别页面
				component = <TreeSelect
					district={lastCategory.toJS()}
					onChange={(item) => {
						dispatch(homeAccountActions.changeLrlsData(['project', 'projectCard'], fromJS([{amount: ''}])))
						if (item['canShow']) {
							const value = `${item['uuid']}${Limit.TREE_JOIN_STR}${item['name']}`
							dispatch(homeAccountActions.getCardDetail(value))
						} else {//核算管理
							const value = `${item['uuid']}${Limit.TREE_JOIN_STR}${item['name']}${Limit.TREE_JOIN_STR}${item['categoryType']}`
							dispatch(homeAccountActions.toManageType(value, item))
						}
					}}
				/>
			},
            'LB_YYSR': () => {//营业收入
                component = <Yysr history={history} editPermission={editPermission} />
            },
			'LB_YYZC': () => {//营业支出
                component = <Yyzc history={history} editPermission={editPermission} />
            },
			'LB_FYZC': () => {//费用支出
                component = <Fyzc history={history} editPermission={editPermission} />
            },
			'LB_XCZC': () => {//薪酬支出
                component = <Xczc history={history}  editPermission={editPermission} />
            },
			'LB_XCZC_LS': () => {//薪酬支出-选择流水页面
                component = <XczcLs history={history} editPermission={editPermission} />
            },
			'LB_SFZC': () => {//税费支出
                component = <Sfzc history={history} editPermission={editPermission} />
            },
			'LB_SFZC_LS': () => {//税费支出-选择流水页面
                component = <SfzcLs history={history}  editPermission={editPermission} />
            },
			'LB_YYWSR': () => {//营业外收入
                component = <Yywsr history={history}  editPermission={editPermission} />
            },
			'LB_YYWZC': () => {//营业外支出
                component = <Yywzc history={history}  editPermission={editPermission} />
            },
			'LB_ZSKX': () => {//暂收款项
                component = <Zskx history={history}  editPermission={editPermission} />
            },
			'LB_ZSKX_LS': () => {//暂收款项-选择流水页面
                component = <ZskxLs history={history} editPermission={editPermission} />
            },
			'LB_ZFKX': () => {//暂付款项
                component = <Zfkx history={history} editPermission={editPermission} />
            },
			'LB_ZFKX_LS': () => {//暂付款项-选择流水页面
                component = <ZfkxLs history={history} editPermission={editPermission} />
            },
			'LB_CQZC': () => {//长期资产
                component = <Cqzc history={history}  editPermission={editPermission} />
            },
			'LB_JK': () => {//借款
                component = <Jk history={history}  editPermission={editPermission} />
            },
			'LB_JK_LS': () => {//借款支付利息-选择流水页面
                component = <JkLs history={history}  editPermission={editPermission} />
            },
			'LB_TZ': () => {//投资
				component = <Tz history={history}  editPermission={editPermission}  />
            },
			'LB_TZ_LS': () => {//投资收入股利-选择流水页面
                component = <TzLs history={history} editPermission={editPermission} />
            },
			'LB_ZB': () => {//资本
                component = <Zb history={history} editPermission={editPermission} />
            },
			'LB_ZB_LS': () => {//支付利润-选择流水页面
                component = <ZbLs history={history}  editPermission={editPermission} />
            },
			'LB_ZZ': () => {//内部转账
                component = <Nbzz history={history} editPermission={editPermission}  />
            },
			'LB_SFGL': () => {//收付管理
                component = <Sfgl history={history} editPermission={editPermission}  />
            },
			'LB_SFGL_LS': () => {//收付管理-选择流水页面
                component = <SfglLs history={history} editPermission={editPermission}  />
            },
			'LB_JZCB': () => {//结转成本
                component = <Jzcb history={history} editPermission={editPermission}  />
            },
			'LB_JZCB_LS': () => {//结转成本-选择流水页面
                component = <JzcbLs history={history} editPermission={editPermission}  />
            },
			'LB_KJFP': () => {//开具发票
                component = <Kjfp history={history} editPermission={editPermission}  />
            },
			'LB_KJFP_LS': () => {//开具发票-选择流水页面
                component = <KjfpLs history={history} editPermission={editPermission}  />
            },
			'LB_FPRZ': () => {//发票认证
                component = <Fprz history={history} editPermission={editPermission}  />
            },
			'LB_FPRZ_LS': () => {//发票认证-选择流水页面
                component = <FprzLs history={history} editPermission={editPermission}  />
            },
			'LB_ZCWJZZS': () => {//转出未交增值税
                component = <Zcwjzzs history={history} editPermission={editPermission}  />
            },
			'LB_ZCWJZZS_LS': () => {//未交增值税-选择流水页面
                component = <ZcwjzzsLs editPermission={editPermission}  />
            },
			'LB_GGFYFT': () => {//项目公共费用分摊
                component = <Ggfyft history={history} editPermission={editPermission}  />
            },
			'LB_GGFYFT_LS': () => {//项目公共费用分摊-选择流水页面
                component = <GgfyftLs history={history} editPermission={editPermission}/>
            },
			'LB_JZSY': () => {//结转损益
                component = <Jzsy history={history} editPermission={editPermission}/>
            },
			'LB_JZSY_LS': () => {//结转损益-选择流水页面
                component = <JzsyLs history={history} />
            },
			'LB_ZJTX': () => {//长期资产折旧摊销
                component = <Zjtx history={history} editPermission={editPermission}/>
            },

        }[categoryType] || (()=> null))()




		return(
			component ? component :
			<Container className="lrls">
				<TopDatePicker
					value={runningDate}
					onChange={date => dispatch(homeAccountActions.changeHomeAccountData('runningDate', new DateLib(date).valueOf()))}
					callback={(value) => {
						dispatch(homeAccountActions.changeHomeAccountData('runningDate', value))
					}}
				/>

				<div className='lrls-card'>
					<CategoryCom
						isModify={false}
						dispatch={dispatch}
						lastCategory={lastCategory}
						categoryUuid={categoryUuid}
						categoryName={categoryName}
					/>

				</div>

				<ScrollView flex="1">
					<Row className='lrls-card'>
						<Row className='lrls-line lrls-bottom'>
							<label>摘要：</label>
							<TextareaItem
								placeholder='摘要填写'
								value={runningAbstract}
								onChange={(value) => {
									dispatch(homeAccountActions.changeHomeAccountData('runningAbstract', value))
								}}
							/>
						</Row>
						<Row className='lrls-more-card lrls-bottom'>
							<label>金额：</label>
							<TextListInput
								placeholder='填写金额'
								value={amount}
								onChange={(value) => {
									if (/^\d*\.?\d{0,2}$/g.test(value)) {
										dispatch(homeAccountActions.changeHomeAccountData('amount', value))
									}
								}}
							/>
						</Row>
						<Row className='lrls-more-card lrls-more-account'>
							<label>账户：</label>
							<Account
								accountList={accountList}
								accountUuid={accountUuid}
								accountName={accountName}
								dispatch={dispatch}
								history={history}
								onOk={(value) => dispatch(homeAccountActions.changeHomeAccountData(value))}
							/>
						</Row>
					</Row>



				</ScrollView>


				<ButtonGroup>
					<Button
						disabled={!editPermission}
						onClick={() => {
							thirdParty.Alert('请选择类别')
						}}
					>
						<Icon type="save"/>
						<span>保存</span>
					</Button>
					<Button
						disabled={!editPermission}
						onClick={() => {
							thirdParty.Alert('请选择类别')
						}}
					>
						<Icon type="new"/>
						<span>保存并新增</span>
					</Button>
				</ButtonGroup>
			</Container>
		)
	}
}
