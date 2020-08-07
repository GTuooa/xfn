import React from 'react'
import { immutableRenderDecorator }	from 'react-immutable-render-mixin'
import { toJS, is ,fromJS } from 'immutable'
import { connect }	from 'react-redux'

import { Select, Divider, Icon, Button, Modal } from 'antd'
import { numberCalculate, formatMoney, formatFour } from 'app/utils'
import XfIcon from 'app/components/Icon'
import { Amount, TableBody, TableTitle, TableItem, TableAll, TableOver } from 'app/components'

@immutableRenderDecorator
export default
class TotalMaterial extends React.Component {

    constructor(props) {
		super(props)
		this.state = {

		}
	}

    render() {
        const {
            assemblySheet,
            enableWarehouse,
        } = this.props

        //物料汇总
        let totalAmount = 0 //合计
        let allMaterialList = []
        let materialUuidList = []
        let materialList = []
        let warehouseUuidList = []
        let unitUuidList = []

        assemblySheet.map(v => {
            v.get('materialList').map(w => {
                allMaterialList.push(w.toJS())
            })
        })

        allMaterialList.map((v, i) => {
            const materialUuid = v.materialUuid
            const warehouseCardUuid = v.warehouseCardUuid
            const unitUuid = v.unitUuid

            totalAmount = numberCalculate(totalAmount,v.amount)

            if (!materialUuid) { return }

            if (!materialUuidList.includes(materialUuid)) {
                materialList.push([v])
                materialUuidList.push(materialUuid)
            } else {
                const cardIndex = materialUuidList.findIndex(value => value == materialUuid)
                let hasCard = false
                materialList[cardIndex].forEach(item => {
                    if (item.warehouseCardUuid === warehouseCardUuid && item.unitUuid === unitUuid) {
                        const quantity = numberCalculate(item.quantity,v.quantity)
                        const amount = numberCalculate(item.amount,v.amount)
                        item.quantity = quantity
                        item.amount = amount
                        if (quantity) {
                            item.price = numberCalculate(amount,quantity,2,'divide')
                        }
                        hasCard = true
                    }
                })
                if (!hasCard) {
                    materialList[cardIndex].push(v)
                }
            }
        })

        let sortMaterialList = []
        materialList.map((v,i) => {
            v.sort((a, b) => {
                if (a.warehouseCardCode > b.warehouseCardCode) {
                    return 1
                } else if (a.warehouseCardCode == b.warehouseCardCode) {
                    return 1
                } else {
                    return -1
                }
            }).map(item => {
                sortMaterialList.push(item)
            })
        })
        sortMaterialList.sort((a,b) => {
            if (a.code > b.code) { return 1 }
            return -1
        })
        return (
            <div>
            <TableAll className="lrAccount-table">
                <div className="account-zzd-title">物料汇总</div>
                <TableTitle
                    className={enableWarehouse? 'account-zzd-table-width' : 'account-zzd-table-no-warehouse-width'}
                    titleList={enableWarehouse? ['','物料','仓库','数量','单位','单价','金额'] : ['','物料','数量','单位','单价','金额']}
                />
                <TableBody className={'account-zzd-table'}>
                    {
                        sortMaterialList && sortMaterialList.map((v,i) => {
                            return <TableItem className={enableWarehouse? 'account-zzd-table-width' : 'account-zzd-table-no-warehouse-width'} line={i+1}>
                                <li>{i+1}</li>
                                <TableOver textAlign='left'>{`${v.code} ${v.name}`}</TableOver>
                                {
                                    enableWarehouse ?
                                    <TableOver textAlign='left'>{`${v.warehouseCardCode ? v.warehouseCardCode : ''} ${v.warehouseCardName ? v.warehouseCardName : ''}`}</TableOver> : null
                                }
                                <li><p>{Number(v.quantity) ? formatFour(v.quantity) : ''}</p></li>
                                <li>{v.unitName ? v.unitName : ''}</li>
                                <li><p>{Number(v.price) ? formatFour(v.price) : ''}</p></li>
                                <li><p>{formatMoney(v.amount)}</p></li>
                            </TableItem>
                        })
                    }

                </TableBody>

                <div className="account-zzd-bottom" style={{background: sortMaterialList.size && sortMaterialList.size%2 === 0 ? '#f4f4f4' : '#fff'}}>合计：{formatMoney(totalAmount)}</div>
            </TableAll>
            </div>
        )

    }
}
