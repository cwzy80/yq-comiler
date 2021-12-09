/**
 * 实现手写简单的词法分析器
 **/
// token实体
var Token = /** @class */ (function () {
    function Token() {
    }
    return Token;
}());
// 临时保存token的文本
var tokenText = '';
// 保存解析后的token
var tokens = [];
// 当前正在解析的token
var token = new Token();
// 定义有限状态机的各种状态
var DfaState;
(function (DfaState) {
    DfaState["Initial"] = "Initial";
    DfaState["GT"] = "GT";
    DfaState["GE"] = "GE";
    DfaState["ID"] = "ID";
    DfaState["Plus"] = "Plus";
    DfaState["Minus"] = "Minus";
    DfaState["Star"] = "Star";
    DfaState["Slash"] = "Slash";
    DfaState["SemiColon"] = "SemiColon";
    DfaState["LeftParen"] = "LeftParen";
    DfaState["RightParen"] = "RightParen";
    DfaState["Assignment"] = "Assignment";
    DfaState["IntLiteral"] = "IntLiteral";
    DfaState["And"] = "And";
    DfaState["Or"] = "Or";
})(DfaState || (DfaState = {}));
// 定义Token的状态
var TokenType;
(function (TokenType) {
    TokenType["Plus"] = "Plus";
    TokenType["Minus"] = "Minus";
    TokenType["Star"] = "Star";
    TokenType["Slash"] = "Slash";
    TokenType["GE"] = "GE";
    TokenType["GT"] = "GT";
    TokenType["EQ"] = "EQ";
    TokenType["LE"] = "LE";
    TokenType["LT"] = "LT";
    TokenType["SemiColon"] = "SemiColon";
    TokenType["LeftParen"] = "LeftParen";
    TokenType["RightParen"] = "RightParen";
    TokenType["Assignment"] = "Assignment";
    TokenType["If"] = "If";
    TokenType["Else"] = "Else";
    TokenType["Int"] = "Int";
    TokenType["And"] = "And";
    TokenType["Or"] = "Or";
    TokenType["Identifier"] = "Identifier";
    TokenType["IntLiteral"] = "IntLiteral";
    TokenType["StringLiteral"] = "StringLiteral";
})(TokenType || (TokenType = {}));
// 有限状态自动机
function tokenize(code) {
    var codeArray = code.split('');
    var state = DfaState.Initial;
    var char;
    for (var _i = 0, codeArray_1 = codeArray; _i < codeArray_1.length; _i++) {
        var ch = codeArray_1[_i];
        char = ch;
        switch (state) {
            case DfaState.Initial:
                state = initToken(ch); //重新确定后续状态
                break;
            case DfaState.ID:
                if (isAlpha(ch) || isDigit(ch)) {
                    tokenText += ch;
                }
                else {
                    state = initToken(ch);
                }
                break;
            case DfaState.GT:
                if (ch == '=') {
                    token.type = TokenType.GE; //转换成GE
                    state = DfaState.GE;
                    tokenText += ch;
                }
                else {
                    state = initToken(ch); //退出GT状态，并保存Token
                }
                break;
            case DfaState.GE:
            case DfaState.Assignment:
            case DfaState.Plus:
            case DfaState.Minus:
            case DfaState.Star:
            case DfaState.Slash:
            case DfaState.SemiColon:
            case DfaState.LeftParen:
            case DfaState.And:
            case DfaState.Or:
            case DfaState.RightParen:
                state = initToken(ch); //退出当前状态，并保存Token
                break;
            case DfaState.IntLiteral:
                if (isDigit(ch)) {
                    tokenText += ch;
                }
                else {
                    state = initToken(ch); //退出当前状态，并保存Token
                }
                break;
            default:
        }
    }
    if (tokenText.length > 0) {
        initToken(char);
    }
}
function initToken(ch) {
    var state = DfaState.Initial;
    if (tokenText.length > 0) {
        token.text = tokenText;
        tokens.push(token);
        tokenText = '';
        token = new Token();
    }
    if (isAlpha(ch)) { //第1个字符是字母
        state = DfaState.ID; // 进入ID状态
        token.type = TokenType.Identifier;
        tokenText += ch;
    }
    else if (isDigit(ch)) { // 第1个字符是数字
        state = DfaState.IntLiteral;
        token.type = TokenType.IntLiteral;
        tokenText += ch;
    }
    else if (ch == '>') { //第一个字符是>
        state = DfaState.GT;
        token.type = TokenType.GT;
        tokenText += ch;
    }
    else if (ch == '+') {
        state = DfaState.Plus;
        token.type = TokenType.Plus;
        tokenText += ch;
    }
    else if (ch == '-') {
        state = DfaState.Minus;
        token.type = TokenType.Minus;
        tokenText += ch;
    }
    else if (ch == '*') {
        state = DfaState.Star;
        token.type = TokenType.Star;
        tokenText += ch;
    }
    else if (ch == '/') {
        state = DfaState.Slash;
        token.type = TokenType.Slash;
        tokenText += ch;
    }
    else if (ch == ';') {
        state = DfaState.SemiColon;
        token.type = TokenType.SemiColon;
        tokenText += ch;
    }
    else if (ch == '(') {
        state = DfaState.LeftParen;
        token.type = TokenType.LeftParen;
        tokenText += ch;
    }
    else if (ch == ')') {
        state = DfaState.RightParen;
        token.type = TokenType.RightParen;
        tokenText += ch;
    }
    else if (ch == '=') {
        state = DfaState.Assignment;
        token.type = TokenType.Assignment;
        tokenText += ch;
    }
    else if (ch == 'and') {
        state = DfaState.And;
        token.type = TokenType.And;
        tokenText += ch;
    }
    else if (ch == 'or') {
        state = DfaState.Or;
        token.type = TokenType.Or;
        tokenText += ch;
    }
    else {
        state = DfaState.Initial;
    }
    return state;
}
// 是否为字母或文字
function isAlpha(ch) {
    var charCode = getCharCode(ch);
    // a-z,A-Z
    return charCode >= 97 && charCode <= 122 || charCode >= 65 && charCode <= 90 || charCode > 255;
}
// 是否为数字和小数点
function isDigit(ch) {
    var charCode = getCharCode(ch);
    return charCode >= 48 && charCode <= 57 || charCode === 46;
}
//是否为空白字符
function isBlank(ch) {
    var charCode = getCharCode(ch);
    return charCode === 32 || charCode === 9 || charCode === 10;
}
// 获取字符的ascii码
function getCharCode(ch) {
    return ch.charCodeAt(0);
}
function main() {
    var code = '21+300*50000';
    tokenize(code);
    // tokens.map((token) => {
    // 	console.log(`${token.type} ${token.text}`)
    // })
    console.log(tokens);
}
main();
