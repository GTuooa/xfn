export default function disabledEndDate (beginDate, endDate) {
    // 开始日期 结束日期 '2018-05-19'

    // 不可选择的beginDate之前日期
    let nextIssuedate = new Date(beginDate)
    nextIssuedate.setDate(nextIssuedate.getDate() + 1)
    //多账期的时间，时间间隔
    let lastIssuedate = new Date(beginDate)
    lastIssuedate.setDate(lastIssuedate.getDate() + 50)

    if (endDate && endDate !== beginDate) {
        //为了解决选择完结束日期时 再次选择结束日期时多禁掉一天
        nextIssuedate = new Date(beginDate)
    }
    return function (current) {
        return current.getTime() < new Date(nextIssuedate).getTime() || current.getTime() > new Date(lastIssuedate).getTime() || current.getTime() > new Date().getTime()
    }
}
