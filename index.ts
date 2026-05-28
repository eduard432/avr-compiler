import { readFile, writeFile } from 'fs/promises'
import { encodeInstruction, parseLine } from './encoder'
import { buildISAWithSymbols, injectParsersWithContext, ISA } from './ISA'
import { buildSymbolTable } from './symbols'
import { buildLabelTable, isLabel } from './labels'
import { toIntelHex } from './generator'

const FILE_PATH = `./asm/main.asm`

const main = async () => {
	const fileString = await readFile(FILE_PATH, 'utf-8')
	console.log(fileString)

	const fileLines = fileString.split('\n')

	const symbols = buildSymbolTable(fileLines)
	const labels = buildLabelTable(fileLines)

	let address = 0

	const code = []

	for (const line of fileLines) {
		const clean = line.trim()

		if (!clean || clean.startsWith('.')) continue
		if (isLabel(clean)) continue

		const ISAWithContext = injectParsersWithContext({
			symbols,
			labels,
			address,
		})

		const parsed = parseLine(clean, ISAWithContext)
		const number = encodeInstruction(parsed.inst, parsed.args)

		code.push(number)

		address += 1
	}

	const hexString = toIntelHex(code)
    await writeFile('./output/main.hex', hexString, 'utf-8')
}

main()
