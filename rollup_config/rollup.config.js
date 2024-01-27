
function glsl() {

	const imported=[];

	return {

		transform( code, id ) {
			if ( !/\.glsl$/.test( id ) ) return;

			let transformedCode = '',
				preparedCode = code				
				.replace( /[ \s]*\/\/.*$/gm, '' ) 
				.replace( /[ \t]*\/\*[\s\S]*?\*\//g, '' ) 
				.replace('\t', '')
				.replace(/(?<!#include)\s?([=><,+\-*()])\s?/g, '$1')
				.replace( /\s^$/gm, '' ), // # \n+ to \n
				chunks=code.match(/(?<=#include <).+?(?=>)/g);

			if (/ShaderLib/.test(id)) {
				chunks.forEach(ch=>{
					if (imported.indexOf(ch)+1) return;
					transformedCode+=`export {${ch}} from "../ShaderChunk/${ch}.glsl";\n`
					imported.push(ch);
				})
			}
			return {
				code: transformedCode + `export let ${id.replace(/.*[\/\\]|\..+/g, '')} = \`${preparedCode}\`;`,
				map: { mappings: '' }
			};

		}

	};

}

export default {
	treeshake: {
		preset: 'smallest',
		propertyReadSideEffects: false,
		moduleSideEffects: false
	},
	input: 'three.js',
	plugins: [
		glsl(),
		terser({
			format:{ecma: 2018},
			compress: {ecma: 2018, drop_console: true},
		})
	],
	// sourceMap: true,
	output: [
		{
			format: 'es',
			file: '../three.min.js',
			indent: '\t'
		}
	]
};
