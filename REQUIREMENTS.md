# N8n Node Requirements

Guía de referencia para mantener y profesionalizar el nodo `n8n-nodes-rckflr-centroid`. Se agrupan consideraciones de repositorio, documentación, código, automatización y publicación.

## 1. Requerimientos Generales

- Depurar el repositorio y eliminar archivos que no aporten al nodo.
- Configurar `.gitignore` para excluir artefactos comunes (`node_modules`, `dist`, paquetes `.tgz`, etc.).
- Asegurar que `package.json` contenga nombre, descripción, autor, licencia, palabras clave, `repository`, `bugs` y `homepage`.
- Seguir versionado semántico (`MAJOR.MINOR.PATCH`) y generar *tags* y *releases* en GitHub.
- Mantener un `CHANGELOG.md` actualizado por versión.
- Garantizar compatibilidad con `n8n >= 1.40.0` y Node.js LTS (20.x).
- Ejecutar auditorías de dependencias (`npm audit`/`pnpm audit`) y actualizar con regularidad.

## 2. Documentación

- **README.md**
  - Incluir descripción del nodo y su finalidad.
  - Añadir ejemplo práctico (flujo JSON exportado o captura de pantalla de n8n).
  - Documentar entradas, salidas y manejo de errores habituales.
  - Agregar _badges_ de estado (versión npm, CI, cobertura, licencia).
- **Archivos complementarios**
  - `LICENSE` con la licencia elegida (MIT o Apache 2.0).
  - `CONTRIBUTING.md` con pautas para colaborar.
  - `CODE_OF_CONDUCT.md` alineado a la comunidad objetivo.
  - `SECURITY.md` (opcional) detallando el canal para reportar vulnerabilidades.

## 3. Código y Estructura Técnica

- Respetar la convención de `n8n-nodes-base`: nodos en `/nodes`, credenciales en `/credentials`, con exportaciones correctas de `nodeType` y `nodeDescription`.
- Validar parámetros de entrada antes de procesar datos.
- Utilizar `NodeOperationError` o `NodeApiError` para reportar fallos controlados.
- Encapsular interacciones externas en bloques `try/catch`.
- Proporcionar mensajes de error claros, orientados al usuario de n8n.
- Implementar pruebas unitarias e integrales (framework sugerido: Jest o Mocha+Chai) con cobertura mínima del 80%, incluyendo casos límite y entradas inválidas.

## 4. Calidad y Automatización

- **Linting y formato**
  - Configurar ESLint y Prettier con reglas compartidas.
  - Definir scripts en `package.json`:
    ```json
    {
      "scripts": {
        "lint": "eslint src --ext .ts",
        "format": "prettier --write ."
      }
    }
    ```
- **Integración continua (CI/CD)**
  - Añadir `.github/workflows/ci.yml` que instale dependencias y ejecute `lint`, `build` y `test`.
  - (Opcional) Automatizar publicación a npm tras pases en main.
- **Build**
  - Compilar con `tsc` o `rollup` y exportar artefactos en `/dist`.
  - Declarar en `package.json`:
    ```json
    {
      "files": ["dist", "nodes", "credentials"]
    }
    ```

## 5. Publicación en npm

- Validar empaquetado con `npm pack`.
- Probar instalación local con `npm install -g ./package.tgz`.
- Publicar con:
  ```bash
  npm publish --access public
  ```
- Sincronizar versión de `package.json` con el `CHANGELOG.md`.
- Mantener completos los metadatos de npm (`repository`, `bugs`, `homepage`, `keywords`).

## 6. Mejoras Opcionales

- Crear `/examples` con flujos JSON de demostración.
- Añadir `docker-compose.yml` para levantar entornos de prueba locales.
- Configurar Dependabot o Renovate para gestión de dependencias.
- Integrar CodeClimate o SonarCloud para métricas de calidad y deuda técnica.

---

📦 **Objetivo final:** entregar un nodo con estructura profesional, documentación clara, automatizaciones activas y listo para publicarse en npm de forma confiable.
