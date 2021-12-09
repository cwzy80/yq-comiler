/**
 * 实现手写简单的词法分析器
 **/

// token实体
class Token {
	public type: TokenType
	public text: string
}

// 临时保存token的文本
let tokenText: string = ''
// 保存解析后的token
let tokens: Token[] = []
// 当前正在解析的token
let token: Token = new Token()


// 定义有限状态机的各种状态
enum DfaState {
	Initial = 'Initial',
	GT = 'GT',
	GE = 'GE',
	ID = 'ID',
	Plus = 'Plus',
	Minus = 'Minus',
	Star = 'Star',
	Slash = 'Slash',
	SemiColon = 'SemiColon',
	LeftParen = 'LeftParen',
	RightParen = 'RightParen',
	Assignment = 'Assignment',
	IntLiteral = 'IntLiteral',
	And = 'And',
	Or = 'Or'
}

// 定义Token的状态
enum TokenType {
	Plus = 'Plus',// +
	Minus = 'Minus',// -
	Star = 'Star',// *
	Slash = 'Slash',// /
	GE = 'GE', // >=
	GT = 'GT', // >
	EQ = 'EQ',// ==
	LE = 'LE',// <=
	LT = "LT",// <
	SemiColon = 'SemiColon',// ;
	LeftParen = 'LeftParen',// (
	RightParen = 'RightParen',// )
	Assignment = 'Assignment', // = 
	If = 'If',
	Else = 'Else',
	Int = 'Int',
	And = 'And',
	Or = 'Or',
	Identifier = 'Identifier',// 标识符
	IntLiteral = 'IntLiteral',// 整型字面量
	StringLiteral = 'StringLiteral',// 字符串字面量

}

// 有限状态自动机
function tokenize(code: string) {
	const codeArray: string[] = code.split('')
	let state: string = DfaState.Initial
	let char
	for (let ch of codeArray) {
		char = ch
		switch (state) {
			case DfaState.Initial:
				state = initToken(ch) //重新确定后续状态
				break
			case DfaState.ID:
				if (isAlpha(ch) || isDigit(ch)) {
					tokenText += ch
				} else {
					state = initToken(ch)
				}
				break
			case DfaState.GT:
				if (ch == '=') {
					token.type = TokenType.GE;  //转换成GE
					state = DfaState.GE
					tokenText += ch
				} else {
					state = initToken(ch);      //退出GT状态，并保存Token
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
				state = initToken(ch)          //退出当前状态，并保存Token
				break;
			case DfaState.IntLiteral:
				if (isDigit(ch)) {
					tokenText += ch
				} else {
					state = initToken(ch)      //退出当前状态，并保存Token
				}
				break
			default:
		}
	}
	if (tokenText.length > 0) {
		initToken(char)
	}
}


function initToken(ch: string): DfaState {
	let state: DfaState = DfaState.Initial
	if (tokenText.length > 0) {
		token.text = tokenText
		tokens.push(token)
		tokenText = ''
		token = new Token()
	}
	if (isAlpha(ch)) {	//第1个字符是字母
		state = DfaState.ID // 进入ID状态
		token.type = TokenType.Identifier
		tokenText += ch
	} else if (isDigit(ch)) { // 第1个字符是数字
		state = DfaState.IntLiteral
		token.type = TokenType.IntLiteral
		tokenText += ch
	} else if (ch == '>') {     //第一个字符是>
		state = DfaState.GT
		token.type = TokenType.GT
		tokenText += ch
	} else if (ch == '+') {
		state = DfaState.Plus;
		token.type = TokenType.Plus;
		tokenText += ch
	} else if (ch == '-') {
		state = DfaState.Minus;
		token.type = TokenType.Minus;
		tokenText += ch
	} else if (ch == '*') {
		state = DfaState.Star;
		token.type = TokenType.Star;
		tokenText += ch
	} else if (ch == '/') {
		state = DfaState.Slash;
		token.type = TokenType.Slash;
		tokenText += ch
	} else if (ch == ';') {
		state = DfaState.SemiColon;
		token.type = TokenType.SemiColon;
		tokenText += ch
	} else if (ch == '(') {
		state = DfaState.LeftParen;
		token.type = TokenType.LeftParen;
		tokenText += ch
	} else if (ch == ')') {
		state = DfaState.RightParen;
		token.type = TokenType.RightParen;
		tokenText += ch
	} else if (ch == '=') {
		state = DfaState.Assignment;
		token.type = TokenType.Assignment;
		tokenText += ch
	} else if (ch == 'and') {
		state = DfaState.And;
		token.type = TokenType.And;
		tokenText += ch
	} else if (ch == 'or') {
		state = DfaState.Or;
		token.type = TokenType.Or;
		tokenText += ch
	} else {
		state = DfaState.Initial;
	}
	return state
}

// 是否为字母或文字
function isAlpha(ch: string): boolean {
	let charCode: number = getCharCode(ch)
	// a-z,A-Z
	return charCode >= 97 && charCode <= 122 || charCode >= 65 && charCode <= 90 || charCode > 255
}

// 是否为数字和小数点
function isDigit(ch: string): boolean {
	const charCode: number = getCharCode(ch)
	return charCode >= 48 && charCode <= 57 || charCode === 46
}

//是否为空白字符
function isBlank(ch: string): boolean {
	const charCode: number = getCharCode(ch)
	return charCode === 32 || charCode === 9 || charCode === 10
}

// 获取字符的ascii码
function getCharCode(ch: string): number {
	return ch.charCodeAt(0)
}

function main() {
	const code = '21+300*50000'
	tokenize(code)
	// tokens.map((token) => {
	// 	console.log(`${token.type} ${token.text}`)
	// })
	console.log(tokens)

}

main()
