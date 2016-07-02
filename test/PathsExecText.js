const expect = require( 'expect.js' )
const PathsExec = require( '..' )

let paths = new PathsExec()

describe( 'PathsExec', function() {
	let countME = 0

	describe( 'define uses', function() {

		it( 'one Execution with /one/:number', () => {
			paths.use( '/one/:number', [ 'number' ], function( params ) {
				expect( params.number ).not.to.be( undefined )
				expect( params.number ).to.be( '32' )
			} )
		} )

		it( 'multiple Executions with /two/:number', () => {
			paths.use( '/two/:number', [ 'number' ], function( params ) {
				expect( params.number ).not.to.be( undefined )
				expect( params.number ).to.be( '12' )
				countME = countME + 1
			}, function( params ) {
				countME = countME + 1
			} )
		} )

	} )

	describe( 'Executes', function() {

		it( '/one/32', function( next ) {
			paths.exec( '/one/32' )
				.then( () => {
					next()
				} )
				.catch( ( err ) => {
					next( err )
				} )
		} )

		it( '/two/12', ( next ) => {
			paths.exec( '/two/12' )
				.then( () => {
					expect( countME ).to.be( 2 )
					next()
				} )
				.catch( err => {
					next( err )
				} )
		} )

	} )

	describe( 'Custom parameters', function () {
		let paths

		before(function () {
			paths = new PathsExec()
		})

		describe('use one paremeter', function () {
			before(function () {
				paths.use('one/custom/parameter', function (params, one, done) {
					expect(one).to.be(3)
					done()
				})
			})
			it('run one parameter', function (done) {
				paths.exec('one/custom/parameter', 3)
				.then(() => done())
				.catch(err => done(err))
			})
		})

		describe('use two parameters', function () {
			before(function () {
				paths.use('two/custom/parameters', function (params, one, two, done) {
					expect(one).to.be(5)
					expect(two).to.be(9)
					done()
				})
			})
			it('run two parameters', function (done) {
				paths.exec('two/custom/parameters', 5, 9)
				.then(() => done())
				.catch(err => done(err))
			})
		})

	} )

} )
