import React, { Component } from 'react';
import { Card, Hand, HandsCollection } from './bundle-compiled';

class Analizer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            boardCards: [],
            playerCards: [],
            combination: '',
            selected: 'board',
            odds: 0,
            mathExpect: 0,
            pot: 0,
            bet: 0
        };

        this.selectCard = this.selectCard.bind(this);
        this.reset = this.reset.bind(this);
        this.calcOdds = this.calcOdds.bind(this);
    }

    render() {
        const handClass = 'hand';
        const boardClass = handClass + (this.state.selected === 'board' ? ' selected' : '');
        const playerClass = handClass + (this.state.selected === 'player' ? ' selected' : '');

        const boardCards = [];
        const playerCards = [];

        this.state.boardCards.forEach(c => {
            boardCards.push(
                <span key={c.suit + c.rank}>
                    {suitAlias[c.suit]}
                    {getRankAlias(c.rank)}
                </span>
            );
        });
        this.state.playerCards.forEach(c => {
            playerCards.push(
                <span key={c.suit + c.rank}>
                    {suitAlias[c.suit]}
                    {getRankAlias(c.rank)}
                </span>
            );
        });

        return (
            <div>
                <div>
                    <div className={boardClass} onClick={this.selectHand('board')}>
                        Board:
                        <div>
                            {boardCards}
                        </div>
                    </div>
                    <div className={playerClass} onClick={this.selectHand('player')}>
                        Player:
                        <div>
                            {playerCards}
                        </div>
                    </div>
                    <div>
                        Combination: {this.state.combination}
                    </div>
                    <div>
                        Pot: <input type="text" defaultValue={this.state.pot} onChange={this.save('pot')} />
                    </div>
                    <div>
                        Bet: <input type="text" defaultValue={this.state.bet} onChange={this.save('bet')} />
                    </div>
                    <div>
                        Odds: {this.state.odds}
                    </div>
                    <div>
                        Math expectation: {this.state.mathExpect}
                    </div>
                    <div>
                        <button type="button" onClick={this.calcOdds}>Calculate</button>
                    </div>
                    <br />
                    <div>
                        <button type="button" onClick={this.reset}>Reset</button>
                    </div>
                </div>
                <div>
                    {this.renderCards()}
                </div>
            </div>
        );
    }

    selectHand(handName) {
        return function() {
            this.setState({
                selected: handName
            });
        }.bind(this);
    }

    selectCard(e) {
        const card = e.currentTarget.dataset;

        let cards = [];
        let prop = '';

        if(this.state.selected === 'board') {
            cards = this.state.boardCards;
            prop = 'boardCards';

            if(cards.length >= 5) {
                return;
            }
        } else if(this.state.selected === 'player') {
            cards = this.state.playerCards;
            prop = 'playerCards';

            if(cards.length >= 2) {
                return;
            }
        }

        if(cards.some(c => c.suit === card.suit && c.rank === card.rank)) {
            return;
        }

        cards.push(card);

        const boardCards = this.boardCards();
        const playerCards = this.playerCards();

        const board = new Hand(boardCards);
        const player = new Hand(playerCards);

        const coll = HandsCollection.createCombinations(board, player);
        const combName = coll.highestCombination && coll.highestCombination.name;

        this.setState({
            [prop]: cards,
            combination: combName
        });
    }

    calcOdds() {
        const board = new Hand(this.boardCards());
        const pocket = new Hand(this.playerCards());
        const coll = HandsCollection.createCombinations(board, pocket);

        const winChance = coll.bestDraw.outs / (52 - board.size);
        const lossChance = 1 - winChance;
        const bet = +this.state.bet || 0;
        const pot = +this.state.pot || 0;

        const mathExpect = winChance * (pot - bet) - lossChance * bet;

        console.log('Outs:', coll.bestDraw.outs);
        console.log('Win chance:', winChance);
        console.log('Loss chance:', lossChance);
        console.log('Bet:', bet);
        console.log('Pot:', pot);
        console.log('Math expectation:', mathExpect);

        this.setState({
            mathExpect,
            odds: winChance
        });
    }

    reset() {
        this.setState({
            boardCards: [],
            playerCards: [],
            combination: '',
            bet: 0,
            pot: 0,
            odds: 0,
            mathExpect: 0,
        });
    }

    save(prop) {
        return function(e) {
            const input = e.currentTarget;

            this.setState({
                [prop]: input.value
            });
        }.bind(this);
    }

    renderCards() {
        const suits = [
          Card.CLUBS,
          Card.SPADES,
          Card.HEARTS,
          Card.DIAMONDS
        ];
        const ranks = [
          Card.TWO,
          Card.THREE,
          Card.FOUR,
          Card.FIVE,
          Card.SIX,
          Card.SEVEN,
          Card.EIGHT,
          Card.NINE,
          Card.TEN,
          Card.JACK,
          Card.QUEEN,
          Card.KING,
          Card.ACE
        ];
        const rows = [];
    
        suits.forEach(s => {
          const cards = [];
          ranks.forEach(r => {
            cards.push(
              <span data-suit={s} data-rank={r} className="card" key={s.toString() + r.toString()} onClick={this.selectCard}>
                {suitAlias[s]} {getRankAlias(r)}
              </span>
            );
          });
    
          rows.push(<div key={s}>{cards}</div>);
        });
    
        return rows;
    }

    boardCards() {
        return this.toCards(this.state.boardCards);
    }

    playerCards() {
        return this.toCards(this.state.playerCards);
    }

    toCards(cardsDataArray) {
        return cardsDataArray.map(c => new Card(+c.suit, +c.rank));
    }
}

const suitAlias = {
    [Card.CLUBS]: <span className="suit club">♣</span>,
    [Card.SPADES]: <span className="suit spade">♠</span>,
    [Card.HEARTS]: <span className="suit heart">♥</span>,
    [Card.DIAMONDS]: <span className="suit diamond">♦</span>,
};

function getRankAlias(rank) {
    const rankName = Card.RANK_TO_ALIAS[rank];
    return rankName.length > 2 ? rankName[0].toUpperCase() : rankName;
}

export default Analizer;