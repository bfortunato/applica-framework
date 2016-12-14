"use strict"

import * as query from "../../api/query"
import strings from "../../strings"
import { Card, HeaderBlock } from "./common"
import { format } from "../../utils/lang"
import { Observable } from "../../aj/events"

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

function resultToGridRows(result) {
    if (!result || !result.rows) {
        return null
    }
    let index = 0
    return result.rows.map(r => { return {
            data: r,
            index: index++,
            children: null,
            selected: false
    }})
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

    handle(row) {
        if (this.shiftPressed) {
            this.rows.forEach(r => r.selected = false)
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
                this.rows.forEach(r => {
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
            this.rows.forEach(r => r.selected = false)
            row.selected = true
            this.rangeStartRow = row
            this.lastSelected = row
        }

        this.invoke("change")
    }

    getSelectedData() {
        return _.map(_.filter(this.rows, r => r.selected), r => r.data)
    }

    toggleAll() {
        this.rows.forEach(r => r.selected = !this.allSelected)
        this.allSelected = !this.allSelected
        this.lastSelected = null
        this.rangeStartRow = null

        this.invoke("change")
    }

    clear() {
        this.rows.forEach(r => r.selected = false)
        this.allSelected = false
        this.lastSelected = null
        this.rangeStartRow = null

        this.invoke("change")
    }

    down() {
        if (!this.rows || this.rows.length == 0) {
            return
        }

        let index = -1
        if (this.lastSelected != null) {
            index = this.rows.indexOf(this.lastSelected)
        }

        index++
        if (index >= this.rows.length) {
            index = 0
        }
        let newRow = this.rows[index]
        this.handle(newRow)
    }

    up() {
        if (!this.rows || this.rows.length == 0) {
            return
        }

        let index = -1
        if (this.lastSelected != null) {
            index = this.rows.indexOf(this.lastSelected)
        }

        index--
        if (index < 0) {
            index = this.rows.length - 1
        }
        let newRow = this.rows[index]
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
        if (this.props.query) {
            this.props.query.filter(this.state.type, this.props.column.property, this.state.value)

            this.close()
        }
    }

    render() {
        return (
            <div className="search-dialog modal fade" role="dialog" tabIndex="-1" style={{display: "none"}}>
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
            <th style={{position: "relative"}}>
                <span onClick={this.changeSort.bind(this)} className="pointer-cursor">{this.props.column.header}</span>

                {this.props.column.sortable ?
                    <a className="pull-right" href="javascript:;" onClick={this.changeSort.bind(this)}><i className={sortIcon}/></a>
                    : null}

                <a ref="search" className="btn bgm-bluegray btn-no-shadow" href="javascript:;" onClick={this.search.bind(this)} style={{display: "none", marginTop: "-5px", position: "absolute", right: "30px"}}><i className="zmdi zmdi-search"/></a>

                <SearchDialog column={this.props.column} query={this.props.query}/>
            </th>
        )
    }
}

export class Header extends React.Component {
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

    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let cells = this.props.descriptor.columns.map(c => createCell(c.component, c.property, this.props.row))
        let className = this.props.row.selected ? "selected" : ""

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

    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let rows = this.props.rows || []
        let rowElements = rows.map(r => <Row key={r.index} descriptor={this.props.descriptor} row={r} query={this.props.query} onMouseDown={this.onRowMouseDown.bind(this)} onDoubleClick={this.onRowDoubleClick.bind(this)} />)

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

export class Footer extends React.Component {
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
    render() {
        return (
            <td>{this.props.value}</td>
        )
    }
}

export class CheckCell extends Cell {
    render() {
        let checked = this.props.value === true || this.props.value == "true" || parseInt(this.props.value) > 0
        let icon = checked ? "zmdi zmdi-check" : "zmdi zmdi-square-o"

        return (
            <td><i className={icon} /></td>
        )
    }
}

export function createCell(type, property, row) {
    let key = property + "" + row.index
    let value = row.data[property]

    switch (type) {
        case "check":
            return <CheckCell key={key} row={row} value={value} />

        case "text":
        default:
            return <TextCell key={key} row={row} value={value} />
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
        let totalPages = parseInt(Math.ceil(this.props.result.totalRows / this.props.query.rowsPerPage))
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
        if (_.isEmpty(this.props.query) || _.isEmpty(this.props.result)) {
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
        if (this.props.query && this.props.result) {
            rowsPerPage = this.props.query.rowsPerPage || 0
            totalRows = this.props.result.totalRows
            page = parseInt(this.props.query.page || 1)
            start = (page - 1) * rowsPerPage + 1
            stop = Math.min(page * rowsPerPage, totalRows)
        }

        return (
            <p className="result-summary">{format(strings.pagination, start, stop, totalRows)}</p>
        )
    }
}


export class Grid extends React.Component {
    constructor(props) {
        super(props)

        this.selection = null
        this.state = {rows: null}
    }

    getTotalRows() {
        let totalRows = parseInt(this.props.result.totalRows)
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
        this.selection.handle(row)
    }

    onRowDoubleClick() {
    }

    componentWillReceiveProps(nextProps) {
        let rows = resultToGridRows(nextProps.result)
        if (rows != null) {
            this.selection = new Selection(rows)
            this.selection.on("change", () => {
                this.setState(this.state)
                if (_.isFunction(this.props.onSelectionChanged)) {
                    this.props.onSelectionChanged(this.selection.getSelectedData())
                }
            })
        }

        this.setState(_.assign(this.state, {rows}))
    }

    toggleSelectAll() {
        if (this.selection) {
            this.selection.toggleAll()
        }
    }

    clearSelection() {
        if (this.selection) {
            this.selection.clear()
        }
    }

    getSelection() {
        if (this.selection) {
            return this.selection.getSelectedData()
        } else {
            return null
        }
    }

    getTotalPages() {
        if (!this.props.result || !this.props.query) {
            return 1
        }

        let totalPages = parseInt(Math.ceil(this.props.result.totalRows / this.props.query.rowsPerPage))
        return totalPages
    }

    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }
        
        let myQuery = this.props.query || query.create()
        let filtersHidden = myQuery.filters.length == 0
        let hasResults = this.props.result && this.props.result.rows && this.props.result.rows.length > 0
        let rows = this.state.rows
        let hasPagination = this.getTotalPages() > 1

        return (
            <div className="grid" tabIndex="0" onBlur={this.onBlur.bind(this)} onKeyPress={this.onKeyPress.bind(this)} onKeyUp={this.onKeyUp.bind(this)} onKeyDown={this.onKeyDown.bind(this)}>
                <Card>
                    <div>
                        <div hidden={filtersHidden}>
                            <Filters query={myQuery} />
                        </div>

                        {hasResults ?
                            <div className="with-result">
                                <table className="table table-striped table-hover">
                                    <Header descriptor={this.props.descriptor} query={myQuery}/>
                                    <GridBody descriptor={this.props.descriptor} rows={rows} query={myQuery} onRowMouseDown={this.onRowMouseDown.bind(this)} onRowDoubleClick={this.onRowDoubleClick.bind(this)} />
                                    <Footer descriptor={this.props.descriptor} />
                                </table>

                                <div className="pull-right m-20" hidden={!hasPagination}>
                                    <Pagination result={this.props.result} query={myQuery} />
                                </div>

                                <ResultSummary query={myQuery} result={this.props.result} />

                                <div className="clearfix"></div>
                            </div>
                            : //no results
                            <div className="no-results text-center p-30">
                                <h1><i className="zmdi zmdi-info-outline" /></h1>
                                <h4>{strings.noResults}</h4>
                            </div>
                        }
                    </div>
                </Card>
            </div>
        )
    }
}

