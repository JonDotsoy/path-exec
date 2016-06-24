const PathsExec = require( '..' )

let paths = new PathsExec()


paths.use( '/:name', [], function( params, next ) {
	console.log( params instanceof PathsExec.Params )
	next()
}, function( params, next ) {
	console.log( 'hola' )
	next()
} )


paths
	.exec( '/quehay' )
	.then( () => {
		console.log( 'next load' )
	} )
