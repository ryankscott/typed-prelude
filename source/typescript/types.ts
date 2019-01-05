import { Node, SourceFile } from 'ts-simple-ast'
import { CompilerOptions } from 'typescript'
import { Maybe } from '../maybe'
import { Tuple } from '../tuple'

export interface TsConfig {
  compilerOptions: CompilerOptions
  configPath: string
  extends?: string | string[]
  files?: string[]
  include?: string[]
  exclude?: string[]
}

export interface DependencyMap extends Map<string, DependencyMapValue> {}

export interface DependencyMapValue {
  sourceFile: SourceFile
  moduleId: number
  exportMetadata: ExportMetadata[]
  dependencies: Dependency[]
}

export interface DependentMap extends Map<string, string[]> {}

export interface Dependency {
  readonly importNames: Array<Tuple<string, string>>
  readonly type: DependencyType
  readonly moduleSpecifier: string
  readonly moduleId: number
  readonly resolvedFilePath: string
}

export const enum DependencyType {
  Named,
  Namespace,
  ImportRequire,
  CommonjsRequire,
  DynamicImport,
  ReExport,
  Link,
  Entry,
}

export interface ExportMetadata {
  readonly exportNames: Array<Tuple<string, string>>
  readonly sourceFile: SourceFile
  readonly node: Node
}

export interface NodePosition {
  readonly position: Tuple<number, number>
  readonly startLine: number
  readonly endLine: number
  readonly numberOfLines: number
}

export interface NodeMetadata extends NodePosition {
  readonly text: string
}

export type SourceMap = {
  version: number
  file: any
  sources: string[]
  sourcesContent: string[]
  mappings: string
}

export type SourceAndSourceMap = { source: string; map: SourceMap }

export type MemoryResult = {
  fileName: string
  moduleId: number
  js: string
  map: Maybe<SourceMap>
  dts: Maybe<string>
}

export type EmitResults = Map<string, MemoryResult>

export interface BundleGraph {
  readonly main: MemoryResult[]
  readonly common: Maybe<MemoryResult[]>
  readonly dynamicBundles: DynamicBundleResults[]
}

export type DynamicBundleResults = { fileName: string; results: MemoryResult[] }

export type Bundle = {
  hash: string
  main: SourceAndSourceMap
  common: Maybe<SourceAndSourceMap>
  dynamicBundles: Array<{ fileName: string; source: string; map: SourceMap }>
}