import { type InstructionDef } from './types.js'

export const encodeInstruction = (def: InstructionDef, args: any): number => {
	if (def.validate) def.validate(args)

	let result = 0

	for (const field of def.fields) {
		result <<= field.size

		let value = 0

		if (field.type === 'const') {
			value = field.value
		}

		if (field.type === 'operand') {
			value = args[field.name]
		}

		if (field.type === 'computed') {
			value = field.map(args)
		}

		result |= value
	}

	return result
}

export const parseLine = (
	line: string,
	ISA: Record<string, InstructionDef>
) => {
	const tokens = line.replace(',', '').split(/\s+/)

	const instName = tokens[0] as string
	const def = ISA[instName]

	if (!def) throw new Error(`Instrucción desconocida: ${instName}`)

	const rawArgs = tokens.slice(1)

	if (rawArgs.length !== def.operands.length) {
		throw new Error('Número incorrecto de operandos')
	}

	const parsedArgs: any = {}

	def.operands.forEach((op, i) => {
		const args = rawArgs[i] as string
		parsedArgs[op.name] = op.parse(args)
	})

	return {
		inst: def,
		args: parsedArgs,
	}
}
