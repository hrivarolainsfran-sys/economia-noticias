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
7. En `datos.json` se mantienen como máximo 60 noticias. Las que sobran **no se borran: se mueven a `archivo.json`** (una lista JSON de noticias con el mismo formato), empezando por las más antiguas que no estén en `destacado` ni en las `claves` de una semana. El archivo nunca se vacía y no repite ids que sigan en `datos.json`.

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

- `mundo` (opcional): países o mercados externos que explican la noticia (`petroleo`, `brasil`, `argentina`, `china`, `eeuu`, `espana`); la muestra en **El mundo y Paraguay**.
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
| `externalidad` | Externalidad negativa (contaminación, desmonte) | `t`: impuesto pigouviano 0-40 (0 = sin impuesto) |
| `monopolio` | Monopolio y regulación (ANDE, ESSAP, telefonía) | `cap`: precio máximo 90-150 (opcional) |
| `oalp` | Políticas de oferta: OALP a la derecha | `s`: tamaño del desplazamiento 0-50 (por defecto 40) |
| `barras` | Datos de la noticia | `u`: unidad; `rows`: `[["Etiqueta", 4.1, 1]]` (el `1` resalta la barra) |

### Diagramas de la biblioteca (`diagramas`)

`oferta-demanda`, `ped-ingreso`, `salario-minimo`, `da-oa-da`, `da-oa-oacp`, `politica-monetaria`, `politica-fiscal`, `bonos`, `tipo-cambio`, `exportaciones`, `arancel`, `lorenz`, `externalidad`, `monopolio`, `politicas-oferta`. Otros nombres se ignoran.

La lámina `{"k": "bono", "r": 14}` dibuja el precio de un bono según la tasa de interés `r` (entre 2 y 16).

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
- `bolsa`: la sección **Bolsa** (Bolsa de Valores de Asunción).
  - `cifras`: `[["valor", "qué es y de qué periodo"]]`. Se actualizan cada mes cuando la BVA publica el volumen negociado (suele salir en los diarios los primeros días del mes siguiente). Poner `actualizado` con la fecha del artículo.
  - `graficos`: lista de `{"t", "u", "rows": [["Etiqueta", valor, 1]], "cap"}`. Actualizar el volumen negociado acumulado y la composición por instrumento, moneda y mercado cuando haya datos nuevos; `graficos_fuente` con los medios y fechas.
  - `eventos`: hechos clave del mercado (nuevas emisiones grandes, suspensiones, nuevas normas, récords). Fecha `AAAA-MM-DD`, `AAAA-MM` o `AAAA`.
  - `instrumentos`, `actores`, `regulacion`, `ib`, `enlaces`: contenido explicativo; solo se cambia si cambia la regulación.
  - Las noticias del mercado de valores llevan `"inst": ["bolsa"]` (pueden combinarse, por ejemplo `["bcp", "bolsa"]`). El diagrama `bonos` sirve para noticias sobre bonos y tasas de interés.
- `instituciones` incluye también `dnit`, `ine` e `ips` (además de `bcp` y `mef`), con el mismo formato y un campo `area` («Impuestos y aduanas», «Estadísticas oficiales», «Seguridad social»…). Las noticias se marcan con `inst` (`["dnit"]`, `["ine"]`, `["ips"]`).
- `historias`: la sección **Historias**. Lista de `{"id", "titulo", "estado" ("En curso", "En el Congreso", "Cerrada"…), "dek", "serie" (opcional: clave de `historial` para mostrar un gráfico), "aprender": [frases], "noticias": [ids], "hitos": [["AAAA-MM-DD", "qué pasó", "id-noticia opcional"]]}`.
  - **Cada noticia nueva que continúe una historia se agrega a su `noticias` y como `hito`.** Los hitos futuros (fechas confirmadas) se pueden cargar y se muestran como «Próximo».
  - Cuando surge un tema que va a durar varias semanas, se crea una historia nueva. Cuando un tema termina, `estado` pasa a «Cerrada».
- `pais`: la página **Paraguay en datos**. `secciones` (`{"t", "items": [["valor", "qué es", "fuente y fecha"]]}`), `graficos` y `nota`. Se actualiza solo cuando sale un dato oficial nuevo (población, crecimiento, deuda, reservas, exportaciones anuales), con su fuente.
- `desarrollo`: la página **Desarrollo** (temas 2.8, 3.4, 4.7-4.10). `intro`; `bloques` (`{"t", "tema", "items": [["valor", "qué es", "fuente y fecha"]], "url"}`); `graficos` (`{"t", "u", "rows", "cap"}`); `ods` (`[["número", "nombre", "dato con fuente", "estado"]]`, con estado «mejora», «mejora leve», «empeora», «desafío» o «sin dato»); `nota`. Se actualiza cuando salen el IDH del PNUD, la pobreza y el Gini del INE (EPHC), PISA, datos de bosques del INFONA o informes de ODS.
- `mundo`: la página **El mundo y Paraguay**. `intro`, `actualizado`, `actores` (`{"id", "t", "sub", "por", "datos": [["valor", "qué es"]], "canal": ["paso de la cadena de transmisión"], "mirar", "diagrama"}`) para `petroleo`, `brasil`, `argentina`, `china`, `eeuu` y `espana`, y `graficos` (barras). Actualizar los `datos` cuando un artículo confirme una cifra nueva (precio del petróleo, tasa Selic, tasa de la Fed, inflación argentina, precio de la soja, remesas), con su fuente. Las decisiones futuras de bancos centrales van a `calendario.fechas` con `"tipo": "Región"`.
- `mapa`: la página **Mapa por departamentos**. `nota`; `capas` (`{"id", "t", "u", "fuente", "url", "v": {"Departamento": valor}}`) y `notas_dep` (`{"Departamento": "texto corto"}`). Los nombres de los departamentos deben ser exactamente: Alto Paraguay, Concepción, Amambay, Boquerón, Presidente Hayes, San Pedro, Canindeyú, Asunción, Cordillera, Caaguazú, Alto Paraná, Central, Paraguarí, Guairá, Ñeembucú, Misiones, Caazapá, Itapúa. Un departamento sin dato se omite (el mapa lo muestra punteado). **Solo cifras oficiales** (INE, INFONA, CEMAQ, MAG) con su año; no hay desempleo por departamento publicado y la EPHC no cubre Boquerón ni Alto Paraguay.
- `metas`: el **Semáforo de metas**. `intro`, `nota` e `items` (`{"id", "t", "u", "dec", "meta", "oficial", "tema", "link", "por", "fuente", "fecha", "extra"}`). Cada ítem usa `serie` (clave de `historial`: se actualiza solo) o un valor fijo `v` (actualizarlo con su `fecha` y `fuente` cuando salga un dato nuevo), o `txt` con `estado` fijo. La regla de color es `rango` + `amarillo` ([mín, máx]), `max` ([límite verde, límite amarillo], menor es mejor) o `min` (mayor es mejor). Actualizar `deficit` con cada informe del MEF y `deuda` y `calificacion` cuando cambien.
- `cronologia`: la **Historia económica**. `hitos`: `{"f": "AAAA" | "AAAA-MM" | "AAAA-MM-DD", "t", "d", "tema", "ib", "fuente", "url", "link": ["#ruta", "texto"]}`. Solo hechos con fecha confirmada en una fuente. Agregar un hito cuando ocurra un hecho histórico (una ley económica importante, un cambio de calificación, una crisis).
- `itaipu`: **Itaipú a fondo**. `cifras`, `partes` (`{"t", "tema", "texto", "fuentes": [["medio (fecha)", "url"]]}`), `graficos`, `posiciones` (`paraguay`, `brasil`, `fuentes`), `ib`, `preguntas`, `noticias` (ids). Actualizar cuando haya novedades del Anexo C, una tarifa nueva, el informe anual o las transferencias al Estado; agregar las noticias nuevas sobre Itaipú a `noticias`.
- `miradas`: **Dos miradas**. Lista de `{"id", "t", "pregunta", "tema", "diagrama", "noticia", "contexto", "lados": [{"t", "args": [["quién (nombre y cargo)", "argumento con palabras propias", "medio", "url", "AAAA-MM-DD"]]}], "decision", "evaluar": [preguntas]}`. **Solo opiniones publicadas en un diario, atribuidas a una persona o institución con nombre**; nunca inventar posiciones. Agregar un debate nuevo cuando un tema polémico tenga argumentos de los dos lados en la prensa, y actualizar `decision` cuando se resuelva.
- `trabajo`: **Trabajo e informalidad**. `cifras`, `definicion`, `graficos`, `fuentes`, `ib`, `preguntas`. Actualizar con cada encuesta trimestral del INE (informalidad, desempleo), el reajuste del salario mínimo y los datos de brecha de género.
- `empresas`: **Casos de empresas**. Lista de `{"id", "t", "sub", "tema", "diagrama", "cifras": [["valor", "qué es"]], "cifras_nota", "texto", "preguntas", "fuentes", "link"}`. Actualizar las cifras cuando un artículo publique datos nuevos (participación de mercado, exportaciones de maquila, investigaciones de la Conacom), indicando el periodo.
- `cooperativas`: la página **Cooperativas**. `intro`, `cifras`, `comparacion` (`[["pregunta", "banco", "cooperativa"]]`), `comparacion_fuentes`, `partes`, `graficos`, `ib`, `preguntas`. Actualizar con los datos del Incoop (socios, ahorros, créditos), las intervenciones de cooperativas y el proyecto de fondo de garantía.
- `comercio`: **¿Con quién comercia Paraguay?** `paises` (`{"País": [longitud, latitud]}`; para agregar un país hay que agregar sus coordenadas), `exportaciones` e `importaciones` (`[["País", US$ millones, "variación"]]`), `periodo`, `fuente`, `cifras`, `lecturas`, `nota`, `ib`, `fuentes`. Actualizar cuando el BCP publique el comercio por país (y cambiar `periodo`).
- `finanzas`: tasas de referencia de las calculadoras de **Finanzas personales**: `tasas` = `[["clave", valor, "qué es", "fuente", "url"]]` con las claves `pasiva_g`, `pasiva_us`, `activa_g` y `tarjeta`. Actualizar con el informe mensual de indicadores financieros del BCP.
- `quien`: **Quién es quién**. `personas` (`{"n", "cargo", "tipo", "que", "estado", "link", "fuente", "url"}`) e `instituciones` (`[["sigla", "nombre", "tipo", "qué hace", "#ruta"]]`). Cuando cambie una autoridad en `instituciones`, cambiarla también aquí. Agregar a las personas que opinen en `miradas`. Solo cargos confirmados en un artículo.
- `historial.*.eventos`: hechos marcados en los gráficos de **Indicadores**: `[["AAAA-MM-DD", "qué pasó", "id-noticia"]]`. Agregar un evento cuando una noticia explique un movimiento fuerte de la serie (una decisión del BCP, una crisis, un shock). Solo se dibujan los que caen dentro del periodo de la serie.
- La portada muestra sola la **Pregunta del día** (rota entre las `pregunta` de las noticias) y **Un día como hoy** (usa los `hitos` de `cronologia` con fecha completa), así que conviene que cada noticia tenga su pregunta y que los hitos nuevos tengan día exacto.
- `calendario`: la sección **Calendario**.
  - `fechas`: lista de `{"f": "AAAA-MM-DD", "t": "título", "d": "por qué importa", "tipo": "BCP | MEF | Congreso | Región | Energía | Datos | Bolsa", "tema": "3.5", "url", "fuente"}`. **Solo fechas confirmadas en un artículo o fuente oficial.**
  - Agregar cada fecha nueva que aparezca en las noticias (reuniones del BCP, plazos del Congreso, publicación de datos con fecha anunciada, decisiones de bancos centrales vecinos, vencimientos). Las fechas pasadas pueden quedar: la página las muestra como «ya pasaron». Borrar las que tengan más de 60 días.
  - `habituales`: `[["cuándo", "qué se publica", "tema"]]`; solo se cambia si cambia la costumbre.
  - Mantener coherentes `calendario.fechas` y la `agenda` de `instituciones`.
- `sectores`: la sección **Sectores** con las claves `agro`, `energia`, `industria`, `comercio`.
  - Cada sector tiene `cifras`, `graficos` (`{"t", "u", "rows", "cap"}`), `fuente`, `actores`, `riesgos`, `ib` y `diagramas`; `comercio` usa además `"serie": "exportaciones"` para mostrar el gráfico del historial.
  - Cuando salga un dato nuevo confirmado del sector (exportaciones de soja o carne, maquila, energía, comercio exterior), actualizar la cifra o el gráfico y su `fuente` con medio y fecha.
  - En cada noticia, el campo opcional `sector` (`["agro"]`, `["energia"]`, `["industria"]`, `["comercio"]` o varios) la muestra en la página del sector.
- `destacado`: el tema económico dominante, con `eyebrow`, `titulo`, `dek`, `tl` (línea de tiempo: `[["5 nov", "Qué pasó", "id-noticia"]]`) y `lentes` (`[["clave-de-diagrama", "cómo lo explica"]]`).
- `actualizado`: fecha de la última actualización (`AAAA-MM-DD`).

## Archivos del sitio

- `index.html`: la página. `sw.js` y `manifest.webmanifest`: la app instalable. `iconos/`: íconos de la app.
- Si se cambia `index.html` o `sw.js`, hay que subir el número de `VERSION` en `sw.js` (por ejemplo `enp-v3`) para que los celulares descarguen la versión nueva.

## Antes de publicar

```bash
python3 -m json.tool datos.json > /dev/null && echo "JSON válido"
```
