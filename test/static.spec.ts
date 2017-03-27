import 'mocha'
import { assert } from 'chai'
import * as ts from 'typescript'
import fs = require('fs')
import { chain } from 'ramda'

const { options } = ts.convertCompilerOptionsFromJson(
  JSON.parse(fs.readFileSync('tsconfig.json', 'utf8')).compilerOptions,
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
    name: 'testStringWithDefaultIsAString',
    expected: 'string',
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
]

function getIdentifiers (node: ts.Node): ts.Node[] {
  if (node.kind === ts.SyntaxKind.Identifier) {
    return [node]
  } else {
    return chain(getIdentifiers, node.getChildren())
  }
}

describe('Check resolved type', () => {
  const filePath = 'test/static/schemas.ts'
  const program = ts.createProgram(
    [filePath],
    options,
  )
  const result = program.emit()
  assert.equal(false, result.emitSkipped)

  const sourceFile = program.getSourceFile(filePath)
  const identifierNodes = getIdentifiers(sourceFile)
  const typeChecker = program.getTypeChecker()

  testCases.forEach(({ name, expected }) => {
    it(`Symbol "${name}" should be resolved to type "${expected}"`, () => {
      const node = identifierNodes.find(node => node.getText() === name)
      assert.isDefined(node)
      const type = typeChecker.getTypeAtLocation(node!)
      assert.equal(expected, typeChecker.typeToString(type))
    })
  })
})
