# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.1.3] ― 2016-07-01
### Added
- Custom parameters: `paths.exec('/one/path', param1, param2, ...params)` ← `paths.use('/one/path', [], (param1, param2, ...params, done) => done())`

## [0.1.2] ― 2016-06-24
### Changed
 - Enable multiple Executions (`paths.use( path, [...keyNames], ...execs )`)

### Added
 - Test

## [0.1.1] ― 2016-06-22
### Fixed
 - Remove inline test actions

## 0.1.0 ― 2016-06-22
### Added
 - Class `PathExec` with `require('path-exec')`
 - Class `Params`
 - Matched control to paths 
 - `path.use` function
 - `path.exec` function

[Unreleased]: https://github.com/JonDotsoy/path-exec/compare/v0.1.2...develop
[0.1.2]: https://github.com/JonDotsoy/path-exec/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/JonDotsoy/path-exec/compare/v0.1.0...v0.1.1
