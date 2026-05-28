import { parseNumber, parseRegister } from './parsers'
import type { Symbols } from './types'

export const buildSymbolTable = (lines: string[]) => {
	const symbols: Symbols = {
		defs: {} as Record<string, number>,
		equs: {} as Record<string, number>,
	}

	for (const line of lines) {
		const clean = line.trim()

		if (clean.startsWith('.DEF')) {
			// .DEF contador = R17
			const [, name_def, , reg_def] = clean.split(/\s+/)
			const reg = reg_def as string
			const name = name_def as string
			const regNum = parseRegister(reg)

			symbols.defs[name] = regNum
		}

		if (clean.startsWith('.EQU')) {
			// .EQU MAX = 100
			const [, name_equ, , value_equ] = clean.split(/\s+/)
			const name = name_equ as string
			const value = value_equ as string
			symbols.equs[name] = parseNumber(value)
		}
	}

	return symbols
}
