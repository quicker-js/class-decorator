import { MethodMirror } from '../src';
import { request } from '../src/decorators/request';
import { entity, param, property } from '../src/decorators';

const name = Symbol('test');

@entity({ title: 'SimpleUsage1' })
/**
 * SimpleUsage1
 */
export class SimpleUsage1 {
  /**
   * 构造函数
   * @param option
   */
  public constructor(public option: SimpleUsage1) {}

  @property({
    title: 'id',
  })
  public id = 1;

  @property({
    title: 'name',
  })
  public name: string;

  @property
  public static test: string;

  /**
   * 测试
   */
  @request({
    path: '/info',
    method: 'post',
  })
  public info(): number {
    console.log(MethodMirror.reflect(SimpleUsage1, this.info, false));
    return 1;
  }

  /**
   * test
   */
  @request({
    path: '/test',
    method: 'post',
  })
  public static [name](): void {
    return;
  }

  /**
   * 测试 获取metadataKeys
   */
  @request({
    path: '/getMetadataKeys',
    method: 'post',
  })
  public static getMetadataKeys(): void {
    return;
  }

  /**
   * 测试实例成员函数run
   * @param path
   * @param test
   */
  @request({
    path: '/run',
    method: 'get',
  })
  public run(
    @param({ path: 'param.run' }) path: string,
    @param test: string
  ): string {
    return this.name + path + test;
  }

  /**
   * 测试静态成员函数
   * @param path
   * @param test
   */
  @request({
    path: '/static/run',
    method: 'get',
  })
  public static run(
    @param({ path: '/static/param.run' }) path: string,
    @param test: string
  ): string {
    return path + test;
  }

  /**
   * 测试1
   * @param test
   */
  public test1(@param test: string): void {
    return undefined;
  }
}
