import fs from 'fs';

type Category =
    | 'SINGLE_QUOTE'
    | 'SLASH'
    | 'ASTERISK'
    | 'LPAREN'
    | 'RPAREN'
    | 'LBRACE'
    | 'RBRACE'
    | 'LBRACKET'
    | 'RBRACKET'
    | 'OPERATOR'
    | 'COMPARISON'
    | 'DIGIT'
    | 'LETTER'
    | 'DOLLAR'
    | 'DOT'
    | 'SPACE'
    | 'OTHER';

type State =
    | 'q0' | 'q2' | 'q5' | 'q6' | 'q7' | 'q8' | 'q10' | 'q11' | 'q12' | 'q13'
    | 'q14' | 'q15' | 'q20' | 'q21' | 'q22' | 'q50';

type TokenType =
    | 'ENTERO' | 'IDENTIFICADOR' | 'FLOTANTE' | 'STRING' | 'OPERADOR'
    | 'COMENTARIO' | 'PALABRA_RESERVADA' | 'OPERADOR_COMPARACION' | 'DELIMITADOR';


const transitionTable: Record<string, State> = {
    'q0,DIGIT': 'q2',
    'q0,DOLLAR': 'q5',
    'q0,LETTER': 'q14',
    'q0,SINGLE_QUOTE': 'q7',
    'q0,SLASH': 'q10',
    'q0,OPERATOR': 'q13',
    'q0,COMPARISON': 'q15',
    'q0,LPAREN': 'q12',
    'q0,RPAREN': 'q12',
    'q0,LBRACE': 'q12',
    'q0,RBRACE': 'q12',
    'q0,LBRACKET': 'q12',
    'q0,RBRACKET': 'q12',
    'q0,ASTERISK': 'q13',

    'q5,LETTER': 'q5',
    'q5,DIGIT': 'q5',
    'q5,OTHER': 'q50',

    'q2,DIGIT': 'q2',
    'q2,DOT': 'q6',

    
    'q6,DIGIT': 'q6',

    'q7,SINGLE_QUOTE': 'q8',
    'q7,LETTER': 'q7',
    'q7,DIGIT': 'q7',
    'q7,SPACE': 'q7',
    'q7,OTHER': 'q7',

    'q13,OPERATOR': 'q13',

    'q15,COMPARISON': 'q15',

    'q14,LETTER': 'q14',
    'q14,DIGIT': 'q14',

    'q10,SLASH': 'q11',
    'q10,ASTERISK': 'q20',
    'q11,SPACE': 'q11',
    'q11,OTHER': 'q11',
    'q20,ASTERISK': 'q21',
    'q20,SLASH': 'q22',
    'q20,DIGIT': 'q20',
    'q20,LETTER': 'q20',
    'q20,SPACE': 'q20',
    'q20,OTHER': 'q20',
    'q21,SLASH': 'q22',
    'q21,OTHER': 'q20',
};

const finalStateMap: Partial<Record<State, TokenType>> = {
    q2: 'ENTERO',
    q5: 'IDENTIFICADOR',
    q6: 'FLOTANTE',
    q7: 'STRING',
    q8: 'STRING',
    q10: 'OPERADOR',
    q11: 'COMENTARIO',
    q13: 'OPERADOR',
    q14: 'PALABRA_RESERVADA',
    q15: 'OPERADOR_COMPARACION',
    q12: 'DELIMITADOR',
    q20: 'COMENTARIO',
    q21: 'COMENTARIO',
    q22: 'COMENTARIO',
    q50: 'IDENTIFICADOR'
};

const palabrasReservadas = new Set(['if', 'else', 'while', 'for', 'return']);
function charCategory(ch: string, nextCh?: string): Category {
    if (ch === "'" ) return 'SINGLE_QUOTE';
    if (ch === '/') return 'SLASH';
    if (ch === '*') return 'ASTERISK';
    if (ch === '(') return 'LPAREN';
    if (ch === ')') return 'RPAREN';
    if (ch === '{') return 'LBRACE';
    if (ch === '}') return 'RBRACE';
    if (ch === '[') return 'LBRACKET';
    if (ch === ']') return 'RBRACKET';
    if (['+', '-'].includes(ch)) return 'OPERATOR';
    // Si encontramos ':' y el siguiente es '=' lo tratamos como un token especial.
    if (ch === ':' && nextCh === '=') return 'COMPARISON'; // O bien, podrías definir una nueva categoría, por ejemplo, 'ASSIGN'
    if (['=', '<', '>', '!'].includes(ch)) return 'COMPARISON';
    if (/\d/.test(ch)) return 'DIGIT';
    if (/[a-zA-Z]/.test(ch)) return 'LETTER';
    if (ch === '$') return 'DOLLAR';
    if (ch === '.') return 'DOT';
    if (/\s/.test(ch)) return 'SPACE';
    return 'OTHER';
}

function analizarToken(token: string): { aceptado: boolean, mensaje: string } {
    let estado: State = 'q0';
    
    for (let i = 0; i < token.length; i++) {
        // Pasamos token[i+1] como lookahead (si existe)
        const nextCh = i < token.length - 1 ? token[i+1] : undefined;
        const cat = charCategory(token[i], nextCh);
        
        // Si se detecta ':' seguido de '=' se "consume" el siguiente carácter
        if (token[i] === ':' && nextCh === '=') {
            i++; // Se salta el '='
        }
        
        const key = `${estado},${cat}`;
        if (transitionTable[key]) {
            estado = transitionTable[key];
        } else {
            return {
                aceptado: false,
                mensaje: `Error en carácter '${token[i]}' (posición ${i}): Transición no válida desde ${estado} para categoría ${cat}`
            };
        }
    }

    const tipo = finalStateMap[estado];
    if (!tipo) {
        return {
            aceptado: false,
            mensaje: `Estado final no reconocido: ${estado}`
        };
    }

    if (token === '{') {
        return { aceptado: true, mensaje: `Token aceptado como LLAVE IZQUIERDA (${estado})` };
    } else if (token === '}') {
        return { aceptado: true, mensaje: `Token aceptado como LLAVE DERECHA (${estado})` };
    } else if (token === '(') {
        return { aceptado: true, mensaje: `Token aceptado como PARENTESIS IZQUIERDO (${estado})` };
    } else if (token === ')') {
        return { aceptado: true, mensaje: `Token aceptado como PARENTESIS DERECHO (${estado})` };
    } else if (token === '[') {
        return { aceptado: true, mensaje: `Token aceptado como CORCHETE IZQUIERDO (${estado})` };
    } else if (token === ']') {
        return { aceptado: true, mensaje: `Token aceptado como CORCHETE DERECHO (${estado})` };
    }

    // Validación especial para el operador de asignación ':='
    if (token === ':=') {
        return { 
            aceptado: true, 
            mensaje: `Token aceptado como OPERADOR_ASIGNACION (${estado})`
        };
    }

    if (estado === 'q14') {
        return {
            aceptado: true,
            mensaje: palabrasReservadas.has(token) 
                ? `Token aceptado como PALABRA_RESERVADA (${estado})`
                : `Token aceptado como IDENTIFICADOR (${estado})`
        };
    }

    if (tipo === 'STRING' && !token.endsWith("'")) {
        return {
            aceptado: false,
            mensaje: 'Cadena no cerrada correctamente'
        };
    }

    return {
        aceptado: true,
        mensaje: `Token aceptado como ${tipo} (${estado})`
    };
}

function procesarArchivo(filename: string): Array<[string, boolean, string]> {
    const resultados: Array<[string, boolean, string]> = [];
    const contenido = fs.readFileSync(filename, 'utf-8');
    const lineas = contenido.split('\n');

    for (const linea of lineas) {
        let i = 0;
        const tokens: string[] = [];
        
        while (i < linea.length) {
            if (linea[i] === "'") {
                let token = "'";
                i++;
                while (i < linea.length && linea[i] !== "'") {
                    token += linea[i];
                    i++;
                }
                if (i < linea.length) token += "'";
                tokens.push(token);
                i++;
            }
            else if (linea[i] === '/') {
                let token = '/';
                i++;
                if (i < linea.length) {
                    if (linea[i] === '/') {
                        token += '/';
                        i++;
                        while (i < linea.length) {
                            token += linea[i];
                            i++;
                        }
                    } else if (linea[i] === '*') {
                        token += '*';
                        i++;
                        while (i < linea.length) {
                            if (linea[i] === '*' && i+1 < linea.length && linea[i+1] === '/') {
                                token += '*/';
                                i += 2;
                                break;
                            }
                            token += linea[i];
                            i++;
                        }
                    }
                }
                tokens.push(token);
            }
            else if (!/\s/.test(linea[i])) {
                let token = '';
                while (i < linea.length && !/\s/.test(linea[i]) && linea[i] !== "'" && linea[i] !== '/') {
                    token += linea[i];
                    i++;
                }
                tokens.push(token);
            } else {
                i++;
            }
        }

        for (const token of tokens) {
            if (token === '') continue;
            const analisis = analizarToken(token);
            resultados.push([token, analisis.aceptado, analisis.mensaje]);
        }
    }

    return resultados;
}

const resultados = procesarArchivo('token.txt');
resultados.forEach(([token, aceptado, mensaje]) => {
    console.log(`Token: ${token.padEnd(15)} => ${mensaje}`);
});