# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.
El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el proyecto sigue [SemVer](https://semver.org/lang/es/).

## [Unreleased]

## [0.1.0]

### Added

- Regla `testy/prefer-is-empty`: convierte `assert.that(x).isEqualTo([])` en `assert.that(x).isEmpty()` (y `isNotEqualTo([])` en `isNotEmpty()`), con autofix. También detecta strings vacíos (`''`, `""`, ``` `` ```), `new Set()` y `new Map()`.
- Configuración `recommended` (flat config).
