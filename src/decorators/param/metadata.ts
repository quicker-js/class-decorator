import { ParameterMetadata } from '../../metadatas/parameter-metadata';

/**
 * @class Metadata
 */
export class Metadata<T = MetadataOption> extends ParameterMetadata<T> {}

export interface MetadataOption {
  readonly path: string;
}
