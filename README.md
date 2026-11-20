# @ngarbezza/eslint-plugin-testy

Reglas de ESLint para tests escritos con [Testy](https://github.com/ngarbezza/testy) (`@pmoo/testy`).

## Instalación

```bash
npm install --save-dev eslint @ngarbezza/eslint-plugin-testy
```

Requiere ESLint 9 o superior (flat config) y Node.js `^22.13.0 || >=24`.

## Uso

En tu `eslint.config.js`:

```js
import testy from '@ngarbezza/eslint-plugin-testy';

export default [
  // Configuración recomendada, para aplicar a tus archivos de test
  {
    files: ['tests/**/*.js'],
    ...testy.configs.recommended,
  },
];
```

O activando las reglas de a una:

```js
import testy from '@ngarbezza/eslint-plugin-testy';

export default [
  {
    files: ['tests/**/*.js'],
    plugins: { testy },
    rules: {
      'testy/prefer-is-empty': 'error',
    },
  },
];
```

## Reglas

🔧 = arreglable automáticamente con `eslint --fix`.
✅ = incluida en `configs.recommended`.

| Regla                                              | Descripción                                                          | ✅ | 🔧 |
| -------------------------------------------------- | -------------------------------------------------------------------- | -- | -- |
| [prefer-is-empty](docs/rules/prefer-is-empty.md)   | Prefiere `isEmpty()` / `isNotEmpty()` sobre `isEqualTo([])`, `''`, `new Set()` o `new Map()` | ✅ | 🔧 |

## Desarrollo

```bash
npm install
npm test        # tests con Testy (usa ESLint Linter para probar la regla)
npm run lint
```

### Agregar una regla

1. Crear `lib/rules/<nombre>.js` y su test en `tests/rules/<nombre>_test.js` (ver `tests/support/rule_harness.js`).
2. Registrarla en `lib/index.js` (y en `configs.recommended` si corresponde).
3. Documentarla en `docs/rules/<nombre>.md` y agregarla a la tabla de arriba.
4. Anotarla en el `CHANGELOG.md`.

### Publicar

```bash
npm version <patch|minor|major>   # actualiza package.json y crea el tag
git push --follow-tags
```

Al crear un release en GitHub, el workflow `publish.yml` deja el paquete en *staging* en npm con
provenance (`npm stage publish`, requiere el secret `NPM_TOKEN`). La versión no queda pública hasta
que un maintainer la aprueba con 2FA:

```bash
npm stage list @ngarbezza/eslint-plugin-testy
npm stage approve <stage-id>
```

También se puede publicar a mano con `npm publish`; `prepublishOnly` corre lint y tests antes.

## Licencia

MIT
