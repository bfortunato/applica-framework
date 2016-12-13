"use strict"

import * as query from "../../api/query"
import strings from "../../strings"
import { Card, HeaderBlock } from "./common"

export class SearchDialog extends React.Component {
    constructor(props) {
        super(props)

        this.state = {value: "", type: "eq"}
    }

    componentDidMount() {
        let me = ReactDOM.findDOMNode(this)
        $(me).find("select").selectpicker()
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
                                        <select value={this.state.type} onChange={this.onTypeChange.bind(this)}>
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
        let newState = null

        console.log("Sorting state before change: " + JSON.stringify(this.state))

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

        console.log("Sorting state in rendering: " + JSON.stringify(this.state))

        return (
            <th style={{position: "relative"}}>
                <span>{this.props.column.header}</span>

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

        this.state = {selected: false}
    }

    select() {
        this.state.selected = !this.state.selected
    }

    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let cells = this.props.descriptor.columns.map(c => createCell(c.component, c.property, this.props.row))
        let className = this.state.selected ? "selected" : ""

        return (
            <tr onClick={this.select.bind(this)} className={className}>{cells}</tr>
        )
    }
}

export class GridBody extends React.Component {
    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let pages = 1
        let totalRows = 0
        let rows = []
        let rowsPerPage = 50

        if (this.props.result) {
            pages = this.props.result.pages || 1
            totalRows = this.props.result.totalRows || []
            rows = this.props.result.rows || []
            rowsPerPage = this.props.result.rowsPerPage || 50
        }

        let index = 0
        let rowElements = rows.map(r => <Row key={r.id} index={++index} descriptor={this.props.descriptor} row={r} query={this.props.query} />)

        return (
            <tbody>
            {rowElements}
            </tbody>
        )
    }
}

export class Footer extends React.Component {
    render() {
        return null
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
    let key = property + "" + row.id
    let value = row[property]

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


export class Grid extends React.Component {
    constructor(props) {
        super(props)

        if (!this.props.query) {
            this.props.query = query.create()
        }
    }

    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let filtersHidden = this.props.query.filters.length == 0

        return (
            <div className="grid">
                <Card>
                    <div hidden={filtersHidden}>
                        <Filters query={this.props.query} />
                    </div>

                    <table className="table table-striped table-hover">
                        <Header descriptor={this.props.descriptor} query={this.props.query}/>
                        <GridBody descriptor={this.props.descriptor} result={this.props.result} query={this.props.query} />
                        <Footer result={this.props.result} query={this.props.query} />
                    </table>
                    <div className="text-center">
                        <Pagination result={this.props.result} query={this.props.query} />
                    </div>
                </Card>
            </div>
        )
    }
}

