# Cómo se actualiza Economía en las Noticias

El sitio tiene dos archivos:

- `index.html`: el diseño, la biblioteca de diagramas y la lógica. No hace falta tocarlo para agregar noticias.
- `datos.json`: las noticias, los indicadores, los diarios y el tema de la semana. **Solo se edita este archivo.**

## Reglas editoriales

1. Solo noticias económicas de Paraguay (o internacionales con impacto directo en Paraguay) publicadas por diarios: ABC Color, Última Hora, La Nación, 5Días, InfoNegocios, Diario Hoy, La Tribuna, La Prensa, MarketData, o agencias que ellos replican (EFE, Infobae).
2. Cada cifra tiene que estar en el artículo enlazado. Si no se pudo leer el artículo, no se publica la noticia.
3. `resumen` y `contexto` se escriben con palabras propias. No se copian frases del diario (como máximo una cita de menos de 15 palabras, entre comillas).
4. En temas políticos, se dice solo lo que el artículo afirma y se atribuye («según La Nación…»).
5. Las columnas de opinión llevan `"opinion": true` y sus cifras se atribuyen al autor.
6. No se repiten noticias: si el tema ya está, se actualiza la noticia existente (datos, `fecha`, fuente nueva en `mas`) en lugar de duplicarla.
7. Se mantienen como máximo 40 noticias; se borran primero las más antiguas que no sean del tema de la semana.

## Formato de una noticia

```json
{
 "id": "texto-corto-unico",
 "fecha": "2026-11-09",
 "medio": "ABC Color",
 "url": "https://…",
 "mas": [["Última Hora", "https://…", "2026-11-09"]],
 "opinion": false,
 "titulo": "Título propio, claro y corto",
 "unidad": "micro | macro | global",
 "tema": "3.5",
 "kc": "escasez | eleccion | eficiencia | equidad | bienestar | sostenibilidad | cambio | interdependencia | intervencion",
 "resumen": "2-3 frases: qué pasó, con las cifras principales.",
 "contexto": "4-5 frases: por qué importa y cómo se conecta con la economía.",
 "datos": [["5,50 %", "Qué mide esa cifra"]],
 "clave": ["5,50 %", "texto corto bajo la cifra"],
 "fig": { "k": "macro", "mueve": "D", "dir": 1 },
 "cap": "Qué muestra la lámina, con los rótulos del diagrama.",
 "pasos": ["Cadena causal en 4-5 pasos, de la causa al efecto"],
 "conceptos": [["Término", "Definición corta"]],
 "diagramas": ["politica-monetaria", "da-oa-da"],
 "rel": ["id-de-otra-noticia"],
 "pregunta": { "q": "Pregunta", "opts": ["correcta", "incorrecta", "incorrecta", "incorrecta"], "ok": 0, "fb": "Explicación" },
 "evaluacion": {
  "ganan": [["Grupo", "Por qué gana, en una frase"]],
  "pierden": [["Grupo", "Por qué pierde, en una frase"]],
  "corto": "Qué pasa en los próximos meses.",
  "largo": "Qué puede pasar en años.",
  "supuestos": ["De qué depende el análisis"],
  "conclusion": "Juicio equilibrado en 1-2 frases."
 }
}
```

- `mas`, `opinion` y `rel` son opcionales. `evaluacion` es obligatoria en noticias nuevas.
- `evaluacion` es el análisis al estilo IB: 1-3 grupos que ganan y 1-3 que pierden (consumidores, productores, trabajadores, Estado, exportadores, importadores…), efectos a corto y largo plazo, supuestos y una conclusión que pese los argumentos. Debe basarse en lo que dice el artículo y en teoría económica, sin inventar datos.
- `tema`: subtema del programa IB (1.1 a 4.10).
- Números en formato paraguayo: coma decimal y punto de miles (`G. 6.480`, `1,7 %`).

### Láminas (`fig`)

| `k` | Uso | Campos extra |
|---|---|---|
| `mercado` | Oferta y demanda de un producto | `mueve`: `"D"` u `"O"`; `dir`: `1` derecha, `-1` izquierda |
| `macro` | DA y OACP | igual que `mercado` (`"D"` = DA, `"O"` = OACP) |
| `divisas` | Mercado del guaraní | igual (`"D"` demanda de guaraníes, `"O"` oferta) |
| `arancel` | Arancel o su eliminación | — |
| `exportaciones` | Libre comercio con exportaciones | — |
| `minimo` | Salario mínimo / precio mínimo | — |
| `ingreso` | EPD e ingreso total | — |
| `lorenz` | Curva de Lorenz | — |
| `barras` | Datos de la noticia | `u`: unidad; `rows`: `[["Etiqueta", 4.1, 1]]` (el `1` resalta la barra) |

### Diagramas de la biblioteca (`diagramas`)

`oferta-demanda`, `ped-ingreso`, `salario-minimo`, `da-oa-da`, `da-oa-oacp`, `politica-monetaria`, `politica-fiscal`, `tipo-cambio`, `exportaciones`, `arancel`, `lorenz`. Otros nombres se ignoran.

## Indicadores, historial, región y semanas

- `indicadores`: lista de `{"n": "Dólar", "v": "G. 6.508", "s": "DNIT · 6 nov", "alert": 1, "k": "dolar"}`.
  - `alert` (opcional) pinta el número en rojo cuando hay un movimiento fuerte.
  - `k` (opcional) enlaza con una serie de `historial` y dibuja el minigráfico.
- `historial`: series para la sección **Indicadores**. Claves actuales: `imaep`, `desempleo`, `inflacion`, `tpm`, `credito`, `dolar`, `exportaciones`, `recaudacion`, `embi`.
  - Cada serie tiene `t` (título), `u` (unidad: `%`, `G.`, `US$ M` o `pb`), `grupo` (`Actividad y empleo`, `Precios y dinero`, `Sector externo` o `Finanzas públicas`), `fuente`, `lee` (una frase de lectura) y `puntos`: `[["AAAA-MM-DD", valor]]`, en orden de fecha.
  - Opcionales: `banda` `[min, max]` y `meta` (para la inflación), `escalon: 1` (para la tasa del BCP), `col: 1` (se dibuja en barras: IMAEP, exportaciones, recaudación).
  - Qué se registra en cada serie:
    - `imaep`: variación interanual del mes (%), con fecha del último día del mes medido.
    - `credito`: variación interanual del crédito al sector privado (%).
    - `exportaciones`: exportaciones registradas acumuladas en el año (US$ millones). En enero empieza de nuevo: en ese caso se cambia el título con el año.
    - `recaudacion`: variación interanual de la recaudación mensual de la DNIT (%).
  - **Cuando un dato nuevo se confirma en un artículo, se agrega un punto al final.** No se borran puntos viejos. El dólar se registra como máximo una vez por día.
- `region`: datos de **Paraguay frente a la región**.
  - `paises`: lista de países. `indicadores`: lista de `{"k", "t", "u", "fuente", "url" (opcional), "nota" (opcional), "v": {"País": valor}}`. Un país sin dato confiable simplemente no aparece en `v`.
  - `lecturas`: 3-5 frases que interpretan la comparación. `actualizado`: fecha.
  - Solo se cambia un valor cuando sale un dato oficial nuevo (banco central, instituto de estadística, CEPAL), con su fecha en `fuente`.
- `semanas`: resumen editorial por semana, con la fecha del **lunes** como clave: `{"2026-11-09": {"titulo", "texto", "claves": ["id1", "id2", "id3", "id4", "id5"]}}`.
  - Se escribe el **lunes** (o el primer día de la semana con noticias) y se completa durante la semana.
  - `claves` son las 5 noticias más importantes de esa semana.
- `instituciones`: la sección **BCP y MEF**, con las claves `bcp` y `mef`.
  - `autoridades`: lista de `{"cargo", "nombre", "estado", "desde" (AAAA-MM-DD o AAAA-MM), "fuente", "url", "nota"}`. El primero es el que aparece en la portada de la sección. `estado` puede ser «En el cargo», «Falta decreto y juramento», «En el cargo hasta que asuma el titular», etc.
  - **Cuando una noticia confirma un cambio de autoridades** (nombramiento, acuerdo del Senado, decreto, juramento, renuncia), se actualiza la lista y su `estado`, y se suma el hecho a `eventos`. Quien deja el cargo se quita de `autoridades` y se menciona en `autoridades_nota`.
  - `eventos`: `[["AAAA-MM-DD", "Qué decidió o qué pasó"]]` en orden de fecha (decisiones de tasa, emisiones de deuda, Presupuesto, cambios de autoridades).
  - `agenda`: próximas fechas confirmadas (por ejemplo, la próxima reunión del Comité de Política Monetaria). Se borran las que ya pasaron.
  - `cifras`: claves de `historial` que se muestran; `fijas`: cifras sin serie (`[["valor", "qué es"]]`).
  - En cada noticia, el campo opcional `inst` (`["bcp"]`, `["mef"]` o ambos) la muestra en la página de esa institución.
- `destacado`: el tema económico dominante, con `eyebrow`, `titulo`, `dek`, `tl` (línea de tiempo: `[["5 nov", "Qué pasó", "id-noticia"]]`) y `lentes` (`[["clave-de-diagrama", "cómo lo explica"]]`).
- `actualizado`: fecha de la última actualización (`AAAA-MM-DD`).

## Archivos del sitio

- `index.html`: la página. `sw.js` y `manifest.webmanifest`: la app instalable. `iconos/`: íconos de la app.
- Si se cambia `index.html` o `sw.js`, hay que subir el número de `VERSION` en `sw.js` (por ejemplo `enp-v3`) para que los celulares descarguen la versión nueva.

## Antes de publicar

```bash
python3 -m json.tool datos.json > /dev/null && echo "JSON válido"
```
