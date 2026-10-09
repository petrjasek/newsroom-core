# Terminal 1 - starting the client:
```
cd e2e

npm install
npm run start
```
# Terminal 2 - starting the e2e backend:
```
cd ~/newsroom-core

python3 -m venv env
source env/bin/activate
pip install --upgrade pip wheel setuptools
pip install -e .
cd e2e/server
honcho start -p 5050
```

# Terminal 3 - running the tests:
```
cd e2e
```
```
npm run cypress-ui
```
`or if you want to focus a specific test run the following command:`
```
npm run cypress-ci
```

**Note: You need to start the client before the backend**

## Running the backend with Docker Compose

Build the client and start the backend from the `e2e` directory:

```sh
npm install --prefix ..
npm install
npm run build
docker compose up --build server
```

The build uses loaders from the repository root, so both sets of dependencies
must be up to date. A successful build must finish before starting the backend;
a failed build can leave a manifest pointing to missing bundles. On
memory-constrained machines, use `npm run build -- --no-optimization-minimize`
to build without minification.

Compose mounts `dist` read-only, and the backend serves the built UI at
`http://localhost:5050/static/dist/`. No separate UI server on port 8080 is
needed. Run `npm run build` again after client changes. For local development
without Docker, `npm run start` still serves the UI on port 8080.

The server uses `server/manage.py` for startup initialization. Rebuild the image
after changing server files; restarting an existing container does not apply
image changes.

The image installs dependencies first, then copies and installs the application
source so editable package discovery includes `newsroom`.
