module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        'node': true
    },
    'extends': 'airbnb',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
		"indent": [2, "tab", { "SwitchCase": 1, "VariableDeclarator": 1 }],
        "no-tabs": 0,
        "react/prop-types": 0,
        "react/jsx-indent": [2, "tab"],
		"react/jsx-indent-props": [2, "tab"],
		"linebreak-style": [
			"error",
			"unix"
		],
		"semi": [
			"error",
			"never"
		],
		"eqeqeq": "warn",
		"no-console": 0,
		"no-underscore-dangle": 0,
		"no-param-reassign": 0,
		
    }
};