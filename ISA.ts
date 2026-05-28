import { LDI, RJMP } from './instructions'
import {
	createParseNumber,
	createParseRegister,
	parseNumber,
	parseRegister,
} from './parsers'
import type { Context, Symbols } from './types'

export const ISA = {
	LDI,
    RJMP
}

export const injectParsersWithContext = (ctx: Context) => {
	return Object.fromEntries(
		Object.entries(ISA).map(([name, def]) => [
			name,
			{
				...def,
				operands: def.operands.map((op) => ({
					...op,
					parse: createContextualParser(op.parse, ctx),
				})),
			},
		])
	)
}

const createContextualParser = (baseParse: any, ctx: Context) => {
	return (token: string) => {
		// 1. .DEF (alias de registro)
		if (ctx.symbols.defs[token] !== undefined) {
			return ctx.symbols.defs[token]
		}

		// 2. .EQU (constantes)
		if (ctx.symbols.equs[token] !== undefined) {
			return ctx.symbols.equs[token]
		}

		// 3. LABEL → offset (para saltos)
		if (ctx.labels[token] !== undefined) {
			const target = ctx.labels[token]
			return target - (ctx.address + 1)
		}

		// 4. fallback → parser original
		return baseParse(token)
	}
}

export const buildISAWithSymbols = (symbols: Symbols) =>
	Object.fromEntries(
		Object.entries(ISA).map(([name, def]) => [
			name,
			{
				...def,
				operands: def.operands.map((op) => {
					if (op.parse === parseRegister) {
						return { ...op, parse: createParseRegister(symbols) }
					}

					if (op.parse === parseNumber) {
						return { ...op, parse: createParseNumber(symbols) }
					}

					return op
				}),
			},
		])
	)
