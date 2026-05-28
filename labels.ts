import type { Labels } from "./types"

export const isLabel = (line: string) => line.trim().endsWith(':')

export const buildLabelTable = (lines: string[]) => {
  const labels: Labels = {}

  let address = 0

  for (const line of lines) {
    const clean = line.trim()

    if (!clean) continue

    if (clean.startsWith('.')) continue // directivas

    if (isLabel(clean)) {
      const name = clean.slice(0, -1)
      labels[name] = address
      continue
    }

    // si es instrucción
    address += 1
  }

  return labels
}