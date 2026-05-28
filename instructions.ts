import { parseNumber, parseRegister } from './parsers.js'
import { type InstructionDef } from './types.js'

export const LDI: InstructionDef = {
	name: 'LDI',
	operands: [
		{ name: 'Rd', parse: parseRegister },
		{ name: 'K', parse: parseNumber },
	],

	validate: ({ Rd, K }) => {
		if (Rd < 16 || Rd > 31) throw new Error('LDI solo usa R16–R31')
		if (K < 0 || K > 255) throw new Error('K fuera de rango')
	},

	fields: [
		{ type: 'const', value: 0b1110, size: 4 },

		{
			type: 'computed',
			name: 'K_high',
			size: 4,
			map: ({ K }) => (K >> 4) & 0xf,
		},

		{
			type: 'computed',
			name: 'd',
			size: 4,
			map: ({ Rd }) => Rd - 16,
		},

		{
			type: 'computed',
			name: 'K_low',
			size: 4,
			map: ({ K }) => K & 0xf,
		},
	],
}

export const RJMP: InstructionDef = {
	name: 'RJMP',

	operands: [
		{ name: 'k', parse: parseNumber } // luego será interceptado por labels
	],

	validate: ({ k }) => {
		if (k < -2048 || k > 2047) {
			throw new Error('RJMP fuera de rango')
		}
	},

	fields: [
		{ type: 'const', value: 0b1100, size: 4 },

		{
			type: 'computed',
			name: 'k',
			size: 12,
			map: ({ k }) => k & 0xFFF, // 2’s complement
		},
	],
}