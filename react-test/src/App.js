//import Map from './Map';
import React, { Component}  from 'react';
var _ = require('lodash');

const possibleCombinationSum = function (arr, n) {
	if (arr.indexOf(n) >= 0) { return true; }
	if (arr[0] > n) { return false; }
	if (arr[arr.length - 1] > n) {
		arr.pop();
		return possibleCombinationSum(arr, n);
	}
	var listSize = arr.length, combinationsCount = (1 << listSize)
	for (var i = 1; i < combinationsCount; i++) {
		var combinationSum = 0;
		for (var j = 0; j < listSize; j++) {
			if (i & (1 << j)) { combinationSum += arr[j]; }
		}
		if (n === combinationSum) { return true; }
	}
	return false;
};

const Stars = (props) => {
	let stars = [];
	for (let i = 0; i < props.numberOfStars; i++) {
		stars.push(<i key={i} className="fa fa-star" />);
	}
	return (
		<div className="col-5">
			{stars}
		</div>
	);
}

const Button = (props) => {
	let button;
	switch (props.answerIsCorrect) {
		case true:
			button = <button className="btn btn-success"
				onClick={props.acceptAnswer}>
				<i className="fa fa-check"></i>
			</button >;
			break;
		case false:
			button = <button className="btn btn-danger">
				<i className="fa fa-times"></i>
			</button >;
			break;
		default:
			button = <button className="btn"
				onClick={props.checkAnswer}
				disabled={props.selectedNumbers.length === 0}>
				=
			</button >;
			break;
	}

	return (
		<div className="col-2 text-center">
			{button}
			<br />
			<br />
			<button className="btn btn-warning btn-sm"
				onClick={props.redraw}
				disabled={props.redraws === 0}
			>
				<i className="fa fa-refresh"></i>{props.redraws}
			</button>
		</div>
	);
}

const Answer = (props) => {
	return (
		<div className="col-5">
			{props.selectedNumbers.map((number, i) =>
				<span key={i}
					onClick={() => props.unSelectNumber(number)}>
					{number}
				</span>)}
		</div>
	);
}

const Numbers = (props) => {
	const numberClassName = (number) => {
		if (props.selectedNumbers.indexOf(number) >= 0) {
			return 'selected'
		}
		if (props.usedNumbers.indexOf(number) >= 0) {
			return 'used'
		}
	};


	return (
		<div className="card text-center">
			<div>
				{Numbers.list.map((number, i) =>
					<span key={i}
						className={numberClassName(number)}
						onClick={() => props.selectNumber(number)}>
						{number}
					</span>
				)}
			</div>
		</div>
	);
}

Numbers.list = _.range(1, 10);

const DoneFrame = (props) => {
	return (
		<div className="text-center">
			<h2>{props.doneStatus}</h2>
			<button className="btn btn-secondary"
				onClick={props.resetGame}>
				Play Again
		</button>
		</div>
	);
}

class Game extends React.Component {
	static randomNumber = () => 1 + Math.floor(Math.random() * 9);
	static initialState = () => ({
		selectedNumbers: [],
		randomNumberOfStars: Game.randomNumber(),
		usedNumbers: [],
		answerIsCorrect: null,
		redraws: 5,
		doneStatus: null,
	});

	state = Game.initialState();

	selectNumber = (clickedNumber) => {
		if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) return;
		this.setState(prevState => ({
			selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
		}));
	};

	unSelectNumber = (clickedNumber) => {
		this.setState(prevState => ({
			selectedNumbers: prevState
				.selectedNumbers
				.filter(number => number !== clickedNumber)
		}));
	};

	checkAnswer = () => {
		this.setState(prevState => ({
			answerIsCorrect: prevState.randomNumberOfStars ===
				prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
		}));
	};

	acceptAnswer = () => {
		this.setState(prevState => ({
			usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
			selectedNumbers: [],
			answerIsCorrect: null,
			randomNumberOfStars: Game.randomNumber(),
		}), this.updateDoneStaus);
	}

	redraw = () => {
		if (this.state.redraws === 0) { return; }
		this.setState(prevState => ({
			selectedNumbers: [],
			answerIsCorrect: null,
			randomNumberOfStars: Game.randomNumber(),
			redraws: prevState.redraws - 1
		}), this.updateDoneStaus);
	}

	possibleSolutions = ({ randomNumberOfStars, usedNumbers }) => {
		const possibleNumbers = _.range(1, 10).filter(number =>
			usedNumbers.indexOf(number) === -1);

		return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
	};

	updateDoneStaus = () => {
		this.setState(prevState => {
			if (prevState.usedNumbers.length === 9) {
				return { doneStatus: 'Done. Nice!' };
			}
			if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
				return { doneStatus: 'Game Over!' }
			}
		});
	};

	resetGame = () => this.setState(Game.initialState());

	render() {
		const { selectedNumbers,
			randomNumberOfStars,
			answerIsCorrect,
			usedNumbers,
			redraws,
			doneStatus
		} = this.state;
		return (
			<div className="container">
				<h3>Play Nine</h3>
				<hr />
				<div className="row">
					<Stars numberOfStars={randomNumberOfStars} />
					<Button selectedNumbers={selectedNumbers}
						checkAnswer={this.checkAnswer}
						answerIsCorrect={answerIsCorrect}
						acceptAnswer={this.acceptAnswer}
						redraw={this.redraw}
						redraws={redraws}
					/>
					<Answer selectedNumbers={selectedNumbers}
						unSelectNumber={this.unSelectNumber} />
				</div>
				<br />
				{doneStatus ?
					<DoneFrame doneStatus={doneStatus} resetGame={this.resetGame} /> :
					<Numbers selectedNumbers={selectedNumbers}
						selectNumber={this.selectNumber}
						usedNumbers={usedNumbers} />
				}
			</div>
		)
	};
}

class App extends React.Component {
	render() {
		return (
			<div>
				<Game />
			</div>
		);
	}
}