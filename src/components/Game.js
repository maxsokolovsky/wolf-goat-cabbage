import React from "react";
import { Grid, Row, Col } from "react-flexbox-grid";

import Side from "./Side";

export default class Game extends React.Component {
  state = {
    gameOver: false,
    currentSide: "left",
    left: ["wolf", "goat", "cabbage", "traveler"],
    right: []
  };

  arrayDifference = (a, b) => {
    return a.filter((x) => !b.includes(x));
  };

  handleRestart = () => {
    this.setState(() => {
      return {
        gameOver: false,
        reason: "",
        currentSide: "left",
        left: ["wolf", "goat", "cabbage", "traveler"],
        right: []
      };
    });
  };

  check = () => {
    const abandoned = this.state.currentSide === "left" ? "right" : "left";
    const bank = this.state[abandoned];
    if (bank.includes("wolf") && bank.includes("goat")) {
      this.setState(() => {
        return { gameOver: true, reason: "The Wolf ate the Goat!" };
      });
    }
    if (bank.includes("cabbage") && bank.includes("goat")) {
      this.setState(() => {
        return {
          gameOver: true,
          reason: "The Goat ate the Cabbage!"
        };
      });
    }
    if (this.state.right.length === 4) {
      this.setState(() => {
        return {
          gameOver: true,
          reason: "Nice! All have crossed the river safely!"
        };
      });
    }
  };

  updateSides = (chosen) => {
    this.setState(
      (prevState) => {
        return {
          left:
            prevState.currentSide === "left"
              ? this.arrayDifference(prevState.left, chosen)
              : chosen.concat(prevState.left),
          right:
            prevState.currentSide === "left"
              ? chosen.concat(prevState.right)
              : this.arrayDifference(prevState.right, chosen),
          currentSide: prevState.currentSide === "left" ? "right" : "left"
        };
      },
      () => {
        this.check();
      }
    );
  };

  render() {
    return (
      <Grid>
        <Row>
          {this.state.gameOver ? (
            <GameOver
              reason={this.state.reason}
              handleRestart={this.handleRestart}
            />
          ) : (
            <div>
              <h2 id="title">Wolf, Goat, and Cabbage</h2>
            </div>
          )}
        </Row>
        <Row>
          <Col>
            <Side
              updateSides={this.updateSides}
              location="left"
              items={this.state.left}
              currentSide={this.state.currentSide}
            />
          </Col>
          <Col>
            <Side
              updateSides={this.updateSides}
              location="right"
              items={this.state.right}
              currentSide={this.state.currentSide}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

const GameOver = (props) => {
  return (
    <div id="victory">
      <h1>Game Over!</h1>
      <p>{props.reason}</p>
      <button onClick={props.handleRestart}>Play again</button>
    </div>
  );
};
