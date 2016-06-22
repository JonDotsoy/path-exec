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

class PathExec {
	constructor() {
		this.paths = new Set()
	}

	use( path, keys = [], exec = null ) {
		if ( exec == null ) {
			return this.exec( path )
		} else {
			this.paths.add( {
				'regexp': pathToRegexp( path, keys ),
				exec,
			} )
		}
	}

	* filter( pathToEvaluation ) {
		let collectionOut = new Set
		this.paths.forEach( function( pathEvaluation ) {
			let resEvaluation
			if ( resEvaluation = pathEvaluation.regexp.exec( pathToEvaluation ) ) {
				collectionOut.add( {
					evaluation: new Params( resEvaluation, pathEvaluation.regexp.keys ),
					exec: pathEvaluation.exec
				} )
			}
		} )
		yield * collectionOut
	}

	exec( path ) {
		return new Promise( ( resolve, reject ) => {
			let clt = this.filter( path )
			let tasks = []

			while ( true ) {
				let c = clt.next()

				if ( c.done ) {
					break
				} else {
					if ( typeof c.value.exec == "function" ) {
						tasks.push( function( next ) {
							if ( c.value.exec.length >= 2 ) {
								c.value.exec( c.value.evaluation, () => next() )
							} else {
								let b
								try {
									b = c.value.exec( c.value.evaluation )
									if ( b instanceof Promise ) {
										b
											.then( () => next() )
											.catch( err => next( err ) )
									} else {
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

			series( tasks, ( err ) => {
				if ( err ) {
					reject( err )
				} else {
					resolve()
				}
			} )
		} )
	}
}

module.exports = PathExec
