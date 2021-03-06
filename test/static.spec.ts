import 'mocha'
import * as assert from 'assert'
import { Node, SyntaxKind, createProgram, convertCompilerOptionsFromJson } from 'typescript'
import { readFileSync } from 'fs'

const { options } = convertCompilerOptionsFromJson(
  JSON.parse(readFileSync('tsconfig.json', 'utf8')).compilerOptions,
  'tsconfig.json',
)

const testCases = [
  {
    name: 'testString',
    expected: 'string',
  },
  {
    name: 'testStringWithOptional',
    expected: 'string | undefined',
  },
  {
    name: 'testStringWithDefault',
    expected: 'string',
  },
  {
    name: 'testStringWithDefaultThenOptional',
    expected: 'string | undefined',
  },
  {
    name: 'testStringWithOptionalThenDefault',
    expected: 'string | undefined',
  },
  {
    name: 'testNullableString',
    expected: 'string | null',
  },
  {
    name: 'testNumber',
    expected: 'number',
  },
  {
    name: 'testNumberWithOptional',
    expected: 'number | undefined',
  },
  {
    name: 'testNullableNumber',
    expected: 'number | null',
  },
  {
    name: 'testArray',
    expected: '{}[]',
  },
  {
    name: 'testStringArray',
    expected: 'string[]',
  },
  {
    name: 'testNumberArray',
    expected: 'number[]',
  },
  {
    name: 'testObjectArray',
    expected: '{ foo: string; bar: number; }[]',
  },
  {
    name: 'testRawObjectArray',
    expected: '{ foo: string; bar: number; }[]',
  },
  {
    name: 'testNestedObjectArray',
    expected: '{ foo: string; bar: number; items: { fooz: number; }[]; }[]',
  },
  {
    name: 'testAllOf',
    expected: '{ foo: string; } & { fooz: number; }',
  },
  {
    name: 'testAnyOf',
    expected: '{ foo: string; } | { fooz: number; }',
  },
  {
    name: 'testOneOf',
    expected: '{ foo: string; } | { fooz: number; }',
  },
]

function getIdentifiers(node: Node): Node[] {
  if (node.kind === SyntaxKind.Identifier) {
    return [node]
  }

  return node.getChildren().map(getIdentifiers).reduce<Node[]>(
    (prev, entries) => prev.concat(entries),
    [],
  )
}

describe('Check resolved type', () => {
  const filePath = 'test/static/schemas.ts'
  const program = createProgram(
    [filePath],
    options,
  )
  const result = program.emit()
  assert.equal(false, result.emitSkipped, result.diagnostics[0].messageText.toString())

  const sourceFile = program.getSourceFile(filePath)
  const identifierNodes = getIdentifiers(sourceFile)
  const typeChecker = program.getTypeChecker()

  testCases.forEach(({ name, expected }) => {
    it(`Symbol "${name}" should be resolved to type "${expected}"`, () => {
      const node = identifierNodes.find(node => node.getText() === name)
      assert(node !== undefined)
      const type = typeChecker.getTypeAtLocation(node!)
      assert.equal(typeChecker.typeToString(type), expected)
    })
  })
})
