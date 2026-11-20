# testy/prefer-is-empty

Prefiere `isEmpty()` y `isNotEmpty()` sobre comparar contra un valor vacío (array, string, `Set` o `Map`) con `isEqualTo` / `isNotEqualTo`.

🔧 Esta regla es arreglable automáticamente con `eslint --fix`.

## Motivación

`isEmpty()` expresa la intención directamente, y el mensaje de falla de Testy es más claro que el de una comparación de igualdad contra un valor vacío.

## Valores reconocidos

| Valor vacío                         | Ejemplo                                 |
| ----------------------------------- | --------------------------------------- |
| Array                               | `[]`                                    |
| String                              | `''`, `""` y ``` `` ``` (sin interpolaciones) |
| `Set`                               | `new Set()`                             |
| `Map`                               | `new Map()`                             |

## Ejemplos

Código **incorrecto**:

```js
assert.that(resultados).isEqualTo([]);
assert.that(resultados).isNotEqualTo([]);
assert.that(nombre).isEqualTo('');
assert.that(ids).isEqualTo(new Set());
assert.that(indice).isNotEqualTo(new Map());
```

Código **correcto**:

```js
assert.that(resultados).isEmpty();
assert.that(resultados).isNotEmpty();
assert.that(nombre).isEmpty();
assert.that(ids).isEmpty();
assert.that(indice).isNotEmpty();

// No se reporta: la colección tiene contenido
assert.that(ids).isEqualTo(new Set([1, 2]));

// No se reporta: hay un criterio de igualdad propio, no es equivalente a isEmpty()
assert.that(resultados).isEqualTo([], miCriterio);
```

## Notas

- Solo se reconoce la forma `assert.that(...)`.
- Si hay comentarios entre el nombre del método y el cierre de la llamada, la regla reporta pero no aplica el arreglo automático, para no perder el comentario.
- `isEmpty()` acepta arrays, strings, `Set` y `Map` indistintamente, mientras que `isEqualTo([])` solo pasa con arrays vacíos (y análogamente para el resto). Si el valor evaluado no es del mismo tipo que el vacío con el que se compara, el test ya fallaba antes; revisá el cambio antes de aplicarlo.
- Solo se reconocen `new Set()` y `new Map()` sin argumentos (con o sin paréntesis). `new Set([])` o `new Map(entries)` no se reportan.

## Cuándo no usarla

Si preferís la forma explícita `isEqualTo([])` (o `isEqualTo('')`, etc.) por consistencia con otras comparaciones de tu suite.
