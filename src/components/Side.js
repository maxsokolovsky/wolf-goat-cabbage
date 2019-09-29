import React from 'react';

const emojis = { wolf: '🐺', goat: '🐐', cabbage: '🥦', traveler: '🚣' };

export default class Side extends React.Component {
    state = { error: undefined };

    handleChoose = e => {
        e.preventDefault();
        const chosen = Object.values(e.target.elements)
            .filter(el => el.checked)
            .map(el => el.value);
        const error = this.handleSideState(chosen);
        this.setState(() => {
            return { error };
        });
    };

    handleSideState = chosen => {
        if (!chosen.includes('traveler')) {
            return 'Error: traveler must always be selected';
        } else if (chosen.length > 2) {
            return 'Error: can move at most one thing at once';
        }
        this.props.updateSides(chosen);
    };

    clearError = () => {
        if (this.state.error) {
            this.setState(() => {
                return { error: undefined };
            });
        }
    };

    render() {
        return (
            <div className="side" id={this.props.location}>
                <h3>{`${this.props.location} side`.toUpperCase()}</h3>
                <div>
                    {this.state.error && <p>{this.state.error}</p>}
                    <form
                        onSubmit={this.handleChoose}
                        onChange={this.clearError}>
                        {this.props.items.map(item => (
                            <div key={item}>
                                <input
                                    type="checkbox"
                                    name={item}
                                    value={item}
                                    disabled={
                                        this.props.currentSide !==
                                        this.props.location
                                    }
                                    defaultChecked={item === 'traveler'}
                                />
                                <label>{emojis[item] + item}</label>
                            </div>
                        ))}
                        <button
                            disabled={
                                this.props.currentSide !== this.props.location
                            }>
                            Move{' '}
                            {this.props.location === 'left' ? 'right' : 'left'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}
