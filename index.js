const pathToRegexp = require( "path-to-regexp" )
const series = require( "async/series" )

class Params {
	constructor( outRegx, names ) {
		for ( let indexName in names ) {
			let name = names[ indexName ]
			if ( typeof name === 'string' ) {
				this[ name ] = outRegx[ ( Number( indexName ) + 1 ) ]
			}
		}
	}
}

/**
 * Name associated with associated paths in the Path class Exec.
 * 
 * @type {Symbol}
 */
const pathNameSymbol = Symbol( 'paths' )

class PathExec {
	constructor() {
		this[ pathNameSymbol ] = new Set()
	}

	/**
	 * Define un uso para el path definido.
	 * 
	 * @param  {String|RegExp} path     Path used to find and run the executions
	 *                                  defined.
	 * @param  {Array}         [keys]   Keywords to rename the parameters found.
	 * @param  {Function}      [exec]   Execution load to find matches in
	 *                                  `Path.exec()`.
	 */
	use( path, keys = [], ...execs ) {
		this[ pathNameSymbol ].add( {
			'regexp': pathToRegexp( path, keys ),
			execs,
		} )

		return this
	}

	/**
	 * Filter paths with executions defined
	 *
	 * @param {String} pathToEvaluation Value is evaluatio if is ready to executed.
	 */
	* filter( pathToEvaluation ) {
		let collectionOut = new Set
		this[ pathNameSymbol ].forEach( function( pathEvaluation ) {
			let resEvaluation
			if ( resEvaluation = pathEvaluation.regexp.exec( pathToEvaluation ) ) {
				let params = new Params( resEvaluation, pathEvaluation.regexp.keys )
				for ( const exec of pathEvaluation.execs ) {
					collectionOut.add( {
						evaluation: params,
						exec,
					} )
				}
			}
		} )
		yield * collectionOut
	}

	/**
	 * Find the rules associated to execute defined Executions.
	 * 
	 * @param  {String} path
	 * @return {Promise}
	 */
	exec( path, ...customParams ) {
		return new Promise( ( resolve, reject ) => {
			let clt = this.filter( path )
			let tasks = new Set()

			while ( true ) {
				let c = clt.next()

				if ( c.done ) {
					break
				} else {
					if ( typeof c.value.exec == "function" ) {
						tasks.add( function( next ) {
							if ( c.value.exec.length >= (customParams.length + 2) ) {
								// With Callback defined
								c.value.exec( c.value.evaluation, ...customParams, () => next() )
							} else {
								let b
								try {
									// Run execution.
									b = c.value.exec( c.value.evaluation, ...customParams )
									if ( b instanceof Promise ) {
										// With Promise return
										b
											.then( () => next() )
											.catch( err => next( err ) )
									} else {
										// Is a sync execution
										next()
									}
								} catch ( ex ) {
									next( ex )
								}
							}
						} )
					} else {

					}
				}
			}

			series( [ ...tasks ], ( err ) => {
				if ( err ) {
					reject( err )
				} else {
					resolve()
				}
			} )
		} )
	}
}

PathExec.Params = Params

module.exports = PathExec
