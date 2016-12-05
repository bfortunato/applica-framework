"use strict"

export class Card extends React.Component {
    render() {
        return (
            <div className="card">
                {!_.isEmpty(this.props.title) ?
                    <div className="card-header">
                        <h2>
                            {this.props.title}
                            {!_.isEmpty(this.props.subtitle) ?
                                <small>{this.props.subtitle}</small>
                                : null }
                        </h2>
                    </div>
                    : null }

                {this.props.children}
            </div>
        )
    }
}