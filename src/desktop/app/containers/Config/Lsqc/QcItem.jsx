import React from 'react'
import {immutableRenderDecorator} from 'react-immutable-render-mixin'
import { formatNum, formatMoney, numberTest } from 'app/utils'

import { message, Input } from 'antd'
import { TableItem, Amount, Icon } from 'app/components'
import NumberInput from 'app/components/Input'

import * as accountConfActions from 'app/redux/Config/Account/account.action'
import * as lsqcActions	from 'app/redux/Config/Lsqc/lsqc.action.js'

@immutableRenderDecorator
export default
class QcItem extends React.Component {

    static displayName = 'QcItem'

    constructor() {
		super()
		this.state = {
			debitBeginAmount: '',
			creditBeginAmount: ''
		}
	}
	componentDidMount() {
        this.setState({
			debitBeginAmount: this.props.item.get('debitBeginAmount') == 0 ? '' : this.props.item.get('debitBeginAmount'),
			creditBeginAmount: this.props.item.get('creditBeginAmount') == 0 ? '' : this.props.item.get('creditBeginAmount')
		})
    }
    componentWillReceiveProps(nextprops) {
		if (this.props.curModifyBtn !== nextprops.curModifyBtn || this.props.changeQcList !== nextprops.changeQcList) {

            this.setState({
                debitBeginAmount: nextprops.item.get('debitBeginAmount') == 0 ? '' : nextprops.item.get('debitBeginAmount'),
                creditBeginAmount: nextprops.item.get('creditBeginAmount') == 0 ? '' : nextprops.item.get('creditBeginAmount')
            })
		}
	}


  render() {

    const {
        item,
        dispatch,
        line,
        className,
        haveChild,
        showChild,
        leve,
        upperArr,
        listItem,
        listName,
        curModal,
        changeModal,
        btnStatus,
        isCheckOut,
        changeQcList,
    } = this.props
    const { debitBeginAmount,creditBeginAmount } = this.state


    const projectAddBtnArr = ['PROJECT_PRODUCT_BASIC_CATEGORY_UUID','PROJECT_CONSTRUCTION_COST_CATEGORY_UUID','PROJECT_CONSTRUCTION_PROFIT_CATEGORY_UUID','PROJECT_SETTLEMENT_CATEGORY_UUID']
    const candeleteProperty = ['CARD_PROPERTY_BASIC','CARD_PROPERTY_CONTRACT_COST','CARD_PROPERTY_CONTRACT_PROFIT','CARD_PROPERTY_ENGINEER']


    const name = item.get('name')
    const Uuid = item.get('uuid')
    const leveHolder = ({
      1: () => '',
      2: () => ' ',
      3: () => ' ',
      4: () => ' '
    }[leve])()

    const canNoChild = []

    const isDisabled = item.get('handleAmount') !== 0 && !item.get('add') && listName === 'Project' ? true : item.get('add') ? false : isCheckOut
    const getNumber = (numberName) => {
        let totalNumber = 0
        const loop = (data) => {
            data.map((item,i) => {
                if(item.childList && item.childList.length>0){
                    loop(item.childList)
                }else{
                    if(!(projectAddBtnArr.includes(item['relationUuid'])) ){
                        if(item.operate == "SUBTRACT"){
                            totalNumber -= parseFloat(item[numberName])
                        }else{
                            totalNumber += parseFloat(item[numberName])
                        }
                    }


                }
            })


        }
        item.get('childList') && item.get('childList').size > 0 ? loop(item.get('childList').toJS()) : ''

        const number = item.get('childList') && item.get('childList').size > 0 ? totalNumber
        :
        (
            listName == 'Contacts' && leve==1 ||
            listName == 'Project' && projectAddBtnArr.includes(item.get('relationUuid'))
            // || listName == 'Project' && !projectAddBtnArr.includes(item.get('relationUuid')) && leve == 1
        ) ? 0 : item.get(numberName)
        return number
    }
    const regPositive = /^\d{0,14}(\.\d{0,2})?$/
    const regNegative = /^-{0,1}\d{0,14}(\.\d{0,2})?$/
    const reg = item.get('acType') === 'AC_BNLR' || item.get('acType') === 'AC_WFPLR' || listName == 'Account' ? regNegative : regPositive

    return (
        <TableItem line={line} className={className}>
            <li className={haveChild ? "table-item-with-triangle trianglePointer" : 'table-item-with-triangle'}>
                <span className='table-item-name' style={{paddingLeft: `${leve * 20}px`}}>
                    {
                      ((listName == 'Contacts' || listName == 'Stock') && leve==1 && !btnStatus && !isCheckOut) ||
                          ((listName == 'Contacts' || listName == 'Stock')  && !item.get('isDefinite') && !btnStatus && isCheckOut) ||
                          (listName == 'Project' && (projectAddBtnArr.includes(item.get('relationUuid'))) && !btnStatus && !isCheckOut) ?
                      <Icon
                        type="plus"
                        className='acconfig-plus'
                        onClick={(e) => {
                          e.stopPropagation()
                          dispatch(lsqcActions.getDetailsListInfo(listName,sessionStorage.getItem('psiSobId'),item))

                        }}
                      /> :''
                    }
          <span>
              {
                  listName == 'Contacts' ? (name.indexOf('UDFNCRD') > -1 ? `${leveHolder} 未明确单位` : `${leveHolder} ${name}`) :
                  name.indexOf('IDFNCRD') > -1  ? `${leveHolder} 未明确存货` : `${leveHolder} ${name}`

              }

          </span>
        </span>


        {
            haveChild
              ? <span className="table-item-triangle-account-wrap title-right lsqc-acconfig-icon" onClick={() => dispatch(lsqcActions.QCTriangleSwitch(showChild, item.get('relationUuid')))}>
                  <Icon className="table-item-triangle-account"
                    // onClick={() => dispatch(lsqcActions.QCTriangleSwitch(showChild,item.get('uuid')))}
                    type={showChild
                      ? 'up'
                      : 'down'}></Icon>
                </span>
              : ''
        }


      </li>

      <li>
        { haveChild  ||
        ((listName == 'Contacts' || listName == 'Stock') && leve==1) ||
        (listName == 'Project' && (projectAddBtnArr.includes(item.get('relationUuid'))) && !btnStatus && !isCheckOut) ?
        <p className="lsqc-aggregate-amount"><Amount>{getNumber('debitBeginAmount')}</Amount></p>
        :
        btnStatus ? <p className="lsqc-aggregate-amount"><Amount>{getNumber('debitBeginAmount')}</Amount></p> :
        <NumberInput
            defaultValue
            value={debitBeginAmount}
            disabled = {item.get('direction') == 'debit' ? isDisabled : true}
            onChange={(e) => {
                numberTest(e,(value) => {
                    dispatch(lsqcActions.changeQcList(listItem, item, value, leve,listName,'debitBeginAmount'))
                    this.setState({debitBeginAmount: value})
                },item.get('acType') === 'AC_BNLR' || item.get('acType') === 'AC_WFPLR' || listName == 'Account' || listName == 'Project')
            }}

        />

    }
      </li>
      <li>
          {  haveChild ||
             ((listName == 'Contacts' || listName == 'Stock') && leve==1) ||
             (listName == 'Project' && (projectAddBtnArr.includes(item.get('relationUuid'))) && !btnStatus && !isCheckOut)?
              <p className="lsqc-aggregate-amount"><Amount>{getNumber('creditBeginAmount')}</Amount></p>
              :
              btnStatus ? <p className="lsqc-aggregate-amount"><Amount>{getNumber('creditBeginAmount')}</Amount></p> :
              <NumberInput
                defaultValue
                value={creditBeginAmount}
                disabled = {item.get('direction') == 'credit' ? isDisabled : true}
                onChange={(e) => {
                    numberTest(e,(value) => {
                        dispatch(lsqcActions.changeQcList(listItem, item, value, leve,listName,'creditBeginAmount'))
                        this.setState({creditBeginAmount: value})
                    },item.get('acType') === 'AC_BNLR' || item.get('acType') === 'AC_WFPLR' || listName == 'Account' || listName == 'Project')
                }}

              />

        }
      </li>
      <li>
        {
            ((listName == 'Contacts' || listName == 'Stock') && leve > 1 ) && !haveChild && !btnStatus && !isCheckOut ||
            (candeleteProperty.indexOf(item.get('property')) > -1 && !(projectAddBtnArr.includes(item.get('relationUuid'))) && !haveChild && !btnStatus && !isCheckOut) || item.get('add') ?
          <Icon
            type="close"
            className='acconfig-plus'
            onClick={(e) => {
              e.stopPropagation()
              dispatch(lsqcActions.deleteBeginningMembers(item,listName))
            }}
          /> :''
        }
      </li>
    </TableItem>
  )
  }
}
