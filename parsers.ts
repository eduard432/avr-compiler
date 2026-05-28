import type { Labels, Symbols } from "./types";

export function parseRegister(token: string): number {
  const match = token.match(/^R(\d+)$/i);

  if (!match) {
    throw new Error(`Registro inválido: ${token}`);
  }

  const firstMatch = match[1] as string

  const regNum = parseInt(firstMatch, 10);

  if (regNum < 0 || regNum > 31) {
    throw new Error(`Registro fuera de rango: ${token}`);
  }

  return regNum;
}

export function parseNumber(token: string): number {
  token = token.trim();

  // Hexadecimal
  if (/^0x[0-9a-f]+$/i.test(token)) {
    return parseInt(token, 16);
  }

  // Binario
  if (/^0b[01]+$/i.test(token)) {
    return parseInt(token.slice(2), 2);
  }

  // Decimal (positivo o negativo)
  if (/^-?\d+$/.test(token)) {
    return parseInt(token, 10);
  }

  throw new Error(`Número inválido: ${token}`);
}

export const createParseRegister = (symbols: Symbols) => (token: string) => {
  // primero checar si es .DEF
  if (symbols.defs[token] !== undefined) {
    return symbols.defs[token]
  }

  return parseRegister(token)
}

export const createParseNumber = (symbols: Symbols) => (token: string) => {
  if (symbols.equs[token] !== undefined) {
    return symbols.equs[token]
  }

  return parseNumber(token)
}