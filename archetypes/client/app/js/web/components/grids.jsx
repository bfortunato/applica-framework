"use strict"

export class GridHeaderCell extends React.Component {
    changeSort() {
        if (_.isFunction(this.props.onSortChanged)) {
            this.props.onSortChanged()
        }
    }

    render() {
        let className = this.props.column.sortable ? "sorting" : ""

        return (
            <th>
                {this.props.column.header}

                {this.props.column.sortable ?
                    <i className="pull-right zmdi zmdi-unfold-more" />
                : null}
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
        let headerCells = this.props.descriptor.columns.map(c => <GridHeaderCell key={id++} column={c} />)

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

        let rowElements = rows.map(r => <GridRow key={r.id} descriptor={this.props.descriptor} row={r} />)

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
    render() {
        if (_.isEmpty(this.props.descriptor)) {
            return null
        }

        return (
            <table className="table table-striped table-condensed table-hover">
                <GridHeader descriptor={this.props.descriptor} query={this.props.query} />
                <GridBody descriptor={this.props.descriptor} result={this.props.result} query={this.props.query} />
                <GridFooter result={this.props.result} query={this.props.query} />
            </table>
        )
    }
}

