"use strict"

import * as query from "../../api/query"
import strings from "../../strings"

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

    filter() {
        if (this.props.query) {
            this.props.query.filter(this.state.type, this.props.column.property, this.state.value)

            console.log(this.props.query)
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

        console.log("Sorting state after change: " + JSON.stringify(newState))
        console.log("Query: " + JSON.stringify(this.props.query))

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
            <th>
                <span className="search-cursor" onClick={this.search.bind(this)}>{this.props.column.header}</span>

                {this.props.column.sortable ?
                    <a className="pull-right" href="javascript:;" onClick={this.changeSort.bind(this)}><i className={sortIcon}/></a>
                : null}

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
    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let cells = this.props.descriptor.columns.map(c => createCell(c.component, c.property, this.props.row))

        return (
            <tr>{cells}</tr>
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

        let rowElements = rows.map(r => <Row key={r.id} descriptor={this.props.descriptor} row={r} query={this.props.query} />)

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

        return (
            <td><input type="checkbox" value="1" checked={checked} readOnly="true"/></td>
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


export class Filters extends React.Component {
    render() {
        return (
            <div className="col-md-offset-8 col-md-4">

            </div>
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

        return (
            <div className="grid">
                <Filters query={this.props.query} />

                <table className="table table-striped table-condensed table-hover">
                    <Header descriptor={this.props.descriptor} query={this.props.query}/>
                    <GridBody descriptor={this.props.descriptor} result={this.props.result} query={this.props.query} />
                    <Footer result={this.props.result} query={this.props.query} />
                </table>
            </div>
        )
    }
}

