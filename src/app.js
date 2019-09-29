import React from 'react';
import ReactDOM from 'react-dom';

const emojis = { wolf: '🐺', goat: '🐐', cabbage: '🥦', traveler: '🚣' };

class Game extends React.Component {
    state = {
        gameOver: false,
        currentSide: 'left',
        left: ['wolf', 'goat', 'cabbage', 'traveler'],
        right: []
    };

    arrayDifference = (a, b) => {
        return a.filter(x => !b.includes(x));
    };

    handleRestart = () => {
        this.setState(() => {
            return {
                gameOver: false,
                reason: '',
                currentSide: 'left',
                left: ['wolf', 'goat', 'cabbage', 'traveler'],
                right: []
            };
        });
    };

    check = () => {
        const abandoned = this.state.currentSide === 'left' ? 'right' : 'left';
        const bank = this.state[abandoned];
        if (bank.includes('wolf') && bank.includes('goat')) {
            this.setState(() => {
                return { gameOver: true, reason: 'The Wolf ate the Goat!' };
            });
        }
        if (bank.includes('cabbage') && bank.includes('goat')) {
            this.setState(() => {
                return {
                    gameOver: true,
                    reason: 'The Goat ate the Cabbage!'
                };
            });
        }
        if (this.state.right.length === 4) {
            this.setState(() => {
                return {
                    gameOver: true,
                    reason: 'Nice! All have crossed the river safely!'
                };
            });
        }
    };

    updateSides = chosen => {
        this.setState(
            prevState => {
                return {
                    left:
                        prevState.currentSide === 'left'
                            ? this.arrayDifference(prevState.left, chosen)
                            : chosen.concat(prevState.left),
                    right:
                        prevState.currentSide === 'left'
                            ? chosen.concat(prevState.right)
                            : this.arrayDifference(prevState.right, chosen),
                    currentSide:
                        prevState.currentSide === 'left' ? 'right' : 'left'
                };
            },
            () => {
                this.check();
            }
        );
    };

    render() {
        return (
            <div>
                {this.state.gameOver ? (
                    <GameOver
                        reason={this.state.reason}
                        handleRestart={this.handleRestart}
                    />
                ) : (
                    <div>
                        <h2 id="title">Wolf, Goat, and Cabbage</h2>
                        <div className="columns">
                            <div className="column is-half">
                                <Side
                                    updateSides={this.updateSides}
                                    location="left"
                                    items={this.state.left}
                                    currentSide={this.state.currentSide}
                                />
                            </div>
                            <div className="column">
                                <Side
                                    updateSides={this.updateSides}
                                    location="right"
                                    items={this.state.right}
                                    currentSide={this.state.currentSide}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const GameOver = props => {
    return (
        <div id="victory">
            <h1>Game Over!</h1>
            <p>{props.reason}</p>
            <button onClick={props.handleRestart}>Play again</button>
        </div>
    );
};

class Side extends React.Component {
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

ReactDOM.render(<Game />, document.getElementById('app'));
