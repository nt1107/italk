import type { ComponentResolver } from 'unplugin-vue-components/types';
export interface NutUIResolverOptions {
    /**
     * import style css or sass with components
     *
     * @default 'css'
     */
    importStyle?: boolean | 'css' | 'sass';
    /**
     * NutUI or NutUI-Taro
     *
     * @default false
     */
    taro?: boolean;
    /**
     * compatible with unplugin-auto-import
     *
     * @default false
     */
    autoImport?: boolean;
}
/**
 * Resolver for NutUI 4.0+
 *
 * @link https://github.com/jdf2e/nutui
 */
export default function NutUIResolver(options?: NutUIResolverOptions): ComponentResolver;
