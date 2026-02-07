const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const vue = require('rollup-plugin-vue');
const postcss = require('rollup-plugin-postcss');
const { writeFileSync } = require('fs');
const path = require('path');

// Build configuration
const build = async () => {
    const { rollup } = await import('rollup');

    const inputOptions = {
        input: './localization_hub/public/js/dashboard/dashboard.bundle.js',
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
                preventAssignment: true
            }),
            vue({
                target: 'browser',
                preprocessStyles: true
            }),
            postcss(),
            nodeResolve({
                browser: true
            }),
            commonjs()
        ]
    };

    const outputOptions = {
        file: './localization_hub/public/js/dashboard/dashboard.compiled.js',
        format: 'iife',
        name: 'DashboardApp'
    };

    try {
        // Create bundle
        const bundle = await rollup(inputOptions);
        
        // Generate output
        const { output } = await bundle.generate(outputOptions);
        
        // Write to file
        writeFileSync(outputOptions.file, output[0].code);
        
        console.log('✅ Vue dashboard compiled successfully!');
        console.log('📁 Output:', outputOptions.file);
        
        await bundle.close();
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
};

// Run build
build();