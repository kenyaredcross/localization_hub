import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import vue from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss';

export default {
    input: './public/js/dashboard/main.js',
    
    output: {
        file: './public/dist/js/dashboard.bundle.js',
        format: 'iife',
        name: 'DashboardApp'
    },
    
    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            preventAssignment: true
        }),
        vue({
            target: 'browser',
            preprocessStyles: true
        }),
        postcss({
            extract: false,
            minimize: true
        }),
        nodeResolve({
            browser: true,
            extensions: ['.vue', '.js']
        }),
        commonjs()
    ]
};