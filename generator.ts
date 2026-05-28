function checksum(bytes: number[]): number {
  const sum = bytes.reduce((a, b) => a + b, 0);
  return (0x100 - (sum & 0xFF)) & 0xFF;
}

function wordsToLeBytes(words: number[]): number[] {
  const result: number[] = [];
  for (const word of words) {
    result.push(word & 0xFF);         // byte bajo  E1
    result.push((word >> 8) & 0xFF);  // byte alto  17
  }
  return result;
}

export const toIntelHex = (programBytes: number[]): string => {
  const lines: string[] = [];
  const CHUNK = 16;

  lines.push(":020000020000FC");

  // 👇 Convertir antes de procesar
  const leBytes = wordsToLeBytes(programBytes);

  let address = 0;

  for (let i = 0; i < leBytes.length; i += CHUNK) {
    const chunk = leBytes.slice(i, i + CHUNK);
    const ll = chunk.length;
    const addrHi = (address >> 8) & 0xFF;
    const addrLo = address & 0xFF;

    const allBytes = [ll, addrHi, addrLo, 0x00, ...chunk];
    const cc = checksum(allBytes);

    console.log({allBytes})

    const hex = allBytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join('');
    lines.push(`:${hex}${cc.toString(16).padStart(2, '0').toUpperCase()}`);

    address += ll;
  }

  lines.push(":00000001FF");
  return lines.join("\n");
}