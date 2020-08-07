export default function jrFunc (categoryType, oriState, beAccrued, propertyTax, propertyPay, beWelfare, usedProject, usedCurrent) {

    let showJr = false//是否显示下方单据按钮

    switch (categoryType) {
		case 'LB_ZSKX': {
            if (oriState === 'STATE_ZS_TH') {
                showJr = true
            }
			break
		}
        case 'LB_ZFKX': {
            if (oriState === 'STATE_ZF_SH') {
                showJr = true
            }
			break
		}
        case 'LB_JK': {
            if (beAccrued && oriState === 'STATE_JK_ZFLX' && !usedProject && !usedCurrent) {
                showJr = true
            }
			break
		}
        case 'LB_TZ': {
            if (beAccrued && ['STATE_TZ_SRGL', 'STATE_TZ_SRLX'].includes(oriState) && !usedProject && !usedCurrent) {
                showJr = true
            }
			break
		}
        case 'LB_ZB': {
            if (beAccrued && oriState === 'STATE_ZB_ZFLR' && !usedProject && !usedCurrent) {
                showJr = true
            }
			break
		}
        case 'LB_SFZC': {
            ({
                'SX_ZZS': () => {//增值税
                    if (oriState === 'STATE_SF_JN' || oriState === 'STATE_SF_SFJM') {
                        showJr = true
                    }
                },
                'SX_GRSF': () => {//个人税费
                    showJr = false
                },
                'SX_QTSF': () => {//其他税费
                    if ((beAccrued && oriState === 'STATE_SF_JN') || oriState === 'STATE_SF_SFJM') {
                        showJr = true
                    }
                },
                'SX_QYSDS': () => {//企业所得税
                    if ((beAccrued && oriState === 'STATE_SF_JN') || oriState === 'STATE_SF_SFJM') {
                        showJr = true
                    }
                }
            }[propertyTax] || (() => null))()

			break
		}
        case 'LB_XCZC': {
            ({
                'SX_GZXJ': () => {//工资薪金
                    if (beAccrued && (oriState === 'STATE_XC_FF' || oriState === 'STATE_XC_DK')) {
                        showJr = true
                    }
                },
                'SX_SHBX': () => {//社会保险
                    if (beAccrued && oriState === 'STATE_XC_JN') {
                        showJr = true
                    }
                },
                'SX_ZFGJJ': () => {//住房公积金
                    if (beAccrued && oriState === 'STATE_XC_JN') {
                        showJr = true
                    }
                },
                'SX_FLF': () => {//福利费
                    if (beWelfare && oriState === 'STATE_XC_FF') {
                        showJr = true
                    }
                },
                'SX_QTXC': () => {//其他薪酬
                    if (beAccrued && oriState === 'STATE_XC_FF') {
                        showJr = true
                    }
                },
            }[propertyPay] || (() => null))()

			break
		}
        case 'LB_KJFP': {
            showJr = true
			break
		}
        case 'LB_FPRZ': {
            showJr = true
			break
		}
        case 'LB_JZSY': {
            showJr = true
			break
		}
        case 'LB_SFGL': {
            showJr = true
			break
		}
        case 'LB_JZCB': {
            showJr = true
			break
		}
        case 'LB_GGFYFT': {
            showJr = true
			break
		}

		default: null
	}

    return {
        showJr
    }
}
