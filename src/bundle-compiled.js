(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
                }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r];return o(n || r);
                }, p, p.exports, r, e, n, t);
            }return n[i].exports;
        }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);return o;
    }return r;
})()({ 1: [function (require, module, exports) {
        module.exports = {
            Hand: require('./src/hand'),
            Pack: require('./src/pack'),
            HandsCollection: require('./src/hands-collection'),
            Combination: require('./src/combination'),
            DrawCombination: require('./src/draw-combination'),
            Card: require('./src/card')
        };
    }, { "./src/card": 2, "./src/combination": 4, "./src/draw-combination": 8, "./src/hand": 10, "./src/hands-collection": 11, "./src/pack": 13 }], 2: [function (require, module, exports) {
        class Card {
            static create(suit, rank) {
                if (typeof suit !== 'number' || typeof rank !== 'number') {
                    return null;
                }

                return new this(suit, rank);
            }

            /**
             * @constructor
             * @param {Number} suit
             * @param {Number} rank
             */
            constructor(suit, rank) {
                this.suit = +suit;
                this.rank = +rank;
            }

            toString() {
                return this.suit + ' ' + this.rank;
            }

            toJSON() {
                return {
                    suit: Card.RANK_TO_ALIAS[this.suit],
                    rank: Card.RANK_TO_ALIAS[this.rank]
                };
            }

            valueOf() {
                return this.rank;
            }

            /**
             * Compare card to given and return either -1 or 0 or 1
             * @param {Card} card
             * @returns {Number}
             */
            compare(card) {
                if (this > card) {
                    return 1;
                } else if (this < card) {
                    return -1;
                }

                return 0;
            }

            /**
             * Returns true if cards have equal suit
             * @param {Card} card
             * @returns {Boolean}
             */
            equalBySuit(card) {
                return this.suit === card.suit;
            }

            /**
             * Returns true if cards have equal rank
             * @param {Card} card
             * @returns {Boolean}
             */
            equalByRank(card) {
                return this.rank == card.rank;
            }

            static get CLUBS() {
                return 20;
            }
            static get DIAMONDS() {
                return 21;
            }
            static get HEARTS() {
                return 22;
            }
            static get SPADES() {
                return 23;
            }
            static get SUIT_MIN() {
                return this.CLUBS;
            }
            static get SUIT_MAX() {
                return this.SPADES;
            }

            static get TWO() {
                return 0;
            }
            static get THREE() {
                return 1;
            }
            static get FOUR() {
                return 2;
            }
            static get FIVE() {
                return 3;
            }
            static get SIX() {
                return 4;
            }
            static get SEVEN() {
                return 5;
            }
            static get EIGHT() {
                return 6;
            }
            static get NINE() {
                return 7;
            }
            static get TEN() {
                return 8;
            }
            static get JACK() {
                return 9;
            }
            static get QUEEN() {
                return 10;
            }
            static get KING() {
                return 11;
            }
            static get ACE() {
                return 12;
            }
            static get RANK_MIN() {
                return this.TWO;
            }
            static get RANK_MAX() {
                return this.ACE;
            }

            static get ALIAS_TO_RANK() {
                return {
                    clubs: Card.CLUBS,
                    diamonds: Card.DIAMONDS,
                    hearts: Card.HEARTS,
                    spades: Card.SPADES,

                    2: Card.TWO,
                    3: Card.THREE,
                    4: Card.FOUR,
                    5: Card.FIVE,
                    6: Card.SIX,
                    7: Card.SEVEN,
                    8: Card.EIGHT,
                    9: Card.NINE,
                    10: Card.TEN,
                    jack: Card.JACK,
                    j: Card.JACK,
                    queen: Card.QUEEN,
                    q: Card.QUEEN,
                    king: Card.KING,
                    k: Card.KING,
                    ace: Card.ACE,
                    a: Card.ACE
                };
            }

            static get RANK_TO_ALIAS() {
                return {
                    [Card.CLUBS]: 'clubs',
                    [Card.DIAMONDS]: 'diamonds',
                    [Card.HEARTS]: 'hearts',
                    [Card.SPADES]: 'spades',

                    [Card.TWO]: 2,
                    [Card.THREE]: 3,
                    [Card.FOUR]: 4,
                    [Card.FIVE]: 5,
                    [Card.SIX]: 6,
                    [Card.SEVEN]: 7,
                    [Card.EIGHT]: 8,
                    [Card.NINE]: 9,
                    [Card.TEN]: 10,
                    [Card.JACK]: 'jack',
                    [Card.QUEEN]: 'queen',
                    [Card.KING]: 'king',
                    [Card.ACE]: 'ace'
                };
            }
        }

        module.exports = Card;
    }, {}], 3: [function (require, module, exports) {
        const Card = require('../card');
        const utils = require('./utils');

        class Detector {
            static isFlush(cards) {
                if (!cards || cards.length !== 5) {
                    return false;
                }

                const suit = cards[0].suit;
                return cards.every(card => card.suit === suit);
            }

            static isStraight(cards) {
                if (!cards || cards.length !== 5) {
                    return false;
                }

                const maxIndex = cards.length - 1;
                let isStraight = true;
                for (let i = 0; i < maxIndex - 1; i++) {
                    if (cards[i + 1] - cards[i] !== 1) {
                        isStraight = false;
                        break;
                    }
                }
                if (isStraight) {
                    const last = cards[maxIndex];
                    const penult = cards[maxIndex - 1];
                    isStraight = last.rank === Card.ACE && penult.rank === Card.FIVE || last - penult === 1;
                }

                return isStraight;
            }

            static isFourOfAKind(cards) {
                return utils.countSameRanksToArray(cards).includes(4);
            }

            static isFullHouse(cards) {
                const similarCount = utils.countSameRanksToArray(cards);
                return similarCount.includes(2) && similarCount.includes(3);
            }

            static isThreeOfAKind(cards) {
                return utils.countSameRanksToArray(cards).includes(3) && !Detector.isPair(cards) && !Detector.isFullHouse(cards);
            }

            static isTwoPairs(cards) {
                const similarCount = utils.countSameRanksToArray(cards);
                const firstIndex = similarCount.indexOf(2);

                return firstIndex !== similarCount.lastIndexOf(2) && firstIndex !== -1;
            }

            static isPair(cards) {
                const sameRanks = utils.countSameRanksToArray(cards);
                return sameRanks.includes(2) && !sameRanks.includes(3) && !Detector.isTwoPairs(cards);
            }
        }

        module.exports = Detector;
    }, { "../card": 2, "./utils": 5 }], 4: [function (require, module, exports) {
        const Card = require('../card');
        const utils = require('./utils');
        const detector = require('./detector');

        class Combination {
            constructor(hand) {
                this._hand = hand;
                this._rank = null;
                this._cards = null;
                this._highestCard = null;
                this._name = '';
            }

            get highestCard() {
                if (!this._highestCard) {
                    this._highestCard = this._getHighestCard(this.cards);
                }

                return this._highestCard;
            }

            get cards() {
                if (!this._cards) {
                    this._cards = this._getCombinationCards(this._hand);
                }

                return this._cards;
            }

            get rank() {
                if (!this._rank) {
                    this._rank = this._calculateCombination();
                }

                return this._rank;
            }

            get name() {
                if (!this._name) {
                    this._name = combinationNames[this.rank] || '';
                }

                return this._name;
            }

            valueOf() {
                return this.rank;
            }

            /**
             * Compares two combinations
             * @param {Combination} combination
             * @returns {Number}
             */
            compare(combination) {
                if (this.rank > combination.rank) {
                    return 1;
                } else if (this.rank < combination.rank) {
                    return -1;
                }

                if (this.rank === Combination.FULL_HOUSE) {
                    return this._fullHouseComparison(combination);
                }

                const highestCardComparison = this.highestCard.compare(combination.highestCard);
                if (highestCardComparison !== 0) {
                    return highestCardComparison;
                }
                const thisCards = this.cards;
                const combCards = combination.cards;
                for (let i = thisCards.length - 1; i >= 0; i--) {
                    const cardComparison = thisCards[i].compare(combCards[i]);
                    if (cardComparison !== 0) {
                        return cardComparison;
                    }
                }

                return 0;
            }

            /**
                * Returns true if combination is kicker only
                * @returns {Boolean}
               */
            isKicker() {
                return this == Combination.KICKER;
            }

            /**
             * Returns true if combination is pair
             * @returns {Boolean}
             */
            isPair() {
                return this == Combination.PAIR;
            }

            /**
             * Returns true if combination has two pairs
             * @returns {Boolean}
             */
            isTwoPairs() {
                return this == Combination.TWO_PAIR;
            }

            /**
             * Returns true if combination is three of a kind
             * @returns {Boolean}
             */
            isThreeOfKind() {
                return this == Combination.THREE_OF_A_KIND;
            }

            /**
             * Returns true if combination is straight
             * @returns {Boolean}
             */
            isStraight() {
                return this == Combination.STRAIGHT;
            }

            /**
             * Returns true if combination is flush
             * @returns {Boolean}
             */
            isFlush() {
                return this == Combination.FLUSH;
            }

            /**
             * Returns true if combination is full house
             * @returns {Boolean}
             */
            isFullHouse() {
                return this == Combination.FULL_HOUSE;
            }

            /**
             * Returns true if combination is four of a kind
             * @returns {Boolean}
             */
            isFourOfKind() {
                return this == Combination.FOUR_OF_A_KIND;
            }

            /**
             * Returns true if combination is royal flush
             * @returns {Boolean}
             */
            isRoyalFlush() {
                return this.isStraightFlush() && this.highestCard == Card.ACE;
            }

            /**
             * Returns true if combination is straight flush
             * @returns {Boolean}
             */
            isStraightFlush() {
                return this == Combination.STRAIGHT_FLUSH;
            }

            _fullHouseComparison(combination) {
                const highestCombinationCard = utils.getMostValuableFullHouseCardRank(combination.cards);
                const highestThisCard = utils.getMostValuableFullHouseCardRank(this.cards);

                if (highestThisCard > highestCombinationCard) {
                    return 1;
                } else if (highestThisCard < highestCombinationCard) {
                    return -1;
                }

                return 0;
            }

            /**
             * Returns combination's rank
             * @param {Hand} hand
             * @returns {Number}
             * @private
             */
            _calculateCombination() {
                const cards = this._hand.cards;
                const isFlush = detector.isFlush(cards);
                const isStraight = detector.isStraight(cards);

                if (isFlush && isStraight) {
                    return Combination.STRAIGHT_FLUSH;
                } else if (detector.isFourOfAKind(cards)) {
                    return Combination.FOUR_OF_A_KIND;
                } else if (detector.isFullHouse(cards)) {
                    return Combination.FULL_HOUSE;
                } else if (isFlush) {
                    return Combination.FLUSH;
                } else if (isStraight) {
                    return Combination.STRAIGHT;
                } else if (detector.isThreeOfAKind(cards)) {
                    return Combination.THREE_OF_A_KIND;
                } else if (detector.isTwoPairs(cards)) {
                    return Combination.TWO_PAIR;
                } else if (detector.isPair(cards)) {
                    return Combination.PAIR;
                }

                return Combination.KICKER;
            }

            _getCombinationCards(hand) {
                let cards = [];
                const fiveCardCombinations = [Combination.STRAIGHT_FLUSH, Combination.FLUSH, Combination.STRAIGHT, Combination.FULL_HOUSE];
                if (fiveCardCombinations.indexOf(this.rank) > -1) {
                    cards = hand.cards;
                } else if (this.rank === Combination.KICKER) {
                    cards = [hand.cards[4]];
                } else {
                    cards = utils.combinationCardsByRank(hand);
                }

                return cards;
            }

            _getHighestCard(cards) {
                const maxIndex = cards.length - 1;

                if (this.rank === Combination.STRAIGHT || this.rank === Combination.STRAIGHT_FLUSH) {
                    const last = cards[maxIndex];
                    const penult = cards[maxIndex - 1];
                    if (penult.rank === Card.FIVE && last.rank === Card.ACE) {
                        return penult;
                    }
                }

                return cards[maxIndex];
            }

            static get KICKER() {
                return 0;
            }
            static get PAIR() {
                return 1;
            }
            static get TWO_PAIR() {
                return 2;
            }
            static get THREE_OF_A_KIND() {
                return 3;
            }
            static get STRAIGHT() {
                return 4;
            }
            static get FLUSH() {
                return 5;
            }
            static get FULL_HOUSE() {
                return 6;
            }
            static get FOUR_OF_A_KIND() {
                return 7;
            }
            static get STRAIGHT_FLUSH() {
                return 8;
            }
            static get ROYAL_FLUSH() {
                return 9;
            }
        }

        const combinationNames = {
            [Combination.KICKER]: 'kicker',
            [Combination.PAIR]: 'pair',
            [Combination.TWO_PAIR]: 'two pairs',
            [Combination.THREE_OF_A_KIND]: 'three of a kind',
            [Combination.STRAIGHT]: 'straight',
            [Combination.FLUSH]: 'flush',
            [Combination.FULL_HOUSE]: 'full-house',
            [Combination.FOUR_OF_A_KIND]: 'four of a kind',
            [Combination.STRAIGHT_FLUSH]: 'straight flush',
            [Combination.ROYAL_FLUSH]: 'royal flush'
        };

        module.exports = Combination;
    }, { "../card": 2, "./detector": 3, "./utils": 5 }], 5: [function (require, module, exports) {
        class Utils {
            static combinationCardsByRank(hand) {
                const cardsByRank = Utils.groupByRank(hand.cards);

                let combinationCards = [];

                for (let val in cardsByRank) {
                    const similarRanksCount = cardsByRank[val].length;
                    if (similarRanksCount > 1) {
                        combinationCards = combinationCards.concat(cardsByRank[val]);
                    }
                }

                return combinationCards;
            }

            static groupByRank(cards = []) {
                const cardsByRank = {};

                cards.forEach(c => {
                    if (!cardsByRank[c.rank]) {
                        cardsByRank[c.rank] = [];
                    }

                    cardsByRank[c.rank].push(c);
                });

                return cardsByRank;
            }

            static getMostValuableFullHouseCardRank(cards) {
                const ranksCount = Utils.countSameRanks(cards);
                const ranks = Object.keys(ranksCount);

                return ranksCount[ranks[0]] === 3 ? ranks[0] : ranks[1];
            }

            static countSameRanksToArray(cards = []) {
                return Object.values(Utils.countSameRanks(cards));
            }

            static countSameRanks(cards = []) {
                const rankCountMap = {};

                cards.forEach(c => {
                    if (rankCountMap[c.rank]) {
                        rankCountMap[c.rank]++;
                    } else {
                        rankCountMap[c.rank] = 1;
                    }
                });

                return rankCountMap;
            }
        }

        module.exports = Utils;
    }, {}], 6: [function (require, module, exports) {
        function _getOuts(hand) {
            return hand.size >= 4 && _isFlushDraw(hand) ? 9 : 0;
        }

        function _isFlushDraw(hand) {
            const suitsCount = {};
            hand.forEach(c => {
                if (!suitsCount[c.suit]) {
                    suitsCount[c.suit] = 0;
                }

                suitsCount[c.suit]++;
            });

            return !!Object.keys(suitsCount).filter(s => suitsCount[s] === 4).length;
        }

        module.exports = function (hand) {
            return _getOuts(hand);
        };
    }, {}], 7: [function (require, module, exports) {
        function _getOuts(hand) {
            return +(hand.size >= 4) && _calculateOuts(hand);
        }

        function _calculateOuts(hand) {
            if (hand.isTwoPairs()) {
                return 4;
            } else if (hand.isThreeOfKind()) {
                return hand.size === 4 ? 3 : 6;
            }

            return 0;
        }

        module.exports = function (hand) {
            return _getOuts(hand);
        };
    }, {}], 8: [function (require, module, exports) {
        const Card = require('../card');
        const straightOuts = require('./straight');
        const flush = require('./flush');
        const fullHouse = require('./full-house');

        const straight = straightOuts(Card);

        class DrawCombination {
            constructor(hand) {
                this._hand = hand;
                this._outs = null;
                this._type = null;
            }

            get outs() {
                if (!this._outs) {
                    return this._outs = this._calculateOuts();
                }

                return this._outs;
            }

            _calculateOuts() {
                const straightOuts = straight(this._hand);
                const flushOuts = flush(this._hand);
                const fullHouseOuts = fullHouse(this._hand);

                return straightOuts + flushOuts + fullHouseOuts;
            }
        }

        module.exports = DrawCombination;
    }, { "../card": 2, "./flush": 6, "./full-house": 7, "./straight": 9 }], 9: [function (require, module, exports) {
        let cards;

        function _getOuts(hand) {
            return hand.size >= 4 ? _calculateOuts(hand) : 0;
        }

        function _calculateOuts(hand) {
            return _commonDrawOuts(hand) || _gutshotDrawOuts(hand);
        }

        function _commonDrawOuts(hand) {
            const OPEN_DRAW = 4;
            const POSSIBLE_ONE_SIDE_DRAW = 3;

            const { sequenceCount, lastSequenceCards } = _getSequenceInfo(hand);

            const isLowestStraightDraw = sequenceCount === POSSIBLE_ONE_SIDE_DRAW && hand.lastCard == cards.ACE && lastSequenceCards == cards.FOUR;
            const isOpenDraw = sequenceCount === OPEN_DRAW;
            const isHishestStraightDraw = isOpenDraw && lastSequenceCards && lastSequenceCards == cards.ACE;

            if (isHishestStraightDraw || isLowestStraightDraw) {
                return OUTS.ONE_SIDE_STRAIGHT_DRAW;
            } else if (isOpenDraw) {
                return OUTS.OPEN_STRAIGHT_DRAW;
            }

            return 0;
        }

        function _gutshotDrawOuts(hand) {
            const sequences = _getGutshotSequenceInfo(hand);
            return _isGutshotStraightDraw(sequences) ? OUTS.GUTSHOT_STRAIGHT_DRAW : 0;
        }

        function _getSequenceInfo(hand) {
            let sequenceCount = 1;
            let previousSequenceCount = 1;
            let lastSequenceCards;

            hand.reduce((prev, curr) => {
                if (curr - prev === 1) {
                    sequenceCount++;
                    lastSequenceCards = sequenceCount > 2 ? curr : lastSequenceCards;
                } else {
                    sequenceCount > 2 && (previousSequenceCount = sequenceCount);
                    sequenceCount = 1;
                }

                return curr;
            });

            return {
                sequenceCount: Math.max(sequenceCount, previousSequenceCount),
                lastSequenceCards
            };
        }

        function _getGutshotSequenceInfo(hand) {
            const sequences = [];
            let sequenceCount = 1;
            let lastCard;

            lastCard = hand.reduce((prev, curr) => {
                if (curr - prev === 1) {
                    sequenceCount++;
                } else {
                    sequences.push({ lastCard: prev, count: sequenceCount });
                    sequenceCount = 1;
                }

                return curr;
            });

            sequences.push({ lastCard, count: sequenceCount });

            return sequences;
        }

        function _isGutshotStraightDraw(sequences) {
            // gutshot is possible if given hand has up to 2 breaks in sequence
            if (sequences.length < 2 || sequences.length > 3) {
                return false;
            }

            // Gutshot is possible if either first two sequences (a, b) match formula
            // b.lastCard - b.count - a.lastCard === 1
            // or last two sequences (b, c)
            // So first of all we will try first two then second two cards
            let calculateDraw = len => {
                const s = sequences;

                const isFourCardsInBrokenSequence = s[len - 1].count > 1 || s[len - 2].count > 1;
                const spaceBetweenSubSequences = s[len - 1].lastCard - s[len - 1].count - s[len - 2].lastCard;

                return isFourCardsInBrokenSequence && spaceBetweenSubSequences === 1;
            };

            return calculateDraw(2) || sequences.length > 2 && calculateDraw(3);
        }

        const OUTS = {
            OPEN_STRAIGHT_DRAW: 8,
            GUTSHOT_STRAIGHT_DRAW: 4,
            ONE_SIDE_STRAIGHT_DRAW: 4
        };

        module.exports = function (cardsRanks) {
            cards = cardsRanks;
            return _getOuts;
        };
    }, {}], 10: [function (require, module, exports) {
        const Combination = require('./combination');
        const DrawCombination = require('./draw-combination');
        const Card = require('./card');

        /**
         * @class Hand
        */
        class Hand {
            /**
             * Creates hand
             * @param {Array} cards Array or enumeration of @see Card instances
             */
            constructor(...cards) {
                cards = cards[0] && cards[0] instanceof Array ? cards[0] : cards;

                this.cards = cards.slice(0, 5);
                this._combination = null;
                this._drawCombination = null;

                this.sort();
            }

            /**
             * Returns Combination instance for this hand
             * @readonly
             * @returns {Combination}
             */
            get combination() {
                if (!this._combination) {
                    this._combination = new Combination(this);
                }

                return this._combination;
            }

            /**
             * Returns DrawCombination instance for this hand
             * @readonly
             * @returns {DrawCombination}
             */
            get drawCombination() {
                if (!this._drawCombination) {
                    this._drawCombination = new DrawCombination(this);
                }

                return this._drawCombination;
            }

            /**
             * Add given cards to hand
             * @param {Array} cards Array or enumeration of cards
             * @returns {Boolean} True if all cards was added, false otherwise
             */
            addCards(cards /*card1, card2...card5*/) {
                cards = cards instanceof Array ? cards : arguments;

                let isSuccess = true;
                Array.prototype.forEach.call(cards, c => isSuccess &= this.addCard(c));

                return !!isSuccess;
            }

            /**
             * Add single card to hand
             * @param {Card} card
             * @returns {Boolean} True is card was added, false otherwise
             */
            addCard(card) {
                if (this.isFull() || this.has(card)) {
                    return false;
                }

                this.cards.push(card);
                this.sort();

                return true;
            }

            get size() {
                return this.cards.length;
            }

            /**
             * Return true if hand has reached maximum capacity
             * @returns {Boolean}
            */
            isFull() {
                return this.size === this.MAX_HAND_SIZE;
            }

            /**
             * Checks whether card exists in current hand
             * @param {Card} card
             * @returns {Boolean}
             */ /**
                * Checks whether card exists in current hand
                * @param {Number} suit
                * @param {Number} rank
                * @returns {Boolean}
                */
            has(card /*suit, rank*/) {
                let s, v;
                if (card && typeof card === 'object') {
                    s = card.suit;
                    v = card.rank;
                } else if (typeof arguments[0] !== 'undefined' && typeof arguments[1] !== 'undefined') {
                    s = arguments[0];
                    v = arguments[1];
                }

                return this.cards.some(c => c.suit === s && c.rank === v);
            }

            /**
             * Compares combinations of current hand with given
             * @param {Hand} hand
             * @returns {Number}
             */
            compare(hand) {
                return this.combination.compare(hand.combination);
            }

            /**
             * Returns true if hand has nothing but kicker card
             * @returns {Boolean}
            */
            isKicker() {
                return this.combination.isKicker();
            }

            /**
             * Returns true if hand has pair
             * @returns {Boolean}
             */
            isPair() {
                return this.combination.isPair();
            }

            /**
             * Returns true if hand has two pairs
             * @returns {Boolean}
             */
            isTwoPairs() {
                return this.combination.isTwoPairs();
            }

            /**
             * Returns true if hand has three of a kind
             * @returns {Boolean}
             */
            isThreeOfKind() {
                return this.combination.isThreeOfKind();
            }

            /**
             * Returns true if hand has straight
             * @returns {Boolean}
             */
            isStraight() {
                return this.combination.isStraight();
            }

            /**
             * Returns true if hand has flush
             * @returns {Boolean}
             */
            isFlush() {
                return this.combination.isFlush();
            }

            /**
             * Returns true if hand has full house
             * @returns {Boolean}
             */
            isFullHouse() {
                return this.combination.isFullHouse();
            }

            /**
             * Returns true if hand has four of a kind
             * @returns {Boolean}
             */
            isFourOfKind() {
                return this.combination.isFourOfKind();
            }

            /**
             * Returns true if hand has royal flush
             * @returns {Boolean}
             */
            isRoyalFlush() {
                return this.combination.isRoyalFlush();
            }

            /**
             * Returns true if hand has straight flush
             * @returns {Boolean}
             */
            isStraightFlush() {
                return this.combination.isStraightFlush();
            }

            /**
             * Apply reduce aggregator to underlying cards array
             * @param {Function} aggregate 
             * @param {*} start 
             */
            reduce(aggregate, start) {
                const args = [aggregate];
                typeof start !== 'undefined' && args.push(start);
                return this.cards.reduce(...args);
            }

            /**
             * Sort cards in hand
             * @param {String} order ASC or DESC
             */
            sort(order = 'asc') {
                order = order.toLowerCase();
                this.cards.sort((l, r) => order === 'asc' ? l.compare(r) : r.compare(l));
            }

            /**
             * Apply every matcher to underlying cards array
             * @param {Function} predicate 
             */
            every(predicate) {
                return this.cards.every(predicate);
            }

            /**
             * Apply aggregator to each card in underlying cards array
             * @param {Function} aggregate 
             */
            forEach(aggregate) {
                this.cards.forEach(aggregate);
            }

            static get MAX_HAND_SIZE() {
                return 5;
            }
        }

        module.exports = Hand;
    }, { "./card": 2, "./combination": 4, "./draw-combination": 8 }], 11: [function (require, module, exports) {
        const Hand = require('../hand');
        const Utils = require('./utils');

        const HAND_SIZE = Hand.MAX_HAND_SIZE;

        class HandsCollection {
            constructor(hands) {
                this.hands = hands.sort((h1, h2) => h1.compare(h2));
            }

            get highestHand() {
                return this.hands[this.hands.length - 1];
            }

            get highestCombination() {
                return this.highestHand.combination;
            }

            get bestDraw() {
                return this.hands.reduce((h1, h2) => {
                    return h1.drawCombination.outs > h2.drawCombination.outs ? h1 : h2;
                }).drawCombination;
            }

            get count() {
                return this.hands.length;
            }

            /**
             * Returns all possible card combinations from given hands
             * @param {Hand} hand1 - First hand
             * @param {Hand} hand2 - Second hand
             * @returns {HandsCollection}
             */
            static createCombinations(hand1, hand2) {
                const allCards = hand1.cards.concat(hand2.cards);
                return new HandsCollection(Utils.getAllCombinationsOfHands(allCards));
            }
        }

        module.exports = HandsCollection;
    }, { "../hand": 10, "./utils": 12 }], 12: [function (require, module, exports) {
        const Hand = require('../hand');

        const HAND_SIZE = Hand.MAX_HAND_SIZE;

        class Utils {
            /**
            * Creates all possible hands for card combinations from given array of cards
            * 
            * @param {Array} cards - Array of cards
            * @returns {Array}
            */
            static getAllCombinationsOfHands(cards) {
                return Utils._combineCardsRecursively(cards);
            }

            static _combineCardsRecursively(cards, start = 0, index = 0, handCards = [], combinations = []) {
                if (handCards.length === HAND_SIZE || cards.length < HAND_SIZE && handCards.length === cards.length) {
                    const h = new Hand();
                    h.addCards(handCards);
                    combinations.push(h);
                    return;
                }

                for (let i = start; i < cards.length; i++) {
                    handCards[index] = cards[i];
                    Utils._combineCardsRecursively(cards, i + 1, index + 1, handCards.slice(0), combinations);
                }

                return combinations;
            }
        }

        module.exports = Utils;
    }, { "../hand": 10 }], 13: [function (require, module, exports) {
        const Card = require('./card');

        const { SUIT_MIN, SUIT_MAX, RANK_MIN, RANK_MAX, ALIAS_TO_RANK } = Card;

        const aliases = ALIAS_TO_RANK;

        /**
         * @class Pack
        */
        class Pack {
            constructor() {
                this.cards = [];
                this._availableCards = this._availableCardsArray();
            }

            /**
             * Clear pack
            */
            destroy() {
                this.cards = [];
                this._availableCards = this._availableCardsArray();
            }

            /**
             * Count of created cards in pack
             * @readonly
             * @type {Number}
             */
            get count() {
                return this.cards.length;
            }

            /**
             * Create specified number of random cards
             * @param {Number} count
             * @returns {Array}
             */
            createCards(count) {
                const cards = [];
                for (let i = 0; i < count; i++) {
                    cards.push(this.createCard());
                }

                return cards;
            }

            /**
             * Creates random card
             * @returns {Card}
             */ /**
                * Creates card with given suit and rank
                * @param {String} suit
                * @param {String} rank
                * @returns {Card}
                */
            createCard(suit, rank) {
                const cards = this.cards;

                if (this.count === 52) {
                    return null;
                }

                const suitEmpty = typeof suit === 'undefined';
                const valEmpty = typeof val === 'undefined';
                if (suitEmpty && valEmpty) {
                    const randomCard = _generateRandomCard.call(this);
                    suit = randomCard.suit;
                    rank = randomCard.rank;
                } else {
                    suit = _getRankByAlias(suit);
                    rank = _getRankByAlias(rank);

                    if (suit === null || rank === null) {
                        return null;
                    }
                }

                return _createNewCard.call(this, suit, rank);
            }

            /**
             * Checks whether card exists in current Pack
             * @param {Card} card
             * @returns {Boolean}
             */ /**
                * Checks whether card exists in current Pack
                * @param {Number} suit
                * @param {Number} rank
                * @returns {Boolean}
                */
            has(card /*suit, rank*/) {
                let s, v;
                if (card instanceof Card) {
                    s = card.suit;
                    v = card.rank;
                } else if (typeof arguments[0] !== 'undefined' && typeof arguments[1] !== 'undefined') {
                    s = _getRankByAlias(arguments[0]);
                    v = _getRankByAlias(arguments[1]);

                    s === null && (s = arguments[0]);
                    v === null && (v = arguments[1]);
                }

                return !!(this.cards[s] && this.cards[s][v]);
            }

            _availableCardsArray() {
                const cards = [];

                for (let s = SUIT_MIN; s <= SUIT_MAX; s++) {
                    const card = {
                        suit: s
                    };
                    for (let r = RANK_MIN; r <= RANK_MAX; r++) {
                        card.rank = r;
                        cards.push(card);
                    }
                }

                return cards;
            }
        }

        function _getRankByAlias(alias) {
            if (typeof alias === 'undefined') {
                return null;
            }

            alias = alias.toString().toLowerCase();
            return typeof aliases[alias] === 'undefined' ? null : aliases[alias];
        }

        function _createNewCard(suit, val) {
            if (typeof suit === 'undefined' || typeof val === 'undefined') {
                return null;
            }

            const exists = this.has(suit, val);
            if (exists) {
                return null;
            } else {
                !this.cards[suit] && (this.cards[suit] = []);
                this.cards[suit][val] = true;
            }

            return Card.create(suit, val);
        }

        function _generateRandomCard() {
            const randIndex = Math.floor(Math.random() * this._availableCards.length);
            const card = this._availableCards[randIndex];

            this._availableCards.splice(randIndex, 1);

            return card;
        }

        module.exports = Pack;
    }, { "./card": 2 }] }, {}, [1]);
