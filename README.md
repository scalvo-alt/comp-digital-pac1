## UOC: Grado Multimedia. Composición Digital

Este proyecto responde a la primera práctica de la asignatura
[Composición Digital](http://cv.uoc.edu/tren/trenacc/web/GAT_EXP.PLANDOCENTE?any_academico=20181&cod) en el [Grado Multimedia](http://estudios.uoc.edu/es/grados/multimedia/presentacion?utm_medium=cpc&utm_source=cer_0_googlebrand&utm_campaign=20182_gr_es_mktope_3wpoliedric_producte&utm_content=area_immt_46&utm_term=grado%20multimedia%20uoc&gclid=EAIaIQobChMI5fXA5LSB3gIVR-d3Ch3NHQWDEAAYASAAEgKqRfD_BwE) de la UOC.

En el proyecto hay una serie de scripts jsx (javascript) para el programa After Effects.

El proyecto consta de los siguientes archivos:

```
.Proyecto
├── assets
│   ├── pac1_alt.wav
│   ├── pac1.csv
│   ├── pac1-fix.csv
│   └── pac1.wav
└── scripts
    ├── ease-and-wizz-2.5.3
    ├── ease-and-wizz-helper.jsx
    ├── launch-from-jsx-toolkit.jsx
    ├── layermanager.jsx
    ├── main.jsx
    ├── run-ame.jsx
    └── utils.jsx
```

En la carpeta Assets tenemos los recursos necesarios, pac1.csv y pac1.wav.

- assets/pac1.csv: este archivo nos indica el texto que sale en cada capa y en qué momento.
- assets/pac1.wav: este es el archivo de audio que escribimos en pantalla.
- scripts/ease-and-wizz: Plugin de ease-and-wizz que usamos como extensión de easing.
- scripts/launch-from-jsx-toolkit.jsx: utilidad para lanzar scripts desde ExtendedScript Toolkit.
- scripts/run-ame.jsx: utilidad por si queremos lanzar Adobe Media Encoder.
- scripts/layermanager.jsx: para simplificar el trabajo con capas.
- scripts/util.jsx: funciones de utilidad.
- scripts/main.jsx: este es el script principal que tenemos que ejecutar.

