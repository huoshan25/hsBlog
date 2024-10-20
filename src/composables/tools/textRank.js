/**
 * textrank.js
 * @author 2020. 08. 13 gwkim<youlive789@gmail.com>
 * @description
 * 使用提花索引，我们以一种简单的方式实现了Texerank算法。
 * 当一个交集操作涉及两个连续的字母时，它被识别为一个常用词。
 */

// 합집합 연산
Set.prototype.union = function(setB) {
    let union = new Set(this);
    for (let elem of setB) {
        union.add(elem);
    }
    return union;
}

// 交叉操作=>如果一个单词包含两个连续的字母，则将其识别为普通单词
Set.prototype.intersection = function(setB) {
    let intersection = new Set();

    let thisArr = Array.from(this);
    let setBArr = Array.from(setB);

    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < setB.size; j++) {
            if (thisArr[i].indexOf(setBArr[j][0], setBArr[j][1], setBArr[j][2]) > -1)
                intersection.add(this[i]);
        }
    }
    return intersection;
}

/**
 * ProcessSentence
 * @class
 */
class ProcessSentence {

    constructor(sentence) {
        this.sentence = sentence;
    }

    _tokenize() {
        this.sentenceMetrics = this.sentence.split("\n");
    }

    getSentenceMetrics() {
        this._tokenize();
        return this.sentenceMetrics;
    }
}

/**
 * WeightMetrics
 * @class
 */
class WeightMetrics {

    constructor(sentenceMetrics) {
        this.sentenceMetrics = sentenceMetrics;
        this.weightMetrics = new Array(sentenceMetrics.length).fill(0).map(() => new Array(sentenceMetrics.length).fill(0));
    }

    getWeightMetrics() {
        this._update();
        return this.weightMetrics;
    }

    _update() {
        let weightsLength = this.weightMetrics.length;
        for (let i = 0; i < weightsLength; i++) {
            for (let j = 0; j < weightsLength; j++) {
                let jaccardIndex = this._getJaccardIndex(
                    this._splitSentence(this.sentenceMetrics[i]), this._splitSentence(this.sentenceMetrics[j]));
                if (!jaccardIndex) jaccardIndex = 0;
                this.weightMetrics[i][j] = jaccardIndex;
            }
        }
    }

    _getJaccardIndex(s1, s2) {
        let s1Set = new Set(s1);
        let s2Set = new Set(s2);
        let intersect = s1Set.intersection(s2Set);
        let union = s1Set.union(s2Set);
        return intersect.size / union.size;
    }

    _splitSentence(sentence) {
        return sentence.split(" ");
    }

}

/**
 * 文本排名
 * @class
 */
export class TextRank {
    constructor(sentence) {
        this.ps = new ProcessSentence(sentence);
        this.weightMetrics = new WeightMetrics(this.ps.getSentenceMetrics());
        this.weights = this.weightMetrics.getWeightMetrics();
        this.score = new Float32Array(this.weights.length);

        this._initRanking();

        for (let i = 0; i < 20; i++)
            this._updateLoop();
    }

    getSummarizedOneText() {
        return this._top1();
    }

    getSummarizedThreeText() {
        return this._top3();
    }

    _initRanking() {
        let scoreLength = this.score.length;
        for (let i = 0; i < scoreLength; i++) {
            this.score[i] = (1 / scoreLength);
        }
    }

    _updateLoop() {
        let scoreLength = this.score.length;
        for (let i = 0; i < scoreLength; i++) {
            let tmp = 0;
            for (let j = 0; j < scoreLength; j++) {
                tmp += this.score[j] * this.weights[j][i];
            }
            this.score[i] = this.score[i] + tmp;
        }
    }

    _top1() {
        let maxScore = 0;
        let maxIndex = 0;
        for (let i = 0; i < this.score.length - 1; i++) {
            if (maxScore < this.score[i]) {
                maxScore = this.score[i];
                maxIndex = i;
            }
        }

        return this.weightMetrics.sentenceMetrics[maxIndex];
    }

    _top3() {
        let ranking = new Array(this.score.length).fill(1);
        for (let i = 0; i < this.score.length - 1; i++) {
            for (let j = i + 1; j < this.score.length; j++) {
                if (this.score[i] > this.score[j]) {
                    ranking[j]++;
                }
                else {
                    ranking[i]++;
                }
            }
        }

        // console.log(this.score);
        // console.log(ranking);

        let returnString = '';
        for (let i = 1; i < 4; i++)
            returnString += this.weightMetrics.sentenceMetrics[ranking.indexOf(i)] + "\n";
        return returnString;
    }
}