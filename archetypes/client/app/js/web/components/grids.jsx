"use strict"

import * as query from "../../api/query"

export class GridHeaderCell extends React.Component {
    constructor(props) {
        super(props)

        this.state = {sorting: false, sortDescending: false}
    }

    changeSort() {
        if (this.state.sorting == false) {
            this.setState({sorting: true, sortDescending: false})
        } else if (this.state.sortDescending == false) {
            this.setState({sorting: true, sortDescending: true})
        } else {
            this.setState({sorting: false, sortDescending: false})
        }

        if (this.props.query) {
            if (this.state.sorting) {
                this.props.query.sort(this.props.column.property, this.state.sortDescending)
            } else {
                this.props.query.unsort(this.props.column.property)
            }
        }

        if (_.isFunction(this.props.onSort)) {
            this.props.onSort(this.state)
        }
    }

    render() {
        let sortIcon = "zmdi zmdi-unfold-more"
        if (this.state.sorting && this.state.sortDescending) {
            sortIcon = "zmdi zmdi-caret-down"
        } else if (this.state.sorting && !this.state.sortDescending) {
            sortIcon = "zmdi zmdi-caret-up"
        }

        return (
            <th>
                {this.props.column.header}

                {this.props.column.sortable ?
                    <a className="pull-right" href="javascript:;" onClick={this.changeSort.bind(this)}><i className={sortIcon}/></a>
                : null}
            </th>
        )
    }
}

export class GridHeader extends React.Component {
    invokeOnSort() {
        if (_.isFunction(this.props.onSort)) {
            this.props.onSort()
        }
    }

    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        let id = 1
        let headerCells = this.props.descriptor.columns.map(c => <GridHeaderCell key={id++} column={c} query={this.props.query} onSort={this.invokeOnSort.bind(this)} />)

        return (
            <thead>
            <tr>{headerCells}</tr>
            </thead>
        )
    }
}

export class GridRow extends React.Component {
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

        let rowElements = rows.map(r => <GridRow key={r.id} descriptor={this.props.descriptor} row={r} query={this.props.query} />)

        return (
            <tbody>
            {rowElements}
            </tbody>
        )
    }
}

export class GridFooter extends React.Component {
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
            <td><input type="checkbox" value="1" checked={checked} /></td>
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

export class Grid extends React.Component {
    constructor(props) {
        super(props)

        if (!this.props.query) {
            this.props.query = query.create()
        }
    }

    onSortChanged() {
        if (_.isFunction(this.props.onQueryChanged)) {
            this.props.onQueryChanged(this.props.query)
        }
    }

    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        return (
            <table className="table table-striped table-condensed table-hover">
                <GridHeader descriptor={this.props.descriptor} query={this.props.query} onSort={this.onSortChanged.bind(this)} />
                <GridBody descriptor={this.props.descriptor} result={this.props.result} query={this.props.query} />
                <GridFooter result={this.props.result} query={this.props.query} />
            </table>
        )
    }
}

