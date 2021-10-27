import { entity, param } from '../src/decorators';

@entity({ title: 'SimpleUsage2' })
/**
 * SimpleUsage1
 */
export class SimpleUsage2 {
  /**
   * test
   * @param path
   */
  public constructor(
    @param({ path: '/static/param.run' }) public path: string
  ) {}
}
