import os
import pathlib
from newsroom.web.default_settings import CORE_APPS, AUTH_PROVIDERS, lazy_gettext, AuthProviderType

SUPERDESK_TESTING = True
SERVER_PATH = pathlib.Path(__file__).resolve().parent
CLIENT_PATH = SERVER_PATH.parent

WEBPACK_SERVER_URL = "http://localhost:8080"
WEBPACK_ASSETS_URL = "http://localhost:8080"
WEBPACK_MANIFEST_PATH = os.environ.get("WEBPACK_MANIFEST_PATH", CLIENT_PATH.joinpath("dist", "manifest.json"))
WEBPACK_IGNORE_SERVER = True

CORE_APPS.extend(["newsroom_e2e"])

DEFAULT_ALLOW_COMPANIES_TO_MANAGE_PRODUCTS = True

AUTH_PROVIDERS.append(
    {
        "_id": "azure",
        "name": lazy_gettext("Azure"),
        "auth_type": AuthProviderType.SAML,
    }
)
