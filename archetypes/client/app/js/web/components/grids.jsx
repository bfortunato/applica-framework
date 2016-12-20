"use strict"

import * as query from "../../api/query"
import strings from "../../strings"
import {Card, HeaderBlock} from "./common"
import {format, optional, parseBoolean} from "../../utils/lang"
import {Observable} from "../../aj/events"

const EXPAND_ANIMATION_TIME = 250
const CELL_PADDING_TOP = 15
const CELL_PADDING_BOTTOM = 15

function isMac() {
    return navigator.platform.indexOf('Mac') > -1
}

function isControl(which) {
    if (isMac()) {
        return which == 91 || which == 93
    } else {
        return which == 17
    }
}

function isShift(which) {
    return which == 16
}

function isUp(which) {
    return which == 38
}

function isDown(which) {
    return which == 40
}

function eachChildren(root, action) {
    if (_.isArray(root)) {
        root.forEach(c => {
            action(c)

            eachChildren(c.children, action)
        })
    }
}

export function resultToGridData(result) {
    if (!result || !result.rows) {
        return null
    }
    let index = 0
    return {
        totalRows: result.totalRows,
        rows: result.rows.map(r => {
            return {
                data: r,
                index: index++,
                children: null,
                selected: false
            }
        })
    }
}

class Selection extends Observable {
    constructor(rows) {
        super()

        this.rows = rows
        this.shiftPressed = false
        this.controlPressed = false
        this.lastSelected = null
        this.rangeStartRow = null
        this.allSelected = false
    }

    flatRows() {
        let flatRows = []

        let addRows = (children) => {
            if (!children) {
                return
            }
            children.forEach(c => {
                flatRows.push(c)

                if (c.expanded) {
                    addRows(c.children)
                }
            })
        }

        addRows(this.rows)

        return flatRows
    }

    handle(row) {
        let flatRows = this.flatRows()
        
        if (this.shiftPressed) {
            flatRows.forEach(r => r.selected = false)
            if (this.rangeStartRow == null) {
                this.rangeStartRow = this.lastSelected
                if (this.rangeStartRow == null) {
                    this.rangeStartRow = row
                }
                this.lastSelected = row
                row.selected = true
            } else {
                let startIndex = Math.min(this.rangeStartRow.index, row.index)
                let endIndex = Math.max(this.rangeStartRow.index, row.index)
                flatRows.forEach(r => {
                    if (r.index >= startIndex && r.index <= endIndex) {
                        r.selected = true
                    }
                })
                this.lastSelected = row
            }
        } else if (this.controlPressed) {
            row.selected = !row.selected
            this.rangeStartRow = row
            this.lastSelected = row
        } else {
            flatRows.forEach(r => r.selected = false)
            row.selected = true
            this.rangeStartRow = row
            this.lastSelected = row
        }

        this.invoke("change")
    }

    getSelectedData() {
        return _.map(_.filter(this.flatRows(), r => r.selected), r => r.data)
    }

    toggleAll() {
        this.flatRows().forEach(r => r.selected = !this.allSelected)
        this.allSelected = !this.allSelected
        this.lastSelected = null
        this.rangeStartRow = null

        this.invoke("change")
    }

    clear() {
        this.flatRows().forEach(r => r.selected = false)
        this.allSelected = false
        this.lastSelected = null
        this.rangeStartRow = null

        this.invoke("change")
    }

    down() {
        let flatRows = this.flatRows()
        
        if (!flatRows || flatRows.length == 0) {
            return
        }

        let index = -1
        if (this.lastSelected != null) {
            index = flatRows.indexOf(this.lastSelected)
        }

        index++
        if (index >= flatRows.length) {
            index = 0
        }
        let newRow = flatRows[index]
        this.handle(newRow)
    }

    up() {
        let flatRows = this.flatRows()
        
        if (!flatRows || flatRows.length == 0) {
            return
        }

        let index = -1
        if (this.lastSelected != null) {
            index = flatRows.indexOf(this.lastSelected)
        }

        index--
        if (index < 0) {
            index = flatRows.length - 1
        }
        let newRow = flatRows[index]
        this.handle(newRow)
    }
}

export class SearchDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {value: "", type: "eq"}
    }

    componentDidMount() {
        let me = ReactDOM.findDOMNode(this)
        //$(me).find("select").selectpicker()
    }

    onChangeValue(e) {
        let value = e.target.value
        this.setState(_.assign(this.state, {value}))
    }

    onTypeChange(e) {
        let type = e.target.value
        this.setState(_.assign(this.state, {type}))
    }

    close() {
        let me = ReactDOM.findDOMNode(this)
        $(me).modal("hide")
    }

    filter() {
        if (this.props.query && this.props.column && this.props.column.property) {
            this.props.query.filter(this.state.type, this.props.column.property, this.state.value)

            this.close()
        }
    }

    render() {
        return (
            <div className="search-dialog modal fade" role="dialog" tabIndex="-1" style={{display: "none", zIndex: 1500}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{this.props.column.header}</h4>
                        </div>
                        <div className="modal-body">
                            <form action="javascript:;" onSubmit={this.filter.bind(this)}>
                                <p className="c-black f-500 m-b-20 m-t-20">{strings.typeValueToSearch}</p>
                                <div className="form-group">
                                    <div className="fg-line">
                                        <input type="text" className="form-control" placeholder={strings.value} onChange={this.onChangeValue.bind(this)} value={this.state.value} />
                                    </div>
                                </div>
                                <p className="c-black f-500 m-b-20 m-t-20">{strings.selectFilterType}</p>
                                <div className="form-group">
                                    <div className="fg-line">
                                        <select className="form-control" value={this.state.type} onChange={this.onTypeChange.bind(this)}>
                                            <option value="ne">Equals</option>
                                            <option value="like">Like</option>
                                            <option value="gte">Greater then</option>
                                            <option value="lte">Lesser then</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-link waves-effect" onClick={this.filter.bind(this)}>{strings.search}</button>
                            <button type="button" className="btn btn-link waves-effect" data-dismiss="modal">{strings.close}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export class HeaderCell extends React.Component {
    constructor(props) {
        super(props)

        this.state = {sorting: false, sortDescending: false}
    }

    componentDidMount() {
        let me = $(ReactDOM.findDOMNode(this))
        let button = $(this.refs.search)

        me.mouseenter(() => {
            button
                .css({opacity: 0})
                .show()
                .stop()
                .animate({opacity: 1}, 250)
        }).mouseleave(() => {
            button
                .stop()
                .animate({opacity: 0}, 250)
        })
    }

    changeSort() {
        if (!this.props.column.sortable) {
            return
        }

        let newState = null

        if (this.state.sorting == false) {
            newState = {sorting: true, sortDescending: false}
        } else if (this.state.sortDescending == false) {
            newState = {sorting: true, sortDescending: true}
        } else {
            newState = {sorting: false, sortDescending: false}
        }

        if (this.props.query) {
            if (newState.sorting) {
                this.props.query.sort(this.props.column.property, newState.sortDescending)
            } else {
                this.props.query.unsort(this.props.column.property)
            }
        }

        this.setState(newState)
    }

    search() {
        let me = ReactDOM.findDOMNode(this)
        $(me).find(".search-dialog").modal()
    }

    render() {
        let sortIcon = "zmdi zmdi-unfold-more"
        if (this.state.sorting && this.state.sortDescending) {
            sortIcon = "zmdi zmdi-caret-down"
        } else if (this.state.sorting && !this.state.sortDescending) {
            sortIcon = "zmdi zmdi-caret-up"
        }

        return (
            <th className="hover" style={{position: "relative"}}>
                <span onClick={this.changeSort.bind(this)} className="pointer-cursor">{this.props.column.header}</span>

                {this.props.column.sortable &&
                    <a className="pull-right" href="javascript:;" onClick={this.changeSort.bind(this)}><i className={sortIcon}/></a>
                }

                {this.props.column.searchable &&
                    <a ref="search" className="btn bgm-bluegray btn-no-shadow" href="javascript:;" onClick={this.search.bind(this)} style={{display: "none", marginTop: "-5px", position: "absolute", right: "30px"}}><i className="zmdi zmdi-search"/></a>
                }

                {this.props.column.searchable &&
                    <SearchDialog column={this.props.column} query={this.props.query}/>
                }
            </th>
        )
    }
}

export class GridHeader extends React.Component {
    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let id = 1
        let headerCells = this.props.descriptor.columns.map(c => <HeaderCell key={id++} column={c} query={this.props.query} />)

        return (
            <thead>
                <tr>{headerCells}</tr>
            </thead>
        )
    }
}

export class Row extends React.Component {
    constructor(props) {
        super(props)
    }

    doubleClick(e) {
        if (_.isFunction(this.props.onDoubleClick)) {
            this.props.onDoubleClick(this.props.row)
            e.stopPropagation()
        }
    }

    onMouseDown(e) {
        if (_.isFunction(this.props.onMouseDown)) {
            this.props.onMouseDown(this.props.row)
            e.stopPropagation()
        }
    }

    componentDidMount() {
        let expandedNow = this.props.row.expandedNow || false
        if (expandedNow) {
            let me = ReactDOM.findDOMNode(this)
            this.props.row.expandedNow = undefined
            $(me)
                .find("td")
                .css({paddingTop: 0, paddingBottom: 0})
                .stop()
                .animate({paddingTop: CELL_PADDING_TOP, paddingBottom: CELL_PADDING_BOTTOM}, EXPAND_ANIMATION_TIME)
                .end()
                .find(".grid-cell-container")
                .hide()
                .slideDown(EXPAND_ANIMATION_TIME)

        }
    }

    componentDidUpdate() {
        let collapsedNow = this.props.row.collapsedNow || false
        if (collapsedNow) {
            let me = ReactDOM.findDOMNode(this)
            this.props.row.collapsedNow = undefined
            $(me)
                .find("td")
                .stop()
                .animate({paddingTop: 0, paddingBottom: 0}, EXPAND_ANIMATION_TIME)
                .end()
                .find(".grid-cell-container")
                .slideUp(EXPAND_ANIMATION_TIME)
        }
    }

    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let onExpand = (row) => {
            if (_.isFunction(this.props.onExpand)) {
                this.props.onExpand(row)
            }
        }

        let firstElement = true
        let key = 1
        let cells = this.props.descriptor.columns.map(c => {
            let cell = createCell(c, this.props.row, firstElement, onExpand)
            firstElement = false
            return <td key={key++} className={c.tdClassName}><div className="grid-cell-container">{cell}</div></td>
        })
        let className = `level-${this.props.row.level} ` + (this.props.row.selected ? "selected" : "")

        return (
            <tr onMouseDown={this.onMouseDown.bind(this)} onDoubleClick={this.doubleClick.bind(this)} className={className}>{cells}</tr>
        )
    }
}

export class GridBody extends React.Component {
    onRowMouseDown(row) {
        if (_.isFunction(this.props.onRowMouseDown)) {
            this.props.onRowMouseDown(row)
        }
    }

    onRowDoubleClick(row) {
        if (_.isFunction(this.props.onRowDoubleClick)) {
            this.props.onRowDoubleClick(row)
        }
    }

    onRowExpand(row) {
        if (_.isFunction(this.props.onRowExpand)) {
            this.props.onRowExpand(row)
        }
    }

    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let rows = this.props.data.rows || []
        let rowElements = []
        let level = this.props.level || 0
        let index = 0
        let addElements = (children, level, parentKey) => {
            let key = 1
            children.forEach(r => {
                r.index = index++
                r.level = level
                let element = (
                    <Row
                        key={parentKey + "_" + key++}
                        descriptor={this.props.descriptor}
                        row={r}
                        query={this.props.query}
                        onMouseDown={this.onRowMouseDown.bind(this)}
                        onDoubleClick={this.onRowDoubleClick.bind(this)}
                        onExpand={this.onRowExpand.bind(this)}/>
                )

                rowElements.push(element)

                if (!_.isEmpty(r.children)) {
                    if (r.expanded) {
                        addElements(r.children, level + 1, parentKey + "_" + key)
                    }
                }
            })
        }

        addElements(rows, level, "root")

        return (
            <tbody>
                {rowElements}
            </tbody>
        )
    }
}

export class FooterCell extends React.Component {
    render() {
        return (
            <th>
                {this.props.column.header}
            </th>
        )
    }
}

export class GridFooter extends React.Component {
    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let id = 1
        let footerCells = this.props.descriptor.columns.map(c => <FooterCell key={id++} column={c} query={this.props.query} />)

        return (
            <tfoot>
            <tr>{footerCells}</tr>
            </tfoot>
        )
    }
}

export class Cell extends React.Component {

}

export class TextCell extends Cell {
    toggleExpand(e) {
        if (_.isFunction(this.props.onExpand)) {
            this.props.onExpand(this.props.row)
            e.preventDefault()
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation()
            console.log("propagation stopped")
        }
    }

    render() {
        let marginLeft = 30 * (this.props.row.level || 0)
        let icon = "zmdi "
        if (!this.props.row.expanded) {
            icon += " zmdi-plus"
        } else {
            icon += " zmdi-minus"
        }

        let caret = !_.isEmpty(this.props.row.children) && this.props.firstElement ?
            <a style={{marginLeft: marginLeft, marginRight: 20}} href="javascript:;" className="expand-button" onClick={this.toggleExpand.bind(this)} onMouseDown={(e) => e.stopPropagation()}>
                <i className={"c-black " + icon} />
            </a> : null

        let style = {}
        if (caret == null && this.props.row.level > 0 && this.props.firstElement) {
            style.marginLeft = marginLeft + 20
        }

        return (
            <div>{caret}<span style={style}>{this.props.value}</span></div>
        )
    }
}

export class CheckCell extends Cell {
    render() {
        let checked = this.props.value === true || this.props.value == "true" || parseInt(this.props.value) > 0
        let icon = checked ? "zmdi zmdi-check" : "zmdi zmdi-square-o"

        return (
            <i className={icon} />
        )
    }
}

export class ActionsCell extends Cell {
    componentDidMount() {
        let me = ReactDOM.findDOMNode(this)
        $(me).closest("tr")
            .mouseenter(() => {
                $(me).find(".grid-action").stop().fadeIn(250)
            })
            .mouseleave(() => {
                $(me).find(".grid-action").stop().fadeOut(250)
            })
    }

    render() {
        let actions = this.props.column.actions.map(a => <a style={{display: "none"}} href="javascript:;" className="grid-action" onClick={a.action}><i className={a.icon} /></a>)

        return (
            <div>{actions}</div>
        )
    }
}


export class KeywordSearch extends React.Component {
    render() {
        return (
            <div className="col-md-offset-8 col-md-4 keyword-search">
                <form action="javascript:;">
                    <div className="input-group">
                        <span className="input-group-addon"><i className="zmdi zmdi-search"></i></span>
                        <div className="fg-line">
                            <input type="text" className="form-control" placeholder="Search..." />
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export class Filter extends React.Component {
    unfilter() {
        if (!this.props.query) {
            return
        }

        this.props.query.unfilter(this.props.data.property)
    }

    render() {
        return (
            <button onClick={this.unfilter.bind(this)} className="btn btn-no-shadow bgm-bluegray waves-effect m-r-10" >{this.props.data.property} <i className="zmdi zmdi-close"></i></button>
        )
    }
}

export class Filters extends React.Component {
    clearFilters() {
        if (!this.props.query) {
            return
        }

        this.props.query.clearFilters()
    }

    render() {
        let filters = []
        if (this.props.query) {
            filters = this.props.query.filters.map(f => <Filter key={f.property + f.type + f.value} data={f} query={this.props.query} />)
        }

        let actions = [
            {icon: "zmdi zmdi-delete", action: this.clearFilters.bind(this)}
        ]

        return (
            <div className="filters p-30">
                <button type="button" className="btn btn-no-shadow bgm-bluegray waves-effect m-r-10"><i className="zmdi zmdi-delete" /></button>{filters}
            </div>
        )
    }
}


export class Pagination extends React.Component {
    changePage(page) {
        this.props.query.changePage(page)
    }

    getTotalPages() {
        if (!this.props.data || !this.props.data.rows || !this.props.query) {
            return 1
        }

        let totalPages = parseInt(Math.ceil(this.props.data.totalRows / this.props.query.rowsPerPage))
        return totalPages
    }

    nextPage() {
        let totalPages = this.getTotalPages()
        if (this.props.query.page < totalPages) {
            this.props.query.changePage(this.props.query.page + 1)
        }
    }

    previousPage() {
        if (this.props.query.page > 1) {
            this.props.query.changePage(this.props.query.page - 1)
        }
    }

    render() {
        if (_.isEmpty(this.props.query) || _.isEmpty(this.props.data.rows)) {
            return null
        }

        let totalPages = this.getTotalPages()
        let visible = totalPages > 1
        let page = parseInt(this.props.query.page || 1)
        let pages = []
        for (let i = 1; i <= totalPages; i++) {
            let active = i == page ? "active" : ""
            pages.push(<li key={i} className={active}><a href="javascript:;" onClick={this.changePage.bind(this, i)}>{i}</a></li>)
        }

        return (
            <ul className="pagination" hidden={!visible}>
                <li>
                    <a href="javascript:;" onClick={this.previousPage.bind(this)} aria-label="Previous">
                        <i className="zmdi zmdi-chevron-left"></i>
                    </a>
                </li>
                {pages}
                <li>
                    <a href="javascript:;" onClick={this.nextPage.bind(this)} aria-label="Next">
                        <i className="zmdi zmdi-chevron-right"></i>
                    </a>
                </li>
            </ul>
        )
    }
}


export class ResultSummary extends React.Component {
    render() {
        let totalRows = 0
        let start = 0
        let stop = 0
        let rowsPerPage = 0
        let page = 0
        if (this.props.query && this.props.data.rows) {
            rowsPerPage = this.props.query.rowsPerPage || 0
            totalRows = this.props.data.totalRows
            page = parseInt(this.props.query.page || 1)
            start = (page - 1) * rowsPerPage + 1
            stop = Math.min(page * rowsPerPage, totalRows)
        }

        return (
            <p className="result-summary">{format(strings.pagination, start, stop, totalRows)}</p>
        )
    }
}

export class NoCard extends React.Component {
    render() {
        return (
            <div>{this.props.children}</div>
        )
    }
}

export class QuickSearch extends React.Component {
    search(e) {
        let keyword = e.target.value
        if (!_.isEmpty(keyword)) {
            console.log(keyword)            
        }
    }

    render() {
        return (
            <div className="quick-search pull-right">
                <i className="zmdi zmdi-search pull-right" />
                <div className="quick-search-input-container">
                    <input type="search" onChange={this.search.bind(this)} />
                </div>
            </div>
        )
    }
}

export class Grid extends React.Component {
    constructor(props) {
        super(props)

        this.selection = null
        this.state = {rows: null}

        this.initSelection(props)
    }

    getTotalRows() {
        let totalRows = parseInt(this.props.data.totalRows)
        return totalRows
    }

    onKeyPress(e) {

    }

    onBlur() {
        //if (this.selection) this.selection.clear()
    }

    onKeyDown(e) {
        let me = ReactDOM.findDOMNode(this)
        if (this.selection != null) {
            if (isShift(e.which)) {
                me.onselectstart = function() { return false }
                this.selection.shiftPressed = true
                e.preventDefault()
                return
            } else if (isControl(e.which)) {
                this.selection.controlPressed = true
                e.preventDefault()
                return
            } else if (isUp(e.which)) {
                this.selection.up()
                e.preventDefault()
                return
            } else if (isDown(e.which)) {
                this.selection.down()
                e.preventDefault()
                return
            }
        }

        if (_.isFunction(this.props.onKeyDown)) {
            this.props.onKeyDown(e)
        }
    }

    onKeyUp(e) {
        let me = ReactDOM.findDOMNode(this)
        if (this.selection != null) {
            if (isShift(e.which)) {
                me.onselectstart = null
                this.selection.shiftPressed = false
                e.preventDefault()
                return
            } else if (isControl(e.which)) {
                this.selection.controlPressed = false
                e.preventDefault()
                return
            }
        }

        if (_.isFunction(this.props.onKeyUp)) {
            this.props.onKeyUp(e)
        }

    }

    onRowMouseDown(row) {
        let selectionEnabled = optional(parseBoolean(this.props.selectionEnabled), true)
        if (!selectionEnabled) {
            return
        }

        this.selection.handle(row)
    }

    onRowDoubleClick() {
    }

    onRowExpand(row) {
        let expanded = !row.expanded

        if (expanded) {
            eachChildren(row.children, r => r.expandedNow = true)
        } else {
            eachChildren(row.children, r => r.collapsedNow = true)
        }
        if (!expanded) {
            this.forceUpdate()

            setTimeout(() => {
                row.expanded = expanded
                this.forceUpdate()
            }, EXPAND_ANIMATION_TIME)
        } else {
            row.expanded = expanded
            this.forceUpdate()
        }
    }

    initSelection(props) {
        let selectionEnabled = optional(parseBoolean(props.selectionEnabled), true)
        if (!selectionEnabled) {
            return
        }


        let rows = props.data && props.data.rows
        if (rows) {
            this.selection = new Selection(rows)
            this.selection.on("change", () => {
                this.setState(this.state)
                if (_.isFunction(this.props.onSelectionChanged)) {
                    this.props.onSelectionChanged(this.selection.getSelectedData())
                }
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        this.initSelection(nextProps)

        let rows = nextProps.data && nextProps.data.rows
        this.setState(_.assign(this.state, {rows}))
    }

    toggleSelectAll() {
        let selectionEnabled = optional(parseBoolean(this.props.selectionEnabled), true)
        if (!selectionEnabled) {
            return
        }


        if (this.selection) {
            this.selection.toggleAll()
        }
    }

    clearSelection() {
        let selectionEnabled = optional(parseBoolean(this.props.selectionEnabled), true)
        if (!selectionEnabled) {
            return
        }

        if (this.selection) {
            this.selection.clear()
        }
    }

    getSelection() {
        let selectionEnabled = optional(parseBoolean(this.props.selectionEnabled), true)
        if (!selectionEnabled) {
            return
        }

        if (this.selection) {
            return this.selection.getSelectedData()
        } else {
            return null
        }
    }

    getTotalPages() {
        if (!this.props.data || !this.props.data.rows || !this.props.query) {
            return 1
        }

        let totalPages = parseInt(Math.ceil(this.props.data.totalRows / this.props.query.rowsPerPage))
        return totalPages
    }

    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        //customization properties
        let quickSearchEnabled = optional(parseBoolean(this.props.quickSearchEnabled), false)
        let headerVisible = optional(parseBoolean(this.props.headerVisible), true)
        let footerVisible = optional(parseBoolean(this.props.footerVisible), true)
        let summaryVisible = optional(parseBoolean(this.props.summaryVisible), true)    
        let selectionEnabled = optional(parseBoolean(this.props.selectionEnabled), true)
        let paginationEnabled = optional(parseBoolean(this.props.paginationEnabled), true)
        let tableClassName = optional(this.props.tableClassName, "table table-striped table-hover")

        let myQuery = optional(this.props.query, query.create())
        let showFilters = myQuery.filters.length > 0
        let hasResults = (this.props.data && this.props.data.rows) ? this.props.data.rows.length > 0 : false
        let rows = this.props.data && this.props.data.rows
        let hasPagination = this.getTotalPages() > 1
        let noResultsText = optional(this.props.noResultText, strings.noResults)

        let container = this.props.showInCard === false ? NoCard : Card

        return (
            <div className="grid" tabIndex="0" onBlur={this.onBlur.bind(this)} onKeyPress={this.onKeyPress.bind(this)} onKeyUp={this.onKeyUp.bind(this)} onKeyDown={this.onKeyDown.bind(this)}>
                <container>
                    <div>
                        {quickSearchEnabled &&
                            <QuickSearch query={myQuery} />
                        }

                        {showFilters &&
                            <Filters query={myQuery} />
                        }

                        {hasResults ?
                            <div className="with-result">
                                <table className={tableClassName}>
                                    {headerVisible && 
                                        <GridHeader descriptor={this.props.descriptor} query={myQuery}/>
                                    }
                                    <GridBody descriptor={this.props.descriptor} data={this.props.data} query={myQuery} onRowExpand={this.onRowExpand.bind(this)} onRowMouseDown={this.onRowMouseDown.bind(this)} onRowDoubleClick={this.onRowDoubleClick.bind(this)} />
                                    {footerVisible &&
                                        <GridFooter descriptor={this.props.descriptor} />
                                    }
                                </table>

                                {hasPagination && paginationEnabled &&
                                    <div className="pull-right m-20">
                                        <Pagination data={this.props.data} query={myQuery} />
                                    </div>
                                }

                                {summaryVisible && 
                                    <ResultSummary query={myQuery} data={this.props.data} />
                                }

                                <div className="clearfix"></div>
                            </div>
                            : //no results
                            <div className="no-results text-center p-30">
                                <h1><i className="zmdi zmdi-info-outline" /></h1>
                                <h4>{strings.noResults}</h4>
                            </div>
                        }
                    </div>
                </container>
            </div>
        )
    }
}



export function createCell(column, row, firstElement, onExpand) {
    let key = column.property + "" + row.index
    let value = row.data[column.property]

    return React.createElement(column.cell, {key, column, property: column.property, row, value, firstElement, onExpand})
    
}