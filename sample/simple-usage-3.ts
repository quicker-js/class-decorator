import { entity, param } from '../src/decorators';
import { SimpleUsage2 } from './simple-usage-2';

@entity({ title: 'SimpleUsage3' })
/**
 * SimpleUsage1
 */
export class SimpleUsage3 extends SimpleUsage2 {
  /**
   * test
   * @param path
   */
  public constructor(
    @param({ path: '/static/param.run' }) public path: string
  ) {
    super(path);
  }
}
